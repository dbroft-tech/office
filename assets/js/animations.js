// D-Broft Technologies - Animations JavaScript
// Advanced animation controllers and effects with 1-space indentation

 'use strict';

// Animation controller
 const Animations = {
  observers: new Map(),
  animationQueue: [],
  isReducedMotion: false,
  
// Initialize animation system
  init() {
   this.checkReducedMotion();
   this.initScrollAnimations();
   this.initParallaxEffects();
   this.initTextAnimations();
   this.initHoverEffects();
   this.initLoadingAnimations();
   this.initMorphingShapes();
   console.log('Animations initialized');
  },
  
// Check for reduced motion preference
  checkReducedMotion() {
   this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   
   if (this.isReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
   }
  },
  
// Initialize scroll-triggered animations
  initScrollAnimations() {
   if (this.isReducedMotion) return;
   
   const observerOptions = {
    threshold: [0, 0.1, 0.5, 1],
    rootMargin: '0px 0px -100px 0px'
   };
   
   const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     const element = entry.target;
     const animationType = element.dataset.animation || 'fadeUp';
     const delay = parseInt(element.dataset.delay) || 0;
     const duration = parseInt(element.dataset.duration) || 800;
     
     if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
      setTimeout(() => {
       this.triggerAnimation(element, animationType, duration);
      }, delay);
      
      scrollObserver.unobserve(element);
     }
    });
   }, observerOptions);
   
// Observe elements with animation attributes
   const animatedElements = document.querySelectorAll('[data-animation]');
   animatedElements.forEach(element => {
    scrollObserver.observe(element);
   });
   
   this.observers.set('scroll', scrollObserver);
  },
  
// Initialize parallax effects
  initParallaxEffects() {
   if (this.isReducedMotion) return;
   
   const parallaxElements = document.querySelectorAll('[data-parallax]');
   
   if (parallaxElements.length === 0) return;
   
   const updateParallax = () => {
    const scrollY = window.pageYOffset;
    
    parallaxElements.forEach(element => {
     const speed = parseFloat(element.dataset.parallax) || 0.5;
     const yPos = -(scrollY * speed);
     element.style.transform = `translateY(${yPos}px)`;
    });
   };
   
// Throttled scroll handler
   let ticking = false;
   const handleScroll = () => {
    if (!ticking) {
     requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
     });
     ticking = true;
    }
   };
   
   window.addEventListener('scroll', handleScroll, { passive: true });
  },
  
// Initialize text animations
  initTextAnimations() {
   if (this.isReducedMotion) return;
   
   const textElements = document.querySelectorAll('[data-text-animation]');
   
   textElements.forEach(element => {
    const animationType = element.dataset.textAnimation;
    
    switch (animationType) {
     case 'typewriter':
      this.initTypewriter(element);
      break;
     case 'reveal':
      this.initTextReveal(element);
      break;
     case 'split':
      this.initSplitText(element);
      break;
    }
   });
  },
  
// Typewriter effect
  initTypewriter(element) {
   const text = element.textContent;
   const speed = parseInt(element.dataset.speed) || 50;
   
   element.textContent = '';
   element.style.borderRight = '2px solid var(--primary)';
   
   let i = 0;
   const typeWriter = () => {
    if (i < text.length) {
     element.textContent += text.charAt(i);
     i++;
     setTimeout(typeWriter, speed);
    } else {
// Blinking cursor effect
     setInterval(() => {
      element.style.borderRight = element.style.borderRight === 'none' 
       ? '2px solid var(--primary)' 
       : 'none';
     }, 500);
    }
   };
   
// Start when element is in view
   const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      typeWriter();
      observer.unobserve(element);
     }
    });
   });
   
   observer.observe(element);
  },
  
// Text reveal animation
  initTextReveal(element) {
   const text = element.textContent;
   element.innerHTML = '';
   
// Wrap each character in a span
   text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.opacity = '0';
    span.style.transform = 'translateY(50px)';
    span.style.transition = `all 0.6s ease ${index * 0.05}s`;
    element.appendChild(span);
   });
   
