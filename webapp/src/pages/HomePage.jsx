import { HomeCareerSections } from '../../../src/shared/HomeCareerSections';
import { globalSeekingData } from '../features/seeking/data';
import { StaffHome } from '../../../src/shared/DepartmentExperience';
import { globalDepartments } from '../data/departments';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Bell, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useAppState } from '../context/AppStateContext';
import { PageContainer } from '../components/layout/AppShell';
import {
  CustomAlumniIcon, CustomJobsIcon, CustomEventsIcon, CustomEmergencyIcon,
  CustomMessagesIcon, CustomDepartmentsIcon,
} from '../components/icons/CustomIcons';
import { SectionHeading } from '../components/ui';
import { MomentsRow } from '../features/moments/MomentsRow';
import { AdCarousel, useDemoAds } from '../features/home/AdCarousel';
import { NotificationStack } from '../features/home/NotificationStack';
import { EmergencySnippet } from '../features/home/EmergencySnippet';
import { JobSlider } from '../features/jobs/JobSlider';
import { JobCard } from '../features/jobs/JobCard';
import { PersonCard } from '../features/network/PersonCard';
import { FeaturedEventsCarousel } from '../features/events/FeaturedEventsCarousel';
import { momentPeople as globalMomentsData } from '../../../src/shared/momentPeople';
import { globalJobsData } from '../data/jobs';
import { globalAlumniData, getViewerIdentity } from '../data/people';
import { globalEventsData } from '../data/events';

const HEADER_BG_LIGHT = 'https://res.cloudinary.com/ddgxqqe6t/image/upload/v1773175854/NSU_BUILDING_LINE_ART_F2_y7e2az.svg';
const HEADER_BG_DARK = 'https://res.cloudinary.com/ddgxqqe6t/image/upload/v1773175855/NSU_BUILDING_LINE_ART_F_pk87bc.svg';

