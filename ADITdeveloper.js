// ADITdeveloper.js - Portfolio JavaScript Module
const portfolio = (() => {
  // Data portfolio - akan diisi dari JSON
  let DATA = {};
  
  // DOM Elements
  let elements = {};

  // Inisialisasi aplikasi
  async function initialize() {
    try {
      const response = await fetch('ADITdeveloper.json');
      if (!response.ok) throw new Error('Gagal mengambil JSON');
      DATA = await response.json();
      
      setupElements();
      
      document.body.setAttribute('data-theme', DATA.situs.tema || 'light');
      elements.brandName.innerText = DATA.penulis.nama;
      elements.logoImg.src = DATA.penulis.foto;
      elements.footerText.innerText = `© ${new Date().getFullYear()} ${DATA.penulis.nama} — ${DATA.situs.tagline}`;
      
      renderPage('home');
      
      console.log('Portfolio ADIT initialized successfully!');
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      showNotif('Gagal memuat data portfolio', 'error');
    }
  }

  // Setup DOM elements
  function setupElements() {
    elements = {
      brandName: document.getElementById('brand-name'),
      logoImg: document.getElementById('logo-img'),
      footerText: document.getElementById('footer-text'),
      mainContent: document.getElementById('main-content')
    };
  }

  // Animasi utilitas
  function animateElementsSequentially(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animated');
      }, index * delay);
    });
  }

  // Render halaman
  function renderPage(page) {
    if (!elements.mainContent) return;
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navBtn = document.getElementById(`nav-${page}`);
    if (navBtn) navBtn.classList.add('active');

    elements.mainContent.classList.remove('animate-fade-in-up');
    void elements.mainContent.offsetWidth; // Trigger reflow
    elements.mainContent.classList.add('animate-fade-in-up');

    switch(page) {
      case 'home': renderHome(); break;
      case 'projects': renderProjects(); break;
      case 'contact': renderContact(); break;
      default: renderHome();
    }
  }

  // Render halaman home
  function renderHome() {
    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">${DATA.penulis.nama}.</h1>
      <p class="animate-fade-in-up" style="animation-delay: 0.2s">${DATA.penulis.bioSingkat}</p>
      
      <div class="skill-pills stagger-child" style="animation-delay: 0.3s">
        ${DATA.penulis.keahlian.map(s => `<span class="pill">${s}</span>`).join('')}
      </div>
      
      <div class="social-links stagger-child" style="margin-top: 30px; animation-delay: 0.4s">
        ${Object.entries(DATA.sosial || {})
          .filter(([_, value]) => value.terlihat)
          .map(([key, value]) => `
            <a href="${value.tautan}" target="_blank" class="social-link" title="${key}">
              <svg class="icon" viewBox="0 0 24 24">${getSocialIcon(key)}</svg>
              ${value.username}
            </a>
          `).join('')}
      </div>
      
      ${DATA.situs.tampilkanResume ? `
        <div class="resume-section animate-fade-in-up" style="animation-delay: 0.5s; margin-top: 30px;">
          <a href="${DATA.penulis.tautanResume}" target="_blank" class="btn" style="width: auto; display: inline-flex; align-items: center; gap: 8px;">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Lihat Resume
          </a>
        </div>
      ` : ''}
      
      <div class="timeline">
        <h2 style="margin-bottom:20px; font-size:24px;" class="animate-fade-in-up" style="animation-delay: 0.6s">Perjalanan</h2>
        ${DATA.linimasa.map((item, index) => `
          <div class="timeline-item" style="animation-delay: ${0.7 + (index * 0.1)}s">
            <div class="timeline-year">${item.tahun}</div>
            <div>
              <div style="font-weight:700">${item.peran}</div>
              <div style="color:var(--muted); font-size:14px;">${item.deskripsi}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    setTimeout(() => { animateElementsSequentially('.timeline-item', 150); }, 700);
  }

  // Render halaman projects
  function renderProjects() {
    const visibleProjects = (DATA.proyek || []).filter(p => p.terlihat);
    const maxProjects = DATA.situs.maksProyekPerHalaman || 9;
    const projectsToShow = visibleProjects.slice(0, maxProjects);
    
    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">Projek Kreatif.</h1>
      <p class="animate-fade-in-up" style="animation-delay: 0.2s">Kumpulan karya dalam pengembangan web dan game interaktif.</p>
      
      <div class="project-grid">
        ${projectsToShow.map((project, index) => `
          <div class="card" style="animation-delay: ${0.3 + (index * 0.1)}s">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="font-size:12px; color:var(--accent); font-weight:700;">${project.kategori} — ${project.tahun}</div>
              ${project.unggulan ? '<span style="font-size:10px; background:var(--accent); color:white; padding:2px 8px; border-radius:10px;">Unggulan</span>' : ''}
            </div>
            <h3>${project.judul}</h3>
            <p style="font-size:14px;">${project.deskripsi}</p>
            <div class="card-tags">
              ${project.teknologi.map(t => `<span class="card-tag">${t}</span>`).join('')}
            </div>
            <div class="card-actions">
              ${project.demo ? `
                <a href="${project.demo}" target="_blank" class="card-btn demo">
                  <svg class="icon" style="width:14px;height:14px;" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Demo
                </a>
              ` : ''}
              ${project.repositori ? `
                <a href="${project.repositori}" target="_blank" class="card-btn">
                  <svg class="icon" style="width:14px;height:14px;" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path></svg>
                  Kode
                </a>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      
      ${visibleProjects.length > maxProjects ? `
        <div style="text-align: center; margin-top: 30px;" class="animate-fade-in-up">
          <button class="btn" style="width: auto; padding: 12px 24px;" onclick="portfolio.loadMoreProjects()">
            Muat Lebih Banyak (${visibleProjects.length - maxProjects} tersisa)
          </button>
        </div>
      ` : ''}
    `;
    
    setTimeout(() => { animateElementsSequentially('.card', 100); }, 300);
  }

  // Render halaman contact
  function renderContact() {
    elements.mainContent.innerHTML = `
      <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">Mari Berdiskusi.</h1>
      <p class="animate-fade-in-up" style="animation-delay: 0.2s">Punya ide gila? Mari kita wujudkan dalam bentuk kode.</p>
      
      <form class="contact-form animate-scale-in" onsubmit="portfolio.handleContactSubmit(event)">
        <input type="text" id="name" placeholder="Nama Anda" required>
        <input type="email" id="email" placeholder="Email Anda" required>
        <textarea id="message" placeholder="Apa yang ingin Anda bangun?" rows="5" required></textarea>
        <button type="submit" class="btn">
          <span id="submit-text">Kirim Sekarang</span>
          <span id="submit-loading" style="display:none;">Mengirim...</span>
        </button>
      </form>
      
      <div class="contact-info animate-fade-in-up" style="margin-top: 30px; text-align: center;">
        <p style="color: var(--muted);">Atau hubungi saya langsung di:</p>
        <a href="mailto:${DATA.penulis.email}" style="color: var(--accent); font-weight: 600; text-decoration: none;">${DATA.penulis.email}</a>
      </div>
    `;
    
    if (DATA.fitur?.aktifkanKonfetiKontak) {
      setTimeout(() => { createConfetti(); }, 500);
    }
  }

  // Handle submit kontak (DISCORD WEBHOOK SYSTEM)
  async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    // Ambil data
    const nama = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('message').value.trim();

    if (!nama || !email || !pesan) {
        showNotif('Mohon lengkapi semua kolom.', 'error');
        return;
    }
    
    // UI Loading
    if (submitText) submitText.style.display = 'none';
    if (submitLoading) submitLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    const webhookURL = DATA.kontak?.discordWebhook;

    if (!webhookURL) {
        showNotif('Error: Webhook URL tidak ditemukan.', 'error');
        resetBtn();
        return;
    }

    // Payload Embed Discord
    const payload = {
        username: "ADIT Portfolio",
        avatar_url: DATA.penulis.foto,
        embeds: [
            {
                title: "📬 Pesan Baru dari Website",
                color: 6333946, // Warna Accent
                fields: [
                    { name: "👤 Pengirim", value: nama, inline: true },
                    { name: "📧 Email", value: email, inline: true },
                    { name: "📝 Pesan", value: pesan }
                ],
                footer: { text: "Dikirim via Portfolio" },
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 204) {
            form.reset();
            showNotif('Pesan berhasil terkirim!', 'success');
            if (DATA.fitur?.aktifkanKonfetiKontak) createConfetti();
        } else {
            throw new Error('Gagal mengirim.');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotif('Gagal koneksi ke server pesan.', 'error');
    } finally {
        resetBtn();
    }

    function resetBtn() {
        if (submitText) submitText.style.display = 'inline';
        if (submitLoading) submitLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
  }

  // Toggle tema
  function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    showNotif(`Mode ${next === 'dark' ? 'Gelap' : 'Terang'} Aktif`);
  }

  // Show notification (NO EMOJI IN WEB, ICONS ONLY)
  function showNotif(message, type = "success") {
    const container = document.getElementById('notification-center');
    const notif = document.createElement('div');
    notif.className = 'ios-notif';
    
    const icon = type === "success" 
      ? `<svg class="icon" style="stroke: var(--success)" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg class="icon" style="stroke: var(--error)" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    notif.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(notif);

    setTimeout(() => notif.classList.add('active'), 10);
    setTimeout(() => {
      notif.classList.remove('active');
      setTimeout(() => notif.remove(), 500);
    }, 3000);
  }

  // Get social icon SVG
  function getSocialIcon(platform) {
    const icons = {
      github: `<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>`,
      linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0 -2 -2a2 2 0 0 0 -2 2v7h-4v-7a6 6 0 0 1 6 -6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>`,
      instagram: `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`,
      twitter: `<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>`,
      youtube: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>`
    };
    return icons[platform] || `<circle cx="12" cy="12" r="10"></circle>`;
  }

  // Create confetti effect
  function createConfetti() {
    const confettiCount = 50;
    const container = document.querySelector('.container');
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.background = ['#60a5fa', '#4ade80', '#f87171', '#fbbf24', '#c084fc', '#22d3ee'][Math.floor(Math.random() * 6)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.top = '50%';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.opacity = '0';
      confetti.style.zIndex = '9998';
      confetti.style.pointerEvents = 'none';
      container.appendChild(confetti);
      const animation = confetti.animate([
        { opacity: 0, transform: 'translate(0, 0) rotate(0deg)' },
        { opacity: 1, transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)` },
        { opacity: 0, transform: `translate(${Math.random() * 300 - 150}px, 500px) rotate(${Math.random() * 720}deg)` }
      ], { duration: 2000 + Math.random() * 1000, easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.2)' });
      animation.onfinish = () => confetti.remove();
    }
  }

  // Load more projects
  function loadMoreProjects() {
    showNotif('Semua projek sudah ditampilkan.', 'error');
  }

  // Public API
  return {
    initialize, renderPage, toggleTheme, handleContactSubmit, loadMoreProjects, showNotif
  };
})();