// Trigger animation when in view
   const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      const spans = element.querySelectorAll('span');
      spans.forEach(span => {
       span.style.opacity = '1';
       span.style.transform = 'translateY(0)';
      });
      observer.unobserve(element);
     }
    });
   });
   
   observer.observe(element);
  },
  
// Split text animation
  initSplitText(element) {
   const text = element.textContent;
   const words = text.split(' ');
   
   element.innerHTML = '';
   
   words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    
    word.split('').forEach((char, charIndex) => {
     const charSpan = document.createElement('span');
     charSpan.textContent = char;
     charSpan.style.display = 'inline-block';
     charSpan.style.transform = 'translateY(100%)';
     charSpan.style.transition = `transform 0.6s ease ${(wordIndex * 0.1) + (charIndex * 0.05)}s`;
     wordSpan.appendChild(charSpan);
    });
    
    element.appendChild(wordSpan);
    
    if (wordIndex < words.length - 1) {
     element.appendChild(document.createTextNode(' '));
    }
   });
   
// Trigger animation
   const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      const chars = element.querySelectorAll('span span');
      chars.forEach(char => {
       char.style.transform = 'translateY(0)';
      });
      observer.unobserve(element);
     }
    });
   });
   
   observer.observe(element);
  },
  
// Initialize hover effects
  initHoverEffects() {
   if (this.isReducedMotion) return;
   
// Magnetic effect
   const magneticElements = document.querySelectorAll('[data-magnetic]');
   magneticElements.forEach(element => {
    this.initMagneticEffect(element);
   });
   
// Tilt effect
   const tiltElements = document.querySelectorAll('[data-tilt]');
   tiltElements.forEach(element => {
    this.initTiltEffect(element);
   });
   
// Ripple effect
   const rippleElements = document.querySelectorAll('[data-ripple]');
   rippleElements.forEach(element => {
    this.initRippleEffect(element);
   });
  },
  
// Magnetic hover effect
  initMagneticEffect(element) {
   const strength = parseFloat(element.dataset.magnetic) || 0.3;
   
   element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
   });
   
   element.addEventListener('mouseleave', () => {
    element.style.transform = 'translate(0, 0)';
   });
  },
  
// Tilt effect
  initTiltEffect(element) {
   const maxTilt = parseFloat(element.dataset.tilt) || 15;
   
   element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    const rotateX = deltaY * maxTilt;
    const rotateY = deltaX * maxTilt;
    
    element.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
   });
   
   element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
   });
  },
  
// Ripple effect
  initRippleEffect(element) {
   element.addEventListener('click', (e) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
     position: absolute;
     width: ${size}px;
     height: ${size}px;
     left: ${x}px;
     top: ${y}px;
     background: rgba(255, 255, 255, 0.3);
     border-radius: 50%;
     transform: scale(0);
     animation: ripple 0.6s ease-out;
     pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
     ripple.remove();
    }, 600);
   });
  },
  
// Initialize loading animations
  initLoadingAnimations() {
// Page load animation
   window.addEventListener('load', () => {
    this.triggerPageLoadAnimation();
   });
   
// Image load animations
   const images = document.querySelectorAll('img[data-load-animation]');
   images.forEach(img => {
    if (img.complete) {
     this.triggerImageLoadAnimation(img);
    } else {
     img.addEventListener('load', () => {
      this.triggerImageLoadAnimation(img);
     });
    }
   });
  },
  
// Page load animation
  triggerPageLoadAnimation() {
   const loader = document.querySelector('.page-loader');
   if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
     loader.remove();
    }, 300);
   }
   
// Animate hero elements
   const heroElements = document.querySelectorAll('.hero [data-load-animation]');
   heroElements.forEach((element, index) => {
    setTimeout(() => {
     element.classList.add('loaded');
    }, index * 200);
   });
  },
  
// Image load animation
  triggerImageLoadAnimation(img) {
   const animation = img.dataset.loadAnimation || 'fadeIn';
   img.classList.add(`animate-${animation}`);
  },
  
