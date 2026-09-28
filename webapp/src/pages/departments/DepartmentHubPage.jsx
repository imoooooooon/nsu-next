import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Share, Mail, Megaphone, Settings2, Building2, MapPin, Phone, Globe, Clock,
  Users, Briefcase, ArrowUpRight, Plus, ChevronDown,
} from 'lucide-react';
import { PageContainer, DetailHeader } from '../../components/layout/AppShell';
import {
  IconButton, Button, Card, TintedCard, SegmentedControl, SearchInput,
  EmptyState, Pill, MicroHeading, ViewModeToggle,
} from '../../components/ui';
import { PersonCard, PersonList } from '../../features/network/PersonCard';
import {
  EntityAvatar, EntityVerified, AccessBadge, DepartmentStats, DepartmentInfoRow,
} from '../../features/departments/DepartmentPrimitives';
import { DepartmentBloodRequestModal } from '../../features/departments/DepartmentBloodRequestModal';
import { DepartmentOfficials, DepartmentEvents } from '../../features/departments/DepartmentHubSections';
import {
  findDepartmentById, departmentJobs, departmentBloodRequests,
} from '../../data/departments';
import { getDepartmentEvents } from '../../data/events';
import { globalAlumniData, globalFacultyData, globalStudentData } from '../../data/people';
import { getDepartmentAccess, formatCount, broadcastChannelId, helpDeskChannelId } from '../../lib/departmentAccess';
import { useDirectoryView } from '../../lib/directoryView';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /departments/:deptId — the Department Hub (brief §1 and flow §3).

   Page order is fixed by the brief: identity → About (the department
   description) → the three directory tabs → the scrollable list of profile
   cards. Everything secondary (contact, officials, upcoming events, open
   roles, blood requests) goes to the sticky rail on lg and stacks below on
   mobile, so the brief's order survives at every width.

   The roster is built for departments that grow every term: the same
   card ⇄ list toggle as the Directory (sharing its remembered `people`
   mode), and a page of PAGE_SIZE at a time rather than every member at once.
--------------------------------------------------------------------------- */

const PAGE_SIZE = 12;

const TABS = [
  { id: 'students', label: 'Students', statKey: 'students' },
  { id: 'alumni', label: 'Alumni', statKey: 'alumni' },
  { id: 'faculty', label: 'Faculty', statKey: 'faculty' },
];

const SOURCE = {
  students: globalStudentData,
  alumni: globalAlumniData,
  faculty: globalFacultyData,
};

