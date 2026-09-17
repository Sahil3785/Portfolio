import { useState } from 'react';
import { profile } from '../data/content';
import BriefBuilder from './BriefBuilder';
import { whatsappLink } from './CtaBand';
import { Bolt, Calendar, Check, Clock, Copy, GitHub, LinkedIn, Mail, Shield, WhatsApp } from './Icons';
import { MaskLines } from './UI';

const PROMISES = [
  { icon: Clock, title: 'Fast response', text: 'Usually within 24 hours' },
  { icon: Bolt, title: 'Smart automations', text: 'n8n, APIs, web and AI work' },
  { icon: Shield, title: 'Secure and confidential', text: 'Your idea stays with me' },
];


export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };


  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div>
          <MaskLines
            as="h1"
            id="contact-title"
            className="section-title contact__title"
            lines={["Tell me what's", 'slowing your', 'team down.']}
          />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            Pick what you need, tell me about your tools, and I'll come back with a clear plan. Frontends, websites,
            automations, no-code platforms or database work.
          </p>

          <ul className="promises">
            {PROMISES.map(({ icon: Icon, title, text }, i) => (
              <li key={title} data-reveal style={{ '--d': `${0.1 + i * 0.08}s` }}>
                <span className="promises__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </li>
            ))}
          </ul>

          <div className="direct" data-reveal style={{ '--d': '0.2s' }}>
            <div className="direct__email">
              <a className="text-link" href={profile.gmail} target="_blank" rel="noreferrer">
                {profile.email}
              </a>
              <button type="button" className="copy-btn" onClick={copyEmail}>
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="socials">
              <a className="social" href={profile.github} target="_blank" rel="noreferrer">
                <GitHub /> GitHub
              </a>
              <a className="social" href={profile.linkedin} target="_blank" rel="noreferrer">
                <LinkedIn /> LinkedIn
              </a>
              <a className="social" href={profile.gmail} target="_blank" rel="noreferrer">
                <Mail /> Gmail
              </a>
              {profile.whatsapp && (
                <a className="social" href={whatsappLink()} target="_blank" rel="noreferrer">
                  <WhatsApp /> WhatsApp
                </a>
              )}
              {profile.booking && (
                <a className="social" href={profile.booking} target="_blank" rel="noreferrer">
                  <Calendar /> Book a call
                </a>
              )}
            </div>
          </div>
        </div>

        <BriefBuilder />
      </div>
    </section>
  );
}
