import { useState } from 'react';

/* ---------------------------------------------------------------------------
   Card ⇄ list view mode, remembered per KIND of object — not globally.

   The three people lenses of the Directory AND a department hub's
   Students / Alumni / Faculty roster share one `people` mode (cards by
   default — you size a person up). Departments keep their own (the register
   by default — you look an office up). So picking "list" for a 3,000-student
   roster also gives you the list the next time you browse Alumni, and never
   flips the department register into tiles.

   A per-viewer convenience: localStorage, wrapped in try/catch, falling back
   to the defaults whenever storage is unavailable.
--------------------------------------------------------------------------- */

const VIEW_KEY = 'ugrads-directory-view';
const DEFAULT_VIEW = { people: 'card', departments: 'list' };

const readView = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null');
    return { ...DEFAULT_VIEW, ...(saved || {}) };
  } catch {
    return DEFAULT_VIEW;
  }
};

/* [mode, setMode] for one kind. The write starts from what is stored, so a
   screen only ever changes its own kind's choice. */
export const useDirectoryView = (kind) => {
  const [mode, setMode] = useState(() => readView()[kind]);
  const setView = (next) => {
    setMode(next);
    try {
      localStorage.setItem(VIEW_KEY, JSON.stringify({ ...readView(), [kind]: next }));
    } catch { /* storage blocked — keep it for this visit */ }
  };
  return [mode, setView];
};
