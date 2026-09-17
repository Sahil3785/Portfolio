import { useEffect, useState } from 'react';
import { WEB3FORMS_KEY, briefOptions, profile, serviceFor, services } from '../data/content';
import { clearIntent, peekIntent } from '../lib/intent';
import { whatsappLink } from './CtaBand';
import { ArrowRight, Check, Glyph, Mail, WhatsApp } from './Icons';
import { RollLabel } from './UI';

const IS_PREVIEW = typeof window !== 'undefined' && window.__BWS_PREVIEW__ === true;
const STEPS = ['What you need', 'Your project', 'Your details'];

function Chips({ options, value, onToggle, multi = true, name }) {
  return (
    <div className="bb__chips" role="group" aria-label={name}>
      {options.map((opt) => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const label = typeof opt === 'string' ? opt : opt.title;
        const on = multi ? value.includes(id) : value === id;
        return (
          <button
            key={id}
            type="button"
            className={`bb__chip ${on ? 'is-on' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(id)}
          >
            {typeof opt !== 'string' && opt.glyph && <Glyph name={opt.glyph} />}
            {label}
            <span className="bb__chip-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function BriefBuilder() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(() => {
    const intent = peekIntent();
    return intent && Array.isArray(intent.services) ? intent.services.filter((id) => serviceFor(id)) : [];
  });
  const [tools, setTools] = useState([]);
  const [size, setSize] = useState('');
  const [timeline, setTimeline] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(() => {
    const intent = peekIntent();
    return (intent && intent.message) || '';
  });
  const [state, setState] = useState('idle'); // idle | sending | success | error | preview
  const [error, setError] = useState('');

  useEffect(() => clearIntent('services', 'message'), []);

  const toggle = (list, setList) => (id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const serviceNames = picked.map((id) => serviceFor(id)?.title).filter(Boolean);

  const summary = [
    `Services: ${serviceNames.join(', ') || 'Not chosen yet'}`,
    tools.length ? `Tools we use: ${tools.join(', ')}` : '',
    size ? `Project size: ${size}` : '',
    timeline ? `Timeline: ${timeline}` : '',
    message ? `Details: ${message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const next = () => {
    if (step === 0 && picked.length === 0) {
      setError('Pick at least one service to continue.');
      return;
    }
    setError('');
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Add your name and a valid email so I can reply.');
      return;
    }
    setError('');
    if (IS_PREVIEW) {
      setState('preview');
      return;
    }
    setState('sending');
    const data = new FormData();
    data.append('access_key', WEB3FORMS_KEY);
    data.append('subject', `New project brief from ${name}`);
    data.append('from_name', 'buildwithsahil portfolio');
    data.append('name', name);
    data.append('email', email);
    data.append('services', serviceNames.join(', '));
    data.append('tools', tools.join(', '));
    data.append('project_size', size);
    data.append('timeline', timeline);
    data.append('message', message);
    data.append('botcheck', e.currentTarget.botcheck.checked ? 'on' : '');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Submission failed');
      setState('success');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Project brief')}&body=${encodeURIComponent(
    `${summary}\n\nName: ${name}\nEmail: ${email}`
  )}`;
  const wa = whatsappLink(`Hi Sahil, here is my project brief.\n\n${summary}`);

  if (state === 'success') {
    return (
      <div className="bb card bb--done" role="status">
        <span className="bb__done-icon" aria-hidden="true">
          <Check />
        </span>
        <h2 className="bb__title">Brief received, thank you{name ? `, ${name.split(' ')[0]}` : ''}.</h2>
        <p className="bb__sub">I'll reply to {email} within 24 hours with next steps.</p>
        <pre className="bb__recap">{summary}</pre>
      </div>
    );
  }

  return (
    <form className="bb card" onSubmit={submit} noValidate>
      <div className="bb__top">
        <h2 className="bb__title">Build your project brief</h2>
        <p className="bb__sub">Three quick steps, about two minutes.</p>
        <ol className="bb__progress" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li key={label} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
              <span className="bb__node">{i < step ? <Check /> : i + 1}</span>
              <span className="bb__step-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="bb__body" key={step}>
        {step === 0 && (
          <fieldset className="bb__set">
            <legend>What do you need help with?</legend>
            <p className="bb__hint">Choose one or more.</p>
            <Chips options={services} value={picked} onToggle={toggle(picked, setPicked)} name="Services" />
          </fieldset>
        )}

        {step === 1 && (
          <>
            <fieldset className="bb__set">
              <legend>Which tools do you use today?</legend>
              <p className="bb__hint">Optional, but it helps me plan the integration.</p>
              <Chips options={briefOptions.tools} value={tools} onToggle={toggle(tools, setTools)} name="Tools" />
            </fieldset>
            <fieldset className="bb__set">
              <legend>How big is it?</legend>
              <Chips options={briefOptions.size} value={size} multi={false} onToggle={(v) => setSize(v === size ? '' : v)} name="Project size" />
            </fieldset>
            <fieldset className="bb__set">
              <legend>When do you want to start?</legend>
              <Chips
                options={briefOptions.timeline}
                value={timeline}
                multi={false}
                onToggle={(v) => setTimeline(v === timeline ? '' : v)}
                name="Timeline"
              />
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form__row">
              <div className="field">
                <label htmlFor="bb-name">Full name</label>
                <input id="bb-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="bb-email">Email address</label>
                <input
                  id="bb-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="bb-msg">Tell me about the work</label>
              <textarea
                id="bb-msg"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What slows your team down, or what should the finished thing do?"
              />
            </div>
          </>
        )}
      </div>

      <div className="bb__summary" aria-live="polite">
        <p className="card__label">Your brief so far</p>
        <ul>
          {serviceNames.length === 0 && <li className="bb__empty">Pick a service to start.</li>}
          {serviceNames.map((s) => (
            <li key={s} className="bb__tag bb__tag--svc">
              {s}
            </li>
          ))}
          {tools.map((t) => (
            <li key={t} className="bb__tag">
              {t}
            </li>
          ))}
          {size && <li className="bb__tag">{size}</li>}
          {timeline && <li className="bb__tag">{timeline}</li>}
        </ul>
      </div>

      {error && (
        <p className="bb__error" role="alert">
          {error}
        </p>
      )}

      <div className="bb__nav">
        {step > 0 ? (
          <button type="button" className="btn btn--ghost btn--sm" onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="submit" className="btn btn--primary">
            <RollLabel>Next step</RollLabel>
            <ArrowRight />
          </button>
        ) : (
          <button type="submit" className="btn btn--primary" disabled={state === 'sending'}>
            <RollLabel>{state === 'sending' ? 'Sending...' : 'Send brief'}</RollLabel>
          </button>
        )}
      </div>

      {step === STEPS.length - 1 && (
        <div className="bb__alt">
          <span>Prefer another way?</span>
          <a href={mailto}>
            <Mail /> Email it
          </a>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer">
              <WhatsApp /> Send on WhatsApp
            </a>
          )}
        </div>
      )}

      <p className={`form__status ${state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
        {state === 'error' && (
          <span>
            The brief didn't go through. Email me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </span>
        )}
        {state === 'preview' && 'This is a design preview, so sending is switched off here. It works on your live site.'}
      </p>
    </form>
  );
}
