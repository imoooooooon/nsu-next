import { publicRows, subscribeBridge } from '../../../../src/shared/adminBridge.js';
export const globalSeekingData = [
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
export const globalMySeekingPosts = [
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

const bridgeSeed = structuredClone(globalSeekingData);
const refreshPublicRecords = () => { globalSeekingData.splice(0, globalSeekingData.length, ...publicRows('seeking', bridgeSeed)); };
refreshPublicRecords();
subscribeBridge(refreshPublicRecords);