export default function HomePage() {
  const { t, isDark, toggleTheme } = useTheme();
  const { authRole, savedTalentIds, handleToggleSavedTalent } = useAppState();
  const navigate = useNavigate();
  const demoAds = useDemoAds();
  const viewer = getViewerIdentity(authRole);

  /* Seeking left this row (as it left the sidebar): it is a mode of Jobs,
     one tap away on the Hiring | Seeking pill. Departments take the slot —
     the hub is where notices, events, roles and help live, and it had no
     front door on Home. */
  const quickActions = [
    { icon: CustomAlumniIcon, label: 'Network', to: '/network' },
    { icon: CustomJobsIcon, label: 'Jobs', to: '/jobs' },
    { icon: CustomDepartmentsIcon, label: 'Departments', short: 'Depts', to: '/network?segment=Departments' },
    { icon: CustomEventsIcon, label: 'Events', to: '/events' },
    { icon: CustomMessagesIcon, label: 'Messages', to: '/messages' },
    { icon: CustomEmergencyIcon, label: 'Emergency', to: '/emergency' },
  ];

  if (authRole === 'staff') return <PageContainer><StaffHome t={t} authRole={authRole} departments={globalDepartments} onManage={d => navigate(`/departments/${d.id}/manage`)} onDirectory={() => navigate('/network?segment=Departments')} onProfile={() => navigate('/profile')} /></PageContainer>;

  const canPostJobs = authRole === 'alumni' || authRole === 'faculty';

  return (
    <PageContainer className="animate-fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ------------------------------------------------ main column */}
        <div className="xl:col-span-2 min-w-0">
          {/* Greeting banner with the NSU building line art */}
          <div className="relative -mx-5 lg:mx-0 px-5 lg:px-8 pt-10 lg:pt-6 pb-4 lg:rounded-b-none rounded-b-[2.5rem] overflow-hidden">
            {/* The NSU line art is authored for a phone-width banner. On a wide
                canvas `cover` blows it up and crops it, so above sm it is
                pinned to the right at its natural height instead. */}
            <div
              className="absolute inset-0 z-0 pointer-events-none bg-[length:cover] bg-[position:center_-15px] bg-no-repeat sm:bg-[length:auto_115%] sm:bg-[position:right_-8px]"
              style={{ backgroundImage: `url('${isDark ? HEADER_BG_DARK : HEADER_BG_LIGHT}')` }}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={3} />
                    <span className="text-[10px] font-extrabold text-[#1D9BF0] tracking-wide uppercase drop-shadow-sm">
                      Verified NSU {authRole.charAt(0).toUpperCase() + authRole.slice(1)}
                    </span>
                  </div>
                  <h1 className={`text-3xl lg:text-4xl font-extrabold ${t.text} tracking-tight leading-tight drop-shadow-sm`}>
                    Hi, {viewer.firstName} <span className="text-2xl lg:text-3xl inline-block origin-bottom-right animate-wave">👋</span>
                  </h1>
                  <p className={`${t.textMuted} text-xs font-bold mt-1 drop-shadow-sm`}>{viewer.subtitle}</p>
                </div>

                {/* Global actions live in the TopBar on desktop; keep them here on mobile */}
                <div className="flex space-x-2 mt-1 lg:hidden">
                  <button onClick={toggleTheme} aria-label="Toggle theme" className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white'} border flex items-center justify-center transition-colors shadow-sm backdrop-blur-md`}>
                    {isDark ? <Sun className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />}
                  </button>
                  <button onClick={() => navigate('/notifications')} aria-label="Notifications" className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white'} border flex items-center justify-center transition-colors shadow-sm backdrop-blur-md relative active:scale-95`}>
                    <Bell className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
                    <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-[#1D9BF0] border-[2px] ${isDark ? 'border-[#1E1E1E]' : 'border-white'} rounded-full`}></span>
                  </button>
                </div>
              </div>

              <div className="w-full mt-2 max-w-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider drop-shadow-sm`}>Profile Strength</span>
                  <span className="text-[10px] font-extrabold text-[#1D9BF0] drop-shadow-sm">80%</span>
                </div>
                <div className={`h-1.5 w-full ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden shadow-inner`}>
                  <div className="h-full bg-[#1D9BF0] w-[80%] rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Moments */}
          <div className="relative -mt-1 mb-4">
            <MomentsRow moments={globalMomentsData} />
          </div>

          <AdCarousel ads={demoAds} />

          {/* Quick actions */}
          <div className="w-full pt-4 pb-2 relative z-10">
            <div className="flex flex-row items-start justify-between w-full gap-1 px-2 sm:px-4 max-w-2xl mx-auto">
              {quickActions.map((action, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(action.to)}
                  className="flex-1 flex flex-col items-center justify-center min-h-[72px] cursor-pointer group transition-all duration-200 ease-out active:scale-90"
                >
                  <action.icon className={`w-[36px] h-[36px] mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-[#1C1C1E]'} group-hover:text-[#1D9BF0]`} />
                  <span className={`text-[12px] font-bold leading-tight text-center ${t.textMuted} group-hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>
                    {/* Six across a phone leaves ~55px a label; "Depts" is the
                        Directory's own short form for the same lens. */}
                    {action.short ? (
                      <>
                        <span className="sm:hidden">{action.short}</span>
                        <span className="hidden sm:inline">{action.label}</span>
                      </>
                    ) : action.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* People to connect with */}
          <div className="mt-6">
            <SectionHeading title="People to Connect With" action="See All" onAction={() => navigate('/network')} className="px-1 mb-1" />
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar rail-fade -mx-5 px-5 lg:-mx-1 lg:px-1 pt-4 pb-8 relative z-0">
              {globalAlumniData.slice(0, 4).map((person) => (
                <PersonCard key={person.id} person={person} variant="connect" />
              ))}
            </div>
          </div>

          {/* Featured events */}
          <div className="mt-2 mb-6">
            <SectionHeading title="Featured Events" action="See All" onAction={() => navigate('/events')} className="px-1" />
            <FeaturedEventsCarousel
              events={globalEventsData.filter(e => e.featured)}
              onEventClick={(e) => navigate(`/events/${e.id}`)}
            />
          </div>

          <HomeCareerSections authRole={authRole} t={t} talent={globalSeekingData}
            savedTalentIds={savedTalentIds} onToggleSave={handleToggleSavedTalent}
            onOpenTalent={person => navigate(`/jobs/seeking/${person.id}`)}
            onViewAll={() => navigate('/jobs/seeking')}>
            <div>
              {canPostJobs && (
                <div className="px-1 mb-5">
                  <button
                    onClick={() => navigate('/jobs/post')}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all active:scale-[0.98] bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 flex items-center justify-center shadow-sm hover:bg-[#1D9BF0]/15"
                  >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> Post a Job Opportunity
                  </button>
                </div>
              )}
              <SectionHeading
                title={canPostJobs ? 'Recently Posted Jobs' : 'Latest Jobs For You'}
                action="See All"
                onAction={() => navigate('/jobs')}
                className="px-1 mb-1"
              />
              {/* Slider on small screens (mobile parity), grid on wide screens */}
              <div className="md:hidden">
                <JobSlider jobs={globalJobsData} />
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4 pt-4">
                {globalJobsData.slice(0, 2).map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </HomeCareerSections>

          {/* Mobile-only rail content (keeps the original mobile order) */}
          <div className="xl:hidden mt-8 space-y-5">
            <NotificationStack />
            <EmergencySnippet />
          </div>
        </div>

        {/* ------------------------------------------------ right rail */}
        <aside className="hidden xl:block pt-8">
          <div className="sticky top-20 space-y-5">
            <NotificationStack />
            <EmergencySnippet />

            {/* Third job surfaces here so the rail stays alive */}
            <div>
              <SectionHeading title="Spotlight Role" size="md" className="px-1 mb-3" />
              <JobCard job={globalJobsData[2]} />
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
