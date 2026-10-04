import test from "node:test";
import assert from "node:assert/strict";
import {
  affiliationDepartmentId,
  changeDepartment,
  departmentWithState,
  initialDepartmentState,
  officialEmail,
  resolveAccess,
  scenarios,
  staffPeople,
} from "../src/shared/departmentModel.js";

const dept = { id: "cse", code: "CSE", officialId: 101, adminIds: [106] };
const viewer = (id) => scenarios.find((s) => s.id === id);

test("faculty affiliation alone does not grant management access", () => {
  const access = resolveAccess(
    dept,
    viewer("faculty"),
    initialDepartmentState(),
  );
  assert.equal(access.isMember, true);
  assert.equal(access.canManage, false);
});

test("permission matrix separates publishing, support, metadata and delegation", () => {
  const expected = {
    owner: [true, true, true, true],
    primary: [true, true, true, false],
    publisher: [true, false, false, false],
    helpdesk: [false, true, false, false],
    student: [false, false, false, false],
    unassigned: [false, false, false, false],
  };
  for (const [id, flags] of Object.entries(expected)) {
    const access = resolveAccess(dept, viewer(id), initialDepartmentState());
    assert.deepEqual(
      [
        access.canBroadcast,
        access.canHelpDesk,
        access.canEditMetadata,
        access.canGrantAccess,
      ],
      flags,
      id,
    );
    assert.equal(access.canCreateEvent, access.canBroadcast);
  }
});

test("assignments are restricted to their department", () => {
  assert.equal(
    resolveAccess(
      { ...dept, id: "ece", code: "ECE", officialId: 103, adminIds: [] },
      viewer("primary"),
      initialDepartmentState(),
    ).canManage,
    false,
  );
});

test("granting and revoking changes the target identity’s access immediately", () => {
  let state = initialDepartmentState();
  state = changeDepartment(state, dept, viewer("owner"), {
    type: "grant",
    person: staffPeople[3],
    permission: "publisher",
  });
  assert.equal(
    resolveAccess(dept, viewer("unassigned"), state).canBroadcast,
    true,
  );
  assert.equal(
    resolveAccess(dept, viewer("unassigned"), state).canHelpDesk,
    false,
  );
  state = changeDepartment(state, dept, viewer("owner"), {
    type: "revoke",
    personId: 304,
  });
  assert.equal(
    resolveAccess(dept, viewer("unassigned"), state).canManage,
    false,
  );
});

test("non-owners and unverified candidates cannot grant access", () => {
  const state = initialDepartmentState();
  assert.equal(
    changeDepartment(state, dept, viewer("primary"), {
      type: "grant",
      person: staffPeople[3],
      permission: "primary",
    }),
    state,
  );
  assert.equal(
    changeDepartment(state, dept, viewer("owner"), {
      type: "grant",
      person: { ...staffPeople[3], verified: false },
      permission: "primary",
    }),
    state,
  );
});

test("transfer leaves exactly one owner and demotes the former owner", () => {
  const state = changeDepartment(
    initialDepartmentState(),
    dept,
    viewer("owner"),
    { type: "transfer", person: staffPeople[0] },
  );
  assert.equal(departmentWithState(dept, state).officialId, 301);
  assert.equal(
    resolveAccess(dept, viewer("primary"), state).canGrantAccess,
    true,
  );
  assert.equal(
    resolveAccess(dept, viewer("owner"), state).canGrantAccess,
    false,
  );
  assert.equal(
    resolveAccess(dept, viewer("owner"), state).canEditMetadata,
    true,
  );
  assert.equal(state.assignments.cse[301], undefined);
});

test("owner cannot be revoked or transfer ownership to themselves", () => {
  const state = initialDepartmentState();
  assert.equal(
    changeDepartment(state, dept, viewer("owner"), {
      type: "revoke",
      personId: 101,
    }),
    state,
  );
  assert.equal(
    changeDepartment(state, dept, viewer("owner"), {
      type: "transfer",
      person: { id: 101, verified: true },
    }),
    state,
  );
});

test("ownership requests never grant access, and disappear for owned pages", () => {
  const unowned = {
    ...dept,
    id: "architecture",
    code: "Architecture",
    officialId: null,
    adminIds: [],
  };
  let state = initialDepartmentState();
  assert.equal(
    resolveAccess(unowned, viewer("unowned"), state).canRequestOwnership,
    true,
  );
  assert.equal(
    resolveAccess(unowned, viewer("student"), state).canRequestOwnership,
    false,
  );
  state = changeDepartment(state, unowned, viewer("unowned"), {
    type: "request",
    message: "Department chair",
  });
  assert.equal(state.requests["d:architecture:u:109"].status, "pending");
  assert.equal(
    resolveAccess(unowned, viewer("unowned"), state).canManage,
    false,
  );
  assert.equal(
    resolveAccess(dept, viewer("faculty"), state).canRequestOwnership,
    false,
  );
});

test("metadata updates are reflected publicly and denied to publishers", () => {
  const state = initialDepartmentState();
  const action = {
    type: "metadata",
    values: { office: "SAC 945", officeHours: "Sun–Thu, 10–4" },
  };
  assert.equal(
    changeDepartment(state, dept, viewer("publisher"), action),
    state,
  );
  assert.equal(
    departmentWithState(
      dept,
      changeDepartment(state, dept, viewer("primary"), action),
    ).office,
    "SAC 945",
  );
});

test("staff email verification requires the exact institutional domain", () => {
  assert.equal(officialEmail(" staff@NORTHSOUTH.EDU "), true);
  for (const email of [
    "staff@gmail.com",
    "staff@northsouth.edu.evil.com",
    "staff@northsouth.edu@evil.com",
    "@northsouth.edu",
    "staff @northsouth.edu",
  ])
    assert.equal(officialEmail(email), false, email);
});

test("affiliation routes to the selected department without inventing an office hub", () => {
  assert.equal(affiliationDepartmentId("CSE"), "cse");
  assert.equal(affiliationDepartmentId("ECE"), "ece");
  assert.equal(affiliationDepartmentId("BBA"), "bba");
  assert.equal(affiliationDepartmentId("Architecture"), "architecture");
  assert.equal(affiliationDepartmentId("Registrar’s Office"), null);
});

test("an unverified faculty identity cannot request ownership", () => {
  const unowned = { ...dept, officialId: null };
  const faculty = { ...viewer("faculty"), verified: false };
  const state = initialDepartmentState();
  assert.equal(resolveAccess(unowned, faculty, state).canRequestOwnership, false);
  assert.equal(changeDepartment(state, unowned, faculty, { type: "request" }), state);
});
