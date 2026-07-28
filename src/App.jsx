import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  // Base / Navigation / Existing
  Home, Users, Briefcase, MessageSquare, User, Droplets, Droplet, Bell, 
  Search, Filter, ChevronRight, MapPin, Phone, Send, Paperclip, Settings, 
  LogOut, Bookmark, FileText, ArrowLeft, Plus, Info, Lock, Mail, 
  AlertTriangle, CheckCircle2, Moon, Sun, BadgeCheck, Clock, ArrowUpRight, 
  ShieldCheck, Share, BookmarkIcon, GraduationCap, DollarSign, 
  SlidersHorizontal, Edit, MoreVertical, CheckCheck, Smile, Copy, QrCode, 
  Wifi, Eye, Lightbulb, Shield, Globe, Smartphone, CreditCard, ChevronDown, 
  Compass, Upload, X, Monitor, Landmark, Volume2, Archive,
  
  // Moments specific
  Camera, Image as ImageIcon, VolumeX, Pin, Trash2, MailOpen, Reply, 
  Heart, Type,
  
  // Events specific
  CalendarDays, CalendarCheck, CalendarClock, TicketCheck, Trophy,
  BookOpen, Building2, UsersRound, Megaphone, Palette, Dumbbell,
  HandHeart, CircleDollarSign, ListFilter, RotateCcw, Sparkles,

  // Seeking Work specific
  Linkedin, Github, Link2, Flag, Pause, Play, Ban
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

const CustomEventsIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="6" y="8" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 5V9M21 5V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    <circle cx="16" cy="20" r="1.5" fill="currentColor" />
    <circle cx="20" cy="20" r="1.5" fill="currentColor" />
  </svg>
);
// --- GLOBAL DEMO EVENTS DATA ---
const EVENTS_REFERENCE_DATE = new Date('2026-07-12T12:00:00');

const globalEventsData = [
  {
    id: 'event-career-fair',
    title: 'NSU Career Fair Summer 2026',
    shortDescription: 'Meet leading employers and explore graduate opportunities directly on campus.',
    description: 'The official NSU Career Fair connects students with over 50 top national and multinational companies. Bring your resumes, participate in on-the-spot interviews, and discover your next internship or full-time role. Registration is mandatory for entry.',
    category: 'Career',
    organizer: {
      id: 'org-1', name: 'Career and Placement Center (CPC)', type: 'University', verified: true,
      description: 'Official career support office of North South University.'
    },
    date: '2026-07-22', endDate: '2026-07-22', time: '10:00 AM', endTime: '5:00 PM',
    venue: 'NSU Plaza', venueDetails: 'Level 1 and Level 2, North South University campus.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    registrationStatus: 'Closing Soon', registrationDeadline: '2026-07-20T23:59:00', capacity: 1200,
    goingCount: 430, interestedCount: 780, featured: true, popular: true,
    recommendationReason: 'Trending at NSU',
    schedule: [
      { time: '10:00 AM', title: 'Opening Ceremony' },
      { time: '10:30 AM', title: 'Employer Booths Open' },
      { time: '2:00 PM', title: 'Panel: How to Crack Interviews' }
    ],
    registrationInfo: 'Registration is free for verified NSU students. Alumni must show verified ID.',
    tags: ['Career', 'Internship', 'Graduate Jobs'],
    notificationType: 'deadline', notificationMessage: 'Registration closes in 48 hours!'
  },
  {
    id: 'event-ai-talk',
    title: 'Responsible AI Research Talk',
    shortDescription: 'Exploring ethical considerations in deploying LLMs in healthcare.',
    description: 'Join Dr. Aminul Islam as he discusses the ethical deployment of large language models in healthcare settings, addressing bias, privacy, and regulatory compliance.',
    category: 'Research',
    organizer: {
      id: 'org-2', name: 'CSE Department', type: 'Department', verified: true,
      description: 'Department of Electrical & Computer Engineering.'
    },
    date: '2026-07-14', endDate: '2026-07-14', time: '3:00 PM', endTime: '4:30 PM',
    venue: 'AUDI 801', venueDetails: 'Admin Building, Level 8.',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop',
    registrationStatus: 'Closed', registrationDeadline: '2026-07-13T23:59:00', capacity: 150,
    goingCount: 145, interestedCount: 300, featured: false, popular: false,
    recommendationReason: 'Recommended for CSE',
    schedule: [],
    registrationInfo: 'Seats are strictly limited to 150 due to venue capacity.',
    tags: ['AI', 'Ethics', 'Research'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-uiux-bootcamp',
    title: 'UI/UX Design Bootcamp',
    shortDescription: 'A 2-day intensive bootcamp on Figma, prototyping, and user research.',
    description: 'Kickstart your journey in product design. Learn wireframing, high-fidelity prototyping, and foundational user research principles from industry experts.',
    category: 'Workshop',
    organizer: {
      id: 'organizer-acm', name: 'NSU ACM Student Chapter', type: 'Club', verified: true,
      description: 'The premier computer science student community at NSU.'
    },
    date: '2026-07-25', endDate: '2026-07-26', time: '9:00 AM', endTime: '4:00 PM',
    venue: 'SAC 312', venueDetails: 'South Academic Building, Level 3.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    registrationStatus: 'Open', registrationDeadline: '2026-07-23T23:59:00', capacity: 60,
    goingCount: 45, interestedCount: 120, featured: false, popular: true,
    recommendationReason: 'From a followed club',
    schedule: [
      { time: 'Day 1 - 9:00 AM', title: 'Intro to Design Thinking' },
      { time: 'Day 1 - 2:00 PM', title: 'Figma Basics' },
      { time: 'Day 2 - 10:00 AM', title: 'Prototyping & Handoff' }
    ],
    registrationInfo: 'Workshop fee: 500 BDT. Includes lunch and digital certificate.',
    tags: ['Design', 'Figma', 'UI/UX'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-orientation',
    title: 'Freshers’ Orientation Summer 2026',
    shortDescription: 'Welcome to North South University! Mandatory for all incoming students.',
    description: 'The official orientation program for the Summer 2026 incoming batch. Get to know campus facilities, academic rules, clubs, and meet your faculty members.',
    category: 'Academic',
    organizer: {
      id: 'org-3', name: 'NSU Admissions Office', type: 'University', verified: true,
      description: 'Official admissions and registrar office.'
    },
    date: '2026-07-15', endDate: '2026-07-15', time: '9:00 AM', endTime: '1:00 PM',
    venue: 'Open Air Theater (OAT)', venueDetails: 'Main campus center.',
    image: 'https://images.unsplash.com/photo-1523580494112-071d4574024e?w=800&auto=format&fit=crop',
    registrationStatus: 'Free Entry', registrationDeadline: null, capacity: 2000,
    goingCount: 1500, interestedCount: 2000, featured: true, popular: true,
    recommendationReason: null,
    schedule: [
      { time: '9:00 AM', title: 'Arrival and Seating' },
      { time: '10:00 AM', title: 'Vice Chancellor’s Address' },
      { time: '11:30 AM', title: 'Campus Tour' }
    ],
    registrationInfo: 'No prior registration required. Bring your provisional ID slip.',
    tags: ['Freshers', 'Orientation', 'Campus'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-ambassador',
    title: 'Campus Ambassador Hiring Session',
    shortDescription: 'Become the face of Grameenphone on campus.',
    description: 'Grameenphone is looking for energetic students to join their campus ambassador program. Discover the perks and apply on-site.',
    category: 'Recruitment',
    organizer: {
      id: 'org-10', name: 'Grameenphone Ltd.', type: 'External Partner', verified: true,
      description: 'Leading telecommunications provider.'
    },
    date: '2026-07-16', endDate: '2026-07-16', time: '2:00 PM', endTime: '4:00 PM',
    venue: 'Career Center', venueDetails: 'Admin Building, Level 4.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    registrationStatus: 'Cancelled', registrationDeadline: '2026-07-15T23:59:00', capacity: 100,
    goingCount: 0, interestedCount: 250, featured: false, popular: false,
    recommendationReason: null,
    schedule: [],
    registrationInfo: 'Event cancelled due to unavoidable circumstances.',
    tags: ['Ambassador', 'Jobs', 'Networking'],
    notificationType: 'cancelled', notificationMessage: 'Event has been cancelled by the organizer.'
  }
];


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
         <button onClick={handleSave} disabled={isSaving} className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-sm flex items-center justify-center`}>
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

// --- DEMO MOMENTS DATA ---
const globalMomentsData = [
  {
    id: 'user-1',
    user: { name: 'Maliha', role: 'Student', verified: true, avatar: null },
    seen: false,
    items: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop', duration: 5000, reactions: 20 },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop', duration: 5000, reactions: 45 },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop', duration: 5000, reactions: 88 }
    ]
  },
  {
    id: 'user-2',
    user: { name: 'Dr. Aminul', role: 'Faculty', verified: true, avatar: null },
    seen: false,
    items: [
      { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop', duration: 5000, reactions: 88 }
    ]
  },
  {
    id: 'user-3',
    user: { name: 'Tahmid Hasan', role: 'Student', verified: false, avatar: null },
    seen: true,
    items: [
      { id: 'm5', type: 'note', content: 'Need a study partner!', duration: 5000, reactions: 2 }
    ]
  },
  {
    id: 'user-4',
    user: { name: 'Ayman Sadiq', role: 'Alumni', verified: true, avatar: null },
    seen: false,
    items: [
      { id: 'm6', type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop', duration: 5000, reactions: 1204 }
    ]
  },
  {
    id: 'user-5',
    user: { name: 'Fahim', role: 'Student', verified: false, avatar: null },
    seen: false,
    items: [
      { id: 'm7', type: 'note', content: 'Just finished my thesis 🎓', duration: 5000, reactions: 34 }
    ]
  },
  {
    id: 'user-6',
    user: { name: 'Sadia', role: 'Alumni', verified: true, avatar: null },
    seen: true,
    items: [
      { id: 'm8', type: 'image', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop', duration: 5000, reactions: 56 }
    ]
  },
  {
    id: 'user-7',
    user: { name: 'Rayan', role: 'Student', verified: false, avatar: null },
    seen: false,
    items: [
      { id: 'm9', type: 'note', content: 'Hackathon team needed', duration: 5000, reactions: 5 },
      { id: 'm10', type: 'image', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop', duration: 5000, reactions: 12 }
    ]
  },
  {
    id: 'user-8',
    user: { name: 'Nabila', role: 'Faculty', verified: true, avatar: null },
    seen: true,
    items: [
      { id: 'm11', type: 'image', url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop', duration: 5000, reactions: 112 }
    ]
  }
];

// --- COMPONENTS ---

const MomentsRow = ({ moments, isDark, t, onOpenViewer, onOpenNote, onCreateClick }) => {
  const scrollRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full relative z-20">
      <div 
        ref={scrollRef}
        className={`flex space-x-4 overflow-x-auto hide-scrollbar px-5 pt-6 pb-2 items-start h-[125px] touch-pan-x select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex flex-col items-center shrink-0 w-[68px] cursor-pointer group active:scale-95 transition-transform" onClick={onCreateClick}>
          <div className="relative mb-1.5 pointer-events-none">
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-white text-black border border-gray-200'} shadow-sm z-20 w-max max-w-[80px] flex items-center justify-center`}>
              <span className="text-[10px] font-semibold truncate w-full text-center">Share thoug...</span>
              <div className={`absolute -bottom-1 left-4 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-white border-b border-r border-gray-200'}`}></div>
            </div>
            <div className={`w-[68px] h-[68px] rounded-full relative`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-100'} border-[2px] ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center overflow-hidden`}>
                <User className={`w-8 h-8 ${t.textMuted}`} strokeWidth={1.5} />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1D9BF0] rounded-full border-[2.5px] ${isDark ? 'border-black' : 'border-white'} flex items-center justify-center z-10`}>
                <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <span className={`text-[11px] font-semibold ${t.text} truncate w-full text-center pointer-events-none`}>Your Moment</span>
        </div>

        {moments.map((momentGroup, index) => {
          const firstNote = momentGroup.items.find(i => i.type === 'note');
          const unseenRing = `border-[#1D9BF0]`;
          const seenRing = isDark ? `border-gray-600` : `border-gray-300`;
          
          return (
            <div key={momentGroup.id} className="flex flex-col items-center shrink-0 w-[68px] cursor-pointer group active:scale-95 transition-transform">
              <div className="relative mb-1.5">
                {firstNote && (
                  <div 
                    onClick={(e) => { if(!isDragging) { e.stopPropagation(); onOpenNote(momentGroup); } }}
                    className={`absolute -top-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-white text-black border border-gray-200'} shadow-sm z-20 w-max max-w-[80px] flex items-center justify-center active:scale-95 transition-transform`}
                  >
                    <span className="text-[10px] font-semibold truncate w-full text-center">{firstNote.content}</span>
                    <div className={`absolute -bottom-1 left-4 w-2 h-2 rotate-45 ${isDark ? 'bg-white' : 'bg-white border-b border-r border-gray-200'}`}></div>
                  </div>
                )}
                <div 
                  onClick={() => { if(!isDragging) onOpenViewer(index); }}
                  className={`w-[68px] h-[68px] rounded-full border-[2.5px] p-[2.5px] pointer-events-auto ${momentGroup.seen ? seenRing : unseenRing}`}
                >
                  <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#1A1A1A]' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                    <User className={`w-8 h-8 ${t.textMuted}`} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full space-x-0.5 pointer-events-none">
                <span className={`text-[11px] font-semibold ${momentGroup.seen ? t.textMuted : t.text} truncate text-center`}>{momentGroup.user.name.split(' ')[0]}</span>
                {momentGroup.user.verified && <BadgeCheck className={`w-3 h-3 ${momentGroup.seen ? 'text-gray-400' : 'text-[#1D9BF0]'} shrink-0`} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NoteViewerOverlay = ({ data, onClose, t, isDark }) => {
  const note = data.items.find(i => i.type === 'note');
  const [replyText, setReplyText] = React.useState('');

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-between bg-black/60 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <div className="pt-12 px-4 flex justify-end">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform backdrop-blur-md">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-20 px-6" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-6 animate-fade-in-up">
          <div className="bg-white text-black px-6 py-5 rounded-3xl shadow-2xl max-w-[280px] text-center text-xl font-light leading-snug">
            {note?.content}
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
         <div className="flex items-center space-x-3 bg-white/10 rounded-full pl-5 pr-2 py-2 border border-white/20 shadow-inner">
           <input 
             type="text" 
             value={replyText}
             onChange={(e) => setReplyText(e.target.value)}
             placeholder={`Reply to ${data.user.name.split(' ')[0]}...`} 
             className="flex-1 bg-transparent text-white placeholder:text-white/60 font-light text-[14px] focus:outline-none" 
           />
           <button 
             onClick={() => { setReplyText(''); onClose(); }}
             className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${replyText.trim() ? 'bg-white text-black scale-105 shadow-md' : 'bg-transparent text-white/50'}`}
           >
             <Send className="w-4 h-4 transform translate-x-[1px] -translate-y-[1px]" strokeWidth={2.5}/>
           </button>
         </div>
      </div>
    </div>
  );
};

const MomentViewer = ({ moments, initialUserIndex, onClose, t, isDark }) => {
  const [currentUserIndex, setCurrentUserIndex] = React.useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [showHeartPop, setShowHeartPop] = React.useState(false);
  const [showViewers, setShowViewers] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  
  const timerRef = React.useRef(null);
  const startTimeRef = React.useRef(Date.now());
  const pausedProgressRef = React.useRef(0);
  const updateInterval = 16; 

  const currentUser = moments[currentUserIndex];
  const mediaItems = currentUser?.items.filter(i => i.type !== 'note') || [];
  const currentItem = mediaItems[currentStoryIndex];

  React.useEffect(() => {
    if (mediaItems.length === 0) {
       if (currentUserIndex < moments.length - 1) setCurrentUserIndex(prev => prev + 1);
       else onClose();
       return;
    }
    if (!currentItem) return;
    
    if (!isPaused && !showViewers && !showOptionsMenu) {
      startTimeRef.current = Date.now() - (pausedProgressRef.current / 100 * currentItem.duration);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / currentItem.duration) * 100;
        if (newProgress >= 100) handleNext();
        else setProgress(newProgress);
      }, updateInterval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pausedProgressRef.current = progress;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentUserIndex, currentStoryIndex, isPaused, showViewers, showOptionsMenu, currentItem, mediaItems.length]);

  const handleNext = () => {
    setHasLiked(false); setProgress(0); pausedProgressRef.current = 0;
    if (currentStoryIndex < mediaItems.length - 1) setCurrentStoryIndex(prev => prev + 1);
    else if (currentUserIndex < moments.length - 1) { setCurrentUserIndex(prev => prev + 1); setCurrentStoryIndex(0); }
    else onClose();
  };

  const handlePrev = () => {
    setHasLiked(false); setProgress(0); pausedProgressRef.current = 0;
    if (currentStoryIndex > 0) setCurrentStoryIndex(prev => prev - 1);
    else if (currentUserIndex > 0) { setCurrentUserIndex(prev => prev - 1); setCurrentStoryIndex(moments[currentUserIndex - 1].items.filter(i => i.type !== 'note').length - 1 || 0); }
    else setProgress(0); 
  };

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!hasLiked) {
      setHasLiked(true); setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    } else setHasLiked(false);
  };

  if (!currentItem) return null;

  const displayedLikes = hasLiked ? currentItem.reactions + 1 : currentItem.reactions;
  const displayedViews = currentItem.reactions * 14 + 52 + (hasLiked ? 1 : 0); 

  return (
    <div className={`absolute inset-0 z-[100] ${t.bg} overflow-hidden flex flex-col justify-center py-2 animate-scale-up origin-center transition-colors duration-500`}>
      <div className="w-full max-w-[430px] mx-auto aspect-[9/16] bg-[#121212] overflow-hidden relative shadow-2xl transition-transform duration-300 rounded-[8px]">
        {currentItem.type === 'image' && (
          <img src={currentItem.url} alt="Moment" className="w-full h-full object-cover" draggable={false} />
        )}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full pt-4 px-4 pb-4 flex flex-col z-20 shrink-0">
          <div className="flex space-x-1.5 w-full mb-3">
            {mediaItems.map((_, idx) => (
              <div key={idx} className={`h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden transition-colors`}>
                <div 
                  className={`h-full bg-white rounded-full transition-all ease-linear`}
                  style={{ 
                    width: idx === currentStoryIndex ? `${progress}%` : idx < currentStoryIndex ? '100%' : '0%',
                    transitionDuration: idx === currentStoryIndex && !isPaused && !showViewers ? `${updateInterval}ms` : '0ms'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden transition-colors shadow-sm`}>
                 <User className={`w-6 h-6 text-white`} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className={`text-[14px] font-semibold text-white drop-shadow-md`}>{currentUser.user.name}</span>
                  {currentUser.user.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0]" strokeWidth={3} />}
                  <span className={`text-[12px] font-light ml-1 text-white/90 drop-shadow-md`}>• 4h</span>
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-wider text-white/80 drop-shadow-md mt-0.5`}>{currentUser.user.role}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(true); setIsPaused(true); }} className={`w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all shadow-sm`}>
                <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button onClick={onClose} className={`w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all shadow-sm`}>
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-56 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full px-4 pt-6 pb-4 z-20 flex flex-col justify-end space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full cursor-pointer active:scale-95 transition-transform" onClick={() => { setShowViewers(true); setIsPaused(true); }}>
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-500 border border-[#121212] flex items-center justify-center overflow-hidden shadow-sm">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                 ))}
               </div>
               <span className="text-xs font-medium text-white drop-shadow-md pr-1">{displayedViews}</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <button onClick={handleLike} className="p-2 flex items-center justify-center active:scale-[0.7] transition-transform duration-300 ease-spring">
                <Heart className={`w-8 h-8 transition-colors duration-300 ${hasLiked ? 'text-[#1D9BF0] fill-[#1D9BF0]' : 'text-white'}`} strokeWidth={hasLiked ? 0 : 2.5} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }} />
              </button>
              <span className="text-[12px] font-medium text-white drop-shadow-md">{displayedLikes}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full pl-5 pr-2 py-2 border border-white/20 shadow-lg">
             <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)} placeholder={`Send message...`} className="flex-1 bg-transparent text-white placeholder:text-white/80 font-light text-[14px] focus:outline-none" />
             <button onClick={() => { setReplyText(''); }} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${replyText.trim() ? 'bg-white text-black scale-105 shadow-md' : 'bg-transparent text-white/60'}`}>
               <Send className="w-4 h-4 transform translate-x-[1px] -translate-y-[1px]" strokeWidth={2.5}/>
             </button>
          </div>
        </div>

        <div className="absolute top-24 bottom-32 left-0 w-[40%] z-10 cursor-pointer" onClick={handlePrev} onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} onTouchStart={handleInteractionStart} onTouchEnd={handleInteractionEnd} />
        <div className="absolute top-24 bottom-32 right-0 w-[60%] z-10 cursor-pointer" onClick={handleNext} onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} onTouchStart={handleInteractionStart} onTouchEnd={handleInteractionEnd} />

        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="w-24 h-24 text-[#1D9BF0] fill-[#1D9BF0] animate-heart-fly" style={{ filter: 'drop-shadow(0px 10px 20px rgba(29, 155, 240, 0.4))' }} />
          </div>
        )}

        {showViewers && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowViewers(false); setIsPaused(false); }} />
            <div className={`relative ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl max-h-[65%] w-full flex flex-col animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10`} onClick={(e) => e.stopPropagation()}>
               <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-4 mb-2 shrink-0`}></div>
               <div className={`px-5 py-3 border-b ${isDark ? 'border-white/10' : 'border-black/5'} flex justify-between items-center`}>
                 <h3 className={`font-semibold text-lg ${t.text}`}>Viewers</h3>
                 <span className={`text-sm font-medium ${t.textMuted}`}>{displayedViews} views</span>
               </div>
               <div className="overflow-y-auto px-3 py-2 space-y-1 mb-4 flex-1 hide-scrollbar">
                 {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                       <div className="flex items-center space-x-3">
                         <div className={`w-11 h-11 rounded-full ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-200'} border ${isDark ? 'border-white/10' : 'border-black/5'} flex items-center justify-center overflow-hidden`}>
                           <User className={`w-6 h-6 ${t.textMuted}`} />
                         </div>
                         <div className="flex flex-col">
                           <span className={`font-medium text-[13px] ${t.text}`}>User_{Math.floor(Math.random() * 900) + 100}</span>
                           <span className={`text-[11px] font-light ${t.textMuted}`}>{Math.floor(Math.random() * 59) + 1}m ago</span>
                         </div>
                       </div>
                       {i % 3 !== 0 && <Heart className="w-5 h-5 text-[#1D9BF0] fill-[#1D9BF0] drop-shadow-sm" />}
                    </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {showOptionsMenu && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(false); setIsPaused(false); }} />
            <div className={`relative ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl w-full flex flex-col animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10 pb-8`} onClick={(e) => e.stopPropagation()}>
               <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-4 mb-2 shrink-0`}></div>
               <div className="px-6 py-2 flex flex-col">
                 <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Share Moment</button>
                 <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Copy Link</button>
                 <button className={`w-full py-4 text-left font-medium text-[15px] ${t.text} border-b ${isDark ? 'border-white/10' : 'border-black/5'} active:scale-95 transition-transform`}>Mute {currentUser.user.name}</button>
                 <button className={`w-full py-4 text-left font-medium text-[15px] text-red-500 active:scale-95 transition-transform`}>Report</button>
                 <button onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(false); setIsPaused(false); }} className={`w-full py-3.5 text-center font-semibold text-[15px] ${isDark ? 'bg-[#2A2A2A] text-white' : 'bg-gray-100 text-black'} rounded-2xl mt-4 active:scale-95 transition-transform`}>Cancel</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CreateMomentSheet = ({ onClose, t, isDark }) => {
  const [step, setStep] = React.useState('select'); 
  const [noteText, setNoteText] = React.useState('');
  
  const handlePost = () => { setTimeout(() => { onClose(); }, 500); };

  return (
    <>
      <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className={`absolute bottom-0 left-0 w-full ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-t-3xl shadow-2xl z-[100] animate-slide-up flex flex-col max-h-[90vh] pb-8`}>
        <div className={`w-12 h-1.5 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mx-auto mt-3 mb-4 shrink-0`}></div>
        
        {step === 'select' && (
          <div className="px-6 flex flex-col pb-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-semibold ${t.text}`}>Create Moment</h3>
              <button onClick={onClose} className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center active:scale-95`}><X className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div onClick={() => setStep('compose_media')} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${t.card} border ${t.borderSoft} shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                 <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3"><Camera className="w-6 h-6" strokeWidth={2.5} /></div>
                 <span className={`text-[11px] font-semibold ${t.text}`}>Camera</span>
               </div>
               <div onClick={() => setStep('compose_media')} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${t.card} border ${t.borderSoft} shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3"><ImageIcon className="w-6 h-6" strokeWidth={2.5} /></div>
                 <span className={`text-[11px] font-semibold ${t.text}`}>Photo/Video</span>
               </div>
               <div onClick={() => setStep('compose_note')} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${t.card} border ${t.borderSoft} shadow-sm active:scale-95 transition-transform cursor-pointer`}>
                 <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3"><Type className="w-6 h-6" strokeWidth={2.5} /></div>
                 <span className={`text-[11px] font-semibold ${t.text}`}>Text Note</span>
               </div>
            </div>
            <p className={`text-[10px] font-medium ${t.textMuted} text-center mt-6`}>Moments disappear after 24 hours.</p>
          </div>
        )}

        {step === 'compose_note' && (
          <div className="px-6 flex flex-col pb-4 h-[50vh]">
             <div className="flex justify-between items-center mb-6">
              <button onClick={() => setStep('select')} className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95`}><ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} /></button>
              <h3 className={`text-base font-semibold ${t.text}`}>Share a Note</h3>
              <div className="w-8"></div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
               <div className={`relative w-full max-w-[280px] p-6 rounded-3xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} shadow-inner mb-6`}>
                 <textarea autoFocus maxLength={60} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Share a thought..." className={`w-full bg-transparent text-center text-xl font-light ${t.text} placeholder:${t.textMuted} resize-none focus:outline-none`} rows={3} />
                 <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 ${isDark ? 'bg-[#333333]' : 'bg-gray-100'}`}></div>
               </div>
               <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-2 flex items-center justify-center shadow-lg relative z-10`}><User className={`w-8 h-8 ${t.textMuted}`} /></div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4">
              <span className={`text-[11px] font-medium ${noteText.length === 60 ? 'text-red-500' : t.textMuted}`}>{noteText.length}/60</span>
              <button disabled={!noteText.trim()} onClick={handlePost} className={`px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 ${noteText.trim() ? 'bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40' : `${isDark ? 'bg-gray-700' : 'bg-gray-300'} text-gray-500 cursor-not-allowed`}`}>Share</button>
            </div>
          </div>
        )}

        {step === 'compose_media' && (
          <div className="px-6 flex flex-col pb-4 h-[60vh]">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setStep('select')} className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95`}><ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} /></button>
              <h3 className={`text-base font-semibold ${t.text}`}>Preview</h3>
              <div className="w-8"></div>
            </div>
            <div className={`flex-1 rounded-3xl ${isDark ? 'bg-[#121212]' : 'bg-gray-200'} flex items-center justify-center overflow-hidden relative mb-4`}>
               <ImageIcon className="w-12 h-12 text-gray-400" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                 <span className="text-white font-medium text-sm">Tap to change media</span>
               </div>
            </div>
            <button onClick={handlePost} className={`w-full h-14 rounded-xl font-semibold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40 flex items-center justify-center`}>Post Moment</button>
          </div>
        )}
      </div>
    </>
  );
};

