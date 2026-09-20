import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { previewNotifications } from '../../data/notifications';

/* Infinite rotating notification stack — 1:1 port from Home on mobile. */
export const NotificationStack = () => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const [notifIndex, setNotifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % previewNotifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[88px] shrink-0 overflow-hidden rounded-2xl cursor-pointer group" onClick={() => navigate('/notifications')}>
      {previewNotifications.map((notif, index) => {
        const length = previewNotifications.length;
        let offset = index - notifIndex;
        if (offset < -length / 2) offset += length;
        if (offset > length / 2) offset -= length;
        const isActive = offset === 0;

        return (
          <div
            key={notif.id}
            className={`absolute inset-0 w-full h-full p-4 rounded-2xl ${t.card} border ${t.borderSoft} ${t.cardShadow} flex items-center space-x-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}
            style={{
              transform: `translateY(${offset * 100}%) scale(${isActive ? 1 : 0.95})`,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 20 : 10,
              pointerEvents: isActive ? 'auto' : 'none'
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9BF0]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#1D9BF0]/20 transition-colors duration-500"></div>
            <div className="relative z-10 flex items-center space-x-4 w-full">
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full ${notif.bg} flex items-center justify-center border ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <notif.icon className={`w-5 h-5 ${notif.color}`} strokeWidth={2.5} />
                </div>
                {notif.id === 1 && (
                  <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 ${isDark ? 'border-[#121212]' : 'border-white'} rounded-full`}></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-sm font-extrabold ${t.text} truncate`}>{notif.title}</h4>
                  <span className={`text-[10px] font-bold ${notif.color}`}>{notif.time}</span>
                </div>
                <p className={`text-xs font-medium ${t.textMuted} line-clamp-2 leading-tight`}>{notif.msg}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
