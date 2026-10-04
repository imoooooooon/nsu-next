import { getDepartmentState, subscribeDepartmentState } from '../../../src/shared/departmentStore';
/* Events demo data — identical to the shipped mobile prototype.
   All "past / upcoming" logic is computed against this fixed reference date. */

export const EVENTS_REFERENCE_DATE = new Date('2026-07-12T12:00:00');

export const EVENT_CATEGORIES = ['All', 'Academic', 'Workshop', 'Competition', 'Career', 'Recruitment', 'Networking', 'Research', 'Cultural', 'Sports', 'Volunteer'];

const seedEventsData = [
  {
    id: 'event-career-fair',
    title: 'NSU Career Fair Summer 2026',
    shortDescription: 'Meet leading employers and explore graduate opportunities directly on campus.',
    description: 'The official NSU Career Fair connects students with over 50 top national and multinational companies. Bring your resumes, participate in on-the-spot interviews, and discover your next internship or full-time role. Registration is mandatory for entry.',
    category: 'Career',
    organizer: {
      id: 'org-1', name: 'Career and Placement Center (CPC)', type: 'University Office', verified: true,
      description: 'Official career support office of North South University.'
    },
    postedBy: { name: 'Tahsina Rahman', role: 'Career and Placement Center' },
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
    deptId: 'cse',
    organizer: {
      id: 'org-2', name: 'CSE Department', type: 'Department', verified: true,
      description: 'Department of Computer Science & Engineering.'
    },
    postedBy: { name: 'CSE Department', role: 'Department account' },
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
    coOrganizers: [{ name: 'NSU Design Lab', type: 'Club' }],
    postedBy: { name: 'Abrar Fahim', role: 'Student · CSE' },
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
      id: 'org-3', name: 'NSU Admissions Office', type: 'University Office', verified: true,
      description: 'Official admissions and registrar office.'
    },
    postedBy: { name: 'NSU Admissions Office', role: 'University office account' },
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
    postedBy: { name: 'Career and Placement Center (CPC)', role: 'University office account' },
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
  },
  {
    id: 'event-cse-hackathon',
    title: 'CSE Project Showcase & Hackathon',
    shortDescription: 'Thirty-six hours, 60 teams, and the best capstone projects of the semester on show.',
    description: 'The CSE Department’s flagship end-of-semester event. Capstone teams demo their projects to faculty and industry judges on day one; day two is an open hackathon on the theme “Tech for Bangladesh”. Prizes for the top three teams and internship interviews with partner companies.',
    category: 'Competition',
    deptId: 'cse',
    organizer: {
      id: 'org-2', name: 'CSE Department', type: 'Department', verified: true,
      description: 'Department of Computer Science & Engineering.'
    },
    coOrganizers: [{ name: 'NSU ACM Student Chapter', type: 'Club' }],
    postedBy: { name: 'CSE Department', role: 'Department account' },
    date: '2026-07-30', endDate: '2026-07-31', time: '9:00 AM', endTime: '9:00 PM',
    venue: 'SAC Atrium', venueDetails: 'South Academic Building, Ground Floor.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    registrationStatus: 'Open', registrationDeadline: '2026-07-26T23:59:00', capacity: 300,
    goingCount: 184, interestedCount: 410, featured: false, popular: true,
    recommendationReason: 'From your department',
    schedule: [
      { time: 'Day 1 - 9:00 AM', title: 'Capstone Showcase' },
      { time: 'Day 1 - 3:00 PM', title: 'Hackathon Kick-off' },
      { time: 'Day 2 - 6:00 PM', title: 'Judging & Awards' }
    ],
    registrationInfo: 'Teams of 2–4. At least one member must be a current CSE student.',
    tags: ['Hackathon', 'Capstone', 'CSE'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-cse-alumni-talk',
    title: 'Alumni Tech Talk: Careers in Cloud',
    shortDescription: 'Tanvir Hasan (AWS, Batch 15) on building a cloud career from Dhaka.',
    description: 'CSE alumnus Tanvir Hasan, Cloud Solutions Architect at AWS Singapore, talks about certifications, remote roles and what hiring managers look for. Followed by an open Q&A and CV clinic with the CSE industry internship coordinator.',
    category: 'Career',
    deptId: 'cse',
    organizer: {
      id: 'org-2', name: 'CSE Department', type: 'Department', verified: true,
      description: 'Department of Computer Science & Engineering.'
    },
    coOrganizers: [{ name: 'Tanvir Hasan', type: 'Individual' }],
    postedBy: { name: 'CSE Department', role: 'Department account' },
    date: '2026-08-05', endDate: '2026-08-05', time: '2:30 PM', endTime: '4:30 PM',
    venue: 'SAC 1042 Seminar Room', venueDetails: 'South Academic Building, Level 10.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
    registrationStatus: 'Open', registrationDeadline: '2026-08-04T23:59:00', capacity: 120,
    goingCount: 62, interestedCount: 140, featured: false, popular: false,
    recommendationReason: 'From your department',
    schedule: [
      { time: '2:30 PM', title: 'Talk: Careers in Cloud' },
      { time: '3:30 PM', title: 'Q&A and CV Clinic' }
    ],
    registrationInfo: 'Free for NSU students and alumni. Seats are first come, first served.',
    tags: ['Alumni', 'Cloud', 'Career'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-ece-iot-expo',
    title: 'ECE IoT & Robotics Expo',
    shortDescription: 'Live demos from the VLSI, IoT and robotics labs — open to the whole campus.',
    description: 'The ECE Department opens its labs for a day of live demos: smart-farming sensors, line-following robots, a RISC-V core on FPGA and more. Industry partners from Samsung R&D and Robi Axiata judge the student project track.',
    category: 'Research',
    deptId: 'ece',
    organizer: {
      id: 'org-dept-ece', name: 'ECE Department', type: 'Department', verified: true,
      description: 'Department of Electrical & Computer Engineering.'
    },
    coOrganizers: [{ name: 'NSU Robotics Club', type: 'Club' }],
    postedBy: { name: 'ECE Department', role: 'Department account' },
    date: '2026-07-28', endDate: '2026-07-28', time: '10:00 AM', endTime: '4:00 PM',
    venue: 'SAC 0915 Lab Wing', venueDetails: 'South Academic Building, Level 9.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    registrationStatus: 'Free Entry', registrationDeadline: null, capacity: 400,
    goingCount: 96, interestedCount: 220, featured: false, popular: false,
    recommendationReason: null,
    schedule: [
      { time: '10:00 AM', title: 'Labs Open' },
      { time: '1:00 PM', title: 'Student Project Judging' }
    ],
    registrationInfo: 'No registration needed. Bring your NSU ID.',
    tags: ['IoT', 'Robotics', 'ECE'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-bba-case-competition',
    title: 'SBE Case Competition 2026',
    shortDescription: 'Crack a live business case from a partner bank in 48 hours.',
    description: 'Teams of four receive a live case from a partner bank and present their recommendation to a panel of senior bankers and faculty. Winners receive a cash prize and fast-track interviews for the partner’s management-trainee programme.',
    category: 'Competition',
    deptId: 'bba',
    organizer: {
      id: 'org-dept-bba', name: 'Accounting & Finance Department', type: 'Department', verified: true,
      description: 'Department of Accounting & Finance, School of Business & Economics.'
    },
    postedBy: { name: 'Accounting & Finance Department', role: 'Department account' },
    date: '2026-08-02', endDate: '2026-08-02', time: '10:00 AM', endTime: '5:00 PM',
    venue: 'NAC Auditorium', venueDetails: 'North Academic Building, Level 2.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    registrationStatus: 'Closing Soon', registrationDeadline: '2026-07-18T23:59:00', capacity: 160,
    goingCount: 128, interestedCount: 260, featured: false, popular: true,
    recommendationReason: null,
    schedule: [
      { time: '10:00 AM', title: 'Case Release' },
      { time: '3:00 PM', title: 'Final Presentations' }
    ],
    registrationInfo: 'Teams of four. Open to all SBE students.',
    tags: ['Case Competition', 'Finance', 'Business'],
    notificationType: null, notificationMessage: null
  },
  {
    id: 'event-arc-thesis-exhibition',
    title: 'Architecture Thesis Exhibition 2026',
    shortDescription: 'Final-year thesis projects on building for a delta — models, drawings and juries.',
    description: 'The annual thesis exhibition of the Department of Architecture. Twenty-four final-year projects on climate-responsive housing, heritage and waterfront design, with public juries every afternoon. Open to the whole campus.',
    category: 'Cultural',
    deptId: 'architecture',
    organizer: {
      id: 'org-dept-architecture', name: 'Architecture Department', type: 'Department', verified: true,
      description: 'Department of Architecture.'
    },
    postedBy: { name: 'Architecture Department', role: 'Department account' },
    date: '2026-07-20', endDate: '2026-07-24', time: '11:00 AM', endTime: '6:00 PM',
    venue: 'NAC Gallery', venueDetails: 'North Academic Building, Level 4.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop',
    registrationStatus: 'Free Entry', registrationDeadline: null, capacity: 600,
    goingCount: 210, interestedCount: 380, featured: false, popular: false,
    recommendationReason: null,
    schedule: [
      { time: '11:00 AM', title: 'Gallery Opens' },
      { time: '3:00 PM', title: 'Public Thesis Jury' }
    ],
    registrationInfo: 'Free entry for everyone with a campus ID.',
    tags: ['Architecture', 'Exhibition', 'Thesis'],
    notificationType: null, notificationMessage: null
  }
];

/* Organizers vs Posted by (client revision):
   · `organizer` is the LEAD organizer — the one the Follow button follows
     and the cards print — and `coOrganizers` are the rest. Each has a
     `type` from the Organizer Type list (Club, Department, University
     Office, External Partner, Individual).
   · `postedBy` is the account that published the event: metadata, shown
     read-only, never counted as an organizer.
   The public page reads them as "Organized by: …" and "Posted by: …". */
export const getEventOrganizers = (event) => [event.organizer, ...(event.coOrganizers || [])].filter(Boolean);

export const findEventById = (id) => globalEventsData.find(e => e.id === id) || null;

/* Events a department hosts. There is ONE campus calendar: a department event
   is an ordinary event carrying `deptId`, so it shows on /events and on the
   hub without two lists that could drift apart (the same rule the hub
   follows for jobs and blood requests). "Upcoming" = ends on or after the
   reference date and not cancelled — soonest first. */
export const isUpcomingEvent = (event) =>
  event.registrationStatus !== 'Cancelled' &&
  new Date(`${event.endDate || event.date}T23:59:59`) >= EVENTS_REFERENCE_DATE;

export const getDepartmentEvents = (deptId) =>
  globalEventsData
    .filter(e => e.deptId === deptId && isUpcomingEvent(e))
    .sort((a, b) => a.date.localeCompare(b.date));

export let globalEventsData = [...seedEventsData, ...getDepartmentState().events];
subscribeDepartmentState(() => { globalEventsData = [...seedEventsData, ...getDepartmentState().events]; });