// --- EVENTS MODULE COMPONENTS ---

const EventStatusBadge = ({ status, isDark }) => {
  if (status === 'Open') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20">Open</span>;
  if (status === 'Closing Soon') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Closing Soon</span>;
  if (status === 'Registered') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20 flex items-center"><CheckCircle2 className="w-2.5 h-2.5 mr-1" strokeWidth={3}/>Registered</span>;
  if (status === 'Closed') return <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10'}`}>Closed</span>;
  if (status === 'Free Entry') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free Entry</span>;
  if (status === 'Cancelled') return <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Cancelled</span>;
  return null;
};

const EventCategoryChip = ({ category, selected, onClick, t, isDark }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border shrink-0 ${
      selected ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm' : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`
    }`}
  >
    {category}
  </button>
);

const EventCard = ({ event, variant = 'standard', t, isDark, onClick, registeredEventIds }) => {
  const isRegistered = registeredEventIds.has(event.id);
  const displayStatus = isRegistered ? 'Registered' : event.registrationStatus;
  const isPast = new Date(event.date) < EVENTS_REFERENCE_DATE;

  const dateObj = new Date(event.date);
  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
  const dayStr = dateObj.getDate();

  if (variant === 'compact') {
    return (
      <div onClick={() => onClick(event)} className={`p-4 rounded-2xl ${t.card} border ${t.border} shadow-sm active:scale-[0.98] transition-transform cursor-pointer flex items-center space-x-4`}>
        <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 relative ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          {isPast && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]"><span className="text-[8px] font-extrabold text-white uppercase tracking-wider">Past</span></div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[10px] font-extrabold text-[#1D9BF0] uppercase tracking-wider`}>{monthStr} {dayStr} • {event.time}</span>
            <EventStatusBadge status={displayStatus} isDark={isDark} />
          </div>
          <h4 className={`text-sm font-extrabold ${t.text} truncate mb-0.5`}>{event.title}</h4>
          <p className={`text-[11px] font-bold ${t.textMuted} truncate flex items-center`}><MapPin className="w-3 h-3 mr-1 shrink-0" strokeWidth={2.5}/> {event.venue}</p>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal' || variant === 'recommended') {
    return (
      <div onClick={() => onClick(event)} className={`w-[260px] shrink-0 rounded-2xl ${t.card} border ${t.border} shadow-sm active:scale-[0.98] transition-transform cursor-pointer overflow-hidden flex flex-col`}>
        {variant === 'recommended' && event.recommendationReason && (
          <div className={`px-4 py-2 ${isDark ? 'bg-white/5 border-b border-white/5' : 'bg-black/5 border-b border-black/5'}`}>
            <span className={`text-[10px] font-extrabold ${t.text} uppercase tracking-wider flex items-center`}>
              <Sparkles className="w-3 h-3 mr-1.5 text-amber-500" strokeWidth={2.5} /> {event.recommendationReason}
            </span>
          </div>
        )}
        <div className="h-28 w-full relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex flex-col items-center border border-white/10">
            <span className="text-white text-[10px] font-extrabold uppercase leading-tight">{monthStr}</span>
            <span className="text-white text-sm font-black leading-none">{dayStr}</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h4 className={`text-base font-extrabold ${t.text} line-clamp-2 leading-tight mb-1`}>{event.title}</h4>
          <div className="flex items-center space-x-1.5 mb-3">
             <span className={`text-[11px] font-bold ${t.textMuted} truncate`}>{event.organizer.name}</span>
             {event.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
          </div>
          <div className="mt-auto flex justify-between items-center">
            <EventStatusBadge status={displayStatus} isDark={isDark} />
            <span className={`text-[10px] font-extrabold ${t.textMuted}`}>{event.goingCount} going</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onClick(event)} className={`rounded-2xl overflow-hidden ${t.card} border ${t.border} shadow-sm active:scale-[0.98] transition-transform cursor-pointer flex flex-col`}>
      <div className="h-36 w-full relative">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3">
           <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">{event.category}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex items-center text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            <span className="text-[11px] font-extrabold tracking-wide">{monthStr} {dayStr}, {event.time}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`text-lg font-extrabold ${t.text} leading-tight line-clamp-2 pr-2`}>{event.title}</h3>
        </div>
        <div className="flex items-center space-x-1.5 mb-3">
           <span className={`text-xs font-bold ${t.textMuted} truncate`}>{event.organizer.name}</span>
           {event.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
        </div>
        <div className="flex items-center space-x-4 mb-4">
           <div className={`flex items-center text-[11px] font-bold ${t.textMuted}`}><MapPin className="w-3.5 h-3.5 mr-1" strokeWidth={2.5}/> <span className="truncate max-w-[120px]">{event.venue}</span></div>
           <div className={`flex items-center text-[11px] font-bold ${t.textMuted}`}><UsersRound className="w-3.5 h-3.5 mr-1" strokeWidth={2.5}/> {event.goingCount} going</div>
        </div>
        <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/5'} flex justify-between items-center`}>
          <EventStatusBadge status={displayStatus} isDark={isDark} />
          <button className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center hover:bg-[#1D9BF0] hover:text-white transition-colors`}>
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedEventsCarousel = ({ events, onEventClick, t, isDark, registeredEventIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (isPaused || dragStartX !== null || events.length === 0) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % events.length), 5000);
    return () => clearInterval(interval);
  }, [isPaused, dragStartX, events.length]);

  if (events.length === 0) return null;

  const handleDragEnd = () => {
    if (dragStartX === null) return;
    setIsPaused(false);
    if (dragOffset < -50) setCurrentIndex((prev) => (prev + 1) % events.length);
    else if (dragOffset > 50) setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setDragStartX(null); setDragOffset(0);
  };

  return (
    <div className="w-full relative z-10 mb-6">
      <div 
        className={`relative w-full h-[240px] rounded-[24px] overflow-hidden border ${isDark ? 'border-white/10' : 'border-black/5'} shadow-lg touch-pan-y select-none`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); if (dragStartX !== null) handleDragEnd(); }}
        onMouseDown={(e) => { setIsPaused(true); setDragStartX(e.clientX); }}
        onMouseMove={(e) => { if (dragStartX !== null) setDragOffset(e.clientX - dragStartX); }}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => { setIsPaused(true); setDragStartX(e.touches[0].clientX); }}
        onTouchMove={(e) => { if (dragStartX !== null) setDragOffset(e.touches[0].clientX - dragStartX); }}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` }}>
          {events.map((ev, idx) => {
             const isRegistered = registeredEventIds.has(ev.id);
             return (
              <div key={idx} className="w-full h-full shrink-0 relative cursor-pointer" onClick={() => onEventClick(ev)}>
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">{ev.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                  <h3 className="text-white text-xl font-extrabold leading-tight mb-1.5 line-clamp-2 drop-shadow-md">{ev.title}</h3>
                  <div className="flex items-center space-x-1.5 mb-3 text-white/90">
                    <span className="text-xs font-bold truncate max-w-[200px]">{ev.organizer.name}</span>
                    {ev.organizer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col space-y-1.5">
                       <div className="flex items-center text-white/80 text-[11px] font-bold">
                         <CalendarDays className="w-3 h-3 mr-1.5" strokeWidth={2.5} /> {new Date(ev.date).toLocaleDateString('en-US', {month:'short', day:'numeric'})} • {ev.time}
                       </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-[#1D9BF0] text-white text-xs font-extrabold active:scale-95 transition-transform shadow-md" onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}>
                      {isRegistered || ev.registrationStatus === 'Closed' ? 'Details' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center space-x-1.5 mt-3">
         {events.map((_, idx) => (
           <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-4 bg-[#1D9BF0]' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}/>
         ))}
      </div>
    </div>
  );
};

// --- EVENTS SUB-SCREENS ---

const EventsHomeScreen = ({ navigateTo, events, t, isDark, registeredEventIds }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Academic', 'Workshop', 'Competition', 'Career', 'Recruitment', 'Networking', 'Research', 'Cultural', 'Sports', 'Volunteer'];
  
  const upcomingEvents = events.filter(e => new Date(e.date) >= EVENTS_REFERENCE_DATE).sort((a,b) => new Date(a.date) - new Date(b.date));
  const featuredEvents = upcomingEvents.filter(e => e.featured);
  const recommendedEvents = upcomingEvents.filter(e => e.recommendationReason);
  const popularEvents = upcomingEvents.filter(e => e.popular).sort((a,b) => b.goingCount - a.goingCount);
  
  const closingSoonCount = upcomingEvents.filter(e => e.registrationStatus === 'Closing Soon').length;

  const displayUpcoming = upcomingEvents.filter(e => activeCategory === 'All' || e.category === activeCategory).slice(0, 4);
  const displayRecommended = recommendedEvents.filter(e => activeCategory === 'All' || e.category === activeCategory);

  const searchResults = searchQuery.trim() 
    ? events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-32 animate-fade-in relative z-10">
        {/* Sticky Header */}
        <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-50 shadow-sm`}>
          <div className="flex items-center">
            <button onClick={() => navigateTo('close')} className={`mr-3 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="Close Events">
              <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
            </button>
            <h2 className={`text-xl font-extrabold ${t.text} tracking-tight`}>Events</h2>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => navigateTo('calendar')} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="Open Calendar">
              <CalendarDays className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
            </button>
            <button onClick={() => navigateTo('my_events')} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="My Events">
              <BookmarkIcon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="px-5 pt-5 pb-6">
          {/* Search */}
          <div className="relative w-full mb-5">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, organizers..." 
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 pl-10 pr-10 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} hover:${t.text}`} aria-label="Clear Search">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {searchQuery.trim() ? (
            <div className="animate-fade-in space-y-4">
               <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-2`}>Search Results ({searchResults.length})</h3>
               {searchResults.length > 0 ? (
                 searchResults.map(ev => <EventCard key={ev.id} event={ev} variant="compact" t={t} isDark={isDark} onClick={(e) => navigateTo('details', e)} registeredEventIds={registeredEventIds}/>)
               ) : (
                 <div className="flex flex-col items-center justify-center py-10 opacity-60">
                   <Search className="w-10 h-10 mb-3" strokeWidth={1.5} />
                   <p className="text-sm font-bold">No events found for "{searchQuery}"</p>
                 </div>
               )}
            </div>
          ) : (
            <>
              {/* Deadline Alert */}
              {closingSoonCount > 0 && (
                <div className={`mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between`}>
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={2.5} />
                    <p className={`text-[11px] font-extrabold text-amber-600 dark:text-amber-400 leading-tight`}>{closingSoonCount} registration{closingSoonCount > 1 ? 's close' : ' closes'} soon</p>
                  </div>
                  <button onClick={() => navigateTo('browse', { filter: 'Closing Soon' })} className={`px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-extrabold active:scale-95 transition-transform shrink-0 shadow-sm`}>View</button>
                </div>
              )}

              <FeaturedEventsCarousel events={featuredEvents} onEventClick={(e) => navigateTo('details', e)} t={t} isDark={isDark} registeredEventIds={registeredEventIds}/>

              <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-5 px-5 mb-8">
                {categories.map(cat => (
                  <EventCategoryChip key={cat} category={cat} selected={activeCategory === cat} onClick={() => setActiveCategory(cat)} t={t} isDark={isDark} />
                ))}
              </div>

              {/* Upcoming Events */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>Upcoming Events</h3>
                  <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => navigateTo('browse', { category: activeCategory })}>See All</button>
                </div>
                <div className="space-y-4">
                  {displayUpcoming.length > 0 ? (
                    displayUpcoming.map(ev => (
                      <EventCard key={ev.id} event={ev} variant="standard" t={t} isDark={isDark} onClick={(e) => navigateTo('details', e)} registeredEventIds={registeredEventIds} />
                    ))
                  ) : (
                    <div className={`p-6 rounded-2xl border border-dashed ${t.borderSoft} text-center opacity-60`}>
                      <p className={`text-xs font-bold ${t.textMuted}`}>No upcoming events in this category.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended For You */}
              {displayRecommended.length > 0 && (
                <div className="mb-8">
                  <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Recommended For You</h3>
                  <div className="flex space-x-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
                    {displayRecommended.map(ev => (
                      <EventCard key={ev.id} event={ev} variant="recommended" t={t} isDark={isDark} onClick={(e) => navigateTo('details', e)} registeredEventIds={registeredEventIds} />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular This Week */}
              <div className="mb-6">
                <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Popular This Week</h3>
                <div className={`rounded-2xl ${t.card} border ${t.border} overflow-hidden shadow-sm`}>
                  {popularEvents.slice(0, 3).map((ev, idx) => (
                    <div key={ev.id} onClick={() => navigateTo('details', ev)} className={`flex items-center p-4 border-b ${t.borderSoft} last:border-0 hover:${isDark ? 'bg-white/5' : 'bg-black/5'} transition-colors cursor-pointer group active:scale-[0.99]`}>
                       <div className="w-6 font-black text-xl text-[#1D9BF0]/40 mr-3 text-center">{idx + 1}</div>
                       <div className="flex-1 min-w-0 pr-4">
                         <h4 className={`text-sm font-extrabold ${t.text} truncate mb-0.5 group-hover:text-[#1D9BF0] transition-colors`}>{ev.title}</h4>
                         <div className="flex items-center space-x-2">
                           <span className={`text-[10px] font-bold ${t.textMuted}`}>{new Date(ev.date).toLocaleDateString('en-US', {month:'short', day:'numeric'})}</span>
                           <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                           <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{ev.organizer.name}</span>
                         </div>
                       </div>
                       <div className="flex flex-col items-end shrink-0">
                         <span className={`text-[10px] font-extrabold ${t.text} mb-1`}>{ev.goingCount} Going</span>
                         <ChevronRight className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Events Link */}
              <button 
                onClick={() => navigateTo('browse', { filter: 'Past' })}
                className={`w-full py-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border border-transparent hover:${t.borderSoft} text-center transition-all active:scale-[0.98] flex items-center justify-center space-x-2`}
              >
                <Archive className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5}/>
                <span className={`text-sm font-extrabold ${t.textMuted}`}>View Past Events</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => navigateTo('create')}
        className="absolute bottom-6 right-5 w-14 h-14 bg-[#1D9BF0] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1D9BF0]/40 active:scale-95 transition-transform z-50"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>
    </>
  );
};

