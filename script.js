// Uma única cor no documento: todas as seções são transparentes.
const root = document.documentElement;
const second = document.querySelector('.second');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sand = [206, 197, 148];
const olive = [116, 112, 82];
let framePending = false;
function paintBackground() {
  const height = window.innerHeight;
  const top = second.getBoundingClientRect().top;
  let progress = Math.max(0, Math.min(1, (height * .85 - top) / (height * .7)));
  if (reducedMotion.matches) progress = top < height * .5 ? 1 : 0;
  // Smoothstep deixa o começo e o fim da transição suaves.
  const eased = progress * progress * (3 - 2 * progress);
  const rgb = sand.map((value, index) => Math.round(value + (olive[index] - value) * eased));
  const casesSection = document.querySelector('.cases-section');
  if (casesSection) {
    let caseProgress = Math.max(0, Math.min(1, (height * .85 - casesSection.getBoundingClientRect().top) / (height * .7)));
    if (reducedMotion.matches) caseProgress = caseProgress > .5 ? 1 : 0;
    const caseEase = caseProgress * caseProgress * (3 - 2 * caseProgress);
    const cream = [233, 229, 198];
    rgb.forEach((value, index) => rgb[index] = Math.round(value + (cream[index] - value) * caseEase));
  }
  for (const [selector, color] of [['.history-section', olive], ['.contact-section', [233, 229, 198]], ['.brandverso-section', [26, 22, 3]], ['.site-footer', olive]]) {
    const section = document.querySelector(selector);
    if (!section) continue;
    let amount = Math.max(0, Math.min(1, (height * .85 - section.getBoundingClientRect().top) / (height * .7)));
    if (reducedMotion.matches) amount = amount > .5 ? 1 : 0;
    amount = amount * amount * (3 - 2 * amount);
    rgb.forEach((value, index) => rgb[index] = Math.round(value + (color[index] - value) * amount));
  }
  root.style.backgroundColor = `rgb(${rgb.join(',')})`;
  updateCardCascade();
  framePending = false;
}
function schedulePaint() {
  if (!framePending) { framePending = true; requestAnimationFrame(paintBackground); }
}
document.querySelectorAll('.reveal').forEach(block => {
  block.querySelectorAll('.line > span').forEach((line, index) => line.style.setProperty('--delay', `${index * 120}ms`));
  block.querySelectorAll('.dot').forEach((dot, index) => dot.style.setProperty('--delay', `${index * 240 + 180}ms`));
});
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(block => observer.observe(block));
window.addEventListener('scroll', schedulePaint, { passive: true });
window.addEventListener('resize', schedulePaint);
reducedMotion.addEventListener('change', schedulePaint);
paintBackground();

const navigation = document.querySelector('.navigation');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuToggle.focus();
  }
});

document.querySelectorAll('.method-card').forEach((card, index) => {
  card.style.setProperty('--card-delay', `${index * 130}ms`);
  observer.observe(card);
});
const methodDialog = document.querySelector('.method-dialog');
document.querySelectorAll('button.method-more').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.method-card');
    methodDialog.querySelector('h2').textContent = card.querySelector('h3').textContent;
    methodDialog.querySelector('p').textContent = card.querySelector('p').textContent;
    methodDialog.showModal();
  });
});
methodDialog.querySelector('.dialog-close').addEventListener('click', () => methodDialog.close());

document.querySelectorAll('.cases-intro .reveal').forEach(block => observer.observe(block));
function updateCardCascade() {
  const cards = [...document.querySelectorAll('.case-card')];
  cards.forEach((card, index) => {
    if (reducedMotion.matches || !cards[index + 1]) { card.style.transform = ''; return; }
    const next = cards[index + 1].getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(card).top);
    const progress = Math.max(0, Math.min(1, (window.innerHeight * .8 - next.top) / (window.innerHeight * .8 - stickyTop)));
    card.style.transform = `scale(${1 - progress * .055})`;
  });
}

document.querySelectorAll('.history-section .reveal, .contact-section .reveal').forEach(block => observer.observe(block));
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target.countFrame) cancelAnimationFrame(entry.target.countFrame);
    const target = Number(entry.target.dataset.count);
    if (reducedMotion.matches) { entry.target.textContent = `+${target}`; return; }
    entry.target.textContent = '+0';
    if (!entry.isIntersecting) return;
    const start = performance.now();
    function tick(now) {
      const progress = Math.max(0, Math.min(1, (now - start) / 2200));
      entry.target.textContent = `+${Math.floor(target * (1 - Math.pow(1 - progress, 2)))}`;
      if (progress < 1) entry.target.countFrame = requestAnimationFrame(tick);
      else entry.target.countFrame = null;
    }
    entry.target.countFrame = requestAnimationFrame(tick);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(number => {
  number.setAttribute('aria-label', `Mais de ${number.dataset.count}`);
  if (!reducedMotion.matches) number.textContent = '+0';
  countObserver.observe(number);
});
document.querySelector('button.history-more')?.addEventListener('click', () => {
  methodDialog.querySelector('h2').textContent = 'Nossa história';
  methodDialog.querySelector('p').textContent = document.querySelector('.history-copy p').textContent;
  methodDialog.showModal();
});
document.querySelector('.contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('.form-status');
  status.hidden = false;
  status.textContent = 'Campos validados. Esta é uma prévia: nenhum dado foi enviado.';
});

document.querySelectorAll('.brandverso-intro .reveal').forEach(block => observer.observe(block));
document.querySelectorAll('.news-card').forEach((card, index) => {
  card.style.setProperty('--news-delay', `${(index % 3) * 120}ms`);
  observer.observe(card);
});


