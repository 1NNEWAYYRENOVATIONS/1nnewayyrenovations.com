document.addEventListener('DOMContentLoaded', () => {
  const slides = [...document.querySelectorAll('.slide')];
  const dots = document.querySelector('.dots');
  const counter = document.querySelector('.counter');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  if (slides.length && dots && counter) {
    let i = 0;
    let timer;

    const requested = new URLSearchParams(window.location.search).get('slide');
    const hashMatch = window.location.hash.match(/slide-(\d+)/i);
    const requestedNumber = Number(requested || (hashMatch && hashMatch[1]) || 1);
    if (Number.isFinite(requestedNumber) && requestedNumber >= 1 && requestedNumber <= slides.length) {
      i = requestedNumber - 1;
    }

    function render(n, restart = true) {
      i = (n + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('active', idx === i));
      [...dots.children].forEach((dot, idx) => dot.classList.toggle('active', idx === i));
      counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + slides.length;
      if (restart) {
        clearInterval(timer);
        timer = setInterval(() => render(i + 1, false), 6500);
      }
    }

    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', `Go to slide ${n + 1}`);
      b.addEventListener('click', () => render(n));
      dots.appendChild(b);
    });

    if (prev) prev.addEventListener('click', () => render(i - 1));
    if (next) next.addEventListener('click', () => render(i + 1));
    render(i);
  }

  document.querySelectorAll('[data-slide-link]').forEach(link => {
    link.addEventListener('click', () => {
      // The destination URL already carries ?slide=N; allow normal navigation.
    });
  });

  document.querySelectorAll('[data-star]').forEach(button => {
    button.addEventListener('click', () => {
      const rating = Number(button.dataset.star);
      const field = document.querySelector('#rating');
      if (field) field.value = rating;
      document.querySelectorAll('[data-star]').forEach(x =>
        x.classList.toggle('selected', Number(x.dataset.star) <= rating)
      );
    });
  });

  document.querySelectorAll('[data-cat]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-cat]').forEach(x => x.classList.remove('active'));
      button.classList.add('active');
      const category = button.dataset.cat;
      document.querySelectorAll('.article').forEach(article =>
        article.classList.toggle('hidden', category !== 'all' && article.dataset.cat !== category)
      );
    });
  });

  document.querySelectorAll('.video-sound-button').forEach(button => {
    button.addEventListener('click', () => {
      const video = button.closest('.work-video-frame')?.querySelector('video');
      if (!video) return;
      video.muted = !video.muted;
      button.textContent = video.muted ? '🔇' : '🔊';
      button.setAttribute('aria-pressed', String(!video.muted));
      button.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Mute video');
    });
  });

  document.querySelectorAll('.video-play-overlay').forEach(button => {
    button.addEventListener('click', () => {
      const video = button.closest('.work-video-frame')?.querySelector('video');
      if (!video) return;
      video.play();
      button.style.display = 'none';
    });
  });

  document.querySelectorAll('.work-video').forEach(video => {
    video.addEventListener('play', () => {
      const overlay = video.closest('.work-video-frame')?.querySelector('.video-play-overlay');
      if (overlay) overlay.style.display = 'none';
    });
    video.addEventListener('pause', () => {
      const overlay = video.closest('.work-video-frame')?.querySelector('.video-play-overlay');
      if (overlay) overlay.style.display = '';
    });
  });
});
