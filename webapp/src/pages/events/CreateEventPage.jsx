import { publishDepartmentEvent, currentAccess } from '../../../../src/shared/departmentStore';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Plus, Trash2, X, CalendarRange, Clock, UserPlus,
  AlertCircle, ListPlus, CalendarDays, MapPin, User, Lock,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, PageHeader, FormColumn } from '../../components/layout/AppShell';
import { Button, Card, Field, FieldLabel, IconButton, Select, TextArea, TextInput } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';
import { findDepartmentById } from '../../data/departments';
import { getViewerIdentity } from '../../data/people';
import { getDepartmentAccess } from '../../lib/departmentAccess';
import { EntityAvatar } from '../../features/departments/DepartmentPrimitives';
import {
  EVENT_FORM_CATEGORIES, ORGANIZER_TYPES, MAX_EVENT_DAYS,
  countEventDays, listEventDays, describeEventRange, formatDeadline, formatTime12h,
  newActivity, isActivityTimeInvalid, validateEventDraft, emptyEventDraft, formatOrganizer,
} from '../../features/events/eventForm';

/* ---------------------------------------------------------------------------
   /events/create — the event creation flow (client brief, Event Creation
   Updates). Same structure as the mobile CreateEventScreen.

   The form is five numbered sections, in the order an organiser actually
   decides things: what it is → who runs it → when it happens → how people
   get in → what happens each day. Then the practical details.

   · Organizers — ONLY the entities typed in by hand, each with an
     Organizer Type, as removable chips ("Mahfuz Ahmed · Club"). The
     publishing account is never added implicitly; one tap ("Add myself")
     makes it an organizer when it really is one.
   · Posted by — the publishing account, shown read-only above the form
     and derived automatically (you, or the department with `?as=`).
   · Category — "Other" reveals a field to name it.
   · When — Starting + Ending date. The range alone decides the length
     ("3-day event · Thu, Oct 1 – Sat, Oct 3").
   · Registration — the deadline is a date AND a time, previewed in words
     ("Closes October 1, 2026 - 11:59 PM").
   · Schedule — generated from the range: one section per day
     ("Day 1 - October 1, 2026 (Thursday)"), each with any number of
     activities (start, end, details). It rebuilds as the range changes.

   `?as=<deptId>` posts the event as a department hub, exactly like
   `/jobs/post?as=` — one campus calendar; only "Posted by" changes.
--------------------------------------------------------------------------- */

const FormSection = ({ step, title, hint, icon: Icon, children }) => {
  const { t, isDark } = useTheme();
  return (
    <Card className="space-y-5">
      <div className="flex items-start gap-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${isDark ? 'bg-[#1D9BF0]/15 text-[#1D9BF0]' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
          {Icon ? <Icon className="w-4 h-4" strokeWidth={2.5} /> : step}
        </span>
        <div className="min-w-0">
          <h3 className={`text-base font-extrabold tracking-tight ${t.text}`}>{title}</h3>
          {hint && <p className={`text-[11px] font-bold ${t.textMuted} mt-0.5 leading-relaxed`}>{hint}</p>}
        </div>
      </div>
      {children}
    </Card>
  );
};

const ErrorText = ({ children }) => (children ? (
  <p role="alert" className="text-[11px] font-bold text-red-500 mt-1.5 ml-1 flex items-center gap-1">
    <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> {children}
  </p>
) : null);

