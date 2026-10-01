/* ---------------------------------------------------------------------------
   Create Event — the form's date and schedule logic, kept out of the UI.
   Same logic as the mobile module `src/components/events/eventForm.js`;
   change both together.

   The client brief: an event has a START and an END date; the range alone
   decides how many days the event runs, and the schedule is generated from
   it — "Day 1 - October 1, 2026 (Thursday)", one section per day, each with
   its own list of activities (start time, end time, details).

   Dates travel as ISO "YYYY-MM-DD" strings (what <input type="date"> gives)
   and are parsed as LOCAL dates — `new Date('2026-10-01')` is UTC midnight
   and would land on September 30 anywhere west of Greenwich.
--------------------------------------------------------------------------- */

export const EVENT_FORM_CATEGORIES = [
  'Academic', 'Workshop', 'Competition', 'Career', 'Recruitment', 'Networking',
  'Research', 'Cultural', 'Sports', 'Volunteer', 'Other',
];

export const ORGANIZER_TYPES = ['Club', 'Department', 'University Office', 'External Partner', 'Individual'];

/* A month is plenty for any campus event (exhibitions run a week or two);
   beyond it the schedule would become an endless wall of empty days. */
export const MAX_EVENT_DAYS = 31;

const DAY_MS = 24 * 60 * 60 * 1000;

export const parseISODate = (iso) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/* Inclusive day count: Oct 1 → Oct 3 is 3 days. 0 when the range is
   incomplete or backwards. Math.round absorbs a DST hour. */
export const countEventDays = (startISO, endISO) => {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end || end < start) return 0;
  return Math.round((end - start) / DAY_MS) + 1;
};

const longDate = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const weekday = (date) => date.toLocaleDateString('en-US', { weekday: 'long' });
const shortDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

/* One entry per event day: { key: ISO date, number, dateLabel, weekday, label }.
   `label` is the brief's exact wording: "Day 1 - October 1, 2026 (Thursday)". */
export const listEventDays = (startISO, endISO) => {
  const total = Math.min(countEventDays(startISO, endISO), MAX_EVENT_DAYS);
  const start = parseISODate(startISO);
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const dateLabel = longDate(date);
    return {
      key: toISODate(date),
      number: i + 1,
      dateLabel,
      weekday: weekday(date),
      label: `Day ${i + 1} - ${dateLabel} (${weekday(date)})`,
    };
  });
};

/* "3-day event · Thu, Oct 1 – Sat, Oct 3" / "Single-day event · Thu, Oct 1". */
export const describeEventRange = (startISO, endISO) => {
  const days = countEventDays(startISO, endISO);
  if (!days) return null;
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (days === 1) return `Single-day event · ${shortDate(start)}`;
  return `${days}-day event · ${shortDate(start)} – ${shortDate(end)}`;
};

/* "23:59" → "11:59 PM". */
export const formatTime12h = (hhmm) => {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
};

/* The brief's example format: "October 1, 2026 - 11:59 PM". */
export const formatDeadline = (dateISO, timeHHMM) => {
  const date = parseISODate(dateISO);
  if (!date) return '';
  const time = formatTime12h(timeHHMM);
  return time ? `${longDate(date)} - ${time}` : longDate(date);
};

let activitySeq = 0;
export const newActivity = () => ({ id: `act-${Date.now()}-${activitySeq++}`, start: '', end: '', details: '' });

/* An activity whose end is not after its start. Empty times are not errors
   yet — the organiser may still be typing. */
export const isActivityTimeInvalid = (activity) =>
  Boolean(activity.start && activity.end && activity.end <= activity.start);

/* Everything the publish button must not let through, as plain messages. */
export const validateEventDraft = (draft) => {
  const errors = {};
  if (!draft.title.trim()) errors.title = 'Give the event a title.';
  if (draft.category === 'Other' && !draft.customCategory.trim()) errors.customCategory = 'Name the category.';
  if (!draft.startDate) errors.startDate = 'Pick a starting date.';
  if (!draft.endDate) errors.endDate = 'Pick an ending date.';
  const days = countEventDays(draft.startDate, draft.endDate);
  if (draft.startDate && draft.endDate && !days) errors.endDate = 'The ending date is before the starting date.';
  if (days > MAX_EVENT_DAYS) errors.endDate = `An event can run up to ${MAX_EVENT_DAYS} days.`;
  if (draft.deadlineDate && draft.endDate && draft.deadlineDate > draft.endDate) {
    errors.deadline = 'Registration should close before the event ends.';
  }
  const inRange = Math.min(days, MAX_EVENT_DAYS);
  const badTimes = Array.from({ length: inRange }, (_, i) => draft.schedule[i + 1] || [])
    .flat()
    .some(isActivityTimeInvalid);
  if (badTimes) errors.schedule = 'An activity ends before it starts.';
  return errors;
};

export const emptyEventDraft = () => ({
  title: '',
  category: 'Academic',
  customCategory: '',
  capacity: '',
  organizers: [],
  startDate: '',
  endDate: '',
  deadlineDate: '',
  deadlineTime: '23:59',
  /* { [day number]: activity[] } — keyed by DAY, not date: correcting a
     wrong range (Oct 1–3 → Oct 8–10) keeps Day 1's agenda on Day 1. Days
     beyond a shortened range are hidden, not deleted, so lengthening it
     again brings them back. */
  schedule: {},
  venue: '',
  venueDetails: '',
  image: '',
  description: '',
  registrationInfo: '',
});
