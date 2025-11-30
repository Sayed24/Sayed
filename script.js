/* ========= Portfolio main script =========
   Handles UI, dynamic rendering, modals, and interactions.
   Defer loading in HTML so DOM is ready.
========================================== */

/* ------------------ Helpers ------------------ */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const el = (tag, attrs = {}) => {
  const d = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => d.setAttribute(k, v));
  return d;
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ------------------ DOM refs ------------------ */
const typedEl = $('#typed-text');
const darkToggle = $('#darkModeToggle');
const backTop = $('#backToTop');
const mobileToggle = $('#mobileToggle');
const navLinks = $('#navLinks');
const projectGrid = $('#projectsGrid');
const filterBtns = () => $$('.filter-btn');
const projectSearch = $('#projectSearch');
const projectModal = $('#projectModal');
const projectModalInner = $('#projectModalInner');
const projectModalClose = () => projectModal.querySelector('.modal-close');
const techStackEl = $('#techStack');
const techModal = $('#techProjectsModal');
const techModalInner = $('#techModalInner');
const featuredCarousel = $('#featuredCarousel');
const websitesGrid = $('#websitesGrid');
const websitePreviewModal = $('#websitePreviewModal');
const websitePreviewInner = $('#websitePreviewInner');
const copyEmailBtn = $('#copyEmailBtn');
const testimonialSlider = $('#testimonialSlider');
const clientsMarquee = $('#clientsMarquee');
const statsEls = () => $$('.stat-num');
const skillProgress = () => $$('.progress');
const faqToggles = () => $$('.faq-toggle');
const playgroundCode = $('#playgroundCode');
const playgroundFrame = $('#playgroundFrame');
const runPlay = $('#runPlayground');
const resetPlay = $('#resetPlayground');
const yearEl = $('#year');

/* ------------------ State ------------------ */
let projectsData = [];
let websitesData = [];
let techData = [];
let featuredData = [];
let testimonialsData = [];
let clientsData = [];

/* ------------------ Init on load ------------------ */
document.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = (new Date()).getFullYear();
  loadData();
  initTyped();
  initParticles();
  initUI();
  initPlayground();
  initFaq();
  initAccessibility();
});

/* ------------------ Load JSON Data ------------------ */
async function loadData(){
  // Fetch local JSON files (must be present in /data/)
  try {
    const [projR, webR] = await Promise.all([
      fetch('data/projects.json'),
      fetch('data/websites.json')
    ]);
    projectsData = await projR.json();
    websitesData = await webR.json();
  } catch(err){
    console.warn('Data files not found or failed to load — fallback to embedded defaults.', err);
    // Fallback minimal data
    projectsData = [
      {
        id: "smarttask",
        title: "SmartTask Dashboard",
        description: "Dynamic dashboard using Chart.js and vanilla JS.",
        tech: ["js","chartjs"],
        tags: ["dashboard"],
        live: "#",
        repo: "#",
        images: ["images/smarttask.png"],
        role: "Front-end",
        caseStudy: { challenge: "Complex data UX", solution: "Interactive charts", results: "Improved productivity" }
      },
      {
        id: "todoapp",
        title: "To-Do List App",
        description: "LocalStorage powered todo app.",
        tech: ["js"],
        tags: ["productivity"],
        live: "#",
        repo: "#",
        images: ["images/todoapp.png"],
        role: "Front-end"
      }
    ];
    websitesData = [
      { id:"nash", title:"Nashville Apartments", url:"https://nashvilleapartments.com", image:"images/nashville.png", tech:["wordpress","html"] },
      { id:"smart", title:"SmartHires", url:"https://smarthires.com", image:"images/smarthires.png", tech:["wordpress"] }
    ];
  }

  // Minimal sample testimonials & clients
  testimonialsData = [
    { text: "Sayedrahim delivered an excellent dashboard. Highly professional.", author: "John Doe", company: "Acme Co." },
    { text: "Attention to detail and coding skills are top-notch.", author: "Jane Smith", company: "Client" }
  ];

  clientsData = [
    { name:"Client A", logo:"images/logo-placeholder.png", url:"#"},
    { name:"Client B", logo:"images/logo-placeholder.png", url:"#"}
  ];

  renderProjects(projectsData);
  renderWebsites(websitesData);
  renderTechFromProjects(projectsData);
  renderFeatured(projectsData.slice(0,3));
  renderTestimonials(testimonialsData);
  renderClients(clientsData);
}

