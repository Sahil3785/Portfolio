import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pages, profile } from '../data/content';
import { clamp, onScrollTick, scramble } from '../lib/motion';
import { Link, useRouter } from '../lib/router';
import { GitHub, LinkedIn, Mail } from './Icons';
import { Magnetic, RollLabel } from './UI';

const LINKS = pages.filter((p) => p.nav);

export function BrandMark() {
  return (
    <span className="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none">
        <rect x="1" y="9" width="10" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <rect x="19" y="9" width="10" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 15h8" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.6" />
        <circle className="brand__packet" cx="9" cy="15" r="2.6" fill="var(--accent)" />
      </svg>
    </span>
  );
}

export default function Nav() {
  const { path } = useRouter();
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const pillRef = useRef(null);
  const barRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Frosted background once content slides under it, plus page progress.
  useEffect(() => {
    return onScrollTick(({ y, vh }) => {
      if (navRef.current) navRef.current.classList.toggle('is-scrolled', y > 8);
      const max = document.documentElement.scrollHeight - vh;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;
    });
  }, []);

  // The pill sits under the active link and follows the pointer on hover.
  const placePill = useCallback((el) => {
    const pill = pillRef.current;
    const wrap = linksRef.current;
    if (!pill || !wrap) return;
    if (!el) {
      pill.style.opacity = '0';
      return;
    }
    const a = el.getBoundingClientRect();
    const b = wrap.getBoundingClientRect();
    pill.style.opacity = '1';
    pill.style.width = `${a.width}px`;
    pill.style.transform = `translateX(${a.left - b.left}px)`;
  }, []);

  const activeLink = useCallback(
    () => (linksRef.current ? linksRef.current.querySelector('[aria-current="page"]') : null),
    []
  );

  useLayoutEffect(() => {
    placePill(activeLink());
  }, [path, placePill, activeLink]);

  useEffect(() => {
    const onResize = () => placePill(activeLink());
    window.addEventListener('resize', onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [placePill, activeLink]);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="nav" ref={navRef}>
        <div className="container nav__inner">
          <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
            <BrandMark />
            {profile.name}
          </Link>

          <nav className="nav__links" aria-label="Main" ref={linksRef} onPointerLeave={() => placePill(activeLink())}>
            <span className="nav__pill" ref={pillRef} aria-hidden="true" />
            {LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`nav__link ${path === l.path ? 'is-active' : ''}`}
                aria-label={l.label}
                onPointerEnter={(e) => {
                  placePill(e.currentTarget);
                  scramble(e.currentTarget.querySelector('.scr'));
                }}
              >
                <span className="scr" aria-hidden="true">
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="nav__right">
            <span className="status">
              <span className="status__dot" />
              Available
            </span>
            <Magnetic>
              <Link to="/contact" className="btn btn--primary btn--sm">
                <RollLabel>Start a project</RollLabel>
              </Link>
            </Magnetic>
            <button
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <span className="nav__progress" aria-hidden="true">
          <span ref={barRef} />
        </span>
      </header>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="menu__links" aria-label="Mobile">
          {pages.map((l, i) => (
            <Link
              key={l.path}
              to={l.path}
              style={{ '--i': i }}
              tabIndex={open ? 0 : -1}
              className={path === l.path ? 'is-active' : ''}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={profile.github} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="social">
            <GitHub /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="social">
            <LinkedIn /> LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="social">
            <Mail /> Email
          </a>
        </div>
      </div>
    </>
  );
}
