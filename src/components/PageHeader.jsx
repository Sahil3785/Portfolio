import { reducedMotion } from '../lib/motion';
import { Link } from '../lib/router';
import { MaskLines } from './UI';

function WireArt() {
  const still = reducedMotion();
  return (
    <svg className="phead__art" viewBox="0 0 320 200" aria-hidden="true">
      <defs>
        <linearGradient id="phead-wire" x1="0" x2="1">
          <stop offset="0" stopColor="var(--wire)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <path id="phead-path" className="phead__wire" d="M30 150 C110 150, 90 50, 170 50 S 250 130, 290 70" />
      <path className="phead__wire phead__wire--live" d="M30 150 C110 150, 90 50, 170 50 S 250 130, 290 70" pathLength="1" />
      {[
        [30, 150],
        [170, 50],
        [290, 70],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} className="phead__node" style={{ '--i': i }}>
          <rect x="-16" y="-16" width="32" height="32" rx="10" />
          <circle r="4" />
        </g>
      ))}
      {!still && (
        <circle className="phead__packet" r="5">
          <animateMotion dur="3.6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".6 0 .4 1">
            <mpath xlinkHref="#phead-path" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}

export default function PageHeader({ page, children }) {
  return (
    <header className="phead">
      <div className="container phead__inner">
        <div className="phead__copy">
          <nav className="crumbs" aria-label="Breadcrumb" data-reveal="fade">
            <Link to="/">Home</Link>
            <span className="crumbs__wire" aria-hidden="true" />
            <span aria-current="page">{page.label}</span>
          </nav>
          <MaskLines as="h1" className="phead__title" lines={page.lines} split />
          {page.lede && (
            <p className="lede phead__lede" data-reveal style={{ '--d': '0.25s' }}>
              {page.lede}
            </p>
          )}
          {children}
        </div>
        <WireArt />
      </div>
    </header>
  );
}
