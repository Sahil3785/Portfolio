import { Fragment, useEffect, useRef } from 'react';
import { finePointer, reducedMotion } from '../lib/motion';

// Pulls its child gently toward the pointer.
export function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.classList.add('is-active');
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const leave = () => {
      el.classList.remove('is-active');
      el.style.transform = '';
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return (
    <span className="magnetic" ref={ref}>
      {children}
    </span>
  );
}

// Subtle 3D tilt plus a pointer-following highlight (sets --mx / --my).
export function useTilt(ref, max = 5) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(2)}deg`);
      el.classList.add('is-tilting');
    };
    const leave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.classList.remove('is-tilting');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, max]);
}

// Text that rolls up to a copy of itself on hover.
export function RollLabel({ children }) {
  return (
    <span className="btn__label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

// Shrinks a heading made of .mask lines so its longest line fits the box.
// Never enlarges, and stops at 60% so very long lines wrap instead of going tiny.
export function fitLines(el) {
  if (!el) return;
  el.style.fontSize = '';
  const avail = el.clientWidth;
  const base = parseFloat(getComputedStyle(el).fontSize);
  let widest = 0;
  el.querySelectorAll('.mask > span').forEach((span) => {
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'nowrap';
    widest = Math.max(widest, span.offsetWidth);
    span.style.display = '';
    span.style.whiteSpace = '';
  });
  if (widest > avail && avail > 0) {
    const ratio = Math.max(0.6, avail / widest);
    el.style.fontSize = `${Math.floor(base * ratio * 0.99)}px`;
  }
}

export function useFitLines(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => fitLines(el);
    run();
    let frame;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(run);
    };
    window.addEventListener('resize', onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);
}

// Letters wrapped for per-character animation; words never break apart.
// `offset` continues the stagger count across lines.
export function SplitWords({ text, offset = 0 }) {
  const words = text.split(' ');
  let n = offset;
  return words.map((word, wi) => (
    <Fragment key={wi}>
      <span className="word">
        {[...word].map((ch, ci) => (
          <span className="char" key={ci} style={{ '--c': n++ }}>
            {ch}
          </span>
        ))}
      </span>
      {wi < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}

const charOffsets = (lines) => {
  let total = 0;
  return lines.map((line) => {
    const start = total;
    total += line.replace(/ /g, '').length;
    return start;
  });
};

// Splits a heading into masked lines for the reveal animation.
// With `split`, each letter rises on its own (kinetic type).
export function MaskLines({ lines, as: Tag = 'h2', className = '', delay = 0, id, split = false }) {
  const ref = useRef(null);
  useFitLines(ref);
  const offsets = charOffsets(lines);
  return (
    <Tag
      id={id}
      ref={ref}
      className={`${className} ${split ? 'is-split' : ''}`}
      data-reveal="mask"
      style={{ '--d': `${delay}s` }}
    >
      {split && <span className="sr-only">{lines.join(' ')}</span>}
      {lines.map((line, i) => (
        <span className="mask" key={i} style={{ '--i': i }} aria-hidden={split || undefined}>
          <span>
            {split ? <SplitWords text={line} offset={offsets[i]} /> : line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}
