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


  window.addEventListener('click', function (e) {
    const modal = document.getElementById('project-modal');
    if (e.target === modal) {
      window.closeModal();
    }
  });

  const LOCAL_PROJECTS = [
    {
      "id": 1,
      "title": "Information Gathering Tool",
      "description": "Python-based tool for gathering website metadata and open-source intelligence. Automated reconnaissance processes to identify potential vulnerabilities.",
      "long_description": "A comprehensive Python-based reconnaissance tool designed to automate the process of gathering website metadata, performing DNS lookups, and conducting open-source intelligence (OSINT). This tool streamlines the initial phases of penetration testing by identifying potential vulnerabilities and mapping out the target's digital footprint.",
      "tech": ["Python", "Requests", "BeautifulSoup", "Socket"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "#",
      "category": "Cybersecurity",
      "image": "images/project_info.png"
    },
    {
      "id": 2,
      "title": "PawCare Platform",
      "description": "Full-stack pet-care management platform with user authentication, appointment scheduling, and pet health tracking.",
      "long_description": "PawCare Platform is a robust full-stack solution tailored for pet owners and veterinary clinics. It features secure user authentication, intuitive appointment scheduling, and comprehensive pet health tracking. Built with Flask and PostgreSQL, the platform ensures data integrity and a seamless user experience for managing pet care efficiently.",
      "tech": ["Python", "Flask", "PostgreSQL", "HTML/CSS", "JavaScript"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://pawcare-chi.vercel.app",
      "category": "Web App",
      "image": "images/paw1.png",
      "images": ["images/paw1.png", "images/paw2.png", "images/paw.png"]
    },
    {
      "id": 3,
      "title": "Electronics Store",
      "description": "Responsive electronics store with Apple-inspired design and optimized performance for high Lighthouse scores.",
      "long_description": "An elegant, highly responsive electronics storefront heavily inspired by Apple's minimalist design philosophy. This frontend project focuses on achieving near-perfect Lighthouse performance scores through meticulous optimization, semantic HTML5 structure, and modern CSS3 techniques without relying on heavy frontend frameworks.",
      "tech": ["HTML5", "CSS3", "JavaScript", "SEO"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://electron-store.vercel.app",
      "category": "Web App",
      "image": "images/ele1.png",
      "images": ["images/ele1.png", "images/ele3.png", "images/ele2.png"]
    },
    {
      "id": 4,
      "title": "Women Fashions",
      "description": "Modern e-commerce platform with product catalog, cart, and admin dashboard. Built with Next.js and Prisma.",
      "long_description": "A cutting-edge e-commerce platform developed for Jyothi Boutique, offering a dynamic product catalog, seamless shopping cart experience, and a secure admin dashboard for inventory management. Utilizing Next.js for high-performance server-side rendering and Prisma for optimized database interactions, it provides a lightning-fast shopping experience.",
      "tech": ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://women-fashions.vercel.app",
      "category": "Web App",
      "image": "images/women_fashions.png",
      "images": ["images/women_fashions.png", "images/women_fashions1.png", "images/women_fashions2.png"]
    },
    {
      "id": 5,
      "title": "Amma Pickels",
      "description": "E-commerce platform for authentic homemade pickles with a clean product catalog and seamless ordering experience.",
      "long_description": "Amma Pickels is a dedicated e-commerce platform showcasing authentic, homemade pickle varieties. The platform features a clean product catalog, easy ordering flow, and a warm, traditional design that reflects the brand's home-kitchen roots.",
      "tech": ["HTML/CSS", "JavaScript"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://amma-pickels.vercel.app",
      "category": "Web App",
      "image": "images/pickels1.png",
      "images": ["images/pickels1.png", "images/pickels2.png", "images/pickels3.png"]
    },
    {
      "id": 6,
      "title": "Jyothi Boutique",
      "description": "Elegant boutique website showcasing maggam works, designer blouses, and custom stitching services.",
      "long_description": "A stylish website designed for Jyothi Boutique in Visakhapatnam to highlight premium maggam work, designer blouse stitching, saree fall and pico services. The platform presents service sections, gallery, contact options, and WhatsApp integration for direct customer communication. Built with a modern UI to reflect the elegance of fashion and boutique services.",
      "tech": ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://jyothi-boutique.vercel.app",
      "category": "Web App",
      "image": "images/jyothi_boutique.png",
      "images": ["images/jyothi_boutique.png", "images/jyothi_boutique1.png", "images/jyothi_boutique2.png"]
    },
    {
      "id": 7,
      "title": "Smart Business Intelligence Suite",
      "description": "End-to-end executive decision support suite integrating customer churn risk analysis, real estate valuation models, sales forecasting with Prophet, movie recommendation engine, and Power BI reporting.",
      "long_description": "Smart Business Intelligence Suite is a comprehensive enterprise analytics platform combining multiple predictive models. It features customer churn probability scoring, real estate fair market valuation, CSV sales forecasting via Meta's Prophet model, a collaborative movie recommendation engine, and live Power BI executive dashboards for actionable business insights.",
      "tech": ["Python", "Prophet", "Power BI", "Machine Learning", "Data Analytics"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://smart-bi-phi.vercel.app",
      "category": "Major Project",
      "image": "images/smart_bi.png"
    },
    {
      "id": 8,
      "title": "AI Healthcare Intelligence System",
      "description": "Advanced predictive analytics platform featuring cardiovascular disease risk assessment, medical insurance fraud detection, and time-series medicine demand forecasting.",
      "long_description": "AI Healthcare Intelligence System provides clinical and operational predictive solutions for healthcare providers. It includes a cardiovascular risk diagnosis calculator, an automated medical insurance claim fraud detector to mitigate financial loss, and a time-series inventory forecasting module for optimizing pharmaceutical supply chains.",
      "tech": ["Python", "Machine Learning", "Time-Series", "Healthcare AI", "Flask"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://aihealthcare-livid.vercel.app",
      "category": "Major Project",
      "image": "images/ai_healthcare.png"
    },
    {
      "id": 9,
      "title": "Student Performance Predictor",
      "description": "Interactive machine learning web application to forecast student Academic Performance Index based on study hours, past scores, and extracurricular activities.",
      "long_description": "Student Performance Predictor leverages regression modeling to evaluate academic input metrics—such as daily study hours, attendance percentages, and previous exam scores—to accurately forecast a student's GPA and academic outcome in real time.",
      "tech": ["Python", "Scikit-Learn", "Machine Learning", "Data Analytics"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://studentpredict-five.vercel.app",
      "category": "Machine Learning",
      "image": "images/student_predict.png"
    },
    {
      "id": 10,
      "title": "SentiMind - Sentiment Analytics Dashboard",
      "description": "NLP-driven sentiment analysis dashboard providing real-time text classification, emotion scoring, and interactive tone analytics.",
      "long_description": "SentiMind is an interactive Natural Language Processing dashboard that analyzes textual inputs, customer feedback, or social media commentary. It yields real-time sentiment polarities (Positive, Neutral, Negative), confidence percentages, and emotion radars.",
      "tech": ["Python", "NLP", "Sentiment Analysis", "Data Visualization"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://sentimentanalysis-ashy-one.vercel.app",
      "category": "Machine Learning",
      "image": "images/sentiment_analytics.png"
    },
    {
      "id": 11,
      "title": "Sales Future Predictor",
      "description": "Predictive sales forecasting engine using time-series analysis to project future sales revenue and trend insights.",
      "long_description": "Sales Future Predictor enables businesses to forecast revenue trends by applying time-series prediction models. It allows users to upload historic transactional data, auto-detect date and sales columns, and visualize projected seasonal revenue growth.",
      "tech": ["Python", "Prophet", "Time-Series", "Data Analytics"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://salesfuturepredict.vercel.app",
      "category": "Data Analytics",
      "image": "images/sales_predict.png"
    },
    {
      "id": 12,
      "title": "AI-Powered Resume Screener & Parser",
      "description": "Automated resume parser and job role matcher utilizing Natural Language Processing to extract candidate skills and calculate ATS match scores.",
      "long_description": "An intelligent applicant tracking and candidate evaluation tool built with NLP. It extracts key contact details, work experience, and technical competencies from resume documents, matching them against job descriptions to generate automated ATS compatibility scores.",
      "tech": ["Python", "NLP", "Text Mining", "Scikit-Learn"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://resumescreening-eight.vercel.app",
      "category": "Machine Learning",
      "image": "images/resume_screener.png"
    },
    {
      "id": 13,
      "title": "House Price Prediction Engine",
      "description": "Real estate market valuation web app that predicts residential property prices using regression models and structural parameters.",
      "long_description": "House Price Prediction Engine provides real-time property market valuations by evaluating key structural factors such as square footage, bedroom/bathroom counts, neighborhood parameters, and construction age using supervised regression algorithms.",
      "tech": ["Python", "Scikit-Learn", "Regression Analysis", "Data Analytics"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://housepricepred-six.vercel.app",
      "category": "Machine Learning",
      "image": "images/house_price.png"
    },
    {
      "id": 14,
      "title": "Movie Recommendation Engine",
      "description": "Personalized movie recommender system implementing collaborative and content-based filtering algorithms to suggest top-rated films.",
      "long_description": "Movie Recommendation Engine processes user viewing preferences and rating histories to generate highly tailored film recommendations. Utilizing matrix factorization and cosine similarity, it curates personalized movie lists across genres.",
      "tech": ["Python", "Recommender Systems", "Collaborative Filtering", "Data Science"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://movierecommend-kappa.vercel.app",
      "category": "Machine Learning",
      "image": "images/movie_recommend.png"
    },
    {
      "id": 15,
      "title": "CardioPulse AI - Heart Disease Risk Dashboard",
      "description": "Clinical risk assessment application that evaluates cardiovascular disease risk factors using supervised machine learning algorithms.",
      "long_description": "CardioPulse AI is a medical decision support dashboard designed to assist clinicians and individuals in evaluating cardiac risk. By analyzing biometric indicators—including blood pressure, cholesterol levels, resting heart rate, and age—it calculates cardiovascular risk probabilities.",
      "tech": ["Python", "Scikit-Learn", "Healthcare AI", "Predictive Modeling"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://heart-disease-predict-ochre.vercel.app",
      "category": "Machine Learning",
      "image": "images/heart_disease.png"
    },
    {
      "id": 16,
      "title": "TruthScanner - AI Fake News Detector",
      "description": "AI-powered text verification tool that analyzes article credibility, language patterns, and news authenticity using classification models.",
      "long_description": "TruthScanner combat mis-information by deploying text classification models trained on extensive journalistic datasets. Users can input news headlines or article text to receive an authenticity confidence score and linguistic bias audit.",
      "tech": ["Python", "NLP", "Text Classification", "Machine Learning"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://fakenewsdetect-snowy.vercel.app",
      "category": "Machine Learning",
      "image": "images/fake_news.png"
    },
    {
      "id": 17,
      "title": "SentinelShield - Fraud Transaction Detection",
      "description": "Real-time financial anomaly detection dashboard designed to flag suspicious banking transactions and prevent fraudulent activities.",
      "long_description": "SentinelShield is a financial cybersecurity monitoring application that applies anomaly detection algorithms to transaction streams. It highlights high-risk transactions, flags geo-location anomalies, and alerts security analysts to potential credit card fraud.",
      "tech": ["Python", "Anomaly Detection", "Cybersecurity", "Machine Learning"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://fraud-detection-woad.vercel.app",
      "category": "Cybersecurity",
      "image": "images/fraud_detection.png"
    },
    {
      "id": 18,
      "title": "Customer Churn Predictor",
      "description": "Consumer retention analytics app predicting subscription churn likelihood based on customer usage and billing behavior.",
      "long_description": "Customer Churn Predictor helps subscription businesses reduce customer drop-off by evaluating account metrics, monthly charges, tenure, and service tickets to flag high-risk accounts and outline proactive retention steps.",
      "tech": ["Python", "Scikit-Learn", "Predictive Analytics", "Data Analytics"],
      "github": "https://github.com/Swaroop-Rayapalli",
      "demo": "https://churnprediction-kappa.vercel.app",
      "category": "Data Analytics",
      "image": "images/churn_predict.png"
    }
  ];

  let allProjectsCache = [];
  let currentFilter = 'All';

  function initProjectFilters() {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter') || 'All';
      filterAndRenderProjects();
    });
  }

  function filterAndRenderProjects() {
    let filtered = allProjectsCache;
    if (currentFilter && currentFilter !== 'All') {
      filtered = allProjectsCache.filter(p => p.category === currentFilter);
    }
    renderProjects(filtered);
  }

  /* ── Load Projects from API ────────────────────────────────────── */
  function loadProjects() {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        allProjectsCache = (data.projects && data.projects.length > 0) ? data.projects : LOCAL_PROJECTS;
        filterAndRenderProjects();
      })
      .catch(err => {
        console.warn('API load failed, falling back to local dataset:', err);
        allProjectsCache = LOCAL_PROJECTS;
        filterAndRenderProjects();
      });
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

  /* ── Mobile Menu Toggle ──────────────────────────────────────── */
  function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-container nav');
    const navLinks = document.querySelectorAll('.nav-container nav ul li a');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('wrapper');

    initProjectFilters();
    loadProjects();
    initContactForm();
    initTypingEffect();
    initScrollReveals();
    initCardTilt();
    initMobileMenu();

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
