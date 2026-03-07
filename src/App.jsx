import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Briefcase, MessageSquare, User, 
  Droplets, Droplet, Bell, Search, Filter, ChevronRight, 
  MapPin, Phone, Send, Paperclip, Settings, 
  LogOut, Bookmark, FileText, ArrowLeft, Plus,
  Info, Lock, Mail, AlertTriangle, CheckCircle2,
  Moon, Sun, BadgeCheck, Clock, ArrowUpRight, ShieldCheck,
  Share, BookmarkIcon, GraduationCap, DollarSign, SlidersHorizontal,
  Edit, MoreVertical, CheckCheck, Smile, Copy, QrCode, Wifi, 
  Eye, Lightbulb, Shield, Globe, Smartphone, CreditCard, ChevronDown,
  Compass, Upload, X, Monitor, Landmark, Volume2, Archive,
  Camera, Image as ImageIcon, VolumeX, Pin, Trash2, MailOpen, Reply
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

const CustomEmergencyIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8.9" y1="8.9" x2="13.2" y2="13.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23.1" y1="23.1" x2="18.8" y2="18.8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23.1" y1="8.9" x2="18.8" y2="13.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="8.9" y1="23.1" x2="13.2" y2="18.8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const JobSlider = ({ jobs, isDark, t, onSelectJob }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const extendedJobs = [...jobs, jobs[0]];

  useEffect(() => {
    if (isPaused || dragStartX !== null) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX]);

  useEffect(() => {
    if (currentIndex === jobs.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700); 
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, jobs.length]);

  const handleDragStart = (clientX) => {
    setIsPaused(true);
    setDragStartX(clientX);
    setIsTransitioning(false);
    setIsDragging(false);
  };

  const handleDragMove = (clientX) => {
    if (dragStartX === null) return;
    const offset = clientX - dragStartX;
    if (Math.abs(offset) > 10) setIsDragging(true);
    
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

    const threshold = 50; 
    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    setDragStartX(null);
    setDragOffset(0);

    setTimeout(() => setIsDragging(false), 50);
  };

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

