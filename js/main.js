/**
 * Voice Forte - Main JavaScript
 * Version: 4.0 - Optimized
 */

class VoiceForteApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupFormHandlers();
        this.setupAnimations();
        this.setupCurrentYear();
        this.setupHeaderEffects();
        this.setupCounters();
        this.setupSocialLinks();
    }

    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuBtn || !navLinks) return;

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });

        // Close menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupFormHandlers() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                try {
                    // Validate form
                    if (!this.validateForm(contactForm)) {
                        throw new Error('Please fill in all required fields correctly.');
                    }
                    
                    // Simulate API call
                    await this.simulateApiCall();
                    
                    // Show success
                    this.showNotification('Message sent successfully! We\'ll contact you within 24 hours.', 'success');
                    contactForm.reset();
                    
                } catch (error) {
                    this.showNotification(error.message, 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]');
                
                if (this.validateEmail(email.value)) {
                    this.showNotification('Thank you for subscribing!', 'success');
                    email.value = '';
                } else {
                    this.showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
            
            if (field.type === 'email' && !this.validateEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements
        document.querySelectorAll('.card, .service-item, .value-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCurrentYear() {
        const yearElements = document.querySelectorAll('[data-current-year], .current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    setupHeaderEffects() {
        const header = document.querySelector('.main-header');
        
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = 'rgba(15, 23, 42, 0.98)';
                header.style.boxShadow = 'var(--shadow-lg)';
            } else {
                header.style.background = 'rgba(15, 23, 42, 0.97)';
                header.style.boxShadow = 'var(--shadow-md)';
            }
            
            lastScroll = currentScroll;
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    setupSocialLinks() {
        // Add tooltips to social links
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            const platform = link.href.includes('facebook') ? 'Facebook' :
                           link.href.includes('instagram') ? 'Instagram' :
                           link.href.includes('youtube') ? 'YouTube' :
                           link.href.includes('tiktok') ? 'TikTok' :
                           link.href.includes('linkedin') ? 'LinkedIn' : 'Social';
            
            link.setAttribute('title', `Follow us on ${platform}`);
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceForteApp();
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .mobile-menu-btn.active .menu-bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active .menu-bar:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active .menu-bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .form-control.error {
            border-color: #ef4444;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                transition: left 0.3s ease;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceForteApp;
}
