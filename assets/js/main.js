// D-Broft Technologies - Main JavaScript
// Modern vanilla JavaScript with 1-space indentation

 'use strict';

// Global variables
 const dbroft = {
  nav: null,
  navToggle: null,
  navMenu: null,
  scrollThreshold: 100,
  isMenuOpen: false,
  observers: new Map(),
  
// Initialize the application
  init() {
   this.cacheElements();
   this.bindEvents();
   this.initScrollAnimations();
   this.initNavigation();
   this.initSmoothScroll();
   this.initPerformanceOptimizations();
   console.log('D-Broft Technologies website initialized');
  },
  
// Cache DOM elements for performance
  cacheElements() {
   this.nav = document.getElementById('navbar');
   this.navToggle = document.getElementById('nav-toggle');
   this.navMenu = document.getElementById('nav-menu');
  },
  
// Bind event listeners
  bindEvents() {
// Navigation toggle
   if (this.navToggle) {
    this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
   }
   
// Scroll events (throttled)
   window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
   
// Resize events (debounced)
   window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
   
// Click outside to close mobile menu
   document.addEventListener('click', this.handleOutsideClick.bind(this));
   
// Keyboard navigation
   document.addEventListener('keydown', this.handleKeyboard.bind(this));
   
// Page load optimization
   window.addEventListener('load', this.handlePageLoad.bind(this));
  },
  
// Handle scroll events
  handleScroll() {
   const scrollY = window.scrollY;
   
// Update navigation appearance
   if (this.nav) {
    if (scrollY > this.scrollThreshold) {
     this.nav.classList.add('scrolled');
    } else {
     this.nav.classList.remove('scrolled');
    }
   }
   
// Update active navigation link
   this.updateActiveNavLink();
  },
  
// Handle window resize
  handleResize() {
// Close mobile menu on resize to desktop
   if (window.innerWidth > 768 && this.isMenuOpen) {
    this.closeMobileMenu();
   }
   
// Refresh intersection observers
   this.refreshObservers();
  },
  
// Handle page load
  handlePageLoad() {
// Remove loading states
   document.body.classList.remove('loading');
   
// Trigger initial animations
   this.triggerInitialAnimations();
   
// Initialize lazy loading
   this.initLazyLoading();
  },
  
// Toggle mobile navigation menu
  toggleMobileMenu() {
   if (this.isMenuOpen) {
    this.closeMobileMenu();
   } else {
    this.openMobileMenu();
   }
  },
  
// Open mobile menu
  openMobileMenu() {
   if (!this.navMenu) return;
   
   this.navMenu.classList.add('active');
   this.navToggle.classList.add('active');
   this.navToggle.setAttribute('aria-expanded', 'true');
   document.body.style.overflow = 'hidden';
   this.isMenuOpen = true;
   
// Animate menu items
   const menuItems = this.navMenu.querySelectorAll('.nav-link');
   menuItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('animate-fade-up');
   });
  },
  
// Close mobile menu
  closeMobileMenu() {
   if (!this.navMenu) return;
   
   this.navMenu.classList.remove('active');
   this.navToggle.classList.remove('active');
   this.navToggle.setAttribute('aria-expanded', 'false');
   document.body.style.overflow = '';
   this.isMenuOpen = false;
   
// Remove animation classes
   const menuItems = this.navMenu.querySelectorAll('.nav-link');
   menuItems.forEach(item => {
    item.classList.remove('animate-fade-up');
    item.style.animationDelay = '';
   });
  },
  
// Handle clicks outside mobile menu
  handleOutsideClick(event) {
   if (this.isMenuOpen && 
       !this.navMenu.contains(event.target) && 
       !this.navToggle.contains(event.target)) {
    this.closeMobileMenu();
   }
  },
  
