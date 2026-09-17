import { useEffect, useRef, useState } from 'react';
import { busywork } from '../../data/content';
import { clamp, easeInOut, reducedMotion, stickyProgress } from '../../lib/motion';

const ICONS = {
  mail: 'M-8 -6h16v12h-16zM-8 -6l8 6 8-6',
  sheet: 'M-7 -8h14v16h-14zM-7 -3h14M-7 2h14M-2 -8v16',
  form: 'M-7 -8h14v16h-14zM-4 -4h8M-4 0h8M-4 4h5',
  chat: 'M-8 -7h16v10h-7l-4 4v-4h-5z',
  cart: 'M-9 -7h3l2 9h10l2-7h-13M-3 6h.1M5 6h.1',
  doc: 'M-6 -8h8l4 4v12h-12zM2 -8v4h4M-3 1h6M-3 4h6',
};

const TINTS = {
  mail: '#eceeff',
  sheet: '#e3f6ee',
  form: '#fff0e6',
  chat: '#e6f7ee',
  cart: '#ffe9ef',
  doc: '#f0ecff',
};

const LAYOUTS = {
  wide: {
    w: 1000,
    h: 560,
    cols: [90, 225, 360],
    rows: [80, 210, 340, 470],
    cardScale: 1,
    hub: [560, 280],
    panel: { x: 690, y: 96, w: 290, h: 330 },
    bubble: [700, 468],
    alert: [828, 42],
    wireIn: 'M440 280 C470 280, 470 280, 498 280',
    wireOut: 'M622 280 C650 280, 660 280, 690 280',
    along: 'x',
  },
  tall: {
    w: 400,
    h: 790,
    cols: [78, 200, 322],
    rows: [50, 118, 186, 254],
    cardScale: 0.78,
    hub: [200, 380],
    panel: { x: 30, y: 480, w: 340, h: 250 },
    bubble: [30, 742],
    alert: [222, 436],
    wireIn: 'M200 290 C200 300, 200 305, 200 318',
    wireOut: 'M200 442 C200 455, 200 465, 200 480',
    along: 'y',
  },
};

// deterministic jitter so the "mess" looks the same on every visit
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildCards(layout) {
  const r = seeded(7);
  const cells = [];
  layout.rows.forEach((y) => layout.cols.forEach((x) => cells.push([x, y])));
  return busywork.cards.map((card, i) => {
    const [cx, cy] = cells[i % cells.length];
    return {
      ...card,
      x0: cx + (r() - 0.5) * 36,
      y0: cy + (r() - 0.5) * 30,
      r0: (r() - 0.5) * 32,
      order: 0,
      phase: r() * Math.PI * 2,
    };
  });
}

function orderCards(cards) {
  const r = seeded(21);
  const idx = cards.map((_, i) => i).sort(() => r() - 0.5);
  idx.forEach((cardIndex, position) => {
    cards[cardIndex].order = position;
  });
  return cards;
}

const START = 0.14;
const STAGGER = 0.027;
const TRAVEL = 0.17;

