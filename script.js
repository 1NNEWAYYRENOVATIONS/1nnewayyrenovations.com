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


/* Review system — public publishable key; database permissions must be enforced by Supabase RLS. */
(() => {
  const SUPABASE_URL = 'https://vhwydkhqnwcatjgvivdp.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8dkgxiff3N966UjAyBSORw_qc6t1F3X';
  const reviewForm = document.getElementById('reviewForm');
  const reviewStatus = document.getElementById('reviewStatus');
  const liveReviews = document.getElementById('liveReviews');
  const supabaseReady = !!(window.supabase && SUPABASE_URL.startsWith('https://') && SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_'));
  const supabaseClient = supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

  const stars = n => '★'.repeat(Math.max(0, Math.min(5, Number(n)))) + '☆'.repeat(Math.max(0, 5 - Number(n)));
  const escapeHtml = value => { const d = document.createElement('div'); d.textContent = value ?? ''; return d.innerHTML; };

  /* Customer reviews supplied from Yelp/Thumbtack screenshots.
     Display only the customer's name, five-star rating, and review text as requested. */
  const importedCustomerReviews = [
    { reviewer_name: 'Tammeaka H.', rating: 5, review_text: 'This company is superb from the owner to the employees. They set the expectations from the very beginning for themselves and the customer. They truly exceeded my expectations and were immensely patience. As the old saying goes you get what you pay for and this company was worth every hundred dollar bill. There is only one way.' },
    { reviewer_name: 'Michelle S.', rating: 5, review_text: "I can't say enough about these guys!!! My apartment looks amazing and they were so nice! Definitely using them again!!!" },
    { reviewer_name: 'Amber M.', rating: 5, review_text: 'Donte was great! Responded quickly and was able to come the very next day for my microwave range install requiring an outlet install. So polite and continually cleaned while he worked as not to leave me a mess. I will definitely use again. I am already making a list. lol' },
    { reviewer_name: 'Amanda C.', rating: 5, review_text: '1nneway Renovations is an amazing company. They were very communicative and took the time to really understand our vision on our home project. They worked hard and were very timely! They went above and beyond to ensure our project was exactly what we expected. I would highly recommend them to anyone for their home projects. They are awesome!!!!' },
    { reviewer_name: 'Natural M.', rating: 5, review_text: 'Excellent service! Knowledgeable and professional. Highly recommend them.' }
  ];

  const renderReviewCards = reviews => {
    if (!liveReviews) return;
    liveReviews.innerHTML = reviews.map(r =>
      `<article class="card"><div aria-label="${Number(r.rating)} out of 5 stars">${stars(r.rating)}</div><h3>${escapeHtml(r.reviewer_name)}</h3><p>${escapeHtml(r.review_text)}</p></article>`
    ).join('');
  };

  async function loadApprovedReviews(){
    if (!liveReviews) return;
    if (!supabaseClient) {
      renderReviewCards(importedCustomerReviews);
      return;
    }
    const { data, error } = await supabaseClient.from('reviews')
      .select('reviewer_name,rating,review_text,created_at')
      .eq('approved', true)
      .order('created_at', { ascending:false });
    if (error) {
      console.error(error);
      renderReviewCards(importedCustomerReviews);
      return;
    }
    renderReviewCards([...importedCustomerReviews, ...(data || [])]);
  }

  if (reviewForm) reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (reviewStatus) reviewStatus.textContent = '';
    const fd = new FormData(reviewForm);
    if (String(fd.get('website') || '').trim()) return;
    const name = String(fd.get('reviewer_name') || '').trim();
    const rating = Number(fd.get('rating'));
    const text = String(fd.get('review_text') || '').trim();
    if (!name || !Number.isInteger(rating) || rating < 1 || rating > 5 || !text) {
      if (reviewStatus) reviewStatus.textContent = 'Please enter your name, select a star rating, and tell us about your experience.';
      return;
    }
    if (!supabaseClient) {
      if (reviewStatus) reviewStatus.textContent = 'The review system is temporarily unavailable. Please use the Google Review option instead.';
      return;
    }
    const submit = reviewForm.querySelector('button[type="submit"]');
    if (submit) { submit.disabled = true; submit.textContent = 'Submitting…'; }
    const { error } = await supabaseClient.from('reviews').insert({
      reviewer_name:name, rating, review_text:text, approved:false, source:'website'
    });
    if (error) {
      console.error(error);
      if (reviewStatus) reviewStatus.textContent = 'We could not submit your review right now. Please try again.';
    } else {
      reviewForm.reset();
      if (reviewStatus) reviewStatus.textContent = 'Thank you! Your review was submitted and will appear after approval.';
    }
    if (submit) { submit.disabled = false; submit.textContent = 'Submit Review'; }
  });

  loadApprovedReviews();
})();
