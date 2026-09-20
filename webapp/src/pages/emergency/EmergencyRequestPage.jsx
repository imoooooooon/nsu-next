import { useParams } from 'react-router-dom';
import { ArrowLeft, Share, MapPin, Droplets, Phone, Droplet } from 'lucide-react';
import { PageContainer, DetailHeader } from '../../components/layout/AppShell';
import { IconButton, Card, TintedCard, Button, EmptyState } from '../../components/ui';
import { findEmergencyById } from '../../data/emergency';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /emergency/requests/:requestId — the mobile EmergencyRequestView as a route.
   Desktop moves the "Contact Family" CTA into a sticky rail; mobile keeps the
   fixed bottom bar.
--------------------------------------------------------------------------- */

export default function EmergencyRequestPage() {
  const { requestId } = useParams();
  const { t, isDark } = useTheme();
  const { showToast } = useAppState();
  const close = useCloseTo('/emergency');

  const req = findEmergencyById(requestId);

  if (!req) {
    return (
      <PageContainer className="animate-fade-in">
        <EmptyState
          icon={Droplet}
          title="Request not found"
          subtitle="This request may have been fulfilled or the link is incorrect."
          action="Back to Emergency Support"
          onAction={close}
          className={`${t.text} pt-24`}
        />
      </PageContainer>
    );
  }

  const urgencyClass = req.urgency === 'Critical'
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

  const contactFamily = () => showToast('Calling family contact (demo)');

  return (
    <PageContainer className="animate-fade-in">
      {/* header row */}
      <DetailHeader title={req.hospital} accent onBack={close}>
        <IconButton icon={Share} label="Share request" onClick={() => showToast('Request link copied')} />
      </DetailHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-28 lg:pb-0">
        {/* ------------------------------------------------- main column */}
        <div className="lg:col-span-2 min-w-0 space-y-5">
          <TintedCard tint="red" className="p-6" contentClassName="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'} border-2 ${isDark ? 'border-red-500/30' : 'border-red-200'} flex items-center justify-center mb-4 shadow-lg shadow-red-500/20`}>
              <span className={`text-4xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>{req.bg}</span>
            </div>

            <h2 className={`font-extrabold text-2xl tracking-tight leading-tight ${t.text} mb-3`}>{req.hospital}</h2>

            <div className="flex items-center space-x-2 mb-6">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${urgencyClass}`}>
                {req.urgency}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                {req.match}
              </span>
            </div>

            <div className={`w-full grid grid-cols-2 gap-3 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                <MapPin className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{req.distance} Away</span>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                <Droplets className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{req.units} Units Needed</span>
              </div>
            </div>
          </TintedCard>

          <Card className="p-6">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Details</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 mb-6`}>{req.description}</p>

            <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-4`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${t.textMuted}`}>Patient Name</span>
                <span className={`text-xs font-extrabold ${t.text}`}>{req.patientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${t.textMuted}`}>Exact Location</span>
                <span className={`text-xs font-extrabold ${t.text}`}>{req.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${t.textMuted}`}>Posted</span>
                <span className={`text-xs font-extrabold ${t.text}`}>{req.time}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* -------------------------------------------------- sticky rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <Card>
              <Button variant="danger" full icon={Phone} onClick={contactFamily} className="shadow-lg shadow-red-600/30">
                Contact Family
              </Button>
              <p className={`text-[10px] font-bold ${t.textMuted} text-center mt-3 leading-relaxed`}>
                Verified request • Shared with {req.bg} donors nearby
              </p>
            </Card>
          </div>
        </aside>
      </div>

      {/* --------------------------------------------- mobile bottom CTA */}
      <div className="lg:hidden fixed bottom-24 inset-x-0 z-30 px-5">
        <div className={`${t.glass} border ${t.border} rounded-2xl p-3 shadow-xl`}>
          <Button variant="danger" full icon={Phone} onClick={contactFamily}>
            Contact Family
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
