/* ============================================================
   English in Motion — application logic
   ============================================================ */
(function () {
  'use strict';

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- 01 ATLAS ---------- */
  const atlasTabs = document.getElementById('atlas-tabs');
  const atlasPanel = document.getElementById('atlas-panel');

  function renderAtlasPanel(item) {
    atlasPanel.innerHTML = `
      <span class="atlas-tag">${esc(item.tag)}</span>
      <h3>${esc(item.label)}</h3>
      <p class="atlas-def">${esc(item.definition)}</p>
      <p class="atlas-example">“${esc(item.example)}”</p>
      <p class="atlas-meaning"><strong>Meaning.</strong> ${esc(item.meaning)}</p>
      <div class="atlas-facts">
        <div class="fact-box fact-observe"><h4>Observable feature</h4><p>${esc(item.feature)}</p></div>
        <div class="fact-box fact-limit"><h4>Interpretive limit</h4><p>${esc(item.limit)}</p></div>
      </div>`;
  }

  ATLAS.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'atlas-tab';
    btn.id = 'atlas-tab-' + item.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', 'atlas-panel');
    btn.tabIndex = i === 0 ? 0 : -1;
    btn.textContent = item.label;
    btn.addEventListener('click', () => selectAtlasTab(i));
    btn.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % ATLAS.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + ATLAS.length) % ATLAS.length;
      if (n !== null) { e.preventDefault(); selectAtlasTab(n); atlasTabs.children[n].focus(); }
    });
    atlasTabs.appendChild(btn);
  });

  function selectAtlasTab(i) {
    [...atlasTabs.children].forEach((t, j) => {
      t.setAttribute('aria-selected', j === i ? 'true' : 'false');
      t.tabIndex = j === i ? 0 : -1;
    });
    renderAtlasPanel(ATLAS[i]);
  }
  atlasPanel.setAttribute('aria-labelledby', 'atlas-tab-' + ATLAS[0].id);
  renderAtlasPanel(ATLAS[0]);

  /* ---------- 02 ARCHIVE ---------- */
  const CATS = ['All', 'Code-switching', 'Hybrid forms', 'Abbreviations', 'Slang', 'Digital tone', 'English varieties'];
  const CHIP = {
    'Code-switching': 'chip-code', 'Hybrid forms': 'chip-hybrid', 'Abbreviations': 'chip-abbr',
    'Slang': 'chip-slang', 'Digital tone': 'chip-tone', 'English varieties': 'chip-var'
  };
  const searchInput = document.getElementById('archive-search');
  const filterRow = document.getElementById('archive-filters');
  const countEl = document.getElementById('archive-count');
  const grid = document.getElementById('archive-grid');
  let activeCat = 'All';

  CATS.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'filter-btn';
    b.textContent = c;
    b.setAttribute('aria-pressed', c === 'All' ? 'true' : 'false');
    b.addEventListener('click', () => {
      activeCat = c;
      [...filterRow.children].forEach((x) => x.setAttribute('aria-pressed', x.textContent === c ? 'true' : 'false'));
      renderArchive();
    });
    filterRow.appendChild(b);
  });

  searchInput.addEventListener('input', renderArchive);

  function renderArchive() {
    const q = searchInput.value.trim().toLowerCase();
    const items = ARCHIVE.filter((it) => {
      const catOk = activeCat === 'All' || it.cat === activeCat;
      const qOk = !q || (it.ex + ' ' + it.meaning + ' ' + it.cat + ' ' + it.feature).toLowerCase().includes(q);
      return catOk && qOk;
    });
    countEl.textContent = q || activeCat !== 'All'
      ? `${items.length} of ${ARCHIVE.length} examples shown`
      : `${ARCHIVE.length} examples`;
    if (!items.length) {
      grid.innerHTML = '<p class="archive-empty">No examples found. Try another search term.</p>';
      return;
    }
    grid.innerHTML = items.map((it) => `
      <article class="archive-card">
        <span class="cat-chip ${CHIP[it.cat]}">${esc(it.cat).toUpperCase()}</span>
        <p class="archive-ex">“${esc(it.ex)}”</p>
        <p class="archive-meaning">${esc(it.meaning)}</p>
        <details>
          <summary>OPEN ANALYSIS</summary>
          <div class="analysis-block">
            <h5 class="observe">Observable feature</h5>
            <p>${esc(it.feature)}</p>
            <h5 class="limit">Interpretive limit</h5>
            <p>${esc(it.limit)}</p>
            ${it.ref ? `<h5 class="observe">Reference</h5><p><a href="${esc(it.ref.url)}" target="_blank" rel="noopener noreferrer">${esc(it.ref.label)} ↗</a></p>` : ''}
          </div>
        </details>
      </article>`).join('');
  }
  renderArchive();

  /* ---------- 03 CLAIMS ---------- */
  const claimsList = document.getElementById('claims-list');
  CLAIMS.forEach((c, i) => {
    const card = document.createElement('article');
    card.className = 'claim-card';
    const bodyId = 'claim-body-' + i;
    card.innerHTML = `
      <h3 style="margin:0">
        <button class="claim-head" aria-expanded="false" aria-controls="${bodyId}">
          <span class="claim-text">${esc(c.claim)}</span>
          <span class="claim-toggle" aria-hidden="true">+</span>
        </button>
      </h3>
      <div class="claim-body" id="${bodyId}" hidden>
        <div><h4>Why it needs testing</h4><p>${esc(c.why)}</p></div>
        <div><h4>Evidence needed</h4><p>${esc(c.evidence)}</p></div>
        <div class="claim-cautious"><h4>Cautious wording</h4><p>${esc(c.cautious)}</p></div>
      </div>`;
    const head = card.querySelector('.claim-head');
    const body = card.querySelector('.claim-body');
    const toggle = card.querySelector('.claim-toggle');
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
      toggle.textContent = open ? '+' : '–';
    });
    claimsList.appendChild(card);
  });

  /* ---------- 04 SIGNALS ---------- */
  const nodesEl = document.getElementById('signal-nodes');
  const readoutEl = document.getElementById('signal-readout');

  function renderReadout(s) {
    readoutEl.innerHTML = `
      <span class="readout-tag">SIGNAL / ${esc(s.tag)}</span>
      <h3>${esc(s.node)}</h3>
      <div class="readout-block"><h4>Possible function</h4><p>${esc(s.fn)}</p></div>
      <div class="readout-block"><h4>Research question</h4><p>${esc(s.q)}</p></div>
      <div class="readout-block caution"><h4>Caution</h4><p>${esc(s.caution)}</p></div>`;
  }
  SIGNALS.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'signal-node';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.innerHTML = `<span class="node-name">${esc(s.node)}</span><span class="node-tag">${esc(s.tag)}</span>`;
    b.addEventListener('click', () => {
      [...nodesEl.children].forEach((x) => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      renderReadout(s);
    });
    nodesEl.appendChild(b);
  });
  renderReadout(SIGNALS[0]);

  /* ---------- 05 CASE FILE ---------- */
  const caseTabs = document.getElementById('case-tabs');
  const casePanel = document.getElementById('case-panel');

  function renderCase(c) {
    casePanel.innerHTML = `
      <p class="case-statement">${esc(c.statement)}</p>
      <div class="case-row"><h4>Explanation</h4><p>${esc(c.explanation)}</p></div>
      <div class="case-row"><h4>Limit</h4><p>${esc(c.limit)}</p></div>`;
  }
  CASEFILE.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'case-tab';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.textContent = c.label;
    b.addEventListener('click', () => {
      [...caseTabs.children].forEach((x) => x.setAttribute('aria-selected', 'false'));
      b.setAttribute('aria-selected', 'true');
      renderCase(c);
    });
    caseTabs.appendChild(b);
  });
  renderCase(CASEFILE[0]);

  /* ---------- 06 SOURCES ---------- */
  const sourcesGrid = document.getElementById('sources-grid');
  SOURCES.forEach((s) => {
    const a = document.createElement('a');
    a.className = 'source-card';
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <span class="source-label">${esc(s.label)}</span>
      <p class="source-title">${esc(s.title)}</p>
      <p class="source-authors">${esc(s.authors)}</p>
      <span class="source-link">OPEN SOURCE ↗</span>`;
    sourcesGrid.appendChild(a);
  });

  /* ---------- MATERIALS (video) ---------- */
  const materialsGrid = document.getElementById('materials-grid');

  function embedUrl(item) {
    if (item.youtube) {
      let m = String(item.youtube).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
      if (m) return { type: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + m[1] };
      if (/^[\w-]{6,}$/.test(item.youtube)) return { type: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + item.youtube };
    }
    if (item.vimeo) {
      let m = String(item.vimeo).match(/vimeo\.com\/(\d+)/);
      if (m) return { type: 'iframe', src: 'https://player.vimeo.com/video/' + m[1] };
    }
    if (item.mp4) return { type: 'video', src: item.mp4 };
    return null;
  }

  if (!MATERIALS.length) {
    materialsGrid.innerHTML = `
      <div class="materials-empty">
        <strong>No videos yet.</strong> To add one, open <code>materials.js</code> in the site folder and add a line, e.g.
        <code>{ title: "My video", youtube: "https://youtu.be/VIDEO_ID" }</code> —
        YouTube, Vimeo, and MP4 links are supported. Save, deploy to Netlify, and the video appears here automatically.
      </div>`;
  } else {
    MATERIALS.forEach((item) => {
      const em = embedUrl(item);
      const card = document.createElement('article');
      card.className = 'material-card';
      let media = '';
      if (em && em.type === 'iframe') {
        media = `<iframe src="${esc(em.src)}" title="${esc(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else if (em && em.type === 'video') {
        media = `<video src="${esc(em.src)}" controls playsinline preload="metadata" aria-label="Video"></video>`;
      } else {
        media = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f6f1e7;font-size:.85rem;padding:1rem;text-align:center;">Unsupported video link — check materials.js</div>`;
      }
      const bodyHtml = (item.title || item.desc) ? `
        <div class="material-body">
          ${item.title ? `<h3 class="material-title">${esc(item.title)}</h3>` : ''}
          ${item.desc ? `<p class="material-desc">${esc(item.desc)}</p>` : ''}
        </div>` : '';
      card.innerHTML = `
        <div class="material-media">${media}</div>${bodyHtml}`;
      materialsGrid.appendChild(card);
    });
  }

  /* ---------- MY ACHIEVEMENTS (gallery) ---------- */
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && typeof GALLERY !== 'undefined') {
    GALLERY.forEach((item) => {
      const fig = document.createElement('figure');
      fig.className = 'gallery-item' + (item.caption ? ' gallery-item--doc' : '');
      fig.innerHTML = `
        <a href="${esc(item.img)}" target="_blank" rel="noopener noreferrer">
          <img src="${esc(item.img)}" alt="${esc(item.caption || 'Achievement photo')}" loading="lazy"
               onerror="this.closest('figure').style.display='none'">
        </a>
        ${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}`;
      galleryGrid.appendChild(fig);
    });
  }

  /* ---------- scroll reveal + active nav ---------- */
  const revealEls = document.querySelectorAll('.section-head, .atlas-panel, .archive-card, .claim-card, .signal-field, .case-panel, .method-table-wrap, .source-card, .material-card, .gallery-item, .author-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => { el.classList.add('reveal'); io.observe(el); });

    const links = [...document.querySelectorAll('.site-nav a')];
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          const a = map.get(e.target.id); if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
})();
