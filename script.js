document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile nav
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // SEARCH FUNCTION - highlights and scrolls to first match
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', function () {
    removeHighlights();

    const searchTerm = this.value.trim();
    if (!searchTerm) return;

    highlightText(document.body, searchTerm);
  });

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
      parent.normalize(); // Merge adjacent text nodes
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});
function toggleMobileNav() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}
