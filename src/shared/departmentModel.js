// Shared prototype model. No backend calls or real email delivery.
export const staffPeople = [
  {
    id: 301,
    name: "Farhana Rahman",
    role: "Program Coordination Officer",
    dept: "CSE",
    office: "SAC 1042",
    phone: "Ext. 1502",
    email: "farhana.rahman@northsouth.edu",
    nsuId: "NSU-301",
    userType: "staff",
    verified: true,
  },
  {
    id: 302,
    name: "Sadia Ahmed",
    role: "Communications Coordinator",
    dept: "CSE",
    office: "SAC 1038",
    phone: "Ext. 1504",
    email: "sadia.ahmed@northsouth.edu",
    nsuId: "NSU-302",
    userType: "staff",
    verified: true,
  },
  {
    id: 303,
    name: "Rafiul Islam",
    role: "Department Secretary",
    dept: "CSE",
    office: "SAC 1040",
    phone: "Ext. 1506",
    email: "rafiul.islam@northsouth.edu",
    nsuId: "NSU-303",
    userType: "staff",
    verified: true,
  },
  {
    id: 304,
    name: "Nabila Hasan",
    role: "Program Officer",
    dept: "CSE",
    office: "SAC 1045",
    phone: "",
    email: "nabila.hasan@northsouth.edu",
    nsuId: "NSU-304",
    userType: "staff",
    verified: true,
  },
].map((p) => ({
  ...p,
  company: "North South University",
  batch: "Staff",
  skills: [],
  location: p.office,
}));

export const PERMISSIONS = {
  primary: {
    label: "Primary Admin",
    description:
      "Publish notices and events, answer students, and edit page details.",
  },
  publisher: {
    label: "Broadcast / Event Publisher",
    description:
      "Publish department notices and events. No student inbox or page editing.",
  },
  helpdesk: {
    label: "Help Desk Operator",
    description:
      "Read and reply to student questions. No publishing or page editing.",
  },
};

export const scenarios = [
  {
    id: "student",
    label: "Student",
    role: "student",
    personId: 203,
    dept: "CSE",
  },
  { id: "alumni", label: "Alumni", role: "alumni", personId: 1, dept: "CSE" },
  {
    id: "owner",
    label: "Department owner",
    role: "faculty",
    personId: 101,
    dept: "CSE",
  },
  {
    id: "faculty",
    label: "Faculty · no admin access",
    role: "faculty",
    personId: 105,
    dept: "CSE",
  },
  {
    id: "primary",
    label: "Staff · Primary Admin",
    role: "staff",
    personId: 301,
    dept: "CSE",
  },
  {
    id: "publisher",
    label: "Staff · Publisher",
    role: "staff",
    personId: 302,
    dept: "CSE",
  },
  {
    id: "helpdesk",
    label: "Staff · Help Desk",
    role: "staff",
    personId: 303,
    dept: "CSE",
  },
  {
    id: "unassigned",
    label: "Staff · unassigned",
    role: "staff",
    personId: 304,
    dept: "CSE",
  },
  {
    id: "unowned",
    label: "Faculty · unclaimed department",
    role: "faculty",
    personId: 109,
    dept: "Architecture",
  },
].map((s) => ({ ...s, verified: true }));

export const initialDepartmentState = () => ({
  viewer: null,
  profile: null,
  owners: {},
  metadata: {},
  requests: {},
  assignments: {
    cse: { 106: "primary", 301: "primary", 302: "publisher", 303: "helpdesk" },
  },
  replies: {},
  resolved: {},
  events: [],
});

export function viewerFor(role, state) {
  if (state.viewer?.role === role) return state.viewer;
  return (
    scenarios.find(
      (s) =>
        s.id ===
        (role === "faculty" ? "owner" : role === "staff" ? "unassigned" : role),
    ) || scenarios[0]
  );
}

export function departmentWithState(dept, state) {
  if (!dept) return null;
  const officialId = Object.hasOwn(state.owners, dept.id)
    ? state.owners[dept.id]
    : dept.officialId;
  const assignments =
    state.assignments[dept.id] ||
    Object.fromEntries((dept.adminIds || []).map((id) => [id, "primary"]));
  return {
    ...dept,
    ...state.metadata[dept.id],
    officialId,
    assignments,
    adminIds: Object.keys(assignments).map(Number),
  };
}

export function resolveAccess(dept, viewer, state) {
  const d = departmentWithState(dept, state);
  const isOfficial = !!d && d.officialId === viewer.personId;
  const permission = d?.assignments[viewer.personId];
  const isAdmin = isOfficial || !!permission;
  const isMember = isAdmin || (!!d && d.code === viewer.dept);
  return {
    level: isOfficial
      ? "official"
      : isAdmin
        ? "admin"
        : isMember
          ? "member"
          : "visitor",
    isOfficial,
    isAdmin,
    isMember,
    permission,
    canManage: isAdmin,
    canBroadcast: isOfficial || ["primary", "publisher"].includes(permission),
    canCreateEvent: isOfficial || ["primary", "publisher"].includes(permission),
    canHelpDesk: isOfficial || ["primary", "helpdesk"].includes(permission),
    canEditMetadata: isOfficial || permission === "primary",
    canGrantAccess: isOfficial,
    canTransfer: isOfficial,
    canRequestOwnership:
      !!d &&
      d.officialId == null &&
      viewer.role === "faculty" &&
      viewer.verified === true,
    label: isOfficial
      ? "Super Admin"
      : permission
        ? PERMISSIONS[permission].label
        : isMember
          ? "Member"
          : "Visitor",
  };
}

export function changeDepartment(state, dept, viewer, action) {
  const access = resolveAccess(dept, viewer, state);
  const d = departmentWithState(dept, state);
  if (action.type === "request" && access.canRequestOwnership) {
    return {
      ...state,
      requests: {
        ...state.requests,
        [`d:${dept.id}:u:${viewer.personId}`]: {
          status: "pending",
          message: action.message,
        },
      },
    };
  }
  if (action.type === "metadata" && access.canEditMetadata) {
    return {
      ...state,
      metadata: {
        ...state.metadata,
        [dept.id]: { ...state.metadata[dept.id], ...action.values },
      },
    };
  }
  if (
    action.type === "grant" &&
    access.canGrantAccess &&
    action.person.verified &&
    action.person.id !== d.officialId &&
    PERMISSIONS[action.permission]
  ) {
    return {
      ...state,
      assignments: {
        ...state.assignments,
        [dept.id]: { ...d.assignments, [action.person.id]: action.permission },
      },
    };
  }
  if (
    action.type === "revoke" &&
    access.canGrantAccess &&
    action.personId !== d.officialId
  ) {
    const assignments = { ...d.assignments };
    delete assignments[action.personId];
    return {
      ...state,
      assignments: { ...state.assignments, [dept.id]: assignments },
    };
  }
  if (
    action.type === "transfer" &&
    access.canTransfer &&
    action.person.verified &&
    action.person.id !== viewer.personId
  ) {
    const assignments = { ...d.assignments, [viewer.personId]: "primary" };
    delete assignments[action.person.id];
    return {
      ...state,
      owners: { ...state.owners, [dept.id]: action.person.id },
      assignments: { ...state.assignments, [dept.id]: assignments },
    };
  }
  return state;
}

export const officialEmail = (email) =>
  /^[^\s@]+@northsouth\.edu$/i.test(email.trim());

export const affiliationDepartmentId = (affiliation) =>
  ({ CSE: "cse", ECE: "ece", BBA: "bba", Architecture: "architecture" })[
    affiliation
  ] || null;
