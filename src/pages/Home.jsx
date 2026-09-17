import Hero from '../components/Hero';
import Busywork from '../components/motion/Busywork';
import Calculator from '../components/Calculator';
import { ArrowRight, Bolt, Cap } from '../components/Icons';
import NextPage from '../components/NextPage';
import Services from '../components/Services';
import Stream from '../components/Stream';
import { MaskLines } from '../components/UI';
import { Project } from '../components/Work';
import { experience, profile, projects } from '../data/content';
import { Link } from '../lib/router';

function FeaturedWork() {
  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-head section-head--row">
          <MaskLines id="featured-title" className="section-title" lines={['Selected work']} />
          <Link to="/work" className="text-link" data-reveal style={{ '--d': '0.15s' }}>
            See all projects <ArrowRight />
          </Link>
        </div>
        <div className="featured__grid">
          {projects.slice(0, 2).map((p, i) => (
            <div key={p.title} data-reveal style={{ '--d': `${i * 0.1}s` }}>
              <Project project={p} headingLevel="h3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTeaser() {
  const current = experience.find((e) => e.kind === 'work' && e.current);
  const school = experience.find((e) => e.kind === 'education');
  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <div className="container teaser__grid">
        <div className="teaser__photo" data-reveal="scale">
          <div className="teaser__frame">
            <picture>
              <source srcSet={profile.photo} type="image/webp" />
              <img src={profile.photoFallback} alt={`Portrait of ${profile.name}`} width="720" height="900" loading="lazy" decoding="async" />
            </picture>
          </div>
          {current && (
            <span className="float-chip float-chip--a">
              <Bolt /> {current.org}
            </span>
          )}
          {school && (
            <span className="float-chip float-chip--b">
              <Cap /> {school.org}
            </span>
          )}
        </div>
        <div className="teaser__copy">
          <MaskLines id="teaser-title" className="section-title" lines={["Hi, I'm Sahil."]} />
          <p className="lede" data-reveal style={{ '--d': '0.15s' }}>
            {current ? `${current.title} at ${current.org}` : profile.role}
            {school ? `, and a ${school.title} student at ${school.org}. ` : '. '}
            I build the automation that runs behind the scenes, and the frontends people actually see.
          </p>
          <div className="teaser__actions" data-reveal style={{ '--d': '0.25s' }}>
            <Link to="/about" className="btn btn--ghost">
              More about me
            </Link>
            <Link to="/experience" className="text-link">
              See my experience <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({ ready }) {
  return (
    <>
      <Hero ready={ready} />
      <Stream />
      <Services />
      <Busywork />
      <Calculator />
      <FeaturedWork />
      <AboutTeaser />
      <NextPage current="/" />
    </>
  );
}
