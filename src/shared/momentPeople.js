// Active rail metadata contains Notes only. Legacy Story media stays out of this release's feed.
export const momentPeople = [
  {
    id: "user-1",
    user: { name: "Maliha", role: "Student", verified: true },
    items: [],
  },
  {
    id: "user-2",
    user: { name: "Dr. Aminul", shortName: "Aminul", role: "Faculty", verified: true },
    items: [],
  },
  {
    id: "user-3",
    user: { name: "Tahmid Hasan", role: "Student", verified: false },
    items: [
      {
        id: "m5",
        type: "note",
        content: "Need a study partner!",
        reactions: 2,
      },
    ],
  },
  {
    id: "user-4",
    user: { name: "Ayman Sadiq", role: "Alumni", verified: true },
    items: [],
  },
  {
    id: "user-5",
    user: { name: "Fahim", role: "Student", verified: false },
    items: [
      {
        id: "m7",
        type: "note",
        content: "Just finished my thesis 🎓",
        reactions: 34,
      },
    ],
  },
  {
    id: "user-6",
    user: { name: "Sadia", role: "Alumni", verified: true },
    items: [],
  },
  {
    id: "user-7",
    user: { name: "Rayan", role: "Student", verified: false },
    items: [
      {
        id: "m9",
        type: "note",
        content: "Hackathon team needed",
        reactions: 5,
      },
    ],
  },
  {
    id: "user-8",
    user: { name: "Nabila", role: "Faculty", verified: true },
    items: [],
  },
  { id: "user-9", user: { name: "Arif", role: "Student", verified: true }, items: [{ id: "note-arif", type: "note", content: "Anyone up for a coffee?", reactions: 3 }] },
  { id: "user-10", user: { name: "Nusrat", role: "Alumni", verified: true }, items: [] },
  { id: "user-11", user: { name: "Samiha", role: "Student", verified: false }, items: [{ id: "note-samiha", type: "note", content: "Design club, 4 pm ✨", reactions: 6 }] },
  { id: "user-12", user: { name: "Rafi", role: "Student", verified: true }, items: [] },
  { id: "user-13", user: { name: "Farhan", role: "Alumni", verified: true }, items: [{ id: "note-farhan", type: "note", content: "Happy to review portfolios", reactions: 12 }] },
  { id: "user-14", user: { name: "Tania", role: "Faculty", verified: true }, items: [] },
];
