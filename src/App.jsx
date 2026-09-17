import { useCallback, useEffect, useRef, useState } from 'react';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Preloader from './components/Preloader';
import QuickDock from './components/QuickDock';
import Spine from './components/Spine';
import Transition from './components/Transition';
import { pageFor, pages } from './data/content';
import { initAnchorLinks, initReveals, initSmoothScroll, jumpTo, reducedMotion } from './lib/motion';
import { useRouter } from './lib/router';
import About from './pages/About';
import ContactPage from './pages/ContactPage';
import ExperiencePage from './pages/ExperiencePage';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ServicesPage from './pages/ServicesPage';
import ToolkitPage from './pages/ToolkitPage';
import WorkPage from './pages/WorkPage';

const ROUTES = {
  '/': Home,
  '/services': ServicesPage,
  '/about': About,
  '/work': WorkPage,
  '/experience': ExperiencePage,
  '/skills': ToolkitPage,
  '/contact': ContactPage,
};

const COVER_MS = 700;
const REVEAL_MS = 750;

function setMeta(path) {
  const page = pageFor(path);
  document.title = page ? page.title : 'Page not found | Sahil';
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', page ? page.description : pages[0].description);
}

export default function App() {
  const { path } = useRouter();
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(path);
  const [phase, setPhase] = useState('idle'); // idle | cover | reveal
  const mainRef = useRef(null);
  const handleIntroDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const stopSmooth = initSmoothScroll();
    const stopAnchors = initAnchorLinks();
    return () => {
      stopSmooth();
      stopAnchors();
    };
  }, []);

  // Page change: cover the screen, swap the page underneath, then reveal it.
  useEffect(() => {
    if (path === shown) return;
    if (reducedMotion()) {
      setShown(path);
      jumpTo(0);
      return;
    }
    setPhase('cover');
    const swap = setTimeout(() => {
      setShown(path);
      jumpTo(0);
      setPhase('reveal');
    }, COVER_MS);
    const done = setTimeout(() => setPhase('idle'), COVER_MS + REVEAL_MS);
    return () => {
      clearTimeout(swap);
      clearTimeout(done);
    };
  }, [path, shown]);

  // Per-page title, reveals and focus.
  useEffect(() => {
    setMeta(shown);
    const stop = initReveals(mainRef.current || document);
    return stop;
  }, [shown]);

  useEffect(() => {
    if (phase === 'reveal' && mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [phase]);

  const Page = ROUTES[shown] || NotFound;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-bg" aria-hidden="true">
        <span className="blob blob--a" />
        <span className="blob blob--b" />
        <span className="blob blob--c" />
        <span className="blob blob--d" />
      </div>
      <div className="grain" aria-hidden="true" />

      <Preloader onDone={handleIntroDone} />
      <Transition phase={phase} path={path} />
      <Cursor />
      <Nav />
      <Spine />

      <main id="main" ref={mainRef} tabIndex={-1} key={shown}>
        <Page ready={ready} />
      </main>

      <Footer key={`footer-${shown}`} />
      <QuickDock />
    </>
  );
}