/* ------------------ Renderers ------------------ */
function renderProjects(list){
  projectGrid.innerHTML = '';
  list.forEach(p=>{
    const card = el('article');
    card.className = 'project-card';
    card.setAttribute('data-tech', (p.tech && p.tech[0]) || 'js');
    card.setAttribute('data-tags', (p.tags || []).join(','));
    const img = el('img'); img.src = p.images?.[0] || 'images/placeholder.png'; img.alt = p.title || 'project';
    img.loading = 'lazy';
    card.appendChild(img);
    const info = el('div'); info.className='project-info';
    const h = el('h3'); h.textContent = p.title;
    const desc = el('p'); desc.textContent = p.description;
    const actions = el('div'); actions.style.display='flex'; actions.style.gap='8px';
    const live = el('a'); live.className='btn small'; live.href = p.live || '#'; live.textContent='Live Demo'; live.target='_blank';
    const repo = el('a'); repo.className='btn small outline'; repo.href = p.repo || '#'; repo.textContent='GitHub'; repo.target='_blank';
    const detailBtn = el('button'); detailBtn.className='btn small'; detailBtn.textContent='Details';
    detailBtn.addEventListener('click', ()=> openProjectModal(p.id));

    actions.appendChild(live); actions.appendChild(repo); actions.appendChild(detailBtn);
    info.appendChild(h); info.appendChild(desc); info.appendChild(actions);
    card.appendChild(info);
    projectGrid.appendChild(card);
  });
}

function renderWebsites(list){
  websitesGrid.innerHTML = '';
  list.forEach(w=>{
    const a = el('a', { href: w.url||'#', target: '_blank', rel:'noopener' });
    a.className='website-card';
    const img = el('img'); img.src = w.image || 'images/placeholder.png'; img.alt = w.title || 'website'; img.loading='lazy';
    const info = el('div'); info.className='website-info'; info.textContent = w.title;
    a.appendChild(img); a.appendChild(info);
    a.addEventListener('click', (ev)=> {
      // allow normal navigation when clicking link target, but also provide preview modal on ctrl/cmd click
      if(ev.ctrlKey || ev.metaKey){ return; }
      ev.preventDefault();
      openWebsitePreview(w);
    });
    websitesGrid.appendChild(a);
  });
}

function renderTechFromProjects(list){
  // Build a small tech set from projects
  const techCount = {};
  list.forEach(p => (p.tech || []).forEach(t => techCount[t] = (techCount[t]||0)+1));
  const techs = Object.keys(techCount).sort();
  techStackEl.innerHTML = '';
  techs.forEach(t=>{
    const card = el('button'); card.className='tech-card'; card.type='button';
    card.innerHTML = `<div class="tech-icon">${iconForTech(t)}</div><div class="tech-name">${t.toUpperCase()}</div><div class="tech-meta">${techCount[t]} project(s)</div>`;
    card.addEventListener('click', ()=> openTechModal(t, list.filter(p => (p.tech||[]).includes(t))));
    techStackEl.appendChild(card);
  });
}

