// Multi-page navigation system
class MultiPageApp {
  constructor() {
    this.currentSection = 'home';
    this.sections = document.querySelectorAll('.section');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.testimonialSlider = null;
    
    this.init();
  }

  init() {
    // Initialize sections first
    this.initializeSections();
    
    // Setup navigation
    this.setupNavigation();
    this.setupMobileNav();
    this.setupContactForm();
    
    // Initialize testimonial slider
    this.testimonialSlider = new TestimonialSlider();
    
    // Handle initial load
    this.handleInitialLoad();
  }

  initializeSections() {
    // Hide all sections except home
    this.sections.forEach((section, index) => {
      if (section.id === 'home') {
        section.classList.add('active');
        section.style.display = 'block';
      } else {
        section.classList.remove('active');
        section.style.display = 'none';
      }
    });
  }

  setupNavigation() {
    // Handle nav link clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('href').substring(1);
        this.showSection(targetSection);
        this.updateActiveNav(link);
        this.closeMobileNav();
      });
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1) || 'home';
      this.showSection(hash);
      this.updateActiveNavFromHash(hash);
    });
  }

  setupMobileNav() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileNav();
      });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (this.navToggle && this.navMenu && 
          !this.navToggle.contains(e.target) && 
          !this.navMenu.contains(e.target)) {
        this.closeMobileNav();
      }
    });
  }

  toggleMobileNav() {
    if (this.navMenu) {
      this.navMenu.classList.toggle('open');
    }
    if (this.navToggle) {
      this.navToggle.classList.toggle('active');
      // Update aria-expanded
      const isOpen = this.navMenu.classList.contains('open');
      this.navToggle.setAttribute('aria-expanded', isOpen.toString());
    }
  }

  closeMobileNav() {
    if (this.navMenu) {
      this.navMenu.classList.remove('open');
    }
    if (this.navToggle) {
      this.navToggle.classList.remove('active');
      this.navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  showSection(sectionId) {
    // Hide all sections
    this.sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
      this.currentSection = sectionId;
      
      // Update URL without triggering hashchange
      if (history.pushState) {
        history.pushState(null, null, `#${sectionId}`);
      } else {
        window.location.hash = sectionId;
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update page title
      this.updatePageTitle(sectionId);
    }
  }

  updateActiveNav(activeLink) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  updateActiveNavFromHash(hash) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${hash}`) {
        link.classList.add('active');
      }
    });
  }

  updatePageTitle(sectionId) {
    const titles = {
      'home': 'EVE\'S CLINIC - Premier Healthcare in Dum Dum, Kolkata',
      'about': 'About Us - EVE\'S CLINIC',
      'doctors': 'Our Doctors - EVE\'S CLINIC',
      'services': 'Medical Services - EVE\'S CLINIC',
      'facilities': 'Our Facilities - EVE\'S CLINIC',
      'careers': 'Careers - EVE\'S CLINIC',
      'contact': 'Contact Us - EVE\'S CLINIC',
      'admin': 'Administration - EVE\'S CLINIC'
    };
    document.title = titles[sectionId] || titles['home'];
  }

  handleInitialLoad() {
    const hash = window.location.hash.substring(1) || 'home';
    this.showSection(hash);
    this.updateActiveNavFromHash(hash);
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(contactForm);
      });
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.phone || !data.email || !data.department) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(data.phone)) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(`Thank you ${data.name}! Your appointment request has been submitted. We will contact you shortly at ${data.phone}.`);
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
}

// Testimonial Slider
class TestimonialSlider {
  constructor() {
    this.slider = document.getElementById('testimonials-slider');
    this.testimonials = document.querySelectorAll('.testimonial');
    this.controls = document.querySelectorAll('.testimonial-btn');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 4000; // 4 seconds
    
    this.init();
  }

  init() {
    if (this.testimonials.length > 0) {
      this.setupControls();
      this.startAutoPlay();
      this.setupMouseEvents();
      
      // Initialize first slide
      this.goToSlide(0);
    }
  }

  setupControls() {
    this.controls.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.testimonials.length) return;
    
    // Hide all testimonials
    this.testimonials.forEach(testimonial => {
      testimonial.classList.remove('active');
    });

    // Remove active from all controls
    this.controls.forEach(btn => {
      btn.classList.remove('active');
    });

    // Show target testimonial
    this.testimonials[index].classList.add('active');
    if (this.controls[index]) {
      this.controls[index].classList.add('active');
    }
    
    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.testimonials.length;
    this.goToSlide(nextIndex);
  }

  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  setupMouseEvents() {
    if (this.slider) {
      this.slider.addEventListener('mouseenter', () => {
        this.stopAutoPlay();
      });

      this.slider.addEventListener('mouseleave', () => {
        this.startAutoPlay();
      });
    }
  }
}

// Button handlers
function setupButtonHandlers() {
  // Handle emergency call buttons
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Allow default behavior for tel: links
      console.log('Emergency call initiated:', link.href);
    });
  });

  // Handle WhatsApp links
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    
    link.addEventListener('click', (e) => {
      // Allow default behavior but log for tracking
      console.log('WhatsApp link clicked:', link.href);
    });
  });

  // Handle appointment booking buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if (btn.href && btn.href.includes('#contact')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Navigate to contact section
        window.multiPageApp.showSection('contact');
        window.multiPageApp.updateActiveNavFromHash('contact');
        
        // Focus on the form after navigation
        setTimeout(() => {
          const contactForm = document.getElementById('contact-form');
          if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const firstInput = contactForm.querySelector('input');
            if (firstInput) {
              firstInput.focus();
            }
          }
        }, 100);
      });
    }
  });
}

// Header scroll effect
class HeaderEffect {
  constructor() {
    this.header = document.getElementById('header');
    this.init();
  }

  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 100));
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Accessibility enhancements
function setupAccessibility() {
  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Escape key closes mobile nav
    if (e.key === 'Escape') {
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (navToggle) {
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Setup ARIA labels
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  const testimonialBtns = document.querySelectorAll('.testimonial-btn');
  testimonialBtns.forEach((btn, index) => {
    btn.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
  });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize main app
    window.multiPageApp = new MultiPageApp();
    
    // Initialize other components
    const headerEffect = new HeaderEffect();
    
    // Setup button handlers
    setupButtonHandlers();
    
    // Setup accessibility
    setupAccessibility();
    
    console.log('EVE\'S CLINIC website initialized successfully');
    
    // Debug info
    console.log('Sections found:', document.querySelectorAll('.section').length);
    console.log('Nav links found:', document.querySelectorAll('.nav-link').length);
    console.log('Testimonials found:', document.querySelectorAll('.testimonial').length);
    
  } catch (error) {
    console.error('Error initializing application:', error);
  }
});