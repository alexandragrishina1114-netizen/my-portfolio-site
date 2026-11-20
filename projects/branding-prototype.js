const prototypeFrame = document.getElementById('prototypeFrame');
const prototypeLinks = [...document.querySelectorAll('[data-prototype-target]')];
const prototypeRoot = document.documentElement;

const targetSelectors = {
  about: '.case-about-card',
  task: '.case-task-card',
  materials: '.promo-materials-section',
  stage: '.div-block-166',
  result: '.div-block-172'
};

function resizePrototypeFrame() {
  const doc = prototypeFrame.contentDocument;
  if (!doc) return;
  doc.documentElement.style.setProperty('--prototype-frame-width', `${prototypeFrame.clientWidth}px`);
  const hero = doc.querySelector('.case-hero-card');
  if (hero && window.innerWidth > 900) {
    prototypeRoot.style.setProperty('--prototype-hero-height', `${hero.getBoundingClientRect().height}px`);
  } else {
    prototypeRoot.style.removeProperty('--prototype-hero-height');
  }
  const height = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
  prototypeFrame.style.height = `${height}px`;
}

function updatePrototypeNavigation() {
  const doc = prototypeFrame.contentDocument;
  if (!doc) return;

  const frameTop = prototypeFrame.getBoundingClientRect().top;
  const hero = doc.querySelector('.case-hero-card');
  if (hero) {
    const heroBottom = frameTop + hero.getBoundingClientRect().bottom;
    prototypeRoot.classList.toggle('prototype-case--scrolled', heroBottom <= 180);
  }

  const marker = window.innerHeight * .32;
  let activeKey = prototypeLinks[0]?.dataset.prototypeTarget;

  Object.entries(targetSelectors).forEach(([key, selector]) => {
    const section = doc.querySelector(selector);
    if (section && frameTop + section.getBoundingClientRect().top <= marker) {
      activeKey = key;
    }
  });

  prototypeLinks.forEach((link) => {
    link.setAttribute('aria-current', link.dataset.prototypeTarget === activeKey ? 'true' : 'false');
  });
}

let navigationTicking = false;
function requestNavigationUpdate() {
  if (navigationTicking) return;
  navigationTicking = true;
  window.requestAnimationFrame(() => {
    updatePrototypeNavigation();
    navigationTicking = false;
  });
}

