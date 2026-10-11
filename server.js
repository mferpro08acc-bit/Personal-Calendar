const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const SITE_DIR = __dirname;

/* ---------- Base de dados de contas (volume /data) ---------- */
/* Em produção (Railway) há um volume persistente montado em /data e o Railway
 * expõe RAILWAY_VOLUME_MOUNT_PATH. Usamo-lo automaticamente para que as contas
 * sobrevivam a deploys/reinícios. Em local cai para <site>/data. */
const DATA_DIR =
  process.env.DATA_DIR ||
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  (process.platform !== 'win32' && fs.existsSync('/data') ? '/data' : path.join(SITE_DIR, 'data'));
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SCRYPT_ITERS = 16384;
const TOKEN_TTL = 1000 * 60 * 60 * 24 * 90; /* 90 dias */

function ensureDataDir() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');
  } catch (err) {
    console.error('data dir:', err.message);
  }
}
ensureDataDir();

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

let usersLock = Promise.resolve();
function withUsers(fn) {
  usersLock = usersLock.then(() => {
    const users = readJson(USERS_FILE, {});
    return Promise.resolve(fn(users)).then((result) => {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return result;
    });
  }).catch((err) => {
    console.error('users write:', err.message);
    throw err;
  });
  return usersLock;
}

function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), s, 64, { N: SCRYPT_ITERS }).toString('hex');
  return { salt: s, hash };
}

function verifyPassword(password, salt, hash) {
  try {
    const calc = crypto.scryptSync(String(password), salt, 64, { N: SCRYPT_ITERS }).toString('hex');
    const a = Buffer.from(calc, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (err) {
    return false;
  }
}

function userFile(username) {
  const safe = String(username).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return path.join(DATA_DIR, 'u_' + safe + '.json');
}

function validUsername(u) {
  return typeof u === 'string' && /^[a-z0-9_-]{3,32}$/i.test(u);
}

function validPassword(p) {
  return typeof p === 'string' && p.length >= 6 && p.length <= 200;
}

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

const loginAttempts = {};
function rateLimited(ip) {
  const now = Date.now();
  const list = (loginAttempts[ip] || []).filter((t) => now - t < 600000);
  loginAttempts[ip] = list;
  if (list.length >= 20) return true;
  list.push(now);
  return false;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('too-large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (err) {
        reject(new Error('bad-json'));
      }
    });
    req.on('error', reject);
  });
}

function json(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(obj));
}

function authUser(req) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token || token.length !== 64) return null;
  const users = readJson(USERS_FILE, {});
  const now = Date.now();
  for (const name of Object.keys(users)) {
    const u = users[name];
    const sessions = u.sessions || [];
    const found = sessions.find((s) => s.token === token && s.exp > now);
    if (found) return { name: u.username, session: found };
  }
  return null;
}

