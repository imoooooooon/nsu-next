import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
export default function RoutePosition() {
  const { pathname, search } = useLocation();
  const positions = useRef(new Map()); const previous = useRef(pathname);
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.querySelector('#main-content h1')?.focus({ preventScroll: true });
    window.scrollTo(0, positions.current.get(pathname + search) || 0);
  }, [pathname, search]);
  useEffect(() => {
    const remember = () => positions.current.set(pathname + search, window.scrollY);
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [pathname, search]);
  return null;
}