function prepareOriginalCase() {
  const doc = prototypeFrame.contentDocument;
  if (!doc) return;

  const style = doc.createElement('style');
  style.textContent = `
    html, body {
      width: var(--prototype-frame-width, 100%) !important;
      max-width: var(--prototype-frame-width, 100%) !important;
      background: transparent !important;
      overflow: hidden !important;
    }
    .site-header, .section-3 { display: none !important; }
    .case-hero-card { width: 100% !important; margin: 0 0 1rem !important; padding: 0 !important; background: transparent !important; }
    .case-hero-card .hero-text { display: none !important; }
    .case-hero-card .div-block-170 { width: 100% !important; }
    .case-hero-card .hero-img { border-radius: 1rem !important; }
    .case-about-card, .case-task-card, .promo-materials-section, .div-block-166, .div-block-172, .next-project {
      width: 100% !important;
      max-width: none !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .div-block-17.div-block-112.div-block-189, .ag-site-footer { display: none !important; }
    .case-about-card {
      gap: clamp(2.5rem, 5vw, 5rem) !important;
      padding: clamp(2.5rem, 5vw, 5rem) 0 !important;
      min-width: 0 !important;
      background: transparent !important;
      border-radius: 0 !important;
      color: #373737 !important;
    }
    .case-about-card-1 {
      display: grid !important;
      grid-template-columns: minmax(15rem, .72fr) minmax(0, 1.28fr) !important;
      gap: clamp(2rem, 4vw, 4rem) !important;
      align-items: start !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .case-about-text-1 {
      gap: 1.5rem !important;
      padding-top: .35rem !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .case-about-text {
      width: min(100%, 32rem) !important;
      max-width: 32rem !important;
      color: #373737 !important;
      font-size: clamp(1rem, 1.25vw, 1.25rem) !important;
      line-height: 1.55 !important;
      overflow-wrap: anywhere !important;
    }
    .case-about-image {
      border-radius: 1rem !important;
      aspect-ratio: 4 / 3 !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .case-about-image .img {
      width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center !important;
    }
    .case-concept {
      display: grid !important;
      grid-template-columns: minmax(8rem, .42fr) minmax(0, 1.58fr) !important;
      gap: clamp(2rem, 4vw, 5rem) !important;
      padding: 2rem 0 0 !important;
      background: transparent !important;
      border: 0 !important;
      border-top: 1px solid #d8d8d8 !important;
      min-width: 0 !important;
      max-width: 100% !important;
    }
    .case-task-title, .case-eyebrow-2 { color: #5b55c6 !important; }
    .case-concept-text {
      width: min(100%, 32rem) !important;
      max-width: 32rem !important;
      color: #373737 !important;
      font-size: clamp(1rem, 1.25vw, 1.25rem) !important;
      line-height: 1.55 !important;
      overflow-wrap: anywhere !important;
    }
    .case-task-card {
      display: grid !important;
      grid-template-columns: minmax(15rem, .48fr) minmax(0, 2fr) !important;
      gap: clamp(2.5rem, 4vw, 4.5rem) !important;
      align-items: start !important;
      padding: clamp(3rem, 5vw, 5rem) 0 !important;
    }
    .case-task-text {
      width: 100% !important;
      min-width: 0 !important;
    }
    .case-task-gallery,
    .task-main-image,
    .case-task-main-image {
      width: 100% !important;
      min-width: 0 !important;
    }
    .case-task-main-image .image-53 {
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
    }
    .div-block-156 {
      display: grid !important;
      grid-template-columns: minmax(18rem, 1fr) minmax(0, 1fr) !important;
      gap: clamp(1.5rem, 3vw, 2.5rem) !important;
      align-items: start !important;
    }
    .div-block-162 {
      width: 100% !important;
      min-width: 0 !important;
    }
    .div-block-162 .image-56 {
      width: 100% !important;
      max-width: 100% !important;
      height: 100% !important;
      min-height: 24rem !important;
      object-fit: cover !important;
    }
    .div-block-147 {
      width: 100% !important;
      min-width: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      padding: clamp(1.5rem, 2vw, 2rem) !important;
      gap: clamp(2rem, 4vw, 3rem) !important;
      align-self: start !important;
    }
    .div-block-148 {
      width: 100% !important;
      gap: 2rem !important;
    }
    .div-block-149 {
      width: 100% !important;
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: clamp(1rem, 2.5vw, 2rem) !important;
      align-items: start !important;
    }
    .div-block-150, .div-block-151, .div-block-152 {
      width: clamp(3.5rem, 6vw, 5rem) !important;
      height: clamp(3.5rem, 6vw, 5rem) !important;
      flex: 0 0 auto !important;
    }
    .div-block-153, .div-block-154, .div-block-155 {
      min-width: 0 !important;
      gap: .8rem !important;
    }
    ._3-level {
      width: 100% !important;
      text-align: center !important;
      white-space: nowrap !important;
    }
    .promo-materials-container {
      width: min(18rem, 34%) !important;
      margin-top: clamp(1rem, 1.6vw, 1.5rem) !important;
      margin-left: clamp(1.5rem, 3vw, 4rem) !important;
      gap: .75rem !important;
      z-index: 2 !important;
    }
    .div-block-160 {
      height: clamp(36rem, 48vw, 46rem) !important;
      min-height: 0 !important;
      padding: clamp(2.5rem, 4vw, 4rem) !important;
      display: grid !important;
      grid-template-columns: minmax(12rem, .55fr) minmax(20rem, 1.45fr) !important;
      gap: clamp(2rem, 5vw, 5rem) !important;
      align-items: center !important;
      position: relative !important;
      overflow: hidden !important;
    }
    .klik-text {
      position: static !important;
      width: min(100%, 16rem) !important;
      color: #fff !important;
      font-size: 1rem !important;
      line-height: 1.35 !important;
    }
    .code-embed {
      width: 100% !important;
      max-width: 24rem !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      justify-self: center !important;
      overflow: visible !important;
    }
    @media (max-width: 800px) {
      .case-about-card-1 { grid-template-columns: 1fr !important; }
      .case-about-text-1 { order: 1 !important; }
      .case-about-image { order: 2 !important; aspect-ratio: auto !important; }
      .case-concept { grid-template-columns: 1fr !important; gap: 1rem !important; }
      .case-task-card { grid-template-columns: 1fr !important; }
      .div-block-156 { grid-template-columns: 1fr !important; }
      .case-task-gallery, .div-block-156, .div-block-147 {
        width: var(--prototype-frame-width, 100%) !important;
        max-width: var(--prototype-frame-width, 100%) !important;
        box-sizing: border-box !important;
      }
      .div-block-162 .image-56 { min-height: 0 !important; height: auto !important; }
      .promo-materials-section {
        height: auto !important;
        min-height: 0 !important;
        padding-bottom: 0 !important;
      }
      .promo-materials-container {
        width: calc(100% - 2rem) !important;
        margin: 0 !important;
        padding: 1.25rem 1rem .75rem !important;
        position: relative !important;
        top: auto !important;
        left: auto !important;
      }
      .promo-materials-text { width: min(15rem, 100%) !important; }
      .div-block-160 {
        height: 28rem !important;
        padding: 1.5rem !important;
        grid-template-columns: 1fr !important;
        grid-template-rows: auto 1fr !important;
        gap: 1rem !important;
      }
      .klik-text { width: 100% !important; }
      .code-embed { max-width: 14rem !important; }
      .mockup-fold-closed { transform: scale(1.15) rotate(-1deg) !important; }
      .mockup-fold-open { transform: scale(1.08) rotate(1deg) translateY(.25rem) !important; }
      .mockup-fold-toggle:checked + .mockup-fold .mockup-fold-closed {
        transform: scale(1.08) rotate(-3deg) translateY(-.25rem) !important;
      }
      .mockup-fold-toggle:checked + .mockup-fold .mockup-fold-open {
        transform: scale(1.15) rotate(0deg) translateY(0) !important;
      }
    }
    .w-lightbox-backdrop {
      position: absolute !important;
      top: var(--prototype-lightbox-top, 0px) !important;
      right: 0 !important;
      bottom: auto !important;
      left: 0 !important;
      height: var(--prototype-lightbox-height, 100vh) !important;
    }
    .w-lightbox-container, .w-lightbox-content, .w-lightbox-view, .w-lightbox-view::before {
      height: var(--prototype-lightbox-height, 100vh) !important;
    }
    .w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view::before {
      height: calc(var(--prototype-lightbox-height, 100vh) - 5rem) !important;
    }
    .w-lightbox-image {
      max-width: 100% !important;
      max-height: calc(var(--prototype-lightbox-height, 100vh) - 5rem) !important;
    }
    .w-webflow-badge { display: none !important; }
  `;
  doc.head.appendChild(style);

  Object.entries(targetSelectors).forEach(([id, selector]) => {
    const element = doc.querySelector(selector);
    if (element) element.dataset.prototypeSection = id;
  });

  const observer = new ResizeObserver(resizePrototypeFrame);
  observer.observe(doc.documentElement);
  observer.observe(doc.body);
  doc.querySelectorAll('img, video').forEach((media) => {
    media.addEventListener('load', resizePrototypeFrame);
    media.addEventListener('loadedmetadata', resizePrototypeFrame);
  });

  function syncLightbox() {
    const backdrop = doc.querySelector('.w-lightbox-backdrop');
    if (!backdrop) return;
    const frameTop = prototypeFrame.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(0, window.scrollY - frameTop);
    backdrop.style.setProperty('--prototype-lightbox-top', `${top}px`);
    backdrop.style.setProperty('--prototype-lightbox-height', `${window.innerHeight}px`);
  }

  const lightboxObserver = new MutationObserver(syncLightbox);
  lightboxObserver.observe(doc.body, { childList: true, subtree: true });
  window.addEventListener('scroll', syncLightbox, { passive: true });
  window.addEventListener('resize', syncLightbox);

  resizePrototypeFrame();
  updatePrototypeNavigation();
}

prototypeFrame.addEventListener('load', prepareOriginalCase);
window.addEventListener('scroll', requestNavigationUpdate, { passive: true });
window.addEventListener('resize', requestNavigationUpdate);

prototypeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const key = link.dataset.prototypeTarget;
    const selector = targetSelectors[key];
    const target = prototypeFrame.contentDocument?.querySelector(selector);
    if (!target) return;

    prototypeLinks.forEach((item) => {
      item.setAttribute('aria-current', item === link ? 'true' : 'false');
    });

    const frameTop = prototypeFrame.getBoundingClientRect().top + window.scrollY;
    const targetTop = target.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, frameTop + targetTop - 24), behavior: 'smooth' });
  });
});