export default function DepartmentHubPage() {
  const { t, isDark } = useTheme();
  const { authRole, showToast, departmentAbout, departmentAdminIds } = useAppState();
  const navigate = useNavigate();
  const { deptId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const close = useCloseTo('/network?segment=Departments');

  const dept = findDepartmentById(deptId);
  const tabParam = searchParams.get('tab');
  const tab = TABS.some(x => x.id === tabParam) ? tabParam : 'students';

  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isBloodOpen, setIsBloodOpen] = useState(false);
  const [view, setView] = useDirectoryView('people');

  const access = getDepartmentAccess(dept, authRole);

  const people = useMemo(() => {
    if (!dept) return [];
    const base = (SOURCE[tab] || []).filter(p => p.dept === dept.code);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );
  }, [dept, tab, search]);

  if (!dept) {
    return (
      <PageContainer className="animate-fade-in">
        <EmptyState
          icon={Building2}
          title="Department not found"
          subtitle="This department hub may have been moved or retired."
          action="Back to Directory"
          onAction={() => navigate('/network?segment=Departments', { replace: true })}
          className={t.text}
        />
      </PageContainer>
    );
  }

  const events = getDepartmentEvents(dept.id);
  const jobs = departmentJobs[dept.id] || [];
  const bloodRequests = departmentBloodRequests[dept.id] || [];
  const activeTab = TABS.find(x => x.id === tab);
  const totalInCohort = dept.stats[activeTab.statKey];

  const shownPeople = people.slice(0, visibleCount);
  const remaining = people.length - shownPeople.length;

  const setTab = (next) => {
    setSearch('');
    setVisibleCount(PAGE_SIZE);
    setSearchParams(next === 'students' ? {} : { tab: next }, { replace: true });
  };

  return (
    <PageContainer className="animate-fade-in">
      <DetailHeader title={dept.name} subtitle={dept.school} onBack={close}>
        <IconButton icon={Share} label="Share department" onClick={() => showToast('Department link copied')} />
        {access.canManage && (
          <IconButton icon={Settings2} label="Manage department" onClick={() => navigate(`/departments/${dept.id}/manage`)} />
        )}
      </DetailHeader>

      {/* ------------------------------------------------- identity hero */}
      <TintedCard tint="blueSoft" className="p-6 lg:p-8 mb-5" contentClassName="flex flex-col sm:flex-row sm:items-start gap-6 lg:gap-8">
        <EntityAvatar dept={dept} size="3xl" className="mx-auto sm:mx-0" />

        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 mb-1.5">
            <h2 className={`font-extrabold text-2xl lg:text-3xl tracking-tight leading-tight ${t.text}`}>{dept.name}</h2>
            {dept.verified && <EntityVerified />}
          </div>

          <p className={`font-bold ${t.textMuted} text-sm mb-4 text-center sm:text-left`}>
            North South University <span className="opacity-60">·</span> {dept.school}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
            <Pill className={isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'}>
              Est. {dept.established}
            </Pill>
            <Pill className={`${isDark ? 'bg-black/20 text-white/70 border-white/10' : 'bg-white/60 text-black/60 shadow-sm border-white'} inline-flex items-center gap-1`}>
              <Users className="w-3 h-3" strokeWidth={3} /> {formatCount(dept.memberCount)} members
            </Pill>
            {access.level !== 'visitor' && <AccessBadge level={access.level} />}
          </div>

          <DepartmentStats dept={dept} className="mb-6" />

          {/* Help Desk is the primary action: it is the only thing a stuck
              student actually needs from this page. You don't "enter" a
              broadcast channel you are already enrolled in, so it's secondary. */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:max-w-lg">
            <Button
              variant="primary"
              size="md"
              icon={Mail}
              className="flex-1 shadow-lg shadow-[#1D9BF0]/40"
              onClick={() => navigate(`/messages/${helpDeskChannelId(dept.id)}`)}
            >
              Message Department
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Megaphone}
              className="flex-1"
              onClick={() => navigate(`/messages/${broadcastChannelId(dept.id)}`)}
            >
              Broadcast Channel
            </Button>
          </div>
        </div>
      </TintedCard>

      {/* ------------------------------------------- admin management band */}
      {access.canManage && (
        <Card padded={false} className="mb-5 flex flex-col sm:flex-row sm:items-center gap-4 p-4">
          <AccessBadge level={access.level} className="shrink-0" />
          <p className={`text-xs font-bold ${t.textMuted} flex-1 leading-relaxed`}>
            {access.isOfficial
              ? 'You hold the master key for this department — you can broadcast, answer the Help Desk and grant Admin Access to verified faculty.'
              : 'You have Admin Access — you can broadcast, answer the Help Desk and post on behalf of the department.'}
          </p>
          <Button variant="soft" size="sm" icon={Settings2} className="shrink-0" onClick={() => navigate(`/departments/${dept.id}/manage`)}>
            Manage Department
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-4">
        {/* ------------------------------------------------- main column */}
        <div className="lg:col-span-2 min-w-0 space-y-5">
          {/* About — the department description, at the very top per brief §3 */}
          <Card>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 whitespace-pre-wrap`}>
              {departmentAbout[dept.id] ?? dept.about}
            </p>
          </Card>

          {/* Directory — the three tabs and the scrollable list of cards */}
          <div>
            {/* The tab row scrolls with the list. It was pinned so the
                cohorts stayed reachable on a long roster, but a control strip
                that detaches and hangs over the cards reads as a glitch —
                and the cards it covered were the thing you came to read. */}
            <div className="pb-4">
              <div className={`rounded-2xl ${t.card} border ${t.border} p-4 space-y-3`}>
                <SegmentedControl
                  options={TABS.map(x => ({ id: x.id, label: x.label }))}
                  value={tab}
                  onChange={setTab}
                />
                <SearchInput
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                  onClear={() => { setSearch(''); setVisibleCount(PAGE_SIZE); }}
                  placeholder={`Search ${activeTab.label.toLowerCase()} in ${dept.code}...`}
                  aria-label={`Search ${activeTab.label} in ${dept.code}`}
                />
              </div>
            </div>

            {/* The results line carries the view switch, exactly as in the
                Directory — it changes how these results look, not which. */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider">
                Showing {shownPeople.length} of {formatCount(totalInCohort)} {activeTab.label.toLowerCase()}
              </p>
              <ViewModeToggle value={view} onChange={setView} />
            </div>

            {people.length === 0 ? (
              <EmptyState
                icon={Users}
                title={search ? `No ${activeTab.label.toLowerCase()} match your search` : `No ${activeTab.label.toLowerCase()} listed yet`}
                subtitle={search ? 'Try a name, role or skill.' : 'Verified members appear here as they join the department.'}
                className={t.text}
              />
            ) : (
              <>
                {view === 'list' ? (
                  <PersonList people={shownPeople} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {shownPeople.map(person => <PersonCard key={person.id} person={person} variant="full" />)}
                  </div>
                )}
                {remaining > 0 && (
                  <div className="flex justify-center pt-5">
                    <Button variant="secondary" size="sm" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
                      Show {Math.min(remaining, PAGE_SIZE)} more <ChevronDown className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* --------------------------------------------------------- rail */}
        <aside className="lg:col-span-1 min-w-0 space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <MicroHeading>Contact</MicroHeading>
            <div className="space-y-4">
              <DepartmentInfoRow icon={MapPin} label="Office" value={dept.office} />
              <DepartmentInfoRow icon={Clock} label="Office Hours" value={dept.officeHours} />
              <DepartmentInfoRow icon={Mail} label="Email" value={dept.email} href={`mailto:${dept.email}`} />
              <DepartmentInfoRow icon={Phone} label="Phone" value={dept.phone} href={`tel:${dept.phone.replace(/\s/g, '')}`} />
              <DepartmentInfoRow icon={Globe} label="Website" value={dept.website} href={`https://${dept.website}`} />
            </div>
          </Card>

          {/* The Chair leads; live delegation (not the seed record) follows, so
              an admin granted in the console appears here immediately. */}
          <DepartmentOfficials dept={dept} adminIds={departmentAdminIds[dept.id]} />

          {/* Upcoming events — hosted by the department, drawn from the one
              campus calendar, so they are on /events too. */}
          <DepartmentEvents
            events={events}
            canManage={access.canManage}
            onCreate={() => navigate(`/events/create?as=${dept.id}`)}
            onBrowse={() => navigate('/events')}
          />

          {/* Open positions — brief §4: the hub posts into the campus board */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <MicroHeading className="!mb-0">Open Positions</MicroHeading>
              {access.canManage && (
                <button
                  onClick={() => navigate(`/jobs/post?as=${dept.id}`)}
                  className="text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Post
                </button>
              )}
            </div>
            {jobs.length === 0 ? (
              <p className={`text-xs font-bold ${t.textMuted}`}>No open positions right now.</p>
            ) : (
              <div className="space-y-2">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => navigate('/jobs')}
                    className={`p-3 rounded-xl border ${t.borderSoft} ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-black/[0.02] hover:bg-black/[0.04]'} transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-extrabold ${t.text} leading-snug`}>{job.title}</p>
                        <p className={`text-[10px] font-bold ${t.textMuted} mt-1`}>{job.type} · {job.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-full text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center justify-center pt-1"
                >
                  Open the campus Job Board <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
                </button>
              </div>
            )}
          </Card>

          {/* Emergency Blood — brief §4 */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <MicroHeading className="!mb-0">Emergency Blood</MicroHeading>
              {access.canManage && (
                <button
                  onClick={() => setIsBloodOpen(true)}
                  className="text-red-500 text-[11px] font-extrabold hover:underline inline-flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} /> Post
                </button>
              )}
            </div>
            {bloodRequests.length === 0 ? (
              <p className={`text-xs font-bold ${t.textMuted}`}>No active requests from this department.</p>
            ) : (
              <div className="space-y-2">
                {bloodRequests.map(req => (
                  <div
                    key={req.id}
                    className={`p-3 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-white'} flex items-center justify-center shrink-0`}>
                        <span className="text-[11px] font-black text-red-500">{req.bg}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-extrabold ${t.text} truncate`}>{req.hospital}</p>
                        <p className={`text-[10px] font-bold ${isDark ? 'text-red-300' : 'text-red-600'} mt-0.5`}>
                          {req.urgency} · {req.units} units · {req.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/emergency')}
              className="w-full text-[#1D9BF0] text-[11px] font-extrabold hover:underline inline-flex items-center justify-center pt-3"
            >
              Open the Emergency network <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={3} />
            </button>
          </Card>
        </aside>
      </div>

      {/* Mobile CTA bar — the hero buttons scroll away on a phone, and the
          Help Desk is the whole point of the page for a stuck student. */}
      <div className={`fixed bottom-0 inset-x-0 lg:hidden p-4 pb-28 ${t.glass} border-t z-30`}>
        <Button
          variant="primary"
          size="md"
          full
          icon={Mail}
          className="shadow-lg shadow-[#1D9BF0]/40"
          onClick={() => navigate(`/messages/${helpDeskChannelId(dept.id)}`)}
        >
          Message {dept.code} Department
        </Button>
      </div>
      <div className="h-24 lg:hidden" />

      {isBloodOpen && <DepartmentBloodRequestModal dept={dept} onClose={() => setIsBloodOpen(false)} />}
    </PageContainer>
  );
}
