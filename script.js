document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = document.querySelector('.dots');
  const counter = document.querySelector('.counter');

  if (slides.length && dots && counter) {
    let i = 0;
    let timer;
    let isPaused = false;
    const pauseBtn = document.querySelector('.slide-pause');
    const slideLinks = [...document.querySelectorAll('[data-slide-link]')];

    function indexFromHash() {
      const m = location.hash.match(/^#slide-(\d+)$/);
      if (!m) return 0;
      const n = parseInt(m[1], 10);
      return Number.isFinite(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
    }

    function updateNav() {
      slideLinks.forEach(a => a.classList.toggle('active', Number(a.dataset.slideLink) === i + 1));
    }

    function go(n, writeHash = true) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === i));
      [...dots.children].forEach((d, n) => d.classList.toggle('active', n === i));
      counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + slides.length;
      updateNav();
      if (writeHash) history.replaceState(null, '', '#slide-' + (i + 1));
      clearInterval(timer);
      if (!isPaused) timer = setInterval(() => go(i + 1), 6500);
      if (pauseBtn) {
        pauseBtn.textContent = isPaused ? '▶ Play' : '⏸ Pause';
        pauseBtn.setAttribute('aria-pressed', String(isPaused));
        pauseBtn.setAttribute('aria-label', isPaused ? 'Resume automatic slide advance' : 'Pause automatic slide advance');
      }
    }

    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (n + 1));
      b.onclick = () => go(n);
      dots.appendChild(b);
    });

    document.querySelector('.prev')?.addEventListener('click', () => go(i - 1));
    document.querySelector('.next')?.addEventListener('click', () => go(i + 1));
    pauseBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      go(i, false);
    });
    window.addEventListener('hashchange', () => go(indexFromHash(), false));
    go(indexFromHash(), false);
  }

  document.querySelectorAll('[data-star]').forEach(b => b.addEventListener('click', () => {
    const r = +b.dataset.star;
    const rating = document.querySelector('#rating');
    if (rating) rating.value = r;
    document.querySelectorAll('[data-star]').forEach(x => x.classList.toggle('selected', +x.dataset.star <= r));
  }));

  document.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-cat]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const c = b.dataset.cat;
    document.querySelectorAll('.article').forEach(a => a.classList.toggle('hidden', c !== 'all' && a.dataset.cat !== c));
  }));

  document.querySelectorAll('.work-video-card').forEach(card => {
    const video = card.querySelector('.work-video');
    const play = card.querySelector('.video-play-overlay');
    const sound = card.querySelector('.video-sound-button');
    if (!video) return;
    video.muted = true;
    video.autoplay = false;
    if (play) play.addEventListener('click', () => { video.play(); play.hidden = true; });
    video.addEventListener('play', () => { if (play) play.hidden = true; });
    video.addEventListener('pause', () => { if (play) play.hidden = false; });
    if (sound) sound.addEventListener('click', () => {
      video.muted = !video.muted;
      sound.textContent = video.muted ? '🔇' : '🔊';
      sound.setAttribute('aria-pressed', String(!video.muted));
      sound.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Mute video');
    });
  });
});
