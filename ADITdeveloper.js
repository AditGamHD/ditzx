// ADITdeveloper.js - Fixed Build (paste replace file)
const portfolio = (() => {
  let DATA = {};
  let elements = {};

  async function initialize() {
    try {
      // coba beberapa base path agar robust saat di-host di subfolder
      const baseCandidates = [
        './ADITdeveloper.json',
        'ADITdeveloper.json',
        window.location.pathname.replace(/\/[^\/]*$/, '/') + 'ADITdeveloper.json',
        '/ADITdeveloper.json'
      ].map(p => p.replace(/\/\/+/g,'/'));

      let response = null;
      for (const p of baseCandidates) {
        try {
          response = await fetch(p, { cache: 'no-store' });
          if (response && response.ok) {
            DATA = await response.json();
            break;
          }
        } catch (e) {
          // coba candidate lain
        }
      }
      if (!DATA || !DATA.penulis) {
        // fallback: coba path yang paling sederhana sekali lagi untuk log
        throw new Error('Gagal memuat ADITdeveloper.json (periksa path dan case-sensitive).');
      }

      setupElements();

      document.body.setAttribute('data-theme', DATA.situs?.tema || 'light');
      elements.brandName.innerText = DATA.penulis.nama || 'ADIT';
      elements.logoImg.src = DATA.penulis.foto || '';
      elements.footerText.innerText = `© ${new Date().getFullYear()} ${DATA.penulis.nama || 'ADIT'}`;

      renderPage('home');
      console.log('System Secure & Ready.');
    } catch (error) {
      console.error(error);
      showNotif('Gagal memuat data sistem.', 'error');
    }
  }

  function setupElements() {
    elements = {
      brandName: document.getElementById('brand-name'),
      logoImg: document.getElementById('logo-img'),
      footerText: document.getElementById('footer-text'),
      mainContent: document.getElementById('main-content')
    };
  }

  function animateElementsSequentially(selector, delay = 100) {
    document.querySelectorAll(selector).forEach((el, index) => {
      setTimeout(() => el.classList.add('animated'), index * delay);
    });
  }

  function renderPage(page) {
    if (!elements.mainContent) return;

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navBtn = document.getElementById(`nav-${page}`);
    if (navBtn) navBtn.classList.add('active');

    elements.mainContent.classList.remove('animate-fade-in-up');
    void elements.mainContent.offsetWidth;
    elements.mainContent.classList.add('animate-fade-in-up');

    switch (page) {
      case 'home': renderHome(); break;
      case 'projects': renderProjects(); break;
      case 'contact': renderContact(); break;
      default: renderHome();
    }
  }

  /* ---------- HOME ---------- */
  function renderHome() {
    const keahlianHTML = (DATA.penulis?.keahlian || []).map(s => `<span class="pill">${escapeHTML(String(s))}</span>`).join('');
    const socialHTML = Object.entries(DATA.sosial || {})
      .filter(([_, value]) => value.terlihat)
      .map(([key, value]) => `
        <a href="${escapeAttr(value.tautan)}" target="_blank" class="social-link" rel="noopener noreferrer">
          <svg class="icon" viewBox="0 0 24 24">${getSocialIcon(key)}</svg>
          ${escapeHTML(value.username || '')}
        </a>
      `).join('');

    const timelineHTML = (DATA.linimasa || []).map((item, index) => `
      <div class="timeline-item" style="animation-delay: ${0.6 + (index * 0.1)}s">
        <div class="timeline-year">${escapeHTML(String(item.tahun || ''))}</div>
        <div>
          <div style="font-weight:700">${escapeHTML(item.peran || '')}</div>
          <div style="color:var(--muted); font-size:14px;">${escapeHTML(item.deskripsi || '')}</div>
        </div>
      </div>
    `).join('');

    const shortcuts = Array.isArray(DATA.situs?.shortcuts) ? DATA.situs.shortcuts : [];
    const shortcutsHTML = shortcuts.length ? `
      <div class="shortcuts" style="margin-top:20px;">
        ${shortcuts.map((s, idx) => `
          <a class="shortcut-btn" href="${escapeAttr(s.url || '#')}" target="_blank" rel="noopener noreferrer"
             style="display:block;margin-bottom:10px;padding:12px;border-radius:12px;text-decoration:none;font-weight:700;color:#fff;background:${escapeAttr(s.warna || '#2563eb')}">
            ${escapeHTML(s.nama || `Link ${idx+1}`)}
            ${s.nomor ? `<span style="float:right;opacity:0.85">#${escapeHTML(String(s.nomor))}</span>` : ''}
          </a>
        `).join('')}
      </div>
    ` : '';

    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">${escapeHTML(DATA.penulis?.nama || '')}.</h1>
      <p class="animate-fade-in-up" style="animation-delay: 0.2s">${escapeHTML(DATA.penulis?.bioSingkat || '')}</p>

      <div class="skill-pills stagger-child" style="animation-delay: 0.3s">
        ${keahlianHTML}
      </div>

      <div class="social-links stagger-child" style="margin-top: 30px; animation-delay: 0.4s">
        ${socialHTML}
      </div>

      <div class="timeline">
        <h2 class="animate-fade-in-up" style="margin-bottom:20px; font-size:24px; animation-delay: 0.5s">Perjalanan</h2>
        ${timelineHTML}
      </div>

      ${shortcutsHTML}
    `;
    setTimeout(() => { animateElementsSequentially('.timeline-item', 150); }, 600);
  }

  /* ---------- PROJECTS ---------- */
  function renderProjects() {
    const visibleProjects = (DATA.proyek || []).filter(p => p.terlihat);
    const maxProjects = DATA.situs?.maksProyekPerHalaman || 9;

    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">Projek Kreatif.</h1>
      <div class="project-grid">
        ${visibleProjects.slice(0, maxProjects).map((project, index) => `
          <div class="card" style="animation-delay: ${0.2 + (index * 0.1)}s">
            <div style="display: flex; justify-content: space-between;">
              <div style="font-size:12px; color:var(--accent); font-weight:700;">${escapeHTML(project.kategori || '')}</div>
              ${project.unggulan ? '<span style="font-size:10px; background:var(--accent); color:white; padding:2px 8px; border-radius:10px;">Unggulan</span>' : ''}
            </div>
            <h3>${escapeHTML(project.judul || '')}</h3>
            <p style="font-size:14px;">${escapeHTML(project.deskripsi || '')}</p>
            <div class="card-tags">
              ${(project.teknologi || []).map(t => `<span class="card-tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="card-actions">
              ${project.tombol?.linkUtama ? `
                <a href="${escapeAttr(project.tombol.linkUtama)}" target="_blank" class="card-btn demo" rel="noopener noreferrer">
                  <svg class="icon" style="width:14px;height:14px;" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  ${escapeHTML(project.tombol.teksUtama || "Buka")}
                </a>
              ` : ''}
              ${project.tombol?.linkSekunder ? `
                <a href="${escapeAttr(project.tombol.linkSekunder)}" target="_blank" class="card-btn" rel="noopener noreferrer">
                   <svg class="icon" style="width:14px;height:14px;" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                   ${escapeHTML(project.tombol.teksSekunder || "Info")}
                </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    setTimeout(() => { animateElementsSequentially('.card', 100); }, 300);
  }

  /* ---------- CONTACT ---------- */
  function renderContact() {
    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up">Hubungi Saya.</h1>

      <form class="contact-form animate-scale-in" onsubmit="portfolio.handleContactSubmit(event)">
        <input type="text" id="name" placeholder="Nama Anda" required maxlength="100">
        <input type="email" id="email" placeholder="Email Anda" required maxlength="200">
        <textarea id="message" placeholder="Pesan Anda..." rows="6" required maxlength="2000"></textarea>
        <button type="submit" class="btn">
          <span id="submit-text">Kirim Pesan</span>
          <span id="submit-loading" style="display:none;">Mengirim...</span>
        </button>
      </form>

      <div class="contact-links-container animate-fade-in-up" style="margin-top: 40px;">
        <p style="color: var(--muted); text-align: center; margin-bottom: 20px;">Atau hubungi via:</p>
        <div class="direct-contact-grid">
          <a href="mailto:${escapeAttr(DATA.kontakLangsung?.email || '')}" class="direct-item">
            <svg class="icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>Email</span>
          </a>
          <a href="https://wa.me/${escapeAttr(DATA.kontakLangsung?.whatsapp?.nomor || '')}" target="_blank" class="direct-item" rel="noopener noreferrer">
            <svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>WhatsApp</span>
          </a>
          <a href="${escapeAttr(DATA.kontakLangsung?.tiktok?.link || '')}" target="_blank" class="direct-item" rel="noopener noreferrer">
            <svg class="icon" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            <span>TikTok</span>
          </a>
        </div>
      </div>
    `;

    const ta = document.getElementById('message');
    if (ta) {
      ta.style.resize = 'vertical';
      ta.style.overflowWrap = 'break-word';
      ta.style.whiteSpace = 'pre-wrap';
      ta.style.wordBreak = 'break-word';
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('.btn');
    const loading = document.getElementById('submit-loading');
    const txt = document.getElementById('submit-text');

    const lastSent = localStorage.getItem('lastMsgTime');
    const now = Date.now();
    if (lastSent && (now - lastSent < 30000)) {
      const wait = Math.ceil((30000 - (now - lastSent)) / 1000);
      showNotif(`Tunggu ${wait} detik lagi sebelum mengirim.`, 'error');
      return;
    }

    txt.style.display = 'none';
    loading.style.display = 'inline';
    btn.disabled = true;

    try {
      const namaEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const pesanEl = document.getElementById('message');

      let nama = namaEl.value.trim();
      let email = emailEl.value.trim();
      let pesan = pesanEl.value.trim();

      if (!nama || !email || !pesan) throw new Error('Data tidak lengkap');

      if (nama.length > 100) nama = nama.slice(0, 100);
      if (email.length > 200) email = email.slice(0, 200);
      if (pesan.length > 1000) pesan = pesan.slice(0, 1000);

      let ipInfo = { ip: 'Hidden', city: 'Unknown', country_name: 'Unknown' };
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          ipInfo = {
            ip: ipData.ip || 'Hidden',
            city: ipData.city || 'Unknown',
            country_name: ipData.country_name || 'Unknown'
          };
        }
      } catch (e) { console.warn('IP Tracking failed', e); }

      function sanitizeInput(str) {
        if (!str) return '';
        str = str.replace(/`/g, "'");
        str = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        return escapeHTML(str);
      }

      const safeNama = sanitizeInput(nama);
      const safeEmail = sanitizeInput(email);
      const safePesan = sanitizeInput(pesan);

      const embedFields = [
        { name: "👤 Pengirim", value: `**${safeNama}**\n${safeEmail}`, inline: true },
        { name: "🌍 Lokasi", value: `${escapeHTML(ipInfo.city)}, ${escapeHTML(ipInfo.country_name)}\nIP: ||${escapeHTML(ipInfo.ip)}||`, inline: true },
        { name: "📝 Isi Pesan", value: (safePesan.length > 1000) ? safePesan.slice(0, 1000) + '…' : safePesan }
      ];

      const payload = {
        username: "ADIT Security Bot",
        avatar_url: DATA.penulis?.foto,
        embeds: [{
          title: "🛡️ Pesan Web Masuk",
          color: 0x4ade80,
          fields: embedFields,
          footer: { text: `Dikirim: ${new Date().toLocaleString('id-ID')}` }
        }]
      };

      const res = await fetch(DATA.kontak?.discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok && res.status !== 204) throw new Error('Server menolak pesan');

      localStorage.setItem('lastMsgTime', Date.now());
      event.target.reset();
      showNotif('Pesan terkirim aman!', 'success');
      if (DATA.fitur?.aktifkanKonfetiKontak) createConfetti();

    } catch (error) {
      console.error(error);
      showNotif('Gagal mengirim: ' + (error.message || 'Unknown'), 'error');
    } finally {
      txt.style.display = 'inline';
      loading.style.display = 'none';
      btn.disabled = false;
    }
  }

  /* ---------- Notifications & Utilities ---------- */
  function showNotif(message, type = "success") {
    const container = document.getElementById('notification-center');

    if (container.children.length >= 4) {
      const oldest = container.firstElementChild;
      oldest.style.opacity = '0';
      setTimeout(() => oldest.remove(), 300);
    }

    const notif = document.createElement('div');
    notif.className = 'ios-notif';

    const icon = type === "success"
      ? `<svg class="icon" style="stroke:var(--success)" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg class="icon" style="stroke:var(--error)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    notif.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`;
    container.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('active'));

    setTimeout(() => {
      notif.classList.remove('active');
      setTimeout(() => notif.remove(), 500);
    }, 4000);
  }

  function toggleTheme() {
    const body = document.body;
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
  }

  function getSocialIcon(key) {
    const i = {
      github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0c-2.4-1.6-3.5-1.3-3.5-1.3a4.2 4.2 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2v3.5"></path>',
      instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>'
    };
    return i[key] || '<circle cx="12" cy="12" r="10"></circle>';
  }

  function createConfetti() {
    // safe confetti without template literal inside template literal
    const c = document.querySelector('.container');
    if (!c) return;
    for (let i = 0; i < 30; i++) {
      const e = document.createElement('div');
      e.style.cssText = 'position:absolute;width:8px;height:8px;background:var(--accent);top:50%;left:50%;pointer-events:none;';
      c.appendChild(e);
      const dx = Math.floor(Math.random() * 200) - 100;
      const dy = Math.floor(Math.random() * 200) - 100;
      const transformTo = 'translate(' + dx + 'px,' + dy + 'px)';
      e.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: transformTo, opacity: 0 }], { duration: 1000 }).onfinish = () => e.remove();
    }
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    // safer for URLs/attrs
    try {
      if (!str) return '';
      return encodeURI(String(str));
    } catch (e) {
      return '';
    }
  }

  return { initialize, renderPage, toggleTheme, handleContactSubmit, showNotif };
})();
