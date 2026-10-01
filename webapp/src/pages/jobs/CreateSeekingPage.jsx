import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, CalendarClock, CheckCircle2, Eye, Sparkles, User, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, FormColumn } from '../../components/layout/AppShell';
import { IconButton, Select } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';
import {
  SEEKING_CATEGORIES, SEEKING_WORK_MODES, SEEKING_AVAILABILITY, SEEKING_COMMITMENTS,
  SEEKING_COMPENSATIONS, SEEKING_VISIBILITY_OPTIONS, SEEKING_DURATIONS,
  SEEKING_SUGGESTED_SKILLS, SEEKING_HEADLINE_MAX, SEEKING_INTRO_MAX, SEEKING_SKILLS_MAX
} from '../../features/seeking/constants';
import {
  getSeekingViewerProfile, createEmptySeekingDraft, seekingDraftFromPost, buildSeekingPostFromDraft
} from '../../features/seeking/utils';
import { TalentCard } from '../../features/seeking/TalentCard';
import { SeekingDetailRow } from '../../features/seeking/SeekingPrimitives';

/* --- SEEKING: CREATE / EDIT POST (route /jobs/seeking/new, ?edit=<postId>) ---
   The mobile form → preview flow served as a page. Students only. */
export default function CreateSeekingPage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const close = useCloseTo('/jobs/seeking');
  const [searchParams] = useSearchParams();
  const { authRole, mySeekingPosts, handleSubmitSeekingPost, showToast } = useAppState();

  const editId = searchParams.get('edit');
  const editingPost = editId ? mySeekingPosts.find((p) => p.id === editId) : null;

  const viewer = getSeekingViewerProfile(authRole);
  const [step, setStep] = useState('form');
  const [draft, setDraft] = useState(() => (editingPost ? seekingDraftFromPost(editingPost) : createEmptySeekingDraft()));
  const [skillInput, setSkillInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const previewTalent = useMemo(
    () => buildSeekingPostFromDraft(draft, viewer, 'active'),
    [draft, viewer]
  );

  if (authRole !== 'student') {
    return <Navigate to="/jobs/seeking" replace />;
  }

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const toggleWorkMode = (mode) => setDraft((prev) => ({
    ...prev,
    workMode: prev.workMode.includes(mode) ? prev.workMode.filter((m) => m !== mode) : [...prev.workMode, mode]
  }));

  const addSkill = (raw) => {
    const value = (raw || '').trim();
    if (!value) return;
    if (draft.skills.length >= SEEKING_SKILLS_MAX) {
      showToast(`You can add up to ${SEEKING_SKILLS_MAX} skills`);
      return;
    }
    if (draft.skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      showToast('That skill is already added');
      return;
    }
    setDraft((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput('');
  };

  const removeSkill = (skill) => setDraft((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const errors = {
    category: !draft.category ? 'Select a category' : null,
    headline: !draft.headline.trim() ? 'Add a headline' : null,
    intro: !draft.intro.trim() ? 'Add a short introduction' : null,
    skills: draft.skills.length === 0 ? 'Add at least one skill' : null
  };
  const isValid = !Object.values(errors).some(Boolean);

  const handleContinue = () => {
    if (!isValid) {
      setShowErrors(true);
      showToast('Complete the required fields to continue');
      return;
    }
    setStep('preview');
  };

  const handleSubmit = () => {
    handleSubmitSeekingPost(buildSeekingPostFromDraft(draft, viewer, 'pending'));
    showToast('Post submitted for review');
    navigate('/jobs/seeking/my-posts');
  };

  const labelClass = `text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`;
  const inputClass = `w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`;
  const errorClass = 'text-[11px] font-bold text-red-500 mt-1.5 block';

  const chipClass = (active) =>
    `px-3 py-2 rounded-lg text-[11px] font-extrabold border transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
        : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`
    }`;

  const headerTitle = step === 'preview' ? 'Preview Post' : draft.id ? 'Edit Seeking Post' : 'Create Seeking Post';

  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-center gap-3 pt-8 lg:pt-10 pb-5">
        <IconButton
          icon={ArrowLeft}
          label={step === 'preview' ? 'Back to edit' : 'Back to seeking'}
          onClick={() => (step === 'preview' ? setStep('form') : close())}
        />
        <h2 className={`text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${t.text}`}>{headerTitle}</h2>
      </div>

      {step === 'form' && (
        <div className="space-y-6 pb-12">
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-full ${isDark ? 'bg-white/10' : 'bg-white'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
              <User className={`w-4 h-4 ${t.text}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-extrabold ${t.text} truncate`}>{viewer.name}</p>
                {viewer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
              </div>
              <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{viewer.department} · Batch {viewer.batch}</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Category <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {SEEKING_CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => setField('category', c)} aria-pressed={draft.category === c} className={chipClass(draft.category === c)}>{c}</button>
              ))}
            </div>
            {showErrors && errors.category && <span className={errorClass}>{errors.category}</span>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`} htmlFor="seeking-headline">Headline <span className="text-red-500">*</span></label>
              <span className={`text-[10px] font-extrabold ${draft.headline.length >= SEEKING_HEADLINE_MAX ? 'text-red-500' : t.textMuted}`}>
                {draft.headline.length}/{SEEKING_HEADLINE_MAX}
              </span>
            </div>
            <input
              id="seeking-headline"
              type="text"
              value={draft.headline}
              maxLength={SEEKING_HEADLINE_MAX}
              onChange={(e) => setField('headline', e.target.value)}
              placeholder="e.g. Seeking Product Design Internship"
              className={inputClass}
            />
            {showErrors && errors.headline && <span className={errorClass}>{errors.headline}</span>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`} htmlFor="seeking-intro">Introduction <span className="text-red-500">*</span></label>
              <span className={`text-[10px] font-extrabold ${draft.intro.length >= SEEKING_INTRO_MAX ? 'text-red-500' : t.textMuted}`}>
                {draft.intro.length}/{SEEKING_INTRO_MAX}
              </span>
            </div>
            <textarea
              id="seeking-intro"
              rows="5"
              value={draft.intro}
              maxLength={SEEKING_INTRO_MAX}
              onChange={(e) => setField('intro', e.target.value)}
              placeholder="Your background, relevant experience, strengths and the kind of opportunity you are looking for."
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}
            />
            {showErrors && errors.intro && <span className={errorClass}>{errors.intro}</span>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`} htmlFor="seeking-skill">Skills <span className="text-red-500">*</span></label>
              <span className={`text-[10px] font-extrabold ${t.textMuted}`}>{draft.skills.length}/{SEEKING_SKILLS_MAX}</span>
            </div>
            <div className="flex gap-2">
              <input
                id="seeking-skill"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                placeholder="e.g. Figma"
                className={`flex-1 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                disabled={!skillInput.trim() || draft.skills.length >= SEEKING_SKILLS_MAX}
                className={`h-12 px-5 rounded-xl text-xs font-extrabold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
                  !skillInput.trim() || draft.skills.length >= SEEKING_SKILLS_MAX
                    ? `${isDark ? 'bg-white/5 text-white/30' : 'bg-black/5 text-black/30'} cursor-not-allowed`
                    : 'bg-[#1D9BF0] text-white shadow-sm active:scale-95'
                }`}
              >
                Add
              </button>
            </div>

            {draft.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {draft.skills.map((skill) => (
                  <span key={skill} className={`pl-3 pr-1.5 py-1.5 rounded-lg text-[11px] font-extrabold border flex items-center gap-1.5 ${isDark ? 'bg-white/5 text-gray-200 border-white/10' : 'bg-black/[0.03] text-gray-700 border-black/[0.06]'}`}>
                    {skill}
                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                    >
                      <X className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-4 mb-2`}>Suggested</p>
            <div className="flex flex-wrap gap-2">
              {SEEKING_SUGGESTED_SKILLS.filter((s) => !draft.skills.includes(s)).map((s) => (
                <button key={s} type="button" onClick={() => addSkill(s)} className={chipClass(false)}>+ {s}</button>
              ))}
            </div>
            {showErrors && errors.skills && <span className={errorClass}>{errors.skills}</span>}
          </div>

          <div className={`pt-2 border-t ${t.borderSoft}`}>
            <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Work Preferences</h3>

            <label className={labelClass}>Work Mode</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {SEEKING_WORK_MODES.map((m) => (
                <button key={m} type="button" onClick={() => toggleWorkMode(m)} aria-pressed={draft.workMode.includes(m)} className={chipClass(draft.workMode.includes(m))}>{m}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="seeking-location">Location</label>
                <input id="seeking-location" type="text" value={draft.location} onChange={(e) => setField('location', e.target.value)} placeholder="e.g. Dhaka, BD" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="seeking-availability">Availability</label>
                <Select id="seeking-availability" options={SEEKING_AVAILABILITY} value={draft.availability} onChange={(v) => setField('availability', v)} />
              </div>
              <div>
                <label className={labelClass} htmlFor="seeking-commitment">Commitment</label>
                <Select id="seeking-commitment" options={SEEKING_COMMITMENTS} value={draft.commitment} onChange={(v) => setField('commitment', v)} />
              </div>
              <div>
                <label className={labelClass} htmlFor="seeking-duration">Preferred Duration</label>
                <input id="seeking-duration" type="text" value={draft.preferredDuration} onChange={(e) => setField('preferredDuration', e.target.value)} placeholder="e.g. 3–6 months" className={inputClass} />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass} htmlFor="seeking-compensation">Compensation Preference</label>
              <Select id="seeking-compensation" options={SEEKING_COMPENSATIONS} value={draft.compensation} onChange={(v) => setField('compensation', v)} />
            </div>
          </div>

          <div className={`pt-2 border-t ${t.borderSoft}`}>
            <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Supporting Links</h3>
            <div className="space-y-4">
              {[
                { key: 'resumeUrl', label: 'Resume', placeholder: 'https://…' },
                { key: 'portfolioUrl', label: 'Portfolio', placeholder: 'https://…' },
                { key: 'linkedInUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/…' },
                { key: 'githubUrl', label: 'GitHub', placeholder: 'https://github.com/…' },
                { key: 'otherUrl', label: 'Other URL', placeholder: 'https://…' }
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClass} htmlFor={`seeking-${field.key}`}>{field.label}</label>
                  <input
                    id={`seeking-${field.key}`}
                    type="url"
                    value={draft[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-2 border-t ${t.borderSoft}`}>
            <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Visibility & Duration</h3>
            <label className={labelClass}>Who can see this post</label>
            <div className="space-y-2 mb-5">
              {SEEKING_VISIBILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setField('visibility', option)}
                  aria-pressed={draft.visibility === option}
                  className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all active:scale-[0.98] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
                    draft.visibility === option
                      ? `border-[#1D9BF0] ${isDark ? 'bg-[#1D9BF0]/10' : 'bg-blue-50'}`
                      : `${t.inputBorder} ${t.inputBg}`
                  }`}
                >
                  <span className={`text-xs font-extrabold ${t.text}`}>{option}</span>
                  {draft.visibility === option && <CheckCircle2 className="w-4 h-4 text-[#1D9BF0] shrink-0 ml-2" strokeWidth={3} />}
                </button>
              ))}
            </div>

            <label className={labelClass}>Post Duration</label>
            <div className="flex gap-2">
              {SEEKING_DURATIONS.map((d) => (
                <button key={d} type="button" onClick={() => setField('duration', d)} aria-pressed={draft.duration === d} className={`flex-1 ${chipClass(draft.duration === d)}`}>{d}</button>
              ))}
            </div>
          </div>

          <div className={`pt-5 border-t ${t.borderSoft}`}>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!isValid}
              className={`w-full h-14 rounded-xl font-extrabold text-base transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
                isValid
                  ? 'active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40'
                  : 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
              }`}
            >
              Preview Talent Card
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="pb-12">
          <p className={`text-xs font-bold ${t.textMuted} leading-relaxed mb-5`}>
            This is exactly how your post will appear in the Seeking feed. Long headlines are shortened and the
            introduction is limited to two lines.
          </p>
          <TalentCard talent={previewTalent} t={t} isDark={isDark} isSaved={false} previewMode />

          <div className={`mt-6 ${t.card} border ${t.border} rounded-2xl p-5 space-y-4`}>
            <SeekingDetailRow icon={Eye} label="Visibility" value={previewTalent.visibility} t={t} isDark={isDark} />
            <SeekingDetailRow icon={CalendarClock} label="Post Duration" value={draft.duration} t={t} isDark={isDark} />
            <SeekingDetailRow icon={Sparkles} label="Skills" value={draft.skills.join(', ')} t={t} isDark={isDark} />
          </div>

          <div className={`flex gap-3 mt-8 pt-5 border-t ${t.borderSoft}`}>
            <button
              type="button"
              onClick={() => setStep('form')}
              className={`h-14 px-6 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} active:scale-[0.97] transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-14 rounded-xl font-extrabold text-base bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40 active:scale-[0.97] transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}
    </FormColumn>
    </PageContainer>
  );
}
