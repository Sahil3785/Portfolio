import { useState } from 'react';
import { faqs } from '../data/content';
import { Link } from '../lib/router';
import { ArrowRight, Plus } from './Icons';
import { MaskLines } from './UI';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__intro">
          <MaskLines id="faq-title" className="section-title" lines={['Questions,', 'answered.']} />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            The things clients usually ask before we start.
          </p>
          <Link to="/contact" className="text-link" data-reveal style={{ '--d': '0.25s' }}>
            Ask me something else <ArrowRight />
          </Link>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q} data-reveal style={{ '--d': `${i * 0.05}s` }}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>
                </h3>
                <div className="faq__a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
