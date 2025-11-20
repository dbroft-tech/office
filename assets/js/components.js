// D-Broft Technologies - Components JavaScript
// Interactive components and UI functionality with 1-space indentation

 'use strict';

// Component manager
 const Components = {
  instances: new Map(),
  
// Initialize all components
  init() {
   this.initModals();
   this.initDropdowns();
   this.initTabs();
   this.initAccordions();
   this.initTooltips();
   this.initCarousels();
   this.initForms();
   this.initCounters();
   console.log('Components initialized');
  },
  
// Modal Component
  initModals() {
   const modalTriggers = document.querySelectorAll('[data-modal]');
   const modals = document.querySelectorAll('.modal-overlay');
   
   modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
     e.preventDefault();
     const modalId = trigger.dataset.modal;
     this.openModal(modalId);
    });
   });
   
   modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
     closeBtn.addEventListener('click', () => {
      this.closeModal(modal.id);
     });
    }
    
    modal.addEventListener('click', (e) => {
     if (e.target === modal) {
      this.closeModal(modal.id);
     }
    });
   });
   
// Close modal with Escape key
   document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
     const activeModal = document.querySelector('.modal-overlay.active');
     if (activeModal) {
      this.closeModal(activeModal.id);
     }
    }
   });
  },
  
  openModal(modalId) {
   const modal = document.getElementById(modalId);
   if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
// Focus first focusable element
    const focusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElement) {
     focusableElement.focus();
    }
    
// Track event
    if (typeof dbroft !== 'undefined') {
     dbroft.trackEvent('Modal', 'Open', modalId);
    }
   }
  },
  
  closeModal(modalId) {
   const modal = document.getElementById(modalId);
   if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
// Track event
    if (typeof dbroft !== 'undefined') {
     dbroft.trackEvent('Modal', 'Close', modalId);
    }
   }
  },
  
// Dropdown Component
  initDropdowns() {
   const dropdowns = document.querySelectorAll('.dropdown');
   
   dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (trigger && menu) {
     trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleDropdown(dropdown);
     });
    }
   });
   
// Close dropdowns when clicking outside
   document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
     dropdown.classList.remove('active');
    });
   });
  },
  
  toggleDropdown(dropdown) {
   const isActive = dropdown.classList.contains('active');
   
// Close all other dropdowns
   document.querySelectorAll('.dropdown.active').forEach(d => {
    d.classList.remove('active');
   });
   
// Toggle current dropdown
   if (!isActive) {
    dropdown.classList.add('active');
   }
  },
  
// Tabs Component
  initTabs() {
   const tabContainers = document.querySelectorAll('.tabs');
   
   tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-button');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabButtons.forEach((button, index) => {
     button.addEventListener('click', () => {
      this.switchTab(container, index);
     });
    });
   });
  },
  
  switchTab(container, activeIndex) {
   const tabButtons = container.querySelectorAll('.tab-button');
   const tabContents = container.querySelectorAll('.tab-content');
   
// Remove active classes
   tabButtons.forEach(button => button.classList.remove('active'));
   tabContents.forEach(content => content.classList.remove('active'));
   
// Add active classes
   if (tabButtons[activeIndex]) {
    tabButtons[activeIndex].classList.add('active');
   }
   if (tabContents[activeIndex]) {
    tabContents[activeIndex].classList.add('active');
   }
   
// Track event
   if (typeof dbroft !== 'undefined') {
    dbroft.trackEvent('Tabs', 'Switch', `Tab ${activeIndex + 1}`);
   }
  },
  
// Accordion Component
  initAccordions() {
   const accordions = document.querySelectorAll('.accordion-item');
   
   accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (header && content) {
     header.addEventListener('click', () => {
      this.toggleAccordion(item);
     });
    }
   });
  },
  
  toggleAccordion(item) {
   const isActive = item.classList.contains('active');
   const content = item.querySelector('.accordion-content');
   
   if (isActive) {
    item.classList.remove('active');
    content.style.maxHeight = null;
   } else {
    item.classList.add('active');
    content.style.maxHeight = content.scrollHeight + 'px';
   }
   
// Track event
   if (typeof dbroft !== 'undefined') {
    dbroft.trackEvent('Accordion', isActive ? 'Close' : 'Open', item.dataset.title || 'Item');
   }
  },
  
