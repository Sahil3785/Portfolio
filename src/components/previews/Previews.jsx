import { useEffect, useRef, useState } from 'react';
import { reducedMotion, watchVisibility } from '../../lib/motion';
import { Cart, Lock } from '../Icons';
import WorkflowGraph, { ENGINE_FLOW } from '../WorkflowGraph';

// Ticks a counter on an interval, but only while the element is on screen.
function useTicker(ref, ms) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    let timer = null;
    const stop = watchVisibility(ref.current, (visible) => {
      if (visible && !timer) {
        timer = setInterval(() => setTick((t) => t + 1), ms);
      } else if (!visible && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    return () => {
      stop();
      clearInterval(timer);
    };
  }, [ref, ms]);
  return tick;
}

function useOnScreen(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => watchVisibility(ref.current, setOn), [ref]);
  return on;
}

function BrowserBar({ url }) {
  return (
    <div className="pv__bar" aria-hidden="true">
      <i />
      <i />
      <i />
      <span className="pv__url">{url}</span>
    </div>
  );
}

/* ---------- Workflow Engine ---------- */

export function WorkflowPreview() {
  const ref = useRef(null);
  const on = useOnScreen(ref);
  return (
    <div className="pv" ref={ref} style={{ padding: '14px 14px 10px' }}>
      <WorkflowGraph flow={ENGINE_FLOW} active={on} bare />
    </div>
  );
}

/* ---------- Shopify storefront + theme editor ---------- */

const SECTIONS = ['Header', 'Image banner', 'Featured collection', 'Newsletter'];

