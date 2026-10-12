// Prototype inventory uses the same scheduling and moderation as other campaigns.
export function demoPromotions(now) {
  return [
    { id: 'demo-campus-events', title: 'Make room for something new', copy: 'Workshops, campus events and your next big idea.', destination: '/webapp/events', image: 'https://images.unsplash.com/photo-1523580494112-071d4574024e?w=1600&auto=format&fit=crop' },
    { id: 'demo-campus-network', title: 'Your people. Your possibilities.', copy: 'Connect with alumni, faculty and fellow students.', destination: '/webapp/network', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop' },
  ].map((ad, index) => ({ ...ad, alt: ad.title, audience: 'all', priority: index + 3, placement: 'home', status: 'published', revision: 1, startsAt: new Date(now - 86400000).toISOString(), endsAt: new Date(now + 90 * 86400000).toISOString(), createdAt: new Date(now).toISOString(), internalNotes: 'Demo campaign for the Home carousel.' }));
}

export function withPromotionDemos(state) {
  if (!state?.campaigns || state.promotionDemoRevision || !state.seededAt) return state;
  const timestamp = Date.parse(state.seededAt);
  if (!Number.isFinite(timestamp)) return state;
  return { ...state, promotionDemoRevision: 1, campaigns: [...state.campaigns, ...demoPromotions(timestamp).filter(ad => !state.campaigns.some(existing => existing.id === ad.id))] };
}

export function loopPosition(position, count) {
  return ((position - 1) % count + count) % count;
}
