// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navigation = document.getElementById('navigation');
    
    if (mobileMenuToggle && navigation) {
        mobileMenuToggle.addEventListener('click', function() {
            navigation.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navigation.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navigation.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navigation.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    function smoothScrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const emergencyBannerHeight = document.querySelector('.emergency-banner')?.offsetHeight || 0;
            const offsetTop = targetSection.offsetTop - headerHeight - emergencyBannerHeight - 20;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking
            if (navigation) {
                navigation.classList.remove('active');
                if (mobileMenuToggle) {
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    }

    // Handle all navigation and CTA links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                smoothScrollToSection(targetId);
            }
        });
    });

    // Handle phone call links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the phone link work naturally, but track the event
            console.log('Phone call initiated:', this.href);
        });
    });

    // Active Navigation Link Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const emergencyBannerHeight = document.querySelector('.emergency-banner')?.offsetHeight || 0;
        const scrollPosition = window.scrollY + headerHeight + emergencyBannerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Scroll event listener with throttling
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
            updateActiveNavLink();
            toggleBackToTopButton();
        }, 10);
    });

    // Testimonials Carousel
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialIndicators = document.querySelectorAll('.indicator');
    const prevButton = document.getElementById('prevTestimonial');
    const nextButton = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let testimonialInterval;

    function showTestimonialSlide(index) {
        if (testimonialSlides.length === 0) return;
        
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (testimonialSlides[index]) {
            testimonialSlides[index].classList.add('active');
        }
        if (testimonialIndicators[index]) {
            testimonialIndicators[index].classList.add('active');
        }
        currentSlide = index;
    }

    function nextTestimonial() {
        const nextIndex = (currentSlide + 1) % testimonialSlides.length;
        showTestimonialSlide(nextIndex);
    }

    function prevTestimonial() {
        const prevIndex = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showTestimonialSlide(prevIndex);
    }

    function startTestimonialAutoplay() {
        if (testimonialSlides.length > 1) {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        }
    }

    function stopTestimonialAutoplay() {
        if (testimonialInterval) {
            clearInterval(testimonialInterval);
        }
    }

    // Event listeners for testimonial controls
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextTestimonial();
            stopTestimonialAutoplay();
            startTestimonialAutoplay();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevTestimonial();
            stopTestimonialAutoplay();
            startTestimonialAutoplay();
        });
    }

    testimonialIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showTestimonialSlide(index);
            stopTestimonialAutoplay();
            startTestimonialAutoplay();
        });
    });

    // Start testimonial autoplay
    if (testimonialSlides.length > 0) {
        startTestimonialAutoplay();

        // Pause autoplay when hovering over testimonials
        const testimonialCarousel = document.querySelector('.testimonials-carousel');
        if (testimonialCarousel) {
            testimonialCarousel.addEventListener('mouseenter', stopTestimonialAutoplay);
            testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoplay);
        }
    }

    // Form Validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        input.classList.remove('success');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    function showSuccess(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        input.classList.add('success');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    function validateInput(input) {
        const value = input.value.trim();
        const name = input.name;
        let isValid = true;

        switch (name) {
            case 'fullName':
            case 'name':
                if (value.length < 2) {
                    showError(input, 'Name must be at least 2 characters long');
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    showError(input, 'Name should only contain letters and spaces');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'age':
                if (value === '' || value < 1 || value > 120) {
                    showError(input, 'Please enter a valid age between 1-120');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'phone':
                if (!validatePhone(value)) {
                    showError(input, 'Please enter a valid 10-digit phone number');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'email':
                if (value && !validateEmail(value)) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'doctor':
                if (!value) {
                    showError(input, 'Please select a doctor');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'appointmentDate':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (!value) {
                    showError(input, 'Please select an appointment date');
                    isValid = false;
                } else if (selectedDate < today) {
                    showError(input, 'Please select a future date');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'terms':
                if (!input.checked) {
                    showError(input, 'Please accept the terms and conditions');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            case 'message':
                if (value.length < 10) {
                    showError(input, 'Message must be at least 10 characters long');
                    isValid = false;
                } else {
                    showSuccess(input);
                }
                break;

            default:
                if (input.required && !value) {
                    showError(input, 'This field is required');
                    isValid = false;
                } else if (value) {
                    showSuccess(input);
                }
        }

        return isValid;
    }

    // Real-time validation for appointment form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const appointmentInputs = appointmentForm.querySelectorAll('input, select, textarea');
        
        appointmentInputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        // Set minimum date to today
        const dateInput = appointmentForm.querySelector('input[name="appointmentDate"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            appointmentInputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Show loading state
                const submitButton = appointmentForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Appointment...';
                submitButton.disabled = true;
                appointmentForm.classList.add('loading');

                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    showSuccessMessage('appointment', 'Appointment booked successfully! We will contact you shortly to confirm the details.');
                    
                    // Reset form
                    appointmentForm.reset();
                    appointmentInputs.forEach(input => {
                        input.classList.remove('error', 'success');
                        const errorDiv = input.parentElement.querySelector('.error-message');
                        if (errorDiv) {
                            errorDiv.style.display = 'none';
                        }
                    });
                    
                    // Reset button
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    appointmentForm.classList.remove('loading');
                }, 2000);
            } else {
                // Scroll to first error
                const firstError = appointmentForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    }

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const contactInputs = contactForm.querySelectorAll('input, textarea');
        
        contactInputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            contactInputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
                contactForm.classList.add('loading');

                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    showSuccessMessage('contact', 'Message sent successfully! We will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    contactInputs.forEach(input => {
                        input.classList.remove('error', 'success');
                        const errorDiv = input.parentElement.querySelector('.error-message');
                        if (errorDiv) {
                            errorDiv.style.display = 'none';
                        }
                    });
                    
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    contactForm.classList.remove('loading');
                }, 1500);
            }
        });
    }

    function showSuccessMessage(formType, message) {
        // Remove existing success messages
        const existingMessages = document.querySelectorAll('.success-message');
        existingMessages.forEach(msg => msg.remove());

        // Create and show new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        const form = formType === 'appointment' ? appointmentForm : contactForm;
        if (form) {
            form.appendChild(successDiv);

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successDiv.classList.remove('show');
                setTimeout(() => successDiv.remove(), 300);
            }, 5000);
        }
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTopButton() {
        if (backToTopButton) {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    }

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Handle phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
    });

    // Handle accessibility improvements
    function improveAccessibility() {
        // Add ARIA labels to buttons without text
        const iconButtons = document.querySelectorAll('button:not([aria-label])');
        iconButtons.forEach(button => {
            if (button.querySelector('i') && !button.textContent.trim()) {
                const icon = button.querySelector('i');
                if (icon.classList.contains('fa-chevron-up')) {
                    button.setAttribute('aria-label', 'Back to top');
                } else if (icon.classList.contains('fa-chevron-left')) {
                    button.setAttribute('aria-label', 'Previous testimonial');
                } else if (icon.classList.contains('fa-chevron-right')) {
                    button.setAttribute('aria-label', 'Next testimonial');
                }
            }
        });
    }

    improveAccessibility();

    // Service cards and doctor cards hover effects
    const interactiveCards = document.querySelectorAll('.service-card, .doctor-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('service-card')) {
                this.style.transform = 'translateY(-4px)';
            } else {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // WhatsApp button click tracking
    const whatsappButton = document.querySelector('.whatsapp-chat');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            // Track WhatsApp clicks (for analytics)
            console.log('WhatsApp chat initiated');
        });
    }

    // Smooth reveal animations on scroll
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.service-card, .doctor-card, .feature');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize reveal animation styles
    const revealElements = document.querySelectorAll('.service-card, .doctor-card, .feature');
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Initialize the page
    updateActiveNavLink();
    toggleBackToTopButton();
    
    console.log('Eve\'s Nursing Home website initialized successfully!');
});