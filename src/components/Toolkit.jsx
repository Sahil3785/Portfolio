import { skills } from '../data/content';
import { Glyph } from './Icons';

export default function Toolkit() {
  return (
    <section id="skills" className="kit" aria-label="Skills by category">
      <div className="container">
        <ul className="kit__rows">
          {skills.map((group, i) => (
            <li className="kit__row" key={group.category} data-reveal style={{ '--d': `${i * 0.05}s` }}>
              <div className="kit__cat">
                <span className="kit__glyph" aria-hidden="true">
                  <Glyph name={group.glyph} />
                </span>
                <h2>{group.category}</h2>
              </div>
              <ul className="kit__chips" aria-label={`${group.category} tools`}>
                {group.items.map((item, j) => (
                  <li className="chip" key={item} style={{ '--j': j }}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
