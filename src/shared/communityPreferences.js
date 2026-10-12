import { bridgeNotify } from './adminBridge.js';
const key = (kind, viewer) => `ugrads-${kind}-${viewer}`;
export function connectedIds(viewer) {
  // Accepted relationships are distinct from outgoing connection requests.
  try { const saved=localStorage.getItem(key('connections',viewer)); if(saved) return new Set(JSON.parse(saved).map(String)); } catch { /* use fixture relationships */ }
  if(String(viewer).startsWith('alumni-')) return new Set();
  return new Set(['1','2','4','101'].filter(id=>id!==String(viewer)));
}
export function archivedIds(viewer) { try { return new Set(JSON.parse(localStorage.getItem(key('archived-chats',viewer)) || '[]').map(String)); } catch { return new Set(); } }
export function toggleArchive(viewer,id) { const ids=archivedIds(viewer);const k=String(id);if(ids.has(k))ids.delete(k);else ids.add(k);localStorage.setItem(key('archived-chats',viewer),JSON.stringify([...ids]));bridgeNotify();return ids.has(k); }
export function selectConversations({ conversations, channels, helpdesk, archived, segment, filter, search='' }) {
  const all=[...channels,...conversations,...helpdesk];
  let rows=segment==='Archived' ? all.filter(c=>archived.has(String(c.id))) : segment==='Help Desk' ? [...channels.filter(c=>c.kind==='helpdesk'),...helpdesk].filter(c=>!archived.has(String(c.id))) : [...channels.filter(c=>c.kind!=='helpdesk'),...conversations].filter(c=>!archived.has(String(c.id)) && (filter==='Requests' ? c.isRequest : !c.isRequest));
  if(filter==='Requests') rows=rows.filter(c=>c.isRequest);
  else if(filter==='Unread') rows=rows.filter(c=>c.unread);
  else if(filter==='Departments') rows=rows.filter(c=>c.deptId || c.dept);
  else if(filter) rows=rows.filter(c=>c.role===filter);
  const q=search.trim().toLowerCase();return rows.filter(c=>!q || `${c.name} ${c.msg}`.toLowerCase().includes(q));
}
