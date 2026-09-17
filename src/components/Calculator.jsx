import { useEffect, useRef, useState } from 'react';
import { setIntent } from '../lib/intent';
import { reducedMotion } from '../lib/motion';
import { useRouter } from '../lib/router';
import { MaskLines } from './UI';

const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', rate: 25 },
  INR: { symbol: '₹', locale: 'en-IN', rate: 400 },
  EUR: { symbol: '€', locale: 'en-IE', rate: 25 },
  GBP: { symbol: '£', locale: 'en-GB', rate: 20 },
};
const WEEKS_PER_MONTH = 4.33;

// Smoothly counts toward a value.
function useTween(value, ms = 600) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reducedMotion()) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      const v = a + (value - a) * e;
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

function Slider({ id, label, value, min, max, step = 1, suffix, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="calc__field">
      <div className="calc__label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {value}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--fill': `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function Calculator() {
  const { navigate } = useRouter();
  const [people, setPeople] = useState(3);
  const [hours, setHours] = useState(6);
  const [pct, setPct] = useState(60);
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(CURRENCIES.USD.rate);

  const cfg = CURRENCIES[currency];
  const manualMonth = people * hours * WEEKS_PER_MONTH;
  const savedMonth = manualMonth * (pct / 100);
  const savedCost = savedMonth * (Number(rate) || 0);

  const tHours = useTween(savedMonth);
  const tCost = useTween(savedCost);
  const tYear = useTween(savedCost * 12);

  const money = (v) =>
    new Intl.NumberFormat(cfg.locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

  const changeCurrency = (next) => {
    if (Number(rate) === CURRENCIES[currency].rate) setRate(CURRENCIES[next].rate);
    setCurrency(next);
  };

  const plan = () => {
    setIntent({
      services: ['automation'],
      message: `About ${people} people spend around ${hours} hours a week each on repetitive work. I'd like to automate roughly ${pct}% of it (about ${Math.round(savedMonth)} hours a month).`,
    });
    navigate('/contact');
  };

  return (
    <section className="calc-section" aria-labelledby="calc-title">
      <div className="container">
        <div className="section-head">
          <MaskLines id="calc-title" className="section-title" lines={['What could', 'automation save?']} />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            Move the sliders to match one repetitive task in your business. The numbers update instantly.
          </p>
        </div>

        <div className="calc card" data-reveal="scale">
          <div className="calc__inputs">
            <Slider id="calc-people" label="People doing this task" value={people} min={1} max={30} onChange={setPeople} />
            <Slider
              id="calc-hours"
              label="Hours each, per week"
              value={hours}
              min={1}
              max={40}
              suffix=" h"
              onChange={setHours}
            />
            <Slider
              id="calc-pct"
              label="Share that could be automated"
              value={pct}
              min={10}
              max={90}
              step={5}
              suffix="%"
              onChange={setPct}
            />
            <div className="calc__field calc__rate">
              <label htmlFor="calc-rate">Hourly cost of that time</label>
              <div className="calc__rate-row">
                <div className="calc__seg" role="group" aria-label="Currency">
                  {Object.keys(CURRENCIES).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={c === currency ? 'is-on' : ''}
                      aria-pressed={c === currency}
                      onClick={() => changeCurrency(c)}
                    >
                      {CURRENCIES[c].symbol}
                    </button>
                  ))}
                </div>
                <input
                  id="calc-rate"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="calc__results" aria-live="polite">
            <p className="calc__kicker">Time back every month</p>
            <p className="calc__big">
              {Math.round(tHours).toLocaleString(cfg.locale)}
              <span> hours</span>
            </p>

            <div className="calc__bars" aria-hidden="true">
              <div className="calc__bar">
                <span>Manual today</span>
                <i style={{ '--w': '100%' }} />
                <b>{Math.round(manualMonth)} h</b>
              </div>
              <div className="calc__bar calc__bar--after">
                <span>After automation</span>
                <i style={{ '--w': `${100 - pct}%` }} />
                <b>{Math.round(manualMonth - savedMonth)} h</b>
              </div>
            </div>

            <div className="calc__money">
              <div>
                <small>Per month</small>
                <strong>{money(tCost)}</strong>
              </div>
              <div>
                <small>Per year</small>
                <strong>{money(tYear)}</strong>
              </div>
            </div>

            <button type="button" className="btn btn--primary calc__cta" onClick={plan}>
              Plan this automation
            </button>
            <p className="calc__note">An estimate from your inputs. Real savings depend on the workflow.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
