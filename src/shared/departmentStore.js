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
export const currentViewer = (role) => viewerFor(role, state);
export const viewerDepartmentId = (role) =>
  affiliationDepartmentId(currentViewer(role).dept);
export const currentAccess = (dept, role) =>
  resolveAccess(dept, currentViewer(role), state);
export const actOnDepartment = (dept, role, action) =>
  updateDepartmentState((s) =>
    changeDepartment(s, dept, viewerFor(role, s), action),
  );
export const currentStaff = (role) =>
  state.profile?.id === currentViewer(role).personId
    ? state.profile
    : staffPeople.find((p) => p.id === currentViewer(role).personId) ||
      staffPeople[3];
export const resetDepartmentDemo = () =>
  updateDepartmentState(initialDepartmentState());
export const allStaff = () =>
  staffPeople.map((p) => (state.profile?.id === p.id ? state.profile : p));

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
  updateDepartmentState((s) => ({ ...s, events: [...s.events, event] }));
  return event;
}
