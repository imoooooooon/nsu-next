import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import {
  SEEKING_CATEGORIES, SEEKING_WORK_MODES, SEEKING_AVAILABILITY,
  SEEKING_DEPARTMENTS, SEEKING_SORTS, EMPTY_SEEKING_FILTERS
} from './constants';

// --- SEEKING: ADVANCED FILTERS SHEET ---
export const SeekingFilterSection = ({ title, t, children }) => (
  <div>
    <h4 className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2.5`}>{title}</h4>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

// Mounted only while open, so the draft always starts from the applied filters.
export const SeekingFiltersSheet = ({ filters, onApply, onClose, t, isDark }) => {
  const [draft, setDraft] = useState(filters);

  const toggleIn = (key, value) => {
    setDraft((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      };
    });
  };

  const chipClass = (active) =>
    `px-3 py-2 rounded-lg text-[11px] font-extrabold border transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
        : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`
    }`;

  return (
    <>
      <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={`absolute bottom-0 left-0 w-full max-h-[85%] rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-[61] animate-slide-up flex flex-col border-t ${t.borderSoft}`}>
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 shrink-0" />
        <div className={`px-5 py-3 flex items-center justify-between border-b ${t.borderSoft} shrink-0`}>
          <h3 className={`text-base font-extrabold ${t.text} tracking-tight`}>Filter Talent</h3>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center active:scale-95 transition-transform`}
          >
            <X className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <SeekingFilterSection t={t} title="Category">
            {SEEKING_CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => toggleIn('categories', c)} aria-pressed={draft.categories.includes(c)} className={chipClass(draft.categories.includes(c))}>{c}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Work Mode">
            {SEEKING_WORK_MODES.map((m) => (
              <button key={m} type="button" onClick={() => toggleIn('workModes', m)} aria-pressed={draft.workModes.includes(m)} className={chipClass(draft.workModes.includes(m))}>{m}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Availability">
            {SEEKING_AVAILABILITY.map((a) => (
              <button key={a} type="button" onClick={() => toggleIn('availability', a)} aria-pressed={draft.availability.includes(a)} className={chipClass(draft.availability.includes(a))}>{a}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Department">
            {SEEKING_DEPARTMENTS.map((d) => (
              <button key={d} type="button" onClick={() => toggleIn('departments', d)} aria-pressed={draft.departments.includes(d)} className={chipClass(draft.departments.includes(d))}>{d}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Profile Quality">
            {[
              { key: 'verifiedOnly', label: 'Verified profiles only' },
              { key: 'hasPortfolio', label: 'Has portfolio' },
              { key: 'hasResume', label: 'Has resume' }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                aria-pressed={!!draft[opt.key]}
                onClick={() => setDraft((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                className={chipClass(!!draft[opt.key])}
              >
                {opt.label}
              </button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Sort By">
            {SEEKING_SORTS.map((s) => (
              <button key={s} type="button" onClick={() => setDraft((prev) => ({ ...prev, sort: s }))} aria-pressed={draft.sort === s} className={chipClass(draft.sort === s)}>{s}</button>
            ))}
          </SeekingFilterSection>
        </div>

        <div className={`p-5 pb-8 border-t ${t.borderSoft} flex gap-3 shrink-0`}>
          <button
            type="button"
            onClick={() => setDraft(EMPTY_SEEKING_FILTERS)}
            className={`h-12 px-5 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} active:scale-[0.97] transition-transform flex items-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="flex-1 h-12 rounded-xl font-extrabold text-sm bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30 active:scale-[0.97] transition-transform"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};
