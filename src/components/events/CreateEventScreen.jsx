import { useMemo, useState } from 'react';
import {
  ArrowLeft, CheckCircle2, Plus, Trash2, X, CalendarRange, Clock, Users, UserPlus,
  AlertCircle, ListPlus, CalendarDays, MapPin, ChevronDown,
} from 'lucide-react';
import { EntityAvatar } from '../department/DepartmentPrimitives';
import {
  EVENT_FORM_CATEGORIES, ORGANIZER_TYPES, MAX_EVENT_DAYS,
  countEventDays, listEventDays, describeEventRange, formatDeadline, formatTime12h,
  newActivity, isActivityTimeInvalid, validateEventDraft, emptyEventDraft,
} from './eventForm';

/* ---------------------------------------------------------------------------
   Create Event — the mobile screen. Mirrors the web app's
   `webapp/src/pages/events/CreateEventPage.jsx` section for section:

   1 The event (title, category with "Other" → name it, capacity)
   2 Organizers (fixed host + hand-typed co-organizers with a type)
   3 When (Starting / Ending date → "3-day event · Thu, Oct 1 – Sat, Oct 3")
   4 Registration deadline (date + time → "October 1, 2026 - 11:59 PM")
   5 Event schedule (one section per day of the range, each with any
     number of activities: start, end, details)
   + Venue & details

   `hostDept` hosts the event as a department hub (its Official / Admins);
   otherwise the signed-in person (`viewerName`) is the host.
--------------------------------------------------------------------------- */

const labelCls = (t) => `text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`;
const inputCls = (t, extra = '') => `w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold ${extra}`;

