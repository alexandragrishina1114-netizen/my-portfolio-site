(() => {
  const slider = document.querySelector('.osobnyak-slider');
  if (!slider) return;

  const viewport = slider.querySelector('.osobnyak-slider__viewport');
  const slides = [...viewport.querySelectorAll('figure')];
  const previous = slider.querySelector('[data-slide-prev]');
  const next = slider.querySelector('[data-slide-next]');
  const counter = slider.querySelector('.osobnyak-slider__counter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = 0;
  const update = () => {
    current = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const goTo = index => {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    viewport.scrollTo({ left: viewport.clientWidth * target, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    current = target;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  viewport.addEventListener('scroll', update, { passive: true });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  window.addEventListener('resize', () => goTo(current));
  update();
})();

(() => {
  const reveal = document.querySelector('.osobnyak-mobile-reveal');
  if (!reveal) return;

  const windowFrame = reveal.querySelector('.osobnyak-mobile-reveal__window');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const update = () => {
    frame = 0;
    if (reduceMotion.matches) return;

    const rect = reveal.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(windowFrame).top) || 0;
    const distance = Math.max(1, reveal.offsetHeight - windowFrame.offsetHeight);
    const progress = Math.max(0, Math.min(1, (stickyTop - rect.top) / distance));
    const travel = window.matchMedia('(max-width: 767px)').matches ? 0.5 : 0.68;
    reveal.style.setProperty('--phone-shift', `${-progress * windowFrame.offsetHeight * travel}px`);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const resizeTrack = () => {
    if (reduceMotion.matches) return;
    const scrollDistance = Math.min(360, Math.max(200, window.innerHeight * 0.38));
    reveal.style.height = `${Math.ceil(windowFrame.offsetHeight + scrollDistance)}px`;
    schedule();
  };

  const refresh = () => {
    reveal.classList.toggle('is-animated', !reduceMotion.matches);
    if (reduceMotion.matches) {
      reveal.style.removeProperty('height');
      reveal.style.removeProperty('--phone-shift');
    } else {
      resizeTrack();
    }
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resizeTrack, { passive: true });
  reduceMotion.addEventListener('change', refresh);
  refresh();
})();
