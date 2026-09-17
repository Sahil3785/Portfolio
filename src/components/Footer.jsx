import { useEffect, useRef } from 'react';
import { pages, profile } from '../data/content';
import { clamp, onScrollTick, reducedMotion, scrollToY } from '../lib/motion';
import { Link, useRouter } from '../lib/router';
import { Magnetic, RollLabel } from './UI';

export default function Footer() {
  const { path } = useRouter();
  const wordRef = useRef(null);
  const letters = profile.domain.split('');

  // Scale the wordmark so it always spans the container, whatever font loads.
  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const fit = () => {
      word.style.fontSize = '';
      const box = word.clientWidth;
      const base = parseFloat(getComputedStyle(word).fontSize);
      const natural = [...word.children].reduce((sum, ch) => sum + ch.getBoundingClientRect().width, 0);
      if (!natural) return;
      word.style.fontSize = `${Math.min(base * (box / natural) * 0.98, 240).toFixed(1)}px`;
      // one continuous gradient across all letters
      const letters = [...word.children];
      const first = letters[0].offsetLeft;
      const last = letters[letters.length - 1];
      const span = last.offsetLeft + last.offsetWidth - first;
      letters.forEach((ch) => {
        ch.style.setProperty('--bw', `${span}px`);
        ch.style.setProperty('--bx', `${first - ch.offsetLeft}px`);
      });
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Letters rise into place as you reach the bottom of the page.
  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    if (reducedMotion()) return;
    return onScrollTick(({ vh }) => {
      const r = word.getBoundingClientRect();
      if (r.top > vh * 1.2) {
        [...word.children].forEach((ch) => ch.style.setProperty('--y', '70%'));
        return;
      }
      const remaining = document.documentElement.scrollHeight - (window.scrollY + vh);
      const p = clamp(1 - remaining / (vh * 0.6));
      [...word.children].forEach((ch, i) => {
        const local = clamp((p - i * 0.03) * 1.8);
        ch.style.setProperty('--y', `${((1 - local) * 70).toFixed(1)}%`);
      });
    });
  }, [path]);

  return (
    <footer className="footer">
      <div className="container">
        {path !== '/contact' && (
          <div className="footer__top">
            <p className="footer__ask">Have a workflow that needs fixing?</p>
            <Magnetic>
              <Link to="/contact" className="btn btn--primary">
                <RollLabel>Start a project</RollLabel>
              </Link>
            </Magnetic>
          </div>
        )}

        <div className="footer__cols">
          <div>
            <p className="footer__h">Pages</p>
            <ul>
              {pages.map((p) => (
                <li key={p.path}>
                  <Link to={p.path}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer__h">Elsewhere</p>
            <ul>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.gmail} target="_blank" rel="noreferrer">
                  Gmail
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer__h">Say hello</p>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <a href={profile.cv} download="Sahil_CV.pdf">
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__word" ref={wordRef} aria-hidden="true">
          {letters.map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>

        <div className="footer__bottom">
          <span>
            &copy; {new Date().getFullYear()} {profile.name}. Crafting efficient digital futures.
          </span>
          <button type="button" className="footer__top-btn" onClick={() => scrollToY(0)}>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
