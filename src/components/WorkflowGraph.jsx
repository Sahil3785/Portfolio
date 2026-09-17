import { useEffect, useRef, useState } from 'react';
import { easeInOut, reducedMotion, wait, watchVisibility } from '../lib/motion';

const W = 124;
const H = 62;

const ICONS = {
  hook: 'M-5 0h7M-1 -3.5 2.5 0-1 3.5M3.5 -5.5h2v11h-2',
  check: 'M-4.5 0.5l3 3 6-6.5',
  spark: 'M0 -6v3.2M0 2.8V6M-6 0h3.2M2.8 0H6M-4 -4l1.8 1.8M2.2 2.2 4 4M4 -4 2.2 -2.2M-2.2 2.2-4 4',
  table: 'M-5.5 -4.5h11v9h-11zM-5.5 -1h11M-1.5 -4.5v9',
  chat: 'M-5.5 -4.5h11v7H0l-3.5 3v-3h-2z',
  clock: 'M0 -5.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11M0 -3v3l2.2 1.6',
  fetch: 'M0 -5.5v7.5M-3.2 -1 0 2l3.2-3M-5.5 5.2h11',
  diff: 'M-3.5 -5v10M3.5 -5v10M-6 -2.5l2.5-2.5 2.5 2.5M1 2.5l2.5 2.5 2.5-2.5',
  bell: 'M-4.5 2.5V0a4.5 4.5 0 0 1 9 0v2.5l1.5 1.5h-12zM-1.6 5.8h3.2',
};

export const HERO_FLOW = {
  name: 'lead-intake',
  width: 646,
  height: 300,
  nodes: [
    { id: 'hook', x: 0, y: 119, label: 'Webhook', sub: 'POST /lead', icon: 'hook' },
    { id: 'check', x: 174, y: 119, label: 'Validate', sub: 'check fields', icon: 'check' },
    { id: 'ai', x: 348, y: 119, label: 'AI enrich', sub: 'score + tag', icon: 'spark' },
    { id: 'crm', x: 522, y: 26, label: 'Airtable', sub: 'upsert row', icon: 'table' },
    { id: 'wa', x: 522, y: 212, label: 'WhatsApp', sub: 'send reply', icon: 'chat' },
  ],
  stages: [[['hook', 'check']], [['check', 'ai']], [['ai', 'crm'], ['ai', 'wa']]],
  vertical: { width: 300, height: 374, pos: { hook: [88, 0], check: [88, 100], ai: [88, 200], crm: [8, 312], wa: [168, 312] } },
  log: {
    hook: (r) => `lead_${r.id} received`,
    check: () => 'payload valid',
    ai: (r) => `scored ${r.score}, tagged ${r.tag}`,
    crm: () => 'row upserted',
    wa: () => 'reply sent',
  },
  fail: { every: 4, at: 'check', msg: 'rejected, missing email' },
  seed: 'lead-intake deployed',
};

export const ENGINE_FLOW = {
  name: 'crm-audit',
  width: 646,
  height: 300,
  nodes: [
    { id: 'cron', x: 0, y: 119, label: 'Schedule', sub: 'every 15 min', icon: 'clock' },
    { id: 'pull', x: 174, y: 119, label: 'Fetch CRM', sub: 'GET contacts', icon: 'fetch' },
    { id: 'audit', x: 348, y: 119, label: 'Audit', sub: 'dedupe rows', icon: 'diff' },
    { id: 'sync', x: 522, y: 26, label: 'Airtable', sub: 'sync changes', icon: 'table' },
    { id: 'alert', x: 522, y: 212, label: 'Alert', sub: 'flag issues', icon: 'bell' },
  ],
  stages: [
    [['cron', 'pull']],
    [['pull', 'audit']],
    [['audit', 'sync'], ['audit', 'alert', (n) => n % 3 === 0]],
  ],
  vertical: { width: 300, height: 374, pos: { cron: [88, 0], pull: [88, 100], audit: [88, 200], sync: [8, 312], alert: [168, 312] } },
};

