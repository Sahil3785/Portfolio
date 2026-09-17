import { useEffect, useRef } from 'react';
import { stream } from '../data/content';
import { reducedMotion, watchVisibility } from '../lib/motion';

// Endless ticker of tools. Drifts slowly, speeds up with scroll velocity
// and flips direction when you scroll back up.
export default function Stream() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const track = trackRef.current;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf;
    let visible = true;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(loop);
    };

    const stop = watchVisibility(rootRef.current, (v) => {
      visible = v;
      if (v) start();
    });

    function loop(now) {
      if (!visible) {
        running = false;
        return;
      }
      const dt = Math.min(64, now - last);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 1) dir = dy > 0 ? -1 : 1;
      boost += (Math.min(40, Math.abs(dy)) - boost) * 0.08;

      const half = track.scrollWidth / 2;
      x += dir * (0.045 + boost * 0.03) * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    }

    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, []);

  const items = [...stream, ...stream];

  return (
    <div className="stream" ref={rootRef}>
      <p className="sr-only">Tools I work with: {stream.join(', ')}.</p>
      <div className="stream__track" ref={trackRef} aria-hidden="true">
        {items.map((word, i) => (
          <span className="stream__item" key={`${word}-${i}`}>
            <span className="stream__word">{word}</span>
            <span className="stream__glyph" />
          </span>
        ))}
      </div>
    </div>
  );
}
