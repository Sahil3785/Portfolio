import { pages } from '../data/content';
import { Link } from '../lib/router';
import { ArrowRight } from './Icons';

export default function NextPage({ current }) {
  const i = pages.findIndex((p) => p.path === current);
  const next = pages[(i + 1) % pages.length];
  return (
    <section className="next" aria-label="Next page">
      <div className="container">
        <Link to={next.path} className="next__link" data-cursor="Open">
          <span className="next__label">Next page</span>
          <span className="next__title">
            <span>{next.label}</span>
            <span className="next__arrow">
              <ArrowRight />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
