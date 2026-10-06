import { StaffProfile } from '../../../../src/shared/DepartmentExperience';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Share, MapPin, Droplets, MessageSquare, CheckCircle2,
  Briefcase, GraduationCap, Users,
} from 'lucide-react';
import { PageContainer, DetailHeader } from '../../components/layout/AppShell';
import { IconButton, Button, Card, TintedCard, Avatar, Verified, EmptyState } from '../../components/ui';
import { findUserById } from '../../data/people';
import { getDonorPhone } from '../../data/emergency';
import { EmergencyContact } from '../../features/emergency/EmergencyContact';
import { getPersonRole } from '../../lib/roleStyles';
import { findDepartmentByCode } from '../../data/departments';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /network/:userId — the mobile UserProfileView as a routed page.
   Identity TintedCard ported 1:1; About spans the grid, Experience and
   Education sit side by side on lg (stacked in mobile order below lg).
--------------------------------------------------------------------------- */

export default function UserProfilePage() {
  const { t, isDark } = useTheme();
  const { showToast, requestedSet, toggleRequested } = useAppState();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get('from') === 'emergency';
  const close = useCloseTo(isEmergency ? '/emergency' : '/network');
  const user = findUserById(userId);

  if (!user) {
    return (
      <PageContainer className="animate-fade-in">
        <EmptyState
          icon={Users}
          title="Profile not found"
          subtitle="This member may have been removed from the directory."
          action="Back to Directory"
          onAction={() => navigate('/network', { replace: true })}
          className={t.text}
        />
      </PageContainer>
    );
  }

  if (user.userType === 'staff') return <PageContainer><StaffProfile person={user} t={t} onBack={close} onDepartment={() => navigate(findDepartmentByCode(user.dept) ? `/departments/${findDepartmentByCode(user.dept).id}` : '/network?segment=Departments')} onMessage={findDepartmentByCode(user.dept) ? () => navigate(`/messages/dept-${findDepartmentByCode(user.dept).id}-helpdesk`) : undefined} /></PageContainer>;

  const requested = requestedSet.has(user.id);

  return (
    <PageContainer className="animate-fade-in">
      {/* Header row — back / name / share (mobile parity). */}
      <DetailHeader title={user.name} onBack={close}>
        <IconButton icon={Share} label="Share profile" onClick={() => showToast('Profile link copied')} />
      </DetailHeader>

      {/* Identity card. Mobile keeps the centred stack; from sm up it becomes a
          row so the avatar, identity and actions read as one unit instead of a
          tall ribbon of centred text across the full frame. */}
      <TintedCard tint="blueSoft" className="p-6 lg:p-8 mb-5" contentClassName="flex flex-col sm:flex-row sm:items-start gap-6 lg:gap-8">
        <Avatar size="3xl" className="mx-auto sm:mx-0 shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
          <div className="flex items-center space-x-1.5 mb-1">
            <h2 className={`font-extrabold text-2xl lg:text-3xl tracking-tight leading-tight ${t.text}`}>{user.name}</h2>
            {user.verified && <Verified size="w-6 h-6" />}
          </div>

          <p className={`font-bold ${t.textMuted} text-base mb-4 text-center sm:text-left`}>
            {user.role} <span className="opacity-80">@ {user.company}</span>
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
            {(() => {
              const deptRecord = findDepartmentByCode(user.dept);
              const chipClass = `px-4 py-2 rounded-md text-xs font-extrabold ${isDark ? 'bg-white/10 text-white' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`;
              /* The department chip opens the Entity Profile — the hub is
                 reached by link far more often than it is browsed to. */
              return deptRecord ? (
                <button
                  type="button"
                  onClick={() => navigate(`/departments/${deptRecord.id}`)}
                  title={`Open the ${deptRecord.code} department hub`}
                  className={`${chipClass} hover:opacity-80 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                >
                  {user.dept}
                </button>
              ) : (
                <span className={chipClass}>{user.dept}</span>
              );
            })()}
            <span className={`px-4 py-2 rounded-md text-xs font-extrabold flex items-center ${isDark ? 'bg-black/20 text-white/70' : 'bg-white/60 text-black/60 shadow-sm border border-white'}`}>
              <MapPin className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} /> {user.location}
            </span>
          </div>

          <div className={`w-full flex justify-between items-center pt-5 mb-5 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
            <div className="text-center sm:text-left flex-1 border-r border-dashed border-gray-400/30 pr-4">
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Blood</p>
              <p className={`text-base font-extrabold ${t.text} flex items-center justify-center sm:justify-start`}>
                <Droplets className="w-4 h-4 text-red-500 mr-1" strokeWidth={3} /> {user.blood}
              </p>
            </div>
            {user.batch !== 'Faculty' && (
              <div className="text-center sm:text-left flex-1 border-r border-dashed border-gray-400/30 px-4">
                <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
                <p className={`text-base font-extrabold ${t.text}`}>{user.batch.includes(' ') ? user.batch.split(' ')[1] : user.batch}</p>
              </div>
            )}
            <div className="text-center sm:text-left flex-1 pl-4">
              <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Network</p>
              <p className={`text-base font-extrabold ${t.text}`}>{user.followers}</p>
            </div>
          </div>

          {/* Actions stay a comfortable button width instead of stretching. */}
          {isEmergency ? (
            <div className="w-full sm:max-w-sm">
              <EmergencyContact phone={getDonorPhone(user)} label="Donor phone number" peer={{ id: user.id, name: user.name, role: getPersonRole(user), subtitle: user.dept }} headline={`${user.blood} blood donation`} bloodGroup={user.blood} />
            </div>
          ) : <div className="flex items-center space-x-3 w-full sm:max-w-sm">
            <div className="flex-1">
              {requested ? (
                <button
                  onClick={() => toggleRequested(user.id)}
                  className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 text-[#1D9BF0]" strokeWidth={2.5} /> Requested
                </button>
              ) : (
                <Button variant="primary" size="md" full className="shadow-lg shadow-[#1D9BF0]/40" onClick={() => toggleRequested(user.id)}>
                  Connect
                </Button>
              )}
            </div>
            <IconButton icon={MessageSquare} label={`Message ${user.name}`} size="lg" onClick={() => navigate('/messages/1')} />
          </div>}
        </div>
      </TintedCard>

      {/* About (full width) + Experience / Education side by side on lg. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padded={false} className="p-6 lg:col-span-2">
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
          <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90`}>{user.about}</p>
        </Card>

        <Card padded={false} className="p-6">
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-5`}>Experience</h3>
          <div className="space-y-6">
            {user.experience.map((exp, idx) => (
              <div key={idx} className="flex relative">
                {idx !== user.experience.length - 1 && (
                  <div className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}></div>
                )}
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} flex items-center justify-center mr-4 shrink-0 shadow-inner z-10`}>
                  <Briefcase className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
                </div>
                <div>
                  <h4 className={`font-extrabold ${t.text} text-base leading-tight`}>{exp.title}</h4>
                  <p className={`font-bold ${t.textMuted} text-xs mt-1`}>{exp.company}</p>
                  <p className={`font-bold ${t.textMuted} text-[10px] uppercase tracking-wider mt-1 opacity-70`}>{exp.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padded={false} className="p-6">
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-5`}>Education</h3>
          <div className="flex relative">
            <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} flex items-center justify-center mr-4 shrink-0 shadow-inner z-10`}>
              <GraduationCap className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
            </div>
            <div>
              <h4 className={`font-extrabold ${t.text} text-base leading-tight`}>North South University</h4>
              <p className={`font-bold ${t.textMuted} text-xs mt-1`}>BSc in {user.dept}</p>
              <p className={`font-bold ${t.textMuted} text-[10px] uppercase tracking-wider mt-1 opacity-70`}>Graduated 2023</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
