import { useEffect, useRef, useState } from 'react';
import Calculator from '../components/Calculator';
import CtaBand from '../components/CtaBand';
import Faq from '../components/Faq';
import { ArrowRight, Check, Glyph } from '../components/Icons';
import NextPage from '../components/NextPage';
import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import { MaskLines } from '../components/UI';
import { PREVIEWS } from '../components/previews/Previews';
import { engagement, pageFor, projects, services } from '../data/content';
import { clearIntent, peekIntent, setIntent } from '../lib/intent';
import { onScrollTick, scrollToId } from '../lib/motion';
import { useRouter } from '../lib/router';

function ServiceTabs() {
  const [active, setActive] = useState(services[0].id);
  const barRef = useRef(null);

  useEffect(() => {
    let current = '';
    return onScrollTick(({ vh }) => {
      let found = services[0].id;
      services.forEach((s) => {
        const el = document.getElementById(`svc-${s.id}`);
        if (el && el.getBoundingClientRect().top < vh * 0.45) found = s.id;
      });
      if (found !== current) {
        current = found;
        setActive(found);
      }
      const first = document.getElementById(`svc-${services[0].id}`);
      const last = document.getElementById(`svc-${services[services.length - 1].id}`);
      if (barRef.current && first) barRef.current.classList.toggle('is-stuck', first.getBoundingClientRect().top < 160);
      if (barRef.current && last) barRef.current.classList.toggle('is-gone', last.getBoundingClientRect().bottom < 180);
    });
  }, []);

  return (
    <div className="svc-tabs" ref={barRef}>
      <div className="container">
        <nav className="svc-tabs__inner" aria-label="Services">
          {services.map((s) => (
            <a key={s.id} href={`#svc-${s.id}`} className={active === s.id ? 'is-active' : ''} aria-current={active === s.id ? 'true' : undefined}>
              <Glyph name={s.glyph} />
              {s.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ServiceDetail({ service, index }) {
  const { navigate } = useRouter();
  const Preview = PREVIEWS[service.preview];
  const related = projects.filter((p) => (p.services || []).includes(service.id));

  const start = () => {
    setIntent({ services: [service.id] });
    navigate('/contact');
  };
  const seeWork = () => {
    setIntent({ filter: service.id });
    navigate('/work');
  };

  return (
    <section id={`svc-${service.id}`} className={`svc ${index % 2 ? 'svc--flip' : ''}`} aria-labelledby={`svc-${service.id}-title`}>
      <div className="container svc__grid">
        <div className="svc__copy">
          <div className="svc__head" data-reveal>
            <span className="svc__glyph" aria-hidden="true">
              <Glyph name={service.glyph} />
            </span>
          </div>
          <MaskLines id={`svc-${service.id}-title`} className="svc__title" lines={[service.title]} />
          <p className="svc__short" data-reveal style={{ '--d': '0.1s' }}>
            {service.short}
          </p>
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            {service.text}
          </p>

          <div className="svc__box" data-reveal style={{ '--d': '0.2s' }}>
            <p className="card__label">What you get</p>
            <ul className="svc__list">
              {service.deliverables.map((d) => (
                <li key={d}>
                  <span className="svc__tick" aria-hidden="true">
                    <Check />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="card__label svc__tools-label">Tools</p>
            <ul className="svc__tools">
              {service.tools.map((t, j) => (
                <li className="chip" key={t} style={{ '--j': j }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="svc__actions" data-reveal style={{ '--d': '0.25s' }}>
            <button type="button" className="btn btn--primary" onClick={start}>
              {service.cta}
            </button>
            {related.length > 0 && (
              <button type="button" className="text-link" onClick={seeWork}>
                See related work ({related.length}) <ArrowRight />
              </button>
            )}
          </div>
        </div>

        <div className="svc__visual" data-reveal="scale">
          <div className="svc__stage">{Preview && <Preview />}</div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  // Arrived from a service link: jump to that service once the page is in.
  useEffect(() => {
    const intent = peekIntent();
    if (!intent || !intent.scroll) return;
    clearIntent('scroll');
    const t = setTimeout(() => scrollToId(intent.scroll), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageHeader page={pageFor('/services')} />
      <ServiceTabs />
      {services.map((s, i) => (
        <ServiceDetail key={s.id} service={s} index={i} />
      ))}
      <Process
        id="engage-title"
        lines={['How a project', 'runs.']}
        lede="Clear steps from first message to launch, so you always know what happens next."
        steps={engagement}
      />
      <Calculator />
      <Faq />
      <CtaBand />
      <NextPage current="/services" />
    </>
  );
}
