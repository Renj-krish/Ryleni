document.addEventListener('DOMContentLoaded', () => {
  // 0. Scroll-aware header: transparent over dark hero, white when scrolled past
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.hero-section');

  function updateHeader() {
    if (!heroSection) return;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom - 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run once on load

  // 0b. Typewriter effect for hero heading
  const typedTarget  = document.querySelector('.hero-typed-text');
  const typeCursor   = document.querySelector('.hero-type-cursor');
  const heroDots     = document.querySelector('.hero-dots');
  const heroReveals  = document.querySelectorAll('.hero-reveal');

  if (typedTarget) {
    // Build the typing sequence: chars + a line-break token
    const lines    = ['Your shortcut to', 'smarter solutions'];
    const sequence = [];
    lines.forEach((line, i) => {
      [...line].forEach(ch => sequence.push({ type: 'char', val: ch }));
      if (i < lines.length - 1) sequence.push({ type: 'br' });
    });

    let html = '';
    let idx  = 0;

    function typeNext() {
      if (idx >= sequence.length) {
        // Typing done — swap cursor for dots
        if (typeCursor)  typeCursor.style.display = 'none';
        if (heroDots)    heroDots.style.display   = 'inline';

        // Stagger-reveal description then buttons
        heroReveals.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 180);
        });
        return;
      }

      const item = sequence[idx++];
      html += item.type === 'br' ? '<br>' : item.val;
      typedTarget.innerHTML = html;
      setTimeout(typeNext, item.type === 'br' ? 120 : 52);
    }

    // Short pause before first keystroke
    setTimeout(typeNext, 350);
  }

  // 1. FAQ Accordion interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other opened items
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstTrigger = faqItems[0].querySelector('.faq-trigger');
    if (firstTrigger) firstTrigger.setAttribute('aria-expanded', 'true');
  }

  // 2. Services Carousel & Filter Pills
  const servicesTrack    = document.getElementById('servicesTrack');
  const servicesPrevBtn  = document.getElementById('servicesPrevBtn');
  const servicesNextBtn  = document.getElementById('servicesNextBtn');
  const servicesViewport = document.querySelector('.services-carousel-viewport');
  const filterBtns       = document.querySelectorAll('.filter-btn');
  const serviceCards     = document.querySelectorAll('.service-card');

  let currentServiceIndex = 0;

  function updateServicesSlider() {
    if (!servicesTrack || !servicesViewport) return;

    const visibleCards = Array.from(serviceCards).filter(card => card.style.display !== 'none');
    if (visibleCards.length === 0) return;

    const firstCard   = visibleCards[0];
    const cardWidth   = firstCard.getBoundingClientRect().width;
    const computedGap = parseFloat(window.getComputedStyle(servicesTrack).gap) || 24;
    const shift       = cardWidth + computedGap;

    const viewportWidth = servicesViewport.clientWidth;
    const cardsPerView  = Math.max(1, Math.round((viewportWidth + computedGap) / (cardWidth + computedGap)));
    const maxIndex      = Math.max(0, visibleCards.length - cardsPerView);

    if (currentServiceIndex > maxIndex) currentServiceIndex = maxIndex;
    if (currentServiceIndex < 0) currentServiceIndex = 0;

    servicesTrack.style.transform = `translateX(-${currentServiceIndex * shift}px)`;

    // Left navigation arrow
    if (servicesPrevBtn) {
      if (currentServiceIndex > 0) {
        servicesPrevBtn.style.display = 'flex';
        void servicesPrevBtn.offsetWidth;
        servicesPrevBtn.style.opacity = '1';
        servicesPrevBtn.style.pointerEvents = 'auto';
      } else {
        servicesPrevBtn.style.opacity = '0';
        servicesPrevBtn.style.pointerEvents = 'none';
        setTimeout(() => {
          if (currentServiceIndex === 0) servicesPrevBtn.style.display = 'none';
        }, 220);
      }
    }

    // Right navigation arrow
    if (servicesNextBtn) {
      if (currentServiceIndex < maxIndex) {
        servicesNextBtn.style.display = 'flex';
        void servicesNextBtn.offsetWidth;
        servicesNextBtn.style.opacity = '1';
        servicesNextBtn.style.pointerEvents = 'auto';
      } else {
        servicesNextBtn.style.opacity = '0';
        servicesNextBtn.style.pointerEvents = 'none';
        setTimeout(() => {
          if (currentServiceIndex >= maxIndex) servicesNextBtn.style.display = 'none';
        }, 220);
      }
    }
  }

  if (servicesNextBtn) {
    servicesNextBtn.addEventListener('click', () => {
      currentServiceIndex++;
      updateServicesSlider();
    });
  }

  if (servicesPrevBtn) {
    servicesPrevBtn.addEventListener('click', () => {
      currentServiceIndex--;
      updateServicesSlider();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      currentServiceIndex = 0;
      updateServicesSlider();
    });
  });

  window.addEventListener('resize', updateServicesSlider);
  // Initial calculation once layout settles
  setTimeout(updateServicesSlider, 50);

  // 3. Smooth active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