const EventsBrowseScreen = ({ navigateTo, events, initialParams, t, isDark, registeredEventIds }) => {
  const [filter, setFilter] = useState(initialParams?.filter || 'All');
  const [category, setCategory] = useState(initialParams?.category || 'All');
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  let displayed = events;

  if (filter === 'Closing Soon') displayed = displayed.filter(e => e.registrationStatus === 'Closing Soon');
  else if (filter === 'Past') displayed = displayed.filter(e => new Date(e.date) < EVENTS_REFERENCE_DATE);
  else if (filter === 'Upcoming') displayed = displayed.filter(e => new Date(e.date) >= EVENTS_REFERENCE_DATE);

  if (category !== 'All') displayed = displayed.filter(e => e.category === category);
  
  if (search.trim()) {
    displayed = displayed.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.organizer.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (filter !== 'Past') {
    displayed.sort((a,b) => new Date(a.date) - new Date(b.date));
  } else {
    displayed.sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in relative z-10">
      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b z-20 shadow-sm shrink-0`}>
        <div className="flex items-center">
          <button onClick={() => navigateTo('home')} className={`mr-3 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="Back">
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h2 className={`text-lg font-extrabold ${t.text} leading-tight`}>Browse Events</h2>
            <span className={`text-[10px] font-bold ${t.textMuted}`}>{displayed.length} results</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-5 pt-5 relative z-10">
        <div className="flex space-x-2 mb-5">
           <div className="relative flex-1">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
              <input 
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." 
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
              />
           </div>
           <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`w-11 h-11 rounded-xl ${t.card} border ${t.borderSoft} flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95`}>
             <SlidersHorizontal className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
           </button>
        </div>

        {isFilterOpen && (
          <div className={`p-4 rounded-2xl ${t.card} border ${t.border} mb-5 shadow-sm animate-fade-in-up`}>
            <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-3`}>Status Filter</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Upcoming', 'Closing Soon', 'Past'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${filter === f ? 'bg-[#1D9BF0] text-white border-[#1D9BF0]' : `${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}`}>
                  {f}
                </button>
              ))}
            </div>
            <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-3`}>Category</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Academic', 'Workshop', 'Competition', 'Career', 'Cultural'].map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all ${category === c ? 'bg-[#1D9BF0] text-white border-[#1D9BF0]' : `${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayed.length > 0 ? (
            displayed.map(ev => <EventCard key={ev.id} event={ev} variant="compact" t={t} isDark={isDark} onClick={(e) => navigateTo('details', e)} registeredEventIds={registeredEventIds} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
              <ListFilter className="w-12 h-12 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-bold">No events match these filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventsCalendarScreen = ({ navigateTo, events, t, isDark }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); 

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    
    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: daysInPrevMonth - firstDay + i + 1, isCurrentMonth: false, dateStr: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - firstDay + i + 1).padStart(2, '0')}` });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }
    const remainingCells = 42 - days.length; 
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
    }
    return days;
  };

  const calendarDays = generateCalendar();
  const [selectedDateStr, setSelectedDateStr] = useState('2026-07-12');

  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in relative z-10">
      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b z-20 shadow-sm shrink-0`}>
        <div className="flex items-center">
          <button onClick={() => navigateTo('home')} className={`mr-3 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="Back">
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-lg font-extrabold ${t.text} leading-tight`}>Calendar</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-5 pt-5 relative z-10">
        <div className={`p-5 rounded-3xl ${t.card} border ${t.border} shadow-sm mb-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-extrabold ${t.text}`}>{currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-95 transition-transform`}><ArrowLeft className="w-4 h-4" strokeWidth={2.5}/></button>
              <button onClick={handleNextMonth} className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} active:scale-95 transition-transform`}><ChevronRight className="w-4 h-4" strokeWidth={2.5}/></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className={`text-center text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => {
              const dayEvents = events.filter(e => e.date === d.dateStr);
              const isSelected = selectedDateStr === d.dateStr;
              const isToday = d.dateStr === '2026-07-12';

              return (
                <div 
                  key={i} 
                  onClick={() => d.isCurrentMonth && setSelectedDateStr(d.dateStr)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl relative cursor-pointer transition-all active:scale-95 ${
                    !d.isCurrentMonth ? 'opacity-30 pointer-events-none' : 
                    isSelected ? 'bg-[#1D9BF0] text-white shadow-md' : 
                    isToday ? `border-2 border-[#1D9BF0] ${t.text}` :
                    `hover:${isDark ? 'bg-white/10' : 'bg-black/5'} ${t.text}`
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : ''}`}>{d.day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex space-x-0.5 absolute bottom-1.5">
                      {dayEvents.slice(0, 3).map((_, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1D9BF0]'}`}></div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>
          Events on {new Date(selectedDateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h3>
        <div className="space-y-4">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map(ev => <EventCard key={ev.id} event={ev} variant="compact" t={t} isDark={isDark} onClick={() => navigateTo('details', ev)} registeredEventIds={new Set()} />)
          ) : (
            <div className={`p-6 rounded-2xl border border-dashed ${t.borderSoft} text-center opacity-60`}>
              <p className={`text-xs font-bold ${t.textMuted}`}>No events scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyEventsScreen = ({ navigateTo, events, t, isDark, registeredEventIds, goingEventIds, interestedEventIds }) => {
  const [segment, setSegment] = useState('Going');

  let displayed = [];
  if (segment === 'Going') displayed = events.filter(e => goingEventIds.has(e.id));
  if (segment === 'Interested') displayed = events.filter(e => interestedEventIds.has(e.id));
  if (segment === 'Registered') displayed = events.filter(e => registeredEventIds.has(e.id));
  if (segment === 'Past') displayed = events.filter(e => new Date(e.date) < EVENTS_REFERENCE_DATE && (goingEventIds.has(e.id) || registeredEventIds.has(e.id)));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in relative z-10">
      <div className={`px-4 pt-12 pb-3 flex flex-col justify-end ${t.glass} border-b z-20 shadow-sm shrink-0`}>
        <div className="flex items-center mb-4">
          <button onClick={() => navigateTo('home')} className={`mr-3 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 outline-none`} aria-label="Back">
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-lg font-extrabold ${t.text} leading-tight`}>My Events</h2>
        </div>
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
          {['Going', 'Interested', 'Registered', 'Past'].map(s => (
            <button 
              key={s} 
              onClick={() => setSegment(s)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all border shrink-0 ${segment === s ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm' : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-5 pt-5 relative z-10">
        <h3 className={`text-sm font-extrabold ${t.textMuted} uppercase tracking-wider mb-4`}>{segment} ({displayed.length})</h3>
        <div className="space-y-4">
          {displayed.length > 0 ? (
            displayed.map(ev => <EventCard key={ev.id} event={ev} variant="compact" t={t} isDark={isDark} onClick={() => navigateTo('details', ev)} registeredEventIds={registeredEventIds} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
              <BookmarkIcon className="w-12 h-12 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-bold text-center">No events in this category.</p>
              {segment !== 'Past' && (
                <button onClick={() => navigateTo('browse')} className="mt-4 text-[#1D9BF0] font-extrabold text-sm hover:underline">Browse Events</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventDetailsScreen = ({ 
  event, navigateTo, onBack, t, isDark, setToastMsg,
  registeredEventIds, setRegisteredEventIds,
  goingEventIds, setGoingEventIds,
  interestedEventIds, setInterestedEventIds,
  reminderEventIds, setReminderEventIds,
  followedOrganizerIds, setFollowedOrganizerIds,
  allEvents
}) => {
  const isRegistered = registeredEventIds.has(event.id);
  const isGoing = goingEventIds.has(event.id);
  const isInterested = interestedEventIds.has(event.id);
  const hasReminder = reminderEventIds.has(event.id);
  const isFollowingOrg = followedOrganizerIds.has(event.organizer.id);
  const isPast = new Date(event.date) < EVENTS_REFERENCE_DATE;

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const displayStatus = isRegistered ? 'Registered' : event.registrationStatus;

  const handleRegisterToggle = () => {
    if (isPast || displayStatus === 'Closed' || displayStatus === 'Cancelled') return;
    setRegisteredEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); setToastMsg("Registration cancelled"); } 
      else { next.add(event.id); setToastMsg("Successfully registered!"); }
      return next;
    });
  };

  const handleGoingToggle = () => {
    setGoingEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); setToastMsg("Removed from Going"); } 
      else { next.add(event.id); setToastMsg("Marked as Going"); }
      return next;
    });
  };

  const handleInterestedToggle = () => {
    setInterestedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); setToastMsg("Removed from Interested"); } 
      else { next.add(event.id); setToastMsg("Added to Interested"); }
      return next;
    });
  };

  const handleReminderToggle = () => {
    setReminderEventIds(prev => {
      const next = new Set(prev);
      if (next.has(event.id)) { next.delete(event.id); setToastMsg("Reminder disabled"); } 
      else { next.add(event.id); setToastMsg("Reminder enabled"); }
      return next;
    });
  };

  const handleFollowOrg = () => {
    setFollowedOrganizerIds(prev => {
      const next = new Set(prev);
      if (next.has(event.organizer.id)) { next.delete(event.organizer.id); setToastMsg("Organizer unfollowed"); } 
      else { next.add(event.organizer.id); setToastMsg("Organizer followed"); }
      return next;
    });
  };

  const relatedEvents = allEvents.filter(e => e.id !== event.id && (e.category === event.category || e.organizer.id === event.organizer.id)).slice(0, 3);

  let primaryActionLabel = "Register";
  let primaryActionState = "active"; 
  if (displayStatus === 'Cancelled') { primaryActionLabel = "Event Cancelled"; primaryActionState = "disabled"; }
  else if (isPast) { primaryActionLabel = "Event Ended"; primaryActionState = "disabled"; }
  else if (isRegistered) { primaryActionLabel = "Registered"; primaryActionState = "success"; }
  else if (displayStatus === 'Free Entry') { primaryActionLabel = isGoing ? "Going" : "Mark as Going"; primaryActionState = isGoing ? "success" : "active"; }
  else if (displayStatus === 'Closed') { primaryActionLabel = "Registration Closed"; primaryActionState = "disabled"; }
  else if (displayStatus === 'Closing Soon') { primaryActionLabel = "Register Now"; primaryActionState = "danger"; }

  const handlePrimaryClick = () => {
    if (primaryActionState === 'disabled') return;
    if (displayStatus === 'Free Entry') handleGoingToggle();
    else handleRegisterToggle();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in relative z-10">
      {/* Hero Header */}
      <div className="relative w-full h-[260px] shrink-0">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
        <div className="absolute top-0 w-full px-4 pt-12 flex justify-between z-20">
          <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white transition-colors active:scale-95 outline-none`} aria-label="Back">
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <button onClick={handleInterestedToggle} className={`w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/20 transition-colors active:scale-95 outline-none ${isInterested ? 'text-red-500' : 'text-white'}`} aria-label="Interested">
            <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#1D9BF0] text-white shadow-sm">{event.category}</span>
            <EventStatusBadge status={displayStatus} isDark={true} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-5 space-y-6">
        <div>
          <h1 className={`text-2xl font-extrabold ${t.text} leading-tight tracking-tight mb-2`}>{event.title}</h1>
          <div className="flex items-center space-x-2">
             <span className={`text-sm font-bold ${t.textMuted}`}>{event.organizer.name}</span>
             {event.organizer.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0]" strokeWidth={2.5} />}
             <span className="w-1 h-1 rounded-full bg-gray-400"></span>
             <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{event.organizer.type}</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} space-y-4`}>
          <div className="flex items-start space-x-3">
             <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} flex items-center justify-center shrink-0`}>
               <CalendarDays className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
             </div>
             <div className="flex flex-col pt-0.5">
               <span className={`text-sm font-extrabold ${t.text}`}>{dateStr}</span>
               <span className={`text-xs font-bold ${t.textMuted} mt-0.5`}>{event.time} - {event.endTime}</span>
             </div>
          </div>
          <div className="flex items-start space-x-3">
             <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} flex items-center justify-center shrink-0`}>
               <MapPin className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
             </div>
             <div className="flex flex-col pt-0.5">
               <span className={`text-sm font-extrabold ${t.text}`}>{event.venue}</span>
               <span className={`text-xs font-bold ${t.textMuted} mt-0.5 leading-snug pr-2`}>{event.venueDetails}</span>
             </div>
          </div>
          {event.notificationType === 'cancelled' && (
            <div className="flex items-center space-x-2.5 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2.5} />
              <span className="text-xs font-bold text-red-600 dark:text-red-400">{event.notificationMessage}</span>
            </div>
          )}
        </div>

        {!isPast && event.registrationStatus !== 'Cancelled' && (
          <div className="flex space-x-3">
            <button 
              onClick={handlePrimaryClick}
              className={`flex-1 h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
                primaryActionState === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' :
                primaryActionState === 'danger' ? 'bg-amber-500 text-white shadow-amber-500/30 shadow-md' :
                primaryActionState === 'disabled' ? 'bg-gray-400 dark:bg-gray-700 text-white/70 cursor-not-allowed' :
                'bg-[#1D9BF0] text-white shadow-[#1D9BF0]/30 shadow-md'
              }`}
            >
              {primaryActionState === 'success' && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
              <span>{primaryActionLabel}</span>
            </button>
            <button 
              onClick={handleReminderToggle}
              className={`w-14 h-14 rounded-xl border ${t.border} ${t.card} flex items-center justify-center transition-colors active:scale-95 shrink-0 ${hasReminder ? 'border-[#1D9BF0] bg-[#1D9BF0]/10 text-[#1D9BF0]' : t.text}`}
              aria-label="Toggle Reminder"
            >
              <Bell className={`w-5 h-5 ${hasReminder ? 'fill-current' : ''}`} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-around py-4 border-y border-dashed border-gray-400/30">
          <div className="text-center">
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Going</p>
            <p className={`text-base font-extrabold ${t.text}`}>{event.goingCount}</p>
          </div>
          <div className="text-center">
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Interested</p>
            <p className={`text-base font-extrabold ${t.text}`}>{event.interestedCount}</p>
          </div>
          <div className="text-center">
            <p className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted} mb-1`}>Capacity</p>
            <p className={`text-base font-extrabold ${t.text}`}>{event.capacity}</p>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
          <p className={`text-sm font-medium ${t.text} leading-relaxed opacity-90`}>{event.description}</p>
        </div>

        {event.schedule && event.schedule.length > 0 && (
          <div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Schedule</h3>
            <div className={`p-5 rounded-2xl ${t.card} border ${t.border} shadow-sm space-y-4`}>
              {event.schedule.map((item, idx) => (
                <div key={idx} className="flex relative">
                  {idx !== event.schedule.length - 1 && (
                    <div className={`absolute left-[5px] top-6 bottom-[-16px] w-0.5 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                  )}
                  <div className="w-3 h-3 rounded-full bg-[#1D9BF0] border-4 border-transparent shrink-0 mt-1 z-10 transform -translate-x-[2px]"></div>
                  <div className="ml-4 flex flex-col">
                    <span className={`text-[10px] font-extrabold text-[#1D9BF0] uppercase tracking-wider mb-0.5`}>{item.time}</span>
                    <span className={`text-sm font-bold ${t.text}`}>{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-3`}>Registration Info</h3>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1A1A1A] border-white/10' : 'bg-gray-100 border-gray-200'} border`}>
             <p className={`text-sm font-bold ${t.text} mb-2 leading-relaxed`}>{event.registrationInfo}</p>
             {event.registrationDeadline && (
               <p className={`text-xs font-extrabold ${t.textMuted} flex items-center mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                 <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} /> Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
               </p>
             )}
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Organizer</h3>
          <div className={`p-5 rounded-2xl ${t.card} border ${t.border} shadow-sm flex flex-col`}>
             <div className="flex items-start justify-between mb-3">
               <div className="flex items-center space-x-3">
                 <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
                   <Building2 className={`w-6 h-6 ${t.textMuted}`} strokeWidth={1.5} />
                 </div>
                 <div className="flex flex-col">
                   <div className="flex items-center space-x-1.5 mb-0.5">
                     <h4 className={`text-base font-extrabold ${t.text} leading-tight`}>{event.organizer.name}</h4>
                     {event.organizer.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                   </div>
                   <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>{event.organizer.type}</span>
                 </div>
               </div>
             </div>
             <p className={`text-xs font-medium ${t.text} leading-relaxed opacity-90 mb-4`}>{event.organizer.description}</p>
             <button onClick={handleFollowOrg} className={`w-full py-2.5 rounded-lg text-xs font-extrabold transition-all border active:scale-95 ${isFollowingOrg ? `${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-black'}` : 'bg-[#1D9BF0] border-[#1D9BF0] text-white shadow-sm'}`}>
               {isFollowingOrg ? 'Following' : 'Follow Organizer'}
             </button>
          </div>
        </div>

        {relatedEvents.length > 0 && (
          <div className="pt-2">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Related Events</h3>
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-4">
              {relatedEvents.map(ev => (
                <EventCard key={ev.id} event={ev} variant="recommended" t={t} isDark={isDark} onClick={(e) => navigateTo('details', e)} registeredEventIds={registeredEventIds} />
              ))}
            </div>
          </div>
        )}

      </div>
      
      {!isPast && event.registrationStatus !== 'Cancelled' && (
        <div className={`absolute bottom-0 left-0 w-full p-4 pt-3 pb-8 ${t.glass} border-t border-white/10 z-30 animate-slide-up shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex space-x-3`}>
           <button 
              onClick={handlePrimaryClick}
              className={`flex-1 h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
                primaryActionState === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' :
                primaryActionState === 'danger' ? 'bg-amber-500 text-white shadow-amber-500/30 shadow-md' :
                primaryActionState === 'disabled' ? 'bg-gray-400 dark:bg-gray-700 text-white/70 cursor-not-allowed' :
                'bg-[#1D9BF0] text-white shadow-[#1D9BF0]/30 shadow-md'
              }`}
            >
              {primaryActionState === 'success' && <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
              <span>{primaryActionLabel}</span>
            </button>
        </div>
      )}
    </div>
  );
};

const CreateEventScreen = ({ onClose, t, isDark }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [schedules, setSchedules] = useState([{ time: '', title: '' }]);

  const addSchedule = () => setSchedules([...schedules, { time: '', title: '' }]);
  const removeSchedule = (idx) => setSchedules(schedules.filter((_, i) => i !== idx));
  const updateSchedule = (idx, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[idx][field] = value;
    setSchedules(newSchedules);
};
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
          {isSubmitted ? 'Status' : 'Create Event'}
        </h2>
        <div className="w-10 h-10"></div>
      </div>

      {!isSubmitted ? (
        <>
          <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6 space-y-5">
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Event Title</label>
              <input type="text" placeholder="e.g. Annual Tech Symposium" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Category</label>
                <select className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} appearance-none focus:outline-none transition-all shadow-sm`}>
                  <option>Academic</option><option>Workshop</option><option>Competition</option>
                  <option>Career</option><option>Cultural</option><option>Sports</option>
                </select>
              </div>
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Capacity</label>
                <input type="number" placeholder="e.g. 150" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Event Date</label>
                <input type="date" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`} />
              </div>
              <div>
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Reg. Deadline</label>
                <input type="date" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`} />
              </div>
            </div>

            {/* Dynamic Event Schedule Builder */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider block`}>Event Schedule</label>
                <button onClick={addSchedule} className="text-[#1D9BF0] text-[10px] font-extrabold flex items-center bg-[#1D9BF0]/10 px-2 py-1 rounded-md active:scale-95 transition-transform"><Plus className="w-3 h-3 mr-1"/> Add Item</button>
              </div>
              <div className="space-y-3">
                {schedules.map((sch, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input type="time" value={sch.time} onChange={(e) => updateSchedule(idx, 'time', e.target.value)} className={`w-28 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-2 text-xs font-bold ${t.text} focus:outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`} />
                    <input type="text" placeholder="Agenda title" value={sch.title} onChange={(e) => updateSchedule(idx, 'title', e.target.value)} className={`flex-1 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-3 text-xs font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
                    {schedules.length > 1 && (
                      <button onClick={() => removeSchedule(idx)} className="w-10 h-12 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl shrink-0 active:scale-95 transition-transform"><Trash2 className="w-4 h-4"/></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Venue</label>
              <input type="text" placeholder="e.g. AUDI 801" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm mb-3`} />
              <input type="text" placeholder="Venue Details (e.g. Admin Building, Level 8)" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
            </div>

            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Cover Image URL</label>
              <input type="url" placeholder="https://..." className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`} />
            </div>

            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Description</label>
              <textarea rows="4" placeholder="What is this event about?" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
            </div>
            
            <div>
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`}>Registration Info</label>
              <textarea rows="2" placeholder="e.g. Free for CSE students" className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}></textarea>
            </div>
          </div>

          <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
             <button onClick={() => setIsSubmitted(true)} className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40`}>
               Publish Event
             </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in-up pb-20">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Event Created!</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 max-w-xs leading-relaxed`}>
            Your event has been successfully published and is now live for students to register.
          </p>
          <button 
            onClick={onClose} 
            className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} shadow-sm`}
          >
            Back to Events
          </button>
        </div>
      )}
    </div>
  );
};

const EventsModuleOverlay = ({
  onClose, t, isDark, authRole, setToastMsg,
  registeredEventIds, setRegisteredEventIds,
  goingEventIds, setGoingEventIds,
  interestedEventIds, setInterestedEventIds,
  reminderEventIds, setReminderEventIds,
  followedOrganizerIds, setFollowedOrganizerIds
}) => {
  const [eventsScreen, setEventsScreen] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [browseParams, setBrowseParams] = useState(null);

  const navigateTo = (screen, payload = null) => {
    if (screen === 'close') {
      onClose();
      return;
    }
    setPreviousScreen(eventsScreen);
    if (screen === 'details') setSelectedEvent(payload);
    if (screen === 'browse' && payload) setBrowseParams(payload);
    setEventsScreen(screen);
  };

  const handleBack = () => {
    if (eventsScreen === 'details') setEventsScreen(previousScreen);
    else setEventsScreen('home');
  };

  return (
    <div className={`absolute inset-0 z-[90] flex flex-col ${t.bg} overflow-hidden animate-slide-up transition-colors duration-500`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500 opacity-50">
        <div className={`absolute top-[-5%] right-[-10%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-[0.15]'}`}></div>
        <div className={`absolute bottom-[10%] left-[-10%] w-[60%] h-[50%] bg-indigo-500 rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-[0.15]' : 'opacity-10'}`}></div>
      </div>

      {eventsScreen === 'home' && (
        <EventsHomeScreen 
          navigateTo={navigateTo} events={globalEventsData} t={t} isDark={isDark} 
          registeredEventIds={registeredEventIds} 
        />
      )}
      
      {eventsScreen === 'browse' && (
        <EventsBrowseScreen 
          navigateTo={navigateTo} events={globalEventsData} initialParams={browseParams} t={t} isDark={isDark}
          registeredEventIds={registeredEventIds}
        />
      )}

      {eventsScreen === 'calendar' && (
        <EventsCalendarScreen 
          navigateTo={navigateTo} events={globalEventsData} t={t} isDark={isDark} 
        />
      )}

      {eventsScreen === 'my_events' && (
        <MyEventsScreen 
          navigateTo={navigateTo} events={globalEventsData} t={t} isDark={isDark} 
          registeredEventIds={registeredEventIds} goingEventIds={goingEventIds} interestedEventIds={interestedEventIds}
        />
      )}

      {eventsScreen === 'details' && selectedEvent && (
        <EventDetailsScreen 
          event={selectedEvent} navigateTo={navigateTo} onBack={handleBack} t={t} isDark={isDark} setToastMsg={setToastMsg}
          registeredEventIds={registeredEventIds} setRegisteredEventIds={setRegisteredEventIds}
          goingEventIds={goingEventIds} setGoingEventIds={setGoingEventIds}
          interestedEventIds={interestedEventIds} setInterestedEventIds={setInterestedEventIds}
          reminderEventIds={reminderEventIds} setReminderEventIds={setReminderEventIds}
          followedOrganizerIds={followedOrganizerIds} setFollowedOrganizerIds={setFollowedOrganizerIds}
          allEvents={globalEventsData}
        />
      )}
      {/* PASTE THIS NEW BLOCK HERE */}
      {eventsScreen === 'create' && (
        <CreateEventScreen onClose={handleBack} t={t} isDark={isDark} />
      )}
    </div>
  );
};

// --- END OF EVENTS COMPONENTS ---

// --- SEEKING WORK (JOBS › SEEKING MODE) ---

// Complete category labels. Used in cards, details, filters and the create form.
const SEEKING_CATEGORIES = [
  'Internship', 'Tuition', 'Part-Time', 'Full-Time',
  'Freelance / Project', 'TA', 'RA', 'Campus Ambassador'
];

// Short quick-filter chip labels mapped to their complete category label.
const SEEKING_CATEGORY_CHIPS = [
  { label: 'All', value: 'All' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Tuition', value: 'Tuition' },
  { label: 'Part-Time', value: 'Part-Time' },
  { label: 'Full-Time', value: 'Full-Time' },
  { label: 'Freelance', value: 'Freelance / Project' },
  { label: 'TA', value: 'TA' },
  { label: 'RA', value: 'RA' },
  { label: 'Ambassador', value: 'Campus Ambassador' }
];

const SEEKING_WORK_MODES = ['Remote', 'On-site', 'Hybrid'];
const SEEKING_AVAILABILITY = ['Available immediately', 'Weekdays', 'Weekends', 'Flexible'];
const SEEKING_DEPARTMENTS = ['CSE', 'ECE', 'BBA', 'Architecture', 'Economics', 'Pharmacy', 'English'];
const SEEKING_SORTS = ['Relevant', 'Most Recent', 'Available Now'];
const SEEKING_DURATIONS = ['14 days', '30 days', '60 days'];
const SEEKING_COMMITMENTS = ['Internship', 'Part-Time', 'Full-Time', 'Project based', 'Flexible'];
const SEEKING_COMPENSATIONS = ['Open to discussion', 'Paid only', 'Unpaid / experience based', 'Hourly rate'];
const SEEKING_VISIBILITY_OPTIONS = ['Entire verified university network', 'Alumni and faculty only'];
const SEEKING_SUGGESTED_SKILLS = ['React', 'Python', 'Figma', 'Canva', 'Public Speaking', 'Data Analysis', 'Copywriting', 'Excel'];
const SEEKING_MESSAGE_PROMPTS = [
  'Hi, I saw your Seeking Work post.',
  'Are you still available?',
  'I may have an opportunity that matches your skills.'
];

const SEEKING_HEADLINE_MAX = 60;
const SEEKING_INTRO_MAX = 400;
const SEEKING_SKILLS_MAX = 8;

const EMPTY_SEEKING_FILTERS = {
  categories: [],
  workModes: [],
  availability: [],
  departments: [],
  verifiedOnly: false,
  hasPortfolio: false,
  hasResume: false,
  sort: 'Relevant'
};

const countSeekingFilters = (f) => {
  if (!f) return 0;
  return (f.categories?.length || 0) + (f.workModes?.length || 0) +
    (f.availability?.length || 0) + (f.departments?.length || 0) +
    (f.verifiedOnly ? 1 : 0) + (f.hasPortfolio ? 1 : 0) + (f.hasResume ? 1 : 0) +
    (f.sort && f.sort !== 'Relevant' ? 1 : 0);
};

// Subtle tinted category pills. The label text is always rendered alongside.
const getSeekingCategoryStyle = (category, isDark) => {
  const map = {
    'Internship': isDark ? 'bg-blue-500/15 text-blue-300 border-blue-400/25' : 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    'Tuition': isDark ? 'bg-amber-500/15 text-amber-300 border-amber-400/25' : 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    'Part-Time': isDark ? 'bg-purple-500/15 text-purple-300 border-purple-400/25' : 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    'Full-Time': isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    'Freelance / Project': isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/25' : 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
    'TA': isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/25' : 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
    'RA': isDark ? 'bg-rose-500/15 text-rose-300 border-rose-400/25' : 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    'Campus Ambassador': isDark ? 'bg-orange-500/15 text-orange-300 border-orange-400/25' : 'bg-orange-500/10 text-orange-700 border-orange-500/20'
  };
  return map[category] || (isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black/70 border-black/10');
};

const getSeekingStatusStyle = (status, isDark) => {
  const map = {
    active: isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    pending: isDark ? 'bg-yellow-500/15 text-yellow-300 border-yellow-400/25' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    paused: isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10',
    expired: isDark ? 'bg-red-500/15 text-red-300 border-red-400/25' : 'bg-red-500/10 text-red-700 border-red-500/20',
    draft: isDark ? 'bg-white/10 text-white/70 border-white/20' : 'bg-black/5 text-black/60 border-black/10'
  };
  return map[status] || map.paused;
};

const SEEKING_STATUS_LABEL = {
  active: 'Active',
  pending: 'Pending review',
  paused: 'Paused',
  expired: 'Expired',
  draft: 'Draft'
};

// A post can only be contacted while it is active.
const isSeekingUnavailable = (status) => status === 'paused' || status === 'expired';

// The signed-in demo profiles, reused so the create form never re-asks for identity.
const getSeekingViewerProfile = (authRole) => {
  if (authRole === 'alumni') {
    return { name: 'Nusrat Jahan', department: 'CSE', batch: '19', verified: true, role: 'alumni' };
  }
  if (authRole === 'faculty') {
    return { name: 'Dr. Hasan Mahmud', department: 'CSE', batch: 'Faculty', verified: true, role: 'faculty' };
  }
  return { name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, role: 'student' };
};

// Prototype relevance rule: explicitly flagged posts, or posts from the viewer's own department.
const isSeekingRelevant = (talent, viewerDepartment) =>
  talent?.relevant === true || talent?.student?.department === viewerDepartment;

const globalSeekingData = [
  {
    id: 'talent-001', category: 'Internship', headline: 'Seeking Marketing Internship',
    student: { id: 201, name: 'Rayan Hossain', department: 'BBA', batch: '231', verified: true, avatar: null },
    bioPreview: 'Digital marketing student experienced in campaign planning, social media and public speaking.',
    fullBio: 'Third-year BBA student majoring in Marketing. I have run social media for two campus clubs, planned a 3-week awareness campaign that reached 40k accounts organically, and completed a summer internship at Unilever Bangladesh. I am comfortable with Canva, Meta Business Suite and basic analytics reporting, and I am looking for a structured marketing internship where I can own a channel end to end.',
    skills: ['Digital Marketing', 'Canva', 'Copywriting', 'Public Speaking', 'Meta Ads'],
    workMode: ['On-site', 'Hybrid'], location: 'Dhaka, BD', availability: 'Available immediately',
    commitment: 'Internship', preferredDuration: '3–6 months', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '2h ago', postedTimestamp: '2026-07-29T09:00:00', expiresIn: '28 days',
    status: 'active', relevant: true, visibility: 'Verified university network'
  },
  {
    id: 'talent-002', category: 'Freelance / Project', headline: 'Available for 3D Visualisation & Rendering Projects',
    student: { id: 202, name: 'Tanisha Chowdhury', department: 'Architecture', batch: '222', verified: true, avatar: null },
    bioPreview: 'Architecture student offering photorealistic 3D renders, walkthroughs and presentation boards.',
    fullBio: 'Final-year Architecture student currently working on a thesis about sustainable low-cost housing. I take on freelance visualisation work for small studios and independent clients: exterior and interior renders, animated walkthroughs and competition boards. I work in AutoCAD, SketchUp, Lumion and Photoshop and I always deliver a revision round within the quoted timeline.',
    skills: ['AutoCAD', 'SketchUp', 'Lumion', '3D Modeling', 'Photoshop'],
    workMode: ['Remote'], location: 'Dhaka, BD', availability: 'Flexible',
    commitment: 'Project based', preferredDuration: '2–8 weeks per project', compensation: 'Hourly rate',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '6h ago', postedTimestamp: '2026-07-29T05:00:00', expiresIn: '25 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-003', category: 'Part-Time', headline: 'Looking for Part-Time Frontend Developer Role',
    student: { id: 203, name: 'Abrar Fahim', department: 'CSE', batch: '232', verified: false, avatar: null },
    bioPreview: 'Sophomore CSE student building React interfaces and contributing to open source in my spare time.',
    fullBio: 'Second-year CSE student and active competitive programmer. I have shipped three React projects, two of them with real users from campus clubs, and I contribute small fixes to open source component libraries. I am looking for a part-time frontend role of around 20 hours a week that fits around my class schedule. I have no formal industry experience yet, so mentorship matters more to me than pay.',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git', 'C++'],
    workMode: ['Remote', 'Hybrid'], location: 'Dhaka, BD', availability: 'Weekdays',
    commitment: 'Part-Time', preferredDuration: '6+ months', compensation: 'Open to discussion',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: null, githubUrl: '#',
    posted: '1d ago', postedTimestamp: '2026-07-28T11:00:00', expiresIn: '29 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-004', category: 'RA', headline: 'Seeking Research Assistant Role in IoT / Embedded Systems',
    student: { id: 204, name: 'Mehzabin Oishee', department: 'ECE', batch: '221', verified: true, avatar: null },
    bioPreview: 'Final-year ECE student with hands-on experience in sensor networks and embedded firmware.',
    fullBio: 'Final-year ECE student working on a smart home energy monitoring system as my capstone project. I have built and deployed sensor networks using ESP32 and Arduino, written firmware in C, and handled data logging pipelines to Firebase. I would like to assist a faculty member on an ongoing IoT or embedded systems research project and eventually co-author a conference paper.',
    skills: ['IoT', 'Arduino', 'ESP32', 'Embedded C', 'MATLAB'],
    workMode: ['On-site'], location: 'Dhaka, BD', availability: 'Weekdays',
    commitment: 'Part-Time', preferredDuration: '6–12 months', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '1d ago', postedTimestamp: '2026-07-28T08:30:00', expiresIn: '27 days',
    status: 'active', relevant: true, visibility: 'Verified university network'
  },
  {
    id: 'talent-005', category: 'Campus Ambassador', headline: 'Open to Campus Ambassador Opportunities',
    student: { id: 205, name: 'Zayed Khan', department: 'BBA', batch: '241', verified: false, avatar: null },
    bioPreview: 'First-year BBA student, active club volunteer and comfortable speaking in front of large groups.',
    fullBio: 'Freshman BBA student and volunteer with NSU YES. I helped coordinate registration for a 600-person career session last semester and regularly host club orientation sessions. I know the campus community well and I am looking for a campus ambassador role with a brand that actually wants on-ground activity, not just social posts.',
    skills: ['Event Coordination', 'Public Speaking', 'Social Media', 'Sales'],
    workMode: ['On-site'], location: 'Dhaka, BD', availability: 'Flexible',
    commitment: 'Part-Time', preferredDuration: '1 semester', compensation: 'Open to discussion',
    portfolioUrl: null, resumeUrl: null, linkedInUrl: '#', githubUrl: null,
    posted: '2d ago', postedTimestamp: '2026-07-27T14:00:00', expiresIn: '26 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-006', category: 'Full-Time', headline: 'Graduating CSE Student Seeking Backend Engineer Role',
    student: { id: 206, name: 'Nafisa Anjum', department: 'CSE', batch: '213', verified: true, avatar: null },
    bioPreview: 'Graduating in December with two backend internships and production experience in Node.js and Go.',
    fullBio: 'I graduate in December 2026 and I am looking for a full-time backend engineering role starting January. I interned at Brain Station 23 and then at a fintech startup where I owned a payment reconciliation service handling around 20k transactions a day. I work mainly in Node.js and Go, with PostgreSQL and Redis, and I am comfortable owning deployments on AWS.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    workMode: ['On-site', 'Hybrid'], location: 'Dhaka, BD', availability: 'Available immediately',
    commitment: 'Full-Time', preferredDuration: 'Long term', compensation: 'Paid only',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '2d ago', postedTimestamp: '2026-07-27T10:15:00', expiresIn: '24 days',
    status: 'active', relevant: true, visibility: 'Verified university network'
  },
  {
    id: 'talent-007', category: 'Tuition', headline: 'Available for HSC Physics & Higher Math Tuition',
    student: { id: 207, name: 'Sadman Sakib', department: 'CSE', batch: '223', verified: true, avatar: null },
    bioPreview: 'Three years of tuition experience with HSC students, currently teaching two batches in Bashundhara.',
    fullBio: 'CSE student who has been teaching HSC Physics and Higher Mathematics since my first year. I currently run two small batches in Bashundhara R/A and prefer teaching in person so I can work through problems on paper. I follow the board syllabus closely, set weekly practice tests, and share written solutions after every session. Happy to take one or two more students.',
    skills: ['Physics', 'Higher Math', 'HSC Syllabus', 'Problem Solving'],
    workMode: ['On-site'], location: 'Bashundhara, Dhaka', availability: 'Weekends',
    commitment: 'Part-Time', preferredDuration: '1 academic year', compensation: 'Hourly rate',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: null, githubUrl: null,
    posted: '3d ago', postedTimestamp: '2026-07-26T17:00:00', expiresIn: '22 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-008', category: 'Internship', headline: 'Seeking Data Analyst Internship',
    student: { id: 208, name: 'Ishrat Jahan', department: 'Economics', batch: '224', verified: true, avatar: null },
    bioPreview: 'Economics student comfortable with SQL, Python and building dashboards from messy survey data.',
    fullBio: 'Third-year Economics student with a strong quantitative focus. I cleaned and analysed a 12,000-response household survey for a faculty research project and built the dashboard the team still uses. Comfortable with SQL, pandas, and Power BI. I am looking for a data analyst internship where I can work with real business data rather than tutorial datasets.',
    skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Statistics'],
    workMode: ['Hybrid', 'Remote'], location: 'Dhaka, BD', availability: 'Weekdays',
    commitment: 'Internship', preferredDuration: '3–6 months', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '4d ago', postedTimestamp: '2026-07-25T12:00:00', expiresIn: '21 days',
    status: 'active', relevant: true, visibility: 'Verified university network'
  },
  {
    id: 'talent-009', category: 'TA', headline: 'Applying for Teaching Assistant — Programming Language I',
    student: { id: 209, name: 'Ridwan Karim', department: 'CSE', batch: '212', verified: true, avatar: null },
    bioPreview: 'CGPA 3.89 in CSE, previously assisted two lab sections and ran weekly doubt-solving hours.',
    fullBio: 'Senior CSE student with a 3.89 CGPA. I have informally assisted two CSE 115 lab sections, prepared practice problem sets, and run weekly doubt-solving sessions that regularly draw 30+ juniors. I am applying to be a formal teaching assistant for Programming Language I or Data Structures for the upcoming semester.',
    skills: ['C', 'Python', 'Data Structures', 'Mentoring', 'Lab Instruction'],
    workMode: ['On-site'], location: 'NSU Campus, Dhaka', availability: 'Weekdays',
    commitment: 'Part-Time', preferredDuration: '1 semester', compensation: 'Open to discussion',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '5d ago', postedTimestamp: '2026-07-24T09:45:00', expiresIn: '19 days',
    status: 'active', relevant: true, visibility: 'Alumni and faculty only'
  },
  {
    id: 'talent-010', category: 'Part-Time', headline: 'Seeking Part-Time Role in Pharmaceutical QA',
    student: { id: 210, name: 'Farhana Islam', department: 'Pharmacy', batch: '222', verified: true, avatar: null },
    bioPreview: 'Pharmacy student with laboratory experience in quality control testing and documentation.',
    fullBio: 'Fourth-year Pharmacy student. I completed a supervised placement in a quality control laboratory where I handled dissolution and assay testing and maintained batch documentation to GMP standards. I am looking for a part-time or weekend role with a pharmaceutical or diagnostics company while I finish my final year.',
    skills: ['Quality Control', 'GMP Documentation', 'HPLC', 'Lab Safety'],
    workMode: ['On-site'], location: 'Gazipur, BD', availability: 'Weekends',
    commitment: 'Part-Time', preferredDuration: '6+ months', compensation: 'Paid only',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '6d ago', postedTimestamp: '2026-07-23T15:20:00', expiresIn: '17 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-011', category: 'Freelance / Project', headline: 'Taking Flutter App Development Projects',
    student: { id: 211, name: 'Tahsin Rahman', department: 'CSE', batch: '231', verified: true, avatar: null },
    bioPreview: 'Built and published four Flutter apps, two of them for local businesses with live users.',
    fullBio: 'CSE student and mobile developer. I have published four Flutter applications, including a delivery tracking app for a local grocery chain that is still in production. I handle the full cycle: UI build, Firebase integration, Play Store release and a month of post-launch fixes. Currently paused while I finish my summer semester finals.',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'UI Implementation'],
    workMode: ['Remote'], location: 'Dhaka, BD', availability: 'Flexible',
    commitment: 'Project based', preferredDuration: '4–10 weeks per project', compensation: 'Hourly rate',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '1w ago', postedTimestamp: '2026-07-22T11:00:00', expiresIn: '15 days',
    status: 'paused', relevant: true, visibility: 'Verified university network'
  },
  {
    id: 'talent-012', category: 'Tuition', headline: 'English & IELTS Speaking Tuition Available',
    student: { id: 212, name: 'Nusaiba Haque', department: 'English', batch: '233', verified: true, avatar: null },
    bioPreview: 'English major with an 8.0 IELTS band, previously coached six students through their speaking module.',
    fullBio: 'English literature student with an overall IELTS band of 8.0 and 8.5 in speaking. I have coached six students through the speaking and writing modules, with a focus on fluency drills and structured answer frameworks rather than memorised templates. This post has expired while I focus on my final semester.',
    skills: ['IELTS Speaking', 'Academic Writing', 'Grammar', 'Pronunciation'],
    workMode: ['Remote', 'On-site'], location: 'Dhaka, BD', availability: 'Weekends',
    commitment: 'Part-Time', preferredDuration: '2–3 months', compensation: 'Hourly rate',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '5w ago', postedTimestamp: '2026-06-22T10:00:00', expiresIn: 'Expired',
    status: 'expired', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-013', category: 'Full-Time', headline: 'Seeking Full-Time Hardware Design Engineer Role',
    student: { id: 213, name: 'Arif Mahmud', department: 'ECE', batch: '214', verified: true, avatar: null },
    bioPreview: 'Recent ECE graduate with PCB design experience and two completed industrial automation projects.',
    fullBio: 'I completed my ECE degree this summer. My final year project was a modular motor controller board that is now used in a small production line in Tongi. I design in Altium, handle component sourcing, and I am comfortable debugging with an oscilloscope and logic analyser. Looking for a full-time hardware or embedded design role in Dhaka.',
    skills: ['PCB Design', 'Altium', 'Embedded C', 'Circuit Debugging', 'Industrial Automation'],
    workMode: ['On-site'], location: 'Dhaka, BD', availability: 'Available immediately',
    commitment: 'Full-Time', preferredDuration: 'Long term', compensation: 'Paid only',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '1w ago', postedTimestamp: '2026-07-21T13:30:00', expiresIn: '14 days',
    status: 'active', relevant: false, visibility: 'Verified university network'
  },
  {
    id: 'talent-014', category: 'Internship', headline: 'Seeking Product Design Internship',
    student: { id: 214, name: 'Samira Noor', department: 'CSE', batch: '226', verified: true, avatar: null },
    bioPreview: 'Interface designer with a case-study portfolio covering research, wireframes and shipped screens.',
    fullBio: 'CSE student who moved into product design after two hackathons. My portfolio has three full case studies, each covering user interviews, wireframes, a design system and the final shipped screens. I run usability sessions with real students rather than guessing, and I can hand off cleanly to developers because I still write frontend code.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'],
    workMode: ['Hybrid', 'Remote'], location: 'Dhaka, BD', availability: 'Available immediately',
    commitment: 'Internship', preferredDuration: '3–6 months', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '9d ago', postedTimestamp: '2026-07-20T16:00:00', expiresIn: '12 days',
    status: 'active', relevant: true, visibility: 'Verified university network'
  }
];

// Demo management records for the signed-in student. Shaped like talent records so
// View / Preview can reuse the Talent Details screen without a second data model.
const globalMySeekingPosts = [
  {
    id: 'my-seek-001', category: 'Internship', headline: 'Seeking Frontend Engineering Internship',
    student: { id: 'me', name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, avatar: null },
    bioPreview: 'Final year CSE student looking for a frontend internship where I can own real product surfaces.',
    fullBio: 'Final year CSE student at North South University. I have built three React applications used by campus clubs and I am comfortable with component architecture, state management and responsive layout work. Looking for a frontend internship where I can own real product surfaces and learn from code review.',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git'],
    workMode: ['Hybrid', 'Remote'], location: 'Dhaka, BD', availability: 'Available immediately',
    commitment: 'Internship', preferredDuration: '3–6 months', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: '#', linkedInUrl: '#', githubUrl: '#',
    posted: '6d ago', postedTimestamp: '2026-07-23T10:00:00', expiresIn: '24 days',
    status: 'active', relevant: true, visibility: 'Verified university network',
    postedDate: '23 Jul 2026', views: 184, saves: 12, messages: 4
  },
  {
    id: 'my-seek-002', category: 'TA', headline: 'Applying for TA — Data Structures',
    student: { id: 'me', name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, avatar: null },
    bioPreview: 'Senior CSE student applying to assist the Data Structures lab sections this coming semester.',
    fullBio: 'Senior CSE student applying to assist the Data Structures lab sections. I have run informal doubt-solving hours for juniors for the last two semesters and I am comfortable preparing practice sets and grading rubrics.',
    skills: ['C', 'Data Structures', 'Mentoring'],
    workMode: ['On-site'], location: 'NSU Campus, Dhaka', availability: 'Weekdays',
    commitment: 'Part-Time', preferredDuration: '1 semester', compensation: 'Open to discussion',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '1d ago', postedTimestamp: '2026-07-28T09:00:00', expiresIn: '30 days',
    status: 'pending', relevant: true, visibility: 'Alumni and faculty only',
    postedDate: '28 Jul 2026', views: 0, saves: 0, messages: 0
  },
  {
    id: 'my-seek-003', category: 'Tuition', headline: 'Available for O Level Maths Tuition',
    student: { id: 'me', name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, avatar: null },
    bioPreview: 'Paused while I focus on final year project deadlines. Will resume after mid-term week.',
    fullBio: 'I teach O Level Mathematics with a focus on past-paper practice and exam technique. Currently paused while I focus on my final year project deadlines.',
    skills: ['Mathematics', 'O Level Syllabus', 'Exam Technique'],
    workMode: ['On-site'], location: 'Bashundhara, Dhaka', availability: 'Weekends',
    commitment: 'Part-Time', preferredDuration: '6 months', compensation: 'Hourly rate',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: null, githubUrl: null,
    posted: '3w ago', postedTimestamp: '2026-07-08T10:00:00', expiresIn: '9 days',
    status: 'paused', relevant: true, visibility: 'Verified university network',
    postedDate: '08 Jul 2026', views: 96, saves: 5, messages: 2
  },
  {
    id: 'my-seek-004', category: 'Campus Ambassador', headline: 'Open to Campus Ambassador Roles — Spring 2026',
    student: { id: 'me', name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, avatar: null },
    bioPreview: 'This post reached its end date. Renew it to make it visible to the network again.',
    fullBio: 'I was looking for a campus ambassador role for the Spring 2026 semester. This post has reached its end date.',
    skills: ['Event Coordination', 'Social Media', 'Public Speaking'],
    workMode: ['On-site'], location: 'NSU Campus, Dhaka', availability: 'Flexible',
    commitment: 'Part-Time', preferredDuration: '1 semester', compensation: 'Open to discussion',
    portfolioUrl: null, resumeUrl: '#', linkedInUrl: '#', githubUrl: null,
    posted: '3m ago', postedTimestamp: '2026-04-14T10:00:00', expiresIn: 'Expired',
    status: 'expired', relevant: true, visibility: 'Verified university network',
    postedDate: '14 Apr 2026', views: 240, saves: 18, messages: 6
  },
  {
    id: 'my-seek-005', category: 'Freelance / Project', headline: 'Taking Small React Website Projects',
    student: { id: 'me', name: 'Hasan Tarik', department: 'CSE', batch: '221', verified: true, avatar: null },
    bioPreview: 'Draft — finish the introduction and add your work preferences before submitting.',
    fullBio: '',
    skills: ['React', 'Tailwind CSS'],
    workMode: ['Remote'], location: 'Dhaka, BD', availability: 'Flexible',
    commitment: 'Project based', preferredDuration: '2–6 weeks per project', compensation: 'Open to discussion',
    portfolioUrl: '#', resumeUrl: null, linkedInUrl: null, githubUrl: '#',
    posted: '4d ago', postedTimestamp: '2026-07-25T10:00:00', expiresIn: '—',
    status: 'draft', relevant: true, visibility: 'Verified university network',
    postedDate: '25 Jul 2026', views: 0, saves: 0, messages: 0
  }
];

// --- SEEKING: REUSABLE TALENT CARD ---
const TalentCard = ({ talent, t, isDark, isSaved, onOpen, onToggleSave, onMessage, previewMode = false }) => {
  if (!talent) return null;

  const unavailable = isSeekingUnavailable(talent.status);
  const name = talent.student?.name || 'NSU Student';
  const firstName = name.split(' ')[0];

  const handleKeyDown = (e) => {
    if (previewMode || !onOpen) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(talent);
    }
  };

  return (
    <div
      role={previewMode ? undefined : 'button'}
      tabIndex={previewMode ? undefined : 0}
      aria-label={previewMode ? undefined : `Open details for ${name}`}
      onClick={previewMode ? undefined : () => onOpen?.(talent)}
      onKeyDown={handleKeyDown}
      className={`rounded-2xl p-4 ${t.card} border ${t.border} ${t.cardShadow} transition-all outline-none ${
        previewMode
          ? 'select-none'
          : 'cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.99]'
      } ${unavailable ? 'opacity-75' : ''}`}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border shrink-0 ${getSeekingCategoryStyle(talent.category, isDark)}`}>
          {talent.category}
        </span>
        <button
          type="button"
          disabled={previewMode}
          aria-label={isSaved ? `Remove ${name} from saved profiles` : `Save ${name}`}
          aria-pressed={!!isSaved}
          onClick={(e) => { e.stopPropagation(); onToggleSave?.(talent.id); }}
          className={`shrink-0 -mt-0.5 -mr-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
            isSaved ? 'text-[#1D9BF0]' : `${t.textMuted} hover:text-[#1D9BF0]`
          } ${previewMode ? 'cursor-default' : 'active:scale-90'}`}
        >
          <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className={`text-[15px] font-extrabold tracking-tight ${t.text} leading-tight truncate`}>
        {talent.headline}
      </h3>

      <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
        <span className={`text-xs font-bold ${t.text} truncate max-w-[55%]`}>{name}</span>
        {talent.student?.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
        <span className={`text-[11px] font-bold ${t.textMuted} truncate`}>
          · {talent.student?.department} · {talent.student?.batch}
        </span>
      </div>

      <p className={`text-[11px] font-medium ${t.textMuted} leading-relaxed mt-2.5 line-clamp-2 min-h-[36px]`}>
        {talent.bioPreview}
      </p>

      <div className={`flex items-center justify-between mt-3 pt-3 border-t ${t.borderSoft}`}>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${t.textMuted}`}>
          {unavailable ? SEEKING_STATUS_LABEL[talent.status] : talent.availability}
        </span>
        <span className={`text-[10px] font-bold ${t.textMuted}`}>{talent.posted}</span>
      </div>

      <button
        type="button"
        disabled={previewMode || unavailable}
        aria-label={unavailable ? 'No longer available' : `Message ${firstName}`}
        onClick={(e) => { e.stopPropagation(); onMessage?.(talent); }}
        className={`w-full h-10 mt-3 rounded-lg font-extrabold text-xs flex items-center justify-center space-x-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D9BF0] ${
          unavailable
            ? `${isDark ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/35'} cursor-not-allowed`
            : `bg-[#1D9BF0] text-white shadow-sm ${previewMode ? 'cursor-default' : 'hover:bg-[#1A8CD8] active:scale-[0.98]'}`
        }`}
      >
        <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
        <span>{unavailable ? 'No Longer Available' : 'Message'}</span>
      </button>
    </div>
  );
};

const SeekingEmptyState = (props) => {
  const { title, description, actions, t, isDark } = props;
  const Icon = props.icon;
  return (
  <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in">
    <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/[0.04]'} border ${t.borderSoft} flex items-center justify-center mb-4`}>
      <Icon className={`w-6 h-6 ${t.textMuted}`} strokeWidth={2} />
    </div>
    <h4 className={`text-sm font-extrabold ${t.text} mb-1.5`}>{title}</h4>
    {description && <p className={`text-xs font-bold ${t.textMuted} leading-relaxed max-w-[260px]`}>{description}</p>}
    {actions?.length > 0 && (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              action.primary
                ? 'bg-[#1D9BF0] text-white shadow-sm'
                : `${t.card} border ${t.border} ${t.text}`
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
  );
};

// --- SEEKING: FEED (rendered inside the Jobs tab when Seeking mode is active) ---
const SeekingFeed = ({
  t, isDark, authRole, talent, segment, search, category, filters,
  savedTalentIds, onSelectCategory, onOpenTalent, onToggleSave, onMessageTalent,
  onCreatePost, onOpenMyPosts, onClearFilters, onViewAll
}) => {
  const isStudent = authRole === 'student';
  const viewer = getSeekingViewerProfile(authRole);
  const query = search.trim().toLowerCase();

  const displayed = useMemo(() => {
    let list = talent.filter((item) => {
      // Saved shows every saved profile, including ones that are no longer available.
      if (segment === 'Saved') return savedTalentIds.has(item.id);
      if (item.status !== 'active') return false;
      if (segment === 'Relevant') return isSeekingRelevant(item, viewer.department);
      return true;
    });

    if (query) {
      list = list.filter((item) =>
        item.headline.toLowerCase().includes(query) ||
        item.student?.name?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.bioPreview.toLowerCase().includes(query) ||
        (item.skills || []).some((s) => s.toLowerCase().includes(query))
      );
    }

    if (category !== 'All') list = list.filter((item) => item.category === category);

    if (filters.categories.length) list = list.filter((item) => filters.categories.includes(item.category));
    if (filters.workModes.length) list = list.filter((item) => (item.workMode || []).some((m) => filters.workModes.includes(m)));
    if (filters.availability.length) list = list.filter((item) => filters.availability.includes(item.availability));
    if (filters.departments.length) list = list.filter((item) => filters.departments.includes(item.student?.department));
    if (filters.verifiedOnly) list = list.filter((item) => item.student?.verified);
    if (filters.hasPortfolio) list = list.filter((item) => !!item.portfolioUrl);
    if (filters.hasResume) list = list.filter((item) => !!item.resumeUrl);

    const sorted = [...list];
    if (filters.sort === 'Most Recent') {
      sorted.sort((a, b) => new Date(b.postedTimestamp) - new Date(a.postedTimestamp));
    } else if (filters.sort === 'Available Now') {
      sorted.sort((a, b) => {
        const rank = (x) => (x.availability === 'Available immediately' ? 0 : 1);
        return rank(a) - rank(b) || new Date(b.postedTimestamp) - new Date(a.postedTimestamp);
      });
    } else {
      sorted.sort((a, b) => {
        const rank = (x) => (isSeekingRelevant(x, viewer.department) ? 0 : 1);
        return rank(a) - rank(b) || new Date(b.postedTimestamp) - new Date(a.postedTimestamp);
      });
    }
    return sorted;
  }, [talent, segment, query, category, filters, savedTalentIds, viewer.department]);

  const hasNarrowedSearch = !!query || category !== 'All' || countSeekingFilters(filters) > 0;

  const renderEmptyState = () => {
    if (hasNarrowedSearch) {
      return (
        <SeekingEmptyState
          icon={Search} t={t} isDark={isDark}
          title="No matching students found"
          description="Try removing a filter or searching for another skill."
          actions={[
            { label: 'Clear Filters', onClick: onClearFilters, primary: true },
            { label: 'View All Talent', onClick: onViewAll }
          ]}
        />
      );
    }
    if (segment === 'Saved') {
      return (
        <SeekingEmptyState
          icon={Bookmark} t={t} isDark={isDark}
          title="No saved profiles yet"
          description="Save students you may want to contact later."
          actions={[{ label: 'Browse Talent', onClick: onViewAll, primary: true }]}
        />
      );
    }
    if (segment === 'Relevant') {
      return (
        <SeekingEmptyState
          icon={Sparkles} t={t} isDark={isDark}
          title="No relevant profiles are available right now."
          description="Relevance is based on your department and profile. Check the All segment for the full network."
          actions={[{ label: 'View All Talent', onClick: onViewAll, primary: true }]}
        />
      );
    }
    return (
      <SeekingEmptyState
        icon={Users} t={t} isDark={isDark}
        title="No students are seeking work right now"
        description="New Seeking Work posts from the verified network will appear here."
      />
    );
  };

  return (
    <div className="flex-1 overflow-y-auto pb-36 relative z-10">
      <div className="flex space-x-2 overflow-x-auto hide-scrollbar px-5 pt-4 pb-1">
        {SEEKING_CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            aria-pressed={category === chip.value}
            onClick={() => onSelectCategory(chip.value)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold border shrink-0 transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              category === chip.value
                ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
                : `${isDark ? 'bg-white/5 text-gray-400 border-white/10 hover:text-white' : 'bg-white/50 text-gray-700 border-white/60 hover:border-[#1D9BF0]/30'}`
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {isStudent ? (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/25' : 'bg-[#1D9BF0]/[0.07] border-[#1D9BF0]/20'} border flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg bg-[#1D9BF0]/15 flex items-center justify-center shrink-0`}>
              <Megaphone className="w-4 h-4 text-[#1D9BF0]" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-extrabold ${t.text} leading-tight`}>Looking for an opportunity?</p>
              <p className={`text-[11px] font-bold ${t.textMuted} truncate mt-0.5`}>Create a Seeking Work post</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onCreatePost}
                className="px-3 py-2 rounded-lg text-[11px] font-extrabold bg-[#1D9BF0] text-white shadow-sm active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
              >
                Post
              </button>
              <button
                type="button"
                onClick={onOpenMyPosts}
                className={`px-3 py-2 rounded-lg text-[11px] font-extrabold ${t.card} border ${t.border} ${t.text} active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
              >
                My Posts
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
              <ShieldCheck className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
            </div>
            <p className={`text-[11px] font-bold ${t.textMuted} leading-relaxed`}>
              Discover verified students currently open to work.
            </p>
          </div>
        )}
      </div>

      <div className="px-5 pt-4 space-y-3">
        {displayed.length > 0 ? (
          displayed.map((item) => (
            <TalentCard
              key={item.id}
              talent={item}
              t={t}
              isDark={isDark}
              isSaved={savedTalentIds.has(item.id)}
              onOpen={onOpenTalent}
              onToggleSave={onToggleSave}
              onMessage={onMessageTalent}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

// --- SEEKING: ADVANCED FILTERS SHEET ---
const SeekingFilterSection = ({ title, t, children }) => (
  <div>
    <h4 className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2.5`}>{title}</h4>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const SeekingFiltersSheet = ({ open, filters, onApply, onClose, t, isDark }) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => { if (open) setDraft(filters); }, [open, filters]);

  if (!open) return null;

  const toggleIn = (key, value) => {
    setDraft((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      };
    });
  };

  const chipClass = (active) =>
    `px-3 py-2 rounded-lg text-[11px] font-extrabold border transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
        : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`
    }`;

  return (
    <>
      <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={`absolute bottom-0 left-0 w-full max-h-[85%] rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-[61] animate-slide-up flex flex-col border-t ${t.borderSoft}`}>
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 shrink-0" />
        <div className={`px-5 py-3 flex items-center justify-between border-b ${t.borderSoft} shrink-0`}>
          <h3 className={`text-base font-extrabold ${t.text} tracking-tight`}>Filter Talent</h3>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center active:scale-95 transition-transform`}
          >
            <X className={`w-4 h-4 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <SeekingFilterSection t={t} title="Category">
            {SEEKING_CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => toggleIn('categories', c)} aria-pressed={draft.categories.includes(c)} className={chipClass(draft.categories.includes(c))}>{c}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Work Mode">
            {SEEKING_WORK_MODES.map((m) => (
              <button key={m} type="button" onClick={() => toggleIn('workModes', m)} aria-pressed={draft.workModes.includes(m)} className={chipClass(draft.workModes.includes(m))}>{m}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Availability">
            {SEEKING_AVAILABILITY.map((a) => (
              <button key={a} type="button" onClick={() => toggleIn('availability', a)} aria-pressed={draft.availability.includes(a)} className={chipClass(draft.availability.includes(a))}>{a}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Department">
            {SEEKING_DEPARTMENTS.map((d) => (
              <button key={d} type="button" onClick={() => toggleIn('departments', d)} aria-pressed={draft.departments.includes(d)} className={chipClass(draft.departments.includes(d))}>{d}</button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Profile Quality">
            {[
              { key: 'verifiedOnly', label: 'Verified profiles only' },
              { key: 'hasPortfolio', label: 'Has portfolio' },
              { key: 'hasResume', label: 'Has resume' }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                aria-pressed={!!draft[opt.key]}
                onClick={() => setDraft((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                className={chipClass(!!draft[opt.key])}
              >
                {opt.label}
              </button>
            ))}
          </SeekingFilterSection>

          <SeekingFilterSection t={t} title="Sort By">
            {SEEKING_SORTS.map((s) => (
              <button key={s} type="button" onClick={() => setDraft((prev) => ({ ...prev, sort: s }))} aria-pressed={draft.sort === s} className={chipClass(draft.sort === s)}>{s}</button>
            ))}
          </SeekingFilterSection>
        </div>

        <div className={`p-5 pb-8 border-t ${t.borderSoft} flex gap-3 shrink-0`}>
          <button
            type="button"
            onClick={() => setDraft(EMPTY_SEEKING_FILTERS)}
            className={`h-12 px-5 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} active:scale-[0.97] transition-transform flex items-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="flex-1 h-12 rounded-xl font-extrabold text-sm bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30 active:scale-[0.97] transition-transform"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

const ChatReactionMenu = ({ align, msgId, reactions, onReact, isDark }) => (
  <div className={`absolute bottom-full mb-2 ${align === 'right' ? 'right-0 origin-bottom-right' : 'left-0 origin-bottom-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-full px-3 py-2 flex items-center space-x-3 z-[60] animate-fade-in-up`}>
    {['❤️', '👍', '😂', '😮', '😢', '🙏'].map(emoji => (
      <button 
        key={emoji} 
        className={`text-[24px] hover:scale-125 hover:-translate-y-1 active:scale-95 transition-all drop-shadow-sm ${reactions[msgId] === emoji ? 'scale-125 -translate-y-1' : ''}`} 
        onClick={(e) => { e.stopPropagation(); onReact(msgId, emoji); }}
      >
        {emoji}
      </button>
    ))}
  </div>
);

const ChatMessageActionsMenu = ({ align, isOwn, onDismiss, t, isDark }) => (
  <div className={`absolute top-full mt-2 ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} ${isDark ? 'bg-[#2A2A2A] border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-black/5'} border shadow-xl rounded-2xl p-1.5 flex flex-col z-[60] min-w-[140px] animate-fade-in-up`}>
    <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
      <Reply className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
      <span className={`text-xs font-bold ${t.text}`}>Reply</span>
    </button>
    <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
      <Copy className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
      <span className={`text-xs font-bold ${t.text}`}>Copy</span>
    </button>
    {isOwn && (
      <>
        <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} transition-colors active:scale-[0.98]`}>
          <Edit className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
          <span className={`text-xs font-bold ${t.text}`}>Edit</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:${isDark ? 'bg-red-500/10' : 'bg-red-50'} transition-colors active:scale-[0.98] group`}>
          <Trash2 className={`w-4 h-4 text-red-500`} strokeWidth={2.5} />
          <span className={`text-xs font-bold text-red-500`}>Unsend</span>
        </button>
      </>
    )}
  </div>
);

// --- CHAT OVERLAY (shared by Messages and the Seeking message hand-off) ---
const ChatOverlay = ({ t, isDark, chatContext, setChatContext, setActiveOverlay }) => {
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reactingTo, setReactingTo] = useState(null);
  const [composerText, setComposerText] = useState('');
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
  
  // Defaults to the Sarah Rahman demo thread. A Seeking hand-off overrides the peer.
  const seekingHandoff = chatContext?.seeking || null;
  const peerName = chatContext?.peer?.name || 'Sarah Rahman';
  const peerSubtitle = chatContext?.peer?.subtitle || 'Software Engineer';
  const { icon: RoleIcon, colorClass, bgClass } = chatContext?.peer?.role === 'Student'
    ? { icon: GraduationCap, colorClass: 'text-[#1D9BF0]', bgClass: 'bg-[#1D9BF0]/10' }
    : { icon: Briefcase, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };

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

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className={`absolute top-[20%] left-[-20%] w-[60%] h-[50%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-20' : 'opacity-30'}`}></div>
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-30 shadow-sm`}>
        <div className="flex items-center">
          <button onClick={() => { setActiveOverlay(null); setChatContext(null); }} aria-label="Back to messages" className={`mr-2 w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors hover:opacity-80`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className={`w-10 h-10 rounded-full ${bgClass} border ${isDark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center mr-3 relative shrink-0 shadow-sm`}>
            <User className={`w-5 h-5 ${colorClass}`} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5 min-w-0">
              <h2 className={`text-base font-extrabold ${t.text} leading-tight truncate`}>{peerName}</h2>
              <RoleIcon className={`w-3.5 h-3.5 ${colorClass} shrink-0`} strokeWidth={2.5} />
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
              <span className={`text-[10px] font-bold ${t.textMuted} truncate`}>{peerSubtitle}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></span>
              <span className="text-[10px] font-extrabold text-[#1D9BF0] shrink-0">Active now</span>
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

        {seekingHandoff && (
          <div className={`shrink-0 rounded-2xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} animate-fade-in`}>
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-1`}>Regarding</p>
            <p className={`text-sm font-extrabold ${t.text} leading-tight`}>{seekingHandoff.headline}</p>
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(seekingHandoff.category, isDark)}`}>
              {seekingHandoff.category}
            </span>
          </div>
        )}

        {seekingHandoff && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-70">
            <MessageSquare className={`w-10 h-10 ${t.textMuted} mb-3`} strokeWidth={1.5} />
            <p className={`text-xs font-bold ${t.textMuted} max-w-[240px] leading-relaxed`}>
              This is the start of your conversation with {peerName.split(' ')[0]}.
            </p>
          </div>
        )}

        {!seekingHandoff && (
        <>
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
          {reactingTo === 'msg-1' && <ChatReactionMenu align="left" msgId="msg-1" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
          {reactingTo === 'msg-1' && <ChatMessageActionsMenu align="left" isOwn={false} onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
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
          {reactingTo === 'msg-2' && <ChatReactionMenu align="left" msgId="msg-2" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
          {reactingTo === 'msg-2' && <ChatMessageActionsMenu align="left" isOwn={false} onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
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
          {reactingTo === 'msg-3' && <ChatReactionMenu align="right" msgId="msg-3" reactions={reactions} onReact={handleReaction} isDark={isDark} />}
          {reactingTo === 'msg-3' && <ChatMessageActionsMenu align="right" isOwn={true} onDismiss={() => setReactingTo(null)} t={t} isDark={isDark} />}
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
        </>
        )}

      </div>

      <div className={`p-4 ${t.glass} border-t relative z-20`} ref={attachmentContainerRef}>
        {seekingHandoff && !composerText.trim() && (
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar mb-3 -mx-1 px-1">
            {SEEKING_MESSAGE_PROMPTS.map(prompt => (
              <button
                key={prompt}
                type="button"
                onClick={() => setComposerText(prompt)}
                className={`px-3 py-2 rounded-full text-[11px] font-extrabold border shrink-0 transition-all active:scale-95 ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

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
              aria-label="Message"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              className={`w-full bg-transparent text-sm font-bold ${t.text} focus:outline-none resize-none py-2.5 max-h-24`}
             />
          </div>
          <button aria-label="Send message" className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-md shadow-[#1D9BF0]/40 active:scale-95 transition-transform">
            <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- JOBS TAB (HIRING + SEEKING) ---
const JobsTab = ({
  t, isDark, authRole,
  jobs, directoryUsers, jobSegment, setJobSegment, jobFilter, setJobFilter,
  onSelectJob, onSelectUser, onPostJob,
  jobsMode, setJobsMode,
  seekingTalent, seekingSegment, setSeekingSegment,
  seekingSearch, setSeekingSearch, seekingCategory, setSeekingCategory,
  seekingFilters, seekingFilterCount, onOpenSeekingFilters,
  savedTalentIds, onToggleSaveTalent, onOpenTalent, onMessageTalent,
  onCreateSeeking, onOpenMySeekingPosts, onClearSeekingFilters, onViewAllTalent
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isSeeking = jobsMode === 'seeking';

  let displayedJobs = jobs;
  if (jobSegment === 'Saved') {
    displayedJobs = jobs.slice(0, 1);
  }
  if (jobFilter) {
    displayedJobs = displayedJobs.filter(job => job.type === jobFilter || job.location === jobFilter);
  }

  const hiringSegments = ['All Jobs', 'For You', 'Saved'];
  const seekingSegments = ['All', 'Relevant', 'Saved'];

  return (
    <div className={`flex flex-col h-full relative animate-fade-in z-10`}>
      <div className={`px-5 pt-8 pb-3 relative z-20 ${t.glass} border-b shadow-sm`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className={`text-2xl font-extrabold ${t.text} tracking-tight leading-tight`}>Jobs</h2>
          </div>
          <div className="flex items-center space-x-2 relative z-50">
            {!isSeeking && jobFilter && (
              <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#1D9BF0]/10'} border ${t.borderSoft} animate-fade-in`}>
                <span className={`text-[10px] font-extrabold ${isDark ? 'text-white' : 'text-[#1D9BF0]'} uppercase tracking-wider`}>{jobFilter}</span>
                <button onClick={() => setJobFilter(null)} aria-label="Clear job filter" className={`opacity-70 hover:opacity-100 ${isDark ? 'text-white' : 'text-[#1D9BF0]'}`}>
                  <X className="w-3 h-3" strokeWidth={3} />
                </button>
              </div>
            )}

            {isSeeking ? (
              <button
                type="button"
                aria-label="Filter talent"
                onClick={onOpenSeekingFilters}
                className={`relative w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50 active:scale-95 ${seekingFilterCount > 0 ? 'border-[#1D9BF0]/50' : ''}`}
              >
                <SlidersHorizontal className={`w-4 h-4 ${seekingFilterCount > 0 ? 'text-[#1D9BF0]' : t.text}`} strokeWidth={2.5} />
                {seekingFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#1D9BF0] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {seekingFilterCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label="Filter jobs"
                className={`w-9 h-9 rounded-lg ${t.card} border ${t.border} flex items-center justify-center transition-colors shadow-sm hover:border-[#1D9BF0]/50 ${jobFilter || isFilterOpen ? 'border-[#1D9BF0]/50 text-[#1D9BF0]' : ''}`}
              >
                <Filter className={`w-4 h-4 ${jobFilter || isFilterOpen ? 'text-[#1D9BF0]' : t.text}`} strokeWidth={2.5} />
              </button>
            )}

            {!isSeeking && isFilterOpen && (
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

        {/* Primary Hiring / Seeking mode toggle */}
        <div className={`flex p-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${t.borderSoft} mb-3`} role="tablist" aria-label="Jobs mode">
          {[
            { id: 'hiring', label: 'Hiring' },
            { id: 'seeking', label: 'Seeking' }
          ].map(mode => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={jobsMode === mode.id}
              onClick={() => { setJobsMode(mode.id); setIsFilterOpen(false); }}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.98] ${
                jobsMode === mode.id
                  ? `${isDark ? 'bg-[#1A1A1A] text-white border-white/10' : 'bg-white text-black shadow-sm border-white'} border`
                  : `text-gray-500 hover:${t.text}`
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="relative w-full mb-4">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textMuted} w-4 h-4`} strokeWidth={2.5} />
          {isSeeking ? (
            <>
              <input
                type="text"
                value={seekingSearch}
                onChange={(e) => setSeekingSearch(e.target.value)}
                aria-label="Search seeking work posts"
                placeholder="Search skills, roles or students..."
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-10 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
              />
              {seekingSearch && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSeekingSearch('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'} ${t.textMuted} active:scale-90 transition-transform`}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              )}
            </>
          ) : (
            <input
              type="text"
              placeholder="Search by title or company..."
              className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-lg h-11 pl-10 pr-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm placeholder:font-bold`}
            />
          )}
        </div>

        <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-5 px-5">
          {(isSeeking ? seekingSegments : hiringSegments).map(seg => {
            const active = isSeeking ? seekingSegment === seg : jobSegment === seg;
            return (
              <button
                key={seg}
                onClick={() => (isSeeking ? setSeekingSegment(seg) : setJobSegment(seg))}
                aria-pressed={active}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all border shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${active ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm' : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'} hover:bg-white/20`}`}
              >
                {seg}
              </button>
            );
          })}
        </div>
      </div>

      {isSeeking ? (
        <SeekingFeed
          t={t}
          isDark={isDark}
          authRole={authRole}
          talent={seekingTalent}
          segment={seekingSegment}
          search={seekingSearch}
          category={seekingCategory}
          filters={seekingFilters}
          savedTalentIds={savedTalentIds}
          onSelectCategory={setSeekingCategory}
          onOpenTalent={onOpenTalent}
          onToggleSave={onToggleSaveTalent}
          onMessageTalent={onMessageTalent}
          onCreatePost={onCreateSeeking}
          onOpenMyPosts={onOpenMySeekingPosts}
          onClearFilters={onClearSeekingFilters}
          onViewAll={onViewAllTalent}
        />
      ) : (
        <div className="flex-1 overflow-y-auto pb-36 px-5 pt-5 relative z-10 space-y-4">
          {displayedJobs.length > 0 ? displayedJobs.map((job) => (
            <div
              key={job.id}
              className={`rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer shadow-2xl shadow-black/5 dark:shadow-black/40 border ${t.border}`}
              onClick={() => onSelectJob(job)}
            >
              <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-emerald-500/10' : 'bg-gradient-to-b from-white to-emerald-500/10 backdrop-blur-3xl'}`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex space-x-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'}`}>{job.type}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black/70 border border-black/10'}`}>{job.location}</span>
                  </div>
                  <button aria-label={`Save ${job.title}`} className={`text-gray-400 hover:text-emerald-500 transition-colors active:scale-95`} onClick={(e) => e.stopPropagation()}>
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
                      const poster = directoryUsers.find(u => u.id === job.postedBy.userId);
                      if (poster) onSelectUser(poster);
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
      )}

      {!isSeeking && (authRole === 'alumni' || authRole === 'faculty') && (
        <button
          onClick={onPostJob}
          aria-label="Post a job"
          className="absolute bottom-28 right-5 w-14 h-14 bg-[#1D9BF0] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1D9BF0]/40 active:scale-95 transition-transform z-30"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

// --- SEEKING: SHARED FORM / DETAIL HELPERS ---
const createEmptySeekingDraft = () => ({
  id: null,
  category: '',
  headline: '',
  intro: '',
  skills: [],
  workMode: ['On-site'],
  location: 'Dhaka, BD',
  availability: SEEKING_AVAILABILITY[0],
  commitment: SEEKING_COMMITMENTS[0],
  preferredDuration: '3–6 months',
  compensation: SEEKING_COMPENSATIONS[0],
  resumeUrl: '', portfolioUrl: '', linkedInUrl: '', githubUrl: '', otherUrl: '',
  visibility: SEEKING_VISIBILITY_OPTIONS[0],
  duration: '30 days'
});

const seekingDraftFromPost = (post) => ({
  ...createEmptySeekingDraft(),
  id: post?.id || null,
  category: post?.category || '',
  headline: post?.headline || '',
  intro: post?.fullBio || post?.bioPreview || '',
  skills: [...(post?.skills || [])].slice(0, SEEKING_SKILLS_MAX),
  workMode: [...(post?.workMode || ['On-site'])],
  location: post?.location || 'Dhaka, BD',
  availability: post?.availability || SEEKING_AVAILABILITY[0],
  commitment: post?.commitment || SEEKING_COMMITMENTS[0],
  preferredDuration: post?.preferredDuration || '3–6 months',
  compensation: post?.compensation || SEEKING_COMPENSATIONS[0],
  resumeUrl: post?.resumeUrl || '', portfolioUrl: post?.portfolioUrl || '',
  linkedInUrl: post?.linkedInUrl || '', githubUrl: post?.githubUrl || '', otherUrl: post?.otherUrl || '',
  visibility: post?.visibility === 'Alumni and faculty only' ? SEEKING_VISIBILITY_OPTIONS[1] : SEEKING_VISIBILITY_OPTIONS[0],
  duration: post?.duration || '30 days'
});

const buildSeekingPostFromDraft = (draft, viewer, status) => ({
  id: draft.id || `my-seek-${Date.now()}`,
  category: draft.category || SEEKING_CATEGORIES[0],
  headline: draft.headline.trim(),
  student: {
    id: 'me', name: viewer.name, department: viewer.department,
    batch: viewer.batch, verified: viewer.verified, avatar: null
  },
  bioPreview: draft.intro.trim(),
  fullBio: draft.intro.trim(),
  skills: [...draft.skills],
  workMode: draft.workMode.length ? [...draft.workMode] : ['On-site'],
  location: draft.location.trim() || 'Dhaka, BD',
  availability: draft.availability,
  commitment: draft.commitment,
  preferredDuration: draft.preferredDuration,
  compensation: draft.compensation,
  portfolioUrl: draft.portfolioUrl.trim() || null,
  resumeUrl: draft.resumeUrl.trim() || null,
  linkedInUrl: draft.linkedInUrl.trim() || null,
  githubUrl: draft.githubUrl.trim() || null,
  otherUrl: draft.otherUrl.trim() || null,
  posted: 'Just now',
  postedTimestamp: new Date().toISOString(),
  expiresIn: draft.duration,
  status,
  relevant: true,
  visibility: draft.visibility === SEEKING_VISIBILITY_OPTIONS[1] ? 'Alumni and faculty only' : 'Verified university network',
  duration: draft.duration,
  postedDate: 'Today', views: 0, saves: 0, messages: 0
});

const SeekingDetailRow = (props) => {
  const { label, value, t, isDark } = props;
  const Icon = props.icon;
  return (
  <div className="flex items-start gap-3">
    <div className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
      <Icon className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>{label}</p>
      <p className={`text-xs font-extrabold ${t.text} mt-0.5 break-words`}>{value}</p>
    </div>
  </div>
  );
};

const SeekingLinkRow = (props) => {
  const { label, onClick, t, isDark } = props;
  const Icon = props.icon;
  return (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/[0.03] hover:bg-black/[0.06]'} border ${t.borderSoft} transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
  >
    <Icon className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
    <span className={`text-xs font-extrabold ${t.text} flex-1 text-left`}>{label}</span>
    <ArrowUpRight className={`w-4 h-4 ${t.textMuted} shrink-0`} strokeWidth={2.5} />
  </button>
  );
};

const SeekingActionSheet = ({ title, actions, onClose, t, isDark }) => (
  <>
    <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
    <div className={`absolute bottom-0 left-0 w-full rounded-t-3xl ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'} shadow-2xl z-[61] animate-slide-up border-t ${t.borderSoft} pb-8`}>
      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-3" />
      {title && <p className={`px-5 pb-2 text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider truncate`}>{title}</p>}
      <div className="px-3 pb-2 space-y-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:${isDark ? 'bg-white/10' : 'bg-black/5'} active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
          >
            <action.icon className={`w-5 h-5 ${action.isDestructive ? 'text-red-500' : t.textMuted}`} strokeWidth={2.5} />
            <span className={`text-sm font-bold ${action.isDestructive ? 'text-red-500' : t.text}`}>{action.label}</span>
          </button>
        ))}
      </div>
      <div className="px-3">
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-3.5 text-center font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} rounded-xl active:scale-[0.98] transition-transform`}
        >
          Cancel
        </button>
      </div>
    </div>
  </>
);

// --- SEEKING: TALENT DETAILS ---
const TalentDetailsOverlay = ({ talent, t, isDark, isSaved, onToggleSave, onBack, onMessage, onToast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!talent) return null;

  const isOwnPost = talent.student?.id === 'me';
  const unavailable = isSeekingUnavailable(talent.status);
  const name = talent.student?.name || 'NSU Student';
  const firstName = name.split(' ')[0];

  const links = [
    talent.resumeUrl && { key: 'resume', icon: FileText, label: 'Resume' },
    talent.portfolioUrl && { key: 'portfolio', icon: Globe, label: 'Portfolio' },
    talent.linkedInUrl && { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    talent.githubUrl && { key: 'github', icon: Github, label: 'GitHub' },
    talent.otherUrl && { key: 'other', icon: Link2, label: 'Other Link' }
  ].filter(Boolean);

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-15' : 'opacity-[0.15]'}`} />
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <button type="button" aria-label="Go back" onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}>
          <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
        </button>
        <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>Talent Details</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isSaved ? 'Remove from saved profiles' : 'Save profile'}
            aria-pressed={!!isSaved}
            onClick={() => onToggleSave(talent.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95 ${isSaved ? 'text-[#1D9BF0]' : t.text}`}
          >
            <Bookmark className="w-5 h-5" strokeWidth={2.5} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            aria-label="More options"
            onClick={() => setIsMenuOpen(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}
          >
            <MoreVertical className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 relative z-10">
        <div className={`m-5 mt-6 rounded-2xl p-6 relative overflow-hidden ${t.cardShadow} border ${t.border}`}>
          <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-[#1D9BF0]/10' : 'bg-gradient-to-b from-white/90 to-[#1D9BF0]/10 backdrop-blur-3xl'}`} />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full ${isDark ? 'bg-white/5' : 'bg-white/60'} border-2 ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center mb-4 shadow-lg`}>
              <User className={`w-9 h-9 ${t.text}`} strokeWidth={1.5} />
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1 max-w-full">
              <h2 className={`font-extrabold text-xl tracking-tight leading-tight ${t.text} truncate`}>{name}</h2>
              {talent.student?.verified && <BadgeCheck className="w-5 h-5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
            </div>
            <p className={`text-xs font-bold ${t.textMuted}`}>
              {talent.student?.department} · Batch {talent.student?.batch}
            </p>
            <p className={`text-[11px] font-bold ${t.textMuted} opacity-80 mt-0.5`}>North South University</p>
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-3`}>Posted {talent.posted}</p>
          </div>
        </div>

        <div className="px-5 space-y-5">
          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(talent.category, isDark)}`}>
                {talent.category}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingStatusStyle(talent.status, isDark)}`}>
                {SEEKING_STATUS_LABEL[talent.status] || 'Active'}
              </span>
            </div>
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight leading-tight`}>{talent.headline}</h3>
            <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${t.borderSoft}`}>
              <Clock className={`w-3.5 h-3.5 ${t.textMuted}`} strokeWidth={2.5} />
              <span className={`text-xs font-bold ${t.textMuted}`}>{talent.availability}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400/50" />
              <span className={`text-xs font-bold ${t.textMuted}`}>
                {talent.expiresIn === 'Expired' ? 'Expired' : `Expires in ${talent.expiresIn}`}
              </span>
            </div>
          </div>

          {unavailable && (
            <div className={`rounded-2xl p-4 border flex items-start gap-3 ${isDark ? 'bg-red-500/10 border-red-400/25' : 'bg-red-50 border-red-100'}`}>
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                {isOwnPost
                  ? `This post is ${SEEKING_STATUS_LABEL[talent.status].toLowerCase()} and is not visible to the network.`
                  : 'This student is no longer available for this opportunity.'}
              </p>
            </div>
          )}

          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-3`}>About</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90`}>{talent.fullBio}</p>
          </div>

          {talent.skills?.length > 0 && (
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span key={skill} className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold border ${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-black/[0.03] text-gray-700 border-black/[0.06]'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
            <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Work Preferences</h3>
            <div className="space-y-4">
              <SeekingDetailRow icon={Monitor} label="Work Mode" value={(talent.workMode || []).join(' · ') || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={MapPin} label="Location" value={talent.location || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Clock} label="Availability" value={talent.availability || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Briefcase} label="Commitment" value={talent.commitment || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={CalendarClock} label="Preferred Duration" value={talent.preferredDuration || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={CircleDollarSign} label="Compensation" value={talent.compensation || '—'} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Eye} label="Visibility" value={talent.visibility || '—'} t={t} isDark={isDark} />
            </div>
          </div>

          {links.length > 0 && (
            <div className={`${t.card} border ${t.border} ${t.cardShadow} rounded-2xl p-5`}>
              <h3 className={`text-base font-extrabold ${t.text} tracking-tight mb-4`}>Supporting Links</h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <SeekingLinkRow
                    key={link.key}
                    icon={link.icon}
                    label={link.label}
                    t={t}
                    isDark={isDark}
                    onClick={() => onToast(`${link.label} is not available in this prototype`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
        <button
          type="button"
          disabled={unavailable || isOwnPost}
          onClick={() => onMessage(talent)}
          className={`w-full h-14 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
            unavailable || isOwnPost
              ? 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
              : 'active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40'
          }`}
        >
          {!unavailable && !isOwnPost && <Send className="w-5 h-5" strokeWidth={2.5} />}
          <span className="truncate">
            {isOwnPost ? 'This Is Your Post' : unavailable ? 'No Longer Available' : `Message ${firstName}`}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <SeekingActionSheet
          title={talent.headline}
          t={t}
          isDark={isDark}
          onClose={() => setIsMenuOpen(false)}
          actions={[
            {
              label: isSaved ? 'Remove from Saved' : 'Save Profile', icon: Bookmark,
              onClick: () => { onToggleSave(talent.id); setIsMenuOpen(false); }
            },
            { label: 'Share Profile', icon: Share, onClick: () => { setIsMenuOpen(false); onToast('Share sheet is not available in this prototype'); } },
            { label: 'Copy Post Link', icon: Copy, onClick: () => { setIsMenuOpen(false); onToast('Post link copied'); } },
            ...(isOwnPost ? [] : [{ label: 'Report Post', icon: Flag, isDestructive: true, onClick: () => { setIsMenuOpen(false); onToast('Report submitted for review'); } }])
          ]}
        />
      )}
    </div>
  );
};

// --- SEEKING: CREATE POST (form → preview → success) ---
const CreateSeekingOverlay = ({ t, isDark, authRole, initialDraft, onClose, onSubmit, onViewMyPosts, onToast }) => {
  const viewer = getSeekingViewerProfile(authRole);
  const [step, setStep] = useState('form');
  const [draft, setDraft] = useState(() => initialDraft || createEmptySeekingDraft());
  const [skillInput, setSkillInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const setField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const toggleWorkMode = (mode) => setDraft((prev) => ({
    ...prev,
    workMode: prev.workMode.includes(mode) ? prev.workMode.filter((m) => m !== mode) : [...prev.workMode, mode]
  }));

  const addSkill = (raw) => {
    const value = (raw || '').trim();
    if (!value) return;
    if (draft.skills.length >= SEEKING_SKILLS_MAX) {
      onToast(`You can add up to ${SEEKING_SKILLS_MAX} skills`);
      return;
    }
    if (draft.skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      onToast('That skill is already added');
      return;
    }
    setDraft((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput('');
  };

  const removeSkill = (skill) => setDraft((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const errors = {
    category: !draft.category ? 'Select a category' : null,
    headline: !draft.headline.trim() ? 'Add a headline' : null,
    intro: !draft.intro.trim() ? 'Add a short introduction' : null,
    skills: draft.skills.length === 0 ? 'Add at least one skill' : null
  };
  const isValid = !Object.values(errors).some(Boolean);

  const handleContinue = () => {
    if (!isValid) {
      setShowErrors(true);
      onToast('Complete the required fields to continue');
      return;
    }
    setStep('preview');
  };

  const handleSubmit = () => {
    onSubmit(buildSeekingPostFromDraft(draft, viewer, 'pending'));
    setStep('success');
  };

  const previewTalent = useMemo(
    () => buildSeekingPostFromDraft(draft, viewer, 'active'),
    [draft, viewer]
  );

  const labelClass = `text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`;
  const inputClass = `w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`;
  const selectClass = `${inputClass} appearance-none`;
  const errorClass = 'text-[11px] font-bold text-red-500 mt-1.5 block';

  const chipClass = (active) =>
    `px-3 py-2 rounded-lg text-[11px] font-extrabold border transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
      active
        ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
        : `${isDark ? 'bg-white/5 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-black/[0.06]'}`
    }`;

  const headerTitle = step === 'success' ? 'Status' : step === 'preview' ? 'Preview Post' : draft.id ? 'Edit Seeking Post' : 'Create Seeking Post';

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`} />
      </div>

      <div className={`px-4 pt-12 pb-3 flex items-center justify-between ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        {step === 'success' ? (
          <div className="w-10 h-10" />
        ) : (
          <button
            type="button"
            aria-label={step === 'preview' ? 'Back to edit' : 'Close'}
            onClick={() => (step === 'preview' ? setStep('form') : onClose())}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}
          >
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
        )}
        <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>{headerTitle}</h2>
        <div className="w-10 h-10" />
      </div>

      {step === 'form' && (
        <>
          <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6 space-y-6">
            <div className={`rounded-xl p-3.5 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft} flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-full ${isDark ? 'bg-white/10' : 'bg-white'} border ${t.borderSoft} flex items-center justify-center shrink-0`}>
                <User className={`w-4 h-4 ${t.text}`} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-extrabold ${t.text} truncate`}>{viewer.name}</p>
                  {viewer.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                </div>
                <p className={`text-[11px] font-bold ${t.textMuted} truncate`}>{viewer.department} · Batch {viewer.batch}</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Category <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {SEEKING_CATEGORIES.map((c) => (
                  <button key={c} type="button" onClick={() => setField('category', c)} aria-pressed={draft.category === c} className={chipClass(draft.category === c)}>{c}</button>
                ))}
              </div>
              {showErrors && errors.category && <span className={errorClass}>{errors.category}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} mb-0`} htmlFor="seeking-headline">Headline <span className="text-red-500">*</span></label>
                <span className={`text-[10px] font-extrabold ${draft.headline.length >= SEEKING_HEADLINE_MAX ? 'text-red-500' : t.textMuted}`}>
                  {draft.headline.length}/{SEEKING_HEADLINE_MAX}
                </span>
              </div>
              <input
                id="seeking-headline"
                type="text"
                value={draft.headline}
                maxLength={SEEKING_HEADLINE_MAX}
                onChange={(e) => setField('headline', e.target.value)}
                placeholder="e.g. Seeking Product Design Internship"
                className={inputClass}
              />
              {showErrors && errors.headline && <span className={errorClass}>{errors.headline}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} mb-0`} htmlFor="seeking-intro">Introduction <span className="text-red-500">*</span></label>
                <span className={`text-[10px] font-extrabold ${draft.intro.length >= SEEKING_INTRO_MAX ? 'text-red-500' : t.textMuted}`}>
                  {draft.intro.length}/{SEEKING_INTRO_MAX}
                </span>
              </div>
              <textarea
                id="seeking-intro"
                rows="5"
                value={draft.intro}
                maxLength={SEEKING_INTRO_MAX}
                onChange={(e) => setField('intro', e.target.value)}
                placeholder="Your background, relevant experience, strengths and the kind of opportunity you are looking for."
                className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm resize-none`}
              />
              {showErrors && errors.intro && <span className={errorClass}>{errors.intro}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} mb-0`} htmlFor="seeking-skill">Skills <span className="text-red-500">*</span></label>
                <span className={`text-[10px] font-extrabold ${t.textMuted}`}>{draft.skills.length}/{SEEKING_SKILLS_MAX}</span>
              </div>
              <div className="flex gap-2">
                <input
                  id="seeking-skill"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="e.g. Figma"
                  className={`flex-1 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim() || draft.skills.length >= SEEKING_SKILLS_MAX}
                  className={`h-12 px-5 rounded-xl text-xs font-extrabold transition-all ${
                    !skillInput.trim() || draft.skills.length >= SEEKING_SKILLS_MAX
                      ? `${isDark ? 'bg-white/5 text-white/30' : 'bg-black/5 text-black/30'} cursor-not-allowed`
                      : 'bg-[#1D9BF0] text-white shadow-sm active:scale-95'
                  }`}
                >
                  Add
                </button>
              </div>

              {draft.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {draft.skills.map((skill) => (
                    <span key={skill} className={`pl-3 pr-1.5 py-1.5 rounded-lg text-[11px] font-extrabold border flex items-center gap-1.5 ${isDark ? 'bg-white/5 text-gray-200 border-white/10' : 'bg-black/[0.03] text-gray-700 border-black/[0.06]'}`}>
                      {skill}
                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() => removeSkill(skill)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
                      >
                        <X className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-4 mb-2`}>Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SEEKING_SUGGESTED_SKILLS.filter((s) => !draft.skills.includes(s)).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className={chipClass(false)}>+ {s}</button>
                ))}
              </div>
              {showErrors && errors.skills && <span className={errorClass}>{errors.skills}</span>}
            </div>

            <div className={`pt-2 border-t ${t.borderSoft}`}>
              <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Work Preferences</h3>

              <label className={labelClass}>Work Mode</label>
              <div className="flex flex-wrap gap-2 mb-5">
                {SEEKING_WORK_MODES.map((m) => (
                  <button key={m} type="button" onClick={() => toggleWorkMode(m)} aria-pressed={draft.workMode.includes(m)} className={chipClass(draft.workMode.includes(m))}>{m}</button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="seeking-location">Location</label>
                  <input id="seeking-location" type="text" value={draft.location} onChange={(e) => setField('location', e.target.value)} placeholder="e.g. Dhaka, BD" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="seeking-availability">Availability</label>
                  <select id="seeking-availability" value={draft.availability} onChange={(e) => setField('availability', e.target.value)} className={selectClass}>
                    {SEEKING_AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="seeking-commitment">Commitment</label>
                  <select id="seeking-commitment" value={draft.commitment} onChange={(e) => setField('commitment', e.target.value)} className={selectClass}>
                    {SEEKING_COMMITMENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="seeking-duration">Preferred Duration</label>
                  <input id="seeking-duration" type="text" value={draft.preferredDuration} onChange={(e) => setField('preferredDuration', e.target.value)} placeholder="e.g. 3–6 months" className={inputClass} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass} htmlFor="seeking-compensation">Compensation Preference</label>
                <select id="seeking-compensation" value={draft.compensation} onChange={(e) => setField('compensation', e.target.value)} className={selectClass}>
                  {SEEKING_COMPENSATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className={`pt-2 border-t ${t.borderSoft}`}>
              <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Supporting Links</h3>
              <div className="space-y-4">
                {[
                  { key: 'resumeUrl', label: 'Resume', placeholder: 'https://…' },
                  { key: 'portfolioUrl', label: 'Portfolio', placeholder: 'https://…' },
                  { key: 'linkedInUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/…' },
                  { key: 'githubUrl', label: 'GitHub', placeholder: 'https://github.com/…' },
                  { key: 'otherUrl', label: 'Other URL', placeholder: 'https://…' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className={labelClass} htmlFor={`seeking-${field.key}`}>{field.label}</label>
                    <input
                      id={`seeking-${field.key}`}
                      type="url"
                      value={draft[field.key]}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={`pt-2 border-t ${t.borderSoft}`}>
              <h3 className={`text-sm font-extrabold ${t.text} tracking-tight mt-4 mb-4`}>Visibility & Duration</h3>
              <label className={labelClass}>Who can see this post</label>
              <div className="space-y-2 mb-5">
                {SEEKING_VISIBILITY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setField('visibility', option)}
                    aria-pressed={draft.visibility === option}
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all active:scale-[0.98] text-left ${
                      draft.visibility === option
                        ? `border-[#1D9BF0] ${isDark ? 'bg-[#1D9BF0]/10' : 'bg-blue-50'}`
                        : `${t.inputBorder} ${t.inputBg}`
                    }`}
                  >
                    <span className={`text-xs font-extrabold ${t.text}`}>{option}</span>
                    {draft.visibility === option && <CheckCircle2 className="w-4 h-4 text-[#1D9BF0] shrink-0 ml-2" strokeWidth={3} />}
                  </button>
                ))}
              </div>

              <label className={labelClass}>Post Duration</label>
              <div className="flex gap-2">
                {SEEKING_DURATIONS.map((d) => (
                  <button key={d} type="button" onClick={() => setField('duration', d)} aria-pressed={draft.duration === d} className={`flex-1 ${chipClass(draft.duration === d)}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>

          <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20`}>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!isValid}
              className={`w-full h-14 rounded-xl font-extrabold text-base transition-all ${
                isValid
                  ? 'active:scale-[0.97] bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40'
                  : 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
              }`}
            >
              Preview Talent Card
            </button>
          </div>
        </>
      )}

      {step === 'preview' && (
        <>
          <div className="flex-1 overflow-y-auto pb-32 relative z-10 px-5 pt-6">
            <p className={`text-xs font-bold ${t.textMuted} leading-relaxed mb-5`}>
              This is exactly how your post will appear in the Seeking feed. Long headlines are shortened and the
              introduction is limited to two lines.
            </p>
            <TalentCard talent={previewTalent} t={t} isDark={isDark} isSaved={false} previewMode />

            <div className={`mt-6 ${t.card} border ${t.border} rounded-2xl p-5 space-y-4`}>
              <SeekingDetailRow icon={Eye} label="Visibility" value={previewTalent.visibility} t={t} isDark={isDark} />
              <SeekingDetailRow icon={CalendarClock} label="Post Duration" value={draft.duration} t={t} isDark={isDark} />
              <SeekingDetailRow icon={Sparkles} label="Skills" value={draft.skills.join(', ')} t={t} isDark={isDark} />
            </div>
          </div>

          <div className={`absolute bottom-0 w-full p-5 pt-4 pb-8 ${t.glass} border-t z-20 flex gap-3`}>
            <button
              type="button"
              onClick={() => setStep('form')}
              className={`h-14 px-6 rounded-xl font-extrabold text-sm ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} active:scale-[0.97] transition-transform`}
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-14 rounded-xl font-extrabold text-base bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40 active:scale-[0.97] transition-transform"
            >
              Submit Post
            </button>
          </div>
        </>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 animate-fade-in-up pb-20">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20 shadow-xl shadow-yellow-500/10">
            <Clock className="w-12 h-12 text-yellow-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Post Submitted</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 max-w-xs leading-relaxed`}>
            Your Seeking Work post is being reviewed. You will be notified when it becomes visible.
          </p>
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={onViewMyPosts}
              className="w-full h-14 rounded-xl font-extrabold text-base bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40 active:scale-[0.97] transition-transform"
            >
              View My Posts
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`w-full h-14 rounded-xl font-extrabold text-base transition-all active:scale-[0.97] ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'} border ${t.borderSoft} shadow-sm`}
            >
              Back to Seeking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SEEKING: MY POSTS MANAGEMENT ---
const MY_SEEKING_SEGMENTS = ['Active', 'Pending', 'Paused', 'Expired', 'Drafts'];

const MY_SEEKING_EMPTY_COPY = {
  Active: { title: 'No active posts', description: 'Let the university network know what you are looking for.' },
  Pending: { title: 'Nothing waiting for review', description: 'Submitted posts appear here until they are approved.' },
  Paused: { title: 'No paused posts', description: 'Pause a post when you are not available for a while.' },
  Expired: { title: 'No expired posts', description: 'Posts that reach their end date will be listed here.' },
  Drafts: { title: 'No drafts saved', description: 'Start a post and it will be kept here until you submit it.' }
};

const MySeekingPostsOverlay = ({ posts, t, isDark, onClose, onCreate, onView, onEdit, onAction }) => {
  const [segment, setSegment] = useState('Active');
  const [menuPost, setMenuPost] = useState(null);

  const statusForSegment = { Active: 'active', Pending: 'pending', Paused: 'paused', Expired: 'expired', Drafts: 'draft' };
  const displayed = posts.filter((p) => p.status === statusForSegment[segment]);

  const countFor = (seg) => posts.filter((p) => p.status === statusForSegment[seg]).length;

  const actionsForPost = (post) => {
    const close = () => setMenuPost(null);
    const run = (action) => () => { close(); onAction(post.id, action); };
    const view = { label: post.status === 'pending' ? 'Preview' : 'View', icon: Eye, onClick: () => { close(); onView(post); } };
    const edit = { label: post.status === 'draft' ? 'Continue Editing' : 'Edit', icon: Edit, onClick: () => { close(); onEdit(post); } };
    const del = { label: 'Delete', icon: Trash2, isDestructive: true, onClick: run('delete') };

    switch (post.status) {
      case 'active':
        return [view, edit, { label: 'Pause', icon: Pause, onClick: run('pause') }, { label: 'Mark as Unavailable', icon: Ban, onClick: run('unavailable') }, del];
      case 'pending':
        return [view, edit, { label: 'Withdraw', icon: X, isDestructive: true, onClick: run('withdraw') }];
      case 'paused':
        return [view, { label: 'Resume', icon: Play, onClick: run('resume') }, edit, del];
      case 'expired':
        return [{ label: 'Renew', icon: RotateCcw, onClick: run('renew') }, { label: 'Duplicate', icon: Copy, onClick: run('duplicate') }, del];
      default:
        return [edit, del];
    }
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`} />
      </div>

      <div className={`px-4 pt-12 pb-3 ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button type="button" aria-label="Go back" onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>My Seeking Posts</h2>
          <button type="button" aria-label="Create a Seeking Work post" onClick={onCreate} className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-sm active:scale-95 transition-transform`}>
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {MY_SEEKING_SEGMENTS.map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => setSegment(seg)}
              aria-pressed={segment === seg}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all border shrink-0 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
                segment === seg
                  ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
                  : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'}`
              }`}
            >
              {seg}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${segment === seg ? 'bg-white/25 text-white' : 'bg-[#1D9BF0]/15 text-[#1D9BF0]'}`}>
                {countFor(seg)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10 relative z-10 space-y-3">
        {displayed.length > 0 ? (
          displayed.map((post) => (
            <div key={post.id} className={`rounded-2xl p-4 ${t.card} border ${t.border} ${t.cardShadow}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(post.category, isDark)}`}>
                    {post.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingStatusStyle(post.status, isDark)}`}>
                    {SEEKING_STATUS_LABEL[post.status]}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Actions for ${post.headline}`}
                  onClick={() => setMenuPost(post)}
                  className={`shrink-0 w-8 h-8 -mt-0.5 -mr-1 rounded-lg flex items-center justify-center ${t.textMuted} hover:${t.text} active:scale-90 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                >
                  <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              <h3 className={`text-[15px] font-extrabold ${t.text} tracking-tight leading-tight truncate`}>{post.headline}</h3>

              <p className={`text-[11px] font-bold ${t.textMuted} mt-1.5`}>
                {post.status === 'expired'
                  ? `Posted ${post.postedDate} · Expired`
                  : post.status === 'draft'
                    ? `Last edited ${post.postedDate}`
                    : `Posted ${post.postedDate} · ${post.expiresIn === '—' ? 'No end date' : `Expires in ${post.expiresIn}`}`}
              </p>

              <div className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t ${t.borderSoft}`}>
                {[
                  { icon: Eye, label: 'Views', value: post.views },
                  { icon: Bookmark, label: 'Saves', value: post.saves },
                  { icon: MessageSquare, label: 'Messages', value: post.messages }
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <stat.icon className={`w-3.5 h-3.5 ${t.textMuted} mb-1`} strokeWidth={2.5} />
                    <span className={`text-sm font-extrabold ${t.text} leading-none`}>{stat.value}</span>
                    <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-1`}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <SeekingEmptyState
            icon={segment === 'Drafts' ? Edit : Megaphone}
            t={t}
            isDark={isDark}
            title={MY_SEEKING_EMPTY_COPY[segment].title}
            description={MY_SEEKING_EMPTY_COPY[segment].description}
            actions={segment === 'Active' || segment === 'Drafts' ? [{ label: 'Create Seeking Post', onClick: onCreate, primary: true }] : []}
          />
        )}
      </div>

      {menuPost && (
        <SeekingActionSheet
          title={menuPost.headline}
          t={t}
          isDark={isDark}
          onClose={() => setMenuPost(null)}
          actions={actionsForPost(menuPost)}
        />
      )}
    </div>
  );
};

export default function App() {

  // --- EVENTS MODULE STATE ---
  const [isEventsModuleOpen, setIsEventsModuleOpen] = useState(false);
  const [selectedGlobalEvent, setSelectedGlobalEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set(['event-career-fair']));
  const [goingEventIds, setGoingEventIds] = useState(new Set());
  const [interestedEventIds, setInterestedEventIds] = useState(new Set(['event-ai-talk']));
  const [reminderEventIds, setReminderEventIds] = useState(new Set());
  const [followedOrganizerIds, setFollowedOrganizerIds] = useState(new Set(['organizer-acm']));

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
  const [viewerIndex, setViewerIndex] = useState(null); 
  const [noteViewerData, setNoteViewerData] = useState(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  
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

  // --- SEEKING WORK STATE ---
  const [jobsMode, setJobsMode] = useState('hiring'); // 'hiring' | 'seeking'
  const [seekingSegment, setSeekingSegment] = useState('All'); // 'All' | 'Relevant' | 'Saved'
  const [seekingSearch, setSeekingSearch] = useState('');
  const [seekingCategory, setSeekingCategory] = useState('All');
  const [seekingFilters, setSeekingFilters] = useState(EMPTY_SEEKING_FILTERS);
  const [isSeekingFilterOpen, setIsSeekingFilterOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [savedTalentIds, setSavedTalentIds] = useState(new Set(['talent-004', 'talent-011', 'talent-012']));
  const [isCreateSeekingOpen, setIsCreateSeekingOpen] = useState(false);
  const [createSeekingDraft, setCreateSeekingDraft] = useState(null);
  const [isMySeekingOpen, setIsMySeekingOpen] = useState(false);
  const [mySeekingPosts, setMySeekingPosts] = useState(globalMySeekingPosts);
  const [chatContext, setChatContext] = useState(null);

  const [emergencyViewMode, setEmergencyViewMode] = useState('list');
  const [isDonorAvailable, setIsDonorAvailable] = useState(true);
  const [directoryFilterBg, setDirectoryFilterBg] = useState(null); 

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

  const allDirectoryUsers = [...globalAlumniData, ...globalFacultyData, ...globalStudentData];

  const globalEmergencyRequests = [
    { id: 1, hospital: 'Apollo Hospital', location: 'Bashundhara, Dhaka', bg: 'B+', distance: '2.3km', urgency: 'Critical', units: 2, match: 'Perfect Match', time: '10m ago', description: 'Patient is undergoing open heart surgery. Blood is required immediately.', contact: '01711223344', patientName: 'Rahim Uddin' },
    { id: 2, hospital: 'Square Hospital', location: 'Panthapath, Dhaka', bg: 'O+', distance: '5.1km', urgency: 'Needed Today', units: 1, match: 'Compatible', time: '1h ago', description: 'Accident patient in ICU. Need O+ blood by tonight.', contact: '01811223344', patientName: 'Karim Hasan' }
  ];

  

  // --- SEEKING WORK HANDLERS ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const seekingActiveFilterCount = countSeekingFilters(seekingFilters);

  const handleToggleSavedTalent = (talentId) => {
    const wasSaved = savedTalentIds.has(talentId);
    setSavedTalentIds(prev => {
      const next = new Set(prev);
      if (next.has(talentId)) next.delete(talentId);
      else next.add(talentId);
      return next;
    });
    showToast(wasSaved ? 'Removed from saved profiles' : 'Profile saved');
  };

  const handleClearSeekingFilters = () => {
    setSeekingSearch('');
    setSeekingCategory('All');
    setSeekingFilters(EMPTY_SEEKING_FILTERS);
  };

  const handleViewAllTalent = () => {
    handleClearSeekingFilters();
    setSeekingSegment('All');
  };

  // Hands the conversation over to the existing Messages module, carrying the
  // Seeking post as context so the chat can show what it is regarding.
  const handleMessageTalent = (talent) => {
    if (!talent || isSeekingUnavailable(talent.status)) return;
    const name = talent.student?.name || 'NSU Student';
    setChatContext({
      peer: {
        name,
        role: 'Student',
        subtitle: `${talent.student?.department || 'NSU'} · Batch ${talent.student?.batch || '—'}`
      },
      seeking: { id: talent.id, headline: talent.headline, category: talent.category }
    });
    setSelectedTalent(null);
    setIsMySeekingOpen(false);
    setIsCreateSeekingOpen(false);
    setActiveTab('messages');
    setActiveOverlay('chat');
    showToast(`Opening chat with ${name.split(' ')[0]}`);
  };

  const handleOpenCreateSeeking = (draft = null) => {
    setCreateSeekingDraft(draft);
    setIsCreateSeekingOpen(true);
  };

  const handleSubmitSeekingPost = (post) => {
    setMySeekingPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      return exists ? prev.map(p => (p.id === post.id ? post : p)) : [post, ...prev];
    });
  };

  const handleMySeekingAction = (postId, action) => {
    const duplicateId = `my-seek-${Date.now()}`;
    setMySeekingPosts(prev => {
      switch (action) {
        case 'pause':
          return prev.map(p => (p.id === postId ? { ...p, status: 'paused' } : p));
        case 'resume':
          return prev.map(p => (p.id === postId ? { ...p, status: 'active' } : p));
        case 'renew':
          return prev.map(p => (p.id === postId ? { ...p, status: 'active', expiresIn: '30 days' } : p));
        case 'unavailable':
          return prev.map(p => (p.id === postId ? { ...p, status: 'paused', availability: 'Not available' } : p));
        case 'duplicate': {
          const original = prev.find(p => p.id === postId);
          if (!original) return prev;
          if (prev.some(p => p.id === duplicateId)) return prev;
          return [{ ...original, id: duplicateId, status: 'draft', postedDate: 'Today', views: 0, saves: 0, messages: 0 }, ...prev];
        }
        case 'delete':
        case 'withdraw':
          return prev.filter(p => p.id !== postId);
        default:
          return prev;
      }
    });

    const messages = {
      pause: 'Post paused',
      resume: 'Post is active again',
      renew: 'Post renewed for 30 days',
      unavailable: 'Marked as unavailable',
      duplicate: 'Post duplicated as a draft',
      delete: 'Post deleted',
      withdraw: 'Post withdrawn'
    };
    if (messages[action]) showToast(messages[action]);
  };

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
    <div className="flex flex-col items-center justify-center h-full bg-[#1D9BF0] relative overflow-hidden transition-colors duration-500">
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        {/* Replace with your transparent WHITE ICON Cloudinary URL */}
        <img 
          src="https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041907/Urads_Trans_300x-8_r97jck.png" 
          alt="Ugrads Logo" 
          className="w-72 h-72 object-contain" 
        />
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className={`flex flex-col items-center justify-center h-full px-6 pt-12 pb-8 transition-colors duration-500 animate-fade-in relative z-10`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full animate-fade-in-up">
        
        {/* Replace these URLs with your Cloudinary URLs */}
        <img 
          src={isDark ? "https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041954/Icon_300x-8_l1gnkq.png" : "https://res.cloudinary.com/ddgxqqe6t/image/upload/v1784041954/Icon_300x-8_l1gnkq.png"} 
          alt="Ugrads Logo" 
          className="w-36 h-36 mb-6 object-contain" 
        />
        
        <h1 className={`text-xl font-semibold tracking-tight text-center ${t.text}`}>Connect. Grow. Support.</h1>
        <p className={`text-sm mt-2 text-center ${t.textMuted} px-4`}>North South University Verified Network</p>
      </div>
      <div className="w-full mt-auto space-y-3 animate-fade-in delay-150">
        <button onClick={() => { setAuthMode('login'); setCurrentView('auth_main'); }} className={`w-full h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-sm`}>
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
                   <div className="bg-[#1D9BF0] text-white rounded-full flex items-center justify-center animate-in zoom-in duration-200 shadow-sm">
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
           className={`w-full h-14 rounded-xl text-base font-extrabold transition-all active:scale-[0.97] outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-[#1D9BF0] text-white shadow-sm`}
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

              <button onClick={handleAction} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] bg-[#1D9BF0] text-white mt-8 shadow-sm hover:bg-[#1A8CD8]">
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

              <button onClick={handleAction} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.98] bg-[#1D9BF0] text-white mt-8 shadow-sm hover:bg-[#1A8CD8]">
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

        <button onClick={() => setCurrentView('main')} className="w-full h-14 rounded-xl font-extrabold text-[15px] transition-all active:scale-[0.97] bg-[#1D9BF0] text-white shadow-sm hover:bg-[#1A8CD8]">
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

    // Set your different image URLs for light and dark mode here
    const headerBgImageLight = 'https://res.cloudinary.com/ddgxqqe6t/image/upload/v1773175854/NSU_BUILDING_LINE_ART_F2_y7e2az.svg';
    const headerBgImageDark = 'https://res.cloudinary.com/ddgxqqe6t/image/upload/v1773175855/NSU_BUILDING_LINE_ART_F_pk87bc.svg'; // Replace with dark version URL
    const currentBgImage = isDark ? headerBgImageDark : headerBgImageLight;

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
      <div className="flex flex-col h-full overflow-y-auto pb-36 px-5 pt-0 space-y-6 animate-fade-in relative z-10">
        
        {/* Top Header Banner with SVG Background */}
        <div className="relative -mx-5 px-5 pt-12 pb-2 rounded-b-[2.5rem]">
          {/* SVG Background */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-100"
            style={{
              backgroundImage: `url('${currentBgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center -15px',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#1D9BF0]" strokeWidth={3} />
                  <span className="text-[10px] font-extrabold text-[#1D9BF0] tracking-wide uppercase drop-shadow-sm">
                    Verified NSU {authRole.charAt(0).toUpperCase() + authRole.slice(1)}
                  </span>
                </div>
                <h1 className={`text-3xl font-extrabold ${t.text} tracking-tight leading-tight drop-shadow-sm`}>
                  Hi, {authRole === 'student' ? 'Hasan' : authRole === 'alumni' ? 'Nusrat' : 'Dr. Hasan'} <span className="text-2xl inline-block origin-bottom-right animate-wave">👋</span>
                </h1>
                <p className={`${t.textMuted} text-xs font-bold mt-1 drop-shadow-sm`}>
                  {authRole === 'student' ? 'CSE • Batch 221' : authRole === 'alumni' ? 'Software Eng • Batch 19' : 'Professor • CSE'}
                </p>
              </div>

              <div className="flex space-x-2 mt-1">
                <button onClick={toggleTheme} className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white'} border flex items-center justify-center transition-colors shadow-sm backdrop-blur-md`}>
                  {isDark ? <Sun className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} /> : <Moon className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />}
                </button>
                <button onClick={() => setActiveOverlay('notifications')} className={`w-9 h-9 rounded-xl ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/80 border-white'} border flex items-center justify-center transition-colors shadow-sm backdrop-blur-md relative active:scale-95`}>
                  <Bell className={`w-5 h-5 ${t.text}`} strokeWidth={2.5} />
                  <span className={`absolute top-1 right-1 w-2.5 h-2.5 bg-[#1D9BF0] border-[2px] ${isDark ? 'border-[#1E1E1E]' : 'border-white'} rounded-full`}></span>
                </button>
              </div>
            </div>

            <div className="w-full mt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider drop-shadow-sm`}>Profile Strength</span>
                <span className={`text-[10px] font-extrabold text-[#1D9BF0] drop-shadow-sm`}>80%</span>
              </div>
              <div className={`h-1.5 w-full ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden shadow-inner`}>
                <div className="h-full bg-[#1D9BF0] w-[80%] rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
        {/* --- MOMENTS FEATURE --- */}
        <div className="relative -mt-2 mb-2">
          <MomentsRow 
            moments={globalMomentsData} 
            isDark={isDark} 
            t={t} 
            onOpenViewer={(index) => setViewerIndex(index)}
            onOpenNote={(momentGroup) => setNoteViewerData(momentGroup)}
            onCreateClick={() => setIsCreateSheetOpen(true)}
          />
        </div>
        {/* --- END MOMENTS FEATURE --- */}

        <AdCarousel ads={demoAds} isDark={isDark} />

        {/* Redesigned Quick Actions: Custom Layered Icons + Label */}
        <div className="w-full pt-0 pb-2 relative z-10">
          <div className="flex flex-row items-start justify-between w-full px-4">
            {[
              { icon: CustomAlumniIcon, label: 'Network', action: () => setActiveTab('directory') },
              { icon: CustomJobsIcon, label: 'Jobs', action: () => setActiveTab('jobs') },
              { icon: CustomEventsIcon, label: 'Events', action: () => setIsEventsModuleOpen(true) },
              { icon: CustomEmergencyIcon, label: 'Emergency', action: () => setActiveTab('emergency') },
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

        {/* --- MOVED FEATURED EVENTS CAROUSEL --- */}
        <div className="mt-6 mb-4">
          <div className="flex justify-between items-end mb-4 relative z-10 px-1">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight`}>Featured Events</h3>
            <button className="text-[#1D9BF0] font-bold text-sm hover:underline" onClick={() => setIsEventsModuleOpen(true)}>See All</button>
          </div>
          <FeaturedEventsCarousel 
            events={globalEventsData.filter(e => e.featured)} 
            onEventClick={(e) => setSelectedGlobalEvent(e)} 
            t={t} isDark={isDark} 
            registeredEventIds={registeredEventIds} 
          />
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
      // Opening a conversation from the list clears any Seeking hand-off context.
      setChatContext(null);
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
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .ease-spring { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes heartFly {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          50% { transform: translateY(-60px) scale(1.5) rotate(-15deg); opacity: 0.8; }
          100% { transform: translateY(-120px) scale(1) rotate(15deg); opacity: 0; }
        }
        .animate-heart-fly { animation: heartFly 0.8s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-wave { animation: wave 2.5s infinite; transform-origin: 70% 70%; display: inline-block; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className={`min-h-[100dvh] flex justify-center font-jakarta antialiased selection:bg-[#1D9BF0]/30 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
        <div className={`w-full max-w-[430px] h-[100dvh] ${t.bg} relative overflow-hidden flex flex-col transition-colors duration-500 shadow-2xl`}>
          
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
                  {activeTab === 'jobs' && <JobsTab
                    t={t} isDark={isDark} authRole={authRole}
                    jobs={globalJobsData} directoryUsers={allDirectoryUsers}
                    jobSegment={jobSegment} setJobSegment={setJobSegment}
                    jobFilter={jobFilter} setJobFilter={setJobFilter}
                    onSelectJob={setSelectedJob} onSelectUser={setSelectedUser}
                    onPostJob={() => setIsPostJobOpen(true)}
                    jobsMode={jobsMode} setJobsMode={setJobsMode}
                    seekingTalent={globalSeekingData}
                    seekingSegment={seekingSegment} setSeekingSegment={setSeekingSegment}
                    seekingSearch={seekingSearch} setSeekingSearch={setSeekingSearch}
                    seekingCategory={seekingCategory} setSeekingCategory={setSeekingCategory}
                    seekingFilters={seekingFilters}
                    seekingFilterCount={seekingActiveFilterCount}
                    onOpenSeekingFilters={() => setIsSeekingFilterOpen(true)}
                    savedTalentIds={savedTalentIds}
                    onToggleSaveTalent={handleToggleSavedTalent}
                    onOpenTalent={setSelectedTalent}
                    onMessageTalent={handleMessageTalent}
                    onCreateSeeking={() => handleOpenCreateSeeking(null)}
                    onOpenMySeekingPosts={() => setIsMySeekingOpen(true)}
                    onClearSeekingFilters={handleClearSeekingFilters}
                    onViewAllTalent={handleViewAllTalent}
                  />}
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
            {activeOverlay === 'chat' && <ChatOverlay
              t={t} isDark={isDark}
              chatContext={chatContext} setChatContext={setChatContext}
              setActiveOverlay={setActiveOverlay}
            />}
            {activeOverlay === 'notifications' && <NotificationsOverlay />}
            {/* --- EVENTS OVERLAY --- */}
            {isEventsModuleOpen && (
              <EventsModuleOverlay
                onClose={() => setIsEventsModuleOpen(false)}
                t={t}
                isDark={isDark}
                authRole={authRole}
                setToastMsg={setToastMsg}
                registeredEventIds={registeredEventIds}
                setRegisteredEventIds={setRegisteredEventIds}
                goingEventIds={goingEventIds}
                setGoingEventIds={setGoingEventIds}
                interestedEventIds={interestedEventIds}
                setInterestedEventIds={setInterestedEventIds}
                reminderEventIds={reminderEventIds}
                setReminderEventIds={setReminderEventIds}
                followedOrganizerIds={followedOrganizerIds}
                setFollowedOrganizerIds={setFollowedOrganizerIds}
              />
            )}
            {/* --- MOMENTS OVERLAYS --- */}
            {viewerIndex !== null && (
              <MomentViewer 
                moments={globalMomentsData} 
                initialUserIndex={viewerIndex} 
                onClose={() => setViewerIndex(null)}
                t={t}
                isDark={isDark}
              />
            )}

            {noteViewerData !== null && (
              <NoteViewerOverlay 
                data={noteViewerData}
                onClose={() => setNoteViewerData(null)}
                t={t}
                isDark={isDark}
              />
            )}

            {isCreateSheetOpen && (
              <CreateMomentSheet 
                onClose={() => setIsCreateSheetOpen(false)}
                t={t}
                isDark={isDark}
              />
            )}
            {/* --- END MOMENTS OVERLAYS --- */}
            {/* --- GLOBAL EVENT DETAILS OVERLAY --- */}
            {selectedGlobalEvent && (
              <EventDetailsScreen 
                event={selectedGlobalEvent} 
                navigateTo={() => {}} 
                onBack={() => setSelectedGlobalEvent(null)} 
                t={t} isDark={isDark} setToastMsg={setToastMsg}
                registeredEventIds={registeredEventIds} setRegisteredEventIds={setRegisteredEventIds}
                goingEventIds={goingEventIds} setGoingEventIds={setGoingEventIds}
                interestedEventIds={interestedEventIds} setInterestedEventIds={setInterestedEventIds}
                reminderEventIds={reminderEventIds} setReminderEventIds={setReminderEventIds}
                followedOrganizerIds={followedOrganizerIds} setFollowedOrganizerIds={setFollowedOrganizerIds}
                allEvents={globalEventsData}
              />
            )}
            {selectedJob && (
              <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />
            )}

            {/* --- SEEKING WORK OVERLAYS --- */}
            <SeekingFiltersSheet
              open={isSeekingFilterOpen}
              filters={seekingFilters}
              t={t}
              isDark={isDark}
              onClose={() => setIsSeekingFilterOpen(false)}
              onApply={(next) => {
                setSeekingFilters(next);
                setIsSeekingFilterOpen(false);
                const count = countSeekingFilters(next);
                showToast(count > 0 ? `${count} filter${count > 1 ? 's' : ''} applied` : 'Filters cleared');
              }}
            />

            {isMySeekingOpen && authRole === 'student' && (
              <MySeekingPostsOverlay
                posts={mySeekingPosts}
                t={t}
                isDark={isDark}
                onClose={() => setIsMySeekingOpen(false)}
                onCreate={() => handleOpenCreateSeeking(null)}
                onView={(post) => setSelectedTalent(post)}
                onEdit={(post) => handleOpenCreateSeeking(seekingDraftFromPost(post))}
                onAction={handleMySeekingAction}
              />
            )}

            {isCreateSeekingOpen && authRole === 'student' && (
              <CreateSeekingOverlay
                key={createSeekingDraft?.id || 'new-seeking-post'}
                t={t}
                isDark={isDark}
                authRole={authRole}
                initialDraft={createSeekingDraft}
                onToast={showToast}
                onClose={() => { setIsCreateSeekingOpen(false); setCreateSeekingDraft(null); }}
                onSubmit={handleSubmitSeekingPost}
                onViewMyPosts={() => {
                  setIsCreateSeekingOpen(false);
                  setCreateSeekingDraft(null);
                  setIsMySeekingOpen(true);
                }}
              />
            )}

            {selectedTalent && (
              <TalentDetailsOverlay
                talent={selectedTalent}
                t={t}
                isDark={isDark}
                isSaved={savedTalentIds.has(selectedTalent.id)}
                onToggleSave={handleToggleSavedTalent}
                onBack={() => setSelectedTalent(null)}
                onMessage={handleMessageTalent}
                onToast={showToast}
              />
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

