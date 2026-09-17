import { useEffect, useRef } from 'react';
import { finePointer, lerp, reducedMotion } from '../lib/motion';

// A dot that tracks the pointer exactly, and a ring that trails it.
// Elements can set data-cursor="Label" to show a text bubble instead.
export default function Cursor() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const root = rootRef.current;
    const html = document.documentElement;
    html.classList.add('has-cursor');

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf;
    let visible = false;

    const loop = () => {
      rx = lerp(rx, x, 0.18);
      ry = lerp(ry, y, 0.18);
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        root.classList.remove('is-hidden');
      }
    };

    const onOver = (e) => {
      const target = e.target;
      const labelled = target.closest('[data-cursor]');
      const text = target.closest('input, textarea');
      const interactive = target.closest('a, button, select, label, [role="button"]');

      root.classList.toggle('is-label', Boolean(labelled));
      root.classList.toggle('is-text', Boolean(text));
      root.classList.toggle('is-hover', Boolean(interactive) && !labelled && !text);
      if (labelled) labelRef.current.textContent = labelled.getAttribute('data-cursor');
    };

    const onLeave = () => {
      visible = false;
      root.classList.add('is-hidden');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="cursor is-hidden" ref={rootRef} aria-hidden="true">
      <div className="cursor__ring" ref={ringRef}>
        <span className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
