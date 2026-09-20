import { ArrowLeft, CheckCheck } from 'lucide-react';
import { PageContainer, PageHeader, FormColumn } from '../components/layout/AppShell';
import { IconButton } from '../components/ui';
import { globalNotifications } from '../data/notifications';
import { useTheme } from '../theme/ThemeContext';
import { useAppState } from '../context/AppStateContext';
import { useCloseTo } from '../lib/navigation';

/* ---------------------------------------------------------------------------
   /notifications — the mobile NotificationsOverlay as a route.
--------------------------------------------------------------------------- */

export default function NotificationsPage() {
  const { t, isDark } = useTheme();
  const { showToast } = useAppState();
  const close = useCloseTo('/home');

  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-center gap-3 pt-8 lg:pt-10">
        <IconButton icon={ArrowLeft} label="Go back" onClick={close} />
      </div>

      <PageHeader title="Notifications" subtitle="Job matches, connections and campus alerts" className="pt-4">
        <IconButton icon={CheckCheck} label="Mark all as read" onClick={() => showToast('All caught up')} />
      </PageHeader>

      <div className="space-y-2 pb-6">
        {globalNotifications.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl ${notif.unread ? (isDark ? 'bg-white/5' : 'bg-black/[0.03]') : 'bg-transparent'} border ${notif.unread ? t.borderSoft : 'border-transparent'} flex space-x-4 transition-all cursor-pointer ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} group`}
          >
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-full ${notif.bg} flex items-center justify-center border border-white/5`}>
                <notif.icon className={`w-5 h-5 ${notif.color}`} strokeWidth={2.5} />
              </div>
              {notif.unread && (
                <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1D9BF0] border-2 ${isDark ? 'border-[#121212]' : 'border-white'} rounded-full`}></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm ${notif.unread ? `font-extrabold ${t.text}` : `font-bold ${t.textMuted}`}`}>{notif.title}</h4>
                <span className={`text-[10px] font-extrabold ${notif.unread ? 'text-[#1D9BF0]' : t.textMuted} shrink-0 ml-2`}>{notif.time}</span>
              </div>
              <p className={`text-xs font-medium ${notif.unread ? t.text : t.textMuted} line-clamp-2 leading-relaxed`}>{notif.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </FormColumn>
    </PageContainer>
  );
}
