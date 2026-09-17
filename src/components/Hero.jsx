import { useEffect, useRef } from 'react';
import { hero, profile, services } from '../data/content';
import { clamp, onScrollTick, reducedMotion } from '../lib/motion';
import { setIntent } from '../lib/intent';
import { Link } from '../lib/router';
import { ArrowRight, Glyph } from './Icons';
import { Magnetic, RollLabel, SplitWords, useFitLines } from './UI';
import ChaosField from './motion/ChaosField';
import Rotator from './motion/Rotator';
import WorkflowGraph, { HERO_FLOW } from './WorkflowGraph';

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const panelRef = useRef(null);
  const titleRef = useRef(null);
  const targetRef = useRef(null);
  useFitLines(titleRef);

  // Gentle scroll-away: copy drifts up and fades, panel lags behind.
  useEffect(() => {
    if (reducedMotion()) return;
    return onScrollTick(({ y, vh }) => {
      if (y > vh * 1.2) return;
      const p = clamp(y / vh);
      if (copyRef.current) {
        copyRef.current.style.transform = `translate3d(0, ${p * -60}px, 0)`;
        copyRef.current.style.opacity = String(1 - p * 0.9);
      }
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(0, ${p * 40}px, 0) scale(${1 - p * 0.04})`;
      }
    });
  }, []);

  return (
    <section id="top" className={`hero ${ready ? 'is-ready' : ''}`} ref={sectionRef}>
      <div className="hero__dots" aria-hidden="true" />
      <ChaosField targetRef={targetRef} active={ready} />

      <div className="container hero__inner">
        <div ref={copyRef}>
          <p className="status hero__status hero__fade" style={{ '--d': '0.1s' }}>
            <span className="status__dot" />
            {profile.availability}
          </p>

          <h1 className="hero__title is-split" ref={titleRef}>
            <span className="sr-only">{`${hero.lead} ${hero.rotate.join(', ')} ${hero.tail}`}</span>
            <span className="mask" style={{ '--i': 0 }} aria-hidden="true">
              <span>
                <SplitWords text={hero.lead} />
              </span>
            </span>
            <span className="mask mask--rot" style={{ '--i': 1 }} aria-hidden="true">
              <span>
                <Rotator words={hero.rotate} active={ready} offset={hero.lead.replace(/ /g, '').length} />
              </span>
            </span>
            <span className="mask" style={{ '--i': 2 }} aria-hidden="true">
              <span>
                <SplitWords text={hero.tail} offset={hero.lead.replace(/ /g, '').length + 8} />
              </span>
            </span>
          </h1>

          <p className="hero__intro hero__fade" style={{ '--d': '0.55s' }}>
            {hero.intro}
          </p>

          <div className="hero__actions hero__fade" style={{ '--d': '0.7s' }}>
            <Magnetic>
              <Link className="btn btn--primary" to="/contact">
                <RollLabel>Start a project</RollLabel>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link className="btn btn--ghost" to="/services">
                <RollLabel>Explore services</RollLabel>
              </Link>
            </Magnetic>
            <Link className="text-link" to="/work">
              See my work <ArrowRight />
            </Link>
          </div>

          <ul className="hero__services hero__fade" style={{ '--d': '0.85s' }} aria-label="Services">
            {services.map((s) => (
              <li key={s.id}>
                <Link to="/services" className="svc-chip" onClick={() => setIntent({ scroll: `svc-${s.id}` })}>
                  <Glyph name={s.glyph} />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__panel-wrap" ref={panelRef}>
          <div className="hero__panel" ref={targetRef}>
            <div className="hero__panel-glow" aria-hidden="true" />
            <WorkflowGraph flow={HERO_FLOW} active={ready} />
          </div>
        </div>
      </div>

      <span className="scroll-cue" aria-hidden="true" />
    </section>
  );
}