async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') {
    json(res, 204, {});
    return true;
  }

  if (pathname === '/api/register' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || '?';
    if (rateLimited(ip)) return json(res, 429, { error: 'muitas tentativas, tenta daqui a 10 min' });
    let body;
    try { body = await readBody(req, 16384); } catch (err) { return json(res, 400, { error: 'pedido inválido' }); }
    const username = String(body.username || '').trim();
    const password = body.password;
    if (!validUsername(username)) return json(res, 400, { error: 'Nome inválido: 3-32 caracteres (letras, números, _ ou -)' });
    if (!validPassword(password)) return json(res, 400, { error: 'Palavra-passe precisa de 6+ caracteres' });
    const created = await withUsers((users) => {
      const key = username.toLowerCase();
      if (users[key]) return { error: 'Essa conta já existe' };
      const { salt, hash } = hashPassword(password);
      users[key] = {
        username,
        salt,
        hash,
        created: Date.now(),
        sessions: []
      };
      return { ok: true };
    });
    if (created.error) return json(res, 409, { error: created.error });
    return json(res, 201, { ok: true });
  }

  if (pathname === '/api/login' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || '?';
    if (rateLimited(ip)) return json(res, 429, { error: 'muitas tentativas, tenta daqui a 10 min' });
    let body;
    try { body = await readBody(req, 16384); } catch (err) { return json(res, 400, { error: 'pedido inválido' }); }
    const username = String(body.username || '').trim().toLowerCase();
    const password = body.password;
    const users = readJson(USERS_FILE, {});
    const u = users[username];
    if (!u || !verifyPassword(password, u.salt, u.hash)) {
      return json(res, 401, { error: 'Conta ou palavra-passe erradas' });
    }
    const token = makeToken();
    await withUsers((all) => {
      const target = all[username];
      if (!target) return;
      target.sessions = (target.sessions || []).filter((s) => s.exp > Date.now());
      target.sessions.push({ token, exp: Date.now() + TOKEN_TTL, created: Date.now() });
      if (target.sessions.length > 10) target.sessions = target.sessions.slice(-10);
    });
    return json(res, 200, { token, username: u.username });
  }

  if (pathname === '/api/logout' && req.method === 'POST') {
    const auth = authUser(req);
    if (auth) {
      await withUsers((users) => {
        const u = users[auth.name.toLowerCase()];
        if (u) u.sessions = (u.sessions || []).filter((s) => s.token !== auth.session.token);
      });
    }
    return json(res, 200, { ok: true });
  }

  if (pathname === '/api/me' && req.method === 'GET') {
    const auth = authUser(req);
    if (!auth) return json(res, 401, { error: 'Sessão inválida' });
    return json(res, 200, { username: auth.name });
  }

  if (pathname === '/api/data' && (req.method === 'GET' || req.method === 'POST')) {
    const auth = authUser(req);
    if (!auth) return json(res, 401, { error: 'Sessão inválida' });
    const file = userFile(auth.name);
    if (req.method === 'GET') {
      const data = readJson(file, null);
      return json(res, 200, { data, updated: data && data.__updated ? data.__updated : null });
    }
    let body;
    try { body = await readBody(req, 5 * 1024 * 1024); } catch (err) { return json(res, 400, { error: 'pedido inválido' }); }
    const clean = {
      notes: body.notes && typeof body.notes === 'object' ? body.notes : {},
      tasks: Array.isArray(body.tasks) ? body.tasks.slice(0, 5000) : [],
      notas: Array.isArray(body.notas) ? body.notas.slice(0, 5000) : [],
      notifications: Array.isArray(body.notifications) ? body.notifications.slice(0, 50) : [],
      __updated: Date.now(),
      __by: auth.name
    };
    fs.writeFileSync(file, JSON.stringify(clean));
    return json(res, 200, { ok: true, updated: clean.__updated });
  }

  if (pathname.startsWith('/api/')) {
    json(res, 404, { error: 'desconhecido' });
    return true;
  }
  return false;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (err) {
    pathname = '/';
  }

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname).catch((err) => {
      console.error('api error:', err.message);
      if (!res.headersSent) json(res, 500, { error: 'erro interno' });
    });
    return;
  }

  if (pathname === '/download') {
    const url = process.env.DOWNLOAD_URL || 'https://github.com/mferpro08acc-bit/Personal-Calendar/releases/download/v1.1.0/Easly-Life-1.1.0-Setup.exe';
    if (url) {
      res.writeHead(302, { Location: url, 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Instalador indisponível de momento. Tenta novamente mais tarde.');
    return;
  }

  if (pathname === '/download-android') {
    const url = process.env.DOWNLOAD_ANDROID_URL || 'https://github.com/mferpro08acc-bit/Personal-Calendar/releases/download/v1.1.0/Easly-Life-1.1.0-android.apk';
    if (url) {
      res.writeHead(302, { Location: url, 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('APK indisponível de momento. Tenta novamente mais tarde.');
    return;
  }

  if (pathname === '/icon.png') {
    fs.readFile(path.join(SITE_DIR, 'assets', 'icon.png'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'max-age=3600' });
      res.end(data);
    });
    return;
  }

  if (pathname === '/') pathname = '/index.html';

  const filePath = path.join(SITE_DIR, pathname);
  if (!filePath.startsWith(SITE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Não encontrado: ' + pathname);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Easly Life site a correr na porta ' + PORT);
  console.log('Contas guardadas em: ' + DATA_DIR);
});