/* Jobs demo data — identical records to the shipped mobile prototype. */

export const globalJobsData = [
  { id: 1, title: 'UI/UX Designer Intern', company: 'Brain Station 23', type: 'Internship', location: 'Remote', salary: 'Paid stipend', deadline: '2 days left', posted: '2h ago', preview: 'We are looking for a passionate UI/UX design intern to help build intuitive user interfaces for our upcoming fintech products. You will work closely with the product team.', match: true, urgent: true, reqs: ['Figma', 'Prototyping', 'Design Systems'], postedBy: { userId: 4, name: 'Fahim Shahriar', role: 'Senior Product Designer', verified: true, type: 'Alumni' } },
  { id: 2, title: 'Frontend Developer', company: 'Pathao', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Negotiable', deadline: '12 days left', posted: '1d ago', preview: 'Join our core engineering team to build high-performance web applications using React and Next.js. Minimum 1 year experience required.', match: true, urgent: false, reqs: ['React', 'Next.js', 'Tailwind CSS'], postedBy: { userId: 2, name: 'Tahmid Hasan', role: 'Product Lead', verified: true, type: 'Alumni' } },
  { id: 3, title: 'Product Marketing Manager', company: '10 Minute School', type: 'Full-Time', location: 'Dhaka, BD', salary: 'Competitive', deadline: '5 days left', posted: '3d ago', preview: 'Drive the go-to-market strategy for our new flagship educational courses. Work closely with product and sales teams to ensure successful launches.', match: false, urgent: false, reqs: ['Marketing', 'Strategy', 'Copywriting'], postedBy: { userId: 3, name: 'Ayman Sadiq', role: 'CEO & Founder', verified: true, type: 'Alumni' } },
];

export const findJobById = (id) => globalJobsData.find(j => String(j.id) === String(id)) || null;
