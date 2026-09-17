import { useEffect, useRef } from 'react';
import { pageFor } from '../data/content';
import { clamp, easeInOut } from '../lib/motion';

const DURATION = { cover: 700, reveal: 750 };
const BULGE = 22;
// Keep the curve's real shape similar on tall phones and wide desktops.
const bulgeFor = () => BULGE * Math.min(1, window.innerWidth / window.innerHeight);

// Curved edge: the middle of the curtain leads, like liquid being pulled.
function coverPath(k, size) {
  const edge = 100 - 100 * k;
  const bulge = Math.sin(k * Math.PI) * size;
  return `M0 100 L0 ${edge.toFixed(2)} Q50 ${(edge - bulge).toFixed(2)} 100 ${edge.toFixed(2)} L100 100 Z`;
}

function revealPath(k, size) {
  const edge = 100 - 100 * k;
  const bulge = Math.sin(k * Math.PI) * size;
  return `M0 0 L100 0 L100 ${edge.toFixed(2)} Q50 ${(edge - bulge).toFixed(2)} 0 ${edge.toFixed(2)} Z`;
}

export default function Transition({ phase, path }) {
  const page = pageFor(path);
  const tintRef = useRef(null);
  const paperRef = useRef(null);

  useEffect(() => {
    const tint = tintRef.current;
    const paper = paperRef.current;
    if (!tint || !paper) return;
    if (phase === 'idle') {
      tint.setAttribute('d', 'M0 0Z');
      paper.setAttribute('d', 'M0 0Z');
      return;
    }
    const dur = DURATION[phase];
    // who leads: tint first on the way in, paper first on the way out
    const lead = phase === 'cover' ? { tint: 0, paper: 0.16 } : { tint: 0.14, paper: 0 };
    const shape = phase === 'cover' ? coverPath : revealPath;
    const size = bulgeFor();
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const kt = easeInOut(clamp((t - lead.tint) / (1 - lead.tint)));
      const kp = easeInOut(clamp((t - lead.paper) / (1 - lead.paper)));
      tint.setAttribute('d', shape(kt, size));
      paper.setAttribute('d', shape(kp, size));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <div className={`wipe wipe--${phase}`} aria-hidden="true">
      <svg className="wipe__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wipe-tint" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ff7a3d" />
            <stop offset=".5" stopColor="#ff5e7e" />
            <stop offset="1" stopColor="#7b6cff" />
          </linearGradient>
          <linearGradient id="wipe-paper" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff3ea" />
            <stop offset=".5" stopColor="#f6f6fb" />
            <stop offset="1" stopColor="#eceeff" />
          </linearGradient>
        </defs>
        <path ref={tintRef} d="M0 0Z" fill="url(#wipe-tint)" />
        <path ref={paperRef} d="M0 0Z" fill="url(#wipe-paper)" />
      </svg>
      <div className="wipe__inner">
        <span className="wipe__track">
          <span className="wipe__dot" />
        </span>
        <span className="wipe__label">{page ? page.label : 'Page'}</span>
      </div>
    </div>
  );
}
