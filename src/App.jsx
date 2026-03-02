import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Briefcase, MessageSquare, User, 
  Droplets, Bell, Search, Filter, ChevronRight, 
  MapPin, Phone, Send, Paperclip, Settings, 
  LogOut, Bookmark, FileText, ArrowLeft, Plus,
  Info, Lock, Mail, AlertTriangle, CheckCircle2,
  Moon, Sun, BadgeCheck, Clock, ArrowUpRight, ShieldCheck,
  Share, BookmarkIcon, GraduationCap, DollarSign, SlidersHorizontal,
  Edit, MoreVertical, CheckCheck, Smile, Copy, QrCode, Wifi, 
  Eye, Lightbulb, Shield, Globe, Smartphone, CreditCard, ChevronDown,
  Compass
} from 'lucide-react';

// --- CUSTOM LAYERED ICONS ---
const CustomBloodIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 28C21.5 28 26 23.5 26 18C26 10 16 3 16 3C16 3 6 10 6 18C6 23.5 10.5 28 16 28Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 19C11 16.5 13 14 13 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CustomJobsIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="6" y="10" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10V6C12 4.89543 12.8954 4 14 4H18C19.1046 4 20 4.89543 20 6V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomAlumniIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 26C6 21 10 17 16 17C22 17 26 21 26 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomMessagesIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M26 16C26 21.5 21.5 26 16 26C14.2 26 12.5 25.5 11 24.6L5 26L6.4 20C5.5 18.5 5 16.8 5 16C5 10.5 9.5 6 15 6C20.5 6 26 10.5 26 16Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="11" y1="16" x2="11.01" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="16" x2="16.01" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="21" y1="16" x2="21.01" y2="16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const JobSlider = ({ jobs, isDark, t, onSelectJob }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // Drag/Touch states
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Clone the first item and append it to the end for a seamless infinite loop
  const extendedJobs = [...jobs, jobs[0]];

  useEffect(() => {
    // Suspend auto-scroll while paused or dragging
    if (isPaused || dragStartX !== null) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX]);

  // When the slider reaches the clone, wait for the animation to finish, then instantly snap back to the real first card invisibly
  useEffect(() => {
    if (currentIndex === jobs.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700); // 700ms must match the CSS duration
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, jobs.length]);

  // Drag Event Handlers
  const handleDragStart = (clientX) => {
    setIsPaused(true);
    setDragStartX(clientX);
    setIsTransitioning(false); // disable transition to follow finger exactly
    setIsDragging(false);
  };

  const handleDragMove = (clientX) => {
    if (dragStartX === null) return;
    const offset = clientX - dragStartX;
    if (Math.abs(offset) > 10) setIsDragging(true);
    
    // Add resistance if dragging backwards on the first slide
    if (currentIndex === 0 && offset > 0) {
      setDragOffset(offset * 0.3);
    } else {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsTransitioning(true);
    setIsPaused(false);

    const threshold = 50; // pixels needed to count as a swipe
    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    setDragStartX(null);
    setDragOffset(0);

    // Give a slight delay before resetting isDragging to prevent accidental clicks
    setTimeout(() => setIsDragging(false), 50);
  };

  // Determine active dot for pagination (fallback to 0 when currently showing the clone)
  const activeDotIndex = currentIndex === jobs.length ? 0 : currentIndex;

  return (
    <div 
      className="relative w-full mt-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
    >
      <div 
        className="overflow-hidden -mx-4 px-4 pt-2 pb-4 -mb-2 relative z-0 touch-pan-y select-none"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
        >
          {extendedJobs.map((job, idx) => (
            <div key={`${job.id}-${idx}`} className="w-full shrink-0 px-1">
              <div 
                className={`h-full rounded-2xl p-5 relative overflow-hidden group cursor-pointer border ${t.border} hover:-translate-y-0.5 transition-transform`}
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  onSelectJob(job);
                }}
              >
                <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-emerald-500/10' : 'bg-gradient-to-b from-white to-emerald-500/10 backdrop-blur-3xl'}`}></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}>{job.type}</span>
                      <span className={`px-2 py-1 rounded-md text-[9px] font-extrabold ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black/70 border border-black/10'}`}>{job.location}</span>
                    </div>
                    <BookmarkIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2} />
                  </div>

                  <h3 className={`text-base font-extrabold tracking-tight ${t.text} mb-1.5 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate`}>{job.title}</h3>
                  
                  <div className="flex items-center space-x-1.5 mb-4">
                    <Briefcase className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
                    <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{job.company}</p>
                  </div>

                  <div className="mt-auto">
                    <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                      <div>
                        {job.urgent ? (
                          <span className="flex items-center text-red-500 text-[9px] font-extrabold bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                            <Clock className="w-2.5 h-2.5 mr-1" strokeWidth={3} /> {job.deadline}
                          </span>
                        ) : (
                          <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posted {job.posted}</span>
                        )}
                      </div>
                      <button className={`flex items-center text-[10px] font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:opacity-70 transition-opacity`}>
                        Details <ArrowUpRight className="w-3 h-3 ml-0.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center space-x-1.5 relative z-10 mt-3 mb-2">
        {jobs.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { 
              e.stopPropagation(); 
              setIsTransitioning(true);
              setCurrentIndex(idx); 
              setIsPaused(true); 
              setTimeout(() => setIsPaused(false), 4000); 
            }}
            className={`h-1.5 rounded-full transition-all duration-500 ${activeDotIndex === idx ? 'w-4 bg-emerald-500' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeOverlay, setActiveOverlay] = useState(null); 
  const [isEmergencyFlowOpen, setIsEmergencyFlowOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isDark, setIsDark] = useState(false); 
  
  const [requestedSet, setRequestedSet] = useState(new Set());

  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => setCurrentView('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const t = {
    bg: isDark ? 'bg-[#000000]' : 'bg-[#F2F5F8]', 
    card: isDark ? 'bg-[#121212]/60 backdrop-blur-2xl' : 'bg-white/70 backdrop-blur-2xl',
    surface: isDark ? 'bg-[#121212]' : 'bg-[#FFFFFF]',
    border: isDark ? 'border-white/10' : 'border-white',
    borderSoft: isDark ? 'border-white/[0.05]' : 'border-black/[0.03]',
    text: isDark ? 'text-[#E7E9EA]' : 'text-[#0F1419]',
    textMuted: isDark ? 'text-[#71767B]' : 'text-[#6B7280]',
    glass: isDark ? 'bg-[#000000]/70 backdrop-blur-xl border-white/10' : 'bg-[#F2F5F8]/80 backdrop-blur-xl border-white/40',
    overlayGlass: isDark ? 'bg-black/50 backdrop-blur-md' : 'bg-[#F2F5F8]/50 backdrop-blur-md',
    inputBg: isDark ? 'bg-[#202327]/60 backdrop-blur-md focus:bg-black/80' : 'bg-white/80 backdrop-blur-md focus:bg-white',
    inputBorder: isDark ? 'border-white/10 focus:border-[#1D9BF0]' : 'border-white focus:border-[#1D9BF0]',
    cardShadow: isDark ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-black/[0.04]', 
  };

  const toggleTheme = () => setIsDark(!isDark);

  const globalAlumniData = [
    { id: 1, name: 'Sarah Rahman', role: 'Software Engineer', company: 'Google', dept: 'CSE', skills: ['System Design', 'React', 'Node.js'], batch: 'Batch 19', location: 'Dhaka, BD', followers: '12.4k', blood: 'O+', verified: true, about: "Passionate software engineer with 4+ years of experience building scalable web applications. Always eager to connect with fellow NSUers and mentor juniors.", experience: [{ title: 'Software Engineer', company: 'Google', duration: '2022 - Present' }, { title: 'Frontend Developer', company: 'Pathao', duration: '2020 - 2022' }] },
    { id: 2, name: 'Tahmid Hasan', role: 'Product Lead', company: 'Pathao', dept: 'ECE', skills: ['Product Mgt', 'Growth'], batch: 'Batch 18', location: 'Dhaka, BD', followers: '8.2k', blood: 'B+', verified: true, about: "Building products that move millions. Former engineer turned product manager.", experience: [{ title: 'Product Lead', company: 'Pathao', duration: '2021 - Present' }] },
    { id: 3, name: 'Ayman Sadiq', role: 'CEO & Founder', company: '10 Minute School', dept: 'BBA', skills: ['EdTech', 'Leadership', 'Marketing'], batch: 'Batch 15', location: 'Dhaka, BD', followers: '1.2M', blood: 'A+', verified: true, about: "Making education accessible for everyone in Bangladesh.", experience: [{ title: 'CEO', company: '10 Minute School', duration: '2015 - Present' }] },
  ];

  const globalJobsData = [
    { id: 1, title: 'UI/UX Designer Intern', company: 'Brain Station 23', type: 'Internship', location: 'Remote', salary: 'Paid stipend', deadline: '2 days left', posted: '2h ago', preview: 'We are looking for a passionate UI/UX design intern to help build intuitive user interfaces for our upcoming fintech products. You will work closely with the product team.', match: true, urgent: true, reqs: ['Figma', 'Prototyping', 'Design Systems'] },
    { id: 2, title: 'Frontend Developer', company: 'Pathao', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Negotiable', deadline: '12 days left', posted: '1d ago', preview: 'Join our core engineering team to build high-performance web applications using React and Next.js. Minimum 1 year experience required.', match: true, urgent: false, reqs: ['React', 'Next.js', 'Tailwind CSS'] },
    { id: 3, title: 'Product Marketing Manager', company: '10 Minute School', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Competitive', deadline: '5 days left', posted: '3d ago', preview: 'Drive the go-to-market strategy for our new flagship educational courses. Work closely with product and sales teams to ensure successful launches.', match: false, urgent: false, reqs: ['Marketing', 'Strategy', 'Copywriting'] },
  ];

  const handleConnectClick = (e, id) => {
    e.stopPropagation();
    setRequestedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); 
      else next.add(id);
      return next;
    });
  };

  const getDeptStyle = (dept) => {
    const styles = {
      'CSE': isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200',
      'ECE': isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200',
      'BBA': isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200',
    };
    return styles[dept] || (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20');
  };

  const StatusBar = () => (
    <div className={`w-full h-12 flex justify-between items-center px-6 ${t.text} font-bold text-xs pt-2 bg-transparent z-50 transition-colors duration-500`}>
      <span>9:41</span>
      <div className="flex space-x-2 items-center">
        <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}></div>
        <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}></div>
        <div className={`w-6 h-3.5 rounded-sm ${isDark ? 'bg-white' : 'bg-black'} relative`}>
          <div className={`absolute right-[-3px] top-[4px] w-[2px] h-[6px] ${isDark ? 'bg-white' : 'bg-black'} rounded-r-sm`}></div>
        </div>
      </div>
    </div>
  );

  const Button = ({ text, onClick, variant = 'primary', icon: Icon, fullWidth = true, size = 'normal' }) => {
    const height = size === 'small' ? 'h-9 text-xs' : 'h-12 text-sm';
    const baseStyle = `flex items-center justify-center ${height} rounded-lg font-bold transition-all duration-200 active:scale-[0.97] ${fullWidth ? 'w-full' : 'px-5'} relative overflow-hidden`;
    
    const variants = {
      primary: `bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] shadow-lg shadow-[#1D9BF0]/40`,
      secondary: `${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} backdrop-blur-md hover:bg-black/10`,
      outline: `border ${isDark ? 'border-white/20' : 'border-black/10'} ${t.text} bg-transparent hover:${isDark ? 'bg-white/5' : 'bg-black/5'}`,
      emergency: `bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm`,
    };

    return (
      <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
        {Icon && <Icon className={`${size === 'small' ? 'w-3.5 h-3.5 mr-1.5' : 'w-4 h-4 mr-2'}`} strokeWidth={2.5} />}
        <span className="relative z-10">{text}</span>
      </button>
    );
  };

  const SplashScreen = () => (
    <div className={`flex flex-col items-center justify-center h-full ${t.bg} ${t.text} relative overflow-hidden transition-colors duration-500`}>
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-16 h-16 bg-[#1D9BF0] text-white flex items-center justify-center rounded-xl mb-6 shadow-xl shadow-[#1D9BF0]/40">
          <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45"></div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-widest mb-2">NSUNEXT</h1>
        <p className={`${t.textMuted} text-xs tracking-widest uppercase font-bold`}>Connectivity Redefined</p>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className={`flex flex-col h-full px-6 pt-24 transition-colors duration-500 animate-fade-in relative z-10`}>
      <div className="w-12 h-12 bg-[#1D9BF0] text-white flex items-center justify-center rounded-xl mb-8 shadow-lg shadow-[#1D9BF0]/30">
        <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
      </div>
      <h1 className={`text-3xl font-extrabold ${t.text} mb-2 tracking-tight`}>Welcome back.</h1>
      <p className={`${t.textMuted} mb-12 text-sm font-bold`}>Enter your university credentials to continue.</p>
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.textMuted} w-5 h-5`} strokeWidth={2.5} />
          <input 
            type="email" 
            placeholder="Email address" 
            className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-14 pl-12 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
            defaultValue="alex.johnson@northsouth.edu"
          />
        </div>
      </div>
      <Button text="Continue" onClick={() => setCurrentView('otp')} />
    </div>
  );

  const OtpScreen = () => (
    <div className={`flex flex-col h-full px-6 pt-16 transition-colors duration-500 animate-fade-in relative z-10`}>
      <button onClick={() => setCurrentView('login')} className={`w-10 h-10 mb-8 rounded-lg flex items-center justify-center ${t.card} hover:opacity-80 transition-opacity border ${t.border} shadow-sm`}>
        <ArrowLeft className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
      </button>
      <h1 className={`text-3xl font-extrabold ${t.text} mb-2 tracking-tight`}>Verify identity.</h1>
      <p className={`${t.textMuted} mb-12 text-sm font-bold`}>We sent a secure code to your email.</p>
      <div className="relative mb-8">
        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${t.textMuted} w-5 h-5`} strokeWidth={2.5} />
        <input 
          type="text" 
          placeholder="000000" 
          className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-14 pl-12 pr-4 text-xl tracking-[0.75em] font-extrabold ${t.text} focus:outline-none transition-all shadow-sm`}
          defaultValue="123456"
          maxLength={6}
        />
      </div>
      <Button text="Authenticate" onClick={() => setCurrentView('main')} />
    </div>
  );

  const HomeTab = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-36 px-5 pt-8 space-y-6 animate-fade-in relative z-10">
      <div className="mb-2">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 mb-1">
              <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={3} />
              <span className="text-[10px] font-extrabold text-[#1D9BF0] tracking-wide uppercase">Verified NSU Student</span>
            </div>
            <h1 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>
              Hi, Mahfuz <span className="text-xl inline-block origin-bottom-right animate-wave">👋</span>
            </h1>
            <p className={`${t.textMuted} text-xs font-bold mt-0.5`}>CSE • Batch 221</p>
          </div>

          <div className="flex space-x-2">
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm`}>
              {isDark ? <Sun className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />}
            </button>
            <button className={`w-8 h-8 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm relative`}>
              <Bell className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              <span className={`absolute top-0.5 right-1 w-2 h-2 bg-[#1D9BF0] border border-white/50 rounded-full`}></span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-1.5">
            <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Profile Strength</span>
            <span className={`text-[10px] font-extrabold text-[#1D9BF0]`}>80%</span>
          </div>
          <div className={`h-1.5 w-full ${isDark ? 'bg-white/10' : 'bg-black/5'} rounded-full overflow-hidden`}>
            <div className="h-full bg-[#1D9BF0] w-[80%] rounded-full shadow-sm shadow-[#1D9BF0]/50"></div>
          </div>
        </div>
      </div>

      {/* Redesigned Quick Actions: Custom Layered Icons + Label */}
      <div className="w-full pt-4 pb-2 relative z-10">
        <div className="flex flex-row items-start justify-between w-full px-2">
          {[
            { icon: CustomBloodIcon, label: 'Blood', action: () => setActiveTab('emergency') },
            { icon: CustomJobsIcon, label: 'Jobs', action: () => setActiveTab('jobs') },
            { icon: CustomAlumniIcon, label: 'Alumni', action: () => setActiveTab('directory') },
            { icon: CustomMessagesIcon, label: 'Messages', action: () => setActiveTab('messages') },
          ].map((action, idx) => (
            <div 
              key={idx} 
              onClick={action.action}
              className="flex-1 flex flex-col items-center justify-center min-h-[72px] cursor-pointer group transition-all duration-200 ease-out active:scale-90"
            >
              <action.icon 
                className={`w-[36px] h-[36px] mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`} 
              />
              <span className={`text-[12px] font-bold leading-tight text-center ${t.textMuted} group-hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-1 relative z-10 px-1">
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>Latest Jobs For You</h3>
          <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => setActiveTab('jobs')}>See All</button>
        </div>
        <JobSlider jobs={globalJobsData} isDark={isDark} t={t} onSelectJob={setSelectedJob} />
      </div>

      <div>
        <div className="flex justify-between items-end mb-1 relative z-10 px-1">
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>People to Connect With</h3>
          <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => setActiveTab('directory')}>See All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pt-4 pb-10 -mb-6 relative z-0">
          {globalAlumniData.slice(0,3).map((person) => (
            <div 
              key={person.id} 
              className={`w-[260px] shrink-0 p-5 rounded-2xl border ${t.border} ${t.cardShadow} flex flex-col cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all`} 
              onClick={() => setSelectedUser(person)}
            >
              <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white to-[#1D9BF0]/10 backdrop-blur-3xl'}`}></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-14 h-14 rounded-full shrink-0 ${isDark ? 'bg-white/5' : 'bg-white/60'} border ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center shadow-sm`}>
                    <User className={`w-6 h-6 ${t.text}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <h4 className={`font-extrabold text-base tracking-tight truncate ${t.text}`}>{person.name}</h4>
                      {person.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                    </div>
                    <p className={`font-bold ${t.textMuted} text-[11px] truncate`}>{person.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getDeptStyle(person.dept)}`}>
                    {person.dept}
                  </span>
                  {person.skills.slice(0, 1).map(skill => (
                    <span key={skill} className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-black/20 text-white/70 border border-white/10' : 'bg-white/60 text-black/60 shadow-sm border border-white'} truncate max-w-[100px]`}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div onClick={(e) => handleConnectClick(e, person.id)}>
                  {requestedSet.has(person.id) ? (
                    <div className={`flex items-center justify-center h-10 rounded-lg font-bold text-[13px] ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all`}>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-[#1D9BF0]" strokeWidth={2.5} /> Requested
                    </div>
                  ) : (
                    <button className={`w-full h-10 rounded-lg font-bold text-[13px] transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm backdrop-blur-md hover:bg-white'}`}>
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`shrink-0 ${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5 relative overflow-hidden group mt-2`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-red-500/20 transition-colors duration-700 -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-5">
             <div className="flex items-center space-x-3">
               <div className={`w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 ${isDark ? 'shadow-inner' : ''}`}>
                 <Droplets className="w-6 h-6 text-red-500" strokeWidth={2.5} />
               </div>
               <div>
                 <h3 className={`text-lg font-extrabold ${t.text} tracking-tight leading-tight`}>NSU Blood Bank</h3>
                 <p className={`${t.textMuted} text-[10px] font-extrabold uppercase tracking-wider mt-1`}>Emergency Support</p>
               </div>
             </div>
             <div className="flex items-center space-x-1.5 bg-red-500/10 px-2.5 py-1.5 rounded-md border border-red-500/20">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-red-500 text-[10px] font-extrabold tracking-wide uppercase">Live</span>
             </div>
          </div>
          <div className={`mb-5 p-4 rounded-xl ${isDark ? 'bg-black/40' : 'bg-white/40'} border ${t.borderSoft} flex items-center justify-between backdrop-blur-md hover:border-red-500/30 transition-colors cursor-pointer shadow-sm`} onClick={() => setActiveTab('emergency')}>
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40 text-white font-extrabold text-base border border-red-400">
                 B+
               </div>
               <div>
                 <h4 className={`text-sm font-extrabold ${t.text} leading-tight`}>Apollo Hospital</h4>
                 <p className={`${t.textMuted} text-xs font-bold mt-1`}>Needed immediately</p>
               </div>
             </div>
             <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
               <ChevronRight className="w-4 h-4" strokeWidth={3} />
             </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1"><Button text="Donate" variant="emergency" onClick={() => setActiveTab('emergency')} /></div>
            <button className={`flex-1 h-12 rounded-lg font-bold text-sm ${t.text} border ${t.borderSoft} ${isDark ? 'bg-white/5' : 'bg-black/5'} hover:opacity-80 transition-all flex items-center justify-center`} onClick={() => setActiveTab('emergency')}>
               <Search className="w-4 h-4 mr-2" strokeWidth={2.5} /> Find Blood
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EmergencyTab = () => {
    const [viewMode, setViewMode] = useState('list');
    const [isAvailable, setIsAvailable] = useState(true);

    const activeRequests = [
      { hospital: 'Apollo Hospital', bg: 'B+', distance: '2.3km', urgency: 'Critical', units: 2, match: 'Perfect Match', time: '10m ago' },
      { hospital: 'Square Hospital', bg: 'O+', distance: '5.1km', urgency: 'Needed Today', units: 1, match: 'Compatible', time: '1h ago' }
    ];

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-2xl font-extrabold text-red-500 tracking-tight leading-tight drop-shadow-sm`}>Emergency Support</h2>
              <p className={`${t.textMuted} text-[11px] font-bold tracking-wide mt-0.5`}>Campus Blood Network</p>
            </div>
            <button className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm`}>
              <Info className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
            {['List View', 'Map View'].map(seg => (
              <button 
                key={seg} 
                onClick={() => setViewMode(seg === 'List View' ? 'list' : 'map')}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all border backdrop-blur-md shadow-sm ${viewMode === (seg === 'List View' ? 'list' : 'map') ? 'bg-red-500/90 text-white border-red-500/50' : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-5 relative z-10 space-y-5">
          <div 
            className="rounded-3xl p-6 bg-red-500/10 backdrop-blur-xl border border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.2)] relative overflow-hidden cursor-pointer hover:bg-red-500/20 transition-all active:scale-[0.98]"
            onClick={() => setIsEmergencyFlowOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] mb-3 animate-pulse">
                  <Droplets className="w-8 h-8 text-white" strokeWidth={2.5} />
               </div>
               <h3 className={`text-xl font-extrabold text-red-500 drop-shadow-sm`}>I Need Blood Now</h3>
               <p className={`text-xs font-bold ${t.textMuted} mt-1`}>Send an instant alert to nearby donors</p>
            </div>
          </div>

          <div className={`rounded-2xl p-5 ${t.cardShadow} border ${t.border} relative overflow-hidden`}>
             <div className={`absolute inset-0 z-0 ${t.card}`}></div>
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                         <BadgeCheck className="text-green-500 w-5 h-5" strokeWidth={2.5}/>
                      </div>
                      <div>
                         <p className={`text-sm font-extrabold ${t.text}`}>Donor Status</p>
                         <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{isAvailable ? 'Available to donate' : 'Currently Unavailable'}</p>
                      </div>
                   </div>
                   <div 
                     onClick={() => setIsAvailable(!isAvailable)} 
                     className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors cursor-pointer shadow-inner border ${isAvailable ? 'bg-green-500 border-green-400' : (isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20')}`}
                   >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></div>
                   </div>
                </div>
                <div className={`pt-4 border-t ${t.borderSoft} flex justify-between items-center`}>
                   <span className={`text-xs font-bold ${t.textMuted}`}>Your Impact: <strong className={`text-green-500`}>3 Lives Saved</strong></span>
                   <span className="px-2 py-1 rounded-md text-[10px] bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-extrabold border border-yellow-500/30 shadow-sm">Gold Donor</span>
                </div>
             </div>
          </div>

          {viewMode === 'list' ? (
            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4 drop-shadow-sm`}>Active Requests Near You</h3>
              <div className="space-y-4">
                {activeRequests.map((req, i) => (
                  <div key={i} className={`rounded-2xl p-5 ${t.cardShadow} border ${t.border} relative overflow-hidden group hover:border-red-500/50 transition-colors`}>
                    <div className={`absolute inset-0 z-0 ${t.card}`}></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex space-x-2">
                           <span className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wide border border-red-400 shadow-sm">{req.urgency}: {req.bg}</span>
                           <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold backdrop-blur-md shadow-sm border ${isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-600 border-green-200'}`}>{req.match}</span>
                        </div>
                        <span className={`text-red-500 text-[10px] font-extrabold drop-shadow-sm`}>{req.time}</span>
                      </div>
                      <h4 className={`font-extrabold ${t.text} text-lg mb-1 leading-tight`}>{req.hospital}</h4>
                      <p className={`${t.textMuted} text-xs font-bold mb-4`}>{req.distance} away • {req.units} units needed</p>
                      <button className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all active:scale-[0.97] bg-red-500 text-white shadow-lg shadow-red-500/40 border border-red-400`}>
                        I Can Help
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-inner">
              <div className={`absolute inset-0 ${isDark ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'}`}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-[3px] border-white rounded-full shadow-lg"></div>
              </div>
              <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] border border-white"></div>
              <div className="absolute top-[60%] right-[30%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] border border-white blur-[1px]"></div>
              <div className="absolute top-[40%] right-[40%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] border-2 border-white animate-bounce"></div>
              
              <div className={`absolute bottom-4 left-4 right-4 ${isDark ? 'bg-[#121212]/90 border-white/10' : 'bg-white/90 border-black/5'} backdrop-blur-xl p-4 rounded-2xl shadow-xl`}>
                 <div className="flex justify-between items-start mb-2">
                   <span className="bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-extrabold uppercase">Critical: B+</span>
                   <span className="text-xs font-bold text-gray-500">0.8 km</span>
                 </div>
                 <h4 className={`font-extrabold text-sm ${t.text}`}>Apollo Hospital</h4>
                 <button className="mt-3 w-full py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform">View Request</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EmergencyFlowOverlay = ({ onClose }) => {
    const [step, setStep] = useState('form'); 
    const [selectedBg, setSelectedBg] = useState('B+');

    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-red-500 rounded-full mix-blend-screen filter blur-[150px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight drop-shadow-sm`}>
            {step === 'form' ? 'Request Blood' : step === 'confirm' ? 'Confirm Broadcast' : 'Live Tracking'}
          </h2>
          <div className="w-10 h-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-10 relative z-10 px-5 pt-6">
          {step === 'form' && (
            <div className="space-y-6 animate-fade-in">
              <div className={`p-5 rounded-2xl ${t.cardShadow} border ${t.border} relative overflow-hidden`}>
                 <div className={`absolute inset-0 z-0 ${t.card}`}></div>
                 <div className="relative z-10 space-y-5">
                    <div>
                      <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Blood Group Needed</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                          <div 
                            key={bg} 
                            onClick={() => setSelectedBg(bg)}
                            className={`py-2.5 rounded-xl text-center font-extrabold text-sm border shadow-sm transition-all cursor-pointer ${selectedBg === bg ? 'bg-red-500 text-white border-red-500 shadow-[0_4px_14px_rgba(239,68,68,0.4)]' : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/50 text-gray-700 border-black/5'} hover:border-red-500/50`}`}>{bg}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Hospital Name & Location</label>
                      <div className="relative">
                        <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                        <input type="text" placeholder="E.g. Apollo Hospital, Dhaka" defaultValue="Apollo Hospital" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Units</label>
                         <select className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none appearance-none shadow-sm`}>
                            <option>1 Unit</option>
                            <option selected>2 Units</option>
                            <option>3+ Units</option>
                         </select>
                       </div>
                       <div>
                         <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Urgency</label>
                         <select className={`w-full bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl h-12 px-4 text-sm font-bold focus:outline-none appearance-none shadow-sm`}>
                            <option selected>Critical (Now)</option>
                            <option>Today</option>
                            <option>Within 48h</option>
                         </select>
                       </div>
                    </div>
                    <div>
                      <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Contact Number</label>
                      <div className="relative">
                        <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                        <input type="tel" placeholder="01XXXXXXXXX" defaultValue="01712345678" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                      </div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setStep('confirm')}
                className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-red-500 text-white shadow-lg shadow-red-500/40 border border-red-400`}
              >
                Review Alert
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="flex flex-col items-center pt-8 animate-fade-in">
               <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute inset-4 rounded-full border-2 border-red-500/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                  <div className="absolute inset-8 rounded-full border-2 border-red-500/50 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.8)] z-10">
                    <Droplets className="text-white w-10 h-10" strokeWidth={2.5} />
                  </div>
               </div>
               
               <h3 className={`text-3xl font-extrabold ${t.text} mb-2 tracking-tight text-center drop-shadow-md`}>248 Donors Found</h3>
               <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 px-4`}>There are 248 verified {selectedBg} and compatible donors within a 5km radius of Apollo Hospital.</p>
               
               <div className={`w-full p-4 rounded-2xl ${t.cardShadow} border ${t.border} relative overflow-hidden mb-8`}>
                  <div className={`absolute inset-0 z-0 ${t.card}`}></div>
                  <div className="relative z-10 flex justify-between items-center">
                     <div>
                        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Request Summary</p>
                        <p className={`text-base font-extrabold ${t.text}`}>2 Units • {selectedBg} • Critical</p>
                     </div>
                     <button onClick={() => setStep('form')} className={`text-xs font-bold text-[#1D9BF0] hover:underline`}>Edit</button>
                  </div>
               </div>

               <button 
                onClick={() => setStep('tracking')}
                className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-red-500 text-white shadow-lg shadow-red-500/40 border border-red-400 flex items-center justify-center space-x-2`}
               >
                 <AlertTriangle className="w-5 h-5" strokeWidth={2.5}/>
                 <span>Send Emergency Alert</span>
               </button>
            </div>
          )}

          {step === 'tracking' && (
             <div className="animate-fade-in space-y-6">
                <div className="text-center mb-2">
                   <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full mb-4 shadow-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
                      <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Broadcast Active</span>
                   </div>
                   <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight drop-shadow-md`}>Awaiting Responses...</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className={`p-4 rounded-2xl ${t.card} border ${t.border} text-center shadow-sm backdrop-blur-md`}>
                    <span className={`block text-2xl font-extrabold ${t.text} drop-shadow-sm`}>248</span>
                    <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Notified</span>
                  </div>
                  <div className={`p-4 rounded-2xl ${t.card} border ${t.border} text-center shadow-sm backdrop-blur-md`}>
                    <span className={`block text-2xl font-extrabold ${t.text} drop-shadow-sm`}>45</span>
                    <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Viewed</span>
                  </div>
                  <div className={`p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-center shadow-sm backdrop-blur-md`}>
                    <span className={`block text-2xl font-extrabold text-green-500 drop-shadow-sm`}>1</span>
                    <span className={`text-[9px] font-extrabold text-green-600 dark:text-green-400 uppercase tracking-wider`}>Accepted</span>
                  </div>
                </div>

                <div>
                   <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4 drop-shadow-sm`}>Accepted Donors</h3>
                   <div className={`rounded-2xl p-5 ${t.cardShadow} border border-green-500/30 relative overflow-hidden`}>
                     <div className={`absolute inset-0 z-0 ${isDark ? 'bg-green-500/5' : 'bg-green-50'}`}></div>
                     <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                     <div className="relative z-10 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-[10px] font-extrabold text-green-600 bg-green-500/20 px-2.5 py-1 rounded-md border border-green-500/30 shadow-sm uppercase tracking-wide">Donor Found</span>
                           <span className={`text-xs font-bold ${t.textMuted}`}>1.2 km away</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                           <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/60'} border border-green-500/30 flex items-center justify-center shadow-sm backdrop-blur-md overflow-hidden shrink-0`}>
                             <User className={`w-6 h-6 text-green-600 dark:text-green-400`} strokeWidth={1.5} />
                           </div>
                           <div>
                             <h4 className={`font-extrabold text-lg leading-tight ${t.text} drop-shadow-sm`}>Sarah Rahman</h4>
                             <p className={`text-[10px] font-bold ${t.textMuted} mt-0.5`}>Gold Donor • Perfect Match (B+)</p>
                           </div>
                        </div>
                        <button className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all active:scale-[0.97] bg-green-500 text-white shadow-lg shadow-green-500/40 border border-green-400 flex items-center justify-center space-x-2`}>
                           <MessageSquare className="w-4 h-4" strokeWidth={2.5}/>
                           <span>Open Private Chat</span>
                        </button>
                     </div>
                   </div>
                </div>

             </div>
          )}
        </div>
      </div>
    );
  };

  const DirectoryTab = () => {
    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b`}>
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Alumni Directory</h2>
              <p className={`${t.textMuted} text-[11px] font-bold tracking-wide mt-0.5`}>3,248 Verified Alumni</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mb-3">
            <div className="relative flex-1">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
              <input 
                type="text" 
                placeholder="Search name, company..." 
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
              />
            </div>
            <button className={`w-11 h-11 rounded-lg ${t.card} border ${t.border} flex items-center justify-center ${t.text} hover:border-[#1D9BF0]/50 transition-colors shadow-sm shrink-0`}>
              <Filter className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="flex items-center text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider">
             Showing 48 results • CSE • Batch 221
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-6 relative z-10 space-y-5">
          {globalAlumniData.map((person) => (
            <div 
              key={person.id} 
              // Fixed: Native Tailwind shadows
              className={`rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`} 
              onClick={() => setSelectedUser(person)}
            >
              <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white to-[#1D9BF0]/10 backdrop-blur-3xl'}`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-full shrink-0 ${isDark ? 'bg-white/5' : 'bg-white/60'} border ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center shadow-sm`}>
                    <User className={`w-8 h-8 ${t.text}`} strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <h3 className={`font-extrabold text-xl tracking-tight leading-tight truncate ${t.text}`}>{person.name}</h3>
                      {person.verified && <BadgeCheck className="w-5 h-5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                    </div>
                    <p className={`font-bold ${t.textMuted} text-xs truncate`}>{person.role} • {person.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getDeptStyle(person.dept)}`}>
                    {person.dept}
                  </span>
                  {person.skills.map(skill => (
                    <span key={skill} className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-black/20 text-white/70 border border-white/10' : 'bg-white/60 text-black/60 shadow-sm border border-white'}`}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className={`flex justify-between items-center mb-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                  <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Blood</p>
                    <p className={`text-sm font-extrabold ${t.text} flex items-center justify-center`}>
                      <Droplets className="w-3 h-3 text-red-500 mr-1" strokeWidth={3} /> {person.blood}
                    </p>
                  </div>
                  <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
                    <p className={`text-sm font-extrabold ${t.text}`}>{person.batch.split(' ')[1]}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Network</p>
                    <p className={`text-sm font-extrabold ${t.text}`}>{person.followers}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="flex-1" onClick={(e) => handleConnectClick(e, person.id)}>
                    {requestedSet.has(person.id) ? (
                      <div className={`flex items-center justify-center h-11 rounded-lg font-bold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all`}>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-[#1D9BF0]" strokeWidth={2.5} /> Requested
                      </div>
                    ) : (
                      <button className={`w-full h-11 rounded-lg font-bold text-sm transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white/60 text-black border border-white shadow-sm backdrop-blur-md hover:bg-white'}`}>
                        Connect
                      </button>
                    )}
                  </div>
                  <button className={`w-11 h-11 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white shadow-sm border border-transparent'} transition-transform active:scale-95`} onClick={(e) => e.stopPropagation()}>
                    <BookmarkIcon className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const JobsTab = () => {
    const [jobSegment, setJobSegment] = useState('All Jobs');

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Jobs</h2>
              <p className={`${t.textMuted} text-[11px] font-bold tracking-wide mt-0.5`}>Curated by NSU Alumni</p>
            </div>
            <div className="flex space-x-2">
              <button className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50`}>
                <BookmarkIcon className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
              <button className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50`}>
                <Filter className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="relative w-full mb-4">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search by title or company..." 
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
            />
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} mb-4`}>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-extrabold ${t.text}`}>For: CSE</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="text-[10px] font-extrabold text-[#1D9BF0] bg-[#1D9BF0]/10 px-2 py-0.5 rounded-md border border-[#1D9BF0]/20">Matches prioritized</span>
            </div>
            <button className={`text-[10px] font-extrabold ${t.textMuted} hover:${t.text} transition-colors uppercase tracking-wider`}>Change</button>
          </div>

          <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
            {['All Jobs', 'For You', 'Saved'].map(seg => (
              <button 
                key={seg} 
                onClick={() => setJobSegment(seg)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all border ${jobSegment === seg ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm' : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-5 relative z-10 space-y-4">
          {globalJobsData.map((job) => (
            <div 
              key={job.id} 
              // Fixed: Native Tailwind shadows
              className={`rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-emerald-500/10' : 'bg-gradient-to-b from-white to-emerald-500/10 backdrop-blur-3xl'}`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}>{job.type}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black/70 border border-black/10'}`}>{job.location}</span>
                  </div>
                  <button className={`text-gray-400 hover:text-emerald-500 transition-colors active:scale-95`} onClick={(e) => e.stopPropagation()}>
                    <BookmarkIcon className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>

                <h3 className={`text-lg font-extrabold tracking-tight ${t.text} mb-1.5 leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors`}>{job.title}</h3>
                
                <div className="flex items-center space-x-1.5 mb-3">
                  <Briefcase className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
                  <p className={`text-xs font-bold ${t.textMuted}`}>{job.company}</p>
                  <span className="w-1 h-1 rounded-full bg-gray-400/50"></span>
                  <p className={`text-xs font-bold ${t.textMuted}`}>{job.salary}</p>
                </div>

                <p className={`text-[11px] font-bold ${t.textMuted} line-clamp-2 mb-4 leading-relaxed`}>{job.preview}</p>

                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                  <div>
                    {job.urgent ? (
                      <span className="flex items-center text-red-500 text-[10px] font-extrabold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                        <Clock className="w-3 h-3 mr-1" strokeWidth={3} /> {job.deadline}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posted {job.posted}</span>
                    )}
                  </div>
                  <button className={`flex items-center text-[11px] font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:opacity-70 transition-opacity`}>
                    View Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-30">
          <button className={`flex items-center justify-center h-10 px-5 rounded-full font-bold text-sm bg-black dark:bg-white text-white dark:text-black shadow-lg active:scale-95 transition-transform`}>
            <SlidersHorizontal className="w-4 h-4 mr-2" strokeWidth={2.5} /> Filter
          </button>
        </div>
      </div>
    );
  };

  const MessagesTab = () => {
    const conversations = [
      { id: 1, name: 'Sarah Rahman', dept: 'CSE', msg: 'The project files are attached, let\'s sync...', time: '2m ago', unread: true },
      { id: 2, name: 'Tahmid Hasan', dept: 'ECE', msg: 'Thanks for the update! Looking forward to it.', time: '1h ago', unread: false },
      { id: 3, name: 'Dr. Aminul Islam', dept: 'Faculty', msg: 'Can we schedule a meeting tomorrow at 3 PM?', time: 'Yesterday', unread: false },
      { id: 4, name: 'Nabila Islam', dept: 'CSE', msg: 'Did you check out the new design system files?', time: 'Tuesday', unread: false },
    ];

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Messages</h2>
            <div className="flex space-x-2">
              <button className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50`}>
                <Edit className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
              <button className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50`}>
                <Filter className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="relative w-full">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-4 pt-3 relative z-10">
          {conversations.map((chat) => (
            <div 
              key={chat.id} 
              className={`flex items-center p-4 rounded-xl border border-transparent hover:${isDark ? 'bg-white/5' : 'bg-black/5'} hover:border-white/10 transition-all cursor-pointer mb-1 group`} 
              onClick={() => setActiveOverlay('chat')}
            >
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-full ${t.card} border ${t.borderSoft} flex items-center justify-center shadow-sm`}>
                  <User className={`w-6 h-6 ${t.text}`} strokeWidth={2} />
                </div>
                {chat.unread && (
                  <div className={`absolute top-0 right-0 w-3.5 h-3.5 bg-[#1D9BF0] border-2 ${isDark ? 'border-[#000000]' : 'border-[#F2F5F8] group-hover:border-[#E5E8EB]'} rounded-full transition-colors`}></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0 ml-4">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <h4 className={`text-sm ${chat.unread ? `font-extrabold ${t.text}` : `font-bold ${t.text}`}`}>{chat.name}</h4>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${isDark ? 'bg-white/10 text-white/70' : 'bg-black/5 text-black/50'}`}>{chat.dept}</span>
                  </div>
                  <span className={`${chat.unread ? 'text-[#1D9BF0] font-extrabold' : t.textMuted + ' font-bold'} text-[10px] shrink-0`}>{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? `font-bold ${t.text}` : `${t.textMuted} font-medium`}`}>
                  {chat.msg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProfileTab = () => {
    const [profileSegment, setProfileSegment] = useState('Account');
    const [copied, setCopied] = useState(false);

    const handleCopyID = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const SettingsItem = ({ icon: Icon, label, value, isToggle, toggleState, onToggle, isDestructive }) => (
      <div className={`flex items-center justify-between p-4 border-b ${t.borderSoft} last:border-0 hover:${isDark ? 'bg-white/5' : 'bg-black/5'} transition-colors cursor-pointer group`}>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 mr-3 ${isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2} />
          <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : t.text}`}>{label}</span>
        </div>
        <div className="flex items-center">
          {value && <span className={`text-xs font-bold ${t.textMuted} mr-2`}>{value}</span>}
          {isToggle ? (
            <div onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }} className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${toggleState ? 'bg-[#1D9BF0]' : (isDark ? 'bg-white/20' : 'bg-gray-300')}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${toggleState ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          ) : (
            <ChevronRight className={`w-4 h-4 ${t.textMuted} group-hover:${t.text} transition-colors`} strokeWidth={2.5} />
          )}
        </div>
      </div>
    );

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className="px-5 pt-8 pb-2 flex justify-between items-center relative z-20">
          <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight`}>Control Center</h2>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 relative z-10">
          <div className={`mx-5 mt-4 rounded-2xl p-6 relative overflow-hidden ${t.cardShadow} border ${t.border}`}>
            <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/15' : 'bg-gradient-to-b from-white to-[#1D9BF0]/15 backdrop-blur-3xl'}`}></div>
            
            <div className="relative z-10 flex items-center">
              <div className="relative shrink-0 mr-5">
                {/* Fixed: Native Tailwind shadows */}
                <div className="w-20 h-20 rounded-full border-[3px] border-[#1D9BF0] p-1 shadow-lg shadow-[#1D9BF0]/30">
                  <div className={`w-full h-full rounded-full ${isDark ? 'bg-white/10' : 'bg-white/60'} flex items-center justify-center overflow-hidden`}>
                     <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-[#1D9BF0] rounded-full border-2 ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center shadow-sm`}>
                  <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} truncate`}>Mahfuz</h2>
                    <p className={`font-bold ${t.textMuted} text-xs mt-0.5 truncate`}>Final Year CS Student</p>
                  </div>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.borderSoft} transition-transform active:scale-95`}>
                    <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <button 
                    onClick={handleCopyID}
                    className={`flex items-center px-2.5 py-1.5 rounded-md ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/60 text-black border-white'} border shadow-sm transition-all active:scale-95`}
                  >
                    <span className="text-[10px] font-extrabold mr-1.5 opacity-80">ID</span>
                    <span className="text-[11px] font-extrabold font-mono tracking-wider mr-2">2024CS1021</span>
                    {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" strokeWidth={3}/> : <Copy className="w-3 h-3 opacity-60" strokeWidth={2.5}/>}
                  </button>
                  <button className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/60 text-black border-white'} border shadow-sm transition-transform active:scale-95`}>
                     <QrCode className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-5 mt-6 mb-6">
            <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft}`}>
              {['Account', 'Career', 'Settings'].map(seg => (
                <button 
                  key={seg} 
                  onClick={() => setProfileSegment(seg)}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${profileSegment === seg ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border` : `text-gray-500 hover:${t.text}`}`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          {profileSegment === 'Account' && (
            <div className="px-5 space-y-6 animate-fade-in">
              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Digital ID</h3>
                <div className={`w-full aspect-[1.58/1] rounded-2xl p-6 relative overflow-hidden shadow-2xl`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1D9BF0]"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 to-transparent opacity-50"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white/80 font-extrabold text-[10px] tracking-widest uppercase mb-1">North South University</h4>
                        <h3 className="text-white font-extrabold text-lg tracking-tight">Student Access ID</h3>
                      </div>
                      <Wifi className="w-6 h-6 text-white/60 rotate-90" strokeWidth={2} />
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white font-extrabold text-xl mb-0.5">Mahfuz</p>
                        <p className="text-white/70 font-mono text-xs font-bold tracking-widest mb-2">2024CS1021</p>
                        <div className="flex space-x-3">
                          <div>
                            <p className="text-white/50 text-[8px] font-bold uppercase tracking-wider mb-0.5">Dept</p>
                            <p className="text-white text-xs font-bold">CSE</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-[8px] font-bold uppercase tracking-wider mb-0.5">Valid Thru</p>
                            <p className="text-white text-xs font-bold">12/26</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-inner">
                        <QrCode className="w-full h-full text-black" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Applications', count: '12', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Saved Jobs', count: '4', icon: BookmarkIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'Connections', count: '124', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Profile Views', count: '89', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl ${t.card} border ${t.border} ${t.cardShadow} flex flex-col cursor-pointer hover:border-[#1D9BF0]/30 transition-colors`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} strokeWidth={2.5} />
                        </div>
                        <h4 className={`text-xl font-extrabold ${t.text}`}>{stat.count}</h4>
                      </div>
                      <span className={`text-xs font-bold ${t.textMuted}`}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${t.card} border ${t.border} ${t.cardShadow} relative overflow-hidden group cursor-pointer`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9BF0]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full bg-[#1D9BF0]/10 border border-[#1D9BF0]/20 flex items-center justify-center shrink-0`}>
                    <Lightbulb className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold ${t.text} mb-1`}>Profile Insight</h4>
                    <p className={`text-xs font-bold ${t.textMuted} leading-relaxed`}>Your profile is getting <span className={`text-[#1D9BF0]`}>23% more views</span> this week. Recruiters searched your skill 'React' 5 times.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profileSegment === 'Career' && (
            <div className="px-5 space-y-6 animate-fade-in">
              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Preferences</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={Briefcase} label="Preferred Job Roles" value="Frontend, UI/UX" />
                  <SettingsItem icon={MapPin} label="Preferred Locations" value="Dhaka, Remote" />
                  <SettingsItem icon={DollarSign} label="Salary Expectation" value="Negotiable" />
                  <SettingsItem icon={Globe} label="Work Mode" value="Hybrid" />
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Documents</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={FileText} label="Manage Resume" value="Updated 2d ago" />
                  <SettingsItem icon={Share} label="Portfolio Links" value="2 links" />
                </div>
              </div>
            </div>
          )}

          {profileSegment === 'Settings' && (
            <div className="px-5 space-y-6 animate-fade-in">
              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Account</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={User} label="Personal Information" />
                  <SettingsItem icon={Mail} label="Email & Phone" />
                  <SettingsItem icon={Lock} label="Change Password" />
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Security & Privacy</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={Shield} label="Two-Factor Authentication" value="Off" />
                  <SettingsItem icon={Eye} label="Profile Visibility" value="Public" />
                  <SettingsItem icon={Smartphone} label="Active Sessions" value="2 devices" />
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Preferences</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={Bell} label="Push Notifications" isToggle={true} toggleState={true} />
                  <SettingsItem 
                    icon={isDark ? Moon : Sun} 
                    label="Dark Mode" 
                    isToggle={true} 
                    toggleState={isDark} 
                    onToggle={toggleTheme} 
                  />
                  <SettingsItem icon={Globe} label="Language" value="English" />
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Support & Legal</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={Info} label="Help Center" />
                  <SettingsItem icon={AlertTriangle} label="Report a Bug" />
                  <SettingsItem icon={FileText} label="Privacy Policy" />
                </div>
                <div className="text-center mt-4">
                  <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>NSUNEXT v1.0.0</span>
                </div>
              </div>

              <div className="pt-2">
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                  <SettingsItem icon={LogOut} label="Log Out" isDestructive={true} hasArrow={false} onClick={() => setCurrentView('login')} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const UserProfileView = ({ user, onBack }) => {
    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>{user.name}</h2>
          <button className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
             <Share className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-10 relative z-10">
          {/* Fixed: Native Tailwind shadows */}
          <div className={`m-5 mt-6 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}>
            <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white/90 to-[#1D9BF0]/10 backdrop-blur-3xl'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-28 h-28 rounded-full ${isDark ? 'bg-white/5' : 'bg-white/60'} border-2 ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center mb-5 shadow-lg overflow-hidden`}>
                <User className={`w-12 h-12 ${t.text}`} strokeWidth={1.5} />
              </div>
              
              <div className="flex items-center space-x-1.5 mb-1">
                <h2 className={`font-extrabold text-3xl tracking-tight leading-tight ${t.text}`}>{user.name}</h2>
                {user.verified && <BadgeCheck className="w-6 h-6 text-[#1D9BF0]" strokeWidth={2.5} />}
              </div>
              
              <p className={`font-bold ${t.textMuted} text-base mb-4 text-center`}>{user.role} <br/> <span className="opacity-80">@ {user.company}</span></p>
              
              <div className="flex space-x-2 mb-6">
                <span className={`px-4 py-2 rounded-md text-xs font-extrabold ${isDark ? 'bg-white/10 text-white' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                  {user.dept}
                </span>
                <span className={`px-4 py-2 rounded-md text-xs font-extrabold flex items-center ${isDark ? 'bg-black/20 text-white/70' : 'bg-white/60 text-black/60 shadow-sm border border-white'}`}>
                  <MapPin className="w-3.5 h-3.5 mr-1" strokeWidth={2.5}/> {user.location}
                </span>
              </div>

              <div className={`w-full flex justify-between items-center pt-6 mb-6 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Blood</p>
                  <p className={`text-base font-extrabold ${t.text} flex items-center justify-center`}>
                    <Droplets className="w-4 h-4 text-red-500 mr-1" strokeWidth={3} /> {user.blood}
                  </p>
                </div>
                <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
                  <p className={`text-base font-extrabold ${t.text}`}>{user.batch.split(' ')[1]}</p>
                </div>
                <div className="text-center flex-1">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Network</p>
                  <p className={`text-base font-extrabold ${t.text}`}>{user.followers}</p>
                </div>
              </div>

              <div className="flex space-x-3 w-full">
                <div className="flex-1">
                   {/* Fixed: Native Tailwind shadows */}
                   <button className={`w-full h-12 rounded-lg font-bold text-sm transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40`}>
                     Connect
                   </button>
                </div>
                <button className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-white shadow-sm border border-transparent'} transition-transform active:scale-95`}>
                  <MessageSquare className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 space-y-5">
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-6`}>
              <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
              <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90`}>{user.about}</p>
            </div>

            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-6`}>
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
            </div>

             <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-6`}>
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JobDetailView = ({ job, onBack }) => {
    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Job Details</h2>
          <button className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
             <BookmarkIcon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-28 relative z-10">
          {/* Fixed: Native Tailwind shadows */}
          <div className={`m-5 mt-6 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}>
            <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-emerald-500/10' : 'bg-gradient-to-b from-white/90 to-emerald-500/10 backdrop-blur-3xl'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/60'} border-2 ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center mb-4 shadow-lg`}>
                <Briefcase className={`w-8 h-8 ${t.text}`} strokeWidth={2} />
              </div>
              
              <h2 className={`font-extrabold text-2xl tracking-tight leading-tight ${t.text} mb-1`}>{job.title}</h2>
              <p className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-base mb-6`}>{job.company}</p>
              
              <div className={`w-full grid grid-cols-2 gap-3 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                   <MapPin className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                   <span className={`text-xs font-extrabold ${t.text}`}>{job.location}</span>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                   <Briefcase className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                   <span className={`text-xs font-extrabold ${t.text}`}>{job.type}</span>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                   <DollarSign className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                   <span className={`text-xs font-extrabold ${t.text}`}>{job.salary}</span>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'} flex flex-col items-center shadow-sm`}>
                   <Clock className="w-4 h-4 text-red-500 mb-1.5" strokeWidth={2.5} />
                   <span className="text-xs font-extrabold text-red-500">{job.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 space-y-5">
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-6`}>
              <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Job Description</h3>
              <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 mb-6`}>{job.preview} We are a fast-growing startup looking for hungry individuals who want to make a real impact. You will be responsible for end-to-end delivery of features.</p>
              
              <h4 className={`text-sm font-extrabold ${t.text} tracking-tight mb-3`}>Requirements</h4>
              <ul className="space-y-2">
                {job.reqs.map((req, idx) => (
                  <li key={idx} className={`flex items-center text-sm font-medium ${t.text} opacity-90`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
           {/* Fixed: Native Tailwind shadows */}
           <button className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-emerald-500 text-white shadow-lg shadow-emerald-500/40`}>
             Apply Now
           </button>
        </div>
      </div>
    );
  };

  const ChatOverlay = () => (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className={`absolute top-[20%] left-[-20%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-30'}`}></div>
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center">
          <button onClick={() => setActiveOverlay(null)} className={`mr-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors hover:opacity-80`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} flex items-center justify-center mr-3 relative shadow-inner shrink-0`}>
            <User className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Sarah Rahman</h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`text-[10px] font-bold ${t.textMuted}`}>Software Eng • CSE</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="text-[10px] font-extrabold text-[#1D9BF0]">Active now</span>
            </div>
          </div>
        </div>
        <button className={`w-10 h-10 flex items-center justify-center rounded-lg hover:${t.card.split(' ')[0]} transition-colors`}>
          <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col relative z-10 pb-6">
        
        <div className="flex items-center justify-center my-2 space-x-4 opacity-70">
          <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
          <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Today</span>
          <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
        </div>

        <div className="self-start max-w-[80%] relative group mb-2">
          <div className={`p-3.5 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} shadow-sm backdrop-blur-md`}>
            <p className={`text-sm font-medium ${t.text} leading-relaxed`}>I reviewed the architectural proposals you sent over. Let's sync on the database schema before the sprint starts.</p>
          </div>
          <div className={`absolute -bottom-2 -right-2 ${isDark ? 'bg-[#1A1A1A] border-white/20' : 'bg-white border-gray-200'} border rounded-full px-1.5 py-0.5 shadow-sm flex items-center`}>
            <span className="text-[11px]">👍</span>
            <span className={`text-[9px] font-extrabold ml-1 ${t.text}`}>1</span>
          </div>
          <span className={`text-[10px] font-bold ${t.textMuted} mt-2.5 ml-1 block`}>10:30 AM</span>
        </div>

        <div className="self-end max-w-[80%] relative">
          {/* Fixed: Native Tailwind shadows */}
          <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/30">
            <div className="bg-black/15 rounded-lg p-2.5 mb-2 border-l-[3px] border-white">
              <p className="text-[10px] font-extrabold text-white mb-0.5">Sarah Rahman</p>
              <p className="text-[11px] text-white/90 line-clamp-1 font-medium">I reviewed the architectural proposals you sent...</p>
            </div>
            <p className="text-sm font-medium leading-relaxed">Perfect. I'll prepare the diagrams. Are you free at 2 PM?</p>
          </div>
          <div className="flex justify-end items-center mt-1.5 space-x-1 mr-1">
            <span className={`text-[10px] font-bold ${t.textMuted}`}>10:42 AM</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="self-start max-w-[80%] mt-2">
          <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} flex items-center space-x-1 w-fit`}>
            <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>

      </div>

      <div className={`p-4 ${t.glass} border-t pb-6 flex items-end space-x-2 relative z-10`}>
        <button className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg ${t.card} border ${t.border} shadow-sm active:scale-95 transition-transform hover:opacity-80`}>
          <Plus className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
        </button>
        <div className={`flex-1 ${t.card} border ${t.border} rounded-lg flex items-center px-3 min-h-[40px] shadow-inner`}>
           <textarea 
            placeholder="Message..." 
            rows="1"
            className={`w-full bg-transparent text-sm font-bold ${t.text} focus:outline-none resize-none py-2.5 max-h-24`}
           />
        </div>
        {/* Fixed: Native Tailwind shadows */}
        <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/40 active:scale-95 transition-transform">
          <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* Apple Liquid Glass Capsule Styles */
        .nav-capsule-light {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.4) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.15),
            inset 0 1.5px 0 rgba(255, 255, 255, 1),
            inset 0 -1.5px 0 rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.5);
          border: none;
        }
        
        .nav-capsule-dark {
          background: linear-gradient(135deg, rgba(40, 40, 40, 0.65) 0%, rgba(20, 20, 20, 0.45) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 
            0 24px 48px -12px rgba(0, 0, 0, 0.7),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1.5px 0 rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.08);
          border: none;
        }
        
        /* Flat, solid expanding boxes */
        .nav-active-light { background-color: #f1f2f4; }
        .nav-active-dark { background-color: #2c2c2e; }

        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes wave { 0% { transform: rotate(0deg); } 20% { transform: rotate(14deg); } 40% { transform: rotate(-8deg); } 60% { transform: rotate(14deg); } 80% { transform: rotate(-4deg); } 100% { transform: rotate(10deg); } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-wave { animation: wave 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className={`min-h-[100dvh] flex justify-center font-jakarta antialiased selection:bg-[#1D9BF0]/30 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-[430px] h-[100dvh] ${t.bg} relative overflow-hidden flex flex-col transition-colors duration-500 shadow-2xl sm:border-x ${isDark ? 'border-white/10' : 'border-black/5'}`}>
          
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
            <div className={`absolute top-[-5%] left-[-10%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[120px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`}></div>
            <div className={`absolute bottom-[10%] right-[-10%] w-[60%] h-[50%] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] ${isDark ? 'opacity-[0.15]' : 'opacity-10'}`}></div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {currentView === 'splash' && <SplashScreen />}
            {currentView === 'login' && <LoginScreen />}
            {currentView === 'otp' && <OtpScreen />}
            
            {currentView === 'main' && (
              <div className="flex flex-col h-full relative z-10">
                <div className="flex-1 overflow-hidden relative">
                  {activeTab === 'home' && <HomeTab />}
                  {activeTab === 'directory' && <DirectoryTab />}
                  {activeTab === 'jobs' && <JobsTab />}
                  {activeTab === 'emergency' && <EmergencyTab />}
                  {activeTab === 'messages' && <MessagesTab />}
                  {activeTab === 'profile' && <ProfileTab />}
                </div>

                <div className={`absolute bottom-0 left-0 w-full h-32 pointer-events-none z-40 bg-gradient-to-t ${isDark ? 'from-[#000000] via-[#000000]/80' : 'from-[#F2F5F8] via-[#F2F5F8]/80'} to-transparent`}></div>

                {/* Expanding Pill Bottom Navigation with Liquid Glass Background */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] h-[76px] ${isDark ? 'nav-capsule-dark' : 'nav-capsule-light'} rounded-[2.5rem] flex justify-between items-center px-2 z-50`}>
                  {[
                    { id: 'home', icon: Home, label: 'Home', canFill: true }, 
                    { id: 'directory', icon: Compass, label: 'Explore' }, 
                    { id: 'jobs', icon: Briefcase, label: 'Jobs', hasBadge: true, canFill: true }, 
                    { id: 'messages', icon: MessageSquare, label: 'Chat', canFill: true }, 
                    { id: 'profile', label: 'Profile', isAvatar: true }
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)}
                        // Removed active:scale-95 to completely eliminate the bouncy layout glitch
                        className={`relative flex items-center h-[60px] rounded-[2rem] transition-[width,background-color] duration-300 ease-out overflow-hidden ${isActive ? `w-[124px] ${isDark ? 'nav-active-dark text-white' : 'nav-active-light text-black'}` : `w-[60px] bg-transparent ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}`}
                      >
                        <div className="w-[60px] h-[60px] shrink-0 flex items-center justify-center">
                          {item.isAvatar ? (
                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? `ring-2 ${isDark ? 'ring-white/20' : 'ring-black/10'}` : 'opacity-80 border border-gray-300 dark:border-gray-600'} overflow-hidden shadow-sm backdrop-blur-md`}>
                              <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="relative flex items-center justify-center w-full h-full">
                              <item.icon 
                                className="w-[24px] h-[24px] transition-colors duration-300" 
                                strokeWidth={isActive ? 2.5 : 2} 
                                fill={isActive && item.canFill ? "currentColor" : "none"}
                              />
                              {item.hasBadge && !isActive && (
                                <div className={`absolute top-[14px] right-[14px] w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center border-[1.5px] ${isDark ? 'border-[#1c1c1e]' : 'border-[#ffffff]'}`}>
                                  <span className="text-white text-[7px] font-bold">3</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex-1 whitespace-nowrap text-left transition-opacity duration-300 ${isActive ? 'opacity-100 delay-100' : 'opacity-0'}`}>
                          <span className="text-[14px] font-extrabold pr-4">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isEmergencyFlowOpen && <EmergencyFlowOverlay onClose={() => setIsEmergencyFlowOpen(false)} />}
            {activeOverlay === 'chat' && <ChatOverlay />}
            
            {selectedUser && (
              <UserProfileView user={selectedUser} onBack={() => setSelectedUser(null)} />
            )}
            
            {selectedJob && (
              <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}