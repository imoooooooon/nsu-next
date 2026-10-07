import { publicState, publicPerson, submitPublic, subscribeBridge } from './adminBridge.js';
import { useSyncExternalStore } from "react";
import {
  initialDepartmentState,
  changeDepartment,
  departmentWithState,
  viewerFor,
  resolveAccess,
  staffPeople,
  affiliationDepartmentId,
} from "./departmentModel";

let state = initialDepartmentState();
const listeners = new Set();
export const getDepartmentState = () => state;
const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
export const subscribeDepartmentState = subscribe;
export const useDepartmentState = () =>
  useSyncExternalStore(subscribe, getDepartmentState, getDepartmentState);
export function updateDepartmentState(next) {
  state = typeof next === "function" ? next(state) : next;
  listeners.forEach((listener) => listener());
}
export const liveDepartment = (dept) => departmentWithState(dept, state);
export const currentViewer = (role) => { const viewer = viewerFor(role, state); const person = publicPerson({ id: viewer.personId }); return { ...viewer, verified: person.verified ?? viewer.verified, accountStatus: person.accountStatus }; };
export const viewerDepartmentId = (role) =>
  affiliationDepartmentId(currentViewer(role).dept);
export const currentAccess = (dept, role) =>
  resolveAccess(dept, currentViewer(role), state);
export const actOnDepartment = (dept, role, action) => {
  const viewer = currentViewer(role);
  const next = changeDepartment(state, dept, viewer, action);
  if (next === state) return;
  if (action.type === 'request') submitPublic('claims', { id: `claim-${dept.id}-${viewer.personId}`, departmentId: dept.id, memberId: String(viewer.personId), message: action.message, status: 'pending' });
  if (['metadata','grant','revoke','transfer'].includes(action.type)) {
    const current = publicState()?.departments.find(d => d.id === dept.id);
    const resolved = departmentWithState(dept, next);
    submitPublic('departments', { ...current, id:dept.id, name:resolved.name, code:resolved.code, school:resolved.school, description:resolved.about, office:resolved.office, hours:resolved.officeHours, email:resolved.email, phone:resolved.phone, website:resolved.website ? (/^https?:/.test(resolved.website) ? resolved.website : `https://${resolved.website}`) : '', cover:resolved.cover || current?.cover || '', memberId:String(viewer.personId), ownerId:resolved.officialId ? String(resolved.officialId) : null, assignments:resolved.assignments, status:resolved.status || 'active' });
  }
  updateDepartmentState(next);
};
export const currentStaff = (role) =>
  state.profile?.id === currentViewer(role).personId
    ? state.profile
    : staffPeople.find((p) => p.id === currentViewer(role).personId) ||
      staffPeople[3];
export const resetDepartmentDemo = () =>
  updateDepartmentState(initialDepartmentState());
export const allStaff = () =>
  staffPeople.map((p) => publicPerson(state.profile?.id === p.id ? state.profile : p));

export function publishDepartmentEvent(draft, dept, role, viewerName) {
  if (dept && !currentAccess(dept, role).canCreateEvent) return null;
  const activities = Object.entries(draft.schedule)
    .filter(
      ([day]) =>
        Number(day) <=
        Math.round(
          (new Date(`${draft.endDate}T12:00:00`) -
            new Date(`${draft.startDate}T12:00:00`)) /
            86400000,
        ) +
          1,
    )
    .flatMap(([day, rows]) =>
      rows.map((row) => ({
        time: `Day ${day} · ${row.start || ""}`,
        title: row.details || row.title || "Activity",
      })),
    );
  const event = {
    id: `event-${Date.now()}`,
    deptId: dept?.id,
    title: draft.title.trim(),
    category:
      draft.category === "Other" ? draft.customCategory : draft.category,
    shortDescription: draft.description || draft.title,
    description: draft.description,
    organizer: { ...draft.organizers[0], verified: true },
    coOrganizers: draft.organizers.slice(1),
    postedBy: {
      name: dept ? `${dept.code} Department` : viewerName,
      role: dept ? "Department account" : "Member",
    },
    date: draft.startDate,
    endDate: draft.endDate,
    time: "See schedule",
    endTime: "",
    venue: draft.venue || "To be announced",
    venueDetails: draft.venueDetails,
    image: draft.image || "",
    registrationStatus: "Open",
    registrationDeadline: draft.deadlineDate
      ? `${draft.deadlineDate}T${draft.deadlineTime}:00`
      : null,
    capacity: Number(draft.capacity) || 0,
    goingCount: 0,
    interestedCount: 0,
    featured: false,
    schedule: activities,
    registrationInfo: draft.registrationInfo,
    tags: [draft.category],
  };
  submitPublic('events', { ...event, departmentId: dept?.id || '', memberId: String(currentViewer(role).personId), status: 'published', registrationOverride: 'open', registrations: [] });
  updateDepartmentState((s) => ({ ...s, events: [...s.events, event] }));
  return event;
}

let bridgeRevision = -1;
function applyAdminReadModel() {
  const admin = publicState();
  if (!admin || admin.revision === bridgeRevision) return;
  bridgeRevision = admin.revision;
  const owners = { ...state.owners }, assignments = { ...state.assignments }, metadata = { ...state.metadata }, requests = { ...state.requests };
  for (const d of admin.departments) {
    owners[d.id] = d.ownerId ? Number(d.ownerId) : null;
    assignments[d.id] = d.assignments;
    metadata[d.id] = { ...metadata[d.id], name:d.name, code:d.code, school:d.school, about:d.description, office:d.office, officeHours:d.hours, email:d.email, phone:d.phone, website:String(d.website || '').replace(/^https?:\/\//, ''), ...(d.cover ? { cover:d.cover } : {}), status:d.status };
  }
  for (const c of admin.claims) requests[`d:${c.departmentId}:u:${c.memberId}`] = { status:c.status, message:c.message, reason:c.reason };
  updateDepartmentState({ ...state, owners, assignments, metadata, requests });
}
applyAdminReadModel();
subscribeBridge(applyAdminReadModel);
