import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Droplet, Phone } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { IconButton, Card, Button, Modal, MicroHeading, Toggle } from '../../components/ui';
import { bloodGroups, globalEmergencyRequests } from '../../data/emergency';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';

/* ---------------------------------------------------------------------------
   /emergency — the mobile EmergencyTab, re-laid for desktop:
   main column (blood groups + requests) with a sticky rail (donor status +
   "Need Blood?" CTA). Below lg the rail blocks flow between blood groups and
   requests, keeping the mobile order.
--------------------------------------------------------------------------- */

export default function EmergencyPage() {
  const { t, isDark } = useTheme();
  const { isDonorAvailable, setIsDonorAvailable } = useAppState();
  const navigate = useNavigate();
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader accent title="Emergency Support" subtitle="Find verified NSU blood donors near you">
        <IconButton icon={Info} label="About emergency support" size="sm" />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ------------------------------------------- blood group gallery */}
        <section className="lg:col-span-2 min-w-0">
          <MicroHeading>Blood Groups</MicroHeading>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {bloodGroups.map(item => (
              <button
                key={item.bg}
                onClick={() => navigate(`/emergency/donors/${encodeURIComponent(item.bg)}`)}
                className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60`}
              >
                <span className={`text-xl font-semibold ${t.text} mb-0.5`}>{item.bg}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.count} donors</span>
              </button>
            ))}
          </div>
        </section>

        {/* ------------------- right rail (flows between sections below lg) */}
        <aside className="lg:col-span-1 lg:row-span-2">
          <div className="lg:sticky lg:top-20 space-y-6">
            {/* Donor status */}
            <Card className="relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center space-x-3">
                    <Droplet className={`w-6 h-6 ${isDonorAvailable ? 'text-green-500' : 'text-gray-400'} transition-colors`} strokeWidth={2.5} />
                    <div>
                      <h3 className={`text-base font-extrabold ${t.text} leading-tight`}>Donor Status</h3>
                      <p className={`text-xs font-bold ${isDonorAvailable ? 'text-green-500' : t.textMuted} mt-0.5 transition-colors`}>
                        {isDonorAvailable ? 'Ready to donate' : 'Currently unavailable'}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={isDonorAvailable}
                    onChange={() => setIsDonorAvailable(!isDonorAvailable)}
                    color="bg-green-500"
                    size="lg"
                    label="Available to donate"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Your Impact</span>
                    <span className={`text-lg font-extrabold ${isDark ? 'text-red-400' : 'text-red-600'} drop-shadow-sm`}>3 Lives</span>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Last Donated</span>
                    <span className={`text-lg font-extrabold ${t.text}`}>{"14 Aug, '23"}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Need blood CTA */}
            <div className={`rounded-xl p-5 ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border`}>
              <div className="flex flex-col items-start text-left">
                <h3 className={`text-lg font-semibold ${t.text}`}>Need Blood?</h3>
                <p className={`text-sm font-medium ${t.textMuted} mt-1 mb-5`}>Create a request to notify nearby NSU donors.</p>
                <Button variant="danger" size="md" full onClick={() => setIsFlowOpen(true)}>
                  Create Blood Request
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* --------------------------------------------- requests near you */}
        <section className="lg:col-span-2 min-w-0">
          <MicroHeading>Requests Near You</MicroHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {globalEmergencyRequests.map(req => (
              <div key={req.id} className={`rounded-xl p-4 ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{req.bg}</span>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${req.urgency === 'Critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                    {req.urgency}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className={`font-semibold ${t.text} text-base leading-tight`}>{req.hospital}</h4>
                  <p className={`text-sm font-medium ${t.textMuted} mt-1`}>{req.units} units needed</p>
                  <p className={`text-sm font-medium ${t.textMuted}`}>{req.distance} away</p>
                  <p className={`flex items-center gap-2 mt-3 text-xs font-bold ${t.text}`}><Phone size={14} className={t.textMuted} aria-hidden="true" /><span>Family contact: <span className="select-all">{req.contact}</span></span></p>
                </div>
                <button
                  onClick={() => navigate(`/emergency/requests/${req.id}`)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-red-500/50`}
                >
                  View Request
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Create request — the EmergencyFlowOverlay placeholder as a Modal. */}
      {isFlowOpen && (
        <Modal onClose={() => setIsFlowOpen(false)} size="sm" showClose={false}>
          <div className="flex flex-col items-center pt-4 pb-1">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Droplet className="w-8 h-8 text-red-500" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Emergency Flow Placeholder</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This feature flow is under development.</p>
            <button
              onClick={() => setIsFlowOpen(false)}
              className="w-full py-3 bg-red-500 hover:bg-red-600 transition-colors text-white font-bold rounded-xl active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
