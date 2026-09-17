import { useEffect, useRef, useState } from 'react';
import { profile, projects as allProjects, repos, serviceFor } from '../data/content';
import { onScrollTick, reducedMotion, stickyProgress } from '../lib/motion';
import { ArrowUpRight, GitHub } from './Icons';
import { useTilt } from './UI';
import { PREVIEWS } from './previews/Previews';

const LANG_COLORS = { TypeScript: '#3178c6', JavaScript: '#e0b400' };

function Media({ src, title }) {
  if (/\.(mp4|webm)$/i.test(src)) {
    return <video className="project__media" src={src} autoPlay muted loop playsInline aria-label={`${title} demo`} />;
  }
  return <img className="project__media" src={src} alt={`${title} demo`} loading="lazy" decoding="async" />;
}

export function Project({ project, headingLevel = 'h2' }) {
  const ref = useRef(null);
  useTilt(ref, 4);
  const Preview = PREVIEWS[project.preview];
  const visual = project.media ? <Media src={project.media} title={project.title} /> : Preview ? <Preview /> : null;
  const Heading = headingLevel;
  const stage = project.link ? (
    <a
      className="project__stage"
      href={project.link}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      aria-label={`${project.title} on GitHub`}
    >
      {visual}
    </a>
  ) : (
    <div className="project__stage">{visual}</div>
  );

  return (
    <article className="project" ref={ref}>
      <span className="project__shine" aria-hidden="true" />
      {stage}
      <div className="project__body">
        <div>
          {project.services && (
            <p className="project__svc">{project.services.map((id) => serviceFor(id)?.title).filter(Boolean).join(' + ')}</p>
          )}
          <ul className="project__pipe" aria-label="Built with">
            {project.tech.map((t) => (
              <li key={t}>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Heading className="project__title">{project.title}</Heading>
          <p className="project__desc">{project.desc}</p>
        </div>
        {project.link && (
          <a className="text-link" href={project.link} target="_blank" rel="noreferrer">
            {project.linkLabel || 'View project'} <ArrowUpRight />
          </a>
        )}
      </div>
    </article>
  );
}

export function MoreOnGitHub() {
  return (
    <article className="project project--more">
      <div className="project__body">
        <div>
          <h2 className="project__title project__title--sm">More on GitHub</h2>
          <p className="project__desc">Recent repositories, from CRM tools to data sync services.</p>
          <ul className="repos">
            {repos.map((r) => (
              <li key={r.name}>
                <a href={`${profile.github}/${r.name}`} target="_blank" rel="noreferrer">
                  <span className="repos__name">{r.name}</span>
                  <span className="repos__lang" style={{ '--lang': LANG_COLORS[r.lang] }}>
                    {r.lang}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">
          <GitHub /> All repositories
        </a>
      </div>
    </article>
  );
}

export default function Work({ filter = 'all' }) {
  const projects = filter === 'all' ? allProjects : allProjects.filter((p) => (p.services || []).includes(filter));
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (min-height: 560px)');
    const update = () => setPinned(mq.matches && !reducedMotion());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pinned) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }

    let distance = 0;
    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${distance + window.innerHeight}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);

    let lastCount = '';
    const total = projects.length;

    const off = onScrollTick(({ vh, vw }) => {
      const p = stickyProgress(section, vh);
      track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${0.06 + p * 0.94})`;

      let idx = 0;
      let best = Infinity;
      [...track.children].forEach((panel, i) => {
        const r = panel.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const stage = panel.querySelector('.project__stage > *');
        if (stage) stage.style.setProperty('--px', `${(((center - vw / 2) / vw) * -48).toFixed(1)}px`);
        const d = Math.abs(center - vw * 0.45);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      const label = String(Math.min(idx + 1, total)).padStart(2, '0');
      if (label !== lastCount && countRef.current) {
        countRef.current.textContent = label;
        lastCount = label;
      }
    });

    return () => {
      off();
      ro.disconnect();
      window.removeEventListener('resize', measure);
      section.style.height = '';
    };
  }, [pinned, projects.length]);

  return (
    <section className={`work ${pinned ? 'is-pinned' : ''}`} ref={sectionRef} aria-label="Projects">
      <div className="work__sticky">
        {pinned && (
          <div className="container work__head" aria-hidden="true">
            <span className="work__hint">
              <span className="work__hint-line" />
              Keep scrolling to move through the projects
            </span>
            <div className="work__meta">
              <span>
                <b ref={countRef}>01</b> / {String(projects.length).padStart(2, '0')}
              </span>
              <span className="work__bar">
                <span ref={barRef} />
              </span>
            </div>
          </div>
        )}

        <div className="work__track" ref={trackRef}>
          {projects.map((p) => (
            <Project key={p.title} project={p} />
          ))}
          {projects.length === 0 && (
            <article className="project project--more">
              <div className="project__body">
                <p className="project__desc">No public projects in this category yet. Ask me about recent private work.</p>
              </div>
            </article>
          )}
          <MoreOnGitHub />
        </div>
      </div>
    </section>
  );
}
