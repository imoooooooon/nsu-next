import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, Bell, Bookmark as BookmarkIcon, Briefcase, CheckCircle2, Copy,
  Edit, Eye, FileText, Globe, Info, Lightbulb, Lock, LogOut, Mail, Moon, QrCode, Share,
  Shield, Smartphone, Sun, User, Users, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { getViewerIdentity } from '../../data/people';
import { findDepartmentById } from '../../data/departments';
import { getDepartmentAccess, formatCount, VIEWER_DEPARTMENT_ID } from '../../lib/departmentAccess';
import { EntityAvatar, AccessBadge } from '../../features/departments/DepartmentPrimitives';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { Card, TintedCard, CardGlow, SegmentedControl, SettingsRow, MicroHeading } from '../../components/ui';

/* ---------------------------------------------------------------------------
   /profile — the Control Center. 1:1 port of the mobile ProfileTab
   (identity card + Account / Settings segments), re-laid-out for desktop.
   The segment is URL-driven (?tab=Account|Settings) so both tabs are routable.
--------------------------------------------------------------------------- */
export default function ProfilePage() {
  const navigate = useNavigate();
  const viewerDept = findDepartmentById(VIEWER_DEPARTMENT_ID);
  const { t, isDark, toggleTheme } = useTheme();
  const {
    authRole, logout, showToast,
    pushEnabled, handlePushToggle,
    appLanguage,
    twoFactorEnabled, handle2FAToggle,
    profileVisibility,
    activeSessions,
  } = useAppState();

  const identity = getViewerIdentity(authRole);
  const deptAccess = getDepartmentAccess(viewerDept, authRole);

  const [searchParams, setSearchParams] = useSearchParams();
  const segment = searchParams.get('tab') === 'Settings' ? 'Settings' : 'Account';
  const setSegment = (tab) => setSearchParams({ tab }, { replace: true });

  /* Copy-ID chip feedback — green check for 2s, mobile parity. */
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const handleCopyID = () => {
    navigator.clipboard?.writeText(identity.idPrefix)?.catch(() => {});
    showToast('ID copied');
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const goSection = (section) => navigate(`/profile/settings/${section}`);
  const handleLogout = () => { logout(); navigate('/welcome'); };
  const sessionsValue = `${activeSessions.length} device${activeSessions.length !== 1 ? 's' : ''}`;

  const stats = [
    { label: identity.stat1Label, count: identity.stat1Count, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: identity.stat2Label, count: identity.stat2Count, icon: BookmarkIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Connections', count: '124', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Profile Views', count: '89', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader title="Control Center" />

      {/* Identity card — 1:1 port of the mobile hero card. */}
      <TintedCard tint="blue" contentClassName="p-6">
        <div className="flex items-center">
          <div className="relative shrink-0 mr-5">
            <div className="w-20 h-20 rounded-full border-[3px] border-[#1D9BF0] p-1 shadow-lg shadow-[#1D9BF0]/30">
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-white/10' : 'bg-white/60'} flex items-center justify-center overflow-hidden`}>
                <User className={`w-10 h-10 ${t.text}`} strokeWidth={1.5} />
              </div>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-[#1D9BF0] rounded-full border-2 ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center shadow-sm`}>
              <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h2 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} truncate`}>{identity.fullName}</h2>
                <p className={`font-bold ${t.textMuted} text-xs mt-0.5 truncate`}>{identity.roleSub}</p>
              </div>
              <button
                onClick={() => goSection('personal_info')}
                aria-label="Edit personal information"
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.borderSoft} transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleCopyID}
                aria-label={`Copy ID ${identity.idPrefix}`}
                className={`flex items-center px-2.5 py-1.5 rounded-md ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/60 text-black border-white'} border shadow-sm transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                <span className="text-[10px] font-extrabold mr-1.5 opacity-80">ID</span>
                <span className="text-[11px] font-extrabold font-mono tracking-wider mr-2">{identity.idPrefix}</span>
                {copied
                  ? <CheckCircle2 className="w-3 h-3 text-green-500" strokeWidth={3} />
                  : <Copy className="w-3 h-3 opacity-60" strokeWidth={2.5} />}
              </button>
              <button
                aria-label="Show QR code"
                className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/60 text-black border-white'} border shadow-sm transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                <QrCode className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </TintedCard>

      <SegmentedControl
        options={['Account', 'Settings']}
        value={segment}
        onChange={setSegment}
        className="my-6 max-w-md"
      />

      {segment === 'Account' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <MicroHeading className="px-1">Activity</MicroHeading>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`p-4 rounded-xl ${t.card} border ${t.border} ${t.cardShadow} flex flex-col cursor-pointer hover:border-[#1D9BF0]/30 transition-colors`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} strokeWidth={2.5} />
                    </div>
                    <h4 className={`text-xl font-extrabold ${t.text}`}>{stat.count}</h4>
                  </div>
                  <span className={`text-xs font-bold ${t.textMuted}`}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden group cursor-pointer">
            <CardGlow />
            <div className="relative z-10 flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className={`text-sm font-extrabold ${t.text} mb-1`}>Profile Insight</h4>
                <p className={`text-xs font-bold ${t.textMuted} leading-relaxed`}>
                  Your profile is getting <span className="text-[#1D9BF0]">23% more views</span> this week. Recruiters searched your skill 'React' 5 times.
                </p>
              </div>
            </div>
          </Card>

          {/* My Department — the one-tap path to the hub for every member.
              A department is where a student's registration, advising and
              notices actually live, so it sits above Documents. */}
          {viewerDept && (
            <div>
              <MicroHeading className="px-1">My Department</MicroHeading>
              <Card
                interactive
                className="flex flex-col sm:flex-row sm:items-center gap-4"
                onClick={() => navigate(`/departments/${viewerDept.id}`)}
              >
                <EntityAvatar dept={viewerDept} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className={`text-sm font-extrabold ${t.text}`}>{viewerDept.name}</h4>
                    {deptAccess.level !== 'visitor' && <AccessBadge level={deptAccess.level} />}
                  </div>
                  <p className={`text-[11px] font-bold ${t.textMuted}`}>
                    {viewerDept.school} · {formatCount(viewerDept.memberCount)} members
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 ${t.textMuted} shrink-0 hidden sm:block`} strokeWidth={2.5} />
              </Card>
            </div>
          )}

          <div>
            <MicroHeading className="px-1">Documents</MicroHeading>
            <Card padded={false} className="overflow-hidden">
              <SettingsRow
                icon={FileText}
                label={authRole === 'student' ? 'Manage Resume' : 'Manage Portfolio'}
                value="Updated 2d ago"
              />
              <SettingsRow icon={Share} label="Portfolio Links" value="2 links" />
            </Card>
          </div>
        </div>
      )}

      {segment === 'Settings' && (
        <div className="grid lg:grid-cols-2 gap-6 items-start animate-fade-in">
          <div>
            <MicroHeading className="px-1">Account</MicroHeading>
            <Card padded={false} className="overflow-hidden">
              <SettingsRow icon={User} label="Personal Information" onClick={() => goSection('personal_info')} />
              <SettingsRow icon={Mail} label="Email & Phone" onClick={() => goSection('email_phone')} />
              <SettingsRow icon={Lock} label="Change Password" onClick={() => goSection('password')} />
            </Card>
          </div>

          <div>
            <MicroHeading className="px-1">Security & Privacy</MicroHeading>
            <Card padded={false} className="overflow-hidden">
              <SettingsRow
                icon={Shield}
                label="Two-Factor Authentication"
                isToggle
                toggleState={twoFactorEnabled}
                onToggle={handle2FAToggle}
              />
              <SettingsRow icon={Eye} label="Profile Visibility" value={profileVisibility} onClick={() => goSection('visibility')} />
              <SettingsRow icon={Smartphone} label="Active Sessions" value={sessionsValue} onClick={() => goSection('sessions')} />
            </Card>
          </div>

          <div>
            <MicroHeading className="px-1">Preferences</MicroHeading>
            <Card padded={false} className="overflow-hidden">
              <SettingsRow
                icon={Bell}
                label="Push Notifications"
                isToggle
                toggleState={pushEnabled}
                onToggle={handlePushToggle}
              />
              <SettingsRow
                icon={isDark ? Moon : Sun}
                label="Dark Mode"
                isToggle
                toggleState={isDark}
                onToggle={toggleTheme}
              />
              <SettingsRow icon={Globe} label="Language" value={appLanguage} onClick={() => goSection('language')} />
            </Card>
          </div>

          <div>
            <MicroHeading className="px-1">Support & Legal</MicroHeading>
            <Card padded={false} className="overflow-hidden">
              <SettingsRow icon={Info} label="Help Center" onClick={() => showToast('Coming soon')} />
              <SettingsRow icon={AlertTriangle} label="Report a Bug" onClick={() => showToast('Coming soon')} />
              <SettingsRow icon={FileText} label="Privacy Policy" onClick={() => showToast('Coming soon')} />
            </Card>
            <div className="text-center mt-4">
              <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Ugrads v1.0.0 — Web</span>
            </div>
          </div>

          <Card padded={false} className="overflow-hidden">
            <SettingsRow icon={LogOut} label="Log Out" isDestructive onClick={handleLogout} />
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