export default function CreateEventPage() {
  const { t, isDark } = useTheme();
  const { authRole } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const asDept = findDepartmentById(searchParams.get('as'));
  const postingAsDept = asDept && getDepartmentAccess(asDept, authRole).canCreateEvent ? asDept : null;
  const goBack = useCloseTo(postingAsDept ? `/departments/${postingAsDept.id}` : '/events');
  const viewer = getViewerIdentity(authRole);

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

  /* Picking a start date fills an empty (or now-earlier) end date with the
     same day, so a single-day event needs one pick, not two. */
  const setStartDate = (e) => {
    const value = e.target.value;
    setDraft(d => ({ ...d, startDate: value, endDate: !d.endDate || d.endDate < value ? value : d.endDate }));
  };

  const addOrganizerEntry = (name, type) =>
    setDraft(d => (d.organizers.some(o => o.name.toLowerCase() === name.toLowerCase())
      ? d
      : { ...d, organizers: [...d.organizers, { id: `org-${Date.now()}`, name, type }] }));
  const addOrganizer = () => {
    const name = organizerName.trim();
    if (!name) return;
    addOrganizerEntry(name, organizerType);
    setOrganizerName('');
  };
  const removeOrganizer = (id) => setDraft(d => ({ ...d, organizers: d.organizers.filter(o => o.id !== id) }));

  const dayActivities = (dayNumber) => draft.schedule[dayNumber] || [];
  const setDayActivities = (dayNumber, next) =>
    setDraft(d => ({ ...d, schedule: { ...d.schedule, [dayNumber]: next } }));
  const addActivity = (dayNumber) => setDayActivities(dayNumber, [...dayActivities(dayNumber), newActivity()]);
  const updateActivity = (dayNumber, id, field, value) =>
    setDayActivities(dayNumber, dayActivities(dayNumber).map(a => (a.id === id ? { ...a, [field]: value } : a)));
  const removeActivity = (dayNumber, id) =>
    setDayActivities(dayNumber, dayActivities(dayNumber).filter(a => a.id !== id));

  const handlePublish = () => {
    if (asDept && !getDepartmentAccess(asDept, authRole).canCreateEvent) return;
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    const activityCount = days.reduce((n, day) => n + dayActivities(day.number).length, 0);
    if (postingAsDept && !currentAccess(postingAsDept, authRole).canCreateEvent) return;
    publishDepartmentEvent(draft, postingAsDept, authRole, viewer.fullName);
    setPublished({
      title: draft.title.trim(),
      category: draft.category === 'Other' ? draft.customCategory.trim() : draft.category,
      range: rangeSummary,
      deadline: draft.deadlineDate ? formatDeadline(draft.deadlineDate, draft.deadlineTime) : null,
      organizers: draft.organizers.map(formatOrganizer),
      postedBy: postedBy.name,
      activityCount,
    });
  };

  /* Posted by — derived from the publishing account, never typed. The
     "Add myself" shortcut offers that same identity as an organizer. */
  const postedBy = postingAsDept
    ? { name: `${postingAsDept.code} Department`, type: 'Department', note: `Department account · you are signed in as ${viewer.fullName}` }
    : { name: viewer.fullName, type: 'Individual', note: viewer.roleSub };
  const postedByIsOrganizer = draft.organizers.some(o => o.name.toLowerCase() === postedBy.name.toLowerCase());

  if (asDept && !getDepartmentAccess(asDept, authRole).canCreateEvent) return <PageContainer><p className={`py-8 ${t.text}`}>You need publishing access to create events for this department.</p><button className="text-[#1D9BF0]" onClick={() => navigate(`/departments/${asDept.id}`)}>Return to department</button></PageContainer>;
  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-center gap-3">
        <IconButton icon={ArrowLeft} label="Back" onClick={goBack} />
        <PageHeader
          className="flex-1"
          title={published ? 'Status' : 'Create Event'}
        />
      </div>

      {!published ? (
        <div className="space-y-5 mb-8">
          {/* Posted by — read-only metadata, not a form field: it is whoever
              publishes, so it is shown, never edited. */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/[0.06]'}`}>
            {postingAsDept ? (
              <EntityAvatar dept={postingAsDept} size="sm" />
            ) : (
              <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-black/5'}`}>
                <User className={`w-5 h-5 ${t.textMuted}`} strokeWidth={2} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} flex items-center gap-1`}>
                <Lock className="w-3 h-3" strokeWidth={2.5} /> Posted by
              </p>
              <p className={`text-sm font-extrabold ${t.text} truncate`}>{postedBy.name}</p>
              <p className={`text-[10px] font-bold ${t.textMuted} truncate`}>{postedBy.note}</p>
            </div>
            {postingAsDept && (
              <button
                onClick={() => navigate('/events/create', { replace: true })}
                className="text-[#1D9BF0] text-[11px] font-extrabold hover:underline shrink-0"
              >
                Post as myself
              </button>
            )}
          </div>

          {/* ------------------------------------------------ 1 · basics */}
          <FormSection step={1} title="The event" hint="What it is and how many people it can take.">
            <Field label="Event Title">
              <TextInput type="text" placeholder="e.g. Annual Tech Symposium" value={draft.title} onChange={set('title')} />
              <ErrorText>{visibleErrors.title}</ErrorText>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category">
                <Select options={EVENT_FORM_CATEGORIES} value={draft.category} onChange={(v) => setDraft(d => ({ ...d, category: v }))} aria-label="Category" />
              </Field>
              <Field label="Capacity">
                <TextInput type="number" min="1" placeholder="e.g. 150" value={draft.capacity} onChange={set('capacity')} />
              </Field>
            </div>

            {draft.category === 'Other' && (
              <div className="animate-fade-in">
                <Field label="Name the category">
                  <TextInput type="text" placeholder="e.g. Alumni Reunion" value={draft.customCategory} onChange={set('customCategory')} autoFocus />
                  <ErrorText>{visibleErrors.customCategory}</ErrorText>
                </Field>
              </div>
            )}
          </FormSection>

          {/* -------------------------------------------- 2 · organizers */}
          <FormSection step={2} title="Organizers" hint="The clubs, offices, partners or people running this event. Only who you add here is listed as an organizer.">
            {draft.organizers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {draft.organizers.map(org => (
                  <span key={org.id} className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 h-9 rounded-xl border animate-scale-up ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-black/[0.06]'}`}>
                    <span className={`text-xs font-extrabold ${t.text}`}>{org.name}</span>
                    <span className={`text-xs font-bold ${t.textMuted}`}>· {org.type}</span>
                    <button
                      type="button"
                      onClick={() => removeOrganizer(org.id)}
                      aria-label={`Remove ${org.name}`}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.textMuted} ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} hover:text-red-500 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className={`text-xs font-bold ${t.textMuted} px-3.5 py-3 rounded-xl border border-dashed ${isDark ? 'border-white/15' : 'border-black/10'}`}>
                No organizers yet — add at least one below.
              </p>
            )}
            <ErrorText>{visibleErrors.organizers}</ErrorText>

            <div>
              <FieldLabel>Add an Organizer</FieldLabel>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <TextInput
                    type="text"
                    icon={UserPlus}
                    placeholder="e.g. NSU ACM Student Chapter"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOrganizer(); } }}
                    aria-label="Organizer name"
                  />
                </div>
                <div className="sm:w-48">
                  <Select options={ORGANIZER_TYPES} value={organizerType} onChange={setOrganizerType} aria-label="Organizer Type" />
                </div>
                {/* `md` is the input height (h-12, rounded-xl), so the three
                    controls on this row share one baseline and one height. */}
                <Button variant="soft" size="md" icon={Plus} onClick={addOrganizer} disabled={!organizerName.trim()} className="sm:w-auto shrink-0">
                  Add
                </Button>
              </div>
              {/* The poster is an organizer only if they say so — one tap. */}
              {!postedByIsOrganizer && (
                <button
                  type="button"
                  onClick={() => addOrganizerEntry(postedBy.name, postedBy.type)}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#1D9BF0] hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Add {postingAsDept ? postedBy.name : 'myself'} as an organizer
                </button>
              )}
            </div>
          </FormSection>

          {/* ------------------------------------------------ 3 · when */}
          <FormSection step={3} title="When" hint="The starting and ending dates set how many days the event runs.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Starting Date">
                <TextInput type="date" value={draft.startDate} onChange={setStartDate} className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
                <ErrorText>{visibleErrors.startDate}</ErrorText>
              </Field>
              <Field label="Ending Date">
                <TextInput type="date" value={draft.endDate} min={draft.startDate || undefined} onChange={set('endDate')} className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
                <ErrorText>{visibleErrors.endDate || (dayCount > MAX_EVENT_DAYS ? errors.endDate : null)}</ErrorText>
              </Field>
            </div>
            {rangeSummary && dayCount <= MAX_EVENT_DAYS && (
              <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border animate-fade-in ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.06] border-[#1D9BF0]/15'}`}>
                <CalendarRange className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{rangeSummary}</span>
              </div>
            )}
          </FormSection>

          {/* ------------------------------------------ 4 · registration */}
          <FormSection step={4} title="Registration deadline" hint="Registration closes at this exact date and time.">
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-2 gap-4">
              <Field label="Deadline Date">
                <TextInput type="date" value={draft.deadlineDate} max={draft.endDate || undefined} onChange={set('deadlineDate')} className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
              </Field>
              <Field label="Time">
                <TextInput type="time" value={draft.deadlineTime} onChange={set('deadlineTime')} className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
              </Field>
            </div>
            {draft.deadlineDate && (
              <p className={`text-xs font-bold ${t.textMuted} flex items-center gap-2 -mt-1 animate-fade-in`}>
                <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                Closes <span className={`font-extrabold ${t.text}`}>{formatDeadline(draft.deadlineDate, draft.deadlineTime)}</span>
              </p>
            )}
            <ErrorText>{visibleErrors.deadline || errors.deadline}</ErrorText>
          </FormSection>

          {/* ----------------------------------------------- 5 · schedule */}
          <FormSection
            step={5}
            title="Event schedule"
            hint={days.length ? `${days.length} ${days.length === 1 ? 'day' : 'days'}, built from your dates. Add as many activities to each day as you need.` : 'Built automatically from your dates — one section per day.'}
          >
            {days.length === 0 ? (
              <div className={`flex flex-col items-center text-center px-6 py-8 rounded-xl border border-dashed ${isDark ? 'border-white/15' : 'border-black/10'}`}>
                <CalendarDays className={`w-8 h-8 mb-3 ${t.textMuted}`} strokeWidth={1.75} />
                <p className={`text-sm font-extrabold ${t.text}`}>Pick your dates first</p>
                <p className={`text-xs font-bold ${t.textMuted} mt-1 max-w-xs`}>Choose a starting and ending date above and each day of the event appears here, ready for its activities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {days.map(day => {
                  const activities = dayActivities(day.number);
                  return (
                    <section
                      key={day.number}
                      aria-label={day.label}
                      className={`rounded-xl border overflow-hidden animate-fade-in ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/[0.06] bg-white/50'}`}
                    >
                      <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/[0.05] bg-black/[0.015]'}`}>
                        <span className="px-2 py-1 rounded-md bg-[#1D9BF0] text-white text-[10px] font-black uppercase tracking-wider shrink-0">Day {day.number}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-extrabold ${t.text} truncate`}>{day.dateLabel}</p>
                          <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{day.weekday}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold ${t.textMuted} shrink-0`}>
                          {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        {activities.map((act, idx) => {
                          const bad = isActivityTimeInvalid(act);
                          return (
                            <div key={act.id} className="animate-fade-in">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-[7.5rem_7.5rem_1fr] gap-2">
                                  <input
                                    type="time"
                                    value={act.start}
                                    onChange={(e) => updateActivity(day.number, act.id, 'start', e.target.value)}
                                    aria-label={`Day ${day.number} activity ${idx + 1} start time`}
                                    className={`${t.inputBg} border ${bad ? 'border-red-500/60' : t.inputBorder} rounded-xl h-11 px-2.5 text-xs font-bold ${t.text} outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`}
                                  />
                                  <input
                                    type="time"
                                    value={act.end}
                                    onChange={(e) => updateActivity(day.number, act.id, 'end', e.target.value)}
                                    aria-label={`Day ${day.number} activity ${idx + 1} end time`}
                                    className={`${t.inputBg} border ${bad ? 'border-red-500/60' : t.inputBorder} rounded-xl h-11 px-2.5 text-xs font-bold ${t.text} outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Activity details, e.g. Opening keynote"
                                    value={act.details}
                                    onChange={(e) => updateActivity(day.number, act.id, 'details', e.target.value)}
                                    aria-label={`Day ${day.number} activity ${idx + 1} details`}
                                    className={`col-span-2 sm:col-span-1 min-w-0 ${t.inputBg} border ${t.inputBorder} rounded-xl h-11 px-3 text-xs font-bold ${t.text} outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm placeholder:font-bold`}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeActivity(day.number, act.id)}
                                  aria-label={`Remove Day ${day.number} activity ${idx + 1}`}
                                  className="w-10 h-11 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl shrink-0 active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {bad
                                ? <ErrorText>Ends before it starts.</ErrorText>
                                : act.start && act.end && (
                                  <p className={`text-[10px] font-bold ${t.textMuted} mt-1.5 ml-1`}>{formatTime12h(act.start)} – {formatTime12h(act.end)}</p>
                                )}
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => addActivity(day.number)}
                          className={`w-full h-11 rounded-xl border border-dashed text-xs font-extrabold flex items-center justify-center gap-1.5 text-[#1D9BF0] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${isDark ? 'border-[#1D9BF0]/30 hover:bg-[#1D9BF0]/10' : 'border-[#1D9BF0]/30 hover:bg-[#1D9BF0]/[0.06]'}`}
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
          </FormSection>

          {/* ------------------------------------------------ details */}
          <FormSection title="Venue & details" icon={MapPin} hint="Where it is, and what attendees should know.">
            <Field label="Venue">
              <div className="space-y-3">
                <TextInput type="text" placeholder="e.g. AUDI 801" value={draft.venue} onChange={set('venue')} />
                <TextInput type="text" placeholder="Venue Details (e.g. Admin Building, Level 8)" value={draft.venueDetails} onChange={set('venueDetails')} />
              </div>
            </Field>
            <Field label="Cover Image URL">
              <TextInput type="url" placeholder="https://..." value={draft.image} onChange={set('image')} />
            </Field>
            <Field label="Description">
              <TextArea rows={4} placeholder="What is this event about?" value={draft.description} onChange={set('description')} />
            </Field>
            <Field label="Registration Info">
              <TextArea rows={2} placeholder="e.g. Free for CSE students" value={draft.registrationInfo} onChange={set('registrationInfo')} />
            </Field>
          </FormSection>

          {showErrors && Object.keys(errors).length > 0 && (
            <div role="alert" className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/25' : 'bg-red-50 border-red-200'}`}>
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className={`text-xs font-bold ${isDark ? 'text-red-300' : 'text-red-700'} space-y-0.5`}>
                {Object.values(errors).map(msg => <p key={msg}>{msg}</p>)}
              </div>
            </div>
          )}

          <Button full size="lg" onClick={handlePublish}>
            Publish Event
          </Button>
        </div>
      ) : (
        <Card padded={false} className="px-6 py-14 mb-8 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Event Created!</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-6 max-w-sm leading-relaxed`}>
            {postingAsDept
              ? `Your event is live on the campus calendar and on the ${postingAsDept.code} Department hub.`
              : 'Your event has been successfully published and is now live for students to register.'}
          </p>
          <div className={`w-full max-w-sm text-left rounded-xl border p-4 mb-8 space-y-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/[0.06]'}`}>
            <p className={`text-sm font-extrabold ${t.text}`}>{published.title}</p>
            <p className={`text-xs font-bold ${t.textMuted}`}>{published.category} · {published.range}</p>
            {published.deadline && <p className={`text-xs font-bold ${t.textMuted}`}>Registration closes {published.deadline}</p>}
            <p className={`text-xs font-bold ${t.textMuted}`}>
              {published.activityCount} scheduled {published.activityCount === 1 ? 'activity' : 'activities'}
            </p>
            <div className={`pt-2 mt-1 border-t space-y-1 ${isDark ? 'border-white/10' : 'border-black/[0.06]'}`}>
              <p className={`text-xs font-bold ${t.textMuted}`}>Organized by: <span className={`font-extrabold ${t.text}`}>{published.organizers.join(', ')}</span></p>
              <p className={`text-xs font-bold ${t.textMuted}`}>Posted by: <span className={`font-extrabold ${t.text}`}>{published.postedBy}</span></p>
            </div>
          </div>
          <Button
            variant="neutral"
            size="lg"
            className="w-full max-w-xs"
            onClick={() => navigate(postingAsDept ? `/departments/${postingAsDept.id}` : '/events')}
          >
            {postingAsDept ? `Back to ${postingAsDept.code} Hub` : 'Back to Events'}
          </Button>
        </Card>
      )}
    </FormColumn>
    </PageContainer>
  );
}
