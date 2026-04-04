// ═══════════════════════════════════════
// JOIAFLIX — App Controller
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initHero();
  initCategories();
  renderSections();
  initSearch();
  initModal();
  updateStats();
});

// ─── Particles ───
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = 4 + Math.random() * 4 + 's';
    p.style.width = p.style.height = 1 + Math.random() * 3 + 'px';
    container.appendChild(p);
  }
}

// ─── Navbar scroll ───
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ─── Hero featured video ───
function initHero() {
  const featured = VIDEOS.find(v => v.categories.includes('destaques'));
  if (!featured) return;

  const heroEl = document.querySelector('.hero');
  const bg = heroEl.querySelector('.hero-bg');
  bg.style.backgroundImage = `
    linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,1) 100%),
    linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0) 60%),
    url(https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg)
  `;

  heroEl.querySelector('.hero-title .main').textContent = featured.title;
  heroEl.querySelector('.hero-description').textContent = featured.description;
  heroEl.querySelector('.hero-meta .rating').textContent = '★ ' + featured.rating;
  heroEl.querySelector('.hero-meta .year').textContent = featured.year;
  heroEl.querySelector('.hero-meta .duration').textContent = featured.duration;
  heroEl.querySelector('.hero-meta .source').textContent = featured.source;

  const playBtn = heroEl.querySelector('.btn-primary');
  playBtn.addEventListener('click', () => openModal(featured));

  const infoBtn = heroEl.querySelector('.btn-secondary');
  infoBtn.addEventListener('click', () => openModal(featured));
}

// ─── Category Tabs ───
let activeCategory = null;

function initCategories() {
  const container = document.querySelector('.category-tabs');
  const allTab = document.createElement('div');
  allTab.className = 'category-tab active';
  allTab.textContent = '🎬 Todos';
  allTab.dataset.category = 'all';
  allTab.addEventListener('click', () => setCategory(null, allTab));
  container.appendChild(allTab);

  CATEGORIES.forEach(cat => {
    const tab = document.createElement('div');
    tab.className = 'category-tab';
    tab.textContent = cat.icon + ' ' + cat.name;
    tab.dataset.category = cat.id;
    tab.addEventListener('click', () => setCategory(cat.id, tab));
    container.appendChild(tab);
  });
}

function setCategory(catId, tab) {
  activeCategory = catId;
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  const homeView = document.getElementById('home-view');
  const gridView = document.getElementById('grid-view');
  const searchQuery = document.querySelector('.search-box input').value.trim();

  if (!catId && !searchQuery) {
    homeView.style.display = 'block';
    gridView.classList.remove('active');
  } else {
    homeView.style.display = 'none';
    gridView.classList.add('active');
    renderGrid(catId, searchQuery);
  }
}

