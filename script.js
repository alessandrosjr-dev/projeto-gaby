/* ===========================
   GABRIELA TAVARES - SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const handleScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (navToggle && navLinks) {
    const closeMobileMenu = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navbar?.classList.remove('menu-open');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navbar?.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (!entry.target.hasAttribute('data-delay')) {
              revealObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('.hero .reveal').forEach((el, index) => {
    setTimeout(() => el.classList.add('visible'), 200 + index * 140);
  });

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(link => {
              link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const payList = document.querySelector('.payment-list');
  if (payList && 'IntersectionObserver' in window) {
    const paymentItems = payList.querySelectorAll('.payment-item');
    paymentItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-18px)';
      item.style.transition = 'opacity .5s ease, transform .5s ease';
    });

    const payObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          paymentItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, index * 120);
          });
          payObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    payObserver.observe(payList);
  }

  const animateCounter = (el, target, prefix = '', suffix = '') => {
    const duration = 1400;
    const start = performance.now();

    const step = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);

      el.textContent = prefix + value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const statsContainer = document.querySelector('.sobre-stats');
  if (statsContainer && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.querySelectorAll('.stat-n').forEach(el => {
            const match = el.textContent.match(/([\+]?)(\d+)(\%?)/);
            if (!match) return;

            animateCounter(el, parseInt(match[2], 10), match[1], match[3]);
          });
          statsObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsContainer);
  }

  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox__image');
  const lightboxCaption = lightbox?.querySelector('.lightbox__caption');
  const closeLightboxBtn = lightbox?.querySelector('.lightbox__close');
  const prevLightboxBtn = lightbox?.querySelector('.lightbox__nav--prev');
  const nextLightboxBtn = lightbox?.querySelector('.lightbox__nav--next');
  const lightboxTriggers = Array.from(document.querySelectorAll('.js-lightbox'));
  let currentLightboxIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const updateLightbox = index => {
    if (!lightboxImage || !lightboxCaption || !lightboxTriggers.length) return;

    currentLightboxIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
    const trigger = lightboxTriggers[currentLightboxIndex];
    const image = trigger.querySelector('img');
    const title = trigger.dataset.lightboxTitle || image?.alt || '';

    lightboxImage.src = trigger.dataset.lightboxSrc || image?.src || '';
    lightboxImage.alt = image?.alt || title;
    lightboxCaption.textContent = title;
  };

  const openLightbox = index => {
    if (!lightbox) return;

    updateLightbox(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeLightboxBtn?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (lightboxImage) lightboxImage.src = '';
  };

  lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openLightbox(index));
  });

  prevLightboxBtn?.addEventListener('click', event => {
    event.stopPropagation();
    updateLightbox(currentLightboxIndex - 1);
  });

  nextLightboxBtn?.addEventListener('click', event => {
    event.stopPropagation();
    updateLightbox(currentLightboxIndex + 1);
  });

  closeLightboxBtn?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox?.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  lightbox?.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    updateLightbox(currentLightboxIndex + (deltaX < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') updateLightbox(currentLightboxIndex - 1);
    if (event.key === 'ArrowRight') updateLightbox(currentLightboxIndex + 1);
  });

  const waFloat = document.querySelector('.whatsapp-float');
  const footer = document.querySelector('.footer');
  if (waFloat && footer && 'IntersectionObserver' in window) {
    const waObserver = new IntersectionObserver(
      ([entry]) => {
        waFloat.style.opacity = entry.isIntersecting ? '0' : '1';
        waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      },
      { threshold: 0.3 }
    );

    waObserver.observe(footer);
  }

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});
