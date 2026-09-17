import { useRef } from 'react';
import { services } from '../data/content';
import { setIntent } from '../lib/intent';
import { Link } from '../lib/router';
import { ArrowRight, Glyph, Sparkles } from './Icons';
import { MaskLines, useTilt } from './UI';

function ServiceCard({ item, index }) {
  const ref = useRef(null);
  useTilt(ref, 6);
  return (
    <li className="tile svc-card" ref={ref} data-reveal style={{ '--d': `${index * 0.06}s` }}>
      <span className="tile__shine" aria-hidden="true" />
      <Link to="/services" className="svc-card__link" onClick={() => setIntent({ scroll: `svc-${item.id}` })}>
        <span className="tile__glyph" aria-hidden="true">
          <Glyph name={item.glyph} />
        </span>
        <h3 className="tile__title">{item.title}</h3>
        <p className="tile__text">{item.short}</p>
        <ul className="svc-card__tools" aria-label="Tools">
          {item.tools.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="svc-card__more">
          Details <ArrowRight />
        </span>
      </Link>
    </li>
  );
}

export default function Services() {
  return (
    <section className="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <MaskLines id="services-title" className="section-title" lines={['What I can', 'build for you']} />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            Five services that fit together. Use one, or combine them into a single system that runs your operations.
          </p>
        </div>
        <ul className="tiles">
          {services.map((item, i) => (
            <ServiceCard key={item.id} item={item} index={i} />
          ))}
          <li className="tile svc-card svc-card--combo" data-reveal style={{ '--d': `${services.length * 0.06}s` }}>
            <span className="tile__glyph" aria-hidden="true">
              <Sparkles />
            </span>
            <h3 className="tile__title">Not sure which one?</h3>
            <p className="tile__text">
              Most projects mix two or three of these. Tell me the problem, and I will suggest the right mix.
            </p>
            <Link to="/contact" className="btn btn--primary btn--sm svc-card__cta">
              Plan my project
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