const AdCarousel = ({ ads, isDark }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (isPaused || dragStartX !== null || !ads || ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX, ads]);

  if (!ads || ads.length === 0) return null;

  const handleDragStart = (clientX) => {
    setIsPaused(true);
    setDragStartX(clientX);
  };

  const handleDragMove = (clientX) => {
    if (dragStartX === null) return;
    setDragOffset(clientX - dragStartX);
  };

  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsPaused(false);
    const threshold = 50;
    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  return (
    <div className="w-full mt-2 mb-2 animate-fade-in relative z-10">
      <div 
        className={`relative w-full rounded-xl overflow-hidden border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white/80'} backdrop-blur-sm touch-pan-y select-none`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out h-[130px]"
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}
        >
          {ads.map((ad, idx) => (
            <div 
              key={idx} 
              className="w-full h-full shrink-0 cursor-pointer flex items-center justify-center bg-cover bg-center"
              onClick={() => console.log('Ad Clicked:', ad.link)}
            >
              {ad.content}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-1.5 mt-3">
         {ads.map((_, idx) => (
           <button
             key={idx}
             onClick={() => setCurrentIndex(idx)}
             className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-4 bg-[#1D9BF0]' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
           />
         ))}
      </div>
    </div>
  );
};

const SettingsItem = ({ icon: Icon, label, value, isToggle, toggleState, onToggle, isDestructive, onClick, t, isDark }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-4 border-b ${t.borderSoft} last:border-0 hover:${isDark ? 'bg-white/5' : 'bg-black/5'} transition-colors cursor-pointer group`}>
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

const ProfileTab = ({ authRole, t, isDark, profileSegment, setProfileSegment, setSettingsOverlay, setCurrentView, pushEnabled, handlePushToggle, toggleTheme, appLanguage, twoFactorEnabled, handle2FAToggle, profileVisibility, activeSessionsCount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyID = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullName = authRole === 'student' ? 'Hasan Tarik' : authRole === 'alumni' ? 'Nusrat Jahan' : 'Dr. Hasan Mahmud';
  const firstName = authRole === 'student' ? 'Hasan' : authRole === 'alumni' ? 'Nusrat' : 'Dr. Hasan';

  const roleSub = authRole === 'alumni' ? 'Software Engineer @ Google' : authRole === 'faculty' ? 'Professor @ CSE' : 'Final Year CS Student';
  const idTitle = authRole === 'alumni' ? 'Alumni Access ID' : authRole === 'faculty' ? 'Faculty Access ID' : 'Student Access ID';
  const idPrefix = authRole === 'student' ? '2024CS1021' : authRole === 'alumni' ? '151XXXXX' : 'FAC-0012';
  const termLabel = authRole === 'student' ? 'Valid Thru' : authRole === 'alumni' ? 'Class Of' : 'Joined';
  const termValue = authRole === 'student' ? '12/26' : authRole === 'alumni' ? '2019' : '2012';
  
  const stat1Label = authRole === 'student' ? 'Applications' : 'Jobs Posted';
  const stat1Count = authRole === 'student' ? '12' : '5';
  const stat2Label = authRole === 'student' ? 'Saved Jobs' : 'Mentored';
  const stat2Count = authRole === 'student' ? '4' : '18';

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
              <div className="w-20 h-20 rounded-full border-[3px] border-[#1D9BF0] p-1 shadow-lg shadow-[#1D9BF0]/30">
                <div className={`w-full h-full rounded-full ${isDark ? 'bg-white/10' : 'bg-white/60'} flex items-center justify-center overflow-hidden`}>
                   <User className={`w-10 h-10 ${t.text}`} strokeWidth={1.5} />
                </div>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-[#1D9BF0] rounded-full border-2 ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center shadow-sm`}>
                <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} truncate`}>{fullName}</h2>
                  <p className={`font-bold ${t.textMuted} text-xs mt-0.5 truncate`}>{roleSub}</p>
                </div>
                <button 
                  onClick={() => setSettingsOverlay('personal_info')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.borderSoft} transition-transform active:scale-95`}
                >
                  <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                <button 
                  onClick={handleCopyID}
                  className={`flex items-center px-2.5 py-1.5 rounded-md ${isDark ? 'bg-black/40 text-white border-white/10' : 'bg-white/60 text-black border-white'} border shadow-sm transition-all active:scale-95`}
                >
                  <span className="text-[10px] font-extrabold mr-1.5 opacity-80">ID</span>
                  <span className="text-[11px] font-extrabold font-mono tracking-wider mr-2">{idPrefix}</span>
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
            {['Account', 'Settings'].map(seg => (
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
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: stat1Label, count: stat1Count, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: stat2Label, count: stat2Count, icon: BookmarkIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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

            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Documents</h3>
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={FileText} label={authRole === 'student' ? 'Manage Resume' : 'Manage Portfolio'} value="Updated 2d ago" t={t} isDark={isDark} />
                <SettingsItem icon={Share} label="Portfolio Links" value="2 links" t={t} isDark={isDark} />
              </div>
            </div>
          </div>
        )}

        {profileSegment === 'Settings' && (
          <div className="px-5 space-y-6 animate-fade-in">
            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Account</h3>
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={User} label="Personal Information" onClick={() => setSettingsOverlay('personal_info')} t={t} isDark={isDark} />
                <SettingsItem icon={Mail} label="Email & Phone" onClick={() => setSettingsOverlay('email_phone')} t={t} isDark={isDark} />
                <SettingsItem icon={Lock} label="Change Password" onClick={() => setSettingsOverlay('password')} t={t} isDark={isDark} />
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Security & Privacy</h3>
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={Shield} label="Two-Factor Authentication" isToggle={true} toggleState={twoFactorEnabled} onToggle={handle2FAToggle} t={t} isDark={isDark} />
                <SettingsItem icon={Eye} label="Profile Visibility" value={profileVisibility} onClick={() => setSettingsOverlay('visibility')} t={t} isDark={isDark} />
                <SettingsItem icon={Smartphone} label="Active Sessions" value={`${activeSessionsCount} device${activeSessionsCount !== 1 ? 's' : ''}`} onClick={() => setSettingsOverlay('sessions')} t={t} isDark={isDark} />
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Preferences</h3>
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={Bell} label="Push Notifications" isToggle={true} toggleState={pushEnabled} onToggle={handlePushToggle} t={t} isDark={isDark} />
                <SettingsItem 
                  icon={isDark ? Moon : Sun} 
                  label="Dark Mode" 
                  isToggle={true} 
                  toggleState={isDark} 
                  onToggle={toggleTheme} 
                  t={t} isDark={isDark}
                />
                <SettingsItem icon={Globe} label="Language" value={appLanguage} onClick={() => setSettingsOverlay('language')} t={t} isDark={isDark} />
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Support & Legal</h3>
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={Info} label="Help Center" t={t} isDark={isDark} />
                <SettingsItem icon={AlertTriangle} label="Report a Bug" t={t} isDark={isDark} />
                <SettingsItem icon={FileText} label="Privacy Policy" t={t} isDark={isDark} />
              </div>
              <div className="text-center mt-4">
                <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>NSUNEXT v1.0.0</span>
              </div>
            </div>

            <div className="pt-2">
              <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
                <SettingsItem icon={LogOut} label="Log Out" isDestructive={true} onClick={() => setCurrentView('welcome')} t={t} isDark={isDark} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsFlowOverlay = ({ type, onClose, t, isDark, authRole, appLanguage, setAppLanguage, profileVisibility, setProfileVisibility, activeSessions, setActiveSessions }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  let title = '';
  if (type === 'personal_info') title = 'Personal Information';
  if (type === 'email_phone') title = 'Email & Phone';
  if (type === 'password') title = 'Change Password';
  if (type === 'language') title = 'Language Preferences';
  if (type === 'visibility') title = 'Profile Visibility';
  if (type === 'sessions') title = 'Active Sessions';

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>{title}</h2>
        <div className="w-10 h-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6 space-y-5">
        {type === 'personal_info' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Full Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                <input type="text" defaultValue={authRole === 'student' ? 'Hasan Tarik' : authRole === 'alumni' ? 'Nusrat Jahan' : 'Dr. Hasan Mahmud'} className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Bio / Tagline</label>
              <textarea rows="3" defaultValue={authRole === 'student' ? 'Final Year CS Student' : authRole === 'alumni' ? 'Software Engineer @ Google' : 'Professor @ CSE'} className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl px-3 py-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Location</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                  <input type="text" defaultValue="Dhaka, BD" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                </div>
              </div>
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Blood Group</label>
                <select defaultValue="B+" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-3 text-sm font-bold ${t.text} appearance-none focus:outline-none transition-all shadow-sm`}>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Last Donated Date</label>
              <div className="relative">
                <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                <input type="date" defaultValue="2023-08-14" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`} style={{ colorScheme: isDark ? 'dark' : 'light' }} />
              </div>
            </div>
          </>
        )}

        {type === 'email_phone' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>University Email (Primary)</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4`} strokeWidth={2.5} />
                <input type="email" defaultValue={authRole === 'student' ? 'hasan.tarik@northsouth.edu' : authRole === 'alumni' ? 'nusrat.jahan@northsouth.edu' : 'hasan.mahmud@northsouth.edu'} disabled className={`w-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none transition-all shadow-sm cursor-not-allowed`} />
              </div>
              <p className="text-[10px] font-bold text-yellow-500 mt-1.5 ml-1">Primary university email cannot be changed.</p>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Recovery Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                <input type="email" placeholder="Add recovery email" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
                <input type="tel" defaultValue="+880 1712 345678" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
          </>
        )}

        {type === 'password' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Current Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} group-focus-within:text-[#1D9BF0] w-4 h-4 transition-colors`} strokeWidth={2.5} />
                <input type="password" placeholder="Enter current password" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>New Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} group-focus-within:text-[#1D9BF0] w-4 h-4 transition-colors`} strokeWidth={2.5} />
                <input type="password" placeholder="Enter new password" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Confirm New Password</label>
              <div className="relative group">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted} group-focus-within:text-[#1D9BF0] w-4 h-4 transition-colors`} strokeWidth={2.5} />
                <input type="password" placeholder="Confirm new password" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-8 pr-3 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>
          </>
        )}

        {type === 'language' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 block`}>Select Display Language</label>
              <div className="space-y-3">
                {['English', 'Bengali', 'Spanish', 'French'].map(lang => (
                  <div 
                    key={lang}
                    onClick={() => setAppLanguage(lang)}
                    className={`p-4 rounded-xl border ${appLanguage === lang ? `border-[#1D9BF0] ${isDark ? 'bg-[#1D9BF0]/10' : 'bg-blue-50'}` : `${t.inputBorder} ${t.inputBg}`} flex justify-between items-center cursor-pointer transition-all shadow-sm active:scale-[0.98]`}
                  >
                    <span className={`text-sm font-bold ${appLanguage === lang ? 'text-[#1D9BF0]' : t.text}`}>{lang}</span>
                    {appLanguage === lang && <CheckCircle2 className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {type === 'visibility' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 block`}>Who can see your profile</label>
              <div className="space-y-3">
                {['Public', 'NSU Network', 'Connections Only', 'Private'].map(vis => (
                  <div 
                    key={vis}
                    onClick={() => setProfileVisibility(vis)}
                    className={`p-4 rounded-xl border ${profileVisibility === vis ? `border-[#1D9BF0] ${isDark ? 'bg-[#1D9BF0]/10' : 'bg-blue-50'}` : `${t.inputBorder} ${t.inputBg}`} flex justify-between items-center cursor-pointer transition-all shadow-sm active:scale-[0.98]`}
                  >
                    <span className={`text-sm font-bold ${profileVisibility === vis ? 'text-[#1D9BF0]' : t.text}`}>{vis}</span>
                    {profileVisibility === vis && <CheckCircle2 className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {type === 'sessions' && (
          <>
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 block`}>Current Sessions</label>
              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className={`p-4 rounded-xl border ${t.inputBorder} ${t.inputBg} flex justify-between items-center shadow-sm`}>
                    <div className="flex items-center space-x-3">
                      {session.type === 'mobile' ? <Smartphone className={`w-5 h-5 ${t.text}`} strokeWidth={2} /> : <Monitor className={`w-5 h-5 ${t.textMuted}`} strokeWidth={2} />}
                      <div>
                        <p className={`text-sm font-bold ${t.text}`}>{session.device}</p>
                        <p className={`text-[10px] font-extrabold ${session.active ? 'text-[#1D9BF0]' : t.textMuted} uppercase tracking-wider mt-0.5`}>
                          {session.active ? `Active Now • ${session.location}` : `${session.time} • ${session.location}`}
                        </p>
                      </div>
                    </div>
                    {!session.active && (
                      <button 
                        onClick={() => setActiveSessions(prev => prev.filter(s => s.id !== session.id))}
                        className={`text-xs font-bold text-red-500 hover:text-red-600 transition-colors`}
                      >
                        Log Out
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {activeSessions.length > 1 && (
                <button 
                  onClick={() => setActiveSessions(prev => prev.filter(s => s.active))}
                  className={`w-full mt-6 h-12 rounded-xl font-bold text-sm border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors`}
                >
                  Log Out of All Other Devices
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
         <button onClick={handleSave} disabled={isSaving} className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40 flex items-center justify-center`}>
           {isSaving ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
           ) : (
             'Save Changes'
           )}
         </button>
      </div>
    </div>
  );
};

// Added missing Emergency Flow Stub
const EmergencyFlowOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6" onClick={onClose}>
    <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center animate-fade-in-up" onClick={e => e.stopPropagation()}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <Droplet className="w-8 h-8 text-red-500" strokeWidth={2} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Emergency Flow Placeholder</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This feature flow is under development.</p>
      <button onClick={onClose} className="w-full py-3 bg-red-500 hover:bg-red-600 transition-colors text-white font-bold rounded-xl active:scale-95">
        Close
      </button>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [authRole, setAuthRole] = useState('student'); // 'student' | 'faculty' | 'alumni'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('home'); 
  const [activeOverlay, setActiveOverlay] = useState(null); 
  const [isEmergencyFlowOpen, setIsEmergencyFlowOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedJob, setSelectedJob] = useState(null); 
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isDark, setIsDark] = useState(false); 
  
  const [requestedSet, setRequestedSet] = useState(new Set());
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [settingsOverlay, setSettingsOverlay] = useState(null);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [appLanguage, setAppLanguage] = useState('English');
  const [toastMsg, setToastMsg] = useState("");
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'iPhone 14 Pro', active: true, location: 'Dhaka, BD', type: 'mobile' },
    { id: 2, device: 'MacBook Pro 16"', active: false, location: 'Remote', time: 'Last active 2d ago', type: 'desktop' }
  ]);

  const [profileSegment, setProfileSegment] = useState('Account');
  const [directorySegment, setDirectorySegment] = useState('Alumni');
  const [jobSegment, setJobSegment] = useState('All Jobs');
  const [jobFilter, setJobFilter] = useState(null);
  const [emergencyViewMode, setEmergencyViewMode] = useState('list');
  const [isDonorAvailable, setIsDonorAvailable] = useState(true);
  const [directoryFilterBg, setDirectoryFilterBg] = useState(null); // Added state for Blood Group filtering

  useEffect(() => {
    if (currentView === 'splash') {
      const timer = setTimeout(() => setCurrentView('welcome'), 2500);
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
    inputBg: isDark ? 'bg-[#202327]/60 backdrop-blur-md focus:bg-black/80 focus:ring-2 focus:ring-[#1D9BF0]/50' : 'bg-white/80 backdrop-blur-md focus:bg-white focus:ring-2 focus:ring-[#1D9BF0]/30',
    inputBorder: isDark ? 'border-white/10 focus:border-transparent' : 'border-white focus:border-transparent',
    cardShadow: isDark ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-black/[0.04]', 
  };

  const toggleTheme = () => setIsDark(!isDark);

  const handlePushToggle = () => {
    const newState = !pushEnabled;
    setPushEnabled(newState);
    setToastMsg(newState ? "Push Notification Turned On" : "Push Notification Turned Off");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handle2FAToggle = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    setToastMsg(newState ? "Two-Factor Auth Enabled" : "Two-Factor Auth Disabled");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const globalAlumniData = [
    { id: 1, name: 'Sarah Rahman', role: 'Software Engineer', company: 'Google', dept: 'CSE', skills: ['System Design', 'React', 'Node.js'], batch: 'Batch 19', location: 'Dhaka, BD', followers: '12.4k', blood: 'O+', verified: true, about: "Passionate software engineer with 4+ years of experience building scalable web applications. Always eager to connect with fellow NSUers and mentor juniors.", experience: [{ title: 'Software Engineer', company: 'Google', duration: '2022 - Present' }, { title: 'Frontend Developer', company: 'Pathao', duration: '2020 - 2022' }] },
    { id: 2, name: 'Tahmid Hasan', role: 'Product Lead', company: 'Pathao', dept: 'ECE', skills: ['Product Mgt', 'Growth'], batch: 'Batch 18', location: 'Dhaka, BD', followers: '8.2k', blood: 'B+', verified: true, about: "Building products that move millions. Former engineer turned product manager.", experience: [{ title: 'Product Lead', company: 'Pathao', duration: '2021 - Present' }] },
    { id: 3, name: 'Ayman Sadiq', role: 'CEO & Founder', company: '10 Minute School', dept: 'BBA', skills: ['EdTech', 'Leadership', 'Marketing'], batch: 'Batch 15', location: 'Dhaka, BD', followers: '1.2M', blood: 'A+', verified: true, about: "Making education accessible for everyone in Bangladesh.", experience: [{ title: 'CEO', company: '10 Minute School', duration: '2015 - Present' }] },
    { id: 4, name: 'Fahim Shahriar', role: 'Senior Product Designer', company: 'Optimizely', dept: 'Architecture', skills: ['UI/UX', 'Figma', 'User Research'], batch: 'Batch 14', location: 'Dhaka, BD', followers: '5.6k', blood: 'B-', verified: true, about: "Crafting intuitive digital experiences. Passionate about solving complex user problems.", experience: [{ title: 'Senior Designer', company: 'Optimizely', duration: '2021 - Present' }, { title: 'UX Designer', company: 'Pathao', duration: '2018 - 2021' }] },
    { id: 5, name: 'Sadia Islam', role: 'Data Scientist', company: 'Microsoft', dept: 'CSE', skills: ['Python', 'Machine Learning', 'SQL'], batch: 'Batch 17', location: 'Seattle, WA', followers: '8.9k', blood: 'O+', verified: true, about: "Data enthusiast. Working on scalable machine learning models to improve cloud infrastructure.", experience: [{ title: 'Data Scientist', company: 'Microsoft', duration: '2020 - Present' }] }
  ];

  const globalFacultyData = [
    { id: 101, name: 'Dr. Aminul Islam', role: 'Professor', company: 'North South University', dept: 'CSE', skills: ['Machine Learning', 'AI', 'Algorithms'], batch: 'Faculty', location: 'Dhaka, BD', followers: '2.1k', blood: 'A+', verified: true, about: "Ph.D. from MIT. 15+ years of teaching and research experience.", experience: [{ title: 'Professor', company: 'NSU', duration: '2010 - Present' }] },
    { id: 102, name: 'Dr. Nova Ahmed', role: 'Associate Professor', company: 'North South University', dept: 'ECE', skills: ['HCI', 'IoT', 'Embedded Systems'], batch: 'Faculty', location: 'Dhaka, BD', followers: '1.8k', blood: 'O+', verified: true, about: "Passionate about building technologies for emerging markets.", experience: [{ title: 'Assoc. Professor', company: 'NSU', duration: '2015 - Present' }] },
    { id: 103, name: 'Dr. Shazzad Hosain', role: 'Professor', company: 'North South University', dept: 'ECE', skills: ['VLSI', 'Nanotechnology', 'Circuit Design'], batch: 'Faculty', location: 'Dhaka, BD', followers: '1.5k', blood: 'AB+', verified: true, about: "Senior faculty member focusing on advanced VLSI design and quantum computing.", experience: [{ title: 'Professor', company: 'NSU', duration: '2008 - Present' }] },
    { id: 104, name: 'Ms. Nabila Rahman', role: 'Lecturer', company: 'North South University', dept: 'BBA', skills: ['Corporate Finance', 'Investment', 'Accounting'], batch: 'Faculty', location: 'Dhaka, BD', followers: '980', blood: 'O-', verified: true, about: "Passionate about teaching financial literacy and corporate investment strategies.", experience: [{ title: 'Lecturer', company: 'NSU', duration: '2021 - Present' }] }
  ];

  const globalStudentData = [
    { id: 201, name: 'Rayan Hossain', role: 'Student', company: 'North South University', dept: 'BBA', skills: ['Marketing', 'Public Speaking', 'Leadership'], batch: 'Batch 231', location: 'Dhaka, BD', followers: '340', blood: 'B+', verified: true, about: "Current BBA student focusing on digital marketing.", experience: [{ title: 'Marketing Intern', company: 'Unilever', duration: 'Summer 2024' }] },
    { id: 202, name: 'Tanisha Chowdhury', role: 'Student', company: 'North South University', dept: 'Architecture', skills: ['AutoCAD', '3D Modeling', 'Design'], batch: 'Batch 222', location: 'Dhaka, BD', followers: '512', blood: 'AB+', verified: true, about: "Architecture enthusiast, currently working on a thesis regarding sustainable housing.", experience: [{ title: 'Junior Architect', company: 'Design Lab', duration: '2023 - Present' }] },
    { id: 203, name: 'Abrar Fahim', role: 'Student', company: 'North South University', dept: 'CSE', skills: ['C++', 'React', 'Algorithms'], batch: 'Batch 232', location: 'Dhaka, BD', followers: '120', blood: 'A+', verified: false, about: "Sophomore studying CS. Active competitive programmer and open source contributor.", experience: [{ title: 'Executive Member', company: 'NSU ACM SC', duration: '2024 - Present' }] },
    { id: 204, name: 'Mehzabin Oishee', role: 'Student', company: 'North South University', dept: 'ECE', skills: ['IoT', 'Arduino', 'C'], batch: 'Batch 221', location: 'Dhaka, BD', followers: '250', blood: 'O+', verified: true, about: "Robotics enthusiast. Building smart home solutions for my final year project.", experience: [{ title: 'Project Lead', company: 'NSU Robotics Club', duration: '2023 - Present' }] },
    { id: 205, name: 'Zayed Khan', role: 'Student', company: 'North South University', dept: 'BBA', skills: ['Marketing', 'Communication', 'Sales'], batch: 'Batch 241', location: 'Dhaka, BD', followers: '85', blood: 'B-', verified: false, about: "Freshman majoring in BBA. Looking to explore the world of digital marketing.", experience: [{ title: 'Volunteer', company: 'NSU YES', duration: '2025 - Present' }] }
  ];

  const globalJobsData = [
    { id: 1, title: 'UI/UX Designer Intern', company: 'Brain Station 23', type: 'Internship', location: 'Remote', salary: 'Paid stipend', deadline: '2 days left', posted: '2h ago', preview: 'We are looking for a passionate UI/UX design intern to help build intuitive user interfaces for our upcoming fintech products. You will work closely with the product team.', match: true, urgent: true, reqs: ['Figma', 'Prototyping', 'Design Systems'], postedBy: { userId: 4, name: 'Fahim Shahriar', role: 'Senior Product Designer', verified: true, type: 'Alumni' } },
    { id: 2, title: 'Frontend Developer', company: 'Pathao', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Negotiable', deadline: '12 days left', posted: '1d ago', preview: 'Join our core engineering team to build high-performance web applications using React and Next.js. Minimum 1 year experience required.', match: true, urgent: false, reqs: ['React', 'Next.js', 'Tailwind CSS'], postedBy: { userId: 2, name: 'Tahmid Hasan', role: 'Product Lead', verified: true, type: 'Alumni' } },
    { id: 3, title: 'Product Marketing Manager', company: '10 Minute School', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Competitive', deadline: '5 days left', posted: '3d ago', preview: 'Drive the go-to-market strategy for our new flagship educational courses. Work closely with product and sales teams to ensure successful launches.', match: false, urgent: false, reqs: ['Marketing', 'Strategy', 'Copywriting'], postedBy: { userId: 3, name: 'Ayman Sadiq', role: 'CEO & Founder', verified: true, type: 'Alumni' } },
  ];

  const globalEmergencyRequests = [
    { id: 1, hospital: 'Apollo Hospital', location: 'Bashundhara, Dhaka', bg: 'B+', distance: '2.3km', urgency: 'Critical', units: 2, match: 'Perfect Match', time: '10m ago', description: 'Patient is undergoing open heart surgery. Blood is required immediately.', contact: '01711223344', patientName: 'Rahim Uddin' },
    { id: 2, hospital: 'Square Hospital', location: 'Panthapath, Dhaka', bg: 'O+', distance: '5.1km', urgency: 'Needed Today', units: 1, match: 'Compatible', time: '1h ago', description: 'Accident patient in ICU. Need O+ blood by tonight.', contact: '01811223344', patientName: 'Karim Hasan' }
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

  // --- NEW AUTHENTICATION SCREENS ---
  const SplashScreen = () => (
    <div className={`flex flex-col items-center justify-center h-full ${t.bg} ${t.text} relative overflow-hidden transition-colors duration-500`}>
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-16 h-16 bg-[#1D9BF0] text-white flex items-center justify-center rounded-xl mb-6">
          <div className="w-6 h-6 border-2 border-white rounded-sm rotate-45"></div>
        </div>
        <h1 className="text-2xl font-extrabold tracking-widest mb-2">NSUNEXT</h1>
        <p className={`${t.textMuted} text-xs tracking-widest uppercase font-bold`}>Connectivity Redefined</p>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className={`flex flex-col items-center justify-center h-full px-6 pt-12 pb-8 transition-colors duration-500 animate-fade-in relative z-10`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in-up">
        <div className="w-20 h-20 bg-[#1D9BF0] text-white flex items-center justify-center rounded-[24px] mb-6">
          <div className="w-8 h-8 border-[3px] border-white rounded-sm rotate-45"></div>
        </div>
        <h1 className={`text-xl font-semibold tracking-tight text-center ${t.text}`}>Connect. Grow. Support.</h1>
        <p className={`text-sm mt-2 text-center ${t.textMuted} px-4`}>North South University Verified Network</p>
      </div>
      <div className="w-full mt-auto space-y-3 animate-fade-in delay-150">
        <button onClick={() => { setAuthMode('login'); setCurrentView('auth_main'); }} className={`w-full h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30`}>
          Log In
        </button>
        <button onClick={() => { setAuthMode('signup'); setCurrentView('role_select'); }} className={`w-full h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] ${t.card} border ${t.borderSoft} ${t.text} shadow-sm`}>
          Create New Account
        </button>
        <p className={`text-xs tracking-wide text-center pt-2 font-bold ${t.textMuted}`}>Secure • Verified • Institutional</p>
      </div>
    </div>
  );

  const RoleGatewayScreen = () => (
    <div className={`absolute inset-0 flex flex-col h-full px-6 pt-8 pb-8 transition-colors duration-500 animate-fade-in z-20`}>
      <button 
        onClick={() => setCurrentView('welcome')} 
        className={`-ml-2 w-10 h-10 mb-6 rounded-lg flex items-center justify-center ${t.card} border ${t.borderSoft} transition-colors active:scale-95 shrink-0 outline-none shadow-sm`}
        aria-label="Go back"
      >
        <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
      </button>
      
      <div className="mb-7">
        <h1 className={`text-[28px] font-extrabold tracking-tight ${t.text} leading-tight`}>Select Your Role</h1>
        <p className={`text-sm mt-1 font-bold ${t.textMuted}`}>Choose how you want to access NSUNEXT</p>
      </div>
      
      <div className="space-y-4" role="listbox" aria-label="Select user role">
        {[
          { id: 'student', title: 'Student', desc: 'Use your official university email', icon: GraduationCap },
          { id: 'alumni', title: 'Alumni', desc: 'Verification required before access', icon: Users },
          { id: 'faculty', title: 'Faculty', desc: 'Sign in with your institutional email', icon: Briefcase },
        ].map((role, index) => {
          const isSelected = authRole === role.id;
          
          const baseCardStyle = isSelected 
            ? `bg-[#1D9BF0]/10 border-[#1D9BF0]/40 shadow-sm` 
            : `${t.card} border ${t.borderSoft} shadow-sm hover:border-[#1D9BF0]/30`;

          const iconStyle = isSelected
            ? 'bg-[#1D9BF0]/10 text-[#1D9BF0]'
            : `${isDark ? 'bg-white/5' : 'bg-black/5'} ${t.textMuted}`;

          return (
            <div 
              key={role.id}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => setAuthRole(role.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAuthRole(role.id); } }}
              className={`p-5 rounded-2xl border flex items-center cursor-pointer transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D9BF0] outline-none group animate-fade-in-up ${baseCardStyle}`}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 shrink-0 ${iconStyle}`}>
                <role.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-extrabold ${t.text} mb-0.5`}>{role.title}</h3>
                <p className={`text-xs font-bold ${t.textMuted} line-clamp-2`}>{role.desc}</p>
              </div>
              <div className="shrink-0 ml-3">
                {isSelected ? (
                   <div className="bg-[#1D9BF0] text-white rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-sm shadow-[#1D9BF0]/40">
                     <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                   </div>
                ) : (
                  <CheckCircle2 className={`w-6 h-6 ${t.textMuted} opacity-40 transition-colors duration-300 group-hover:opacity-70`} strokeWidth={2.5} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 pb-5 text-center flex flex-col items-center justify-center opacity-80 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <div className={`flex items-center justify-center space-x-1.5 text-xs font-extrabold ${t.textMuted}`}>
          <Lock className="w-4 h-4" strokeWidth={2.5} />
          <span>Secured with university authentication</span>
        </div>
      </div>

      <div className="mb-2 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
         <button 
           disabled={!authRole}
           onClick={() => setCurrentView('auth_main')}
           className={`w-full h-14 rounded-xl text-base font-extrabold transition-all active:scale-[0.97] outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30`}
         >
           Continue
         </button>
      </div>
    </div>
  );

  const AuthScreen = () => {
    const isStudent = authRole === 'student';
    const isFaculty = authRole === 'faculty';
    const isAlumni = authRole === 'alumni';

    const handleAction = () => {
      if (authMode === 'login') {
        setCurrentView('main');
      } else {
        setCurrentView('otp');
      }
    };

    const handleBack = () => {
      if (authMode === 'signup') {
        setCurrentView('role_select');
      } else {
        setCurrentView('welcome');
      }
    };

    return (
      <div className={`flex flex-col h-full relative z-10 animate-fade-in`}>
        <div className={`px-6 pt-12 pb-3 ${t.glass} border-b z-20 sticky top-0 shadow-sm`}>
          <div className="flex items-center">
            <button onClick={handleBack} className={`-ml-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors mr-3 active:scale-95 shrink-0 outline-none`}>
              <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
            </button>
            <h1 className={`text-lg font-extrabold tracking-tight capitalize ${t.text}`}>
              {authMode === 'login' ? 'Log In' : `Create ${authRole.charAt(0).toUpperCase() + authRole.slice(1)} Account`}
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 relative z-10">
          {authMode === 'login' ? (
            <div className="animate-fade-in-up">
              <div className="space-y-4">
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input 
                      type="email" 
                      placeholder="yourname@northsouth.edu" 
                      className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}
                    />
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-xs text-[#1D9BF0] cursor-pointer hover:underline font-extrabold">Forgot password?</span>
                  </div>
                </div>
              </div>

              <button onClick={handleAction} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] bg-[#1D9BF0] text-white mt-8 shadow-lg shadow-[#1D9BF0]/30 hover:bg-[#1A8CD8]">
                Log In
              </button>

              <div className="flex items-center my-6">
                <div className={`flex-1 border-t ${t.borderSoft}`}></div>
                <span className={`px-4 text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>OR</span>
                <div className={`flex-1 border-t ${t.borderSoft}`}></div>
              </div>

              <button className={`w-full h-14 rounded-xl font-extrabold text-[14px] transition-all active:scale-[0.98] ${t.card} border ${t.border} ${t.text} hover:border-[#1D9BF0]/30 shadow-sm flex items-center justify-center space-x-3 mb-6`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className={`text-center text-xs font-bold ${t.textMuted}`}>
                Don't have an account? <button onClick={() => { setAuthMode('signup'); setCurrentView('role_select'); }} className="text-[#1D9BF0] font-extrabold hover:underline">Sign up</button>
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="space-y-4">
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input type="text" placeholder="Alex Johnson" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`} />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>
                    {isAlumni ? 'Email Address' : 'NSU Email'}
                  </label>
                  <div className="relative group">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input type="email" placeholder={isAlumni ? "yourname@example.com" : "yourname@northsouth.edu"} className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Department</label>
                    <select className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} appearance-none outline-none transition-all focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}>
                      <option>CSE</option>
                      <option>ECE</option>
                      <option>BBA</option>
                      <option>Architecture</option>
                    </select>
                  </div>
                  
                  {(isStudent || isAlumni) && (
                    <div>
                      <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Batch</label>
                      <select className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} appearance-none outline-none transition-all focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}>
                        <option>221</option>
                        <option>213</option>
                        <option>212</option>
                        <option>211</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input type="password" placeholder="Create a password" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`} />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Confirm Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4 transition-colors`} strokeWidth={2.5} />
                    <input type="password" placeholder="Confirm password" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-4 text-sm font-bold ${t.text} transition-all outline-none focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`} />
                  </div>
                </div>

                {isAlumni && (
                  <div className="pt-2">
                    <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Graduation Certificate</label>
                    <div className={`w-full border-2 border-dashed ${t.inputBorder} ${t.inputBg} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#1D9BF0]/50 transition-colors shadow-sm`}>
                      <div className="w-10 h-10 rounded-full bg-[#1D9BF0]/10 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />
                      </div>
                      <span className={`text-sm font-extrabold ${t.text} mb-0.5`}>Upload Certificate</span>
                      <span className={`text-[10px] font-bold ${t.textMuted}`}>PDF, JPG or PNG (Max 5MB)</span>
                    </div>
                    <div className="flex items-start mt-3 space-x-2 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" strokeWidth={2} />
                      <p className="text-[11px] font-bold text-yellow-600 dark:text-yellow-500 leading-tight">
                        You must upload a valid certificate within 7 days to unlock messaging and job posting.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleAction} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] bg-[#1D9BF0] text-white mt-8 shadow-lg shadow-[#1D9BF0]/30 hover:bg-[#1A8CD8]">
                Send OTP
              </button>

              <div className="flex items-center my-6">
                <div className={`flex-1 border-t ${t.borderSoft}`}></div>
                <span className={`px-4 text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>OR</span>
                <div className={`flex-1 border-t ${t.borderSoft}`}></div>
              </div>

              <button className={`w-full h-14 rounded-xl font-extrabold text-[14px] transition-all active:scale-[0.98] ${t.card} border ${t.border} ${t.text} hover:border-[#1D9BF0]/30 shadow-sm flex items-center justify-center space-x-3 mb-6`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign up with Google</span>
              </button>

              <p className={`text-center text-xs font-bold ${t.textMuted}`}>
                Already have an account? <button onClick={() => { setAuthMode('login'); setCurrentView('auth_main'); }} className="text-[#1D9BF0] font-extrabold hover:underline">Log in</button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const OtpScreen = () => (
    <div className={`flex flex-col h-full relative z-10 animate-fade-in`}>
      <div className={`px-6 pt-12 pb-3 ${t.glass} border-b z-20 sticky top-0 shadow-sm`}>
        <button onClick={() => setCurrentView('auth_main')} className={`-ml-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 shrink-0 outline-none`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 relative z-10">
        <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Verify Your Email</h1>
        <p className={`text-xs mt-2 font-bold ${t.textMuted}`}>Enter the 6-digit code sent to your email.</p>
        
        <div className="flex justify-between mt-7 mb-8 gap-2">
          {[1,2,3,4,5,6].map((i) => (
            <input 
              key={i}
              type="text" 
              maxLength={1}
              defaultValue={i === 1 ? '1' : i === 2 ? '2' : ''}
              className={`w-12 h-14 rounded-xl text-center text-xl font-extrabold transition-all outline-none ${t.inputBg} border ${t.inputBorder} ${t.text} focus:ring-2 focus:ring-[#1D9BF0]/30 shadow-sm`}
            />
          ))}
        </div>

        <button onClick={() => setCurrentView('main')} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30 hover:bg-[#1A8CD8]">
          Verify & Create Account
        </button>

        <p className={`text-center text-xs font-bold mt-5 ${t.textMuted}`}>
          Didn't receive the code? <span className="text-[#1D9BF0] opacity-50 cursor-not-allowed ml-1">Resend in 28s</span>
        </p>
      </div>
    </div>
  );

  const HomeTab = () => {
    const [notifIndex, setNotifIndex] = useState(0);

    const previewNotifications = [
      { id: 1, type: 'job', icon: Briefcase, color: 'text-[#1D9BF0]', bg: 'bg-[#1D9BF0]/10', title: 'New Job Match', msg: 'Pathao posted a new Frontend Developer role that matches your skills.', time: '2m ago' },
      { id: 2, type: 'connection', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Connection Accepted', msg: 'Sarah Rahman accepted your connection request.', time: '1h ago' },
      { id: 3, type: 'blood', icon: Droplets, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Emergency Alert', msg: 'Urgent: B+ blood needed at Apollo Hospital.', time: '2h ago' },
      { id: 4, type: 'system', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Profile Strength', msg: 'Your profile strength is at 80%. Add a resume to reach 100%.', time: '1d ago' },
    ];

    const demoAds = React.useMemo(() => [
      {
        id: 1,
        link: '#bootcamp',
        content: (
          <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center px-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="z-10 flex-1 pr-4">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-black/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Workshop</span>
              <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Tech Bootcamp 2024</h3>
              <p className="text-white/90 text-[11px] font-semibold">Master UI/UX & React. Limited seats!</p>
            </div>
            <div className="z-10 w-11 h-11 bg-black/10 border border-black/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">
              🚀
            </div>
          </div>
        )
      },
      {
        id: 2,
        link: '#internship',
        content: (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center px-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="z-10 flex-1 pr-4">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-black/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Hiring Now</span>
              <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Startup Internship</h3>
              <p className="text-white/90 text-[11px] font-semibold">Kickstart your career at top startups.</p>
            </div>
            <div className="z-10 w-11 h-11 bg-black/10 border border-black/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">
              💼
            </div>
          </div>
        )
      },
      {
        id: 3,
        link: '#careerfair',
        content: (
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center px-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="z-10 flex-1 pr-4">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-white/20 text-white uppercase tracking-wider mb-2 inline-block backdrop-blur-md">Event</span>
              <h3 className="text-white font-extrabold text-lg leading-tight mb-1">Campus Career Fair</h3>
              <p className="text-white/90 text-[11px] font-semibold">Meet 50+ employers on campus.</p>
            </div>
            <div className="z-10 w-11 h-11 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-lg shadow-lg backdrop-blur-md shrink-0">
              🎓
            </div>
          </div>
        )
      }
    ], []);

    useEffect(() => {
      const interval = setInterval(() => {
        setNotifIndex((prev) => (prev + 1) % previewNotifications.length);
      }, 4000);
      return () => clearInterval(interval);
    }, [previewNotifications.length]);

    return (
      <div className="flex flex-col h-full overflow-y-auto pb-36 px-5 pt-8 space-y-6 animate-fade-in relative z-10">
        <div className="mb-2">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5 mb-1">
                <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={3} />
                <span className="text-[10px] font-extrabold text-[#1D9BF0] tracking-wide uppercase">
                  Verified NSU {authRole.charAt(0).toUpperCase() + authRole.slice(1)}
                </span>
              </div>
              <h1 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>
                Hi, {authRole === 'student' ? 'Hasan' : authRole === 'alumni' ? 'Nusrat' : 'Dr. Hasan'} <span className="text-xl inline-block origin-bottom-right animate-wave">👋</span>
              </h1>
              <p className={`${t.textMuted} text-xs font-bold mt-0.5`}>
                {authRole === 'student' ? 'CSE • Batch 221' : authRole === 'alumni' ? 'Software Eng • Batch 19' : 'Professor • CSE'}
              </p>
            </div>

            <div className="flex space-x-2">
              <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm`}>
                {isDark ? <Sun className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />}
              </button>
              <button onClick={() => setActiveOverlay('notifications')} className={`w-8 h-8 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm relative active:scale-95`}>
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
              { icon: CustomAlumniIcon, label: 'Network', action: () => setActiveTab('directory') },
              { icon: CustomJobsIcon, label: 'Jobs', action: () => setActiveTab('jobs') },
              { icon: CustomEmergencyIcon, label: 'Emergency', action: () => setActiveTab('emergency') },
              { icon: CustomMessagesIcon, label: 'Message', action: () => setActiveTab('messages') },
            ].map((action, idx) => (
              <div 
                key={idx} 
                onClick={action.action}
                className="flex-1 flex flex-col items-center justify-center min-h-[72px] cursor-pointer group transition-all duration-200 ease-out active:scale-90"
              >
                <action.icon 
                  className={`w-[36px] h-[36px] mb-2 transition-colors duration-200 ${action.colorClass || (isDark ? 'text-white' : 'text-[#1C1C1E]')}`} 
                />
                <span className={`text-[12px] font-bold leading-tight text-center ${t.textMuted} group-hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AdCarousel ads={demoAds} isDark={isDark} />

        <div>
          <div className="flex justify-between items-end mb-1 relative z-10 px-1">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>People to Connect With</h3>
            <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => setActiveTab('directory')}>See All</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pt-4 pb-10 -mb-6 relative z-0">
            {globalAlumniData.slice(0,3).map((person) => (
              <div 
                key={person.id} 
                className={`w-[290px] shrink-0 p-5 rounded-2xl border ${t.border} ${t.cardShadow} flex flex-col cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all`} 
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
                      <p className={`font-bold ${t.textMuted} text-[11px] truncate`}>{person.role} @ {person.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getDeptStyle(person.dept)}`}>
                      {person.dept}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-black/20 text-white/70 border border-white/10' : 'bg-white/60 text-black/60 shadow-sm border border-white'} truncate max-w-[100px]`}>
                      {person.batch}
                    </span>
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

        <div>
          {(authRole === 'alumni' || authRole === 'faculty') && (
            <div className="px-1 mb-5">
              <button 
                onClick={() => setIsPostJobOpen(true)}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all active:scale-[0.98] bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 flex items-center justify-center shadow-sm`}
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> Post a Job Opportunity
              </button>
            </div>
          )}
          <div className="flex justify-between items-end mb-1 relative z-10 px-1">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>
              {(authRole === 'alumni' || authRole === 'faculty') ? 'Recently Posted Jobs' : 'Latest Jobs For You'}
            </h3>
            <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => setActiveTab('jobs')}>See All</button>
          </div>
          <JobSlider jobs={globalJobsData} isDark={isDark} t={t} onSelectJob={setSelectedJob} />
        </div>

        {/* Animated Infinite Notification Stack */}
        <div className="relative w-full h-[88px] shrink-0 overflow-hidden rounded-2xl cursor-pointer group mt-2 mb-4" onClick={() => setActiveOverlay('notifications')}>
          {previewNotifications.map((notif, index) => {
            const length = previewNotifications.length;
            let offset = index - notifIndex;
            
            // Circular calculation so cards loop infinitely
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

        <div 
          onClick={() => setActiveTab('emergency')}
          className={`shrink-0 ${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-4 relative overflow-hidden group cursor-pointer hover:border-red-500/30 transition-colors`}
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
                 <span className="text-red-500 text-[9px] font-extrabold tracking-wide uppercase">Live</span>
               </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <div className="w-11 h-11 shrink-0 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] text-white font-extrabold text-base border border-red-400">
                 B+
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className={`text-sm font-extrabold ${t.text} leading-tight truncate`}>Urgent Blood Required</h4>
                 <div className="flex items-center mt-1 space-x-1.5">
                   <p className={`${t.textMuted} text-[10px] font-bold truncate`}>Needed immediately</p>
                   <span className="w-1 h-1 rounded-full bg-gray-400/50 shrink-0"></span>
                   <p className={`${t.textMuted} text-[10px] font-extrabold shrink-0`}>2.3 km away</p>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-red-500/50 group-hover:text-red-500 transition-colors shrink-0" strokeWidth={2.5} />
            </div>
          </div>
        </div>

      </div>
    );
  };

  const EmergencyTab = () => {
    const viewMode = emergencyViewMode;
    const setViewMode = setEmergencyViewMode;
    const isAvailable = isDonorAvailable;
    const setIsAvailable = setIsDonorAvailable;

    const activeRequests = globalEmergencyRequests;

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-4 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-red-400' : 'text-red-600'} tracking-tight leading-tight`}>Emergency Support</h2>
              <p className={`${t.textMuted} text-xs font-medium tracking-wide mt-1`}>Find verified NSU blood donors near you</p>
            </div>
            <button className={`w-9 h-9 rounded-lg ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border flex items-center justify-center transition-colors`}>
              <Info className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-28 px-5 pt-6 relative z-10">
          
          {/* Blood Group Gallery */}
          <div>
            <h3 className={`text-sm font-semibold ${t.textMuted} uppercase tracking-wider mb-3`}>Blood Groups</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { bg: 'A+', count: 42 }, { bg: 'B+', count: 85 }, { bg: 'O+', count: 64 }, { bg: 'AB+', count: 18 },
                { bg: 'A-', count: 12 }, { bg: 'B-', count: 23 }, { bg: 'O-', count: 15 }, { bg: 'AB-', count: 5 }
              ].map(item => {
                return (
                  <div 
                    key={item.bg} 
                    onClick={() => {
                      setDirectoryFilterBg(item.bg);
                      setActiveTab('emergency_directory');
                    }}
                    className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all active:scale-95`}
                  >
                    <span className={`text-xl font-semibold ${t.text} mb-0.5`}>{item.bg}</span>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 font-medium`}>{item.count} donors</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donor Status Section */}
          <div className={`rounded-2xl p-5 ${t.card} shadow-sm border ${t.border} mt-6 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-5">
                 <div className="flex items-center space-x-3">
                   <Droplet className={`w-6 h-6 ${isAvailable ? 'text-green-500' : 'text-gray-400'} transition-colors`} strokeWidth={2.5} />
                   <div>
                     <h3 className={`text-base font-extrabold ${t.text} leading-tight`}>Donor Status</h3>
                     <p className={`text-xs font-bold ${isAvailable ? 'text-green-500' : t.textMuted} mt-0.5 transition-colors`}>
                       {isAvailable ? 'Ready to donate' : 'Currently unavailable'}
                     </p>
                   </div>
                 </div>
                 <div 
                   onClick={() => setIsAvailable(!isAvailable)} 
                   className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors cursor-pointer border ${isAvailable ? 'bg-green-500 border-green-500' : (isDark ? 'bg-white/10 border-white/20' : 'bg-gray-200 border-gray-300')}`}
                 >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className="flex flex-col items-start text-left">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Your Impact</span>
                    <span className={`text-lg font-extrabold ${isDark ? 'text-red-400' : 'text-red-600'} drop-shadow-sm`}>3 Lives</span>
                 </div>
                 <div className="flex flex-col items-end text-right">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Last Donated</span>
                    <span className={`text-lg font-extrabold ${t.text}`}>14 Aug, '23</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Requests Near You */}
          <div className="mt-6">
            <h3 className={`text-sm font-semibold ${t.textMuted} uppercase tracking-wider mb-3`}>Requests Near You</h3>
            <div className="space-y-3">
              {activeRequests.map((req, i) => (
                <div key={i} className={`rounded-xl p-4 ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border`}>
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
                  </div>
                  <button 
                    onClick={() => setSelectedEmergency(req)}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} border border-transparent`}
                  >
                    View Request
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Request CTA */}
          <div className={`rounded-xl p-5 ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} border mt-8 mb-4`}>
            <div className="flex flex-col items-start text-left">
               <h3 className={`text-lg font-semibold ${t.text}`}>Need Blood?</h3>
               <p className={`text-sm font-medium ${t.textMuted} mt-1 mb-5`}>Create a request to notify nearby NSU donors.</p>
               <button 
                 onClick={() => setIsEmergencyFlowOpen(true)}
                 className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] bg-red-600 hover:bg-red-700 text-white`}
               >
                 Create Blood Request
               </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const EmergencyDirectoryTab = () => {
    const allUsers = [...globalAlumniData, ...globalFacultyData, ...globalStudentData];
    const displayData = allUsers.filter(u => u.blood === directoryFilterBg);

    const getRoleStyles = (person) => {
      const type = person.batch === 'Faculty' ? 'Faculty' : person.role === 'Student' ? 'Student' : 'Alumni';
      switch (type) {
        case 'Student':
          return { type, icon: GraduationCap, colorClass: 'text-[#1D9BF0]', bgClass: 'bg-[#1D9BF0]/10' };
        case 'Alumni':
          return { type, icon: Briefcase, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };
        case 'Faculty':
          return { type, icon: Landmark, colorClass: isDark ? 'text-rose-400' : 'text-[#800000]', bgClass: isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10' };
        default:
          return { type, icon: User, colorClass: 'text-gray-500', bgClass: 'bg-gray-500/10' };
      }
    };

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b`}>
          <div className="flex items-center mb-4 mt-1">
            <button 
              onClick={() => {
                setDirectoryFilterBg(null);
                setActiveTab('emergency');
              }}
              className={`mr-3 w-10 h-10 rounded-lg ${t.card} border ${t.borderSoft} flex items-center justify-center transition-colors active:scale-95 shrink-0`}
            >
              <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
            </button>
            <div>
              <h2 className={`text-2xl font-extrabold ${isDark ? 'text-red-400' : 'text-red-600'} tracking-tight leading-tight`}>
                {directoryFilterBg} Donors
              </h2>
              <p className={`${t.textMuted} text-[11px] font-bold tracking-wide mt-0.5`}>Emergency Blood Directory</p>
            </div>
          </div>
          
          <div className="flex items-center text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider mt-1">
             Showing {displayData.length} results • {directoryFilterBg} Blood Group
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-6 relative z-10 space-y-4">
          {displayData.map((person) => {
            const { type: roleType, icon: RoleIcon, colorClass, bgClass } = getRoleStyles(person);
            
            return (
              <div 
                key={person.id} 
                className={`rounded-2xl p-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-sm border ${t.borderSoft} ${isDark ? 'bg-[#1A1A1A]/60' : 'bg-white/60'} backdrop-blur-md`} 
                onClick={() => setSelectedUser(person)}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full shrink-0 ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shadow-sm`}>
                        <User className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <h3 className={`font-extrabold text-base tracking-tight leading-tight truncate ${t.text}`}>{person.name}</h3>
                          {person.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
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
                    <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-extrabold flex items-center bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20`}>
                      <CheckCircle2 className="w-3 h-3 mr-1.5" strokeWidth={2.5} /> Eligible to Donate
                    </span>
                  </div>

                  <div className="flex space-x-2 w-full">
                    <div className="flex-1" onClick={(e) => handleConnectClick(e, person.id)}>
                      {requestedSet.has(person.id) ? (
                        <div className={`flex items-center justify-center h-10 rounded-lg font-bold text-[13px] ${isDark ? 'bg-white/10 text-white' : 'bg-white text-black shadow-sm'} border ${t.border} transition-all`}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-red-500" strokeWidth={2.5} /> Request Sent
                        </div>
                      ) : (
                        <button className={`w-full h-10 rounded-lg font-bold text-[13px] transition-all active:scale-[0.97] bg-red-500 hover:bg-red-600 text-white shadow-sm flex items-center justify-center`}>
                          <AlertTriangle className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Request Blood
                        </button>
                      )}
                    </div>
                    <button 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'} transition-colors active:scale-95 shrink-0`} 
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DirectoryTab = () => {
    const availableTabs = ['Alumni', 'Student', 'Faculty'];

    let displayData = directorySegment === 'Alumni' ? globalAlumniData : 
                      directorySegment === 'Faculty' ? globalFacultyData : 
                      globalStudentData;

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b`}>
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Directory</h2>
              <p className={`${t.textMuted} text-[11px] font-bold tracking-wide mt-0.5`}>Connect with the NSU Network</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mb-4">
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

          <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} mb-2`}>
            {availableTabs.map(seg => (
              <button 
                key={seg} 
                onClick={() => setDirectorySegment(seg)}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${directorySegment === seg ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border` : `text-gray-500 hover:${t.text}`}`}
              >
                {seg}
              </button>
            ))}
          </div>
          
          <div className="flex items-center text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider mt-1">
             Showing {displayData.length} results • {directorySegment}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-6 relative z-10 space-y-5">
          {displayData.map((person) => (
            <div 
              key={person.id} 
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
                    <p className={`font-bold ${t.textMuted} text-xs truncate`}>{person.role} @ {person.company}</p>
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
                  {person.batch !== 'Faculty' && (
                    <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
                      <p className={`text-sm font-extrabold ${t.text}`}>{person.batch.includes(' ') ? person.batch.split(' ')[1] : person.batch}</p>
                    </div>
                  )}
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    let displayedJobs = globalJobsData;
    if (jobSegment === 'Saved') {
       displayedJobs = globalJobsData.slice(0, 1);
    }
    if (jobFilter) {
       displayedJobs = displayedJobs.filter(job => job.type === jobFilter || job.location === jobFilter);
    }

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Jobs</h2>
            </div>
            <div className="flex items-center space-x-2 relative z-50">
              {jobFilter && (
                <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#1D9BF0]/10'} border ${t.borderSoft} animate-fade-in`}>
                  <span className={`text-[10px] font-extrabold ${isDark ? 'text-white' : 'text-[#1D9BF0]'} uppercase tracking-wider`}>{jobFilter}</span>
                  <button onClick={() => setJobFilter(null)} className={`opacity-70 hover:opacity-100 ${isDark ? 'text-white' : 'text-[#1D9BF0]'}`}>
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </div>
              )}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50 ${jobFilter || isFilterOpen ? 'border-[#1D9BF0]/50 text-[#1D9BF0]' : ''}`}
              >
                <Filter className={`w-4 h-4 ${jobFilter || isFilterOpen ? 'text-[#1D9BF0]' : t.text}`} strokeWidth={2.5} />
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className={`absolute top-11 right-0 w-44 rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} shadow-2xl z-50 p-2 animate-fade-in`}>
                     <h4 className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 px-2 pt-1`}>Filter By</h4>
                     {['Full-Time', 'Internship', 'Remote'].map(f => (
                       <button 
                         key={f} 
                         onClick={() => { setJobFilter(f); setIsFilterOpen(false); }}
                         className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${jobFilter === f ? 'bg-[#1D9BF0] text-white' : `hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} ${t.text}`}`}
                       >
                         <span>{f}</span>
                         {jobFilter === f && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />}
                       </button>
                     ))}
                     <div className={`my-1 border-t ${t.borderSoft}`}></div>
        <button 
            onClick={() => { setJobFilter(null); setIsFilterOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors text-red-500 hover:${isDark ? 'bg-white/10' : 'bg-red-50'}`}
          >
            Clear Filter
          </button>
      </div>
                </>
              )}
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
          {displayedJobs.length > 0 ? displayedJobs.map((job) => (
            <div 
              key={job.id} 
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

                <p className={`text-[11px] font-bold ${t.textMuted} line-clamp-2 mb-3 leading-relaxed`}>{job.preview}</p>

                {job.postedBy && (
                  <div 
                    className="flex items-center space-x-2.5 mb-4 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      const poster = [...globalAlumniData, ...globalFacultyData, ...globalStudentData].find(u => u.id === job.postedBy.userId);
                      if (poster) setSelectedUser(poster);
                    }}
                  >
                    <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-white/10' : 'bg-white border border-gray-200'} shadow-sm flex items-center justify-center shrink-0`}>
                      <User className={`w-3.5 h-3.5 ${t.text}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-0.5`}>Posted By</p>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[11px] font-extrabold ${t.text} truncate`}>{job.postedBy.name}</span>
                        {job.postedBy.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${job.postedBy.type === 'Faculty' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                          {job.postedBy.type}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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
          )) : (
            <div className="flex flex-col items-center justify-center py-16 opacity-50 animate-fade-in">
              <Briefcase className="w-12 h-12 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-bold">No jobs found for this filter</p>
            </div>
          )}
        </div>

        {(authRole === 'alumni' || authRole === 'faculty') && (
          <button 
            onClick={() => setIsPostJobOpen(true)}
            className="absolute bottom-28 right-5 w-14 h-14 bg-[#1D9BF0] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1D9BF0]/40 active:scale-95 transition-transform z-30"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
        )}
      </div>
    );
  };

  const MessagesTab = () => {
    const [chatSegment, setChatSegment] = useState('All Chats');
    const [chatFilter, setChatFilter] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [contextMenuChat, setContextMenuChat] = useState(null);
    const timerRef = React.useRef(null);
    const isLongPress = React.useRef(false);

    const handleTouchStart = (chat) => {
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        setContextMenuChat(chat);
      }, 500);
    };

    const handleTouchEnd = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleContextMenu = (e, chat) => {
      e.preventDefault();
      setContextMenuChat(chat);
      isLongPress.current = true;
    };

    const handleClick = (e, chat) => {
      if (isLongPress.current) {
        e.preventDefault();
        return;
      }
      setActiveOverlay('chat');
    };

    const conversations = [
      { id: 1, name: 'Sarah Rahman', role: 'Alumni', msg: 'The project files are attached, let\'s sync...', time: '2m ago', unread: true, isRequest: false, online: true },
      { id: 2, name: 'Tahmid Hasan', role: 'Student', msg: 'Thanks for the update! Looking forward to it.', time: '1h ago', unread: false, isRequest: false, online: true },
      { id: 3, name: 'Dr. Aminul Islam', role: 'Faculty', msg: 'Can we schedule a meeting tomorrow at 3 PM?', time: 'Yesterday', unread: false, isRequest: false, online: false },
      { id: 4, name: 'Nabila Islam', role: 'Faculty', msg: 'Did you check out the new design system files?', time: 'Tuesday', unread: false, isRequest: false, online: false },
      { id: 5, name: 'Fahim Shahriar', role: 'Alumni', msg: 'Hi, I saw your portfolio and wanted to connect.', time: '3d ago', unread: true, isRequest: true, online: true },
    ];

    const getRoleStyles = (role) => {
      switch (role) {
        case 'Student':
          return { icon: GraduationCap, colorClass: 'text-[#1D9BF0]', bgClass: 'bg-[#1D9BF0]/10' };
        case 'Alumni':
          return { icon: Briefcase, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };
        case 'Faculty':
          return { icon: Landmark, colorClass: isDark ? 'text-rose-400' : 'text-[#800000]', bgClass: isDark ? 'bg-rose-400/10' : 'bg-[#800000]/10' };
        default:
          return { icon: User, colorClass: 'text-gray-500', bgClass: 'bg-gray-500/10' };
      }
    };

    let displayedChats = conversations.filter(c => chatSegment === 'All Chats' ? !c.isRequest : c.isRequest);
    
    if (chatFilter) {
      if (chatFilter === 'Unread') {
        displayedChats = displayedChats.filter(c => c.unread);
      } else {
        displayedChats = displayedChats.filter(c => c.role === chatFilter);
      }
    }

    return (
      <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
        <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Messages</h2>
            <div className="flex space-x-2 relative z-50">
              {chatFilter && (
                <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#1D9BF0]/10'} border ${t.borderSoft} animate-fade-in`}>
                  <span className={`text-[10px] font-extrabold ${isDark ? 'text-white' : 'text-[#1D9BF0]'} uppercase tracking-wider`}>{chatFilter}</span>
                  <button onClick={() => setChatFilter(null)} className={`opacity-70 hover:opacity-100 ${isDark ? 'text-white' : 'text-[#1D9BF0]'}`}>
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </div>
              )}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50 ${chatFilter || isFilterOpen ? 'border-[#1D9BF0]/50 text-[#1D9BF0]' : ''}`}
              >
                <Filter className={`w-4 h-4 ${chatFilter || isFilterOpen ? 'text-[#1D9BF0]' : t.text}`} strokeWidth={2.5} />
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className={`absolute top-11 right-11 w-44 rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-gray-200'} shadow-2xl z-50 p-2 animate-fade-in`}>
                     <h4 className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 px-2 pt-1`}>Filter By</h4>
                     {['Unread', 'Student', 'Alumni', 'Faculty'].map(f => (
                       <button 
                         key={f} 
                         onClick={() => { setChatFilter(f); setIsFilterOpen(false); }}
                         className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${chatFilter === f ? 'bg-[#1D9BF0] text-white' : `hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} ${t.text}`}`}
                       >
                         <span>{f}</span>
                         {chatFilter === f && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />}
                       </button>
                     ))}
                     <div className={`my-1 border-t ${t.borderSoft}`}></div>
                     <button 
                         onClick={() => { setChatFilter(null); setIsFilterOpen(false); }}
                         className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors text-red-500 hover:${isDark ? 'bg-white/10' : 'bg-red-50'}`}
                       >
                         Clear Filter
                       </button>
                  </div>
                </>
              )}

              <button 
                onClick={() => setActiveOverlay('message_settings')}
                className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50`}
              >
                <Settings className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="relative w-full mb-4">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
            />
          </div>

          <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft}`}>
            {['All Chats', 'Requests'].map(seg => (
              <button 
                key={seg} 
                onClick={() => setChatSegment(seg)}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center ${chatSegment === seg ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border` : `text-gray-500 hover:${t.text}`}`}
              >
                {seg}
                {seg === 'Requests' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${chatSegment === seg ? 'bg-[#1D9BF0] text-white' : 'bg-[#1D9BF0]/20 text-[#1D9BF0]'}`}>
                    1
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-36 px-4 pt-3 relative z-10">
          {displayedChats.length > 0 ? displayedChats.map((chat) => {
            const { icon: RoleIcon, colorClass, bgClass } = getRoleStyles(chat.role);

            return (
              <div 
                key={chat.id} 
                className={`flex items-center p-4 rounded-xl border border-transparent hover:${isDark ? 'bg-white/5' : 'bg-black/5'} hover:border-white/10 transition-all cursor-pointer mb-1 group select-none`} 
                onTouchStart={() => handleTouchStart(chat)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                onMouseDown={() => handleTouchStart(chat)}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onContextMenu={(e) => handleContextMenu(e, chat)}
                onClick={(e) => handleClick(e, chat)}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center shadow-sm`}>
                    <User className={`w-6 h-6 ${colorClass}`} strokeWidth={1.5} />
                  </div>
                  {chat.online && (
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 ${isDark ? 'border-[#000000]' : 'border-[#F2F5F8] group-hover:border-[#E5E8EB]'} rounded-full transition-colors`}></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center space-x-1.5 truncate pr-2">
                      <h4 className={`text-sm ${chat.unread ? `font-extrabold ${t.text}` : `font-bold ${t.text}`}`}>{chat.name}</h4>
                      <RoleIcon className={`w-3.5 h-3.5 ${colorClass}`} strokeWidth={2.5} />
                    </div>
                    <span className={`${chat.unread ? 'text-[#1D9BF0] font-extrabold' : t.textMuted + ' font-bold'} text-[10px] shrink-0`}>{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? `font-bold ${t.text}` : `${t.textMuted} font-medium`}`}>
                    {chat.msg}
                  </p>
                </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-16 opacity-50 animate-fade-in">
              <MessageSquare className="w-12 h-12 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-bold">No messages found</p>
            </div>
          )}
        </div>

        {contextMenuChat && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={() => setContextMenuChat(null)}></div>
            <div className={`absolute bottom-0 left-0 w-full p-4 pt-3 rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-50 animate-slide-up border-t ${t.borderSoft}`}>
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5"></div>
              <div className="px-2 mb-4 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center`}>
                   <User className={`w-5 h-5 ${t.text}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-base font-extrabold ${t.text} truncate`}>{contextMenuChat.name}</h4>
                  <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{contextMenuChat.msg}</p>
                </div>
              </div>
              <div className="space-y-1 pb-32">
                {[
                  { icon: Archive, label: 'Archive' },
                  { icon: VolumeX, label: 'Mute Notifications' },
                  { icon: Pin, label: 'Pin Chat' },
                  { icon: MailOpen, label: contextMenuChat.unread ? 'Mark as Read' : 'Mark as Unread' },
                  { icon: Trash2, label: 'Delete', isDestructive: true }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} active:scale-[0.98] transition-all`}
                    onClick={() => setContextMenuChat(null)}
                  >
                    <item.icon className={`w-5 h-5 ${item.isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
                    <span className={`text-sm font-bold ${item.isDestructive ? 'text-red-500' : t.text}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
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
                {user.batch !== 'Faculty' && (
                  <div className="text-center flex-1 border-r border-dashed border-gray-400/30">
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Batch</p>
                    <p className={`text-base font-extrabold ${t.text}`}>{user.batch.includes(' ') ? user.batch.split(' ')[1] : user.batch}</p>
                  </div>
                )}
                <div className="text-center flex-1">
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Network</p>
                  <p className={`text-base font-extrabold ${t.text}`}>{user.followers}</p>
                </div>
              </div>

              <div className="flex space-x-3 w-full">
                <div className="flex-1">
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
            {job.postedBy && (
              <div 
                className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-4 flex items-center space-x-3 cursor-pointer active:scale-[0.98] transition-transform hover:opacity-90`}
                onClick={() => {
                  const poster = [...globalAlumniData, ...globalFacultyData, ...globalStudentData].find(u => u.id === job.postedBy.userId);
                  if (poster) setSelectedUser(poster);
                }}
              >
                <div className={`w-11 h-11 rounded-full ${isDark ? 'bg-white/10' : 'bg-white border border-gray-200'} shadow-sm flex items-center justify-center shrink-0`}>
                  <User className={`w-5 h-5 ${t.text}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-0.5`}>Posted By</p>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-sm font-extrabold ${t.text} truncate`}>{job.postedBy.name}</span>
                    {job.postedBy.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${job.postedBy.type === 'Faculty' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                      {job.postedBy.type}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
              </div>
            )}

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
           <button 
             disabled={authRole === 'alumni' || authRole === 'faculty'}
             className={`w-full h-14 rounded-xl font-extrabold text-base transition-all ${
               (authRole === 'alumni' || authRole === 'faculty') 
                 ? `bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60` 
                 : `active:scale-[0.97] bg-emerald-500 text-white shadow-lg shadow-emerald-500/40`
             }`}
           >
             {(authRole === 'alumni' || authRole === 'faculty') ? 'View Details' : 'Apply Now'}
           </button>
        </div>
      </div>
    );
  };

  const EmergencyRequestView = ({ req, onBack }) => {
    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-red-500 rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Request Details</h2>
          <button className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
             <Share className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-28 relative z-10">
          <div className={`m-5 mt-6 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}>
            <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-red-500/10' : 'bg-gradient-to-b from-white/90 to-red-500/10 backdrop-blur-3xl'}`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'} border-2 ${isDark ? 'border-red-500/30' : 'border-red-200'} flex items-center justify-center mb-4 shadow-lg shadow-red-500/20`}>
                <span className={`text-4xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>{req.bg}</span>
              </div>
              
              <h2 className={`font-extrabold text-2xl tracking-tight leading-tight ${t.text} mb-3`}>{req.hospital}</h2>
              
              <div className="flex items-center space-x-2 mb-6">
                 <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${req.urgency === 'Critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                    {req.urgency}
                 </span>
                 <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20`}>
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
            </div>
          </div>

          <div className="px-5 space-y-5">
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-6`}>
              <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Details</h3>
              <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 mb-6`}>
                {req.description}
              </p>
              
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
            </div>
          </div>
        </div>

        <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
           <button 
             className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-red-600 text-white shadow-lg shadow-red-600/40 flex items-center justify-center space-x-2`}
           >
             <Phone className="w-5 h-5" strokeWidth={2.5} />
             <span>Contact Family</span>
           </button>
        </div>
      </div>
    );
  };

  const PostJobOverlay = ({ onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>
            {isSubmitted ? 'Status' : 'Post a Job'}
          </h2>
          <div className="w-10 h-10"></div>
        </div>

        {!isSubmitted ? (
          <>
            <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6 space-y-5">
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Job Title</label>
                <input type="text" placeholder="e.g. Frontend Developer" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Company</label>
                  <input type="text" placeholder="e.g. Pathao" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                </div>
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Location</label>
                  <input type="text" placeholder="e.g. Dhaka, BD" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Job Type</label>
                  <select defaultValue="Full-Time" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} appearance-none focus:outline-none transition-all shadow-sm`}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Salary</label>
                  <input type="text" placeholder="e.g. Negotiable" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                </div>
              </div>

              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Application Deadline</label>
                <input type="text" placeholder="e.g. 15 Oct 2024" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>

              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Job Description</label>
                <textarea rows="4" placeholder="Describe the role and responsibilities..." className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
              </div>

              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Requirements (comma separated)</label>
                <textarea rows="3" placeholder="e.g. React, Node.js, 2+ years experience" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
              </div>
            </div>

            <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
               <button onClick={() => setIsSubmitted(true)} className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40`}>
                 Submit for Approval
               </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in-up pb-20">
            <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20 shadow-xl shadow-yellow-500/10">
              <Clock className="w-12 h-12 text-yellow-500" strokeWidth={2.5} />
            </div>
            <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Pending Approval</h3>
            <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 max-w-xs leading-relaxed`}>
              Your job post has been submitted. Our admin team will review it shortly. Once approved, it will be visible to all students.
            </p>
            <button 
              onClick={onClose} 
              className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} shadow-sm`}
            >
              Back to Jobs
            </button>
          </div>
        )}
      </div>
    );
  };

  const ChatOverlay = () => {
    const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [reactingTo, setReactingTo] = useState(null);
    const [reactions, setReactions] = useState({
      'msg-1': '👍',
      'msg-2': '👍',
      'msg-3': '❤️'
    });
    const timerRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const attachmentContainerRef = React.useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
        if (attachmentContainerRef.current && !attachmentContainerRef.current.contains(event.target)) {
          setIsAttachmentOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, []);
    
    // Sarah Rahman is Alumni
    const { icon: RoleIcon, colorClass, bgClass } = { icon: Briefcase, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };

    const handlePressStart = (msgId) => {
      timerRef.current = setTimeout(() => {
        setReactingTo(msgId);
      }, 500);
    };

    const handlePressEnd = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleMsgContextMenu = (e, msgId) => {
      e.preventDefault();
      setReactingTo(msgId);
    };

    const handleReaction = (msgId, emoji) => {
      setReactions(prev => {
        const newReactions = { ...prev };
        if (newReactions[msgId] === emoji) {
          delete newReactions[msgId]; // toggle off
        } else {
          newReactions[msgId] = emoji; // toggle on or change
        }
        return newReactions;
      });
      setReactingTo(null);
    };

    const ReactionMenu = ({ align, msgId }) => (
      <div className={`absolute bottom-full mb-2 ${align === 'right' ? 'right-0 origin-bottom-right' : 'left-0 origin-bottom-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-full px-3 py-2 flex items-center space-x-3 z-[60] animate-fade-in-up`}>
        {['❤️', '👍', '😂', '😮', '😢', '🙏'].map(emoji => (
          <button 
            key={emoji} 
            className={`text-[24px] hover:scale-125 hover:-translate-y-1 active:scale-95 transition-all drop-shadow-sm ${reactions[msgId] === emoji ? 'scale-125 -translate-y-1' : ''}`} 
            onClick={(e) => { e.stopPropagation(); handleReaction(msgId, emoji); }}
          >
            {emoji}
          </button>
        ))}
      </div>
    );

    const MessageActionsMenu = ({ align, isOwn, msgId }) => (
      <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-2xl p-1.5 flex flex-col z-[60] min-w-[140px] animate-fade-in-up`}>
        <button onClick={(e) => { e.stopPropagation(); setReactingTo(null); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
          <Reply className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
          <span className={`text-xs font-bold ${t.text}`}>Reply</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setReactingTo(null); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
          <Copy className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
          <span className={`text-xs font-bold ${t.text}`}>Copy</span>
        </button>
        {isOwn && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setReactingTo(null); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
              <Edit className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
              <span className={`text-xs font-bold ${t.text}`}>Edit</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setReactingTo(null); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-red-500/10' : 'bg-red-50'} transition-colors active:scale-[0.98] group`}>
              <Trash2 className={`w-4 h-4 text-red-500`} strokeWidth={2.5} />
              <span className={`text-xs font-bold text-red-500`}>Unsend</span>
            </button>
          </>
        )}
      </div>
    );

    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <div className={`absolute top-[20%] left-[-20%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-30'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-30 shadow-sm`}>
          <div className="flex items-center">
            <button onClick={() => setActiveOverlay(null)} className={`mr-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors hover:opacity-80`}>
              <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
            </button>
            <div className={`w-10 h-10 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center mr-3 relative shrink-0 shadow-sm`}>
              <User className={`w-5 h-5 ${colorClass}`} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Sarah Rahman</h2>
                <RoleIcon className={`w-3.5 h-3.5 ${colorClass}`} strokeWidth={2.5} />
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-[10px] font-bold ${t.textMuted}`}>Software Engineer</span>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <span className="text-[10px] font-extrabold text-[#1D9BF0]">Active now</span>
              </div>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg hover:${t.card.split(' ')[0]} transition-colors relative z-50`}
            >
              <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
            </button>

            {isMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 p-2 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95 shadow-black/40' : 'bg-white/95 shadow-black/5'} backdrop-blur-xl border ${t.borderSoft} shadow-xl z-50 flex flex-col space-y-1 animate-fade-in-up origin-top-right min-w-[180px]`}>
                {[
                  { icon: Archive, label: 'Archive Chat' },
                  { icon: VolumeX, label: 'Mute Notifications' },
                  { icon: Pin, label: 'Pin Chat' },
                  { icon: Trash2, label: 'Delete Chat', isDestructive: true }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors w-full text-left active:scale-[0.98]`} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className={`w-4 h-4 ${item.isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
                    <span className={`text-sm font-bold ${item.isDestructive ? 'text-red-500' : t.text}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col relative z-10 pb-6">
          {reactingTo && (
            <div className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] transition-all" onClick={() => setReactingTo(null)}></div>
          )}

          <div className="flex items-center justify-center my-2 space-x-4 opacity-70">
            <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${t.textMuted}`}>Today</span>
            <div className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
          </div>

          {/* Image Message Block */}
          <div 
            className={`self-start max-w-[80%] relative group mb-2 select-none ${reactingTo === 'msg-1' ? 'z-50' : ''}`}
            onTouchStart={() => handlePressStart('msg-1')}
            onTouchEnd={handlePressEnd}
            onTouchMove={handlePressEnd}
            onMouseDown={() => handlePressStart('msg-1')}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onContextMenu={(e) => handleMsgContextMenu(e, 'msg-1')}
          >
            {reactingTo === 'msg-1' && <ReactionMenu align="left" msgId="msg-1" />}
            {reactingTo === 'msg-1' && <MessageActionsMenu align="left" isOwn={false} msgId="msg-1" />}
            <div className="relative w-fit">
              <div className={`relative rounded-[24px] rounded-tl-sm overflow-hidden shadow-sm border ${t.borderSoft} w-[220px] h-[220px] bg-[#F3E5F5] dark:bg-[#2A1B30] flex items-center justify-center`}>
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" 
                  alt="Sent attachment" 
                  className="w-full h-full object-cover z-10 relative"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <ImageIcon className={`w-8 h-8 opacity-20 absolute`} />
              </div>
              
              {/* Reaction Pill */}
              {reactions['msg-1'] && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setReactingTo('msg-1'); }}
                  className={`absolute -bottom-3 right-0 px-2.5 py-1 min-w-[36px] ${isDark ? 'bg-[#1E1E1E] border-white/20' : 'bg-white border-gray-200'} border rounded-full shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all`}
                >
                  <span className="text-[13px] leading-none drop-shadow-sm">{reactions['msg-1']}</span>
                </div>
              )}
            </div>

            <span className={`text-[10px] font-bold ${t.textMuted} mt-4 ml-1 block`}>11:30 AM</span>
          </div>

          {/* Grouped Text Message */}
          <div 
            className={`self-start max-w-[80%] relative group mb-2 select-none ${reactingTo === 'msg-2' ? 'z-50' : ''}`}
            onTouchStart={() => handlePressStart('msg-2')}
            onTouchEnd={handlePressEnd}
            onTouchMove={handlePressEnd}
            onMouseDown={() => handlePressStart('msg-2')}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onContextMenu={(e) => handleMsgContextMenu(e, 'msg-2')}
          >
            {reactingTo === 'msg-2' && <ReactionMenu align="left" msgId="msg-2" />}
            {reactingTo === 'msg-2' && <MessageActionsMenu align="left" isOwn={false} msgId="msg-2" />}
            <div className="relative w-fit">
              <div className={`p-3.5 rounded-2xl rounded-tl-sm ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} shadow-sm backdrop-blur-md`}>
                <p className={`text-sm font-medium ${t.text} leading-relaxed`}>I reviewed the architectural proposals you sent over. Let's sync on the database schema before the sprint starts.</p>
              </div>
              {reactions['msg-2'] && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setReactingTo('msg-2'); }}
                  className={`absolute -bottom-3 right-0 px-2.5 py-1 min-w-[36px] ${isDark ? 'bg-[#1E1E1E] border-white/20' : 'bg-white border-gray-200'} border rounded-full shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all`}
                >
                  <span className="text-[13px] leading-none drop-shadow-sm">{reactions['msg-2']}</span>
                </div>
              )}
            </div>
            <span className={`text-[10px] font-bold ${t.textMuted} mt-4 ml-1 block`}>11:32 AM</span>
          </div>

          <div 
            className={`self-end max-w-[80%] relative mt-4 select-none ${reactingTo === 'msg-3' ? 'z-50' : ''}`}
            onTouchStart={() => handlePressStart('msg-3')}
            onTouchEnd={handlePressEnd}
            onTouchMove={handlePressEnd}
            onMouseDown={() => handlePressStart('msg-3')}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onContextMenu={(e) => handleMsgContextMenu(e, 'msg-3')}
          >
            {reactingTo === 'msg-3' && <ReactionMenu align="right" msgId="msg-3" />}
            {reactingTo === 'msg-3' && <MessageActionsMenu align="right" isOwn={true} msgId="msg-3" />}
            <div className="relative w-fit ml-auto">
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/30 text-left">
                <div className="bg-black/15 rounded-lg p-2.5 mb-2 border-l-[3px] border-white">
                  <p className="text-[10px] font-extrabold text-white mb-0.5">Sarah Rahman</p>
                  <p className="text-[11px] text-white/90 line-clamp-1 font-medium">I reviewed the architectural proposals you sent...</p>
                </div>
                <p className="text-sm font-medium leading-relaxed">Perfect. I'll prepare the diagrams. Are you free at 2 PM?</p>
              </div>
              {reactions['msg-3'] && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setReactingTo('msg-3'); }}
                  className={`absolute -bottom-3 left-0 px-2.5 py-1 min-w-[36px] ${isDark ? 'bg-[#1E1E1E] border-white/20' : 'bg-white border-gray-200'} border rounded-full shadow-sm flex items-center justify-center z-20 cursor-pointer hover:scale-110 active:scale-95 transition-all`}
                >
                  <span className="text-[13px] leading-none drop-shadow-sm">{reactions['msg-3']}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end items-center mt-4 space-x-1 mr-1">
              <span className={`text-[10px] font-bold ${t.textMuted}`}>11:42 AM</span>
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

        <div className={`p-4 ${t.glass} border-t relative z-20`} ref={attachmentContainerRef}>
          {isAttachmentOpen && (
            <div className={`absolute bottom-full left-4 mb-3 p-2 rounded-2xl ${isDark ? 'bg-[#1E1E1E]/95 shadow-black/40' : 'bg-white/95 shadow-black/5'} backdrop-blur-xl border ${t.borderSoft} shadow-xl z-40 flex flex-col space-y-1 animate-fade-in-up origin-bottom-left min-w-[160px]`}>
              {[
                { icon: Camera, label: 'Camera' },
                { icon: ImageIcon, label: 'Photo' },
                { icon: FileText, label: 'Document' },
                { icon: MapPin, label: 'Location' }
              ].map((item, i) => (
                <button 
                  key={i} 
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors w-full text-left active:scale-[0.98]`} 
                  onClick={() => setIsAttachmentOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
                  <span className={`text-sm font-bold ${t.text}`}>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end space-x-2 relative z-40">
            <button 
              onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
              className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg shadow-sm active:scale-95 transition-all duration-300 ${
                isAttachmentOpen 
                  ? 'bg-[#1D9BF0] text-white border-transparent' 
                  : `${t.card} border ${t.border} ${t.text} hover:opacity-80`
              }`}
            >
              <Plus className={`w-5 h-5 transition-transform duration-300 ${isAttachmentOpen ? 'rotate-45' : ''}`} strokeWidth={2.5} />
            </button>
            <div className={`flex-1 ${t.card} border ${t.border} rounded-lg flex items-center px-3 min-h-[40px] shadow-inner`}>
               <textarea 
                placeholder="Message..." 
                rows="1"
                className={`w-full bg-transparent text-sm font-bold ${t.text} focus:outline-none resize-none py-2.5 max-h-24`}
               />
            </div>
            <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/40 active:scale-95 transition-transform">
              <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationsOverlay = () => {
    const notifications = [
      { id: 1, type: 'job', icon: Briefcase, color: 'text-[#1D9BF0]', bg: 'bg-[#1D9BF0]/10', title: 'New Job Match', msg: 'Pathao posted a new Frontend Developer role that matches your skills.', time: '2m ago', unread: true },
      { id: 2, type: 'connection', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Connection Accepted', msg: 'Sarah Rahman accepted your connection request.', time: '1h ago', unread: true },
      { id: 3, type: 'blood', icon: Droplets, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Emergency Blood Request', msg: 'Urgent: B+ blood needed at Apollo Hospital.', time: '2h ago', unread: false },
      { id: 4, type: 'system', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Profile Strength', msg: 'Your profile strength is at 80%. Add a resume to reach 100%.', time: '1d ago', unread: false },
    ];

    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={() => setActiveOverlay(null)} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Notifications</h2>
          <button className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors hover:text-[#1D9BF0]`}>
             <CheckCheck className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-4 pt-4 space-y-2">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-2xl ${notif.unread ? (isDark ? 'bg-white/5' : 'bg-black/[0.03]') : 'bg-transparent'} border ${notif.unread ? t.borderSoft : 'border-transparent'} flex space-x-4 transition-all cursor-pointer hover:${isDark ? 'bg-white/10' : 'bg-black/5'} group`}>
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
                <p className={`text-xs ${notif.unread ? `font-medium ${t.text}` : `font-medium ${t.textMuted}`} line-clamp-2 leading-relaxed`}>{notif.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MessageSettingsOverlay = ({ onClose }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);

    return (
      <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
          <div className={`absolute top-[-5%] left-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`}></div>
        </div>

        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
          <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Message Settings</h2>
          <div className="w-10 h-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6 space-y-6">
          <div>
            <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
              <SettingsItem 
                icon={Volume2} 
                label="Notification Sound" 
                isToggle={true} 
                toggleState={soundEnabled} 
                onToggle={() => setSoundEnabled(!soundEnabled)} 
                t={t} isDark={isDark} 
              />
              <SettingsItem icon={Archive} label="Archived Chats" t={t} isDark={isDark} />
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-3 px-1`}>Support & Legal</h3>
            <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden ${t.cardShadow}`}>
              <SettingsItem icon={AlertTriangle} label="Report Technical Problem" t={t} isDark={isDark} />
              <SettingsItem icon={Info} label="Help" t={t} isDark={isDark} />
              <SettingsItem icon={FileText} label="Legal & Policies" t={t} isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            {currentView === 'splash' && SplashScreen()}
            {currentView === 'welcome' && WelcomeScreen()}
            {currentView === 'role_select' && RoleGatewayScreen()}
            {currentView === 'auth_main' && AuthScreen()}
            {currentView === 'otp' && OtpScreen()}
            
            {currentView === 'main' && (
              <div className="flex flex-col h-full relative z-10">
                <div className="flex-1 overflow-hidden relative">
                  {activeTab === 'home' && <HomeTab />}
                  {activeTab === 'directory' && <DirectoryTab />}
                  {activeTab === 'jobs' && <JobsTab />}
                  {activeTab === 'emergency' && <EmergencyTab />}
                  {activeTab === 'emergency_directory' && <EmergencyDirectoryTab />}
                  {activeTab === 'messages' && <MessagesTab />}
                  {activeTab === 'profile' && <ProfileTab 
                    authRole={authRole} t={t} isDark={isDark} 
                    profileSegment={profileSegment} setProfileSegment={setProfileSegment}
                    setSettingsOverlay={setSettingsOverlay} setCurrentView={setCurrentView}
                    pushEnabled={pushEnabled} handlePushToggle={handlePushToggle}
                    toggleTheme={toggleTheme} appLanguage={appLanguage}
                    twoFactorEnabled={twoFactorEnabled} handle2FAToggle={handle2FAToggle}
                    profileVisibility={profileVisibility} activeSessionsCount={activeSessions.length}
                  />}
                </div>

                <div className={`absolute bottom-0 left-0 w-full h-32 pointer-events-none z-40 bg-gradient-to-t ${isDark ? 'from-[#000000] via-[#000000]/80' : 'from-[#F2F5F8] via-[#F2F5F8]/80'} to-transparent`}></div>

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
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.id === 'directory') setDirectoryFilterBg(null);
                        }}
                        className={`relative flex items-center h-[60px] rounded-[2rem] transition-[width,background-color] duration-300 ease-out overflow-hidden ${isActive ? `w-[124px] ${isDark ? 'nav-active-dark text-white' : 'nav-active-light text-black'}` : `w-[60px] bg-transparent ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}`}
                      >
                        <div className="w-[60px] h-[60px] shrink-0 flex items-center justify-center">
                          {item.isAvatar ? (
                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? `ring-2 ${isDark ? 'ring-white/20' : 'ring-black/10'}` : 'opacity-80 border border-gray-300 dark:border-gray-600'} overflow-hidden shadow-sm backdrop-blur-md bg-gray-200 dark:bg-gray-800`}>
                              <User className="w-[16px] h-[16px] text-gray-500 dark:text-gray-400" strokeWidth={2} />
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
            {isPostJobOpen && <PostJobOverlay onClose={() => setIsPostJobOpen(false)} />}
            {settingsOverlay && <SettingsFlowOverlay 
              type={settingsOverlay} onClose={() => setSettingsOverlay(null)} 
              t={t} isDark={isDark} authRole={authRole} 
              appLanguage={appLanguage} setAppLanguage={setAppLanguage}
              profileVisibility={profileVisibility} setProfileVisibility={setProfileVisibility}
              activeSessions={activeSessions} setActiveSessions={setActiveSessions}
            />}
            {activeOverlay === 'message_settings' && <MessageSettingsOverlay onClose={() => setActiveOverlay(null)} />}
            {activeOverlay === 'chat' && <ChatOverlay />}
            {activeOverlay === 'notifications' && <NotificationsOverlay />}
            
            {selectedJob && (
              <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
            )}
            
            {selectedEmergency && (
              <EmergencyRequestView req={selectedEmergency} onBack={() => setSelectedEmergency(null)} />
            )}
            
            {selectedUser && (
              <UserProfileView user={selectedUser} onBack={() => setSelectedUser(null)} />
            )}
            
            {toastMsg && (
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
                <div className={`px-5 py-2.5 rounded-full shadow-xl shadow-black/10 text-xs font-bold transition-colors whitespace-nowrap ${isDark ? 'bg-white text-black' : 'bg-[#1A1A1A] text-white'}`}>
                  {toastMsg}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}