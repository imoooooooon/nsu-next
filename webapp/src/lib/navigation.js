import { useNavigate } from 'react-router-dom';

/* Close/back helper for detail routes: go back when the app owns the history
   entry, otherwise fall back to a sensible parent route (deep links). */
export const useCloseTo = (fallback = '/home') => {
  const navigate = useNavigate();
  return () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
};
