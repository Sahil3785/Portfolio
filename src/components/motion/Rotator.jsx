import { useEffect, useState } from 'react';
import { reducedMotion } from '../../lib/motion';
import { SplitWords } from '../UI';

// Cycles through words; letters of the old word fly up as the new one rises.
export default function Rotator({ words, active, offset = 0, interval = 2600 }) {
  const [state, setState] = useState({ i: 0, prev: -1 });

  useEffect(() => {
    if (!active || reducedMotion()) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setState((s) => ({ prev: s.i, i: (s.i + 1) % words.length }));
    }, interval);
    return () => clearInterval(timer);
  }, [active, words.length, interval]);

  return (
    <span className="rot">
      {words.map((w, k) => (
        <span
          key={w}
          className={`rot__item ${k === state.i ? 'is-on' : ''} ${k === state.prev ? 'is-out' : ''}`}
        >
          <SplitWords text={w} offset={offset} />
        </span>
      ))}
    </span>
  );
}
