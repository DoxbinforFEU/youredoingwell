/* ============================================
   END OF AUGUST — main.js
   GSAP-driven scroll storytelling, custom audio
   player, lightbox gallery, ambient particles.
   ============================================ */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------
     1. SCROLL REVEALS
  --------------------------------------------- */
  function initReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    items.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: reduceMotion ? 0.01 : 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  /* ---------------------------------------------
     2. HERO ENTRANCE
  --------------------------------------------- */
  function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      .to('.hero-title .line', { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.25)
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, 0.7)
      .to('.hero-scroll-cue', { opacity: 1, y: 0, duration: 0.8 }, 0.95)
      .fromTo('.hero-photo-frame', { opacity: 0, y: 40, rotate: -14 }, { opacity: 1, y: 0, rotate: -6, duration: 1.2 }, 0.6);

    if (!reduceMotion) {
      gsap.to('.hero-light', {
        scale: 1.15,
        opacity: 0.7,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }

  /* ---------------------------------------------
     3. PARALLAX
  --------------------------------------------- */
  function initParallax() {
    if (reduceMotion) return;
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const strength = parseFloat(el.dataset.parallax) || 0.1;
      gsap.to(el, {
        yPercent: strength * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  /* ---------------------------------------------
     4. CORKBOARD / SCRAPBOOK ROTATIONS
  --------------------------------------------- */
  function initRotations() {
    document.querySelectorAll('[data-rot]').forEach((el) => {
      el.style.setProperty('--r', `${el.dataset.rot}deg`);
    });
  }

  /* ---------------------------------------------
     5. CORKBOARD STACK-IN ANIMATION
  --------------------------------------------- */
  function initCorkboard() {
    const photos = gsap.utils.toArray('.cork-photo');
    if (!photos.length) return;
    gsap.set(photos, { opacity: 0, y: 60, scale: 0.85, rotate: 0 });
    ScrollTrigger.create({
      trigger: '#corkboard',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        photos.forEach((p, i) => {
          const targetRot = parseFloat(p.dataset.rot) || 0;
          gsap.to(p, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: targetRot,
            duration: reduceMotion ? 0.01 : 0.9,
            delay: reduceMotion ? 0 : i * 0.12,
            ease: 'back.out(1.4)',
            onComplete: () => {
              // hand control back to CSS so :hover can take over (inline
              // transform from GSAP would otherwise outrank the hover rule)
              gsap.set(p, { clearProps: 'transform,opacity' });
              p.style.opacity = 1;
            }
          });
        });
      }
    });
  }

  /* ---------------------------------------------
     6. SCRAPBOOK PIECES FLY IN
  --------------------------------------------- */
  function initScrapbook() {
    const pieces = gsap.utils.toArray('.scrap-photo, .scrap-note');
    if (!pieces.length) return;
    pieces.forEach((p) => {
      const targetRot = parseFloat(p.dataset.rot) || 0;
      gsap.set(p, { opacity: 0, scale: 0.8, rotate: targetRot - 10 });
    });
    ScrollTrigger.create({
      trigger: '.scrapbook-page',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        pieces.forEach((p, i) => {
          const targetRot = parseFloat(p.dataset.rot) || 0;
          gsap.to(p, {
            opacity: 1,
            scale: 1,
            rotate: targetRot,
            duration: reduceMotion ? 0.01 : 0.8,
            delay: reduceMotion ? 0 : i * 0.15,
            ease: 'back.out(1.5)'
          });
        });
      }
    });
  }

  /* ---------------------------------------------
     7. TIMELINE LINE GROWTH
  --------------------------------------------- */
  function initTimelineLine() {
    const line = document.querySelector('.timeline-line');
    if (!line || reduceMotion) return;
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: '#timeline',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 0.6
      }
    });
  }

  /* ---------------------------------------------
     8. SCROLL PROGRESS THREAD
  --------------------------------------------- */
  function initThread() {
    const fill = document.querySelector('.thread-fill');
    const pin = document.querySelector('.thread-pin');
    if (!fill || !pin) return;
    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        const pct = self.progress * 100;
        fill.style.height = pct + '%';
        pin.style.top = pct + '%';
      }
    });
  }

  /* ---------------------------------------------
     9. AMBIENT DUST MOTES
  --------------------------------------------- */
  function initDust() {
    if (reduceMotion) return;
    const field = document.getElementById('dustField');
    if (!field) return;
    const count = window.innerWidth < 700 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const mote = document.createElement('div');
      mote.className = 'dust-mote';
      const size = gsap.utils.random(3, 8);
      mote.style.width = size + 'px';
      mote.style.height = size + 'px';
      mote.style.left = gsap.utils.random(0, 100) + 'vw';
      mote.style.top = gsap.utils.random(0, 100) + 'vh';
      field.appendChild(mote);

      gsap.to(mote, {
        opacity: gsap.utils.random(0.15, 0.45),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 3)
      });
      gsap.to(mote, {
        y: gsap.utils.random(-120, -260),
        x: `+=${gsap.utils.random(-40, 40)}`,
        duration: gsap.utils.random(14, 26),
        repeat: -1,
        ease: 'none',
        delay: gsap.utils.random(0, 6)
      });
    }
  }

  /* ---------------------------------------------
     10. ENDING PARTICLES (denser, warmer)
  --------------------------------------------- */
  function initEndingParticles() {
    const field = document.getElementById('endingParticles');
    if (!field) return;
    const count = window.innerWidth < 700 ? 16 : 32;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'dust-mote';
      const size = gsap.utils.random(2, 6);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = gsap.utils.random(0, 100) + '%';
      p.style.top = gsap.utils.random(0, 100) + '%';
      p.style.position = 'absolute';
      field.appendChild(p);

      if (reduceMotion) {
        p.style.opacity = '0.3';
        continue;
      }
      gsap.to(p, {
        opacity: gsap.utils.random(0.2, 0.6),
        duration: gsap.utils.random(2, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 4)
      });
      gsap.to(p, {
        y: gsap.utils.random(-160, -320),
        duration: gsap.utils.random(12, 22),
        repeat: -1,
        ease: 'none',
        delay: gsap.utils.random(0, 6)
      });
    }
  }

  /* ---------------------------------------------
     11. CUSTOM AUDIO PLAYER
  --------------------------------------------- */
  function initPlayer() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');
    const progressWrap = document.getElementById('progressWrap');
    const progressFill = document.getElementById('progressFill');
    const progressKnob = document.getElementById('progressKnob');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('durationTime');
    const volumeWrap = document.getElementById('volumeWrap');
    const volumeFill = document.getElementById('volumeFill');
    const vinyl = document.getElementById('vinyl');
    const tonearm = document.getElementById('tonearm');
    const visualizer = document.getElementById('visualizer');

    if (!audio) return;

    let isScrubbing = false;
    audio.volume = 0.7;
    volumeFill.style.width = '70%';

    function formatTime(t) {
      if (!isFinite(t) || isNaN(t)) return '0:00';
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    function setPlayingUI(playing) {
      iconPlay.style.display = playing ? 'none' : 'block';
      iconPause.style.display = playing ? 'block' : 'none';
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      vinyl.classList.toggle('spinning', playing);
      tonearm.classList.toggle('active', playing);
      visualizer.classList.toggle('active', playing);
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', () => setPlayingUI(true));
    audio.addEventListener('pause', () => setPlayingUI(false));
    audio.addEventListener('ended', () => setPlayingUI(false));

    audio.addEventListener('timeupdate', () => {
      if (isScrubbing) return;
      const pct = (audio.currentTime / audio.duration) * 100 || 0;
      progressFill.style.width = pct + '%';
      progressKnob.style.left = pct + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    function scrub(clientX) {
      const rect = progressWrap.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.min(Math.max(pct, 0), 1);
      progressFill.style.width = pct * 100 + '%';
      progressKnob.style.left = pct * 100 + '%';
      if (audio.duration) {
        audio.currentTime = pct * audio.duration;
        currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    }

    progressWrap.addEventListener('pointerdown', (e) => {
      isScrubbing = true;
      scrub(e.clientX);
      progressWrap.setPointerCapture(e.pointerId);
    });
    progressWrap.addEventListener('pointermove', (e) => {
      if (isScrubbing) scrub(e.clientX);
    });
    progressWrap.addEventListener('pointerup', () => { isScrubbing = false; });
    progressWrap.addEventListener('pointercancel', () => { isScrubbing = false; });

    function setVolume(clientX) {
      const rect = volumeWrap.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.min(Math.max(pct, 0), 1);
      audio.volume = pct;
      volumeFill.style.width = pct * 100 + '%';
    }
    let isVolScrub = false;
    volumeWrap.addEventListener('pointerdown', (e) => {
      isVolScrub = true;
      setVolume(e.clientX);
      volumeWrap.setPointerCapture(e.pointerId);
    });
    volumeWrap.addEventListener('pointermove', (e) => {
      if (isVolScrub) setVolume(e.clientX);
    });
    volumeWrap.addEventListener('pointerup', () => { isVolScrub = false; });
    volumeWrap.addEventListener('pointercancel', () => { isVolScrub = false; });
  }

  /* ---------------------------------------------
     12. GALLERY + LIGHTBOX
  --------------------------------------------- */
  function initGallery() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!items.length) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    const sources = items.map((btn) => ({
      src: btn.querySelector('img').src,
      alt: btn.querySelector('img').alt
    }));

    let current = 0;
    let lastFocused = null;

    function openLightbox(index) {
      current = index;
      updateLightbox();
      lightbox.classList.add('open');
      lastFocused = document.activeElement;
      lightboxClose.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    function updateLightbox() {
      const item = sources[current];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCounter.textContent = `${current + 1} / ${sources.length}`;
    }

    function next() {
      current = (current + 1) % sources.length;
      updateLightbox();
    }
    function prev() {
      current = (current - 1 + sources.length) % sources.length;
      updateLightbox();
    }

    items.forEach((btn, i) => {
      btn.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', next);
    lightboxPrev.addEventListener('click', prev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    // swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });
  }

  /* ---------------------------------------------
     13. VIDEO FADE-IN ON SCROLL
  --------------------------------------------- */
  function initVideoReveal() {
    const frame = document.querySelector('.video-frame');
    if (!frame) return;
    gsap.fromTo(frame, { opacity: 0, y: 50, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1,
      duration: reduceMotion ? 0.01 : 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: frame,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ---------------------------------------------
     INIT ALL
  --------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initRotations();
    initHero();
    initReveals();
    initParallax();
    initCorkboard();
    initScrapbook();
    initTimelineLine();
    initThread();
    initDust();
    initEndingParticles();
    initPlayer();
    initGallery();
    initVideoReveal();

    ScrollTrigger.refresh();
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
})();
