import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { globalMySeekingPosts } from '../features/seeking/data';
import { EMPTY_SEEKING_FILTERS } from '../features/seeking/constants';
import { globalDepartments } from '../data/departments';

/* ---------------------------------------------------------------------------
   Global app state — the same state the mobile prototype keeps at the top of
   <App/>, lifted into a context so every route shares it. All of it is demo
   state (no backend), exactly like the shipped mobile app.
--------------------------------------------------------------------------- */

const AppStateContext = createContext(null);

/* The demo session is persisted so a refresh or a pasted deep link keeps you
   signed in — on mobile the app never reloads, on the web it constantly does. */
const SESSION_KEY = 'ugrads-session';

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/* Immutably flips an id in a Set held in state. */
const flipInSet = (prev, id) => {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

export const AppStateProvider = ({ children }) => {
  /* Auth (demo) — seeded from the persisted session. */
  const [authRole, setAuthRole] = useState(() => readSession()?.authRole || 'student'); // 'student' | 'alumni' | 'faculty'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isAuthed, setIsAuthed] = useState(() => readSession()?.isAuthed === true);

  useEffect(() => {
    try {
      if (isAuthed) localStorage.setItem(SESSION_KEY, JSON.stringify({ isAuthed, authRole }));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* private mode — the session just won't survive a reload */
    }
  }, [isAuthed, authRole]);

  /* Toast */
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 3000);
  }, []);

  /* Directory / connections */
  const [requestedSet, setRequestedSet] = useState(new Set());
  const toggleRequested = useCallback((id) => setRequestedSet(prev => flipInSet(prev, id)), []);

  /* Events module */
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set(['event-career-fair']));
  const [goingEventIds, setGoingEventIds] = useState(new Set());
  const [interestedEventIds, setInterestedEventIds] = useState(new Set(['event-ai-talk']));
  const [reminderEventIds, setReminderEventIds] = useState(new Set());
  const [followedOrganizerIds, setFollowedOrganizerIds] = useState(new Set(['organizer-acm']));

  /* Seeking work module */
  const [seekingFilters, setSeekingFilters] = useState(EMPTY_SEEKING_FILTERS);
  const [savedTalentIds, setSavedTalentIds] = useState(new Set(['talent-004', 'talent-011', 'talent-012']));
  const [mySeekingPosts, setMySeekingPosts] = useState(globalMySeekingPosts);
  const toggleSavedTalentSet = useCallback((id) => setSavedTalentIds(prev => flipInSet(prev, id)), []);

  /* Chat hand-off context (Seeking → Messages) */
  const [chatContext, setChatContext] = useState(null);

  /* Emergency */
  const [isDonorAvailable, setIsDonorAvailable] = useState(true);

  /* ---------------------------------------------------------------------
     Department hubs (Entity Profiles).
     Admin Access delegation, broadcasts sent this session and description
     edits are demo state, seeded from the department records.
  --------------------------------------------------------------------- */
  const [departmentAdminIds, setDepartmentAdminIds] = useState(() =>
    Object.fromEntries(globalDepartments.map(d => [d.id, [...d.adminIds]]))
  );
  const [sentBroadcasts, setSentBroadcasts] = useState({});
  const [departmentAbout, setDepartmentAbout] = useState({});
  const [mutedChannelIds, setMutedChannelIds] = useState(new Set());

  const grantDepartmentAdmin = useCallback((deptId, personId, personName) => {
    setDepartmentAdminIds(prev => {
      const current = prev[deptId] || [];
      if (current.includes(personId)) return prev;
      return { ...prev, [deptId]: [...current, personId] };
    });
    showToast(`${personName} now has Admin Access`);
  }, [showToast]);

  const revokeDepartmentAdmin = useCallback((deptId, personId, personName) => {
    setDepartmentAdminIds(prev => ({
      ...prev,
      [deptId]: (prev[deptId] || []).filter(id => id !== personId),
    }));
    showToast(`Admin Access revoked for ${personName}`);
  }, [showToast]);

  const sendDepartmentBroadcast = useCallback((deptId, message) => {
    setSentBroadcasts(prev => ({
      ...prev,
      [deptId]: [...(prev[deptId] || []), message],
    }));
  }, []);

  const updateDepartmentAbout = useCallback((deptId, about) => {
    setDepartmentAbout(prev => ({ ...prev, [deptId]: about }));
    showToast('Department description updated');
  }, [showToast]);

  const toggleChannelMute = useCallback((channelId) => {
    setMutedChannelIds(prev => {
      const muted = prev.has(channelId);
      showToast(muted ? 'Channel unmuted' : 'Channel muted');
      return flipInSet(prev, channelId);
    });
  }, [showToast]);

  /* Profile / settings */
  const [pushEnabled, setPushEnabled] = useState(true);
  const [appLanguage, setAppLanguage] = useState('English');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', active: true, location: 'Dhaka, BD', type: 'desktop' },
    { id: 2, device: 'iPhone 14 Pro', active: false, location: 'Dhaka, BD', time: 'Last active 2d ago', type: 'mobile' },
  ]);

  const handlePushToggle = useCallback(() => {
    setPushEnabled(prev => {
      showToast(!prev ? 'Push Notification Turned On' : 'Push Notification Turned Off');
      return !prev;
    });
  }, [showToast]);

  const handle2FAToggle = useCallback(() => {
    setTwoFactorEnabled(prev => {
      showToast(!prev ? 'Two-Factor Auth Enabled' : 'Two-Factor Auth Disabled');
      return !prev;
    });
  }, [showToast]);

  const handleToggleSavedTalent = useCallback((talentId) => {
    setSavedTalentIds(prev => {
      const wasSaved = prev.has(talentId);
      showToast(wasSaved ? 'Removed from saved profiles' : 'Profile saved');
      const next = new Set(prev);
      if (wasSaved) next.delete(talentId);
      else next.add(talentId);
      return next;
    });
  }, [showToast]);

  const handleSubmitSeekingPost = useCallback((post) => {
    setMySeekingPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      return exists ? prev.map(p => (p.id === post.id ? post : p)) : [post, ...prev];
    });
  }, []);

  const handleMySeekingAction = useCallback((postId, action) => {
    const duplicateId = `my-seek-${Date.now()}`;
    setMySeekingPosts(prev => {
      switch (action) {
        case 'pause':
          return prev.map(p => (p.id === postId ? { ...p, status: 'paused' } : p));
        case 'resume':
          return prev.map(p => (p.id === postId ? { ...p, status: 'active' } : p));
        case 'renew':
          return prev.map(p => (p.id === postId ? { ...p, status: 'active', expiresIn: '30 days' } : p));
        case 'unavailable':
          return prev.map(p => (p.id === postId ? { ...p, status: 'paused', availability: 'Not available' } : p));
        case 'duplicate': {
          const original = prev.find(p => p.id === postId);
          if (!original) return prev;
          if (prev.some(p => p.id === duplicateId)) return prev;
          return [{ ...original, id: duplicateId, status: 'draft', postedDate: 'Today', views: 0, saves: 0, messages: 0 }, ...prev];
        }
        case 'delete':
        case 'withdraw':
          return prev.filter(p => p.id !== postId);
        default:
          return prev;
      }
    });
    const messages = {
      pause: 'Post paused',
      resume: 'Post is active again',
      renew: 'Post renewed for 30 days',
      unavailable: 'Marked as unavailable',
      duplicate: 'Post duplicated as a draft',
      delete: 'Post deleted',
      withdraw: 'Post withdrawn',
    };
    if (messages[action]) showToast(messages[action]);
  }, [showToast]);

  const login = useCallback(() => setIsAuthed(true), []);
  const logout = useCallback(() => setIsAuthed(false), []);

  const value = useMemo(() => ({
    authRole, setAuthRole, authMode, setAuthMode, isAuthed, login, logout,
    toastMsg, showToast,
    requestedSet, toggleRequested,
    registeredEventIds, setRegisteredEventIds,
    goingEventIds, setGoingEventIds,
    interestedEventIds, setInterestedEventIds,
    reminderEventIds, setReminderEventIds,
    followedOrganizerIds, setFollowedOrganizerIds,
    seekingFilters, setSeekingFilters,
    savedTalentIds, toggleSavedTalentSet, handleToggleSavedTalent,
    mySeekingPosts, handleSubmitSeekingPost, handleMySeekingAction,
    chatContext, setChatContext,
    isDonorAvailable, setIsDonorAvailable,
    departmentAdminIds, grantDepartmentAdmin, revokeDepartmentAdmin,
    sentBroadcasts, sendDepartmentBroadcast,
    departmentAbout, updateDepartmentAbout,
    mutedChannelIds, toggleChannelMute,
    pushEnabled, handlePushToggle,
    appLanguage, setAppLanguage,
    twoFactorEnabled, handle2FAToggle,
    profileVisibility, setProfileVisibility,
    activeSessions, setActiveSessions,
  }), [
    authRole, authMode, isAuthed, login, logout, toastMsg, showToast,
    requestedSet, toggleRequested,
    registeredEventIds, goingEventIds, interestedEventIds, reminderEventIds, followedOrganizerIds,
    seekingFilters, savedTalentIds, toggleSavedTalentSet, handleToggleSavedTalent,
    mySeekingPosts, handleSubmitSeekingPost, handleMySeekingAction,
    chatContext, isDonorAvailable,
    departmentAdminIds, grantDepartmentAdmin, revokeDepartmentAdmin,
    sentBroadcasts, sendDepartmentBroadcast,
    departmentAbout, updateDepartmentAbout,
    mutedChannelIds, toggleChannelMute,
    pushEnabled, handlePushToggle, appLanguage,
    twoFactorEnabled, handle2FAToggle, profileVisibility, activeSessions,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
};
