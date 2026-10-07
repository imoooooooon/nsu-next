import { phase3Seed } from './phase3.js';
import snapshot from './product-snapshot.json' with { type: 'json' };
import { staffPeople } from '../../../src/shared/departmentModel.js';

export function createSeed(now = Date.now()) {
  const ago = hours => new Date(now - hours * 3600000).toISOString();
  const later = days => new Date(now + days * 86400000).toISOString();
  const members = [...snapshot.members, ...staffPeople.map(p => ({ ...p, identity: 'Staff' }))].map((p, index) => ({
    id: String(p.id), name: p.name, identity: p.identity, department: p.dept,
    designation: p.role, office: p.office || '', phone: p.phone || '', batch: p.batch,
    email: p.email || `${p.name.toLowerCase().replace(/[^a-z ]/g, '').trim().replaceAll(' ', '.')}@northsouth.edu`,
    verified: p.verified, status: 'active', revision: 1, joinedAt: ago(48 + index * 39),
  }));
  // Operational scenarios are synthetic additions to canonical public fixture IDs.
  for (const id of ['5', '6', '203']) members.find(m => m.id === id).verified = false;
  members.find(m => m.id === '7').status = 'suspended';
  const departments = snapshot.departments.map(d => ({
    id: d.id, code: d.code, name: d.name, school: d.school, description: d.about,
    office: d.office, hours: d.officeHours, email: d.email, phone: d.phone,
    website: `https://${d.website}`, cover: '', ownerId: d.officialId ? String(d.officialId) : null,
    assignments: d.id === 'cse' ? { '106': 'primary', '301': 'primary', '302': 'publisher', '303': 'helpdesk' } : {},
    status: 'active', revision: 1, createdAt: ago(24 * 120),
  }));
  const verification = [
    { id: 'verify-005', memberId: '5', status: 'pending', method: 'Alumni certificate', evidence: 'available', summary: 'Graduation certificate · Bachelor of Science · CSE · Class of 2017', submittedAt: ago(29) },
    { id: 'verify-006', memberId: '6', status: 'pending', method: 'Alumni certificate', evidence: 'missing', summary: 'The applicant’s document is unavailable. Request a replacement before approving.', submittedAt: ago(7) },
    { id: 'verify-203', memberId: '203', status: 'needs_information', method: 'Student identity', evidence: 'missing', summary: 'Awaiting a legible university ID.', submittedAt: ago(52), reason: 'Upload a legible university ID with your name and department.' },
    { id: 'verify-301', memberId: '301', status: 'approved', method: 'Official email', evidence: 'available', summary: 'Institutional verification record: exact northsouth.edu domain and email challenge completed.', submittedAt: ago(80), decidedAt: ago(72), reviewerName: 'Ayesha Rahman' },
  ].map(r => ({ ...r, revision: 1 }));
  const claims = [
    { id: 'claim-109', memberId: '109', departmentId: 'architecture', message: 'As department chair, I would like to coordinate our official hub, notices and student support.', submittedAt: ago(22) },
    { id: 'claim-113', memberId: '113', departmentId: 'architecture', message: 'I can maintain the department page and manage exhibition announcements on behalf of the team.', submittedAt: ago(5) },
  ].map(c => ({ ...c, status: 'pending', revision: 1 }));
  const hiring = snapshot.hiring.map((j, i) => ({
    id: String(j.id), title: j.title, company: j.company, memberId: String(j.postedBy.userId), departmentId: null,
    category: j.type, location: j.location, compensation: j.salary, description: j.preview,
    skills: j.reqs, applicationUrl: '', deadline: later(10 + i * 5), submittedAt: ago(15 + i * 12),
    status: i === 1 ? 'published' : 'pending', revision: 1,
  }));
  const seeking = snapshot.seeking.map((p, i) => ({
    id: p.id, title: p.headline, memberId: String(p.student.id), category: p.category,
    department: p.student.department, description: p.fullBio, skills: p.skills,
    workMode: p.workMode.join(', '), location: p.location, availability: p.availability,
    commitment: p.commitment, compensation: p.compensation, visibility: p.visibility,
    preferredDuration: p.preferredDuration, durationDays: 30,
    portfolioUrl: p.portfolioUrl === '#' ? '' : p.portfolioUrl, resumeUrl: p.resumeUrl === '#' ? '' : p.resumeUrl,
    linkedInUrl: p.linkedInUrl === '#' ? '' : p.linkedInUrl, githubUrl: p.githubUrl === '#' ? '' : p.githubUrl,
    submittedAt: ago(i * 8 + 4), expiresAt: i === 5 ? ago(10) : later(30 - i),
    approvedAt: i >= 3 ? ago(i * 8 + 2) : null,
    status: i < 3 ? 'pending' : i === 4 ? 'paused' : i === 5 ? 'expired' : 'active', revision: 1,
  }));
  return { ...phase3Seed(now), version: 2, revision: 0, seededAt: new Date(now).toISOString(), members, departments, verification, claims, hiring, seeking, audit: [], admins: [
    { id: 'admin-owner', name: 'Ayesha Rahman', role: 'owner', memberId: '1', active: true, status: 'active', revision: 1 },
    { id: 'admin-operations', name: 'Tanvir Ahmed', role: 'operations', memberId: null, active: true, status: 'active', revision: 1 },
    { id: 'admin-moderator', name: 'Maliha Khan', role: 'moderator', memberId: null, active: true, status: 'active', revision: 1 },
    { id: 'admin-analyst', name: 'Rafi Islam', role: 'analyst', memberId: null, active: true, status: 'active', revision: 1 },
  ] };
}
