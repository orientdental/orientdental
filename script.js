document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const closeMenu = document.querySelector('.close-menu');
  const navLinks = document.getElementById('navLinks');

  // Mobile nav toggle
  function toggleMobileNav() {
    navLinks.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMobileNav);
  if (closeMenu) {
    closeMenu.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav if clicking outside of navLinks and hamburger
  document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
      navLinks.classList.remove('active');
    }
  });

  // SEARCH FUNCTION - highlights and scrolls to first match
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      removeHighlights();

      const searchTerm = this.value.trim();
      if (!searchTerm) return;

      highlightText(document.body, searchTerm);
    });
  }

  function highlightText(element, term) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: node => {
          if (
            node.nodeValue.trim().length &&
            !['SCRIPT', 'STYLE', 'MARK'].includes(node.parentNode.nodeName)
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToUpdate = [];
    let node;
    while ((node = walker.nextNode())) {
      if (regex.test(node.nodeValue)) {
        nodesToUpdate.push(node);
      }
    }

    let scrolled = false;

    nodesToUpdate.forEach((node) => {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
      const wrapper = document.createElement('span');
      wrapper.appendChild(span);
      node.parentNode.replaceChild(wrapper, node);

      if (!scrolled && wrapper.querySelector('mark')) {
        wrapper.querySelector('mark').scrollIntoView({ behavior: 'smooth', block: 'center' });
        scrolled = true;
      }
    });
  }

  function removeHighlights() {
    document.querySelectorAll('mark').forEach(mark => {
      const text = document.createTextNode(mark.textContent);
      const parent = mark.parentNode;
      parent.replaceChild(text, mark);
      parent.normalize();
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
const scrollBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

});