// Handle keyboard navigation
  handleKeyboard(event) {
// Close mobile menu with Escape key
   if (event.key === 'Escape' && this.isMenuOpen) {
    this.closeMobileMenu();
   }
   
// Handle tab navigation in mobile menu
   if (this.isMenuOpen && event.key === 'Tab') {
    this.handleTabNavigation(event);
   }
  },
  
// Handle tab navigation in mobile menu
  handleTabNavigation(event) {
   const focusableElements = this.navMenu.querySelectorAll(
    'a[href], button, [tabindex]:not([tabindex="-1"])'
   );
   const firstElement = focusableElements[0];
   const lastElement = focusableElements[focusableElements.length - 1];
   
   if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
   } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
   }
  },
  
// Initialize navigation
  initNavigation() {
// Set initial ARIA attributes
   if (this.navToggle) {
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navToggle.setAttribute('aria-controls', 'nav-menu');
   }
   
// Add click handlers to navigation links
   const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
   navLinks.forEach(link => {
    link.addEventListener('click', this.handleNavLinkClick.bind(this));
   });
  },
  
// Handle navigation link clicks
  handleNavLinkClick(event) {
   const href = event.target.getAttribute('href');
   
// Only handle hash links
   if (href && href.startsWith('#')) {
    event.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
     this.scrollToElement(targetElement);
     
// Close mobile menu if open
     if (this.isMenuOpen) {
      this.closeMobileMenu();
     }
     
// Update active link
     this.setActiveNavLink(event.target);
    }
   }
  },
  
// Smooth scroll to element
  scrollToElement(element) {
   const navHeight = this.nav ? this.nav.offsetHeight : 0;
   const targetPosition = element.offsetTop - navHeight - 20;
   
   window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
   });
  },
  
// Update active navigation link based on scroll position
  updateActiveNavLink() {
   const sections = document.querySelectorAll('section[id]');
   const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
   
   let currentSection = '';
   const navHeight = this.nav ? this.nav.offsetHeight : 0;
   
   sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && 
        window.scrollY < sectionTop + sectionHeight) {
     currentSection = section.getAttribute('id');
    }
   });
   
   navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
     link.classList.add('active');
    }
   });
  },
  
// Set active navigation link
  setActiveNavLink(activeLink) {
   const navLinks = document.querySelectorAll('.nav-link');
   navLinks.forEach(link => link.classList.remove('active'));
   activeLink.classList.add('active');
  },
  
// Initialize smooth scrolling for all hash links
  initSmoothScroll() {
   const hashLinks = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
   hashLinks.forEach(link => {
    link.addEventListener('click', (event) => {
     const href = link.getAttribute('href');
     if (href && href !== '#') {
      event.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
       this.scrollToElement(targetElement);
      }
     }
    });
   });
  },
  
// Initialize scroll animations
  initScrollAnimations() {
// Create intersection observer for scroll animations
   const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
   };
   
   const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
       entry.target.classList.add('animated');
      }, delay);
      scrollObserver.unobserve(entry.target);
     }
    });
   }, observerOptions);
   
// Observe elements with scroll animation classes
   const animatedElements = document.querySelectorAll('.animate-on-scroll');
   animatedElements.forEach(element => {
    scrollObserver.observe(element);
   });
   
   this.observers.set('scroll', scrollObserver);
  },
  
// Trigger initial animations
  triggerInitialAnimations() {
// Animate hero elements
   const heroElements = document.querySelectorAll('.hero .animate-fade-up');
   heroElements.forEach((element, index) => {
    setTimeout(() => {
     element.classList.add('animated');
    }, index * 200);
   });
   
// Animate navigation
   if (this.nav) {
    this.nav.classList.add('animate-fade-down');
   }
  },
  
// Initialize lazy loading for images
  initLazyLoading() {
   if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
      if (entry.isIntersecting) {
       const img = entry.target;
       img.src = img.dataset.src;
       img.classList.remove('lazy');
       lazyImageObserver.unobserve(img);
      }
     });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
     lazyImageObserver.observe(img);
    });
    
    this.observers.set('lazyLoad', lazyImageObserver);
   }
  },
  
