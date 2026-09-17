import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { onScrollTick } from '../lib/motion';
import { Link, useRouter } from '../lib/router';
import { whatsappLink } from './CtaBand';
import { Calendar, Close, Download, Glyph, Mail, Sparkles, WhatsApp } from './Icons';

// Floating shortcut to every way of getting in touch.
export default function QuickDock() {
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    let last = null;
    return onScrollTick(({ y, vh }) => {
      const next = y > vh * 0.5;
      if (next !== last) {
        last = next;
        setShown(next);
      }
    });
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDown = (e) => rootRef.current && !rootRef.current.contains(e.target) && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  if (path === '/contact') return null;

  const items = [
    { key: 'brief', as: 'link', to: '/contact', icon: <Sparkles />, title: 'Plan a project', note: 'A two-minute brief' },
    profile.whatsapp && { key: 'wa', href: whatsappLink("Hi Sahil, I'd like to discuss a project."), icon: <WhatsApp />, title: 'WhatsApp', note: 'Quick questions' },
    profile.booking && { key: 'call', href: profile.booking, icon: <Calendar />, title: 'Book a call', note: 'Pick a time' },
    { key: 'mail', href: profile.gmail, icon: <Mail />, title: 'Email me', note: profile.email },
    { key: 'cv', href: profile.cv, download: 'Sahil_CV.pdf', icon: <Download />, title: 'Download CV', note: 'PDF' },
  ].filter(Boolean);

  return (
    <div className={`dock ${shown || open ? 'is-shown' : ''} ${open ? 'is-open' : ''}`} ref={rootRef}>
      <div className="dock__menu" id="dock-menu" aria-hidden={!open}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className="dock__icon">{it.icon}</span>
              <span className="dock__text">
                <b>{it.title}</b>
                <small>{it.note}</small>
              </span>
            </>
          );
          const common = { className: 'dock__item', style: { '--i': items.length - i }, tabIndex: open ? 0 : -1 };
          return it.as === 'link' ? (
            <Link key={it.key} to={it.to} {...common}>
              {inner}
            </Link>
          ) : (
            <a
              key={it.key}
              href={it.href}
              target={it.download ? undefined : '_blank'}
              rel="noreferrer"
              download={it.download}
              {...common}
            >
              {inner}
            </a>
          );
        })}
      </div>
      <button
        type="button"
        className="dock__btn"
        aria-expanded={open}
        aria-controls="dock-menu"
        aria-label={open ? 'Close contact options' : "Let's talk"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <>
            <Close /> <span className="dock__label">Close</span>
          </>
        ) : (
          <>
            <span className="dock__pulse" aria-hidden="true" />
            <Glyph name="chat" className="dock__chat" />
            <span className="dock__label">Let's talk</span>
          </>
        )}
      </button>
    </div>
  );
}
