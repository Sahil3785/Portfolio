import { useEffect, useRef, useState } from 'react';
import { experience, highlights, profile } from '../data/content';
import { clamp, onScrollTick } from '../lib/motion';
import { Download, Plus } from './Icons';

const VISIBLE = 4;

function Item({ item, index }) {
  const [open, setOpen] = useState(false);
  const first = item.bullets.slice(0, VISIBLE);
  const rest = item.bullets.slice(VISIBLE);
  const listId = `exp-more-${index}`;

  return (
    <li className="exp__item" data-reveal style={{ '--d': '0.05s' }}>
      <span className="exp__dot" aria-hidden="true" />
      <div className="exp__meta">
        <span>{item.date}</span>
        {item.kind === 'education' && <span className="tag">Education</span>}
        {item.current && item.kind === 'work' && <span className="tag tag--live">Current role</span>}
      </div>
      <h2 className="exp__title">{item.title}</h2>
      <p className="exp__org">{item.org}</p>
      <ul className="exp__bullets">
        {first.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {rest.length > 0 && (
        <>
          <div className={`exp__extra ${open ? 'is-open' : ''}`} id={listId}>
            <ul className="exp__bullets">
              {rest.map((b) => (
                <li key={b} aria-hidden={!open}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="exp__toggle"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((v) => !v)}
          >
            <Plus />
            {open ? 'Show less' : `Show ${rest.length} more`}
          </button>
        </>
      )}
    </li>
  );
}

export default function Experience() {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    return onScrollTick(({ vh }) => {
      const list = listRef.current;
      if (!list) return;
      const r = list.getBoundingClientRect();
      const line = vh * 0.6;
      const p = clamp((line - r.top) / r.height);
      fillRef.current.style.transform = `scaleY(${p})`;
      list.querySelectorAll('.exp__item').forEach((item) => {
        const dot = item.querySelector('.exp__dot').getBoundingClientRect();
        item.classList.toggle('is-reached', dot.top < line);
      });
    });
  }, []);

  return (
    <section id="experience" className="exp" aria-label="Experience and education">
      <div className="container exp__grid">
        <aside className="exp__aside">
          <div className="card exp__card" data-reveal>
            <p className="card__label">Highlights</p>
            <ul className="exp__chips">
              {highlights.map((h, i) => (
                <li className="chip" key={h} style={{ '--j': i }}>
                  {h}
                </li>
              ))}
            </ul>
            <a className="btn btn--primary exp__cv" href={profile.cv} download="Sahil_CV.pdf">
              <Download width="18" height="18" /> Download CV
            </a>
          </div>
        </aside>

        <div className="exp__list" ref={listRef}>
          <span className="exp__rail" aria-hidden="true">
            <span ref={fillRef} />
          </span>
          <ol>
            {experience.map((item, i) => (
              <Item key={item.title} item={item} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
