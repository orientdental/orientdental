document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const hamburger = document.querySelector('.hamburger');
  const closeMenu = document.querySelector('.close-menu');
  const navLinks = document.getElementById('navLinks');

  function toggleMobileNav() {
    navLinks.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMobileNav);
  if (closeMenu) {
    closeMenu.addEventListener('click', toggleMobileNav);
  }

  document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
      navLinks.classList.remove('active');
    }
  });

  // Search Function
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

  // Scroll to Top Button
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

  // Team Carousel with Loop
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const teamMembers = document.querySelectorAll('.team-member');

  if (track && prevBtn && nextBtn && teamMembers.length > 0) {
    let position = 0;

    function getCardWidth() {
      return teamMembers[0].offsetWidth + 20; // Including margin
    }

    function getVisibleCards() {
      const wrapperWidth = document.querySelector('.carousel-track-wrapper').offsetWidth;
      return Math.floor(wrapperWidth / getCardWidth());
    }

    function getMaxPosition() {
      const totalCards = teamMembers.length;
      const visible = getVisibleCards();
      const hiddenCards = totalCards - visible;
      return hiddenCards > 0 ? hiddenCards * getCardWidth() : 0;
    }

    nextBtn.addEventListener('click', () => {
      const maxPosition = getMaxPosition();
      const cardWidth = getCardWidth();
      if (position + cardWidth <= maxPosition) {
        position += cardWidth;
      } else {
        // Loop to start
        position = 0;
      }
      track.style.transform = `translateX(-${position}px)`;
    });

    prevBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      if (position - cardWidth >= 0) {
        position -= cardWidth;
      } else {
        // Loop to end
        position = getMaxPosition();
      }
      track.style.transform = `translateX(-${position}px)`;
    });

    window.addEventListener('resize', () => {
      position = 0;
      track.style.transform = 'translateX(0)';
    });
  }
});