export function StorefrontPreview() {
  const ref = useRef(null);
  const tick = useTicker(ref, 1500);
  const step = tick % 4; // 0 banner, 1 collection, 2 add to cart, 3 newsletter
  const cartCount = 2 + Math.floor((tick + 1) / 4);
  const focusSection = [1, 2, 2, 3][step];

  return (
    <div className="pv" ref={ref} aria-hidden="true">
      <BrowserBar url="theme-editor / home" />
      <div className="sf">
        <div className="sf__side">
          <h5>Sections</h5>
          {SECTIONS.map((s, i) => (
            <div key={s} className={`sf__sec ${focusSection === i ? 'is-on' : ''}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="sf__page">
          <div className="sf__block sf__head">
            <span className="sf__logo">demo.store</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <span className="ln" style={{ width: 22 }} />
              <span className="ln" style={{ width: 18 }} />
            </span>
            <span className="sf__cart">
              <Cart width="18" height="18" />
              <span key={cartCount} className={`sf__badge ${step === 2 ? 'is-bump' : ''}`}>
                {cartCount}
              </span>
            </span>
          </div>
          <div className={`sf__block sf__banner ${focusSection === 1 ? 'is-on' : ''}`}>
            <span className="ln" style={{ width: '58%', height: 8 }} />
            <span className="ln" style={{ width: '36%' }} />
            <span className="sf__pill" />
          </div>
          <div className={`sf__block sf__grid ${focusSection === 2 ? 'is-on' : ''}`}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={`sf__tile ${step === 2 && i === 1 ? 'is-buy' : ''}`}>
                <div className="sf__img">
                  <i />
                </div>
                <span className="ln" style={{ width: '80%', height: 4 }} />
                <span className="ln" style={{ width: '40%', height: 4, background: 'var(--haze-dim)' }} />
                <span className="sf__add">{step === 2 && i === 1 ? 'Added' : 'Add to cart'}</span>
              </div>
            ))}
          </div>
          <div className={`sf__block sf__news ${focusSection === 3 ? 'is-on' : ''}`}>
            <span className="ln" />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Role-based access portal ---------- */

const CLIENTS = [
  { w: '62%', status: 'Active' },
  { w: '48%', status: 'Active' },
  { w: '70%', status: 'Review' },
  { w: '54%', status: 'Active' },
];

export function PortalPreview() {
  const ref = useRef(null);
  const tick = useTicker(ref, 2600);
  const role = tick % 2 === 0 ? 'admin' : 'viewer';

  return (
    <div className="pv" ref={ref} aria-hidden="true">
      <BrowserBar url="portal.internal / clients" />
      <div className="pt" data-role={role}>
        <div className="pt__rail">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="pt__main">
          <div className="pt__top">
            <span className="pt__title">Clients</span>
            <span className="pt__roles">
              <i className="pt__thumb" />
              <span className={role === 'admin' ? 'is-on' : ''}>Admin</span>
              <span className={role === 'viewer' ? 'is-on' : ''}>Viewer</span>
            </span>
          </div>
          <div className="pt__token">
            <b>Bearer</b> eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoi{role}
            <em>verified</em>
          </div>
          {CLIENTS.map((c, i) => (
            <div className="pt__row" key={i}>
              <span className="pt__avatar" />
              <span style={{ display: 'grid', gap: 4 }}>
                <span className="ln" style={{ width: c.w, height: 5 }} />
                <span className="ln pt__secret" style={{ width: '38%', height: 4, background: 'var(--haze-dim)' }} />
              </span>
              <span className={`pt__chip ${c.status === 'Review' ? 'is-warn' : ''}`}>{c.status}</span>
              <span className="pt__act">
                <Lock />
                Edit
              </span>
            </div>
          ))}
          <div className="pt__toast">
            <i />
            {role === 'admin' ? 'Full access, 4 actions available' : 'Read only, edits and contact data hidden'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Integrations hub event stream ---------- */

const EVENTS = [
  { src: 'CR', name: 'contact.updated' },
  { src: 'FM', name: 'form.submitted' },
  { src: 'ST', name: 'order.created' },
  { src: 'WA', name: 'message.received' },
  { src: 'CR', name: 'deal.won' },
  { src: 'ST', name: 'refund.issued' },
];

const ROW_GAP = 38;

export function HubPreview() {
  const ref = useRef(null);
  const tick = useTicker(ref, 1150);
  const [rows, setRows] = useState(() =>
    [3, 2, 1, 0].map((i) => ({ id: i, ev: EVENTS[i % EVENTS.length], status: 'ok', attempt: 0 }))
  );
  const idRef = useRef(4);

  useEffect(() => {
    if (tick === 0) return;
    setRows((prev) => {
      // resolve rows that were retrying
      const next = prev.map((r) => {
        if (r.status === 'retry' && r.attempt >= 2) return { ...r, status: 'ok' };
        if (r.status === 'retry') return { ...r, attempt: r.attempt + 1 };
        if (r.status === 'queued') return { ...r, status: 'ok' };
        return r;
      });
      const id = idRef.current++;
      const status = id % 5 === 0 ? 'retry' : id % 7 === 0 ? 'queued' : 'ok';
      return [{ id, ev: EVENTS[id % EVENTS.length], status, attempt: 1, fresh: true }, ...next.map((r) => ({ ...r, fresh: false }))].slice(0, 6);
    });
  }, [tick]);

  return (
    <div className="pv" ref={ref} aria-hidden="true">
      <BrowserBar url="hub.internal / events" />
      <div className="hb">
        <div className="hb__top">
          <span className="hb__title">Live events</span>
          <span className="hb__legend">
            <span style={{ '--c': 'var(--ok)' }}>delivered</span>
            <span style={{ '--c': 'var(--signal)' }}>retrying</span>
          </span>
        </div>
        <div className="hb__list">
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={`hb__row ${r.fresh ? 'is-new' : ''} ${r.status === 'retry' ? 'is-retry' : ''}`}
              style={{ transform: `translateY(${i * ROW_GAP}px)`, opacity: i > 4 ? 0 : 1 }}
            >
              <span className="hb__src">{r.ev.src}</span>
              <span className="hb__evt">
                {r.ev.name}
                <small>evt_{7310 + r.id}</small>
              </span>
              {r.status === 'ok' && <span className="hb__status ok">delivered</span>}
              {r.status === 'queued' && <span className="hb__status queued">queued</span>}
              {r.status === 'retry' && (
                <span className="hb__status retry">
                  <span className="spin" />
                  retry {r.attempt}/3
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- No-code builder ---------- */

const BLOCKS = ['Header', 'Table', 'Form', 'Chart'];

export function NoCodePreview() {
  const ref = useRef(null);
  const tick = useTicker(ref, 1100);
  const step = reducedMotion() ? 6 : tick % 7; // 0 empty, 1-4 blocks, 5 publish, 6 live
  const placed = Math.min(4, step);
  const live = step >= 5;

  return (
    <div className="pv" ref={ref} aria-hidden="true">
      <BrowserBar url="builder / client-portal" />
      <div className="nc">
        <div className="nc__side">
          <h5>Blocks</h5>
          {BLOCKS.map((b, i) => (
            <div key={b} className={`nc__item ${step >= 1 && placed - 1 === i && !live ? 'is-drag' : ''}`}>
              <i />
              {b}
            </div>
          ))}
        </div>
        <div className="nc__canvas">
          <div className="nc__top">
            <span className="nc__name">Client portal</span>
            <span className={`nc__publish ${step === 5 ? 'is-press' : ''} ${live ? 'is-live' : ''}`}>
              {live ? 'Live' : 'Publish'}
            </span>
          </div>
          <div className="nc__grid">
            <div className={`nc__slot nc__slot--wide ${placed >= 1 ? 'is-filled' : ''}`}>
              {placed >= 1 && (
                <div className="nc__block nc__header">
                  <span className="ln" style={{ width: '38%', height: 7 }} />
                  <span className="nc__avatar" />
                </div>
              )}
            </div>
            <div className={`nc__slot nc__slot--wide ${placed >= 2 ? 'is-filled' : ''}`}>
              {placed >= 2 && (
                <div className="nc__block nc__table">
                  {[70, 52, 64].map((w, i) => (
                    <div key={i} className="nc__row">
                      <span className="ln" style={{ width: `${w}%` }} />
                      <span className="nc__pill" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={`nc__slot ${placed >= 3 ? 'is-filled' : ''}`}>
              {placed >= 3 && (
                <div className="nc__block nc__form">
                  <span className="nc__input" />
                  <span className="nc__input" />
                  <span className="nc__btn" />
                </div>
              )}
            </div>
            <div className={`nc__slot ${placed >= 4 ? 'is-filled' : ''}`}>
              {placed >= 4 && (
                <div className="nc__block nc__chart">
                  {[40, 70, 55, 85, 62].map((h, i) => (
                    <i key={i} style={{ height: `${h}%`, '--k': i }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Two-way database sync ---------- */

const RECORDS = ['Acme Ltd', 'Nova Studio', 'Peak Retail', 'Orbit Labs'];

export function SyncPreview() {
  const ref = useRef(null);
  const tick = useTicker(ref, 1400);
  const row = tick % RECORDS.length;
  const toRight = tick % 2 === 0;

  const table = (name, side) => (
    <div className="sy__table">
      <div className="sy__head">
        <i className={`sy__logo sy__logo--${side}`} />
        {name}
      </div>
      {RECORDS.map((r, i) => {
        const source = (toRight && side === 'l') || (!toRight && side === 'r');
        const hit = tick > 0 && i === row;
        return (
          <div key={r} className={`sy__row ${hit ? (source ? 'is-src' : 'is-dst') : ''}`}>
            <span className="sy__name">{r}</span>
            <span className="sy__val">{hit && !source ? 'updated' : 'synced'}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="pv" ref={ref} aria-hidden="true">
      <BrowserBar url="sync / contacts" />
      <div className="sy">
        {table('Airtable', 'l')}
        <div className="sy__mid">
          <span className="sy__line" />
          <span className="sy__hub">
            <svg viewBox="0 0 24 24">
              <path d="M5 9a7 7 0 0 1 12-3l2 2M19 15a7 7 0 0 1-12 3l-2-2M19 4v4h-4M5 20v-4h4" />
            </svg>
          </span>
          <span className="sy__label">2-way</span>
          {tick > 0 && (
            <span
              key={tick}
              className={`sy__packet ${toRight ? 'to-r' : 'to-l'}`}
              style={{ '--row': row }}
            />
          )}
        </div>
        {table('Supabase', 'r')}
      </div>
    </div>
  );
}

export const PREVIEWS = {
  workflow: WorkflowPreview,
  storefront: StorefrontPreview,
  portal: PortalPreview,
  hub: HubPreview,
  nocode: NoCodePreview,
  sync: SyncPreview,
};