function renderFeatured(list){
  featuredCarousel.innerHTML = '';
  list.forEach(p=>{
    const card = el('div'); card.className='case-study';
    card.style.minWidth = '320px';
    card.style.background = 'var(--card)';
    card.style.padding = '14px';
    card.style.borderRadius = '10px';
    card.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p><p><strong>Role:</strong> ${p.role||'Developer'}</p><div style="margin-top:10px;"><button class="btn small" data-id="${p.id}">Read Case Study</button></div>`;
    card.querySelector('button').addEventListener('click', ()=> openProjectModal(p.id));
    featuredCarousel.appendChild(card);
  });
}

function renderTestimonials(list){
  testimonialSlider.innerHTML = '';
  list.forEach(t=>{
    const it = el('div'); it.className='testimonial-item';
    it.innerHTML = `<p>"${t.text}"</p><h4>${t.author}<br><small style="color:var(--muted)">${t.company||''}</small></h4>`;
    testimonialSlider.appendChild(it);
  });
}

function renderClients(list){
  clientsMarquee.innerHTML = '';
  list.forEach(c=>{
    const a = el('a', { href:c.url||'#', target:'_blank', rel:'noopener' });
    a.className='client-logo';
    const img = el('img'); img.src = c.logo || 'images/logo-placeholder.png'; img.alt = c.name; img.style.height='48px'; img.loading='lazy';
    a.appendChild(img);
    clientsMarquee.appendChild(a);
  });
}

/* ------------------ Modal openers ------------------ */
function openProjectModal(id){
  const p = projectsData.find(x=>x.id===id) || projectsData.find(x=>x.id===id) || null;
  if(!p){
    // fallback: find by id in rendered list
    const found = projectsData.find(x=>x.id===id);
    if(found) p = found;
  }
  if(!p){
    projectModalInner.innerHTML = `<p>Project not found.</p>`;
  } else {
    projectModalInner.innerHTML = `
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <p><strong>Role:</strong> ${p.role||'Front-end'}</p>
      <p><strong>Tech:</strong> ${(p.tech||[]).join(', ')}</p>
      ${p.caseStudy ? `<h3>Case Study</h3><p><strong>Challenge:</strong> ${p.caseStudy.challenge}</p><p><strong>Solution:</strong> ${p.caseStudy.solution}</p><p><strong>Results:</strong> ${p.caseStudy.results}</p>` : ''}
      <div style="display:flex;gap:8px;margin-top:12px"><a class="btn" href="${p.live||'#'}" target="_blank">Live Demo</a><a class="btn outline" href="${p.repo||'#'}" target="_blank">GitHub</a></div>
    `;
  }
  showModal(projectModal);
}

function openTechModal(tech, list){
  techModalInner.innerHTML = `<h3>${tech.toUpperCase()}</h3><p>Projects using ${tech}:</p>`;
  const ul = el('ul');
  (list || []).forEach(p=>{
    const li = el('li'); li.innerHTML = `<strong>${p.title}</strong> — ${p.description} <button class="btn small" style="margin-left:8px" data-id="${p.id}">Details</button>`;
    li.querySelector('button').addEventListener('click', ()=> { openProjectModal(p.id); techModal.classList.add('hidden'); });
    ul.appendChild(li);
  });
  techModalInner.appendChild(ul);
  showModal(techModal);
}

function openWebsitePreview(w){
  websitePreviewInner.innerHTML = `<h3>${w.title}</h3><p>Tech: ${(w.tech||[]).join(', ')}</p><iframe src="${w.url}" style="width:100%;height:480px;border:0;border-radius:8px;"></iframe><div style="margin-top:10px"><a class="btn" href="${w.url}" target="_blank">Open Live</a></div>`;
  showModal(websitePreviewModal);
}

/* ------------------ Modal helpers ------------------ */
function showModal(mod){
  mod.classList.remove('hidden');
  mod.setAttribute('aria-hidden','false');
  const closeBtn = mod.querySelector('.modal-close');
  closeBtn?.addEventListener('click', ()=> closeModal(mod));
  // ESC to close
  const escHandler = (e) => { if(e.key==='Escape'){ closeModal(mod); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);
}
function closeModal(mod){
  mod.classList.add('hidden');
  mod.setAttribute('aria-hidden','true');
}

/* ------------------ Typed text ------------------ */
function initTyped(){
  const words = ['HTML','CSS','JavaScript','React','Node.js','MongoDB','WordPress','Shopify'];
  let wi=0, ci=0; typedEl.textContent='';
  function step(){
    const w = words[wi];
    if(ci < w.length){
      typedEl.textContent += w[ci++];
      setTimeout(step, 120);
    } else {
      setTimeout(()=>{ typedEl.textContent=''; ci=0; wi=(wi+1)%words.length; step(); }, 900);
    }
  }
  step();
}

/* ------------------ Particles ------------------ */
function initParticles(){
  const canvas = document.getElementById('particle-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let particles = [];
  class P{ constructor(){ this.x=Math.random()*w; this.y=Math.random()*h; this.r=Math.random()*1.6+0.6; this.vx=(Math.random()-0.5)*0.5; this.vy=(Math.random()-0.5)*0.5; } update(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0)this.x=w; if(this.x>w)this.x=0; if(this.y<0)this.y=h; if(this.y>h)this.y=0; } draw(){ ctx.beginPath(); ctx.fillStyle='rgba(59,130,246,0.85)'; ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); } }
  function init(){ particles=[]; for(let i=0;i<Math.round((w*h)/90000);i++) particles.push(new P()); }
  function anim(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){ p.update(); p.draw(); }
    requestAnimationFrame(anim);
  }
  init(); anim();
  window.addEventListener('resize', ()=>{ w = canvas.width = window.innerWidth; h=canvas.height=window.innerHeight; init(); });
}

/* ------------------ UI init & events ------------------ */
function initUI(){
  // Mobile nav toggle
  mobileToggle?.addEventListener('click', ()=> {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', (!expanded).toString());
    navLinks.classList.toggle('show');
  });

  // Back to top
  backTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // Dark mode: follow system then toggle
  if(localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))){
    document.body.classList.add('dark-mode');
  }
  darkToggle?.addEventListener('click', ()=> {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Project filters
  filterBtns().forEach(b => b.addEventListener('click', ()=> {
    filterBtns().forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const f = b.getAttribute('data-filter');
    filterProjects(f, projectSearch.value.trim());
  }));

  // Search
  projectSearch?.addEventListener('input', debounce(e=>{
    const q = e.target.value.trim();
    const active = document.querySelector('.filter-btn.active');
    const f = active ? active.getAttribute('data-filter') : 'all';
    filterProjects(f, q);
  }, 300));

  // Modal close clicks (attach to document for dynamic modals)
  document.addEventListener('click', (ev)=>{
    if(ev.target.matches('.modal .modal-close')) {
      const modal = ev.target.closest('.modal');
      modal?.classList.add('hidden');
    }
  });

  // Project modal close via overlay click
  projectModal?.addEventListener('click', (e) => { if(e.target === projectModal) closeModal(projectModal); });
  techModal?.addEventListener('click', (e) => { if(e.target === techModal) closeModal(techModal); });
  websitePreviewModal?.addEventListener('click', (e) => { if(e.target === websitePreviewModal) closeModal(websitePreviewModal); });

  // Close buttons for modal elements
  $$('.modal .modal-close').forEach(btn => btn.addEventListener('click', ()=> btn.closest('.modal').classList.add('hidden')));

  // Copy Email
  copyEmailBtn?.addEventListener('click', ()=> {
    navigator.clipboard.writeText('sayedrahimsadat@gmail.com').then(()=> {
      alert('Email copied to clipboard!');
    });
  });

  // Project card Details (delegate)
  projectGrid.addEventListener('click', (e)=> {
    const btn = e.target.closest('button');
    if(btn && btn.textContent.trim()==='Details'){
      const id = btn.dataset.id;
      // we used inline attaching earlier; safe fallback to find nearest .project-card
      const card = e.target.closest('.project-card');
      const idx = Array.from(projectGrid.children).indexOf(card);
      const pid = projectsData[idx]?.id;
      openProjectModal(pid || null);
    }
  });

  // Modal close through .modal-close
  $$('.modal .modal-close').forEach(c => c.addEventListener('click', (ev)=> {
    ev.target.closest('.modal').classList.add('hidden');
  }));

  // Project modal close on ESC
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') { $$('.modal').forEach(m => m.classList.add('hidden')); } });

  // Animate counters and skill bars on scroll
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
}

/* ------------------ Filtering & search ------------------ */
function filterProjects(filter = 'all', query = ''){
  query = query.toLowerCase();
  const cards = $$('.project-card');
  cards.forEach((c, idx)=>{
    const p = projectsData[idx];
    if(!p) return;
    const byFilter = (filter === 'all') || (p.tech || []).includes(filter);
    const matchesQuery = !query || p.title.toLowerCase().includes(query) || (p.tags||[]).join(' ').toLowerCase().includes(query) || (p.description||'').toLowerCase().includes(query);
    c.style.display = (byFilter && matchesQuery) ? 'flex' : 'none';
  });
}

/* ------------------ Reveal on scroll (counters, skills) ------------------ */
function revealOnScroll(){
  // Stats counters
  const stats = statsEls();
  stats.forEach(s => {
    if(s.dataset.animated) return;
    const top = s.getBoundingClientRect().top;
    if(top < window.innerHeight - 60){
      const target = +s.dataset.target || 0;
      animateCounter(s, target, 1200);
      s.dataset.animated = '1';
    }
  });
  // Skills
  skillProgress().forEach(bar=>{
    const top = bar.getBoundingClientRect().top;
    if(top < window.innerHeight - 80){
      bar.style.width = bar.datasetWidth || bar.getAttribute('data-width') || bar.dataset.width || bar.getAttribute('data-width') || bar.getAttribute('style')?.match(/width:\s*([\d.]+%)/)?.[1] || '80%';
      // ensure the attribute exists
      if(!bar.datasetWidth) bar.datasetWidth = bar.getAttribute('data-width') || bar.dataset.width || '80%';
    }
  });
}

/* Animate counter helper */
function animateCounter(node, to, duration=1200){
  const start = 0;
  const startTime = performance.now();
  function step(now){
    const elapsed = now - startTime;
    const progress = clamp(elapsed / duration, 0, 1);
    node.textContent = Math.round(start + (to - start) * easeOutCubic(progress));
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

/* ------------------ Playground ------------------ */
function initPlayground(){
  if(!playgroundCode || !playgroundFrame) return;
  const defaultCode = `<!doctype html><html><body><h3 style="font-family:Roboto">Playground</h3><script>console.log('Playground running');</script></body></html>`;
  playgroundCode.value = `// Example: change background: document.body.style.background = '#f3f3f3';\n` + defaultCode;
  runPlay?.addEventListener('click', () => {
    const src = playgroundCode.value;
    playgroundFrame.srcdoc = src;
  });
  resetPlay?.addEventListener('click', () => {
    playgroundCode.value = `// Example: change background: document.body.style.background = '#f3f3f3';\n` + defaultCode;
    playgroundFrame.srcdoc = defaultCode;
  });
  // initial
  playgroundFrame.srcdoc = defaultCode;
}

/* ------------------ FAQ ------------------ */
function initFaq(){
  faqToggles().forEach(btn => {
    const content = btn.nextElementSibling;
    btn.addEventListener('click', ()=> {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', (!open).toString());
      if(open){
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
    });
  });
}

/* ------------------ Accessibility helpers ------------------ */
function initAccessibility(){
  // Focus outline for keyboard
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  // Close mobile nav on link click
  $$('.nav-link').forEach(a => a.addEventListener('click', ()=> { if(navLinks.classList.contains('show')) navLinks.classList.remove('show'); }));
}

/* ------------------ Utilities ------------------ */
function debounce(fn, wait=200){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=> fn(...args), wait); };
}
function iconForTech(key){
  // Simple mapping — can be extended
  const m = { js: '<i class="fab fa-js-square"></i>', react: '<i class="fab fa-react"></i>', node: '<i class="fab fa-node-js"></i>', html: '<i class="fab fa-html5"></i>', css: '<i class="fab fa-css3-alt"></i>', wordpress: '<i class="fab fa-wordpress"></i>' };
  return m[key] || '<i class="fas fa-code"></i>';
}

/* ------------------ Extra: set style widths for progress bars on data-width attr */
document.addEventListener('DOMContentLoaded', ()=>{
  // set width property values consistent with data-width
  $$('.progress').forEach(p => {
    const w = p.getAttribute('data-width') || p.dataset.width;
    if(w) p.style.width = '0';
    // store width in dataset for later reveal
    p.datasetWidth = w || '80%';
  });
});

/* ------------------ Utility: open external links in new tab - accessible (if any anchor has target blank) */
document.addEventListener('click', e=>{
  const a = e.target.closest('a[target="_blank"]');
  if(a) a.rel = 'noopener';
});

/* End of script.js */