const byId = (nodes) => Object.fromEntries(nodes.map((n) => [n.id, n]));

function edgePath(a, b, vertical) {
  if (vertical) {
    const sx = a.x + W / 2;
    const sy = a.y + H;
    const tx = b.x + W / 2;
    const ty = b.y;
    const d = Math.max(18, (ty - sy) * 0.6);
    return `M${sx} ${sy} C${sx} ${sy + d}, ${tx} ${ty - d}, ${tx} ${ty}`;
  }
  const sx = a.x + W;
  const sy = a.y + H / 2;
  const tx = b.x;
  const ty = b.y + H / 2;
  const d = Math.max(24, (tx - sx) * 0.6);
  return `M${sx} ${sy} C${sx + d} ${sy}, ${tx - d} ${ty}, ${tx} ${ty}`;
}

const TAGS = ['hot', 'warm', 'b2b', 'retail'];
const clock = () => new Date().toTimeString().slice(0, 8);

export default function WorkflowGraph({ flow = HERO_FLOW, active = true, bare = false, title }) {
  const rootRef = useRef(null);
  const nodeRefs = useRef({});
  const pathRefs = useRef({});
  const edgeRefs = useRef({});
  const packetRefs = useRef({});
  const [on, setOn] = useState(false);
  const [lines, setLines] = useState(() =>
    flow.seed ? [{ key: 0, t: clock(), node: 'system', msg: flow.seed, state: 'ok' }] : []
  );

  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    if (!flow.vertical) return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setVertical(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [flow]);

  const layoutNodes = flow.nodes.map((n) =>
    vertical && flow.vertical ? { ...n, x: flow.vertical.pos[n.id][0], y: flow.vertical.pos[n.id][1] } : n
  );
  const nodes = byId(layoutNodes);
  const edges = flow.stages.flat();
  const width = vertical ? flow.vertical.width : flow.width;
  const height = vertical ? flow.vertical.height : flow.height;

  useEffect(() => {
    if (!active) return;
    setOn(true);
    if (reducedMotion()) return;

    let cancelled = false;
    let visible = true;
    let lineKey = 1;
    const stopWatching = watchVisibility(rootRef.current, (v) => (visible = v));

    const log = (node, msg, state = 'ok') => {
      if (!flow.log) return;
      const entry = { key: lineKey++, t: clock(), node, msg, state };
      setLines((prev) => [...prev.slice(-5), entry]);
    };

    const hit = (id, state = 'ok') => {
      const g = nodeRefs.current[id];
      if (!g) return;
      g.classList.remove('is-hit', 'is-fail');
      void g.getBoundingClientRect(); // restart the CSS animation
      g.classList.add(state === 'fail' ? 'is-fail' : 'is-hit');
      setTimeout(() => g.classList.remove('is-hit', 'is-fail'), 900);
    };

    const travel = (key, duration) =>
      new Promise((resolve) => {
        const path = pathRefs.current[key];
        const packet = packetRefs.current[key];
        const edge = edgeRefs.current[key];
        if (!path || !packet) return resolve();
        const length = path.getTotalLength();
        const t0 = performance.now();
        const parts = [...packet.children];
        parts.forEach((c) => c.classList.add('is-moving'));
        edge.classList.add('is-live');
        path.classList.add('is-live');

        const step = (now) => {
          if (cancelled) return resolve();
          const p = Math.min(1, (now - t0) / duration);
          const pt = path.getPointAtLength(easeInOut(p) * length);
          packet.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
          if (p < 1) {
            requestAnimationFrame(step);
          } else {
            parts.forEach((c) => c.classList.remove('is-moving'));
            edge.classList.remove('is-live');
            path.classList.remove('is-live');
            resolve();
          }
        };
        requestAnimationFrame(step);
      });

    const label = (id) => (nodes[id] ? nodes[id].label.toLowerCase() : id);
    const message = (id, run) => (flow.log && flow.log[id] ? flow.log[id](run) : '');

    const runOnce = async (n) => {
      const run = {
        id: 1040 + n,
        score: (0.62 + Math.random() * 0.35).toFixed(2),
        tag: TAGS[n % TAGS.length],
      };
      const failing = flow.fail && n % flow.fail.every === 0;
      const first = flow.stages[0][0][0];
      hit(first);
      log(label(first), message(first, run));
      await wait(260);

      for (const stage of flow.stages) {
        if (cancelled) return;
        const live = stage.filter((e) => !e[2] || e[2](n));
        await Promise.all(live.map(([a, b]) => travel(`${a}>${b}`, 820)));
        if (cancelled) return;
        for (const [, b] of live) {
          if (failing && b === flow.fail.at) {
            hit(b, 'fail');
            log(label(b), flow.fail.msg, 'bad');
            return;
          }
          hit(b);
          log(label(b), message(b, run));
        }
        await wait(200);
      }
    };

    (async () => {
      await wait(1500);
      let n = 1;
      while (!cancelled) {
        while (!visible && !cancelled) await wait(300);
        if (cancelled) break;
        await runOnce(n);
        n += 1;
        await wait(1100);
      }
    })();

    return () => {
      cancelled = true;
      stopWatching();
    };
    // flow objects are static module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, flow]);

  const vb = `-6 -6 ${width + 12} ${height + 12}`;

  return (
    <div className={`flow ${bare ? 'flow--bare' : ''} ${on ? 'is-on' : ''}`} ref={rootRef}>
      {!bare && (
        <div className="flow__bar">
          <span className="flow__name">
            <span className="mono">{title || `${flow.name}.flow`}</span>
          </span>
          <span className="flow__live">Live</span>
        </div>
      )}

      <svg viewBox={vb} role="img" aria-label={`Automation workflow: ${flow.nodes.map((n) => n.label).join(', ')}`}>
        <g>
          {edges.map(([a, b], i) => {
            const key = `${a}>${b}`;
            const d = edgePath(nodes[a], nodes[b], vertical);
            return (
              <g key={key}>
                <path className="flow__edge-glow" d={d} ref={(el) => (pathRefs.current[key] = el)} />
                <path
                  className="flow__edge flow__draw"
                  d={d}
                  pathLength="1"
                  style={{ '--i': i }}
                  ref={(el) => (edgeRefs.current[key] = el)}
                />
              </g>
            );
          })}
        </g>

        {layoutNodes.map((n, i) => (
          <g
            key={n.id}
            className="flow__node"
            style={{ '--i': i }}
            ref={(el) => (nodeRefs.current[n.id] = el)}
            transform={`translate(${n.x} ${n.y})`}
          >
            <rect className="flow__halo" width={W} height={H} rx="14" />
            <rect className="flow__box" width={W} height={H} rx="14" />
            <circle className="flow__port" cx={vertical ? W / 2 : 0} cy={vertical ? 0 : H / 2} r="3.5" />
            <circle className="flow__port" cx={vertical ? W / 2 : W} cy={vertical ? H : H / 2} r="3.5" />
            <g transform={`translate(22 ${H / 2})`}>
              <circle className="flow__icon-bg" r="13" />
              <path className="flow__icon" d={ICONS[n.icon]} />
            </g>
            <text className="flow__label" x="42" y="27">
              {n.label}
            </text>
            <text className="flow__sub" x="42" y="45">
              {n.sub}
            </text>
          </g>
        ))}

        {edges.map(([a, b]) => {
          const key = `${a}>${b}`;
          return (
            <g key={key} ref={(el) => (packetRefs.current[key] = el)}>
              <circle className="flow__packet-glow" r="9" />
              <circle className="flow__packet" r="4.5" />
            </g>
          );
        })}
      </svg>

      {flow.log && (
        <ol className="flow__log" aria-hidden="true">
          {lines.map((l) => (
            <li key={l.key}>
              <span className="t">{l.t}</span>
              <span className="n">{l.node}</span>
              <span className={l.state === 'bad' ? 'bad' : 'm'}>
                {l.state === 'bad' ? '\u2715 ' : ''}
                {l.msg}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
