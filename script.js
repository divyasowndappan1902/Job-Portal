/* ==========================================================================
   STACKLY — MAIN INTERACTIVE APPLICATION SCRIPT (VANILLA JS)
   Includes: Sticky Navbar, GSAP & AOS Animations, 3D Category Tilt,
   Infinite Company Carousel, Scroll Counters, Testimonial Slider,
   Newsletter Email Validation, and 404 Error Page Routing for Dummy Buttons
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. HELPER: NAVIGATE DUMMY BUTTONS TO 404 ERROR PAGE
     ------------------------------------------------------------------------ */
  function navigateTo404(actionLabel) {
    const label = (actionLabel || 'Requested Page').trim();
    window.location.href = `404.html?action=${encodeURIComponent(label)}`;
  }

  /* ------------------------------------------------------------------------
     2. INITIALIZE AOS & GSAP ANIMATIONS
     ------------------------------------------------------------------------ */
  if (typeof window.AOS !== 'undefined') {
    window.AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }

  if (typeof window.gsap !== 'undefined') {
    const gsapInstance = window.gsap;
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsapInstance.registerPlugin(window.ScrollTrigger);
    }

    // Hero staggered entrance animation
    gsapInstance.fromTo(
      '[data-gsap="hero-item"]',
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );

    gsapInstance.fromTo(
      '[data-gsap="hero-visual"]',
      { opacity: 0, scale: 0.94, x: 24 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.05,
        delay: 0.25,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );

    // Subtle parallax on Hero background image
    const heroBg = document.getElementById('heroParallaxBg');
    if (heroBg && typeof window.ScrollTrigger !== 'undefined') {
      gsapInstance.to(heroBg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. STICKY NAVBAR, HAMBURGER MENU & SCROLL-SPY ACTIVE INDICATOR
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMobileMenu() {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.remove('open');
    navMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      closeMobileMenu();
    });
  });

  // Update Sticky Header, Scroll Progress Bar, and Active Section Indicator
  const trackedSections = ['home', 'jobs', 'companies', 'career-explorer', 'resources', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function handleWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 28);
    }

    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      scrollProgressBar.style.width = `${pct}%`;
    }

    const viewportMid = scrollTop + 180;
    let currentSectionId = 'home';

    trackedSections.forEach((section) => {
      if (viewportMid >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const target = link.getAttribute('data-section');
      link.classList.toggle('active', target === currentSectionId);
    });
  }

  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  handleWindowScroll();

  /* ------------------------------------------------------------------------
     4. POPULAR JOB CATEGORIES: 3D TILT HOVER & CLICK -> 404 PAGE
     ------------------------------------------------------------------------ */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${x.toFixed(0)}px`);
      card.style.setProperty('--my', `${y.toFixed(0)}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });

    const handleCategoryClick = () => {
      const categoryName = card.querySelector('.category-name')?.textContent || card.getAttribute('data-category') || 'Job Category';
      navigateTo404(`Category: ${categoryName}`);
    };

    card.addEventListener('click', handleCategoryClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCategoryClick();
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. DUMMY BUTTONS -> 404 ERROR PAGE ROUTING
     ------------------------------------------------------------------------ */
  // 5A. Navbar & CTA Login / Sign Up / Get Started Buttons
  document.querySelectorAll('[data-auth-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customLabel = btn.getAttribute('data-dummy-action');
      const mode = btn.getAttribute('data-auth-modal') === 'signup' ? 'Sign Up' : 'Login';
      navigateTo404(customLabel || mode);
    });
  });

  // 5B. Hero Search Form Submit & Quick Tags
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = document.getElementById('searchKeyword')?.value.trim() || 'All Roles';
      navigateTo404(`Search Jobs (${keyword})`);
    });
  }

  document.querySelectorAll('.quick-tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      const kw = tag.textContent || tag.getAttribute('data-quick-search') || 'Trending Role';
      navigateTo404(`Trending Search: ${kw}`);
    });
  });

  // 5C. Featured Jobs Filter Pills, Apply Now, Bookmark & View All Jobs Buttons
  const jobCards = Array.from(document.querySelectorAll('.job-card'));
  const filterPills = document.querySelectorAll('.filter-pill');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const category = pill.getAttribute('data-filter') || 'all';
      filterPills.forEach((p) => {
        const isActive = p === pill;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-selected', String(isActive));
      });

      jobCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category') || '';
        const visible = category === 'all' || cardCat === category;
        card.classList.toggle('hidden', !visible);
      });
    });
  });

  document.querySelectorAll('.apply-now-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.job-card');
      const jobTitle = card?.getAttribute('data-title') || 'Featured Job';
      navigateTo404(`Apply Now — ${jobTitle}`);
    });
  });

  document.querySelectorAll('.bookmark-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.job-card');
      const jobTitle = card?.getAttribute('data-title') || 'Featured Job';
      navigateTo404(`Save Job — ${jobTitle}`);
    });
  });

  const viewAllJobsBtn = document.getElementById('viewAllJobsBtn');
  if (viewAllJobsBtn) {
    viewAllJobsBtn.addEventListener('click', () => {
      navigateTo404('View All Jobs Directory');
    });
  }

  // 5D. Top Hiring Companies Infinite Carousel & Card Click -> 404 Page
  const companiesTrack = document.getElementById('companiesTrack');
  if (companiesTrack) {
    const originalCards = Array.from(companiesTrack.children);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      companiesTrack.appendChild(clone);
    });

    companiesTrack.addEventListener('click', (e) => {
      const card = e.target.closest('.company-carousel-card');
      if (!card) return;
      const companyName = card.getAttribute('data-company-filter') || 'Company Profile';
      navigateTo404(`Company Jobs — ${companyName}`);
    });
  }

  // 5E. Explore Career Paths Filter Tabs & Explore Career Buttons -> 404 Page
  const careerTabBtns = document.querySelectorAll('.career-tab-btn');
  const careerCards = document.querySelectorAll('.career-card');

  careerTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-career-filter') || 'all';
      careerTabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });

      careerCards.forEach((card) => {
        const track = card.getAttribute('data-career');
        const show = filter === 'all' || track === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  document.querySelectorAll('.explore-career-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.career-card');
      const title = card?.querySelector('.career-card-title')?.textContent || 'Career Path';
      navigateTo404(`Explore Career — ${title}`);
    });
  });

  // 5F. Career Resources Blog Read Full Guide Buttons -> 404 Page
  document.querySelectorAll('.blog-read-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.blog-card');
      const title = card?.querySelector('.blog-title')?.textContent || 'Career Guide';
      navigateTo404(`Read Guide — ${title}`);
    });
  });

  /* ------------------------------------------------------------------------
     6. SCROLL-TRIGGERED ANIMATED NUMBER COUNTERS (WHY CHOOSE US)
     ------------------------------------------------------------------------ */
  const counterNumbers = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counterNumbers.forEach((counterEl) => {
      const target = parseInt(counterEl.getAttribute('data-target') || '0', 10);
      const duration = 1800;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(eased * target);
        counterEl.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counterEl.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  const countersBanner = document.getElementById('countersBanner');
  if (countersBanner && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(countersBanner);
  } else {
    animateCounters();
  }

  /* ------------------------------------------------------------------------
     7. CANDIDATE SUCCESS STORIES TESTIMONIAL SLIDER
     ------------------------------------------------------------------------ */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');
  let currentSlide = 0;
  let sliderInterval = null;

  function goToSlide(index) {
    if (!testimonialTrack || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, idx) => {
      const isActive = idx === currentSlide;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    sliderInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6500);
  }

  function stopAutoSlide() {
    if (sliderInterval) clearInterval(sliderInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide') || '0', 10);
      goToSlide(targetIndex);
      startAutoSlide();
    });
  });

  const testimonialViewport = document.getElementById('testimonialViewport');
  if (testimonialViewport) {
    testimonialViewport.addEventListener('mouseenter', stopAutoSlide);
    testimonialViewport.addEventListener('mouseleave', startAutoSlide);
  }
  startAutoSlide();

  /* ------------------------------------------------------------------------
     8. FUNCTIONAL NEWSLETTER EMAIL VALIDATION (FOOTER)
     ------------------------------------------------------------------------ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterInputGroup = document.getElementById('newsletterInputGroup');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (newsletterForm && newsletterEmail && newsletterInputGroup && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawValue = newsletterEmail.value.trim();

      newsletterInputGroup.classList.remove('input-error', 'input-success');
      newsletterFeedback.classList.remove('error', 'success');

      if (!rawValue) {
        newsletterInputGroup.classList.add('input-error');
        newsletterFeedback.classList.add('error');
        newsletterFeedback.textContent = 'Please enter your email address to subscribe.';
        newsletterEmail.focus();
        return;
      }

      if (!emailRegex.test(rawValue)) {
        newsletterInputGroup.classList.add('input-error');
        newsletterFeedback.classList.add('error');
        newsletterFeedback.textContent = 'Please enter a valid email address (e.g., alex@company.com).';
        newsletterEmail.focus();
        return;
      }

      // Valid email: show brief confirmation and route to 404 confirmation page
      newsletterInputGroup.classList.add('input-success');
      newsletterFeedback.classList.add('success');
      newsletterFeedback.textContent = `✓ Validated! Redirecting subscription for ${rawValue}...`;
      setTimeout(() => {
        navigateTo404(`Newsletter Subscription (${rawValue})`);
      }, 450);
    });
  }
});