// Tooltip Component
  initTooltips() {
   const tooltipElements = document.querySelectorAll('[data-tooltip]');
   
   tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
     this.showTooltip(element);
    });
    
    element.addEventListener('mouseleave', () => {
     this.hideTooltip(element);
    });
    
    element.addEventListener('focus', () => {
     this.showTooltip(element);
    });
    
    element.addEventListener('blur', () => {
     this.hideTooltip(element);
    });
   });
  },
  
  showTooltip(element) {
   const tooltip = element.getAttribute('data-tooltip');
   if (!tooltip) return;
   
   const tooltipElement = document.createElement('div');
   tooltipElement.className = 'tooltip-popup';
   tooltipElement.textContent = tooltip;
   tooltipElement.style.position = 'absolute';
   tooltipElement.style.zIndex = '9999';
   tooltipElement.style.background = 'var(--gray-900)';
   tooltipElement.style.color = 'var(--white)';
   tooltipElement.style.padding = 'var(--space-2) var(--space-3)';
   tooltipElement.style.borderRadius = 'var(--radius)';
   tooltipElement.style.fontSize = 'var(--text-xs)';
   tooltipElement.style.whiteSpace = 'nowrap';
   tooltipElement.style.pointerEvents = 'none';
   
   document.body.appendChild(tooltipElement);
   
// Position tooltip
   const rect = element.getBoundingClientRect();
   const tooltipRect = tooltipElement.getBoundingClientRect();
   
   tooltipElement.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
   tooltipElement.style.top = (rect.top - tooltipRect.height - 8) + 'px';
   
   element._tooltip = tooltipElement;
  },
  
  hideTooltip(element) {
   if (element._tooltip) {
    element._tooltip.remove();
    delete element._tooltip;
   }
  },
  
// Carousel Component
  initCarousels() {
   const carousels = document.querySelectorAll('.carousel');
   
   carousels.forEach(carousel => {
    this.setupCarousel(carousel);
   });
  },
  
  setupCarousel(carousel) {
   const slides = carousel.querySelectorAll('.carousel-slide');
   const prevBtn = carousel.querySelector('.carousel-prev');
   const nextBtn = carousel.querySelector('.carousel-next');
   const indicators = carousel.querySelector('.carousel-indicators');
   
   let currentSlide = 0;
   let isTransitioning = false;
   
// Create indicators if they don't exist
   if (!indicators && slides.length > 1) {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    
    slides.forEach((_, index) => {
     const indicator = document.createElement('button');
     indicator.className = 'carousel-indicator';
     if (index === 0) indicator.classList.add('active');
     indicator.addEventListener('click', () => goToSlide(index));
     indicatorsContainer.appendChild(indicator);
    });
    
    carousel.appendChild(indicatorsContainer);
   }
   
   const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    
    isTransitioning = true;
    
    slides[currentSlide].classList.remove('active');
    slides[index].classList.add('active');
    
// Update indicators
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, i) => {
     indicator.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
    
    setTimeout(() => {
     isTransitioning = false;
    }, 300);
   };
   
   const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
   };
   
   const prevSlide = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
   };
   
// Event listeners
   if (prevBtn) prevBtn.addEventListener('click', prevSlide);
   if (nextBtn) nextBtn.addEventListener('click', nextSlide);
   
// Auto-play
   if (carousel.dataset.autoplay) {
    const interval = parseInt(carousel.dataset.autoplay) || 5000;
    setInterval(nextSlide, interval);
   }
   
// Touch/swipe support
   let startX = 0;
   let endX = 0;
   
   carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
   });
   
   carousel.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
     if (diff > 0) {
      nextSlide();
     } else {
      prevSlide();
     }
    }
   });
  },
  
// Form Component
  initForms() {
   const forms = document.querySelectorAll('form[data-validate]');
   
   forms.forEach(form => {
    this.setupFormValidation(form);
   });
  },
  
  setupFormValidation(form) {
   const inputs = form.querySelectorAll('input, textarea, select');
   
   inputs.forEach(input => {
    input.addEventListener('blur', () => {
     this.validateField(input);
    });
    
    input.addEventListener('input', () => {
     this.clearFieldError(input);
    });
   });
   
   form.addEventListener('submit', (e) => {
    e.preventDefault();
    this.handleFormSubmit(form);
   });
  },
  
  validateField(field) {
   const value = field.value.trim();
   const type = field.type;
   const required = field.hasAttribute('required');
   
   let isValid = true;
   let errorMessage = '';
   
// Required validation
   if (required && !value) {
    isValid = false;
    errorMessage = 'This field is required';
   }
   
// Email validation
   if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
     isValid = false;
     errorMessage = 'Please enter a valid email address';
    }
   }
   
