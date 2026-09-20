/* Events demo data — identical to the shipped mobile prototype.
   All "past / upcoming" logic is computed against this fixed reference date. */

export const EVENTS_REFERENCE_DATE = new Date('2026-07-12T12:00:00');

export const EVENT_CATEGORIES = ['All', 'Academic', 'Workshop', 'Competition', 'Career', 'Recruitment', 'Networking', 'Research', 'Cultural', 'Sports', 'Volunteer'];

export const globalEventsData = [
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

export const findEventById = (id) => globalEventsData.find(e => e.id === id) || null;
