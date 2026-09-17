import { useEffect, useState } from 'react';
import CtaBand from '../components/CtaBand';
import NextPage from '../components/NextPage';
import PageHeader from '../components/PageHeader';
import Work from '../components/Work';
import { pageFor, projects, services } from '../data/content';
import { clearIntent, peekIntent } from '../lib/intent';

const FILTERS = [
  { id: 'all', title: 'All work' },
  ...services.filter((s) => projects.some((p) => (p.services || []).includes(s.id))),
];

export default function WorkPage() {
  const [filter, setFilter] = useState(() => {
    const intent = peekIntent();
    return intent && FILTERS.some((f) => f.id === intent.filter) ? intent.filter : 'all';
  });

  useEffect(() => clearIntent('filter'), []);

  const count = (id) =>
    id === 'all' ? projects.length : projects.filter((p) => (p.services || []).includes(id)).length;

  return (
    <>
      <PageHeader page={pageFor('/work')}>
        <div className="filters" role="group" aria-label="Filter projects by service" data-reveal style={{ '--d': '0.3s' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter ${filter === f.id ? 'is-on' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.title}
              <span>{count(f.id)}</span>
            </button>
          ))}
        </div>
      </PageHeader>
      <Work key={filter} filter={filter} />
      <CtaBand title="Want something like this?" />
      <NextPage current="/work" />
    </>
  );
}