// Phone validation
   if (type === 'tel' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
     isValid = false;
     errorMessage = 'Please enter a valid phone number';
    }
   }
   
// Custom validation
   const customPattern = field.getAttribute('pattern');
   if (customPattern && value) {
    const regex = new RegExp(customPattern);
    if (!regex.test(value)) {
     isValid = false;
     errorMessage = field.getAttribute('data-error') || 'Invalid format';
    }
   }
   
   this.showFieldError(field, isValid ? '' : errorMessage);
   return isValid;
  },
  
  showFieldError(field, message) {
   this.clearFieldError(field);
   
   if (message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = 'var(--text-sm)';
    errorElement.style.marginTop = 'var(--space-1)';
    
    field.parentNode.appendChild(errorElement);
   } else {
    field.classList.remove('error');
   }
  },
  
  clearFieldError(field) {
   field.classList.remove('error');
   const errorElement = field.parentNode.querySelector('.field-error');
   if (errorElement) {
    errorElement.remove();
   }
  },
  
  handleFormSubmit(form) {
   const inputs = form.querySelectorAll('input, textarea, select');
   let isFormValid = true;
   
   inputs.forEach(input => {
    if (!this.validateField(input)) {
     isFormValid = false;
    }
   });
   
   if (isFormValid) {
    this.submitForm(form);
   } else {
// Focus first invalid field
    const firstError = form.querySelector('.error');
    if (firstError) {
     firstError.focus();
    }
   }
  },
  
  submitForm(form) {
   const submitBtn = form.querySelector('[type="submit"]');
   const originalText = submitBtn.textContent;
   
// Show loading state
   submitBtn.disabled = true;
   submitBtn.innerHTML = '<span class="loading"></span> Sending...';
   
// Create FormData from form
   const formData = new FormData(form);
   
// Submit to Formspree
   fetch('https://formspree.io/f/xpwwojqa', {
    method: 'POST',
    body: formData,
    headers: {
     'Accept': 'application/json'
    }
   })
   .then(response => {
    if (response.ok) {
     submitBtn.disabled = false;
     submitBtn.textContent = originalText;
     this.showFormMessage(form, 'Thank you! Your message has been sent. We will contact you shortly.', 'success');
     form.reset();
     
// Track event
     if (typeof dbroft !== 'undefined') {
      dbroft.trackEvent('Form', 'Submit', form.id || 'Contact Form');
     }
    } else {
     throw new Error('Form submission failed');
    }
   })
   .catch(error => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    this.showFormMessage(form, 'Error sending message. Please try again or contact us directly.', 'error');
    console.error('Form submission error:', error);
   });
  },
  
  showFormMessage(form, message, type = 'info') {
   const messageElement = document.createElement('div');
   messageElement.className = `alert alert-${type}`;
   messageElement.textContent = message;
   
   form.parentNode.insertBefore(messageElement, form.nextSibling);
   
   setTimeout(() => {
    messageElement.remove();
   }, 5000);
  },
  
// Counter Component
  initCounters() {
   const counters = document.querySelectorAll('[data-counter]');
   
   const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      this.animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
     }
    });
   });
   
   counters.forEach(counter => {
    counterObserver.observe(counter);
   });
  },
  
  animateCounter(element) {
   const target = parseInt(element.dataset.counter);
   const duration = parseInt(element.dataset.duration) || 2000;
   const increment = target / (duration / 16);
   
   let current = 0;
   
   const updateCounter = () => {
    current += increment;
    
    if (current < target) {
     element.textContent = Math.floor(current);
     requestAnimationFrame(updateCounter);
    } else {
     element.textContent = target;
    }
   };
   
   updateCounter();
  },
  
// Utility: Create element with classes and attributes
  createElement(tag, classes = [], attributes = {}) {
   const element = document.createElement(tag);
   
   if (classes.length) {
    element.className = classes.join(' ');
   }
   
   Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
   });
   
   return element;
  },
  
// Utility: Animate element
  animate(element, animation, duration = 300) {
   return new Promise(resolve => {
    element.style.animationDuration = duration + 'ms';
    element.classList.add(animation);
    
    element.addEventListener('animationend', () => {
     element.classList.remove(animation);
     resolve();
    }, { once: true });
   });
  }
 };

// Initialize components when DOM is ready
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
   Components.init();
  });
 } else {
  Components.init();
 }

// Export for use in other modules
 if (typeof module !== 'undefined' && module.exports) {
  module.exports = Components;
 }
