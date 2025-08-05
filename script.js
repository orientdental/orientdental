document.addEventListener('DOMContentLoaded', () => {
  // === Mobile Nav Toggle ===
  const hamburger = document.querySelector('.hamburger');
  const closeMenu = document.querySelector('.close-menu');
  const navLinks = document.getElementById('navLinks');

  function toggleMobileNav() {
    navLinks.classList.toggle('active');
  }

  hamburger?.addEventListener('click', toggleMobileNav);
  closeMenu?.addEventListener('click', toggleMobileNav);

  document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    if (!isClickInsideNav && !isClickOnHamburger) {
      navLinks.classList.remove('active');
    }
  });

  // === Search Highlight ===
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', function () {
    removeHighlights();
    const searchTerm = this.value.trim();
    if (!searchTerm) return;
    highlightText(document.body, searchTerm);
  });

  function highlightText(element, term) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => {
        if (
          node.nodeValue.trim().length &&
          !['SCRIPT', 'STYLE', 'MARK'].includes(node.parentNode.nodeName)
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });

    const nodesToUpdate = [];
    let node;
    while ((node = walker.nextNode())) {
      if (regex.test(node.nodeValue)) nodesToUpdate.push(node);
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

  // === Scroll to Top Button ===
  const scrollBtn = document.getElementById('scrollToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) scrollBtn.classList.add('show');
    else scrollBtn.classList.remove('show');
  });
  scrollBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Reviews Carousel ===
  const reviewTrack = document.querySelector('.reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewPrev = document.querySelector('.reviews-arrow.left');
  const reviewNext = document.querySelector('.reviews-arrow.right');

  let reviewIndex = 0;

  function getVisibleReviewCards() {
    const width = window.innerWidth;
    return width >= 900 ? 3 : width >= 600 ? 2 : 1;
  }

  function getReviewCardWidth() {
    return reviewCards[0].offsetWidth + 20;
  }

  function updateReviewCarousel() {
    const cardWidth = getReviewCardWidth();
    reviewTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  }

  function nextReviewSlide() {
    const visible = getVisibleReviewCards();
    reviewIndex++;
    if (reviewIndex > reviewCards.length - visible) {
      reviewIndex = 0;
    }
    updateReviewCarousel();
  }

  function prevReviewSlide() {
    const visible = getVisibleReviewCards();
    reviewIndex--;
    if (reviewIndex < 0) {
      reviewIndex = reviewCards.length - visible;
    }
    updateReviewCarousel();
  }

  reviewNext?.addEventListener('click', nextReviewSlide);
  reviewPrev?.addEventListener('click', prevReviewSlide);

  setInterval(nextReviewSlide, 3000);

  window.addEventListener('resize', () => {
    updateReviewCarousel();
  });

  // === Team Carousel ===
  const teamTrack = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const teamMembers = document.querySelectorAll('.team-member');

  if (teamTrack && prevBtn && nextBtn && teamMembers.length > 0) {
    let position = 0;

    function getTeamCardWidth() {
      return teamMembers[0].offsetWidth + 20;
    }

    function getVisibleTeamCards() {
      const wrapperWidth = document.querySelector('.carousel-track-wrapper').offsetWidth;
      return Math.floor(wrapperWidth / getTeamCardWidth());
    }

    function getMaxTeamPosition() {
      const totalCards = teamMembers.length;
      const visible = getVisibleTeamCards();
      const hiddenCards = totalCards - visible;
      return hiddenCards > 0 ? hiddenCards * getTeamCardWidth() : 0;
    }

    function updateTeamCarousel() {
      teamTrack.style.transform = `translateX(-${position}px)`;
    }

    nextBtn.addEventListener('click', () => {
      const maxPosition = getMaxTeamPosition();
      const cardWidth = getTeamCardWidth();
      position = (position + cardWidth > maxPosition) ? 0 : position + cardWidth;
      updateTeamCarousel();
    });

    prevBtn.addEventListener('click', () => {
      const maxPosition = getMaxTeamPosition();
      const cardWidth = getTeamCardWidth();
      position = (position - cardWidth < 0) ? maxPosition : position - cardWidth;
      updateTeamCarousel();
    });

    window.addEventListener('resize', () => {
      position = 0;
      updateTeamCarousel();
    });
  }
});
