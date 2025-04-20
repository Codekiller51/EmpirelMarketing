document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    navContainer.insertBefore(hamburger, navMenu);
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeOptions);
    
    fadeElements.forEach(element => fadeObserver.observe(element));
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navOptions = {
        threshold: 0.5
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href').slice(1) === entry.target.id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navOptions);
    
    sections.forEach(section => navObserver.observe(section));
});