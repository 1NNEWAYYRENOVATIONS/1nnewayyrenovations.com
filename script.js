document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = document.querySelector('.dots');
  const counter = document.querySelector('.counter');

  if (slides.length && dots && counter) {
    let i = 0;
    let timer = null;
    let isPaused = false;
    const pauseBtn = document.querySelector('.slide-pause');
    const slideLinks = [...document.querySelectorAll('[data-slide-link]')];

    function requestedSlide() {
      const params = new URLSearchParams(window.location.search);
      const q = parseInt(params.get('slide') || '', 10);
      if (Number.isFinite(q) && q >= 1 && q <= slides.length) return q - 1;

      const m = window.location.hash.match(/^#slide-(\d+)$/);
      if (m) {
        const h = parseInt(m[1], 10);
        if (Number.isFinite(h) && h >= 1 && h <= slides.length) return h - 1;
      }
      return 0;
    }

    function updateNav() {
      slideLinks.forEach(a => {
        a.classList.toggle('active', Number(a.dataset.slideLink) === i + 1);
      });
    }

    function go(n, updateUrl = false) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      [...dots.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
      counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + slides.length;
      updateNav();

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('slide', String(i + 1));
        url.hash = '';
        history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString());
      }

      if (timer) clearInterval(timer);
      if (!isPaused) timer = setInterval(() => go(i + 1, true), 6500);

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
      b.addEventListener('click', () => go(n, true));
      dots.appendChild(b);
    });

    document.querySelector('.prev')?.addEventListener('click', () => go(i - 1, true));
    document.querySelector('.next')?.addEventListener('click', () => go(i + 1, true));

    pauseBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      go(i, false);
    });

    // No click interception is used for header navigation.
    // Every header slide link performs a normal navigation to index.html?slide=N.
    // This guarantees the requested slide is selected on the first click.
    window.addEventListener('popstate', () => go(requestedSlide(), false));
    window.addEventListener('hashchange', () => go(requestedSlide(), false));

    go(requestedSlide(), false);
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
