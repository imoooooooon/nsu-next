import React from 'react';
import { useParams } from 'react-router-dom';
import { X, User, BadgeCheck, Send } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { globalMomentsData } from '../../data/moments';
import { useCloseTo } from '../../lib/navigation';

/* Note viewer — the floating thought-bubble overlay as a route. */
export default function MomentNotePage() {
  const { momentId } = useParams();
  const { isDark } = useTheme();
  const { showToast } = useAppState();
  const close = useCloseTo('/home');
  const [replyText, setReplyText] = React.useState('');

  const data = globalMomentsData.find(m => m.id === momentId);
  const note = data?.items.find(i => i.type === 'note');

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // fresh close each render

  if (!data || !note) {
    close();
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex flex-col justify-between bg-black/60 backdrop-blur-xl animate-fade-in" onClick={close}>
      <div className="pt-8 px-6 flex justify-end">
        <button onClick={close} aria-label="Close" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform backdrop-blur-md">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-6 animate-fade-in-up">
          <div className="bg-white text-black px-6 py-5 rounded-3xl shadow-2xl max-w-[320px] text-center text-xl font-light leading-snug">
            {note.content}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 rounded-sm"></div>
        </div>

        <div className={`w-28 h-28 rounded-full bg-gray-200 border-4 ${isDark ? 'border-[#2A2A2A]' : 'border-white'} flex items-center justify-center shadow-2xl overflow-hidden animate-scale-up`}>
          <User className="w-14 h-14 text-gray-500" strokeWidth={1.5} />
        </div>

        <div className="mt-5 text-center">
          <div className="flex items-center justify-center space-x-1.5">
            <h2 className="text-white font-semibold text-2xl drop-shadow-md">{data.user.name}</h2>
            {data.user.verified && <BadgeCheck className="w-5 h-5 text-[#1D9BF0] drop-shadow-md" strokeWidth={3} />}
          </div>
          <p className="text-white/80 text-sm font-medium mt-1 drop-shadow-md">{data.user.role} • 4h</p>
        </div>
      </div>

      <div className="p-5 pb-8 bg-black/20 backdrop-blur-md border-t border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-lg mx-auto flex items-center space-x-3 bg-white/10 rounded-full pl-5 pr-2 py-2 border border-white/20 shadow-inner">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${data.user.name.split(' ')[0]}...`}
            className="flex-1 bg-transparent text-white placeholder:text-white/60 font-light text-[14px] focus:outline-none"
          />
          <button
            onClick={() => { if (replyText.trim()) { setReplyText(''); showToast('Reply sent'); close(); } }}
            aria-label="Send reply"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${replyText.trim() ? 'bg-white text-black scale-105 shadow-md' : 'bg-transparent text-white/50'}`}
          >
            <Send className="w-4 h-4 transform translate-x-[1px] -translate-y-[1px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
