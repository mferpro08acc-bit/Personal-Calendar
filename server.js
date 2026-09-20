const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SITE_DIR = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
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

  if (pathname === '/download') {
    const url = process.env.DOWNLOAD_URL || 'https://github.com/mferpro08acc-bit/Personal-Calendar/releases/download/v1.0.0/Personal.Calendar-1.0.0-Setup.exe';
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
    const url = process.env.DOWNLOAD_ANDROID_URL || 'https://github.com/mferpro08acc-bit/Personal-Calendar/releases/download/v1.0.0/Personal-Calendar-1.0.0-android.apk';
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
  console.log('Personal Calendar site a correr na porta ' + PORT);
});