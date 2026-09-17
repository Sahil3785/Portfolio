import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { reducedMotion } from '../lib/motion';

const STEPS = ['connecting nodes', 'loading workflows', 'running checks', 'deploying'];
const KEY = 'bws-intro-seen';

function seenThisSession() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export default function Preloader({ onDone }) {
  const [skip] = useState(() => seenThisSession() || reducedMotion());
  const [phase, setPhase] = useState(skip ? 'gone' : 'run');
  const [step, setStep] = useState(0);
  const fillRef = useRef(null);
  const countRef = useRef(null);
  const nodesRef = useRef(null);

  useEffect(() => {
    if (skip) {
      onDone();
      return;
    }

    document.body.classList.add('is-locked');
    const duration = 1400;
    const start = performance.now();
    let raf;
    let exitTimer;
    let goneTimer;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${eased})`;
      if (countRef.current) countRef.current.textContent = `${String(pct).padStart(3, '0')}%`;
      if (nodesRef.current) {
        [...nodesRef.current.children].forEach((node, i) => {
          node.classList.toggle('is-on', eased >= i / 3 - 0.001);
        });
      }
      setStep(Math.min(STEPS.length - 1, Math.floor(eased * STEPS.length)));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        exitTimer = setTimeout(() => {
          setPhase('exit');
          document.body.classList.remove('is-locked');
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {
            /* storage can be unavailable */
          }
          onDone();
          goneTimer = setTimeout(() => setPhase('gone'), 1100);
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
      document.body.classList.remove('is-locked');
    };
    // onDone is stable from the parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  if (phase === 'gone') return null;

  return (
    <div className={`preloader ${phase === 'exit' ? 'is-done' : ''}`} aria-hidden="true">
      <div className="preloader__box">
        <div className="preloader__head">
          <span className="preloader__name">{profile.name}</span>
          <span className="preloader__count" ref={countRef}>
            000%
          </span>
        </div>
        <div className="preloader__track">
          <div className="preloader__fill" ref={fillRef} />
          <div className="preloader__nodes" ref={nodesRef}>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="preloader__step">&gt; {STEPS[step]}</p>
      </div>
    </div>
  );
}
