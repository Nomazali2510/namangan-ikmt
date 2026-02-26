// Main JavaScript for NIKMT Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initLangSwitcher();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
});

// ===========================
// Header Scroll Effect
// ===========================
function initHeader() {
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
}

// ===========================
// Mobile Menu
// ===========================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on window resize (if desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// ===========================
// Language Switcher
// ===========================
function initLangSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (window.i18n) {
                window.i18n.setLang(lang);
            }
        });
    });
}

// ===========================
// Smooth Scroll
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
    // Add scroll-animate class to elements
    const animatedElements = document.querySelectorAll(
        '.about-card, .program-card, .advantage-item, .contact-card'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('scroll-animate');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ===========================
// Contact Form
// ===========================
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.phone) {
            showNotification(getFormMessage('error'), 'error');
            return;
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{9,}$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification(getFormMessage('invalidPhone'), 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        // Simulate API call
        setTimeout(() => {
            showNotification(getFormMessage('success'), 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

// ===========================
// Notification System
// ===========================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: calc(100% - 40px);
    `;

    // Add animation keyframes
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get form messages based on current language
function getFormMessage(key) {
    const messages = {
        uz: {
            success: "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
            error: "Iltimos, barcha majburiy maydonlarni to'ldiring.",
            invalidPhone: "Iltimos, to'g'ri telefon raqamini kiriting."
        },
        ru: {
            success: "Ваше сообщение успешно отправлено! Мы скоро свяжемся с вами.",
            error: "Пожалуйста, заполните все обязательные поля.",
            invalidPhone: "Пожалуйста, введите корректный номер телефона."
        },
        en: {
            success: "Your message has been sent successfully! We will contact you soon.",
            error: "Please fill in all required fields.",
            invalidPhone: "Please enter a valid phone number."
        }
    };

    const lang = window.i18n ? window.i18n.currentLang : 'uz';
    return messages[lang][key] || messages.uz[key];
}

// ===========================
// Utility Functions
// ===========================

// Debounce function for performance
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