const Section = ({ step, icon: Icon, title, hint, t, isDark, children }) => (
  <div className={`rounded-2xl p-5 ${t.card} border ${t.border} space-y-4`}>
    <div className="flex items-start gap-3">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${isDark ? 'bg-[#1D9BF0]/15' : 'bg-[#1D9BF0]/10'} text-[#1D9BF0]`}>
        {Icon ? <Icon className="w-4 h-4" strokeWidth={2.5} /> : step}
      </span>
      <div className="min-w-0">
        <h3 className={`text-base font-extrabold tracking-tight ${t.text}`}>{title}</h3>
        {hint && <p className={`text-[11px] font-bold ${t.textMuted} mt-0.5 leading-relaxed`}>{hint}</p>}
      </div>
    </div>
    {children}
  </div>
);

const ErrorText = ({ children }) => (children ? (
  <p role="alert" className="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1">
    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> {children}
  </p>
) : null);

const Select = ({ t, value, onChange, options, ariaLabel }) => (
  <div className="relative">
    <select value={value} onChange={onChange} aria-label={ariaLabel} className={inputCls(t, 'appearance-none pr-9')}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted} pointer-events-none`} strokeWidth={2.5} />
  </div>
);

export const CreateEventScreen = ({ onClose, t, isDark, hostDept = null, viewerName = 'You' }) => {
  const [draft, setDraft] = useState(emptyEventDraft);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerType, setOrganizerType] = useState(ORGANIZER_TYPES[0]);
  const [showErrors, setShowErrors] = useState(false);
  const [published, setPublished] = useState(null);

  const set = (field) => (e) => setDraft(d => ({ ...d, [field]: e.target.value }));
  const days = useMemo(() => listEventDays(draft.startDate, draft.endDate), [draft.startDate, draft.endDate]);
  const dayCount = countEventDays(draft.startDate, draft.endDate);
  const rangeSummary = describeEventRange(draft.startDate, draft.endDate);
  const errors = validateEventDraft(draft);
  const visibleErrors = showErrors ? errors : {};

  const setStartDate = (e) => {
    const value = e.target.value;
    setDraft(d => ({ ...d, startDate: value, endDate: !d.endDate || d.endDate < value ? value : d.endDate }));
  };

  const addOrganizer = () => {
    const name = organizerName.trim();
    if (!name) return;
    setDraft(d => (d.organizers.some(o => o.name.toLowerCase() === name.toLowerCase())
      ? d
      : { ...d, organizers: [...d.organizers, { id: `org-${Date.now()}`, name, type: organizerType }] }));
    setOrganizerName('');
  };
  const removeOrganizer = (id) => setDraft(d => ({ ...d, organizers: d.organizers.filter(o => o.id !== id) }));

  const dayActivities = (n) => draft.schedule[n] || [];
  const setDayActivities = (n, next) => setDraft(d => ({ ...d, schedule: { ...d.schedule, [n]: next } }));
  const addActivity = (n) => setDayActivities(n, [...dayActivities(n), newActivity()]);
  const updateActivity = (n, id, field, value) =>
    setDayActivities(n, dayActivities(n).map(a => (a.id === id ? { ...a, [field]: value } : a)));
  const removeActivity = (n, id) => setDayActivities(n, dayActivities(n).filter(a => a.id !== id));

  const handlePublish = () => {
    if (Object.keys(errors).length > 0) { setShowErrors(true); return; }
    setPublished({
      title: draft.title.trim(),
      category: draft.category === 'Other' ? draft.customCategory.trim() : draft.category,
      range: rangeSummary,
      deadline: draft.deadlineDate ? formatDeadline(draft.deadlineDate, draft.deadlineTime) : null,
      activityCount: days.reduce((n, day) => n + dayActivities(day.number).length, 0),
      organizers: draft.organizers.length,
    });
  };

  const hostName = hostDept ? `${hostDept.code} Department` : viewerName;
  const dateCls = inputCls(t, '[&::-webkit-calendar-picker-indicator]:opacity-50');

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <button onClick={onClose} aria-label="Back" className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col items-center min-w-0 px-3">
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>{published ? 'Status' : 'Create Event'}</h2>
          {!published && hostDept && (
            <p className={`text-[10px] font-bold ${t.textMuted} truncate`}>Hosting as {hostDept.code} Department</p>
          )}
        </div>
        <div className="w-10 h-10"></div>
      </div>

      {!published ? (
        <>
          <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-5 space-y-4">
            {/* 1 · the event */}
            <Section step={1} title="The event" hint="What it is and how many people it can take." t={t} isDark={isDark}>
              <div>
                <label className={labelCls(t)}>Event Title</label>
                <input type="text" placeholder="e.g. Annual Tech Symposium" value={draft.title} onChange={set('title')} className={inputCls(t)} />
                <ErrorText>{visibleErrors.title}</ErrorText>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls(t)}>Category</label>
                  <Select t={t} value={draft.category} onChange={set('category')} options={EVENT_FORM_CATEGORIES} ariaLabel="Category" />
                </div>
                <div>
                  <label className={labelCls(t)}>Capacity</label>
                  <input type="number" min="1" placeholder="e.g. 150" value={draft.capacity} onChange={set('capacity')} className={inputCls(t)} />
                </div>
              </div>
              {draft.category === 'Other' && (
                <div className="animate-fade-in">
                  <label className={labelCls(t)}>Name the category</label>
                  <input type="text" placeholder="e.g. Alumni Reunion" value={draft.customCategory} onChange={set('customCategory')} className={inputCls(t)} autoFocus />
                  <ErrorText>{visibleErrors.customCategory}</ErrorText>
                </div>
              )}
            </Section>

            {/* 2 · organizers */}
            <Section step={2} title="Organizers" hint="You host it. Add the clubs, offices, partners or people running it with you." t={t} isDark={isDark}>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/25' : 'bg-[#1D9BF0]/[0.06] border-[#1D9BF0]/20'}`}>
                  {hostDept ? (
                    <EntityAvatar dept={hostDept} size="xs" isDark={isDark} />
                  ) : (
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                      <Users className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className={`block text-xs font-extrabold ${t.text} leading-tight`}>{hostName}</span>
                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#1D9BF0]">Host</span>
                  </span>
                </span>
                {draft.organizers.map(org => (
                  <span key={org.id} className={`inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl border animate-scale-up ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-black/[0.06]'}`}>
                    <span className="min-w-0">
                      <span className={`block text-xs font-extrabold ${t.text} leading-tight`}>{org.name}</span>
                      <span className={`block text-[9px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{org.type}</span>
                    </span>
                    <button type="button" onClick={() => removeOrganizer(org.id)} aria-label={`Remove ${org.name}`} className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.textMuted} active:text-red-500`}>
                      <X className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
              <div>
                <label className={labelCls(t)}>Add an organizer</label>
                <div className="relative mb-2">
                  <UserPlus className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted} pointer-events-none`} strokeWidth={2.5} />
                  <input
                    type="text"
                    placeholder="e.g. NSU ACM Student Chapter"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOrganizer(); } }}
                    aria-label="Organizer name"
                    className={inputCls(t, 'pl-10')}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <Select t={t} value={organizerType} onChange={(e) => setOrganizerType(e.target.value)} options={ORGANIZER_TYPES} ariaLabel="Organizer type" />
                  </div>
                  <button
                    type="button"
                    onClick={addOrganizer}
                    disabled={!organizerName.trim()}
                    className="h-12 px-5 rounded-xl bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 font-extrabold text-sm flex items-center active:scale-95 transition-transform disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-1" strokeWidth={3} /> Add
                  </button>
                </div>
              </div>
            </Section>

            {/* 3 · when */}
            <Section step={3} title="When" hint="The starting and ending dates set how many days the event runs." t={t} isDark={isDark}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls(t)}>Starting Date</label>
                  <input type="date" value={draft.startDate} onChange={setStartDate} className={dateCls} />
                  <ErrorText>{visibleErrors.startDate}</ErrorText>
                </div>
                <div>
                  <label className={labelCls(t)}>Ending Date</label>
                  <input type="date" value={draft.endDate} min={draft.startDate || undefined} onChange={set('endDate')} className={dateCls} />
                </div>
              </div>
              <ErrorText>{visibleErrors.endDate || (dayCount > MAX_EVENT_DAYS ? errors.endDate : null)}</ErrorText>
              {rangeSummary && dayCount <= MAX_EVENT_DAYS && (
                <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border animate-fade-in ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.06] border-[#1D9BF0]/15'}`}>
                  <CalendarRange className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />
                  <span className={`text-xs font-extrabold ${t.text}`}>{rangeSummary}</span>
                </div>
              )}
            </Section>

            {/* 4 · registration deadline */}
            <Section step={4} title="Registration deadline" hint="Registration closes at this exact date and time." t={t} isDark={isDark}>
              <div className="grid grid-cols-[1fr_8rem] gap-3">
                <div>
                  <label className={labelCls(t)}>Deadline Date</label>
                  <input type="date" value={draft.deadlineDate} max={draft.endDate || undefined} onChange={set('deadlineDate')} className={dateCls} />
                </div>
                <div>
                  <label className={labelCls(t)}>Time</label>
                  <input type="time" value={draft.deadlineTime} onChange={set('deadlineTime')} className={inputCls(t, 'px-2.5 [&::-webkit-calendar-picker-indicator]:opacity-50')} />
                </div>
              </div>
              {draft.deadlineDate && (
                <p className={`text-xs font-bold ${t.textMuted} flex items-center gap-2 animate-fade-in`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                  <span>Closes <span className={`font-extrabold ${t.text}`}>{formatDeadline(draft.deadlineDate, draft.deadlineTime)}</span></span>
                </p>
              )}
              <ErrorText>{visibleErrors.deadline || errors.deadline}</ErrorText>
            </Section>

            {/* 5 · schedule */}
            <Section
              step={5}
              title="Event schedule"
              hint={days.length ? `${days.length} ${days.length === 1 ? 'day' : 'days'}, built from your dates. Add as many activities to each day as you need.` : 'Built automatically from your dates — one section per day.'}
              t={t}
              isDark={isDark}
            >
              {days.length === 0 ? (
                <div className={`flex flex-col items-center text-center px-5 py-7 rounded-xl border border-dashed ${isDark ? 'border-white/15' : 'border-black/10'}`}>
                  <CalendarDays className={`w-8 h-8 mb-3 ${t.textMuted}`} strokeWidth={1.75} />
                  <p className={`text-sm font-extrabold ${t.text}`}>Pick your dates first</p>
                  <p className={`text-xs font-bold ${t.textMuted} mt-1`}>Each day of the event appears here, ready for its activities.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {days.map(day => {
                    const activities = dayActivities(day.number);
                    return (
                      <section key={day.number} aria-label={day.label} className={`rounded-xl border overflow-hidden animate-fade-in ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/[0.06] bg-white/50'}`}>
                        <div className={`flex items-center gap-3 px-3.5 py-3 border-b ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/[0.05] bg-black/[0.015]'}`}>
                          <span className="px-2 py-1 rounded-md bg-[#1D9BF0] text-white text-[10px] font-black uppercase tracking-wider shrink-0">Day {day.number}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[13px] font-extrabold ${t.text} truncate`}>{day.dateLabel}</p>
                            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{day.weekday}</p>
                          </div>
                          <span className={`text-[10px] font-extrabold ${t.textMuted} shrink-0`}>{activities.length}</span>
                        </div>
                        <div className="p-3.5 space-y-3">
                          {activities.map((act, idx) => {
                            const bad = isActivityTimeInvalid(act);
                            const timeCls = `${t.inputBg} border ${bad ? 'border-red-500/60' : t.inputBorder} rounded-xl h-11 px-2 text-xs font-bold ${t.text} focus:outline-none shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`;
                            return (
                              <div key={act.id} className={`p-3 rounded-xl border animate-fade-in ${isDark ? 'border-white/10 bg-black/20' : 'border-black/[0.05] bg-white/70'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <input type="time" value={act.start} onChange={(e) => updateActivity(day.number, act.id, 'start', e.target.value)} aria-label={`Day ${day.number} activity ${idx + 1} start time`} className={`flex-1 min-w-0 ${timeCls}`} />
                                  <span className={`text-[10px] font-extrabold ${t.textMuted}`}>to</span>
                                  <input type="time" value={act.end} onChange={(e) => updateActivity(day.number, act.id, 'end', e.target.value)} aria-label={`Day ${day.number} activity ${idx + 1} end time`} className={`flex-1 min-w-0 ${timeCls}`} />
                                  <button type="button" onClick={() => removeActivity(day.number, act.id)} aria-label={`Remove Day ${day.number} activity ${idx + 1}`} className="w-10 h-11 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl shrink-0 active:scale-95 transition-transform">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Activity details, e.g. Opening keynote"
                                  value={act.details}
                                  onChange={(e) => updateActivity(day.number, act.id, 'details', e.target.value)}
                                  aria-label={`Day ${day.number} activity ${idx + 1} details`}
                                  className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-11 px-3 text-xs font-bold ${t.text} focus:outline-none shadow-sm placeholder:font-bold`}
                                />
                                {bad
                                  ? <ErrorText>Ends before it starts.</ErrorText>
                                  : act.start && act.end && <p className={`text-[10px] font-bold ${t.textMuted} mt-1.5 ml-1`}>{formatTime12h(act.start)} – {formatTime12h(act.end)}</p>}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => addActivity(day.number)}
                            className="w-full h-11 rounded-xl border border-dashed border-[#1D9BF0]/30 text-xs font-extrabold flex items-center justify-center gap-1.5 text-[#1D9BF0] active:bg-[#1D9BF0]/10 transition-colors"
                          >
                            <ListPlus className="w-4 h-4" strokeWidth={2.5} />
                            {activities.length ? 'Add another activity' : `Add an activity to Day ${day.number}`}
                          </button>
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
              <ErrorText>{visibleErrors.schedule}</ErrorText>
            </Section>

            {/* details */}
            <Section icon={MapPin} title="Venue & details" hint="Where it is, and what attendees should know." t={t} isDark={isDark}>
              <div>
                <label className={labelCls(t)}>Venue</label>
                <input type="text" placeholder="e.g. AUDI 801" value={draft.venue} onChange={set('venue')} className={inputCls(t, 'mb-3')} />
                <input type="text" placeholder="Venue Details (e.g. Admin Building, Level 8)" value={draft.venueDetails} onChange={set('venueDetails')} className={inputCls(t)} />
              </div>
              <div>
                <label className={labelCls(t)}>Cover Image URL</label>
                <input type="url" placeholder="https://..." value={draft.image} onChange={set('image')} className={inputCls(t)} />
              </div>
              <div>
                <label className={labelCls(t)}>Description</label>
                <textarea rows="4" placeholder="What is this event about?" value={draft.description} onChange={set('description')} className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
              </div>
              <div>
                <label className={labelCls(t)}>Registration Info</label>
                <textarea rows="2" placeholder="e.g. Free for CSE students" value={draft.registrationInfo} onChange={set('registrationInfo')} className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
              </div>
            </Section>

            {showErrors && Object.keys(errors).length > 0 && (
              <div role="alert" className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/25' : 'bg-red-50 border-red-200'}`}>
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className={`text-xs font-bold ${isDark ? 'text-red-300' : 'text-red-700'} space-y-0.5`}>
                  {Object.values(errors).map(msg => <p key={msg}>{msg}</p>)}
                </div>
              </div>
            )}
          </div>

          <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
            <button onClick={handlePublish} className="w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40">
              Publish Event
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in-up pb-20">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Event Created!</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-6 max-w-xs leading-relaxed`}>
            {hostDept
              ? `Your event is live on the campus calendar and on the ${hostDept.code} Department hub.`
              : 'Your event has been successfully published and is now live for students to register.'}
          </p>
          <div className={`w-full text-left rounded-xl border p-4 mb-8 space-y-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/[0.06]'}`}>
            <p className={`text-sm font-extrabold ${t.text}`}>{published.title}</p>
            <p className={`text-xs font-bold ${t.textMuted}`}>{published.category} · {published.range}</p>
            {published.deadline && <p className={`text-xs font-bold ${t.textMuted}`}>Registration closes {published.deadline}</p>}
            <p className={`text-xs font-bold ${t.textMuted}`}>
              {published.activityCount} scheduled {published.activityCount === 1 ? 'activity' : 'activities'}
              {published.organizers > 0 && ` · ${published.organizers} co-${published.organizers === 1 ? 'organizer' : 'organizers'}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} shadow-sm`}
          >
            {hostDept ? `Back to ${hostDept.code} Hub` : 'Back to Events'}
          </button>
        </div>
      )}
    </div>
  );
};
