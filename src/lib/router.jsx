import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Tiny router: clean URLs (/work) on the real site, hash URLs (#/work) where
// the server can't rewrite paths, like the static preview page.
const RouterContext = createContext({ path: '/', navigate: () => {} });

const useHashMode = () =>
  typeof window !== 'undefined' && (window.__BWS_PREVIEW__ === true || window.location.protocol === 'file:');

function normalise(p) {
  if (!p) return '/';
  const clean = p.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

function readPath(hashMode) {
  if (hashMode) {
    const h = window.location.hash.replace(/^#/, '');
    return h.startsWith('/') ? normalise(h) : '/';
  }
  return normalise(window.location.pathname);
}

export function RouterProvider({ children }) {
  const hashMode = useHashMode();
  const [path, setPath] = useState(() => readPath(hashMode));

  useEffect(() => {
    const sync = () => setPath(readPath(hashMode));
    window.addEventListener('popstate', sync);
    if (hashMode) window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [hashMode]);

  const navigate = useCallback(
    (to) => {
      const next = normalise(to);
      if (hashMode) {
        if (window.location.hash !== `#${next}`) window.location.hash = next;
        setPath(next);
      } else {
        if (window.location.pathname !== next) window.history.pushState(null, '', next);
        setPath(next);
      }
    },
    [hashMode]
  );

  const href = useCallback((to) => (hashMode ? `#${normalise(to)}` : normalise(to)), [hashMode]);
  const value = useMemo(() => ({ path, navigate, href }), [path, navigate, href]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

export function Link({ to, onClick, children, ...rest }) {
  const { navigate, href, path } = useRouter();
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={href(to)} onClick={handle} aria-current={normalise(to) === path ? 'page' : undefined} {...rest}>
      {children}
    </a>
  );
}
