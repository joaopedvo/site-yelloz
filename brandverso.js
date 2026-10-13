const newsNav = document.querySelector('.navigation');
const newsToggle = document.querySelector('.menu-toggle');
newsToggle.addEventListener('click', () => {
  const open = newsNav.classList.toggle('open');
  newsToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    newsNav.classList.remove('open');
    newsToggle.setAttribute('aria-expanded', 'false');
    document.querySelector('.solutions-menu').open = false;
  }
});
const newsObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    newsObserver.unobserve(entry.target);
  }
}), {threshold:.15});
document.querySelectorAll('.news-card').forEach((card, index) => {
  card.style.setProperty('--news-delay', `${index % 3 * 120}ms`);
  newsObserver.observe(card);
});
