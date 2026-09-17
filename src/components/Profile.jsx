import { useEffect, useRef, useState } from 'react';
import { experience, focus, profile, statement } from '../data/content';
import { clamp, onScrollTick, reducedMotion, stickyProgress, watchVisibility } from '../lib/motion';
import { Bolt, Cap, Check } from './Icons';
import { MaskLines } from './UI';

const CODE = [
  [['c', '// how I approach a workflow']],
  [['k', 'class '], ['n', 'Sahil'], ['p', ' {']],
  [['p', '  '], ['f', 'constructor'], ['p', '() {']],
  [['p', '    '], ['k', 'this'], ['p', '.focus = ['], ['s', '"Automation"'], ['p', ', '], ['s', '"Frontend Architecture"'], ['p', '];']],
  [['p', '  }']],
  [['p', '']],
  [['p', '  '], ['f', 'optimize'], ['p', '(workflow) {']],
  [['p', '    '], ['k', 'return'], ['p', ' workflow']],
  [['p', '      .'], ['f', 'pipe'], ['p', '('], ['k', 'this'], ['p', '.automateWithN8n)']],
  [['p', '      .'], ['f', 'pipe'], ['p', '('], ['k', 'this'], ['p', '.integrateApis)']],
  [['p', '      .'], ['f', 'retry'], ['p', '(3)']],
  [['p', '      .'], ['f', 'deploy'], ['p', '();']],
  [['p', '  }']],
  [['p', '}']],
];
const TOTAL = CODE.reduce((sum, line) => sum + line.reduce((s, [, t]) => s + t.length, 0) + 1, 0);

function CodeCard() {
  const ref = useRef(null);
  const [count, setCount] = useState(() => (reducedMotion() ? TOTAL : 0));

  useEffect(() => {
    if (count >= TOTAL) return;
    let timer;
    const stop = watchVisibility(
      ref.current,
      (visible) => {
        if (!visible || timer) return;
        timer = setInterval(() => {
          setCount((c) => {
            if (c + 3 >= TOTAL) clearInterval(timer);
            return Math.min(TOTAL, c + 3);
          });
        }, 18);
      },
      '-15%'
    );
    return () => {
      stop();
      clearInterval(timer);
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let left = count;
  const out = [];
  for (let li = 0; li < CODE.length && left > 0; li++) {
    CODE[li].forEach(([kind, text], ti) => {
      if (left <= 0) return;
      out.push(
        <span key={`${li}-${ti}`} className={`t-${kind}`}>
          {text.slice(0, left)}
        </span>
      );
      left -= text.length;
    });
    if (left > 0) {
      out.push(<span key={`${li}-nl`}>{'\n'}</span>);
      left -= 1;
    }
  }

  return (
    <div className="code" ref={ref} data-reveal="scale">
      <div className="code__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>sahil.js</span>
      </div>
      <pre aria-label="Code sample describing how Sahil approaches a workflow">
        <code>
          {out}
          <span className="caret" />
        </code>
      </pre>
    </div>
  );
}

export default function Profile() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const portraitRef = useRef(null);
  const [pinned, setPinned] = useState(false);
  const words = statement.split(' ');
  const current = experience.find((e) => e.kind === 'work' && e.current);
  const school = experience.find((e) => e.kind === 'education');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const update = () => setPinned(mq.matches && !reducedMotion());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const spans = textRef.current ? [...textRef.current.querySelectorAll('.w')] : [];
    if (reducedMotion()) {
      spans.forEach((s) => s.classList.add('is-lit'));
      return;
    }
    let lastLit = -1;
    return onScrollTick(({ vh }) => {
      let p;
      if (pinned) {
        p = clamp((stickyProgress(sectionRef.current, vh) - 0.04) / 0.72);
      } else {
        const r = textRef.current.getBoundingClientRect();
        p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3));
      }
      const lit = Math.round(p * spans.length);
      if (lit !== lastLit) {
        spans.forEach((s, i) => s.classList.toggle('is-lit', i < lit));
        lastLit = lit;
      }
      if (portraitRef.current) portraitRef.current.style.setProperty('--p', p.toFixed(3));
    });
  }, [pinned]);

  return (
    <>
      <section
        id="summary"
        className={`profile ${pinned ? 'profile--pinned' : ''}`}
        ref={sectionRef}
        aria-labelledby="profile-title"
      >
        <div className="profile__sticky">
          <div className="container profile__grid">
            <figure className="portrait" ref={portraitRef} data-reveal="fade" style={{ margin: 0 }}>
              <picture>
                <source srcSet={profile.photo} type="image/webp" />
                <img
                  src={profile.photoFallback}
                  alt={`Portrait of ${profile.name}`}
                  width="720"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="portrait__scan" aria-hidden="true" />
              <div className="portrait__corners" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <figcaption className="portrait__caption">
                <div className="portrait__name">{profile.name}</div>
                <div className="portrait__role">{profile.role}</div>
              </figcaption>
            </figure>

            <div>
              <h2 id="profile-title" className="sr-only">
                Profile
              </h2>
              <p className="statement" ref={textRef}>
                {words.map((w, i) => (
                  <span key={i} className="w">
                    {w}{' '}
                  </span>
                ))}
              </p>
              <div className="profile__foot">
                {current && (
                  <span>
                    <Bolt /> {current.title} at {current.org}
                  </span>
                )}
                {school && (
                  <span>
                    <Cap /> {school.title}, {school.org}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-more" aria-label="Focus areas">
        <div className="container profile-more__grid">
          <div>
            <MaskLines as="h2" className="focus__title" lines={['What I focus on']} />
            <ul className="focus">
              {focus.map((item, i) => (
                <li key={item} data-reveal style={{ '--d': `${i * 0.1}s` }}>
                  <span className="focus__tick">
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <CodeCard />
        </div>
      </section>
    </>
  );
}
