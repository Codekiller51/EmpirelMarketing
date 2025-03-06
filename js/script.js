'use strict';

class EmpireMarketing {
    constructor() {
        this.initializeVariables();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupGallery();
        this.handleInitialLoad();
    }

    initializeVariables() {
        // Navigation elements
        this.header = document.querySelector('header');
        this.hamburger = document.querySelector('.hamburger');
        this.nav = document.querySelector('.nav');
        this.overlay = document.querySelector('.overlay');
        this.navLinks = document.querySelectorAll('.nav a');
        
        // Scroll variables
        this.lastScroll = 0;
        this.scrollThreshold = 10;
        
        // Animation elements
        this.fadeElements = document.querySelectorAll('.fade-in');
    }

    setupEventListeners() {
        // Mobile navigation
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileNav());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobileNav());
        }

        // Close mobile nav when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileNav());
        });

        // Scroll handling
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Window resize handling
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Handle header visibility
        if (Math.abs(currentScroll - this.lastScroll) > this.scrollThreshold) {
            if (currentScroll > this.lastScroll && currentScroll > 100) {
                this.header?.classList.add('header-hidden');
            } else {
                this.header?.classList.remove('header-hidden');
            }
            this.lastScroll = currentScroll;
        }
    }

    toggleMobileNav() {
        if (!this.hamburger || !this.nav || !this.overlay) return;
        
        this.hamburger.classList.toggle('active');
        this.nav.classList.toggle('active');
        this.overlay.classList.toggle('visible');
        document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
        
        // Update ARIA attributes
        const isExpanded = this.hamburger.classList.contains('active');
        this.hamburger.setAttribute('aria-expanded', isExpanded);
    }

    closeMobileNav() {
        if (!this.hamburger || !this.nav || !this.overlay) return;

        this.hamburger.classList.remove('active');
        this.nav.classList.remove('active');
        this.overlay.classList.remove('visible');
        document.body.style.overflow = '';
        this.hamburger.setAttribute('aria-expanded', 'false');
    }

    handleSmoothScroll(e) {
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const headerOffset = this.header?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        this.closeMobileNav();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('count-up')) {
                        this.startCountAnimation(entry.target);
                    }
                }
            });
        }, options);

        this.fadeElements.forEach(element => observer.observe(element));
    }

    startCountAnimation(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCount = () => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current < target) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target;
            }
        };

        updateCount();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('[type="submit"]');
        if (!submitButton) return;

        const originalText = submitButton.textContent;

        // Disable form submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitButton.textContent = 'Success!';
            form.reset();

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 2000);
        }, 1500);
    }

    setupGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalClose = document.getElementById('modal-close');

        if (!modal || !modalImage || !modalTitle || !modalDescription) return;

        const galleryData = {
            1: { title: 'Corporate Event Photography', description: 'High-quality photos from corporate events.', img: 'images/photo1.jpg' },
            2: { title: 'Creative Logo Design', description: 'Logos that resonate with your brand identity.', img: 'images/design1.jpg' },
            3: { title: 'Product Photography', description: 'Capturing the finest details of your products.', img: 'images/photo2.jpg' },
            4: { title: 'Brochure Design', description: 'Visually engaging brochures for marketing.', img: 'images/design2.jpg' },
            5: { title: 'Event Photography', description: 'Memorable moments captured professionally.', img: 'images/photo3.jpg' }
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                if (!id || !galleryData[id]) return;

                const data = galleryData[id];
                modalImage.src = data.img;
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                modal.classList.add('visible');
            });
        });

        modalClose?.addEventListener('click', () => {
            modal.classList.remove('visible');
        });
    }

    handleInitialLoad() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;

        // Remove loading screen when all content is loaded
        window.addEventListener('load', () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        });

        // Fallback: remove loading screen after 3 seconds even if load event hasn't fired
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentElement) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 3000);
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileNav();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmpireMarketing();
});