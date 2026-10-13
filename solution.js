const solutionNav = document.querySelector('.navigation');
const solutionToggle = document.querySelector('.menu-toggle');
solutionToggle.addEventListener('click', () => {
  const open = solutionNav.classList.toggle('open');
  solutionToggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    solutionNav.classList.remove('open');
    solutionToggle.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll('.reveal .line > span').forEach((line, index) => line.style.setProperty('--delay', `${index * 120}ms`));
const solutionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      solutionObserver.unobserve(entry.target);
    }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(block => solutionObserver.observe(block));
document.querySelectorAll('.ilu-example-card').forEach((card, index) => {
  card.style.setProperty('--example-delay', `${index * 120}ms`);
  solutionObserver.observe(card);
});

let solutionFrame = false;
function updateSolutionBackground() {
  if (document.documentElement.classList.contains('yon-page')) {
    const section = document.querySelector('.yon-examples');
    if (section) {
      const height = window.innerHeight;
      let amount = Math.max(0, Math.min(1, (height * .85 - section.getBoundingClientRect().top) / (height * .7)));
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) amount = amount > .5 ? 1 : 0;
      amount = amount * amount * (3 - 2 * amount);
      const from = [237, 249, 228], to = [213, 233, 191];
      const color = from.map((value, index) => Math.round(value + (to[index] - value) * amount));
      const clients = document.querySelector('.yon-clients');
      if (clients) {
        let returnAmount = Math.max(0, Math.min(1, (height * .85 - clients.getBoundingClientRect().top) / (height * .7)));
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) returnAmount = returnAmount > .5 ? 1 : 0;
        returnAmount = returnAmount * returnAmount * (3 - 2 * returnAmount);
        color.forEach((value, index) => color[index] = Math.round(value + (from[index] - value) * returnAmount));
      }
      for (const [selector, target] of [['.contact-section', [233, 229, 198]], ['.site-footer', [116, 112, 82]]]) {
        const nextSection = document.querySelector(selector);
        if (!nextSection) continue;
        let transition = Math.max(0, Math.min(1, (height * .85 - nextSection.getBoundingClientRect().top) / (height * .7)));
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) transition = transition > .5 ? 1 : 0;
        transition = transition * transition * (3 - 2 * transition);
        color.forEach((value, index) => color[index] = Math.round(value + (target[index] - value) * transition));
      }
      document.documentElement.style.backgroundColor = `rgb(${color.join(',')})`;
    }
    solutionFrame = false;
    return;
  }
  if (document.documentElement.classList.contains('story-page')) { solutionFrame = false; return; }
  if (document.documentElement.classList.contains('clipx-page')) {
    const height = window.innerHeight;
    const color = [236, 225, 199];
    for (const [selector, target] of [['.contact-section', [233, 229, 198]], ['.site-footer', [116, 112, 82]]]) {
      const section = document.querySelector(selector);
      if (!section) continue;
      let amount = Math.max(0, Math.min(1, (height * .85 - section.getBoundingClientRect().top) / (height * .7)));
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) amount = amount > .5 ? 1 : 0;
      amount = amount * amount * (3 - 2 * amount);
      color.forEach((value, index) => color[index] = Math.round(value + (target[index] - value) * amount));
    }
    document.documentElement.style.backgroundColor = `rgb(${color.join(',')})`;
    solutionFrame = false;
    return;
  }
  const section = document.querySelector('.ilu-about');
  if (section) {
    const height = window.innerHeight;
    let progress = Math.max(0, Math.min(1, (height * .85 - section.getBoundingClientRect().top) / (height * .7)));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) progress = progress > .5 ? 1 : 0;
    progress = progress * progress * (3 - 2 * progress);
    const shade = Math.round(217 + (240 - 217) * progress);
    const clients = document.querySelector('.ilu-clients');
    let finalShade = shade;
    if (clients) {
      let amount = Math.max(0, Math.min(1, (height * .85 - clients.getBoundingClientRect().top) / (height * .7)));
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) amount = amount > .5 ? 1 : 0;
      amount = amount * amount * (3 - 2 * amount);
      finalShade = Math.round(shade + (217 - shade) * amount);
    }
    const color = [finalShade, finalShade, finalShade];
    for (const [selector, target] of [['.contact-section', [233, 229, 198]], ['.site-footer', [116, 112, 82]]]) {
      const nextSection = document.querySelector(selector);
      if (!nextSection) continue;
      let amount = Math.max(0, Math.min(1, (height * .85 - nextSection.getBoundingClientRect().top) / (height * .7)));
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) amount = amount > .5 ? 1 : 0;
      amount = amount * amount * (3 - 2 * amount);
      color.forEach((value, index) => color[index] = Math.round(value + (target[index] - value) * amount));
    }
    document.documentElement.style.backgroundColor = `rgb(${color.join(',')})`;
  }
  solutionFrame = false;
}
function scheduleSolutionBackground() {
  if (!solutionFrame) { solutionFrame = true; requestAnimationFrame(updateSolutionBackground); }
}
window.addEventListener('scroll', scheduleSolutionBackground, { passive: true });
window.addEventListener('resize', scheduleSolutionBackground);
updateSolutionBackground();

const iluSlider = document.querySelector('.ilu-slider');
if (iluSlider) {
  const originals = [...iluSlider.querySelectorAll('.ilu-slide')];
  const track = document.createElement('div');
  track.className = 'ilu-infinite-track';
  originals.forEach(slide => track.appendChild(slide));
  originals.forEach(slide => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelector('img').alt = '';
    track.appendChild(copy);
  });
  iluSlider.appendChild(track);
  iluSlider.classList.add('infinite');
  document.querySelector('.ilu-slider-controls')?.remove();
}

document.querySelector('.contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('.form-status');
  status.hidden = false;
  status.textContent = 'Campos validados. Esta é uma prévia: nenhum dado foi enviado.';
});

const storyCounts = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  storyCounts.unobserve(entry.target);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = performance.now(), target = Number(entry.target.dataset.count);
  function tick(now) {
    const amount = Math.min(1, (now - start) / 2200);
    entry.target.textContent = `+${Math.floor(target * (1 - (1 - amount) ** 2))}`;
    if (amount < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}), {threshold:.5});
document.querySelectorAll('[data-count]').forEach(el => storyCounts.observe(el));

const storyTimeline = document.querySelector('.story-timeline');
if (storyTimeline) {
  const milestones = [...storyTimeline.querySelectorAll('li')];
  let timelinePending = false;
  function paintTimeline() {
    const rect = storyTimeline.getBoundingClientRect();
    const cursor = window.innerHeight * .78;
    const first = milestones[0].getBoundingClientRect().top;
    const last = milestones[milestones.length - 1].getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (cursor - first) / Math.max(1, last - first)));
    storyTimeline.style.setProperty('--timeline-progress', String(progress));
    milestones.forEach(item => {
      if (item.getBoundingClientRect().top <= cursor) item.classList.add('timeline-visible');
    });
    timelinePending = false;
  }
  function scheduleTimeline() {
    if (!timelinePending) { timelinePending = true; requestAnimationFrame(paintTimeline); }
  }
  window.addEventListener('scroll', scheduleTimeline, {passive:true});
  window.addEventListener('resize', scheduleTimeline);
  paintTimeline();
}


