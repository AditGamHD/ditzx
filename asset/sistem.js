(function() {
    const _u = "aHR0cHM6Ly9kaXR6eC5teS5pZA==";
    const _f = ["index.html", "asset/style.css", "asset/sistem.js", "asset/aditdeveloper.json"];
    let _d = null;
    
    const d = document;
    const w = window;
    
    function b64_decode(s) { return atob(s); }
    function redir() { 
        d.body.innerHTML = `<div class="copyright-guard"><h1>ACCESS DENIED</h1><p>Security Check Failed</p><p>© 2025 Adit Developer</p><br><a href="${b64_decode(_u)}" style="color:#0f0;border:1px solid #0f0;padding:10px 20px;text-decoration:none;border-radius:5px;">GO TO OFFICIAL SITE</a></div>`;
        throw new Error("Halt");
    }

    async function integritaKontrolo(jsonString) {
        if (!crypto || !crypto.subtle) return true; 
        const msgBuffer = new TextEncoder().encode(jsonString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.length > 0;
    }

    function nomoFiksita() {
        const scripts = d.getElementsByTagName('script');
        let found = false;
        for(let s of scripts) {
            if(s.src.includes('asset/sistem.js')) found = true;
        }
        const styles = d.getElementsByTagName('link');
        let sFound = false;
        for(let l of styles) {
            if(l.href.includes('asset/style.css')) sFound = true;
        }
        if(!found || !sFound) redir();
    }

    function antiEksploro() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) redir();
    }

    function tempoKontrolo() {
        const t = performance.timing;
        if(t) {
            const loadTime = t.loadEventEnd - t.navigationStart;
            if (loadTime < 0) redir();
        }
    }

    function ressursoSiguro(data) {
        if (!data.site || !data.owner || !data.projects) redir();
        if (!data.site.logo) redir();
    }

    async function init() {
        try {
            nomoFiksita();
            
            setInterval(antiEksploro, 2000);
            tempoKontrolo();

            const response = await fetch('asset/aditdeveloper.json');
            if (!response.ok) throw new Error("Fetch failed");
            
            const text = await response.text();
            
            await integritaKontrolo(text); 
            
            _d = JSON.parse(text);
            
            ressursoSiguro(_d);
            renderApp();
            
        } catch (e) {
            console.error(e);
            redir();
        }
    }

    function renderApp() {
        const app = d.getElementById('app');
        const s = _d.site;
        const o = _d.owner;
        
        const logoSvg = s.logo.startsWith('data:') ? `<img src="${s.logo}" class="logo-img" alt="Logo">` : s.logo;

        let themeBtn = `<button class="theme-toggle" id="themeSwitch" aria-label="Toggle Theme">
           <svg class="icon-inline" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
        </button>`;

        let nav = `<nav>
            <div class="logo-container">${logoSvg} <span>${s.shortName}</span></div>
            ${themeBtn}
        </nav>`;

        let hero = `<header class="hero">
            <h1>${o.name}</h1>
            <p>${s.tagline}</p>
            <a href="#contact" class="btn">Contact Me</a> &nbsp; 
            <a href="${o.cv}" target="_blank" class="btn" style="background:transparent;border:2px solid var(--primary-color);color:var(--text-color)">Download CV</a>
        </header>`;

        let cats = _d.categories.map(c => `<button class="filter-btn ${c==='All'?'active':''}" onclick="window.filter('${c}')">${c}</button>`).join('');
        
        let projects = `<section id="projects">
            <div class="section-title">Projects</div>
            <div class="filters">${cats}</div>
            <div class="grid" id="projectGrid">
                ${_d.projects.map(p => renderCard(p)).join('')}
            </div>
        </section>`;

        let socialHtml = o.social.map(soc => `<a href="${soc.url}" target="_blank" title="${soc.name}">${getIcon(soc.name)}</a>`).join('');

        let contact = `<section id="contact">
            <div class="section-title">Contact</div>
            <div style="text-align:center; max-width:500px; margin:0 auto;">
                <p>${o.about}</p>
                <div class="social-links" style="margin: 2rem 0;">${socialHtml}</div>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    ${_d.contacts.map(c => `<div style="padding:1rem; border:1px solid var(--glass-border); border-radius:8px;"><strong>${c.label}:</strong> ${c.value}</div>`).join('')}
                </div>
            </div>
        </section>`;

        let footer = `<footer>
            <p>${_d.ui.copyrightText}</p>
        </footer>`;

        let modal = `<div class="modal-overlay" id="modalOverlay">
            <div class="modal">
                <button class="close-modal" onclick="window.closeModal()">&times;</button>
                <h2 id="mTitle"></h2>
                <p id="mCat" style="color:var(--primary-color); margin-bottom:1rem;"></p>
                <img id="mImg" src="" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem; display:none;">
                <p id="mDesc" style="margin-bottom:1rem;"></p>
                <div id="mLinks"></div>
            </div>
        </div>`;

        let toastBox = `<div class="toast-container" id="toastContainer"></div>`;

        app.innerHTML = nav + hero + projects + contact + footer + modal + toastBox;

        setupEvents();
        setTheme(s.theme);
    }

    function renderCard(p) {
        return `<div class="card" data-cat="${p.category}" onclick="window.openModal('${p.id}')">
            <img src="${p.thumbnail}" class="card-img" alt="${p.title}" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${p.title}</h3>
                <span class="card-tag">${p.category}</span>
            </div>
        </div>`;
    }

    function getIcon(name) {
        const icons = {
            "GitHub": '<svg class="social-icon" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.6-3.96-1.44-3.96-1.44-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.83 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
            "LinkedIn": '<svg class="social-icon" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
        };
        return icons[name] || `<svg class="social-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;
    }

    function setupEvents() {
        const btn = d.getElementById('themeSwitch');
        btn.onclick = () => {
            const current = d.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        };
    }

    function setTheme(t) {
        d.documentElement.setAttribute('data-theme', t);
    }

    w.filter = function(cat) {
        const btns = d.querySelectorAll('.filter-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        
        const cards = d.querySelectorAll('.card');
        cards.forEach(c => {
            if (cat === 'All' || c.dataset.cat === cat) {
                c.style.display = 'block';
                setTimeout(()=>c.style.opacity=1, 10);
            } else {
                c.style.opacity = '0';
                setTimeout(()=>c.style.display='none', 300);
            }
        });
        showToast(`Showing ${cat} projects`);
    };

    w.openModal = function(id) {
        const p = _d.projects.find(x => x.id === id);
        if(!p) return;
        d.getElementById('mTitle').innerText = p.title;
        d.getElementById('mCat').innerText = p.category;
        d.getElementById('mDesc').innerText = p.description;
        const img = d.getElementById('mImg');
        if(p.thumbnail && !p.thumbnail.startsWith('data:image/svg')) {
            img.src = p.thumbnail;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
        
        let links = '';
        if(p.demo) links += `<a href="${p.demo}" target="_blank" class="btn">Live Demo</a> `;
        if(p.repo) links += `<a href="${p.repo}" target="_blank" class="btn" style="background:#333;">GitHub</a>`;
        d.getElementById('mLinks').innerHTML = links;
        
        d.getElementById('modalOverlay').classList.add('active');
    };

    w.closeModal = function() {
        d.getElementById('modalOverlay').classList.remove('active');
    };

    function showToast(msg) {
        const c = d.getElementById('toastContainer');
        const t = d.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<svg style="width:20px;fill:#2ecc71" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> <span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            setTimeout(()=>t.remove(), 300);
        }, 3000);
    }

    d.addEventListener('DOMContentLoaded', init);
})();
