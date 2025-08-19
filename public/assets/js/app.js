// ===== CUSTOM JAVASCRIPT FRAMEWORK =====

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Smooth scrolling utility
const smoothScroll = (target, duration = 500) => {
  const targetElement = typeof target === 'string' ? $(target) : target;
  if (!targetElement) return;
  
  const targetPosition = targetElement.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

// Toast notification system
class Toast {
  constructor() {
    this.createContainer();
  }

  createContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid var(--${type});
      min-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      animation: slideInRight 0.3s ease forwards;
    `;

    const icon = this.getIcon(type);
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: var(--${type}); font-size: 20px;">${icon}</span>
        <span style="color: #333; font-weight: 500;">${message}</span>
      </div>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);

    return toast;
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
}

// Initialize toast system
const toast = new Toast();

// Modal system
class Modal {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.close();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModal = modal;
    modal.style.display = 'block';
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1040;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
      backdrop.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    }, 10);
  }

  close() {
    if (!this.activeModal) return;

    const modal = this.activeModal;
    const backdrop = document.querySelector('.modal-backdrop');
    
    // Animate out
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    
    if (backdrop) {
      backdrop.style.opacity = '0';
    }
    
    setTimeout(() => {
      modal.style.display = 'none';
      if (backdrop) {
        backdrop.remove();
      }
      document.body.style.overflow = '';
      this.activeModal = null;
    }, 300);
  }
}

// Initialize modal system
const modal = new Modal();

// Dropdown system
class Dropdown {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const dropdownToggle = e.target.closest('[data-dropdown]');
      if (dropdownToggle) {
        const dropdownId = dropdownToggle.getAttribute('data-dropdown');
        const dropdown = document.getElementById(dropdownId);
        
        if (dropdown) {
          this.toggle(dropdown);
        }
      }
      
      // Close other dropdowns
      if (!e.target.closest('.dropdown')) {
        this.closeAll();
      }
    });
  }

  toggle(dropdown) {
    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
      this.close(dropdown);
    } else {
      this.closeAll();
      this.open(dropdown);
    }
  }

  open(dropdown) {
    dropdown.classList.add('open');
    dropdown.style.display = 'block';
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'translateY(0)';
    }, 10);
  }

  close(dropdown) {
    dropdown.classList.remove('open');
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      dropdown.style.display = 'none';
    }, 200);
  }

  closeAll() {
    $$('.dropdown.open').forEach(dropdown => {
      this.close(dropdown);
    });
  }
}

// Initialize dropdown system
const dropdown = new Dropdown();

// Sidebar toggle for mobile
const initSidebarToggle = () => {
  const sidebarToggle = $('[data-sidebar-toggle]');
  const sidebar = $('.app-sidenav');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
};

// Search functionality
const initSearch = () => {
  const searchInputs = $$('[data-search]');
  
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableId = input.getAttribute('data-search');
      const table = document.getElementById(tableId);
      
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            row.style.display = '';
            row.style.animation = 'fadeIn 0.3s ease';
          } else {
            row.style.display = 'none';
          }
        });
      }
    });
  });
};

// Form validation
const initFormValidation = () => {
  const forms = $$('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
      }
    });
  });
};

const validateForm = (form) => {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      this.showFieldError(input, 'This field is required');
      isValid = false;
    } else {
      this.clearFieldError(input);
    }
  });
  
  return isValid;
};

const showFieldError = (field, message) => {
  this.clearFieldError(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.textContent = message;
  
  field.parentNode.appendChild(errorDiv);
  field.classList.add('error');
};

const clearFieldError = (field) => {
  const existingError = field.parentNode.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  field.classList.remove('error');
};

// Lazy loading for images
const initLazyLoading = () => {
  const images = $$('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
};

// Smooth animations on scroll
const initScrollAnimations = () => {
  const elements = $$('[data-animate]');
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.animate;
        element.classList.add(animation);
        animationObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => animationObserver.observe(el));
};

// Theme switcher
const initThemeSwitcher = () => {
  const themeToggle = $('[data-theme-toggle]');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update toggle button
      themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });
    
    // Set initial button state
    themeToggle.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  }
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
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
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initSearch();
  initFormValidation();
  initLazyLoading();
  initScrollAnimations();
  initThemeSwitcher();
  
  // Add fade-in animation to all cards
  $$('.card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
  });
});

// Export for use in other scripts
window.AppUtils = {
  smoothScroll,
  toast,
  modal,
  dropdown,
  debounce,
  throttle
};
