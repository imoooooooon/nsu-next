/* Moments demo data — identical to the shipped mobile prototype. */

export const globalMomentsData = [
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

export const findMomentIndexById = (id) => globalMomentsData.findIndex(m => m.id === id);
