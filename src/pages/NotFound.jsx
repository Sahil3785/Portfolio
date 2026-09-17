import { Link } from '../lib/router';

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="notfound__code">404</p>
        <h1 className="section-title">This page took a wrong turn.</h1>
        <p className="lede">The workflow could not find a node at this address.</p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
