/* Personal Calendar — site (site-deploy)
 * Tema claro/escuro, idioma PT/EN, navegação por secções (SPA),
 * downloads (Windows + Android) e atualizações automáticas (GitHub Releases).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'personal-calendar-site-theme';
  var LANG_KEY = 'personal-calendar-site-lang';
  var SEEN_KEY = 'pc-site-updates-seen';
  var RELEASES_REPO = 'mferpro08acc-bit/Personal-Calendar';

  /* ---------- Ícones (SVG) ---------- */
  function icon(name) {
    var icons = {
      download:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
      phone:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
      monitor:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
      calendar:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      palette:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>',
      bell:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
      flag:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>',
      repeat:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
      list:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
      file:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
      history:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
      sun:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>',
      sync:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>',
      zap:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      shield:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      help:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };
    return icons[name] || icons.check;
  }

  /* ---------- Utilidades ---------- */
  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 620px)').matches;
  }

  /* ---------- Tema ---------- */
  function preferredTheme() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      /* sem armazenamento */
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* sem armazenamento */
    }
  }

  function toggleTheme() {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  /* ---------- Traduções ---------- */
  var I18N = {
    pt: {
      langLabel: 'Português',
      langToggle: 'EN',
      metaTitle: 'Personal Calendar — o teu calendário, no teu dispositivo',
      metaDesc:
        'Personal Calendar — um calendário para Windows e Android que guarda as tuas notas no próprio dispositivo, com lembretes nativos que aparecem mesmo com a app fechada.',
      nav: {
        inicio: 'Início',
        recursos: 'Recursos',
        comoFunciona: 'Como Funciona',
        instalar: 'Instalar',
        atualizacoes: 'Atualizações',
        faq: 'FAQ'
      },
      navInstall: 'Instalar',

      /* Início */
      heroBadge: 'Windows 10/11 · Android · local e privado',
      heroTitleA: 'Um calendário para o teu dia,',
      heroTitleB: 'sem dar cabo da cabeça.',
      heroSub:
        'Anotas um dia, escolhes a cor, defines o lembrete — e sigues. Tudo fica guardado no teu dispositivo. Sem contas obrigatórias, sem nuvem, sem avisos de marketing.',
      heroNoteWin: 'Ficheiro <code>.exe</code> · ~106&nbsp;MB · Windows 10/11',
      heroNoteMobile: 'O instalador é para Windows. Transfere o ficheiro e corre-o no teu computador.',
      heroNoteDownloaded: 'Transferência iniciada em «Downloads». Passa o ficheiro para o teu PC e executa-o.',
      heroCtaWin: 'Instalar para Windows',
      heroCtaAndroid: 'Instalar para Android',
      heroCtaHow: 'Como funciona',
      shotCap: 'O dia de hoje, aberto na hora. Notas a cores, lembrete marcado.',
      shotAlt: 'Captura de ecrã do Personal Calendar: calendário mensal com notas coloridas e a lista do dia aberta',

      hlTitle: 'Porquê este calendário?',
      hl: [
        { t: 'Notas com cor e importância', d: 'Cada dia mostra à primeira vista o que lá está.', icon: 'palette' },
        { t: 'Lembretes nativos', d: 'Disparam mesmo com a app fechada. No Windows, a app fica na bandeja.', icon: 'bell' },
        { t: 'Lista de tarefas', d: 'Coisas sem data fixa também têm sítio.', icon: 'list' }
      ],
      quote:
        'Este é o calendário que eu queria ter: discreto, rápido e que guarda tudo no teu dispositivo. Faço melhorias quando me aborrece a mim — por isso nunca vai ter publicidade nem contas obrigatórias. Se te servir também, que bom.',
      quoteSign: '— quem o faz usar todos os dias',
      ctaTitle: 'Pronto para organizar o teu dia?',
      ctaSub: 'Escolhe o teu dispositivo e instala em poucos minutos. Sem registo.',
      ctaFoot: 'Sem registo, sem internet. Os teus dados ficam no teu dispositivo.',

      /* Recursos */
      recTitle: 'Tudo o que o calendário faz',
      recSub: 'Pequeno por fora, com o que precisas por dentro.',
      rec: [
        { t: 'Todo o mês à frente', d: 'Vista mensal simples: o dia de hoje fica destacado e um clique abre o dia. Nada mais.', icon: 'calendar' },
        { t: 'Notas a cores', d: 'Cada nota tem a cor que escolhes. Os dias mostram as cores à primeira vista.', icon: 'palette' },
        { t: 'Lembretes nativos', d: 'Popup do sistema com som, mesmo com a app fechada. Windows: bandeja. Android: notificação.', icon: 'bell' },
        { t: 'A importância decide quando avisas', d: 'De «só lembrete» a «bastante importante»: avisa no próprio dia ou 1, 2 ou 3 dias antes.', icon: 'flag' },
        { t: 'Repetição de notas', d: 'Uma nota repete todos os dias, todas as semanas ou no mesmo dia de cada mês.', icon: 'repeat' },
        { t: 'Lista de tarefas', d: 'Sem data fixa? Entra na lista. Um toque marca o que já está feito.', icon: 'list' },
        { t: 'Apontamentos', d: 'O separador Notas guarda ideias rápidas fora do calendário.', icon: 'file' },
        { t: 'Histórico de notificações', d: 'O sino mostra o histórico; elimina uma a uma ou limpa tudo de uma vez.', icon: 'history' },
        { t: 'Claro e escuro', d: 'Um botão muda a app toda, e a tua escolha fica guardada.', icon: 'sun' },
        { t: 'Conta opcional', d: 'Sem conta é 100% local. Com uma conta gratuita, sincroniza entre PC e telemóvel.', icon: 'sync' },
        { t: 'Atualizações simples', d: 'Quando há versão nova, a app avisa-te e mostra como atualizar.', icon: 'zap' },
        { t: 'Privacidade por omissão', d: 'Os dados ficam no teu dispositivo. Nada é enviado sem a tua conta.', icon: 'shield' }
      ],

      /* Como Funciona */
      cfTitle: 'Como funciona',
      cfSub: 'Simples por fora, com as decisões certas por dentro.',
      cfDataTitle: 'Os teus dados, no teu dispositivo',
      cfDataText:
        'O calendário guarda tudo localmente. No Windows, numa pasta de dados do teu utilizador; no Android, no armazenamento interno da app. Sem conta, nada sai do aparelho — funciona 100% offline.',
      cfRemTitle: 'Lembretes e importância',
      cfRemText:
        'Cada nota pode avisar no próprio dia, ou uns dias antes consoante a importância. Também podes desligar o lembrete e deixar a nota quieta. Notas em dias passados ficam a cinzento para o mês não parecer um arquivo.',
      impCol1: 'Nível de importância',
      impCol2: 'Quando notifica',
      impRows: [
        ['#94a3b8', 'Só lembrete', 'No próprio dia'],
        ['#60a5fa', 'Pouco importante', 'No próprio dia'],
        ['#22c55e', 'Mais ou menos importante', '1 dia antes + no próprio dia'],
        ['#f59e0b', 'Importante', '2 dias antes + no próprio dia'],
        ['#ef4444', 'Bastante importante', '3 dias antes + no próprio dia']
      ],
      cfRepTitle: 'Notas que se repetem',
      cfRepText:
        'Ao criar ou editar uma nota, podes escolher repetição diária, semanal (no mesmo dia da semana) ou mensal (no mesmo dia do mês; nos meses mais curtos, no último dia). A repetição é opcional e podes mudá-la quando quiseres.',
      cfTrayTitle: 'Fica por perto (Windows)',
      cfTrayText:
        'A app encosta-se à bandeja do sistema: fechar a janela não desliga os lembretes. Duplo clique no ícone reabre o calendário; «Sair» no menu desliga mesmo a app.',
      cfSyncTitle: 'Sincronização opcional',
      cfSyncText:
        'Cria uma conta gratuita na própria app para sincronizar notas, tarefas e apontamentos entre o PC e o telemóvel. Sem conta, é tudo local. As notificações entregues continuam a ser só de cada dispositivo.',
      cfUpdTitle: 'Como recebes atualizações',
      cfUpdText:
        'A app verifica se há uma versão nova e mostra um aviso no topo. Neste site, a página Atualizações lista sempre as últimas melhorias — automaticamente.',
      cfLearnMore: 'Ver como instalar',
      cfLearnFaq: 'Perguntas frequentes',

      /* Instalar */
      insTitle: 'Instalar',
      insSub: 'Windows e Android, com instruções passo a passo. O mesmo calendário, no teu dispositivo.',
      win: {
        name: 'Windows',
        reqTitle: 'Requisitos',
        reqs: ['Windows 10 ou 11', '~106 MB de espaço livre'],
        steps: [
          { t: 'Baixa o instalador', d: 'Clica no botão e guarda o <code>.exe</code> em qualquer pasta. Não instala coisas escondidas.' },
          { t: 'Corre-o e está feito', d: 'Dois cliques: o assistente anda sozinho e cria atalhos no Iniciar e no ambiente de trabalho.' },
          { t: 'Fica perto, discretamente', d: 'A app encosta-se à bandeja: fechar a janela não desliga os lembretes.' }
        ],
        cta: 'Instalar para Windows',
        tip: 'Se o Windows acusar o instalador, clica em «Mais informações → Executar assim mesmo». Não tem certificado pago, mas é seguro e sem publicidade.'
      },
      android: {
        name: 'Android',
        reqTitle: 'Requisitos',
        reqs: ['Android 7.0 ou superior', 'Ficheiro APK (sem Play Store)'],
        steps: [
          { t: 'Baixa o ficheiro APK', d: 'Clica no botão e guarda o APK no telemóvel.' },
          { t: 'Permite a instalação', d: 'O Android pede permissão para instalar apps desconhecidas. Ativa-a para este ficheiro (ou em Definições → Segurança).' },
          { t: 'Instala e abre', d: 'Abre o ficheiro, instala e permite as notificações quando a app pedir.' }
        ],
        cta: 'Instalar para Android',
        tip: 'Para os lembretes aparecerem com a app fechada, deixa a app sem otimização de bateria nas definições do telemóvel.'
      },
      insBothTitle: 'Usas PC e telemóvel?',
      insBothText: 'Cria uma conta gratuita na app e as notas, tarefas e apontamentos sincronizam entre os dois dispositivos.',

      /* Atualizações */
      updPageTitle: 'Atualizações',
      updPageSub:
        'As últimas melhorias feitas na aplicação. Esta lista é carregada automaticamente a partir das releases do GitHub — quando há uma versão nova, aparece aqui sem precisares de fazer nada.',
      updEmpty: 'Ainda não há registos de atualizações.',
      updError: 'Não foi possível carregar os updates. Volta mais tarde.',
      updOld: 'anterior',
      updLatest: 'Novidade',
      updNote: 'A própria app também te avisa quando há uma versão nova.',
      fallbackReleases: [
        {
          tag_name: 'v1.0.1',
          published_at: '2026-10-11T00:00:00Z',
          body:
            'Correções e melhorias:\n- Notificações: novo botão «Limpar histórico» para limpar todas as notificações de uma vez.\n- Notificações: ao eliminar uma notificação manualmente, o painel mantém-se aberto.\n- Dropdowns (repetição, importância, etc.): já não fecham ao fazer scroll.\n- Dropdowns: interagir com o texto da nota ou abrir campos já não fecha o menu à toa.'
        },
        {
          tag_name: 'v1.0.0',
          published_at: '2026-09-20T10:57:32Z',
          body:
            'Primeira versão pública. Calendário mensal com notas a cores, lembretes nativos com níveis de importância, lista de tarefas, apontamentos, modo claro/escuro, instalação para Windows e Android e contas opcionais com sincronização.'
        }
      ],

      /* FAQ */
      faqTitle: 'Perguntas frequentes',
      faqSub: 'Respostas rápidas às dúvidas mais comuns.',
      faq: [
        {
          q: 'Preciso de criar conta para usar?',
          a: 'Não. A conta é opcional e só serve para sincronizar entre o PC e o telemóvel. Sem conta, tudo fica no teu dispositivo.'
        },
        {
          q: 'Onde ficam os meus dados?',
          a: 'No computador: numa pasta de dados do teu utilizador no Windows (fora da pasta da app). No telemóvel: no armazenamento interno da app. Nada é enviado para a internet sem a tua conta.'
        },
        {
          q: 'Os lembretes funcionam com a app fechada?',
          a: 'Windows: sim, a app fica na bandeja e dispara os lembretes. Android: sim, desde que permitas as notificações e deixes a app sem otimização de bateria.'
        },
        {
          q: 'Posso usar no PC e no telemóvel?',
          a: 'Sim. Com uma conta gratuita, as notas, tarefas e apontamentos sincronizam entre os dois. Sem conta, cada dispositivo fica independente.'
        },
        {
          q: 'Como mudo o tema claro/escuro?',
          a: 'Na app, em Configurações. Neste site, no botão de sol/lua na barra superior.'
        },
        {
          q: 'O Windows acusa o instalador como desconhecido?',
          a: 'Pode acontecer em apps sem certificado pago. Clica em «Mais informações → Executar assim mesmo». O instalador só cria atalhos e não instala nada escondido.'
        },
        {
          q: 'Como apago notificações antigas?',
          a: 'Abre o sino de notificações e usa o «×» em cada uma para eliminar, ou o botão «Limpar histórico» para apagar todas de uma vez.'
        },
        {
          q: 'Como sei que há uma versão nova?',
          a: 'A app mostra um aviso no topo quando existe uma versão mais recente. Neste site, a página Atualizações lista sempre as últimas melhorias.'
        }
      ],

      /* Modal */
      modalTitle: 'Atualizações recentes',
      modalSub: 'As últimas melhorias feitas na aplicação.',
      closeLabel: 'Fechar',

      /* Rodapé */
      footerNote: 'Feito à mão para Windows e Android · os teus dados ficam no teu dispositivo'
    },

    en: {
      langLabel: 'English',
      langToggle: 'PT',
      metaTitle: 'Personal Calendar — your calendar, on your device',
      metaDesc:
        'Personal Calendar — a calendar for Windows and Android that keeps your notes on your own device, with native reminders that show up even when the app is closed.',
      nav: {
        inicio: 'Home',
        recursos: 'Features',
        comoFunciona: 'How it works',
        instalar: 'Install',
        atualizacoes: 'Updates',
        faq: 'FAQ'
      },
      navInstall: 'Install',

      heroBadge: 'Windows 10/11 · Android · local & private',
      heroTitleA: 'A calendar for your day,',
      heroTitleB: 'without the hassle.',
      heroSub:
        'Note down a day, pick a colour, set the reminder — and move on. Everything stays on your device. No forced accounts, no cloud, no marketing spam.',
      heroNoteWin: '<code>.exe</code> file · ~106&nbsp;MB · Windows 10/11',
      heroNoteMobile: 'This installer is for Windows. Download the file and run it on your computer.',
      heroNoteDownloaded: 'Download started in “Downloads”. Move the file to your PC and run it.',
      heroCtaWin: 'Install for Windows',
      heroCtaAndroid: 'Install for Android',
      heroCtaHow: 'How it works',
      shotCap: 'Today, open in one click. Colourful notes, reminder set.',
      shotAlt: 'Screenshot of Personal Calendar: monthly calendar with colourful notes and the open day list',

      hlTitle: 'Why this calendar?',
      hl: [
        { t: 'Colourful, priority-aware notes', d: 'Each day shows at a glance what is in it.', icon: 'palette' },
        { t: 'Native reminders', d: 'They fire even with the app closed. On Windows, the app lives in the tray.', icon: 'bell' },
        { t: 'To-do list', d: 'Things without a fixed date have a place too.', icon: 'list' }
      ],
      quote:
        'This is the calendar I wanted: discreet, fast, and keeping everything on your device. I improve it whenever it annoys me — so it will never have ads or forced accounts. If it serves you too, great.',
      quoteSign: '— made by someone who uses it every day',
      ctaTitle: 'Ready to organise your day?',
      ctaSub: 'Pick your device and install in a few minutes. No sign-up.',
      ctaFoot: 'No sign-up, no internet needed. Your data stays on your device.',

      recTitle: 'Everything the calendar does',
      recSub: 'Small on the outside, with what you need inside.',
      rec: [
        { t: 'The whole month at a glance', d: 'Simple month view: today is highlighted and one click opens the day. Nothing more.', icon: 'calendar' },
        { t: 'Colourful notes', d: 'Each note gets the colour you pick. Days show colours at a glance.', icon: 'palette' },
        { t: 'Native reminders', d: 'System popup with sound, even with the app closed. Windows: tray. Android: notification.', icon: 'bell' },
        { t: 'Priority decides the warning', d: 'From “just a reminder” to “very important”: same day, or 1, 2 or 3 days ahead.', icon: 'flag' },
        { t: 'Repeating notes', d: 'A note repeats daily, weekly, or on the same day every month.', icon: 'repeat' },
        { t: 'To-do list', d: 'No fixed date? It goes in the list. One tap marks it done.', icon: 'list' },
        { t: 'Quick notes', d: 'The Notes tab keeps quick ideas outside the calendar.', icon: 'file' },
        { t: 'Notification history', d: 'The bell shows the history; delete one by one or clear everything at once.', icon: 'history' },
        { t: 'Light and dark', d: 'One button changes the whole app, and your choice is saved.', icon: 'sun' },
        { t: 'Optional account', d: 'No account = 100% local. With a free account, it syncs between PC and phone.', icon: 'sync' },
        { t: 'Simple updates', d: 'When there is a new version, the app lets you know and shows how to update.', icon: 'zap' },
        { t: 'Private by default', d: 'Data stays on your device. Nothing is sent without your account.', icon: 'shield' }
      ],

      cfTitle: 'How it works',
      cfSub: 'Simple on the outside, with the right decisions inside.',
      cfDataTitle: 'Your data, on your device',
      cfDataText:
        'The calendar stores everything locally. On Windows, in a data folder of your user account; on Android, in the app’s internal storage. Without an account, nothing leaves your device — it works 100% offline.',
      cfRemTitle: 'Reminders & priority',
      cfRemText:
        'Each note can warn you on the day itself, or a few days ahead depending on its priority. You can also turn reminders off and leave the note quiet. Notes on past days turn grey so the month doesn’t look like an archive.',
      impCol1: 'Priority level',
      impCol2: 'When it notifies',
      impRows: [
        ['#94a3b8', 'Just a reminder', 'Same day'],
        ['#60a5fa', 'Slightly important', 'Same day'],
        ['#22c55e', 'Somewhat important', '1 day before + same day'],
        ['#f59e0b', 'Important', '2 days before + same day'],
        ['#ef4444', 'Very important', '3 days before + same day']
      ],
      cfRepTitle: 'Notes that repeat',
      cfRepText:
        'When creating or editing a note, you can choose daily, weekly (same weekday) or monthly repetition (same day of the month; on shorter months, the last day). Repetition is optional and you can change it anytime.',
      cfTrayTitle: 'Stays close by (Windows)',
      cfTrayText:
        'The app tucks into the system tray: closing the window doesn’t switch off reminders. Double-click the icon to reopen; “Exit” in the menu really quits the app.',
      cfSyncTitle: 'Optional sync',
      cfSyncText:
        'Create a free account right inside the app to sync notes, tasks and quick notes between PC and phone. Without an account, everything is local. Delivered notifications stay per device.',
      cfUpdTitle: 'How you get updates',
      cfUpdText:
        'The app checks for a new version and shows a banner at the top. On this site, the Updates page always lists the latest improvements — automatically.',
      cfLearnMore: 'See how to install',
      cfLearnFaq: 'Frequently asked questions',

      insTitle: 'Install',
      insSub: 'Windows and Android, with step-by-step instructions. The same calendar, on your device.',
      win: {
        name: 'Windows',
        reqTitle: 'Requirements',
        reqs: ['Windows 10 or 11', 'About 106 MB of free space'],
        steps: [
          { t: 'Download the installer', d: 'Click the button and save the <code>.exe</code> anywhere. It installs nothing hidden.' },
          { t: 'Run it — done', d: 'Two clicks: the wizard runs on its own and creates Start menu and desktop shortcuts.' },
          { t: 'Stays close, discreetly', d: 'The app tucks into the tray: closing the window doesn’t switch off reminders.' }
        ],
        cta: 'Install for Windows',
        tip: 'If Windows flags the installer, click “More info → Run anyway”. It has no paid certificate, but it is safe and ad-free.'
      },
      android: {
        name: 'Android',
        reqTitle: 'Requirements',
        reqs: ['Android 7.0 or later', 'APK file (no Play Store)'],
        steps: [
          { t: 'Download the APK file', d: 'Click the button and save the APK on your phone.' },
          { t: 'Allow the install', d: 'Android asks for permission to install unknown apps. Enable it for this file (or in Settings → Security).' },
          { t: 'Install and open', d: 'Open the file, install it and allow notifications when the app asks.' }
        ],
        cta: 'Install for Android',
        tip: 'For reminders to appear with the app closed, keep the app out of battery optimisation in your phone settings.'
      },
      insBothTitle: 'Using PC and phone?',
      insBothText: 'Create a free account inside the app and your notes, tasks and quick notes sync between both devices.',

      updPageTitle: 'Updates',
      updPageSub:
        'The latest improvements made to the app. This list loads automatically from the GitHub releases — when there is a new version, it appears here without you having to do anything.',
      updEmpty: 'No update records yet.',
      updError: 'Could not load the updates. Come back later.',
      updOld: 'older',
      updLatest: 'New',
      updNote: 'The app itself also lets you know when there is a new version.',
      fallbackReleases: [
        {
          tag_name: 'v1.0.1',
          published_at: '2026-10-11T00:00:00Z',
          body:
            'Fixes and improvements:\n- Notifications: new “Clear history” button to remove all notifications at once.\n- Notifications: deleting a notification manually keeps the panel open.\n- Dropdowns (repeat, priority, etc.): no longer close when scrolling.\n- Dropdowns: interacting with note text or opening fields no longer closes the menu accidentally.'
        },
        {
          tag_name: 'v1.0.0',
          published_at: '2026-09-20T10:57:32Z',
          body:
            'First public version. Monthly calendar with colourful notes, native reminders with priority levels, to-do list, quick notes, light/dark mode, Windows and Android installers and optional accounts with sync.'
        }
      ],

      faqTitle: 'Frequently asked questions',
      faqSub: 'Quick answers to common questions.',
      faq: [
        {
          q: 'Do I need an account to use it?',
          a: 'No. The account is optional and only syncs between your PC and phone. Without one, everything stays on your device.'
        },
        {
          q: 'Where is my data stored?',
          a: 'On the computer: in your Windows user data folder (outside the app folder). On the phone: in the app’s internal storage. Nothing is sent online without your account.'
        },
        {
          q: 'Do reminders work with the app closed?',
          a: 'Windows: yes, the app lives in the tray and fires reminders. Android: yes, as long as you allow notifications and keep the app out of battery optimisation.'
        },
        {
          q: 'Can I use it on PC and phone?',
          a: 'Yes. With a free account, notes, tasks and quick notes sync between both. Without one, each device stays independent.'
        },
        {
          q: 'How do I change the light/dark theme?',
          a: 'In the app, in Settings. On this site, using the sun/moon button in the top bar.'
        },
        {
          q: 'Does Windows warn about the installer?',
          a: 'It can, with apps that have no paid certificate. Click “More info → Run anyway”. The installer only creates shortcuts and installs nothing hidden.'
        },
        {
          q: 'How do I delete old notifications?',
          a: 'Open the notification bell and use the “×” on each one, or the “Clear history” button to remove everything at once.'
        },
        {
          q: 'How do I know there is a new version?',
          a: 'The app shows a banner when a newer version exists. On this site, the Updates page always lists the latest improvements.'
        }
      ],

      modalTitle: 'Recent updates',
      modalSub: 'The latest improvements made to the app.',
      closeLabel: 'Close',

      footerNote: 'Hand-made for Windows and Android · your data stays on your device'
    }
  };

  var lang = 'pt';
  try {
    var storedLang = localStorage.getItem(LANG_KEY);
    if (storedLang === 'pt' || storedLang === 'en') lang = storedLang;
  } catch (e) {
    /* sem armazenamento */
  }

  function t() {
    return I18N[lang];
  }

  /* ---------- Construtores de vistas ---------- */
  function viewInicio(L) {
    return (
      '<div class="hero">' +
      '<div class="hero-text">' +
      '<span class="badge">' + esc(L.heroBadge) + '</span>' +
      '<h1>' + esc(L.heroTitleA) + '<br><span class="accent">' + esc(L.heroTitleB) + '</span></h1>' +
      '<p>' + esc(L.heroSub) + '</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-primary btn-download" href="/download" id="install-win-btn">' + icon('download') + esc(L.heroCtaWin) + '</a>' +
      '<a class="btn btn-primary btn-download btn-android" href="/download-android" target="_blank" rel="noopener">' + icon('phone') + esc(L.heroCtaAndroid) + '</a>' +
      '<a class="btn btn-ghost" href="#como-funciona">' + esc(L.heroCtaHow) + '</a>' +
      '</div>' +
      '<p class="hero-note" id="dl-note">' + L.heroNoteWin + '</p>' +
      '</div>' +
      '<div class="hero-visual">' +
      '<div class="shot-card">' +
      '<img src="screenshot.png" alt="' + esc(L.shotAlt) + '" class="shot-img">' +
      '<div class="shot-cap"><span class="shot-dot" style="background:#3b82f6"></span><span>' + esc(L.shotCap) + '</span></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<section class="section">' +
      '<h2 class="section-title">' + esc(L.hlTitle) + '</h2>' +
      '<div class="features">' +
      L.hl
        .map(
          function (f) {
            return (
              '<div class="feature">' +
              '<div class="feature-icon">' + icon(f.icon) + '</div>' +
              '<h3>' + esc(f.t) + '</h3>' +
              '<p>' + esc(f.d) + '</p>' +
              '</div>'
            );
          }
        )
        .join('') +
      '</div>' +
      '</section>' +
      '<section class="section note-personal"><div class="personal-card">' +
      '<span class="personal-quote">“</span>' +
      '<p>' + esc(L.quote) + '</p>' +
      '<span class="personal-sign">' + esc(L.quoteSign) + '</span>' +
      '</div></section>' +
      '<section class="section">' +
      '<h2 class="section-title">' + esc(L.ctaTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.ctaSub) + '</p>' +
      '<div class="install-cta">' +
      '<div class="cta-buttons">' +
      '<a class="btn btn-primary btn-download" href="/download">' + icon('monitor') + esc(L.heroCtaWin) + '</a>' +
      '<a class="btn btn-primary btn-download btn-android" href="/download-android" target="_blank" rel="noopener">' + icon('phone') + esc(L.heroCtaAndroid) + '</a>' +
      '</div>' +
      '<p class="hero-note">' + esc(L.ctaFoot) + '</p>' +
      '</div>' +
      '</section>'
    );
  }

  function viewRecursos(L) {
    return (
      '<section class="section">' +
      '<h2 class="section-title">' + esc(L.recTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.recSub) + '</p>' +
      '<div class="features">' +
      L.rec
        .map(
          function (f) {
            return (
              '<div class="feature">' +
              '<div class="feature-icon">' + icon(f.icon) + '</div>' +
              '<h3>' + esc(f.t) + '</h3>' +
              '<p>' + esc(f.d) + '</p>' +
              '</div>'
            );
          }
        )
        .join('') +
      '</div>' +
      '</section>'
    );
  }

  function impTable(L) {
    return (
      '<div class="table-card">' +
      '<table class="imp-table">' +
      '<thead><tr><th>' + esc(L.impCol1) + '</th><th>' + esc(L.impCol2) + '</th></tr></thead>' +
      '<tbody>' +
      L.impRows
        .map(
          function (r) {
            return '<tr><td><span class="tdot" style="background:' + r[0] + '"></span>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
          }
        )
        .join('') +
      '</tbody>' +
      '</table>' +
      '</div>'
    );
  }

  function infoCard(title, text, iconName) {
    return (
      '<div class="cf-card">' +
      '<div class="cf-card-icon">' + icon(iconName) + '</div>' +
      '<h3>' + esc(title) + '</h3>' +
      '<p>' + esc(text) + '</p>' +
      '</div>'
    );
  }

  function viewComoFunciona(L) {
    return (
      '<div class="section">' +
      '<h2 class="section-title">' + esc(L.cfTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.cfSub) + '</p>' +
      '<div class="cf-banner">' + infoCard(L.cfDataTitle, L.cfDataText, 'shield') + infoCard(L.cfSyncTitle, L.cfSyncText, 'sync') + '</div>' +
      '<div class="split">' +
      '<div>' +
      '<h2 class="section-title left">' + esc(L.cfRemTitle) + '</h2>' +
      '<p class="section-sub">' + esc(L.cfRemText) + '</p>' +
      '<ul class="check-list">' +
      '<li>' + esc(L.impRows[2][1]) + ' — ' + esc(L.impRows[2][2]) + '</li>' +
      '<li>' + esc(L.impRows[3][1]) + ' — ' + esc(L.impRows[3][2]) + '</li>' +
      '<li>' + esc(L.impRows[4][1]) + ' — ' + esc(L.impRows[4][2]) + '</li>' +
      '</ul>' +
      '</div>' +
      impTable(L) +
      '</div>' +
      '<div class="cf-banner">' + infoCard(L.cfRepTitle, L.cfRepText, 'repeat') + infoCard(L.cfTrayTitle, L.cfTrayText, 'monitor') + infoCard(L.cfUpdTitle, L.cfUpdText, 'zap') + '</div>' +
      '<div class="cta-links">' +
      '<a class="btn btn-primary" href="#instalar">' + esc(L.cfLearnMore) + '</a>' +
      '<a class="btn btn-ghost" href="#faq">' + esc(L.cfLearnFaq) + '</a>' +
      '</div>' +
      '</div>'
    );
  }

  function stepsHtml(steps) {
    return (
      '<div class="steps">' +
      steps
        .map(
          function (s, i) {
            return (
              '<div class="step">' +
              '<span class="step-num">' + (i + 1) + '</span>' +
              '<h3>' + esc(s.t) + '</h3>' +
              '<p>' + s.d + '</p>' +
              '</div>'
            );
          }
        )
        .join('') +
      '</div>'
    );
  }

  function platformCard(L, kind, iconName) {
    var p = L[kind];
    return (
      '<div class="platform-card">' +
      '<div class="platform-head">' +
      '<span class="platform-icon">' + icon(iconName) + '</span>' +
      '<h3>' + esc(p.name) + '</h3>' +
      '</div>' +
      '<div class="platform-reqs">' +
      '<span class="picker-label">' + esc(p.reqTitle) + '</span>' +
      '<ul class="reqs">' +
      p.reqs
        .map(function (r) {
          return '<li>' + icon('check') + '<span>' + esc(r) + '</span></li>';
        })
        .join('') +
      '</ul>' +
      '</div>' +
      stepsHtml(p.steps) +
      '<div class="platform-cta">' +
      '<a class="btn btn-primary btn-download" href="' + (kind === 'win' ? '/download' : '/download-android') + '"' + (kind === 'android' ? ' target="_blank" rel="noopener"' : '') + '>' + icon('download') + esc(p.cta) + '</a>' +
      '</div>' +
      '<p class="platform-tip">' + icon('help') + '<span>' + esc(p.tip) + '</span></p>' +
      '</div>'
    );
  }

  function viewInstalar(L) {
    return (
      '<div class="section">' +
      '<h2 class="section-title">' + esc(L.insTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.insSub) + '</p>' +
      '<div class="platform-grid">' +
      platformCard(L, 'win', 'monitor') +
      platformCard(L, 'android', 'phone') +
      '</div>' +
      '<div class="both-card">' +
      '<span class="both-icon">' + icon('sync') + '</span>' +
      '<div><h3>' + esc(L.insBothTitle) + '</h3><p>' + esc(L.insBothText) + '</p></div>' +
      '</div>' +
      '</div>'
    );
  }

  function updatesCardHtml(r, L, isNewest) {
    var ver = esc(String(r.tag_name || '').replace(/^v/i, ''));
    var body = esc((r.body || '').replace(/^[\s\r\n]+/, ''));
    var date = r.published_at
      ? new Date(r.published_at).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })
      : '';
    return (
      '<div class="update-card">' +
      '<div class="update-card-head">' +
      '<h3>' + ver + '</h3>' +
      '<span class="update-ver">' + (date || '') + (isNewest ? ' · ' + esc(L.updLatest) : '') + '</span>' +
      '</div>' +
      (body ? '<p>' + body.replace(/\n/g, '<br>') + '</p>' : '') +
      '</div>'
    );
  }

  function viewAtualizacoes(L) {
    return (
      '<div class="section">' +
      '<h2 class="section-title">' + esc(L.updPageTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.updPageSub) + '</p>' +
      '<div class="updates-list" id="updates-list"></div>' +
      '<p class="updates-note">' + icon('zap') + '<span>' + esc(L.updNote) + '</span></p>' +
      '</div>'
    );
  }

  function viewFaq(L) {
    return (
      '<div class="section">' +
      '<h2 class="section-title">' + esc(L.faqTitle) + '</h2>' +
      '<p class="section-sub center">' + esc(L.faqSub) + '</p>' +
      '<div class="faq-list">' +
      L.faq
        .map(
          function (f) {
            return (
              '<details class="faq-item">' +
              '<summary>' + esc(f.q) + '</summary>' +
              '<p>' + esc(f.a) + '</p>' +
              '</details>'
            );
          }
        )
        .join('') +
      '</div>' +
      '</div>'
    );
  }

  var VIEWS = {
    inicio: viewInicio,
    recursos: viewRecursos,
    'como-funciona': viewComoFunciona,
    instalar: viewInstalar,
    atualizacoes: viewAtualizacoes,
    faq: viewFaq
  };

  /* ---------- Renderização ---------- */
  var releases = null;
  var releasesError = false;

  function renderStatic() {
    var L = t();
    document.title = L.metaTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', L.metaDesc);
    root.setAttribute('lang', lang);

    /* Nav */
    Object.keys(L.nav).forEach(function (key) {
      document.querySelectorAll('[data-nav="' + key + '"]').forEach(function (a) {
        a.textContent = L.nav[key];
        a.setAttribute('href', '#' + key);
      });
    });
    var navInstall = $('nav-install');
    if (navInstall) navInstall.textContent = L.navInstall;
    var langBtn = $('lang-btn');
    if (langBtn) {
      langBtn.textContent = L.langToggle;
      langBtn.title = lang === 'pt' ? 'View this site in English' : 'Ver este site em português';
      langBtn.setAttribute('aria-label', lang === 'pt' ? 'English' : 'Português');
    }

    /* Vistas */
    Object.keys(VIEWS).forEach(function (key) {
      var el = $('view-' + key);
      if (el) el.innerHTML = VIEWS[key](L);
    });

    /* Modal */
    var modalTitle = $('modal-title');
    if (modalTitle) modalTitle.textContent = L.modalTitle;

    /* Rodapé */
    var footerNote = $('footer-note');
    if (footerNote) footerNote.textContent = L.footerNote;

    renderUpdatesAll();
    setupDownloadHints();
  }

  function renderUpdatesAll() {
    var L = t();
    var list = releases && !releasesError ? releases : L.fallbackReleases;
    var elPage = $('updates-list');
    var elModal = $('updates-modal-list');
    var emptyMsg = releasesError || (releases && !releases.length) ? L.updError : L.updEmpty;

    function renderInto(el) {
      if (!el) return;
      if (!list.length) {
        el.innerHTML = '<div class="updates-empty">' + esc(emptyMsg) + '</div>';
        return;
      }
      var newest = list[0] ? list[0].tag_name : null;
      el.innerHTML = list
        .map(function (r) {
          return updatesCardHtml(r, L, r.tag_name === newest);
        })
        .join('');
    }

    renderInto(elPage);
    renderInto(elModal);
    updateBadges();
  }

  function updateBadges() {
    var latest = releases && releases.length ? releases[0].tag_name : null;
    var seen = null;
    try {
      seen = localStorage.getItem(SEEN_KEY);
    } catch (e) {
      /* sem armazenamento */
    }
    var show = !!latest && seen !== latest;
    var badgeIds = ['fab-badge', 'updates-badge'];
    badgeIds.forEach(function (id) {
      var b = $(id);
      if (!b) return;
      b.classList.toggle('hidden', !show);
      if (show) b.textContent = '1';
    });
  }

  function markSeen() {
    var latest = releases && releases.length ? releases[0].tag_name : null;
    if (!latest) return;
    try {
      localStorage.setItem(SEEN_KEY, latest);
    } catch (e) {
      /* sem armazenamento */
    }
    updateBadges();
  }

  function loadReleases() {
    var list = $('updates-list');
    return fetch('https://api.github.com/repos/' + RELEASES_REPO + '/releases')
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (rel) {
        releases = Array.isArray(rel) ? rel : [];
        releasesError = false;
        renderUpdatesAll();
      })
      .catch(function () {
        releasesError = true;
        renderUpdatesAll();
      });
  }

  /* ---------- Downloads ---------- */
  function setupDownloadHints() {
    var note = $('dl-note');
    var L = t();
    if (!note) return;
    if (isMobile()) {
      note.innerHTML = L.heroNoteMobile;
    }
  }

  function onDownloadClick(e) {
    var link = e.target.closest ? e.target.closest('a[href="/download"]') : null;
    if (!link) return;
    var note = $('dl-note');
    var L = t();
    if (!note || !isMobile()) return;
    setTimeout(function () {
      if (note) note.innerHTML = L.heroNoteDownloaded;
    }, 600);
  }

  /* ---------- Modal ---------- */
  function openModal() {
    var modal = $('updates-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    markSeen();
    var closeBtn = modal.querySelector('[data-close="modal"]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = $('updates-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /* ---------- Navegação ---------- */
  var VALID_VIEWS = ['inicio', 'recursos', 'como-funciona', 'instalar', 'atualizacoes', 'faq'];

  function currentView() {
    var h = String(location.hash).replace('#', '');
    return VALID_VIEWS.indexOf(h) !== -1 ? h : 'inicio';
  }

  function navigate() {
    var v = currentView();
    Object.keys(VIEWS).forEach(function (key) {
      var el = $('view-' + key);
      if (el) el.classList.toggle('active', key === v);
    });
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === v);
    });
    closeMobileNav();
    if (v !== 'atualizacoes') markSeen();
    if (v === 'atualizacoes') markSeen();
    window.scrollTo(0, 0);
  }

  /* ---------- Menu móvel ---------- */
  function closeMobileNav() {
    var nav = $('nav');
    if (nav) nav.classList.remove('open');
    var burger = $('burger');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileNav() {
    var nav = $('nav');
    if (!nav) return;
    var open = nav.classList.toggle('open');
    var burger = $('burger');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  /* ---------- Inicialização ---------- */
  function init() {
    applyTheme(preferredTheme());
    renderStatic();
    navigate();

    loadReleases();
    setInterval(loadReleases, 15 * 60 * 1000);

    window.addEventListener('hashchange', function () {
      closeModal();
      navigate();
    });

    var themeBtn = $('theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    var langBtn = $('lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        lang = lang === 'pt' ? 'en' : 'pt';
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch (e) {
          /* sem armazenamento */
        }
        renderStatic();
        navigate();
      });
    }

    var updatesBtn = $('updates-btn');
    if (updatesBtn) updatesBtn.addEventListener('click', openModal);

    var fab = $('fab');
    if (fab) fab.addEventListener('click', openModal);

    document.addEventListener('click', function (e) {
      var closer = e.target.closest('[data-close="modal"]');
      if (closer) {
        closeModal();
        return;
      }
      var link = e.target.closest('[data-nav]');
      if (link) closeMobileNav();
      var installLink = e.target.closest('a[href="/download"]');
      if (installLink) onDownloadClick(e);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('updates-modal').classList.contains('hidden')) {
        closeModal();
      }
      if (e.key === 'Escape') closeMobileNav();
    });

    var burger = $('burger');
    if (burger) burger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileNav();
    });

    document.addEventListener('pointerdown', function (e) {
      var nav = $('nav');
      if (nav && nav.classList.contains('open') && !e.target.closest('.nav')) {
        closeMobileNav();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();