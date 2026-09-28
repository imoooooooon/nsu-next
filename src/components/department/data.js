/* Department (Entity Profile) demo data.
   Keep these records byte-identical with the web app's
   `webapp/src/data/departments.js` — clients compare surfaces. */

export const globalDepartments = [
  {
    id: 'cse',
    code: 'CSE',
    short: 'CSE',
    name: 'Computer Science & Engineering',
    school: 'School of Engineering & Physical Sciences',
    departmentId: 'NSU-DEPT-CSE-01',
    verified: true,
    established: '1993',
    about: "The Department of Computer Science & Engineering at North South University is the country's first private-university CSE programme, accredited by IEB and BAETE. We run 14 research labs across AI, HCI, networks and systems, and place over 400 graduates into industry every year. This hub is the department's official channel for notices, office hours, opportunities and student support.",
    office: 'SAC 1042, NSU Campus, Bashundhara',
    email: 'cse@northsouth.edu',
    phone: '+880 2 55668200 Ext. 1502',
    website: 'northsouth.edu/cse',
    officeHours: 'Sun – Thu · 9:00 AM – 5:00 PM',
    stats: { students: 3120, alumni: 8940, faculty: 62 },
    chairId: 101,
    officialId: 101,
    adminIds: [106],
    broadcastChannelId: 'dept-cse-broadcast',
    helpDeskId: 'dept-cse-helpdesk',
    memberCount: 12122,
    emailReach: 11840,
  },
  {
    id: 'ece',
    code: 'ECE',
    short: 'ECE',
    name: 'Electrical & Computer Engineering',
    school: 'School of Engineering & Physical Sciences',
    departmentId: 'NSU-DEPT-ECE-01',
    verified: true,
    established: '1998',
    about: 'The Department of Electrical & Computer Engineering combines power, electronics, embedded systems and communication engineering under one roof. Our VLSI and IoT labs support both undergraduate capstone projects and funded research collaborations with industry partners across Bangladesh.',
    office: 'SAC 0915, NSU Campus, Bashundhara',
    email: 'ece@northsouth.edu',
    phone: '+880 2 55668200 Ext. 1611',
    website: 'northsouth.edu/ece',
    officeHours: 'Sun – Thu · 9:00 AM – 4:30 PM',
    stats: { students: 1840, alumni: 4210, faculty: 38 },
    chairId: 103,
    officialId: 103,
    adminIds: [],
    broadcastChannelId: 'dept-ece-broadcast',
    helpDeskId: 'dept-ece-helpdesk',
    memberCount: 6088,
    emailReach: 5920,
  },
  {
    id: 'bba',
    code: 'BBA',
    short: 'BBA',
    name: 'Department of Accounting & Finance',
    school: 'School of Business & Economics',
    departmentId: 'NSU-DEPT-BBA-01',
    verified: true,
    established: '1993',
    about: 'The School of Business & Economics runs the largest undergraduate programme at NSU. The department maintains an active corporate advisory board, a CFA-aligned finance track and a placement pipeline into every major bank and MNC operating in Bangladesh.',
    office: 'NAC 812, NSU Campus, Bashundhara',
    email: 'sbe@northsouth.edu',
    phone: '+880 2 55668200 Ext. 1720',
    website: 'northsouth.edu/sbe',
    officeHours: 'Sun – Thu · 8:30 AM – 5:00 PM',
    stats: { students: 4380, alumni: 11260, faculty: 74 },
    chairId: 108,
    officialId: 104,
    adminIds: [],
    broadcastChannelId: 'dept-bba-broadcast',
    helpDeskId: 'dept-bba-helpdesk',
    memberCount: 15714,
    emailReach: 15020,
  },
  {
    id: 'architecture',
    code: 'Architecture',
    short: 'ARC',
    name: 'Department of Architecture',
    school: 'School of Humanities & Social Sciences',
    departmentId: 'NSU-DEPT-ARC-01',
    verified: true,
    established: '2006',
    about: 'The Department of Architecture trains designers who build for a delta. Studio work runs from climate-responsive housing to heritage conservation, supported by a fabrication workshop and an annual thesis exhibition open to the whole campus.',
    office: 'NAC 405, NSU Campus, Bashundhara',
    email: 'architecture@northsouth.edu',
    phone: '+880 2 55668200 Ext. 1805',
    website: 'northsouth.edu/architecture',
    officeHours: 'Sun – Thu · 9:00 AM – 5:00 PM',
    stats: { students: 620, alumni: 1140, faculty: 21 },
    chairId: 109,
    officialId: null,
    adminIds: [],
    broadcastChannelId: 'dept-architecture-broadcast',
    helpDeskId: 'dept-architecture-helpdesk',
    memberCount: 1781,
    emailReach: 1702,
  },
];

/* `chairId` is the Department Chair — the academic head, who always tops the
   hub's officials list. `officialId` is whoever holds the hub's master key
   (often the Chair, sometimes a coordinator the Chair appointed), and
   `adminIds` are the faculty the Official delegated to. Three different
   questions — who leads, who owns the account, who helps run it — so three
   fields, even when one person answers two of them. */

export const findDepartmentById = (id) =>
  globalDepartments.find(d => String(d.id) === String(id)) || null;

/* Departments are keyed by `id` but people records carry the display `code`
   (CSE, ECE, BBA, Architecture) — this bridges the two. */
