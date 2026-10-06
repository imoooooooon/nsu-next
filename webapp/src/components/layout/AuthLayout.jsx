import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Briefcase, GraduationCap, HeartHandshake, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { Toast } from '../ui';
import './auth.css';

const SLIDES = [
  { label: 'Your community', title: 'Same campus.\nEndless connections.', text: 'Meet the people who share your roots. Stay close to your NSU community, wherever life takes you.', icon: GraduationCap, note: 'Students · Alumni · Faculty' },
  { label: 'Your next chapter', title: 'A connection today.\nAn opportunity tomorrow.', text: 'Discover jobs, find emerging talent and build relationships that grow beyond the classroom.', icon: Briefcase, note: 'Opportunities within your network' },
  { label: 'Your support system', title: 'A little closer.\nA little stronger.', text: 'Keep up with your department, join campus events and be there when your community needs you.', icon: HeartHandshake, note: 'One university. A lasting community.' },
];

export const AuthLayout = () => {
  const { t, isDark, toggleTheme } = useTheme();
  const { isAuthed } = useAppState();
  const location = useLocation();
  const [slide, setSlide] = useState(0);
  const content = SLIDES[slide];
  const SlideIcon = content.icon;
  if (isAuthed) return <Navigate to="/home" replace />;

  return (
    <div className={`auth-layout ${t.bg} ${t.text} font-jakarta antialiased selection:bg-[#1D9BF0]/30`}>
      <section className={`auth-story ${isDark ? 'auth-story-dark' : ''}`} aria-label="Discover Ugrads" aria-roledescription="carousel">
        <div className="auth-brand"><GraduationCap size={30} className="text-[#1D9BF0]" /><span>Ugrads<span className="auth-brand-caption">NORTH SOUTH UNIVERSITY NETWORK</span></span></div>
        <div className="auth-story-copy" aria-live="polite" aria-atomic="true">
          <div key={slide} className="animate-fade-in-up">
            <p className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#1D9BF0] mb-5">{content.label}</p>
            <h1 className="auth-story-title">{content.title}</h1>
            <p className={`max-w-lg text-sm xl:text-base leading-relaxed mt-5 ${t.textMuted}`}>{content.text}</p>
          </div>
        </div>
        <div className="auth-campus" aria-hidden="true" style={{ backgroundImage: `url('https://res.cloudinary.com/ddgxqqe6t/image/upload/${isDark ? 'v1773175855/NSU_BUILDING_LINE_ART_F_pk87bc.svg' : 'v1773175854/NSU_BUILDING_LINE_ART_F2_y7e2az.svg'}')` }} />
        <div className={`auth-story-note border ${t.border} ${t.card}`}><span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1D9BF0]/10 text-[#1D9BF0]"><SlideIcon size={21} /></span><span className="text-xs font-bold">{content.note}</span></div>
        <div className="auth-story-footer">
          <div className="flex gap-1" aria-label="Choose a slide">{SLIDES.map((item, index) => <button key={item.label} aria-label={`Show ${item.label}`} aria-current={slide === index ? 'true' : undefined} onClick={() => setSlide(index)} className="p-2 rounded-full focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"><span className={`block h-1.5 rounded-full transition-all ${slide === index ? 'w-8 bg-[#1D9BF0]' : 'w-2 bg-gray-400/40'}`} /></button>)}</div>
          <div className="flex gap-2">{[-1, 1].map(direction => <button key={direction} onClick={() => setSlide((slide + direction + SLIDES.length) % SLIDES.length)} aria-label={direction < 0 ? 'Previous slide' : 'Next slide'} className={`p-3 border rounded-full ${t.border} ${t.card} hover:text-[#1D9BF0] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}>{direction < 0 ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}</button>)}</div>
        </div>
      </section>
      <main className={`auth-flow ${t.surface}`}>
        <header className={`auth-flow-header border-b ${t.borderSoft}`}>
          <span className={`flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}><BadgeCheck size={16} className="text-[#1D9BF0]" /> NSU verified network</span>
          <button onClick={toggleTheme} aria-label="Toggle theme" className={`p-2.5 rounded-xl hover:bg-[#1D9BF0]/10 ${t.text} focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-95`}>{isDark ? <Sun size={19} /> : <Moon size={19} />}</button>
        </header>
        <div key={location.pathname} className="auth-route animate-fade-in"><Outlet /></div>
      </main>
      <Toast />
    </div>
  );
};
