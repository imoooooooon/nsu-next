import { Copy, MessageSquare, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useTheme } from '../../theme/ThemeContext';

export function EmergencyContact({ phone, label, peer, headline, bloodGroup, secondaryAction }) {
  const { t, isDark } = useTheme();
  const { setChatContext, showToast } = useAppState();
  const navigate = useNavigate();
  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phone);
      showToast('Phone number copied');
    } catch {
      showToast('Select the phone number to copy it.');
    }
  }
  function message() {
    setChatContext({ peer, emergency: { headline, bloodGroup, phone } });
    navigate('/messages/new');
  }
  return (
    <div className="space-y-3" onClick={event => event.stopPropagation()}>
      <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <Phone size={16} className={`${t.textMuted} shrink-0`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold ${t.textMuted}`}>{label}</p>
          <p className={`text-sm font-extrabold select-all ${t.text}`}>{phone || 'Phone number not shared'}</p>
        </div>
        {phone && <button type="button" onClick={copyPhone} aria-label={`Copy ${label.toLowerCase()}`} title="Copy phone number" className={`p-2 rounded-lg ${t.textMuted} hover:text-[#1D9BF0] focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}><Copy size={16} /></button>}
      </div>
      <div className={secondaryAction ? 'grid grid-cols-2 gap-2' : undefined}>
        <button type="button" onClick={message} className="w-full min-w-0 h-10 rounded-lg bg-[#0878C4] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#0768AA] focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[.98]" aria-label={`Message ${peer.name}`}><MessageSquare size={16} className="shrink-0" />Message</button>
        {secondaryAction}
      </div>
    </div>
  );
}