export const findDepartmentByCode = (code) =>
  globalDepartments.find(d => d.code.toLowerCase() === String(code || '').toLowerCase()) || null;

/* ---------------------------------------------------------------------------
   Broadcast history — what the channel already holds when you open it.
   `emailed: true` is a message that went out with Dual-Broadcast armed.
--------------------------------------------------------------------------- */
export const departmentBroadcasts = {
  cse: [
    {
      id: 'bc-cse-1',
      title: 'Summer 2026 midterm schedule published',
      body: 'The midterm schedule for all CSE sections is now on the portal. Seat plans will follow by Thursday. Students with a clash must email the office within 48 hours.',
      author: 'Dr. Aminul Islam',
      time: 'Mon · 10:12 AM',
      emailed: false,
    },
    {
      id: 'bc-cse-2',
      title: 'Lab 4 closed for hardware migration',
      body: 'SAC 1042 Lab 4 will remain closed Wednesday through Friday while the GPU cluster is migrated. CSE 465 sections move to Lab 2 for that week.',
      author: 'Mr. Rashedul Karim',
      time: 'Tue · 4:40 PM',
      emailed: false,
    },
    {
      id: 'bc-cse-3',
      title: 'URGENT: Registration closes tonight at 11:59 PM',
      body: 'Advising for Summer 2026 closes tonight. Students who have not completed payment will be dropped from all sections automatically. Contact the department office immediately if you are blocked.',
      author: 'Dr. Aminul Islam',
      time: '35m ago',
      emailed: true,
    },
  ],
  ece: [
    {
      id: 'bc-ece-1',
      title: 'VLSI lab orientation for new batches',
      body: 'Orientation for the VLSI and embedded systems labs runs Sunday at 11:00 AM in SAC 0915. Attendance is required before lab access is granted.',
      author: 'Dr. Shazzad Hosain',
      time: 'Yesterday',
      emailed: false,
    },
  ],
  bba: [
    {
      id: 'bc-bba-1',
      title: 'Corporate advisory session — seats open',
      body: 'Forty seats are open for the corporate advisory session with partner banks on the 24th. Register through the department office.',
      author: 'Ms. Nabila Rahman',
      time: '2d ago',
      emailed: false,
    },
  ],
  architecture: [],
};

/* ---------------------------------------------------------------------------
   Help Desk — the admin's private 1-on-1 inbox (brief §3).
   Each entry is one student's thread with the department.
--------------------------------------------------------------------------- */
export const departmentHelpDeskThreads = {
  cse: [
    {
      id: 'hd-cse-201',
      personId: 203,
      name: 'Abrar Fahim',
      role: 'Student',
      subtitle: 'CSE · Batch 232',
      msg: 'Assalamu alaikum sir, I was dropped from CSE 331 after the payment deadline. Can the section still be reinstated?',
      time: '12m ago',
      unread: true,
      online: true,
    },
    {
      id: 'hd-cse-202',
      personId: 204,
      name: 'Mehzabin Oishee',
      role: 'Student',
      subtitle: 'ECE · Batch 221',
      msg: 'Is the thesis proposal template on the portal the updated one for this semester?',
      time: '1h ago',
      unread: true,
      online: true,
    },
    {
      id: 'hd-cse-203',
      personId: 1,
      name: 'Sarah Rahman',
      role: 'Alumni',
      subtitle: 'Software Engineer @ Google',
      msg: 'I need a transcript attestation for a visa application — what is the current process?',
      time: 'Yesterday',
      unread: false,
      online: false,
    },
  ],
  ece: [],
  bba: [],
  architecture: [],
};

/* Blood requests a department has posted on behalf of its people (brief §4). */
export const departmentBloodRequests = {
  cse: [
    {
      id: 'dept-blood-cse-1',
      bg: 'AB-',
      units: 2,
      hospital: 'Evercare Hospital',
      location: 'Bashundhara, Dhaka',
      forWhom: 'Faculty member · CSE',
      urgency: 'Critical',
      time: '25m ago',
    },
  ],
  ece: [],
  bba: [],
  architecture: [],
};

/* Jobs a department has posted from its own hub. Shape matches globalJobsData
   so the campus job board can render them without a special case. */
export const departmentJobs = {
  cse: [
    {
      id: 'dept-job-cse-1',
      title: 'Research Assistant — HCI Lab',
      company: 'NSU · CSE Department',
      type: 'Part-Time',
      location: 'NSU Campus',
      salary: 'BDT 12,000 / month',
      deadline: '9 days left',
      posted: '1d ago',
      preview: 'The HCI lab is hiring two research assistants for a funded study on accessible interfaces for low-literacy users. Duties include participant recruitment, session moderation and qualitative coding.',
      reqs: ['Research Methods', 'Python', 'Report Writing'],
    },
    {
      id: 'dept-job-cse-2',
      title: 'Teaching Assistant — CSE 115',
      company: 'NSU · CSE Department',
      type: 'Part-Time',
      location: 'NSU Campus',
      salary: 'BDT 8,000 / month',
      deadline: '4 days left',
      posted: '3d ago',
      preview: 'Supporting lab sections of CSE 115 (Programming Language I). Open to students who have completed the course with a minimum grade of A-.',
      reqs: ['C Programming', 'Lab Support'],
    },
  ],
  ece: [],
  bba: [],
  architecture: [],
};
