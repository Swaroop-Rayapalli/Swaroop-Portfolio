(function () {
  'use strict';


  /* ── Typing Effect ──────────────────────────────────────────────── */
  function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const phrases = [
      "Cybersecurity Enthusiast",
      "Full Stack Developer",
      "Ethical Hacker in Training",
      "Problem Solver"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ── 3D Scroll Reveals (Restored) ────────────────────────────────── */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-3d, .reveal-3d-left, .reveal-3d-right, .stagger-3d');

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optionally unobserve if you only want it once
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  /* ── Project Card 3D Tilt (Restored) ─────────────────────────────── */
  function initCardTilt() {
    // We use delegation since cards might be loaded dynamically
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    grid.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.project-card');
      if (card) {
        card.style.transform = '';
      }
    }, true);
  }

  /* ── 3D Scroll Perspective (Restored) ────────────────────────────── */
  function handleScroll3D() {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.reveal-3d');

    sections.forEach(section => {
      if (section.classList.contains('active')) {
        const rect = section.getBoundingClientRect();
        const midpoint = window.innerHeight / 2;
        const distance = rect.top + rect.height / 2 - midpoint;
        const rotation = (distance / window.innerHeight) * 5; // Subtle 5deg max

        // Only apply if it's already active to avoid interfering with reveal
        section.style.transform = `rotateX(${rotation}deg)`;
      }
    });
  }

  /* ── Scroll Progress ────────────────────────────────────────────── */
  function updateScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  }

  /* ── Image Carousel Helper ────────────────────────────────────────── */
  /**
   * Builds a carousel DOM element for a given images array.
   * Returns an object { el, startAuto, stopAuto } so callers can
   * pause / resume the auto-slide (e.g. when modal opens/closes).
   */
  function buildCarousel(images, autoplayMs) {
    autoplayMs = autoplayMs || 3000;

    // Normalise: if only one image, wrap in array
    if (!Array.isArray(images) || images.length === 0) {
      images = ['images/pic01.jpg'];
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    // Slides container
    const track = document.createElement('div');
    track.className = 'carousel-track';

    images.forEach(function (src, i) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide' + (i === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Project screenshot ' + (i + 1);
      img.loading = 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });

    wrapper.appendChild(track);

    // Only show controls / dots if more than one image
    let timer = null;
    let current = 0;
    const total = images.length;

    function goTo(index) {
      const slides = track.querySelectorAll('.carousel-slide');
      const dots = wrapper.querySelectorAll('.carousel-dot');
      slides[current].classList.remove('active');
      if (dots.length) dots[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
      if (dots.length) dots[current].classList.add('active');
    }

    if (total > 1) {
      // Prev / Next buttons
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-btn carousel-prev';
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current - 1);
      });

      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-btn carousel-next';
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current + 1);
      });

      wrapper.appendChild(prevBtn);
      wrapper.appendChild(nextBtn);

      // Dot indicators
      const dotsWrapper = document.createElement('div');
      dotsWrapper.className = 'carousel-dots';
      images.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(i);
        });
        dotsWrapper.appendChild(dot);
      });
      wrapper.appendChild(dotsWrapper);
    }

    function startAuto() {
      if (total <= 1) return;
      timer = setInterval(function () { goTo(current + 1); }, autoplayMs);
    }

    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function resetTimer() {
      stopAuto();
      // startAuto(); // Disabled
    }

    return { el: wrapper, startAuto: startAuto, stopAuto: stopAuto };
  }

  /* ── Project Cards ─────────────────────────────────────────────── */
  function renderProjects(projects) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!projects || projects.length === 0) {
      grid.innerHTML = '<p style="color:rgba(255,255,255,0.4);font-size:0.82rem;">No projects found.</p>';
      return;
    }

    projects.forEach(function (p, index) {
      const techTagsHTML = (p.tech || []).map(function (t) {
        return '<span class="tech-tag">' + t + '</span>';
      }).join('');

      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.transitionDelay = (index * 0.1) + 's';

      // Build image area
      const imageArea = document.createElement('div');
      imageArea.className = 'project-image';

      const cardImages = (p.images && p.images.length > 0) ? p.images : [p.image || 'images/pic01.jpg'];
      const { el: carouselEl, startAuto, stopAuto } = buildCarousel(cardImages, 3000);
      imageArea.appendChild(carouselEl);

      // Info section
      const infoEl = document.createElement('div');
      infoEl.className = 'project-info';
      infoEl.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tech-tags">${techTagsHTML}</div>
      `;

      card.appendChild(imageArea);
      card.appendChild(infoEl);

      // Wire up the click handler to open the modal
      card.addEventListener('click', function () {
        openModal(p);
      });

      grid.appendChild(card);
    });

    // Re-run reveal check (disabled)
    // reveal();
  }

  /* ── Modal ─────────────────────────────────────────────────────── */
  let _currentModalCarousel = null;

  function openModal(project) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    // Populate text
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-desc').textContent = project.long_description || project.description;

    // Tech tags
    const techTagsHTML = (project.tech || []).map(t => '<span class="tech-tag">' + t + '</span>').join('');
    document.getElementById('modal-tech').innerHTML = techTagsHTML;

    // Rebuild image carousel in modal
    const modalImageContainer = document.querySelector('.modal-image');
    if (modalImageContainer) {
      modalImageContainer.innerHTML = '';
      // Remove old static img if present
      const oldImg = document.getElementById('modal-img');
      if (oldImg) oldImg.remove();

      const modalImages = (project.images && project.images.length > 0)
        ? project.images
        : [project.image || 'images/pic01.jpg'];

      const { el, startAuto, stopAuto } = buildCarousel(modalImages, 4000);
      el.classList.add('modal-carousel');
      modalImageContainer.appendChild(el);

      if (_currentModalCarousel) _currentModalCarousel.stopAuto();
      _currentModalCarousel = { stopAuto };
      // startAuto(); // Disabled
    }

    // Links
    const demoBtn = document.getElementById('modal-demo');
    const githubBtn = document.getElementById('modal-github');

    if (project.demo && project.demo !== '#') {
      demoBtn.href = project.demo;
      demoBtn.style.display = 'inline-flex';
    } else {
      demoBtn.style.display = 'none';
    }

    if (project.github && project.github !== '#') {
      githubBtn.href = project.github;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.closeModal = function () {
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (_currentModalCarousel) {
        _currentModalCarousel.stopAuto();
        _currentModalCarousel = null;
      }
    }
  };

  /* ── 3D Profile Flip Logic ─────────────────────────────────────── */
  window.toggleProfileFlip = function () {
    const wrapper = document.querySelector('.cyber-core-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('flipped');
    }
  };

  window.addEventListener('click', function (e) {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
      window.closeModal();
    }
  });

  /* ── Load Projects from API ────────────────────────────────────── */
  function loadProjects() {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => renderProjects(data.projects))
      .catch(err => console.error('Error loading projects:', err));
  }



  /* ── ScrollSpy (Active Nav) ────────────────────────────────────── */
  function scrollSpy() {
    const sections = document.querySelectorAll('article, header[id]');
    const navLinks = document.querySelectorAll('.nav-container nav ul li a');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }

  /* ── Contact Form ──────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const toast = document.getElementById('contact-toast');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (submitBtn) {
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
      }

      fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showToast('Message sent successfully!', 'success');
            form.reset();
          } else {
            showToast(data.error || 'Failed to send message.', 'error');
          }
        })
        .catch(() => showToast('Error connecting to server.', 'error'))
        .finally(() => {
          if (submitBtn) {
            submitBtn.value = 'Send Message';
            submitBtn.disabled = false;
          }
        });
    });

    function showToast(msg, type) {
      if (!toast) return;
      toast.textContent = msg;
      toast.className = 'show ' + type;
      setTimeout(() => { toast.className = ''; }, 4000);
    }
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('wrapper');

    loadProjects();
    initContactForm();
    initTypingEffect();
    initScrollReveals();
    initCardTilt();

    window.addEventListener('scroll', () => {
      scrollSpy();
      updateScrollProgress();
      handleScroll3D();
    }, { passive: true });

    // Mark as ready for 1s fade-in as requested
    setTimeout(() => {
      if (wrapper) wrapper.classList.add('ready');
    }, 100);

    // Initial check
    scrollSpy();
    updateScrollProgress();
  });

})();
