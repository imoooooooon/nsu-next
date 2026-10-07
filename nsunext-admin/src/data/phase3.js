import snapshot from './product-snapshot.json' with { type: 'json' };

// These are review scenarios, not live reports, contacts or delivered invitations.
export function phase3Seed(now = Date.now()) {
  const at = hours => new Date(now + hours * 3600000).toISOString();
  return {
    events: snapshot.events.map(e => ({ ...e, id: String(e.id), status: 'published', departmentId: e.deptId || '', revision: 1, createdAt: at(-96), registrations: [], registrationOverride: e.registrationStatus === 'Closed' ? 'closed' : 'open' })),
    requests: snapshot.requests.map(r => ({ ...r, id: String(r.id), title: `${r.bg} · ${r.hospital}`, status: 'open', memberId: '203', departmentId: 'cse', submittedAt: at(-2), expiresAt: at(48), revision: 1 })),
    donors: snapshot.members.filter(p => p.blood).slice(0, 12).map(p => ({ id: String(p.id), name: p.name, memberId: String(p.id), bg: p.blood, location: p.location || 'Dhaka', available: p.available !== false, phone: `01700${String(p.id).padStart(6, '0')}`, status: 'listed', lastDonation: '', revision: 1 })),
    moderation: [
      { id: 'case-hiring', title: 'Suspicious application fee', contentType: 'hiring', contentId: '2', memberId: '1', reporterId: '203', severity: 'high', category: 'Fraud', evidence: 'Reported application asks applicants to pay an advance processing fee. Synthetic review excerpt.', evidenceState: 'available', departmentId: 'cse' },
      { id: 'case-message', title: 'Reported direct-message harassment', contentType: 'message', contentId: 'reported-message-1', memberId: '5', reporterId: '203', severity: 'high', category: 'Harassment', evidence: 'Reporter-submitted excerpt: repeated unwanted contact after a request to stop. This is a synthetic excerpt; no inbox access is provided.', evidenceState: 'available' },
      { id: 'case-moment', title: 'Moment report · evidence expired', contentType: 'moment', contentId: 'instant-demo-1', memberId: '203', reporterId: '1', severity: 'normal', category: 'Privacy', evidence: '', evidenceState: 'expired', expiresAt: at(-1) },
      { id: 'case-note', title: 'Reported campus note', contentType: 'note', contentId: 'm5', memberId: '203', reporterId: '1', severity: 'normal', category: 'Spam', evidence: 'Synthetic report: repeated promotional text unrelated to campus discussion.', evidenceState: 'available' },
    ].map((r, i) => ({ ...r, status: 'open', assigneeId: i === 1 ? 'admin-moderator' : '', submittedAt: at(-6 - i), revision: 1, notes: [], contentRemoved: false })),
    campaigns: [
      { id: 'campus-careers', title: 'Your next chapter starts here', copy: 'Explore opportunities from the Ugrads community.', alt: 'Campus career opportunities', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop', destination: '/webapp/jobs', audience: 'all', priority: 1, placement: 'home', startsAt: at(-24), endsAt: at(24 * 30), status: 'published', revision: 1, createdAt: at(-24), internalNotes: '' },
      { id: 'campus-community', title: 'Meet your campus community', copy: 'Connect with people, departments and ideas.', alt: 'Community connections', image: 'https://images.unsplash.com/photo-1523580494112-071d4574024e?w=1200&auto=format&fit=crop', destination: '/webapp/network', audience: 'all', priority: 2, placement: 'home', startsAt: at(24), endsAt: at(24 * 45), status: 'draft', revision: 1, createdAt: at(-12), internalNotes: '' },
    ],
    settings: [{ id: 'general', name: 'Ugrads', institution: 'North South University', supportEmail: 'support@ugrads.example', timezone: 'Asia/Dhaka', revision: 1 }],
    restrictions: [],
  };
}

export function migratePhase3(value) {
  if (value.version === 2) return value;
  if (value.version !== 1) throw new Error('Unsupported workspace version.');
  return { ...phase3Seed(Date.parse(value.seededAt) || Date.now()), ...value, version: 2,
    admins: value.admins.map(a => ({ ...a, revision: a.revision || 1, status: a.active ? 'active' : 'revoked' })) };
}
