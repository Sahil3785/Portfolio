import { useEffect, useRef } from 'react';
import { pages } from '../data/content';
import { clamp, onScrollTick } from '../lib/motion';
import { Link, useRouter } from '../lib/router';

// The site as a pipeline: each page is a node. The packet sits on the current
// page and creeps toward the next one as you scroll.
export default function Spine() {
  const { path } = useRouter();
  const index = Math.max(0, pages.findIndex((p) => p.path === path));
  const fillRef = useRef(null);
  const packetRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    return onScrollTick(({ y, vh }) => {
      const list = listRef.current;
      if (!list) return;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? clamp(y / max) : 0;
      const last = pages.length - 1;
      const pos = Math.min(last, index + (index < last ? p * 0.999 : 0)) / last;
      const h = list.offsetHeight;
      fillRef.current.style.transform = `scaleY(${pos})`;
      packetRef.current.style.transform = `translate3d(0, ${pos * h}px, 0)`;
    });
  }, [index]);

  return (
    <nav className="spine" aria-label="Site map">
      <span className="spine__line" />
      <span className="spine__fill" ref={fillRef} />
      <span className="spine__packet" ref={packetRef} />
      <ol className="spine__list" ref={listRef}>
        {pages.map((p, i) => (
          <li key={p.path} style={{ display: 'contents' }}>
            <Link
              to={p.path}
              className={`spine__item ${i === index ? 'is-active' : ''} ${i < index ? 'is-done' : ''}`}
            >
              <span className="spine__node" />
              <span className="spine__label">{p.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
