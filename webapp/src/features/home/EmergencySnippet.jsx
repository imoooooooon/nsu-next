import { globalEmergencyRequests } from '../../data/emergency';
import { useAdminBridge } from '../../../../src/shared/useAdminBridge';
import { useNavigate } from 'react-router-dom';
import { Droplet, ChevronRight } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

/* Live emergency support teaser card — 1:1 port from Home on mobile. */
export const EmergencySnippet = ({ className = '' }) => {
  const { t } = useTheme();
  const navigate = useNavigate();
  useAdminBridge();
  const request = globalEmergencyRequests[0];

  return (
    <div
      onClick={() => navigate('/emergency')}
      className={`shrink-0 ${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-red-500/30 transition-colors ${className}`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-red-500/20 transition-colors duration-700 -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center space-x-2">
            <Droplet className="w-4 h-4 text-red-500" strokeWidth={2.5} />
            <h3 className={`text-sm font-extrabold ${t.text} tracking-tight leading-tight`}>Emergency Support</h3>
          </div>
          <div className="flex items-center space-x-1.5 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            <span className="text-red-500 text-[9px] font-extrabold tracking-wide uppercase">{request ? 'Open request' : 'Directory'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] text-white font-extrabold text-base border border-red-400">
            {request?.bg || '—'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-extrabold ${t.text} leading-tight truncate`}>{request?.hospital || 'No open requests'}</h4>
            <div className="flex items-center mt-1 space-x-1.5">
              <p className={`${t.textMuted} text-[10px] font-bold truncate`}>{request?.urgency || 'Explore the donor directory'}</p>
              <span className="w-1 h-1 rounded-full bg-gray-400/50 shrink-0"></span>
              <p className={`${t.textMuted} text-[10px] font-extrabold shrink-0`}>{request?.location || ''}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-500/50 group-hover:text-red-500 transition-colors shrink-0" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};
