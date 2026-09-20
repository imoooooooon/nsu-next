// --- SEEKING WORK (JOBS › SEEKING MODE) ---

// Complete category labels. Used in cards, details, filters and the create form.
export const SEEKING_CATEGORIES = [
  'Internship', 'Tuition', 'Part-Time', 'Full-Time',
  'Freelance / Project', 'TA', 'RA', 'Campus Ambassador'
];

// Short quick-filter chip labels mapped to their complete category label.
export const SEEKING_CATEGORY_CHIPS = [
  { label: 'All', value: 'All' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Tuition', value: 'Tuition' },
  { label: 'Part-Time', value: 'Part-Time' },
  { label: 'Full-Time', value: 'Full-Time' },
  { label: 'Freelance', value: 'Freelance / Project' },
  { label: 'TA', value: 'TA' },
  { label: 'RA', value: 'RA' },
  { label: 'Ambassador', value: 'Campus Ambassador' }
];

export const SEEKING_WORK_MODES = ['Remote', 'On-site', 'Hybrid'];
export const SEEKING_AVAILABILITY = ['Available immediately', 'Weekdays', 'Weekends', 'Flexible'];
export const SEEKING_DEPARTMENTS = ['CSE', 'ECE', 'BBA', 'Architecture', 'Economics', 'Pharmacy', 'English'];
export const SEEKING_SORTS = ['Relevant', 'Most Recent', 'Available Now'];
export const SEEKING_DURATIONS = ['14 days', '30 days', '60 days'];
export const SEEKING_COMMITMENTS = ['Internship', 'Part-Time', 'Full-Time', 'Project based', 'Flexible'];
export const SEEKING_COMPENSATIONS = ['Open to discussion', 'Paid only', 'Unpaid / experience based', 'Hourly rate'];
export const SEEKING_VISIBILITY_OPTIONS = ['Entire verified university network', 'Alumni and faculty only'];
export const SEEKING_SUGGESTED_SKILLS = ['React', 'Python', 'Figma', 'Canva', 'Public Speaking', 'Data Analysis', 'Copywriting', 'Excel'];
export const SEEKING_MESSAGE_PROMPTS = [
  'Hi, I saw your Seeking Work post.',
  'Are you still available?',
  'I may have an opportunity that matches your skills.'
];

export const SEEKING_HEADLINE_MAX = 60;
export const SEEKING_INTRO_MAX = 400;
export const SEEKING_SKILLS_MAX = 8;

export const EMPTY_SEEKING_FILTERS = {
  categories: [],
  workModes: [],
  availability: [],
  departments: [],
  verifiedOnly: false,
  hasPortfolio: false,
  hasResume: false,
  sort: 'Relevant'
};

export const SEEKING_STATUS_LABEL = {
  active: 'Active',
  pending: 'Pending review',
  paused: 'Paused',
  expired: 'Expired',
  draft: 'Draft'
};
