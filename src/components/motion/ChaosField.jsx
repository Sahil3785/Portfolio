import { useEffect, useRef } from 'react';
import { easeInOut, reducedMotion } from '../../lib/motion';

const COLORS = ['#5b63f0', '#ff7a3d', '#ff5e7e', '#7b6cff'];
const rand = (a, b) => a + Math.random() * (b - a);

function bezier(t, a, b, c, d) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

// "Chaos to order": dots drift randomly (manual work), then get captured and
// stream into the workflow panel in tidy lanes (automation).
export default function ChaosField({ targetRef, active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || reducedMotion()) return;
    const canvas = canvasRef.current;
    const host = canvas && canvas.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let W = 0;
    let H = 0;
    let target = { x: 0, y: 0, span: 80, vertical: false };
    let zone = { x0: 0, x1: 0, y0: 0, y1: 0 };
    let particles = [];

    const measure = () => {
      const r = host.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const panelEl = targetRef.current;
      const panel = panelEl && panelEl.getBoundingClientRect();
      const vertical = W < 1100;
      if (panel) {
        const px = panel.left - r.left;
        const py = panel.top - r.top;
        // funnel into the first node (the webhook trigger)
        const node = panelEl.querySelector('.flow__node');
        const n = node ? node.getBoundingClientRect() : null;
        target = vertical
          ? {
              x: n ? n.left - r.left + n.width / 2 : px + panel.width / 2,
              y: py + 4,
              span: n ? n.width * 0.5 : panel.width * 0.3,
              vertical,
            }
          : {
              x: px + 2,
              y: n ? n.top - r.top + n.height / 2 : py + panel.height * 0.42,
              span: n ? n.height * 0.7 : 40,
              vertical,
            };
        zone = vertical
          ? { x0: 0, x1: W, y0: H * 0.04, y1: Math.max(H * 0.2, py - 40) }
          : { x0: 0, x1: Math.max(W * 0.3, px - 80), y0: H * 0.08, y1: H * 0.94 };
      }
    };

    const spawn = (p, initial = false) => {
      p.phase = 'wander';
      p.x = rand(zone.x0, zone.x1);
      p.y = rand(zone.y0, zone.y1);
      p.vx = rand(-0.35, 0.35);
      p.vy = rand(-0.35, 0.35);
      p.wait = initial ? rand(200, 4200) : rand(900, 3400);
      p.r = rand(1.3, 2.6);
      p.alpha = 0;
      p.lane = rand(-1, 1);
      p.trail = [];
    };

    const startFlow = (p) => {
      p.phase = 'flow';
      p.t = 0;
      p.dur = rand(1200, 2000);
      p.sx = p.x;
      p.sy = p.y;
      if (target.vertical) {
        p.tx = target.x + (p.lane * target.span) / 2;
        p.ty = target.y;
        p.c1x = p.sx;
        p.c1y = p.sy + (p.ty - p.sy) * 0.6;
        p.c2x = p.tx;
        p.c2y = p.ty - 70;
      } else {
        p.tx = target.x;
        p.ty = target.y + (p.lane * target.span) / 2;
        p.c1x = p.sx + (p.tx - p.sx) * 0.55;
        p.c1y = p.sy;
        p.c2x = p.tx - 110;
        p.c2y = p.ty;
      }
    };

    measure();
    const count = W < 700 ? 50 : 90;
    particles = Array.from({ length: count }, (_, i) => {
      const p = { c: COLORS[i % COLORS.length] };
      spawn(p, true);
      return p;
    });

    let raf;
    let last = performance.now();
    let visible = true;
    let running = false;

    const frame = (now) => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        if (p.phase === 'wander') {
          p.vx += rand(-0.03, 0.03) * (dt / 16);
          p.vy += rand(-0.03, 0.03) * (dt / 16);
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 0.45) {
            p.vx *= 0.45 / sp;
            p.vy *= 0.45 / sp;
          }
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          if (p.x < zone.x0 || p.x > zone.x1) p.vx *= -1;
          if (p.y < zone.y0 || p.y > zone.y1) p.vy *= -1;
          p.alpha = Math.min(0.3, p.alpha + dt / 1600);
          p.wait -= dt;
          if (p.wait <= 0) startFlow(p);

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.t = Math.min(1, p.t + dt / p.dur);
          const e = easeInOut(p.t);
          p.x = bezier(e, p.sx, p.c1x, p.c2x, p.tx);
          p.y = bezier(e, p.sy, p.c1y, p.c2y, p.ty);
          p.trail.push(p.x, p.y);
          if (p.trail.length > 16) p.trail.splice(0, 2);

          // fading streak
          const fade = p.t > 0.85 ? (1 - p.t) / 0.15 : 1;
          ctx.globalAlpha = 0.6 * fade;
          ctx.strokeStyle = p.c;
          ctx.lineWidth = p.r * 0.85;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.trail[0], p.trail[1]);
          for (let i = 2; i < p.trail.length; i += 2) ctx.lineTo(p.trail[i], p.trail[i + 1]);
          ctx.stroke();
          ctx.globalAlpha = fade;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.1, 0, Math.PI * 2);
          ctx.fill();

          if (p.t >= 1) spawn(p);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);

    const onVis = () => !document.hidden && visible && start();
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    const settle = setTimeout(measure, 1900); // panel finishes its entrance
    start();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [active, targetRef]);

  return <canvas className="chaos" ref={canvasRef} aria-hidden="true" />;
}