// ─── Render Category Sections (Home) ───
function renderSections() {
  const container = document.getElementById('home-view');
  container.innerHTML = '';

  let sectionIndex = 0;
  CATEGORIES.forEach(cat => {
    const videos = VIDEOS.filter(v => v.categories.includes(cat.id));
    if (videos.length === 0) return;

    // Insert inline Orion Gold banner after 3rd category
    if (sectionIndex === 3) {
      const adInline = document.createElement('a');
      adInline.href = 'https://www.oriongold.com.br';
      adInline.target = '_blank';
      adInline.rel = 'noopener';
      adInline.className = 'ad-banner ad-banner-inline';
      adInline.innerHTML = `
        <div class="ad-banner-inner">
          <div class="ad-banner-logo">
            <span class="ad-brand">ORION</span><span class="ad-brand-gold">GOLD</span>
          </div>
          <div class="ad-banner-text">
            <span class="ad-headline">Compra e venda de ouro com procedência — Joias, Prata 925 e Metais Preciosos</span>
            <span class="ad-sub">www.oriongold.com.br — Serra/ES</span>
          </div>
          <div class="ad-banner-cta">
            <span class="ad-btn">Conheça</span>
            <a href="https://www.instagram.com/oriongold_co" target="_blank" rel="noopener" class="ad-instagram" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              @oriongold_co
            </a>
          </div>
        </div>
      `;
      container.appendChild(adInline);
    }

    const label = cat.id === 'filmes' ? 'filmes' : 'vídeos';

    const section = document.createElement('div');
    section.className = 'content-section';
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">
          <span class="icon">${cat.icon}</span>
          ${cat.name}
          <span class="section-count">${videos.length} ${label}</span>
        </h2>
      </div>
      <div class="video-row"></div>
    `;

    const row = section.querySelector('.video-row');
    videos.forEach(v => row.appendChild(createCard(v)));

    container.appendChild(section);
    sectionIndex++;
  });
}

// ─── Render Grid ───
function renderGrid(catId, query) {
  const grid = document.querySelector('.video-grid');
  grid.innerHTML = '';

  let filtered = VIDEOS;
  if (catId) {
    filtered = filtered.filter(v => v.categories.includes(catId));
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.source.toLowerCase().includes(q) ||
      (v.type && v.type.toLowerCase().includes(q)) ||
      v.categories.some(c => {
        const cat = CATEGORIES.find(ct => ct.id === c);
        return cat && cat.name.toLowerCase().includes(q);
      })
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="icon">🔍</div>
        <p>Nenhum vídeo encontrado</p>
      </div>
    `;
    return;
  }

  filtered.forEach(v => grid.appendChild(createCard(v)));
}

// ─── Create Video Card ───
function createCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';
  if (video.type === 'filme') card.classList.add('is-movie');

  const langClass = video.language === 'Português' ? 'pt' :
                    video.language === 'Espanhol' ? 'es' :
                    video.language === 'Francês' ? 'fr' :
                    video.language === 'Mudo' ? 'pt' : 'en';

  const langLabel = video.language === 'Português' ? 'PT-BR' :
                    video.language === 'Espanhol' ? 'ES' :
                    video.language === 'Francês' ? 'FR' :
                    video.language === 'Mudo' ? 'MUDO' : 'EN';

  const movieBadge = video.type === 'filme'
    ? '<span class="card-badge-movie">FILME</span>'
    : '';

  card.innerHTML = `
    <div class="card-thumbnail">
      <img src="https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg"
           alt="${video.title}"
           loading="lazy"
           onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 180%22><rect fill=%22%231a1a1a%22 width=%22320%22 height=%22180%22/><text fill=%22%23666%22 x=%22160%22 y=%2295%22 text-anchor=%22middle%22 font-size=%2214%22>Joiaflix</text></svg>'">
      ${movieBadge}
      <span class="card-language ${langClass}">${langLabel}</span>
      <span class="card-duration">${video.duration}</span>
      <div class="card-play-icon">
        <div class="play-circle">▶</div>
      </div>
    </div>
    <div class="card-info">
      <div class="card-source">${video.source}</div>
      <div class="card-title">${video.title}</div>
      <div class="card-meta">
        <span class="star">★ ${video.rating}</span>
        <span class="dot"></span>
        <span>${video.year}</span>
        <span class="dot"></span>
        <span>${video.subtitles}</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => openModal(video));
  return card;
}

// ─── Search ───
function initSearch() {
  const box = document.querySelector('.search-box');
  const input = box.querySelector('input');
  const btn = box.querySelector('button');

  btn.addEventListener('click', () => {
    box.classList.toggle('open');
    if (box.classList.contains('open')) {
      input.focus();
    } else {
      input.value = '';
      resetView();
    }
  });

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      const homeView = document.getElementById('home-view');
      const gridView = document.getElementById('grid-view');

      if (q.length === 0 && !activeCategory) {
        homeView.style.display = 'block';
        gridView.classList.remove('active');
      } else {
        homeView.style.display = 'none';
        gridView.classList.add('active');
        renderGrid(activeCategory, q);
      }
    }, 250);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      box.classList.remove('open');
      resetView();
    }
  });
}

function resetView() {
  if (!activeCategory) {
    document.getElementById('home-view').style.display = 'block';
    document.getElementById('grid-view').classList.remove('active');
  }
}

// ─── Modal ───
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = overlay.querySelector('.modal-close');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(video) {
  const overlay = document.querySelector('.modal-overlay');
  const iframe = overlay.querySelector('.modal-player iframe');
  const subtitleParam = (video.language !== 'Português' && video.language !== 'Mudo')
    ? '&cc_load_policy=1&cc_lang_pref=pt' : '';

  iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1${subtitleParam}`;

  overlay.querySelector('.modal-source').textContent = video.source;
  overlay.querySelector('.modal-title').textContent = video.title;
  overlay.querySelector('.modal-description').textContent = video.description;
  overlay.querySelector('.modal-meta .rating').textContent = '★ ' + video.rating;
  overlay.querySelector('.modal-meta .year').textContent = video.year;
  overlay.querySelector('.modal-meta .duration').textContent = video.duration;
  overlay.querySelector('.modal-meta .language').textContent = video.language;
  overlay.querySelector('.modal-meta .subtitles').textContent = video.subtitles;

  // Show subtitle tip for non-Portuguese videos
  const tip = overlay.querySelector('.modal-subtitle-tip');
  if (video.language !== 'Português' && video.language !== 'Mudo') {
    tip.style.display = 'flex';
  } else {
    tip.style.display = 'none';
  }

  // Update YouTube link button
  const ytLink = overlay.querySelector('.modal-yt-link');
  ytLink.href = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  const iframe = overlay.querySelector('.modal-player iframe');
  iframe.src = '';
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── Stats ───
function updateStats() {
  const total = VIDEOS.length;
  const movies = VIDEOS.filter(v => v.type === 'filme').length;
  const docs = total - movies;
  const sources = [...new Set(VIDEOS.map(v => v.source))].length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-docs').textContent = docs;
  document.getElementById('stat-movies').textContent = movies;
  document.getElementById('stat-sources').textContent = sources;
}
