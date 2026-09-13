document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = document.querySelector('.dots');
  const counter = document.querySelector('.counter');

  if (slides.length && dots && counter) {
    let i = 0;
    let timer;
    const slideLinks = [...document.querySelectorAll('[data-slide-link]')];

    function requestedIndex() {
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
        const n = Number(a.dataset.slideLink);
        a.classList.toggle('active', n === i + 1);
      });
    }

    function go(n, updateUrl = true) {
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
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), 6500);
    }

    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (n + 1));
      b.addEventListener('click', () => go(n));
      dots.appendChild(b);
    });

    document.querySelector('.prev')?.addEventListener('click', () => go(i - 1));
    document.querySelector('.next')?.addEventListener('click', () => go(i + 1));
    window.addEventListener('popstate', () => go(requestedIndex(), false));
    window.addEventListener('hashchange', () => go(requestedIndex(), false));
    go(requestedIndex(), false);
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
