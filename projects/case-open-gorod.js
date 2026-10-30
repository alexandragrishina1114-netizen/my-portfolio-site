(function () {
  var root = document.documentElement;
  var hero = document.querySelector('.og-hero');
  var stickySidebar = document.querySelector('.og-case-sidebar__sticky');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-case-section]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-case-nav]'));
  var lightbox = document.querySelector('.og-lightbox');
  var lightboxImage = document.querySelector('.og-lightbox__image');
  var lightboxClose = document.querySelector('.og-lightbox__close');
  var lightboxTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));

  if (!hero || !stickySidebar || !sections.length || !navLinks.length) {
    return;
  }

  var syncSidebarGeometry = function () {
    if (window.innerWidth <= 1100) {
      root.style.removeProperty('--og-hero-height');
      root.style.removeProperty('--og-section-start-offset');
      return;
    }

    root.style.setProperty('--og-hero-height', hero.getBoundingClientRect().height + 'px');

    var stickyTop = stickySidebar.getBoundingClientRect().top;
    var firstNavLinkTop = navLinks[0].getBoundingClientRect().top;
    root.style.setProperty('--og-section-start-offset', firstNavLinkTop - stickyTop + 'px');
  };

  var setActiveSection = function () {
    var marker = window.innerHeight * 0.32;
    var activeId = sections[0].id;

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= marker) {
        activeId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('data-case-nav') === activeId;
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  var updateSidebar = function () {
    var heroBottom = hero.getBoundingClientRect().bottom;
    root.classList.toggle('og-case--scrolled', heroBottom <= 180);
    setActiveSection();
  };

  var ticking = false;
  var requestUpdate = function () {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      updateSidebar();
      ticking = false;
    });
  };

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (lightbox && lightboxImage && lightboxClose && lightboxTriggers.length) {
    var openLightbox = function (trigger) {
      lightboxImage.src = trigger.currentSrc || trigger.src;
      lightboxImage.alt = trigger.alt;
      lightbox.showModal();
    };

    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openLightbox(trigger);
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(trigger);
        }
      });
    });

    lightboxClose.addEventListener('click', function () {
      lightbox.close();
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', function () {
    syncSidebarGeometry();
    requestUpdate();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncSidebarGeometry);
  }

  syncSidebarGeometry();
  updateSidebar();
})();
