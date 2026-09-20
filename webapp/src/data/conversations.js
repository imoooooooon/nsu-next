/* Messaging demo data — identical to the shipped mobile prototype.

   `kind` is the one discriminator the department hub adds:
     'dm'             → an ordinary person-to-person thread (the default)
     'broadcast'      → the department's read-only channel (auto-enrolled)
     'helpdesk'       → a member's 1-on-1 thread with the department
     'helpdesk-thread'→ one student's thread as an admin sees it
   Everything that existed before keeps working because `kind` defaults to 'dm'. */

import {
  findDepartmentById, departmentBroadcasts, departmentHelpDeskThreads,
} from './departments';
import { formatCount, broadcastChannelId, helpDeskChannelId } from '../lib/departmentAccess';

export const globalConversations = [
  { id: 1, kind: 'dm', name: 'Sarah Rahman', role: 'Alumni', subtitle: 'Software Engineer', msg: "The project files are attached, let's sync...", time: '2m ago', unread: true, isRequest: false, online: true },
  { id: 2, kind: 'dm', name: 'Tahmid Hasan', role: 'Student', subtitle: 'CSE · Batch 231', msg: 'Thanks for the update! Looking forward to it.', time: '1h ago', unread: false, isRequest: false, online: true },
  { id: 3, kind: 'dm', name: 'Dr. Aminul Islam', role: 'Faculty', subtitle: 'Professor @ CSE', msg: 'Can we schedule a meeting tomorrow at 3 PM?', time: 'Yesterday', unread: false, isRequest: false, online: false },
  { id: 4, kind: 'dm', name: 'Nabila Islam', role: 'Faculty', subtitle: 'Lecturer @ BBA', msg: 'Did you check out the new design system files?', time: 'Tuesday', unread: false, isRequest: false, online: false },
  { id: 5, kind: 'dm', name: 'Fahim Shahriar', role: 'Alumni', subtitle: 'Senior Product Designer', msg: 'Hi, I saw your portfolio and wanted to connect.', time: '3d ago', unread: true, isRequest: true, online: true },
];

/* ---------------------------------------------------------------------------
   Department channels.

   These are DERIVED from the department record rather than hand-written, so
   the inbox row, the hub and the thread header can never disagree about a
   channel's name, reach or latest notice. They are also the reason a member
   never sees a "Join" button: the rows simply exist from account creation.
--------------------------------------------------------------------------- */

export const getDepartmentChannels = (deptId) => {
  const dept = findDepartmentById(deptId);
  if (!dept) return [];

  const history = departmentBroadcasts[dept.id] || [];
  const latest = history[history.length - 1];

  return [
    {
      id: broadcastChannelId(dept.id),
      kind: 'broadcast',
      deptId: dept.id,
      name: `${dept.code} Department`,
      subtitle: `Official broadcast · ${formatCount(dept.memberCount)} members`,
      msg: latest ? latest.title : 'No notices yet.',
      time: latest ? latest.time : '',
      unread: !!latest && latest.emailed,
      isRequest: false,
      online: false,
      pinned: true,
      readOnly: true,
    },
    {
      id: helpDeskChannelId(dept.id),
      kind: 'helpdesk',
      deptId: dept.id,
      name: `${dept.code} Help Desk`,
      subtitle: 'Ask the department directly',
      msg: 'Send a question and a faculty member will reply here.',
      time: '',
      unread: false,
      isRequest: false,
      online: true,
      pinned: true,
    },
  ];
};

/* The admin's Help Desk inbox: one thread per person who wrote in. */
export const getHelpDeskThreads = (deptId) =>
  (departmentHelpDeskThreads[deptId] || []).map(thread => ({
    ...thread,
    kind: 'helpdesk-thread',
    deptId,
    isRequest: false,
  }));

export const findConversationById = (id, deptId) => {
  const inDepartment = [...getDepartmentChannels(deptId), ...getHelpDeskThreads(deptId)]
    .find(c => String(c.id) === String(id));
  if (inDepartment) return inDepartment;
  const dm = globalConversations.find(c => String(c.id) === String(id));
  return dm || null;
};
