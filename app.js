// DOM Content Loaded - Arabic RTL Website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initScrollEffects();
    initSmoothScrolling();
    initScrollAnimations();
});

// Navigation functionality with RTL support
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('show');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navToggle && navMenu && !navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });

    // Update active navigation link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll effects for header
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        // Add/remove header shadow based on scroll position
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    // Handle all anchor links that start with #
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        
        e.preventDefault();
        
        const targetId = target.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    });
}

// Contact form functionality - FIXED VERSION
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Add real-time validation
    const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Email validation
    const emailField = contactForm.querySelector('input[type="email"]');
    if (emailField) {
        emailField.addEventListener('blur', validateEmail);
    }
    
    // Ensure all form fields are working
    const allFormFields = contactForm.querySelectorAll('input, textarea, select');
    allFormFields.forEach(field => {
        // Remove any potential blocking attributes
        field.removeAttribute('readonly');
        field.removeAttribute('disabled');
        
        // Ensure proper event handling
        field.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-accent)';
        });
        
        field.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.borderColor = '';
            }
        });
    });
}

// Handle contact form submission - FIXED VERSION
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateContactForm(form)) {
        showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
        return;
    }
    
    // Get form data
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'جاري الإرسال...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showNotification('شكراً لك على رسالتك! سنتواصل معك قريباً.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Remove any error states
        clearAllFieldErrors(form);
        
        console.log('تم إرسال نموذج الاتصال:', contactData);
    }, 1500);
}

// Validate entire contact form
function validateContactForm(form) {
    let isValid = true;
    
    // Clear previous errors
    clearAllFieldErrors(form);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'هذا الحقل مطلوب');
            isValid = false;
        }
    });
    
    // Validate email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        if (!isValidEmail(emailField.value)) {
            showFieldError(emailField, 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }
    }
    
    // Validate message length
    const messageField = form.querySelector('textarea[name="message"]');
    if (messageField && messageField.value && messageField.value.trim().length < 10) {
        showFieldError(messageField, 'يجب أن تكون الرسالة 10 أحرف على الأقل');
        isValid = false;
    }
    
    // Validate name (Arabic characters support)
    const nameField = form.querySelector('input[name="name"]');
    if (nameField && nameField.value && nameField.value.trim().length < 2) {
        showFieldError(nameField, 'يجب أن يكون الاسم حرفين على الأقل');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'هذا الحقل مطلوب');
    } else {
        clearFieldError(field);
    }
}

// Validate email field
function validateEmail(e) {
    const field = e.target;
    
    if (field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
    } else if (field.value) {
        clearFieldError(field);
    }
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error - RTL support
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--color-error)';
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
        display: block;
        text-align: right;
        font-family: var(--font-family-arabic);
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear all field errors
function clearAllFieldErrors(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        clearFieldError(field);
    });
}

// Show notification - Arabic support
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: var(--space-16) var(--space-24);
        border-radius: var(--radius-base);
        border-right: 4px solid var(--color-${type === 'success' ? 'accent' : type === 'error' ? 'error' : 'primary'});
        box-shadow: 0 8px 25px rgba(44, 95, 65, 0.2);
        z-index: 1001;
        max-width: 400px;
        transform: translateX(-100%);
        transition: transform var(--duration-normal) var(--ease-standard);
        font-family: var(--font-family-arabic);
        text-align: right;
        direction: rtl;
    `;
    
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        const animatedElements = document.querySelectorAll('.value__card, .product__card, .service__card, .portfolio__card, .blog__card');
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.value__card, .product__card, .service__card, .portfolio__card, .blog__card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Utility functions
function debounce(func, wait) {
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    }
}, 250));

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    }
});

// Page loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Blog link interactions (since they don't have actual destinations)
document.addEventListener('DOMContentLoaded', function() {
    const blogLinks = document.querySelectorAll('.blog__link');
    
    blogLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('ميزة المدونة قريباً! ترقب التحديثات.', 'info');
        });
    });
});

// Enhanced button functionality with Arabic feedback
document.addEventListener('DOMContentLoaded', function() {
    // Handle all buttons with proper functionality
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        const href = button.getAttribute('href');
        
        // Skip submit buttons as they have their own handling
        if (button.type === 'submit') {
            return;
        }
        
        // Handle navigation buttons
        if (href && href.startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

// Form enhancement for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Enhance form placeholders and labels
    const formInputs = document.querySelectorAll('.contact__form input, .contact__form textarea, .contact__form select');
    
    formInputs.forEach(input => {
        // Add focus and blur animations
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
    
    // Phone number formatting for Arabic numbers
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            
            // Format Saudi phone numbers
            if (value.startsWith('966')) {
                value = '+966 ' + value.slice(3, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 12);
            } else if (value.startsWith('05')) {
                value = '+966 ' + value.slice(1, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
            }
            
            e.target.value = value;
        });
    }
});

// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels for better accessibility
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'فتح القائمة');
        navToggle.setAttribute('aria-expanded', 'false');
        
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.setAttribute('aria-label', isExpanded ? 'فتح القائمة' : 'إغلاق القائمة');
        });
    }
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'انتقل إلى المحتوى الرئيسي';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
    `;
    
    // Show skip link on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Performance optimization - Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    // Add intersection observer for image placeholders
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    });
    
    const imagePlaceholders = document.querySelectorAll('.image__placeholder');
    imagePlaceholders.forEach(placeholder => {
        imageObserver.observe(placeholder);
    });
});

// RTL-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Ensure proper RTL behavior for all interactive elements
    const interactiveElements = document.querySelectorAll('button, input, textarea, select, a');
    
    interactiveElements.forEach(element => {
        // Add proper RTL focus handling
        element.addEventListener('focus', function() {
            this.style.direction = 'rtl';
        });
    });
    
    // Enhanced form validation messages in Arabic
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('invalid', function(e) {
            e.preventDefault();
            const field = e.target;
            
            // Custom validation messages in Arabic
            if (field.validity.valueMissing) {
                showFieldError(field, 'هذا الحقل مطلوب');
            } else if (field.validity.typeMismatch && field.type === 'email') {
                showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
            } else if (field.validity.tooShort) {
                showFieldError(field, `يجب أن يكون النص ${field.minLength} أحرف على الأقل`);
            }
        }, true);
    }
});