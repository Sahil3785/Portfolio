// Lightweight motion toolkit: one rAF-batched scroll ticker, smooth wheel scrolling,
// anchor handling and scroll reveals. No external animation libraries needed.

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- scroll ticker ---------- */

const subscribers = new Set();
let queued = false;

function flush() {
  queued = false;
  const state = { y: window.scrollY, vh: window.innerHeight, vw: window.innerWidth };
  subscribers.forEach((fn) => fn(state));
}

export function requestTick() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(flush);
}

export function onScrollTick(fn) {
  subscribers.add(fn);
  if (subscribers.size === 1) {
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }
  requestTick();
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
    }
  };
}

// Progress of a tall "sticky" section: 0 when its top hits the viewport top,
// 1 when its bottom reaches the viewport bottom.
export function stickyProgress(el, vh) {
  const r = el.getBoundingClientRect();
  const distance = r.height - vh;
  return distance <= 0 ? 0 : clamp(-r.top / distance);
}

/* ---------- smooth wheel scrolling ---------- */

let smooth = null;

export function initSmoothScroll() {
  if (smooth || reducedMotion() || !finePointer()) return () => {};

  let target = window.scrollY;
  let current = window.scrollY;
  let running = false;
  let lastSet = window.scrollY;
  let lastTime = 0;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  // Time-based easing: same feel at 30fps or 144fps.
  const loop = (now) => {
    if (!running) return;
    const dt = Math.min(100, now - (lastTime || now - 16.7));
    lastTime = now;
    const t = 1 - Math.pow(0.88, dt / 16.7);
    current = lerp(current, target, t);
    if (Math.abs(target - current) < 0.5) {
      current = target;
      running = false;
    }
    window.scrollTo(0, current);
    lastSet = window.scrollY;
    if (running) requestAnimationFrame(loop);
  };

  const start = () => {
    if (running) return;
    running = true;
    current = window.scrollY;
    lastTime = 0;
    requestAnimationFrame(loop);
  };

  const onWheel = (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
    if (e.target.closest && e.target.closest('textarea, select, [data-native-scroll]')) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const base = running ? target : window.scrollY;
    target = clamp(base + e.deltaY * unit, 0, maxScroll());
    start();
  };

  // Keyboard, scrollbar, find-in-page or touch scrolling always wins.
  const onScroll = () => {
    const y = window.scrollY;
    if (!running) {
      target = current = y;
    } else if (Math.abs(y - lastSet) > 3) {
      running = false;
      target = current = y;
    }
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });

  smooth = {
    scrollTo(y) {
      target = clamp(y, 0, maxScroll());
      start();
    },
    jump(y) {
      running = false;
      target = current = y;
      window.scrollTo(0, y);
    },
  };

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onScroll);
    smooth = null;
  };
}

// Instant jump (used on page change), keeps the smooth scroller in sync.
export function jumpTo(y = 0) {
  if (smooth) smooth.jump(y);
  else window.scrollTo(0, y);
}

export function scrollToY(y) {
  if (smooth) smooth.scrollTo(y);
  else window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToId(id) {
  const el = id === 'top' ? document.body : document.getElementById(id);
  if (!el) return;
  const navH = 88;
  const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - navH;
  scrollToY(y);
  if (id !== 'top') {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
}

// Route every in-page link through the smooth scroller.
export function initAnchorLinks() {
  const onClick = (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || id.startsWith('/')) return; // route links are handled by the router
    e.preventDefault();
    scrollToId(id);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/* ---------- reveals ---------- */

// Revealed elements get a data-in attribute rather than a class: React rewrites
// className on re-render (for example when an FAQ opens), which would wipe a
// class added here and hide the element again.

export function initReveals(root = document) {
  const els = [...root.querySelectorAll('[data-reveal]:not([data-in])')];
  if (reducedMotion()) {
    els.forEach((el) => el.setAttribute('data-in', ''));
    return () => {};
  }
  // Checked on every scroll frame, so nothing is skipped even when a fast
  // scroll on a slow device jumps straight past an element.
  const pending = new Set(els);
  let off = () => {};
  off = onScrollTick(({ vh }) => {
    pending.forEach((el) => {
      if (!el.isConnected) {
        pending.delete(el);
        return;
      }
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.setAttribute('data-in', '');
        pending.delete(el);
      }
    });
    if (pending.size === 0) off();
  });
  return () => off();
}

// Calls back with true/false as an element enters or leaves the viewport.
export function watchVisibility(el, cb, rootMargin = '80px') {
  if (!('IntersectionObserver' in window)) {
    cb(true);
    return () => {};
  }
  const io = new IntersectionObserver(([entry]) => cb(entry.isIntersecting), { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- text scramble ---------- */

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz';

// Briefly scrambles an element's text, resolving left to right.
export function scramble(el, duration = 420) {
  if (!el || reducedMotion()) return;
  const text = el.dataset.text || el.textContent;
  el.dataset.text = text;
  if (el._scramble) cancelAnimationFrame(el._scramble);
  const start = performance.now();
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const reveal = Math.floor(p * text.length);
    let out = '';
    for (let i = 0; i < text.length; i += 1) {
      out += i < reveal || text[i] === ' ' ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) {
      el._scramble = requestAnimationFrame(tick);
    } else {
      el.textContent = text;
      el.style.minWidth = '';
      el._scramble = null;
    }
  };
  el._scramble = requestAnimationFrame(tick);
}