// Initialize performance optimizations
  initPerformanceOptimizations() {
// Preload critical resources
   this.preloadCriticalResources();
   
// Initialize service worker if available
   this.initServiceWorker();
   
// Optimize images
   this.optimizeImages();
  },
  
// Preload critical resources
  preloadCriticalResources() {
   const criticalResources = [
    { href: 'assets/css/main.css', as: 'style' },
    { href: 'assets/js/components.js', as: 'script' },
    { href: 'assets/img/logo.jpg', as: 'image' }
   ];
   
   criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
   });
  },
  
// Initialize service worker
  initServiceWorker() {
   if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
     navigator.serviceWorker.register('/assets/js/sw.js')
      .then(registration => {
       console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
      });
    });
   }
  },
  
// Optimize images
  optimizeImages() {
   const images = document.querySelectorAll('img');
   images.forEach(img => {
// Add loading="lazy" for modern browsers
    if ('loading' in HTMLImageElement.prototype) {
     img.loading = 'lazy';
    }
    
// Add error handling
    img.addEventListener('error', () => {
     img.src = 'assets/img/placeholder.jpg';
    });
   });
  },
  
// Refresh intersection observers
  refreshObservers() {
   this.observers.forEach(observer => {
    observer.disconnect();
   });
   this.initScrollAnimations();
   this.initLazyLoading();
  },
  
// Utility: Throttle function
  throttle(func, limit) {
   let inThrottle;
   return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
     func.apply(context, args);
     inThrottle = true;
     setTimeout(() => inThrottle = false, limit);
    }
   };
  },
  
// Utility: Debounce function
  debounce(func, wait, immediate) {
   let timeout;
   return function() {
    const context = this;
    const args = arguments;
    const later = function() {
     timeout = null;
     if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
   };
  },
  
// Utility: Check if element is in viewport
  isInViewport(element) {
   const rect = element.getBoundingClientRect();
   return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
   );
  },
  
// Utility: Get scroll percentage
  getScrollPercentage() {
   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
   const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
   return (scrollTop / scrollHeight) * 100;
  },
  
// Analytics tracking
  trackEvent(category, action, label) {
   if (typeof gtag !== 'undefined') {
    gtag('event', action, {
     event_category: category,
     event_label: label
    });
   }
  },
  
// Error handling
  handleError(error, context) {
   console.error(`Error in ${context}:`, error);
   
// Track error in analytics
   this.trackEvent('JavaScript Error', error.message, context);
   
// Show user-friendly message if needed
   if (context === 'critical') {
    this.showErrorMessage('Something went wrong. Please refresh the page.');
   }
  },
  
// Show error message to user
  showErrorMessage(message) {
   const errorDiv = document.createElement('div');
   errorDiv.className = 'alert alert-error';
   errorDiv.textContent = message;
   errorDiv.style.position = 'fixed';
   errorDiv.style.top = '20px';
   errorDiv.style.right = '20px';
   errorDiv.style.zIndex = '9999';
   
   document.body.appendChild(errorDiv);
   
   setTimeout(() => {
    errorDiv.remove();
   }, 5000);
  }
 };

// Initialize when DOM is ready
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
   try {
    dbroft.init();
   } catch (error) {
    dbroft.handleError(error, 'initialization');
   }
  });
 } else {
  try {
   dbroft.init();
  } catch (error) {
   dbroft.handleError(error, 'initialization');
  }
 }

// Global error handling
 window.addEventListener('error', (event) => {
  dbroft.handleError(event.error, 'global');
 });

 window.addEventListener('unhandledrejection', (event) => {
  dbroft.handleError(event.reason, 'promise');
 });

// Export for use in other modules
 if (typeof module !== 'undefined' && module.exports) {
  module.exports = dbroft;
 }