export default function Busywork() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const [tall, setTall] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState(0);
  const layout = tall ? LAYOUTS.tall : LAYOUTS.wide;
  const cards = orderCards(buildCards(layout));

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => {
      setTall(mq.matches);
      setPinned(!reducedMotion());
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const section = sectionRef.current;
    if (!svg || !section) return;
    const cardEls = [...svg.querySelectorAll('.bw-card')];
    const rowEls = [...svg.querySelectorAll('.bw-row')];
    const hub = svg.querySelector('.bw-hub');
    const count = svg.querySelector('.bw-hub__count');
    const panel = svg.querySelector('.bw-panel');
    const bubble = svg.querySelector('.bw-bubble');
    const alert = svg.querySelector('.bw-alert');
    const wireIn = svg.querySelector('.bw-wire--in');
    const wireOut = svg.querySelector('.bw-wire--out');
    const [hx, hy] = layout.hub;
    const s0 = layout.cardScale;
    let currentStep = -1;
    let lastCount = -1;

    const render = (p, time) => {
      let arrived = 0;
      let glow = 0;
      cardEls.forEach((el, i) => {
        const c = cards[i];
        const local = clamp((p - (START + c.order * STAGGER)) / TRAVEL);
        const e = easeInOut(local);
        const bob = Math.sin(time / 900 + c.phase) * 5 * (1 - e);
        const cx = layout.along === 'x' ? c.x0 + (hx - c.x0) * 0.7 : c.x0;
        const cy = layout.along === 'x' ? c.y0 : c.y0 + (hy - c.y0) * 0.7;
        const u = 1 - e;
        const x = u * u * c.x0 + 2 * u * e * cx + e * e * hx;
        const y = u * u * c.y0 + 2 * u * e * cy + e * e * hy + bob;
        const rot = c.r0 * u + Math.sin(time / 1300 + c.phase) * 2 * u;
        const sc = s0 * (1 - 0.78 * e);
        el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(3)})`);
        el.style.opacity = local < 0.72 ? 1 : Math.max(0, 1 - (local - 0.72) / 0.28);
        if (local >= 1) arrived += 1;
        if (local > 0.7 && local < 1) glow = Math.max(glow, 1 - Math.abs(local - 0.9) / 0.2);
      });

      const h = clamp((p - 0.06) / 0.12);
      const hs = 0.55 + 0.45 * (1 - Math.pow(1 - h, 3));
      hub.setAttribute('transform', `translate(${hx} ${hy}) scale(${hs.toFixed(3)})`);
      hub.style.opacity = h;
      hub.style.setProperty('--glow', glow.toFixed(2));
      if (arrived !== lastCount) {
        count.textContent = `${arrived} of ${cards.length} handled`;
        lastCount = arrived;
      }

      wireIn.classList.toggle('is-live', p > START && p < 0.62);
      wireOut.classList.toggle('is-live', p > 0.44);

      const pv = clamp((p - 0.4) / 0.1);
      panel.style.opacity = pv;
      panel.setAttribute('transform', `translate(0 ${(16 * (1 - pv)).toFixed(1)})`);

      rowEls.forEach((row, j) => {
        const local = clamp((p - (0.5 + j * 0.062)) / 0.08);
        const e = 1 - Math.pow(1 - local, 3);
        row.style.opacity = e;
        row.style.transform = `translateX(${(22 * (1 - e)).toFixed(1)}px)`;
        row.classList.toggle('is-done', local >= 1);
      });

      const b = clamp((p - 0.86) / 0.05);
      bubble.style.opacity = b;
      bubble.style.transform = `scale(${(0.7 + 0.3 * b).toFixed(3)})`;
      const a = clamp((p - 0.91) / 0.05);
      alert.style.opacity = a;
      alert.style.transform = `scale(${(0.7 + 0.3 * a).toFixed(3)})`;

      const nextStep = p < 0.34 ? 0 : p < 0.66 ? 1 : 2;
      if (nextStep !== currentStep) {
        currentStep = nextStep;
        setStep(nextStep);
      }
      section.style.setProperty('--bw-p', p.toFixed(3));
    };

    if (reducedMotion()) {
      render(1, 0);
      return;
    }

    let raf;
    let visible = false;
    const loop = (now) => {
      if (!visible) return;
      const p = pinned ? stickyProgress(section, window.innerHeight) : 1;
      render(p, now);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(loop);
    });
    io.observe(section);
    render(0, 0);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // cards are derived from layout, which is covered by `tall`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tall, pinned]);

  const { panel } = layout;
  const rowH = (panel.h - 72) / busywork.rows.length;

  return (
    <section
      className={`bw ${pinned ? 'is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="bw-title"
    >
      <div className="bw__sticky">
        <div className="container bw__grid">
          <div className="bw__copy">
            <h2 id="bw-title" className="sr-only">
              From busywork to a working system
            </h2>
            <div className="bw__progress" aria-hidden="true">
              <ol className="bw__steps">
                {busywork.steps.map((s, i) => (
                  <li key={s.label} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                    {s.label}
                  </li>
                ))}
              </ol>
              <span className="bw__track">
                <span />
              </span>
            </div>
            <div className="bw__captions">
              {busywork.steps.map((s, i) => (
                <div key={s.label} className={`bw__caption ${i === step ? 'is-active' : ''}`} aria-hidden={pinned && i !== step}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bw__stage">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${layout.w} ${layout.h}`}
              role="img"
              aria-label="Scattered emails, spreadsheets, forms and messages flow into an automation hub and come out as organised records."
            >
              <defs>
                <linearGradient id="bw-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff7a3d" />
                  <stop offset=".5" stopColor="#ff5e7e" />
                  <stop offset="1" stopColor="#7b6cff" />
                </linearGradient>
                <radialGradient id="bw-glow">
                  <stop offset="0" stopColor="#ff7a3d" stopOpacity=".55" />
                  <stop offset="1" stopColor="#ff7a3d" stopOpacity="0" />
                </radialGradient>
              </defs>

              <path className="bw-wire bw-wire--in" d={layout.wireIn} />
              <path className="bw-wire bw-wire--out" d={layout.wireOut} />

              {/* output panel */}
              <g className="bw-panel">
                <rect className="bw-panel__box" x={panel.x} y={panel.y} width={panel.w} height={panel.h} rx="18" />
                <g transform={`translate(${panel.x + 18} ${panel.y + 28})`}>
                  <rect className="bw-panel__ic" x="0" y="-11" width="22" height="22" rx="6" />
                  <path className="bw-panel__icp" d="M5 -5h12v10h-12zM5 -1h12M10 -5v10" />
                  <text className="bw-panel__title" x="32" y="5">
                    Airtable
                  </text>
                </g>
                <g transform={`translate(${panel.x + panel.w - 84} ${panel.y + 16})`}>
                  <rect className="bw-panel__chip" width="66" height="24" rx="12" />
                  <text className="bw-panel__chiptext" x="33" y="16">
                    synced
                  </text>
                </g>
                <line className="bw-panel__rule" x1={panel.x} x2={panel.x + panel.w} y1={panel.y + 56} y2={panel.y + 56} />
                {busywork.rows.map((label, j) => (
                  <g key={label} transform={`translate(${panel.x + 16} ${panel.y + 64 + j * rowH})`}>
                    <g className="bw-row">
                      <circle className="bw-row__dot" cx="6" cy={rowH / 2} r="4" />
                      <text className="bw-row__text" x="20" y={rowH / 2 + 4}>
                        {label}
                      </text>
                      <g transform={`translate(${panel.w - 48} ${rowH / 2})`} className="bw-row__check">
                        <circle r="9" />
                        <path d="M-4 0l2.6 2.6L4 -3" />
                      </g>
                    </g>
                  </g>
                ))}
              </g>

              {/* hub */}
              <g className="bw-hub" style={{ opacity: 0 }}>
                <circle className="bw-hub__glow" r="120" fill="url(#bw-glow)" />
                <g className="bw-hub__ring">
                  <circle r="78" />
                </g>
                <circle className="bw-hub__core" r="62" />
                <circle className="bw-hub__edge" r="62" />
                <g transform="translate(0 -18)">
                  <path className="bw-hub__icon" d="M-14 -9h8v7h-8zM6 3h8v7h-8zM-6 -5.5h5a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3h1" />
                </g>
                <text className="bw-hub__label" y="14">
                  Workflow
                </text>
                <text className="bw-hub__count" y="32">
                  0 of 12 handled
                </text>
              </g>

              {/* chaos cards */}
              {cards.map((c, i) => (
                <g key={i} className="bw-card" transform={`translate(${c.x0} ${c.y0}) rotate(${c.r0}) scale(${layout.cardScale})`}>
                  <rect className="bw-card__box" x="-75" y="-30" width="150" height="60" rx="14" />
                  <circle cx="-47" cy="0" r="17" fill={TINTS[c.icon]} />
                  <path className="bw-card__icon" transform="translate(-47 0)" d={ICONS[c.icon]} />
                  <text className="bw-card__label" x="-23" y="-2">
                    {c.label}
                  </text>
                  <rect className="bw-card__line" x="-23" y="8" width="62" height="5" rx="2.5" />
                </g>
              ))}

              {/* extras */}
              <g transform={`translate(${layout.bubble[0]} ${layout.bubble[1]})`}>
                <g className="bw-bubble">
                  <rect width="176" height="44" rx="16" />
                  <path className="bw-bubble__icon" d="M16 15h14v10h-6l-4 3v-3h-4z" />
                  <text x="40" y="27">
                    Reply sent on WhatsApp
                  </text>
                </g>
              </g>
              <g transform={`translate(${layout.alert[0]} ${layout.alert[1]})`}>
                <g className="bw-alert">
                  <rect width="152" height="34" rx="17" />
                  <circle cx="18" cy="17" r="4.5" />
                  <text x="30" y="21">
                    1 retry, recovered
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
