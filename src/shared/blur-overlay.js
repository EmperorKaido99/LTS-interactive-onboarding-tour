// Blurs all major page sections EXCEPT the one containing the highlighted element.
// This avoids the backdrop-filter issue where everything gets blurred.

const PAGE_SECTIONS = [
  '.lts-site-header',
  '.login-hero',
  '.login-split',
  '.screen-nav',
  '.lts-footer',
  '.lts-internal-header',
  '.lts-firm-bar',
  '.lts-page-header',
  '.lts-layout',
  '.lts-sidebar',
  '.lts-content',
];

export function blurExcept(activeEl) {
  // Remove blur from everything first
  document.querySelectorAll('.tour-section-blur').forEach(el => {
    el.classList.remove('tour-section-blur');
  });

  if (!activeEl) return;

  // Find which top-level sections do NOT contain the active element
  PAGE_SECTIONS.forEach(selector => {
    document.querySelectorAll(selector).forEach(section => {
      if (!section.contains(activeEl)) {
        section.classList.add('tour-section-blur');
      }
    });
  });
}

export function clearBlur() {
  document.querySelectorAll('.tour-section-blur').forEach(el => {
    el.classList.remove('tour-section-blur');
  });
}
