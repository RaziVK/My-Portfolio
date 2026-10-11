/**
 * Software Engineer Portfolio - Interactive Logic & Animations
 * Features: AOS Scroll Animations, Dynamic Typing, Project Filters, Counter Stats, Modal & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Initialize AOS (Animate On Scroll)
     -------------------------------------------------------------------------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 50
    });
  }

  /* --------------------------------------------------------------------------
     2. Dynamic Typing Headline Effect in Hero
     -------------------------------------------------------------------------- */
  const typedTextEl = document.querySelector('.typed-text');
  const roles = [
    'Full Stack Engineer',
    'Java Developer',
    'Software Engineer',
    'Problem Solver'
  ];

  if (typedTextEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const holdTime = 1800;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeDelay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        typeDelay = holdTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 400;
      }

      setTimeout(typeEffect, typeDelay);
    }

    typeEffect();
  }

  /* --------------------------------------------------------------------------
     3. Navbar Scroll State & Mobile Collapse Behavior
     -------------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSection = '';
    const sections = document.querySelectorAll('section[id], header[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Close mobile offcanvas/menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Animated Number Counters (Intersection Observer)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // ms
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const easeOutQuad = t => t * (2 - t);

            const timer = setInterval(() => {
              frame++;
              const progress = easeOutQuad(frame / totalFrames);
              const currentVal = Math.round(target * progress);

              stat.textContent = currentVal;

              if (frame === totalFrames) {
                stat.textContent = target;
                clearInterval(timer);
              }
            }, frameRate);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.stats-counter-strip') || document.querySelector('.hero-section');
    if (statsContainer) {
      counterObserver.observe(statsContainer);
    }
  }

  /* --------------------------------------------------------------------------
     5. Animated Skill Progress Bars
     -------------------------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  if (skillFills.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-progress') || '85%';
          fill.style.width = targetWidth;
        }
      });
    }, { threshold: 0.2 });

    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  
  

  /* --------------------------------------------------------------------------
     8. Contact Form Validation & Google Form Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactToastEl = document.getElementById('contactToast');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;

      // Show loading spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Message...';

      const userName = document.getElementById('userName')?.value.trim() || '';
      const userEmail = document.getElementById('userEmail')?.value.trim() || '';
      const projectTypeEl = document.getElementById('projectType');
      const projectTypeText = projectTypeEl ? projectTypeEl.options[projectTypeEl.selectedIndex].text : '';
      const rawMessage = document.getElementById('userMessage')?.value.trim() || '';

      // Format message to also include the selected Inquiry/Project Type
      const fullMessage = projectTypeText 
        ? `[Inquiry Type: ${projectTypeText}]\n\n${rawMessage}` 
        : rawMessage;

      const formData = new URLSearchParams();
      formData.append('entry.1949412058', userName);
      formData.append('entry.192090792', userEmail);
      formData.append('entry.681571278', fullMessage);

      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeSTsDEeC16Fsyg54tANfFeP-leWGTV4anD3W8CF_0YMI-mcg/formResponse';

      try {
        await fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });

        // Reset form and validation state
        contactForm.reset();
        contactForm.classList.remove('was-validated');

        // Show toast feedback
        if (contactToastEl && typeof bootstrap !== 'undefined') {
          const toast = new bootstrap.Toast(contactToastEl, { delay: 5000 });
          toast.show();
        }
      } catch (err) {
        console.error('Failed to submit form to Google Forms:', err);
        alert('There was a problem submitting your message. Please try again or reach out directly.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