// Initialize morphing shapes
  initMorphingShapes() {
   if (this.isReducedMotion) return;
   
   const morphingElements = document.querySelectorAll('[data-morph]');
   
   morphingElements.forEach(element => {
    const paths = element.dataset.morph.split('|');
    if (paths.length < 2) return;
    
    let currentPath = 0;
    
    const morphShape = () => {
     currentPath = (currentPath + 1) % paths.length;
     element.style.clipPath = paths[currentPath];
    };
    
    const interval = parseInt(element.dataset.morphInterval) || 3000;
    setInterval(morphShape, interval);
   });
  },
  
// Trigger specific animation
  triggerAnimation(element, type, duration = 800) {
   if (this.isReducedMotion) {
    element.style.opacity = '1';
    element.style.transform = 'none';
    return;
   }
   
   element.style.animationDuration = duration + 'ms';
   element.classList.add(`animate-${type}`);
   
// Clean up after animation
   setTimeout(() => {
    element.classList.remove(`animate-${type}`);
    element.style.opacity = '1';
    element.style.transform = 'none';
   }, duration);
  },
  
// Create staggered animation
  staggerAnimation(elements, animation, staggerDelay = 100) {
   elements.forEach((element, index) => {
    setTimeout(() => {
     this.triggerAnimation(element, animation);
    }, index * staggerDelay);
   });
  },
  
// Create timeline animation
  createTimeline(animations) {
   let totalDelay = 0;
   
   animations.forEach(({ element, animation, duration = 800, delay = 0 }) => {
    setTimeout(() => {
     this.triggerAnimation(element, animation, duration);
    }, totalDelay + delay);
    
    totalDelay += delay + duration;
   });
   
   return totalDelay;
  },
  
// Animate number counting
  animateNumber(element, start, end, duration = 2000) {
   const startTime = performance.now();
   const startValue = start;
   const endValue = end;
   
   const updateNumber = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
// Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = startValue + (endValue - startValue) * easeOut;
    
    element.textContent = Math.floor(currentValue);
    
    if (progress < 1) {
     requestAnimationFrame(updateNumber);
    } else {
     element.textContent = endValue;
    }
   };
   
   requestAnimationFrame(updateNumber);
  },
  
// Create particle system
  createParticles(container, count = 50) {
   if (this.isReducedMotion) return;
   
   const particles = [];
   
   for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
     position: absolute;
     width: 4px;
     height: 4px;
     background: var(--primary);
     border-radius: 50%;
     pointer-events: none;
     opacity: 0;
    `;
    
    container.appendChild(particle);
    particles.push({
     element: particle,
     x: Math.random() * container.offsetWidth,
     y: Math.random() * container.offsetHeight,
     vx: (Math.random() - 0.5) * 2,
     vy: (Math.random() - 0.5) * 2,
     life: Math.random() * 100
    });
   }
   
   const animateParticles = () => {
    particles.forEach(particle => {
     particle.x += particle.vx;
     particle.y += particle.vy;
     particle.life--;
     
     if (particle.life <= 0) {
      particle.x = Math.random() * container.offsetWidth;
      particle.y = Math.random() * container.offsetHeight;
      particle.life = 100;
     }
     
     particle.element.style.left = particle.x + 'px';
     particle.element.style.top = particle.y + 'px';
     particle.element.style.opacity = particle.life / 100;
    });
    
    requestAnimationFrame(animateParticles);
   };
   
   animateParticles();
  },
  
// Cleanup animations
  cleanup() {
   this.observers.forEach(observer => {
    observer.disconnect();
   });
   this.observers.clear();
   this.animationQueue = [];
  }
 };

// CSS for ripple animation
 const rippleCSS = `
 @keyframes ripple {
  to {
   transform: scale(2);
   opacity: 0;
  }
 }
 `;

// Inject ripple CSS
 const style = document.createElement('style');
 style.textContent = rippleCSS;
 document.head.appendChild(style);

// Initialize animations when DOM is ready
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
   Animations.init();
  });
 } else {
  Animations.init();
 }

// Cleanup on page unload
 window.addEventListener('beforeunload', () => {
  Animations.cleanup();
 });

// Export for use in other modules
 if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
 }
