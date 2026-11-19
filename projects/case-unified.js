const caseNavLinks = [...document.querySelectorAll('[data-case-link]')];
const caseSections = [...document.querySelectorAll('[data-case-section]')];

if ('IntersectionObserver' in window && caseNavLinks.length && caseSections.length) {
  const caseObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    caseNavLinks.forEach((link) => {
      link.setAttribute('aria-current', String(link.dataset.caseLink === visible.target.id));
    });
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .15, .4] });

  caseSections.forEach((section) => caseObserver.observe(section));
}
