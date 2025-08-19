// ===== ICON UTILITY SYSTEM =====

// Icon mapping for common icons used in the app
const ICONS = {
  // Navigation
  dashboard: 'mdi:view-dashboard',
  admin: 'mdi:account-cog',
  blog: 'mdi:post',
  category: 'mdi:tag',
  user: 'mdi:account',

  // Actions
  add: 'mdi:plus',
  edit: 'mdi:pencil',
  delete: 'mdi:delete',
  view: 'mdi:eye',
  search: 'mdi:magnify',
  filter: 'mdi:filter',
  sort: 'mdi:sort',

  // Status
  success: 'mdi:check-circle',
  warning: 'mdi:alert-circle',
  error: 'mdi:close-circle',
  info: 'mdi:information',

  // UI Elements
  menu: 'mdi:menu',
  close: 'mdi:close',
  arrowRight: 'mdi:chevron-right',
  arrowLeft: 'mdi:chevron-left',
  arrowUp: 'mdi:chevron-up',
  arrowDown: 'mdi:chevron-down',

  // Content
  image: 'mdi:image',
  file: 'mdi:file',
  link: 'mdi:link',
  calendar: 'mdi:calendar',
  clock: 'mdi:clock',

  // User Interface
  settings: 'mdi:cog',
  profile: 'mdi:account-circle',
  logout: 'mdi:logout',
  login: 'mdi:login',
  register: 'mdi:account-plus',

  // Social
  share: 'mdi:share',
  like: 'mdi:heart',
  comment: 'mdi:comment',
  bookmark: 'mdi:bookmark',

  // Communication
  email: 'mdi:email',
  phone: 'mdi:phone',
  message: 'mdi:message',
  notification: 'mdi:bell',

  // Data
  chart: 'mdi:chart-line',
  table: 'mdi:table',
  list: 'mdi:format-list-bulleted',
  grid: 'mdi:view-grid',

  // System
  home: 'mdi:home',
  help: 'mdi:help-circle',
  about: 'mdi:information',
  contact: 'mdi:contact-mail'
};

// Function to create an icon element
const createIcon = (iconName, size = 24, color = 'currentColor', className = '') => {
  if (!ICONS[iconName]) {
    console.warn(`Icon "${iconName}" not found`);
    return document.createElement('span');
  }

  const iconElement = document.createElement('iconify-icon');
  iconElement.setAttribute('icon', ICONS[iconName]);
  iconElement.setAttribute('width', size);
  iconElement.setAttribute('height', size);
  iconElement.style.color = color;

  if (className) {
    iconElement.className = className;
  }

  return iconElement;
};

// Function to replace text with icons in existing elements
const replaceWithIcon = (element, iconName, size = 24, color = 'currentColor') => {
  const iconElement = createIcon(iconName, size, color);
  element.innerHTML = '';
  element.appendChild(iconElement);
  return iconElement;
};

// Function to add icon to existing elements
const addIcon = (element, iconName, size = 24, color = 'currentColor', position = 'before') => {
  const iconElement = createIcon(iconName, size, color);

  if (position === 'before') {
    element.insertBefore(iconElement, element.firstChild);
  } else {
    element.appendChild(iconElement);
  }

  return iconElement;
};

// Function to create icon button
const createIconButton = (iconName, onClick, options = {}) => {
  const {
    size = 24,
    color = 'currentColor',
    className = 'icon-btn',
    title = '',
    disabled = false
  } = options;

  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.disabled = disabled;

  if (title) {
    button.title = title;
  }

  const iconElement = createIcon(iconName, size, color);
  button.appendChild(iconElement);

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
};

// Function to create icon link
const createIconLink = (iconName, href, options = {}) => {
  const {
    size = 24,
    color = 'currentColor',
    className = 'icon-link',
    title = '',
    target = '_self'
  } = options;

  const link = document.createElement('a');
  link.href = href;
  link.className = className;
  link.target = target;

  if (title) {
    link.title = title;
  }

  const iconElement = createIcon(iconName, size, color);
  link.appendChild(iconElement);

  return link;
};

// Function to get icon HTML string
const getIconHTML = (iconName, size = 24, color = 'currentColor', className = '') => {
  if (!ICONS[iconName]) {
    console.warn(`Icon "${iconName}" not found`);
    return '';
  }

  return `<iconify-icon icon="${ICONS[iconName]}" width="${size}" height="${size}" style="color: ${color};" class="${className}"></iconify-icon>`;
};

// Function to initialize all icon placeholders
const initIcons = () => {
  // Replace all [data-icon] elements with actual icons
  document.querySelectorAll('[data-icon]').forEach(element => {
    const iconName = element.getAttribute('data-icon');
    const size = element.getAttribute('data-icon-size') || 24;
    const color = element.getAttribute('data-icon-color') || 'currentColor';

    replaceWithIcon(element, iconName, parseInt(size), color);
  });

  // Replace all [data-icon-text] elements with icon + text
  document.querySelectorAll('[data-icon-text]').forEach(element => {
    const iconName = element.getAttribute('data-icon-text');
    const size = element.getAttribute('data-icon-size') || 16;
    const color = element.getAttribute('data-icon-color') || 'currentColor';
    const text = element.textContent;

    element.innerHTML = '';
    const iconElement = createIcon(iconName, parseInt(size), color);
    element.appendChild(iconElement);
    element.appendChild(document.createTextNode(' ' + text));
  });
};

// Export functions for global use
window.IconUtils = {
  createIcon,
  replaceWithIcon,
  addIcon,
  createIconButton,
  createIconLink,
  getIconHTML,
  initIcons,
  ICONS
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIcons);
} else {
  initIcons();
}
