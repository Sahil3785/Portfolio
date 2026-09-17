import { profile } from '../data/content';
import { Link } from '../lib/router';
import { Calendar, WhatsApp } from './Icons';
import { Magnetic, RollLabel } from './UI';

export const whatsappLink = (text = '') =>
  profile.whatsapp ? `https://wa.me/${profile.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '';

export default function CtaBand({ title = 'Have something in mind?', text }) {
  return (
    <section className="band-wrap" aria-label="Start a project">
      <div className="container">
        <div className="band" data-reveal="scale">
          <div className="band__orb band__orb--a" aria-hidden="true" />
          <div className="band__orb band__orb--b" aria-hidden="true" />
          <div className="band__copy">
            <h2 className="band__title">{title}</h2>
            <p className="band__text">
              {text || 'Build your project brief in about two minutes. I reply within 24 hours with a clear plan.'}
            </p>
          </div>
          <div className="band__actions">
            <Magnetic>
              <Link to="/contact" className="btn btn--light">
                <RollLabel>Start my brief</RollLabel>
              </Link>
            </Magnetic>
            {profile.whatsapp && (
              <a className="btn btn--outline-light" href={whatsappLink("Hi Sahil, I'd like to discuss a project.")} target="_blank" rel="noreferrer">
                <WhatsApp /> WhatsApp
              </a>
            )}
            {profile.booking && (
              <a className="btn btn--outline-light" href={profile.booking} target="_blank" rel="noreferrer">
                <Calendar /> Book a call
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
