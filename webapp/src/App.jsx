import { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypePanel } from '../../src/shared/DepartmentExperience';
import { useAppState } from './context/AppStateContext';
import { useTheme } from './theme/ThemeContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layout/AuthLayout';
import { AppShell } from './components/layout/AppShell';

/* Auth flow */
import WelcomePage from './pages/auth/WelcomePage';
import RoleSelectPage from './pages/auth/RoleSelectPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OtpPage from './pages/auth/OtpPage';

/* Main app */
import HomePage from './pages/HomePage';
import NetworkPage from './pages/network/NetworkPage';
import UserProfilePage from './pages/network/UserProfilePage';
import DepartmentHubPage from './pages/departments/DepartmentHubPage';
import DepartmentManagePage from './pages/departments/DepartmentManagePage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailsPage from './pages/jobs/JobDetailsPage';
import PostJobPage from './pages/jobs/PostJobPage';
import SeekingPage from './pages/jobs/SeekingPage';
import TalentDetailsPage from './pages/jobs/TalentDetailsPage';
import CreateSeekingPage from './pages/jobs/CreateSeekingPage';
import MySeekingPostsPage from './pages/jobs/MySeekingPostsPage';
import EventsHomePage from './pages/events/EventsHomePage';
import EventsBrowsePage from './pages/events/EventsBrowsePage';
import EventsCalendarPage from './pages/events/EventsCalendarPage';
import MyEventsPage from './pages/events/MyEventsPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import EmergencyPage from './pages/emergency/EmergencyPage';
import DonorDirectoryPage from './pages/emergency/DonorDirectoryPage';
import EmergencyRequestPage from './pages/emergency/EmergencyRequestPage';
import MessagesPage from './pages/messages/MessagesPage';
import ChatView from './pages/messages/ChatView';
import ChatEmptyState from './pages/messages/ChatEmptyState';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsSectionPage from './pages/profile/SettingsSectionPage';
import MomentViewerPage from './pages/moments/MomentViewerPage';
import MomentNotePage from './pages/moments/MomentNotePage';
import CreateMomentPage from './pages/moments/CreateMomentPage';

export default function App() {
  const { t, isDark, toggleTheme } = useTheme();
  const { authRole, setAuthRole, login, logout, setAuthMode } = useAppState();
  const navigate = useNavigate();
  return (
    <>
    <Routes>
      {/* Unauthenticated flow */}
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth/role" element={<RoleSelectPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/otp" element={<OtpPage />} />
      </Route>

      {/* Authenticated app */}
      <Route element={<AppShell />}>
        <Route path="/home" element={<HomePage />} />

        <Route path="/network" element={<NetworkPage />} />
        <Route path="/network/:userId" element={<UserProfilePage />} />

        {/* Department hubs (Entity Profiles). The directory of departments is
            a lens on /network, so /departments alone redirects to it. */}
        <Route path="/departments" element={<Navigate to="/network?segment=Departments" replace />} />
        <Route path="/departments/:deptId" element={<DepartmentHubPage />} />
        <Route path="/departments/:deptId/manage" element={<DepartmentManagePage />} />

        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/post" element={<PostJobPage />} />
        <Route path="/jobs/seeking" element={<SeekingPage />} />
        <Route path="/jobs/seeking/new" element={<CreateSeekingPage />} />
        <Route path="/jobs/seeking/my-posts" element={<MySeekingPostsPage />} />
        <Route path="/jobs/seeking/:talentId" element={<TalentDetailsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />

        <Route path="/events" element={<EventsHomePage />} />
        <Route path="/events/browse" element={<EventsBrowsePage />} />
        <Route path="/events/calendar" element={<EventsCalendarPage />} />
        <Route path="/events/my" element={<MyEventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />

        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/emergency/donors/:bloodGroup" element={<DonorDirectoryPage />} />
        <Route path="/emergency/requests/:requestId" element={<EmergencyRequestPage />} />

        <Route path="/messages" element={<MessagesPage />}>
          <Route index element={<ChatEmptyState />} />
          <Route path=":chatId" element={<ChatView />} />
        </Route>

        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/settings/:section" element={<SettingsSectionPage />} />

        <Route path="/moments/create" element={<CreateMomentPage />} />
        <Route path="/moments/note/:momentId" element={<MomentNotePage />} />
        <Route path="/moments/:momentId" element={<MomentViewerPage />} />
      </Route>

      {/* Entry + fallback */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
    <PrototypePanel t={t} isDark={isDark} authRole={authRole} onTheme={toggleTheme}
      onSwitch={role => { setAuthRole(role); login(); navigate('/home'); }}
      onHome={() => { login(); navigate('/home'); }}
      onDepartment={id => { login(); navigate(id ? `/departments/${id}` : "/network?segment=Departments"); }}
      onSignup={() => startTransition(() => { logout(); setAuthRole('staff'); setAuthMode('signup'); navigate('/auth/signup'); })} />
    </>
  );
}
