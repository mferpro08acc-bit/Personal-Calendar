(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'personal-calendar-site-theme';

  function preferredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      /* sem armazenamento */
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-pick]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme-pick') === theme);
    });
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* sem armazenamento */
    }
  }

  function initTheme() {
    applyTheme(preferredTheme());
    document.querySelectorAll('[data-theme-pick]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme-pick'));
      });
    });
  }

  function setupDownloadLink() {
    var installLink = document.getElementById('install-btn');
    var note = document.getElementById('dl-note');
    if (!installLink) return;

    var isMobile = window.matchMedia('(max-width: 620px)').matches;

    if (location.protocol === 'file:') {
      installLink.href = '../dist/Personal Calendar-1.0.0-Setup.exe';
    }

    if (isMobile) {
      if (note) {
        note.textContent = 'Este instalador é para Windows. Transfere o ficheiro .exe e corre-o no teu computador.';
      }
      installLink.addEventListener('click', function () {
        setTimeout(function () {
          if (note) {
            note.textContent = 'Transferência iniciada em "Downloads". Passa o ficheiro para o teu PC e executa-o.';
          }
        }, 600);
      });
    }
  }

  initTheme();
  setupDownloadLink();
})();