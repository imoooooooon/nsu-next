import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, AlertTriangle, Users, User } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { IconButton, Verified, EmptyState } from '../../components/ui';
import { allDirectoryUsers } from '../../data/people';
import { getDonorPhone } from '../../data/emergency';
import { EmergencyContact } from '../../features/emergency/EmergencyContact';
import { getRoleStyles, getPersonRole } from '../../lib/roleStyles';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /emergency/donors/:bloodGroup — the mobile EmergencyDirectoryTab as a route.
   Donor cards keep the mobile anatomy; the single column becomes a grid.
--------------------------------------------------------------------------- */

export default function DonorDirectoryPage() {
  const { bloodGroup } = useParams();
  const { t, isDark } = useTheme();
  const { requestedSet, toggleRequested } = useAppState();
  const navigate = useNavigate();
  const close = useCloseTo('/emergency');

  const bg = decodeURIComponent(bloodGroup || '');
  const donors = allDirectoryUsers.filter(u => u.blood === bg);

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex items-center gap-3 pt-8 lg:pt-10">
        <IconButton icon={ArrowLeft} label="Back to emergency support" onClick={close} />
      </div>

      <PageHeader accent title={`${bg} Donors`} subtitle="Emergency Blood Directory" className="pt-4" />

      <div className="flex items-center text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider mb-6">
        Showing {donors.length} result{donors.length === 1 ? '' : 's'} • {bg} Blood Group
      </div>

      {donors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {donors.map((person) => {
            const roleType = getPersonRole(person);
            const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles(roleType, isDark);
            const requested = requestedSet.has(person.id);

            return (
              <div
                key={person.id}
                onClick={() => navigate(`/network/${person.id}?from=emergency`)}
                className={`rounded-2xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-sm border ${t.borderSoft} ${isDark ? 'bg-[#1A1A1A]/60' : 'bg-white/60'} backdrop-blur-md`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-12 h-12 rounded-full shrink-0 ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shadow-sm`}>
                        <User className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <h3 className={`font-extrabold text-base tracking-tight leading-tight truncate ${t.text}`}>{person.name}</h3>
                          {person.verified && <Verified />}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <RoleIcon className={`w-3.5 h-3.5 ${colorClass}`} strokeWidth={2.5} />
                          <span className={`text-[11px] font-bold ${colorClass}`}>{roleType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2 mt-1">
                      <span className={`text-[22px] font-black leading-none ${isDark ? 'text-red-400' : 'text-red-600'}`}>{person.blood}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-extrabold flex items-center ${isDark ? 'bg-white/10 text-white/80' : 'bg-black/5 text-black/70'}`}>
                      <MapPin className="w-3 h-3 mr-1.5" strokeWidth={2.5} /> {person.location}
                    </span>
                    <span className="px-2.5 py-1.5 rounded-md text-[10px] font-extrabold flex items-center bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" strokeWidth={2.5} /> Eligible to Donate
                    </span>
                  </div>

                  <div className="mb-3">
                    <EmergencyContact phone={getDonorPhone(person)} label="Donor phone number" peer={{ id: person.id, name: person.name, role: roleType, subtitle: person.dept }} headline={`${person.blood} blood donation`} bloodGroup={person.blood} />
                  </div>
                  <div className="flex w-full">
                    <div className="flex-1" onClick={(e) => { e.stopPropagation(); toggleRequested(person.id); }}>
                      {requested ? (
                        <div className={`flex items-center justify-center h-10 rounded-lg font-bold text-[13px] ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all cursor-pointer`}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-red-500" strokeWidth={2.5} /> Request Sent
                        </div>
                      ) : (
                        <button className="w-full h-10 rounded-lg font-bold text-[13px] transition-all active:scale-[0.97] bg-red-500 hover:bg-red-600 text-white shadow-sm flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                          <AlertTriangle className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Request Blood
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={`No ${bg} donors listed yet`}
          subtitle="Try another blood group, or create a request so nearby donors are notified."
          action="Back to Emergency Support"
          onAction={close}
          className={t.text}
        />
      )}
    </PageContainer>
  );
}
