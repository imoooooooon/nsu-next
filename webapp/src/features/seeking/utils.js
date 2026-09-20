import {
  SEEKING_CATEGORIES, SEEKING_AVAILABILITY, SEEKING_COMMITMENTS,
  SEEKING_COMPENSATIONS, SEEKING_VISIBILITY_OPTIONS, SEEKING_SKILLS_MAX
} from './constants';

export const countSeekingFilters = (f) => {
  if (!f) return 0;
  return (f.categories?.length || 0) + (f.workModes?.length || 0) +
    (f.availability?.length || 0) + (f.departments?.length || 0) +
    (f.verifiedOnly ? 1 : 0) + (f.hasPortfolio ? 1 : 0) + (f.hasResume ? 1 : 0) +
    (f.sort && f.sort !== 'Relevant' ? 1 : 0);
};

// Subtle tinted category pills. The label text is always rendered alongside.
export const getSeekingCategoryStyle = (category, isDark) => {
  const map = {
    'Internship': isDark ? 'bg-blue-500/15 text-blue-300 border-blue-400/25' : 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    'Tuition': isDark ? 'bg-amber-500/15 text-amber-300 border-amber-400/25' : 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    'Part-Time': isDark ? 'bg-purple-500/15 text-purple-300 border-purple-400/25' : 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    'Full-Time': isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    'Freelance / Project': isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/25' : 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
    'TA': isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/25' : 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    'RA': isDark ? 'bg-rose-500/15 text-rose-300 border-rose-400/25' : 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    'Campus Ambassador': isDark ? 'bg-orange-500/15 text-orange-300 border-orange-400/25' : 'bg-orange-500/10 text-orange-700 border-orange-500/20'
  };
  return map[category] || (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black/70 border-black/10');
};

export const getSeekingStatusStyle = (status, isDark) => {
  const map = {
    active: isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    pending: isDark ? 'bg-yellow-500/15 text-yellow-300 border-yellow-400/25' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    paused: isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10',
    expired: isDark ? 'bg-red-500/15 text-red-300 border-red-400/25' : 'bg-red-500/10 text-red-700 border-red-500/20',
    draft: isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10'
  };
  return map[status] || map.paused;
};

// A post can only be contacted while it is active.
export const isSeekingUnavailable = (status) => status === 'paused' || status === 'expired';

// The signed-in demo profiles, reused so the create form never re-asks for identity.
export const getSeekingViewerProfile = (authRole) => {
  if (authRole === 'alumni') {
    return { name: 'Nusrat Jahan', department: 'CSE', batch: '19', verified: true, role: 'alumni' };
  }
  if (authRole === 'faculty') {
    return { name: 'Dr. Hasan Mahmud', department: 'CSE', batch: 'Faculty', verified: true, role: 'faculty' };
  }
  return { name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, role: 'student' };
};

// Prototype relevance rule: explicitly flagged posts, or posts from the viewer's own department.
export const isSeekingRelevant = (talent, viewerDepartment) =>
  talent?.relevant === true || talent?.student?.department === viewerDepartment;

export const createEmptySeekingDraft = () => ({
  id: null,
  category: '',
  headline: '',
  intro: '',
  skills: [],
  workMode: ['On-site'],
  location: 'Dhaka, BD',
  availability: SEEKING_AVAILABILITY[0],
  commitment: SEEKING_COMMITMENTS[0],
  preferredDuration: '3–6 months',
  compensation: SEEKING_COMPENSATIONS[0],
  resumeUrl: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', otherUrl: '',
  visibility: SEEKING_VISIBILITY_OPTIONS[0],
  duration: '30 days'
});

export const seekingDraftFromPost = (post) => ({
  ...createEmptySeekingDraft(),
  id: post?.id || null,
  category: post?.category || '',
  headline: post?.headline || '',
  intro: post?.fullBio || post?.bioPreview || '',
  skills: [...(post?.skills || [])].slice(0, SEEKING_SKILLS_MAX),
  workMode: [...(post?.workMode || ['On-site'])],
  location: post?.location || 'Dhaka, BD',
  availability: post?.availability || SEEKING_AVAILABILITY[0],
  commitment: post?.commitment || SEEKING_COMMITMENTS[0],
  preferredDuration: post?.preferredDuration || '3–6 months',
  compensation: post?.compensation || SEEKING_COMPENSATIONS[0],
  resumeUrl: post?.resumeUrl || '', portfolioUrl: post?.portfolioUrl || '',
  linkedInUrl: post?.linkedInUrl || '', githubUrl: post?.githubUrl || '', otherUrl: post?.otherUrl || '',
  visibility: post?.visibility === 'Alumni and faculty only' ? SEEKING_VISIBILITY_OPTIONS[1] : SEEKING_VISIBILITY_OPTIONS[0],
  duration: post?.duration || '30 days'
});

export const buildSeekingPostFromDraft = (draft, viewer, status) => ({
  id: draft.id || `my-seek-${Date.now()}`,
  category: draft.category || SEEKING_CATEGORIES[0],
  headline: draft.headline.trim(),
  student: {
    id: 'me', name: viewer.name, department: viewer.department,
    batch: viewer.batch, verified: viewer.verified, avatar: null
  },
  bioPreview: draft.intro.trim(),
  fullBio: draft.intro.trim(),
  skills: [...draft.skills],
  workMode: draft.workMode.length ? [...draft.workMode] : ['On-site'],
  location: draft.location.trim() || 'Dhaka, BD',
  availability: draft.availability,
  commitment: draft.commitment,
  preferredDuration: draft.preferredDuration,
  compensation: draft.compensation,
  portfolioUrl: draft.portfolioUrl.trim() || null,
  resumeUrl: draft.resumeUrl.trim() || null,
  linkedInUrl: draft.linkedInUrl.trim() || null,
  githubUrl: draft.githubUrl.trim() || null,
  otherUrl: draft.otherUrl.trim() || null,
  posted: 'Just now',
  postedTimestamp: new Date().toISOString(),
  expiresIn: draft.duration,
  status,
  relevant: true,
  visibility: draft.visibility === SEEKING_VISIBILITY_OPTIONS[1] ? 'Alumni and faculty only' : 'Verified university network',
  duration: draft.duration,
  postedDate: 'Today', views: 0, saves: 0, messages: 0
});
