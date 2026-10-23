import { useRef } from 'react';
import { spotlight } from '../data/content';
import { ArrowUpRight, Download, GitHub, Globe, Monitor, Phone } from './Icons';
import { MaskLines, useTilt } from './UI';

const ICONS = { globe: Globe, phone: Phone, monitor: Monitor };

// Featured case study: one project shown across all the platforms it ships to.
export default function Spotlight({ headingLevel = 'h2' }) {
  const shotsRef = useRef(null);
  useTilt(shotsRef, 3);

  return (
    <section className="spot" aria-labelledby="spot-title">
      <div className="container">
        <div className="spot__card card">
          <div className="spot__grid">
            <div className="spot__copy">
              <p className="spot__label" data-reveal>
                <span className="tag tag--live">Live</span> {spotlight.label}
              </p>
              <MaskLines id="spot-title" as={headingLevel} className="spot__title" lines={[spotlight.title]} />
              <p className="lede" data-reveal style={{ '--d': '0.1s' }}>
                {spotlight.lede}
              </p>
              <ul className="spot__stats" data-reveal style={{ '--d': '0.15s' }}>
                {spotlight.stats.map((s) => (
                  <li key={s.label}>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal="scale">
              <div className="spot__shots" ref={shotsRef}>
                <a href={spotlight.platforms[0].href} target="_blank" rel="noreferrer" className="spot__shot spot__shot--a" data-cursor="Open">
                  <img src={spotlight.image} alt={spotlight.imageAlt} width="1280" height="800" loading="lazy" decoding="async" />
                </a>
                <img
                  className="spot__shot spot__shot--b"
                  src={spotlight.image2}
                  alt={spotlight.image2Alt}
                  width="1280"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <ul className="spot__platforms">
            {spotlight.platforms.map((p, i) => {
              const Icon = ICONS[p.icon] || Globe;
              return (
                <li key={p.title} className="spot__platform" data-reveal style={{ '--d': `${i * 0.08}s` }}>
                  <span className="spot__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <a className="text-link" href={p.href} target="_blank" rel="noreferrer" {...(p.download ? { download: '' } : {})}>
                    {p.action} {p.download ? <Download /> : <ArrowUpRight />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="spot__foot" data-reveal>
            <ul className="spot__tech" aria-label="Built with">
              {spotlight.tech.map((t, j) => (
                <li className="chip" key={t} style={{ '--j': j }}>
                  {t}
                </li>
              ))}
            </ul>
            <a className="text-link" href={spotlight.repo} target="_blank" rel="noreferrer">
              <GitHub /> View the code
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
