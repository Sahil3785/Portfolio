import { useEffect, useRef } from 'react';
import { workSteps } from '../data/content';
import { clamp, onScrollTick } from '../lib/motion';
import { MaskLines } from './UI';

// Four-step pipeline. The wire fills as you scroll and each step lights up.
export default function Process({
  id = 'process-title',
  lines = ['How I work'],
  lede = 'The same four steps, whether it is a two-node workflow or a full integration layer.',
  steps = workSteps,
}) {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    return onScrollTick(({ vh }) => {
      const list = listRef.current;
      if (!list) return;
      const r = list.getBoundingClientRect();
      const p = clamp((vh * 0.75 - r.top) / (r.height + vh * 0.1));
      fillRef.current.style.setProperty('--p', p.toFixed(3));
      const steps = list.querySelectorAll('.step');
      steps.forEach((step, i) => step.classList.toggle('is-lit', p >= (i + 0.35) / steps.length));
    });
  }, []);

  return (
    <section className="process" aria-labelledby={id}>
      <div className="container">
        <div className="section-head">
          <MaskLines id={id} className="section-title" lines={lines} />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            {lede}
          </p>
        </div>
        <div className="steps" ref={listRef}>
          <span className="steps__wire" aria-hidden="true">
            <span ref={fillRef} />
          </span>
          <ol>
            {steps.map((s, i) => (
              <li className="step" key={s.title} data-reveal style={{ '--d': `${i * 0.08}s` }}>
                <span className="step__node" aria-hidden="true">
                  <span>{i + 1}</span>
                </span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
