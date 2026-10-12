import { createSeed } from '../../nsunext-admin/src/data/seed.js';
import { createRepository, STORE_KEY } from '../../nsunext-admin/src/data/repository.js';
import { bridgeNotify, publicState } from './adminBridge.js';
export const APPLICANT_KEY = 'ugrads-alumni-applicant';
export const VOUCH_POLICY = 'vouch-2026-10-v1';
export const LIABILITY_TEXT = 'I personally know this applicant and confirm they are an NSU alumnus. I understand that endorsing a fake or malicious account may lead to suspension or a ban of my own account after an administrator reviews the case.';
export function applicantId() { try { return sessionStorage.getItem(APPLICANT_KEY); } catch { return null; } }
export function applicantMember() { const id = applicantId(); return id ? publicState()?.members.find(m => m.id === id) : null; }
export function clearApplicant() { try { sessionStorage.removeItem(APPLICANT_KEY); } catch { /* storage unavailable */ } bridgeNotify(); }
// Resume a saved local applicant, never a production authentication mechanism.
export function resumeApplicant(email) {
  const member=publicState()?.members.find(m=>m.id.startsWith('alumni-') && m.email.toLowerCase()===email.trim().toLowerCase());
  if(!member)return false;
  sessionStorage.setItem(APPLICANT_KEY,member.id);bridgeNotify();return true;
}
export const initialVouchers = () => eligibleVouchers(publicState() || createSeed());
export function eligibleVouchers(state) { return state.members.filter(m => m.verified && m.status === 'active'); }
export function applyAlumniAction(state, command, now = Date.now()) {
  const s = structuredClone(state), at = new Date(now).toISOString();
  const fail = (ok, message) => { if (!ok) throw new Error(message); };
  let row, actor;
  if (command.action === 'submit') {
    const { id, name, email, department, batch, path, voucherId, document } = command;
    fail(typeof id === 'string' && id.startsWith('alumni-'), 'Invalid applicant identity.');
    fail(name?.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || ''), 'Enter your full name and a valid email.');
    fail(['CSE','ECE','BBA','Architecture'].includes(department) && batch?.trim(), 'Choose a department and enter your batch.');
    fail(['document','peer'].includes(path), 'Choose a verification path.');
    const existing = s.members.find(m => m.id === id);
    fail(!existing || !existing.verified && existing.status === 'active', 'This account cannot submit another verification request.');
    fail(!s.members.some(m => m.id !== id && m.email.toLowerCase() === email.trim().toLowerCase()), 'An account already uses that email. Use your existing account.');
    fail(!s.verification.some(r => r.memberId === id && r.status === 'pending'), 'A request is already pending.');
    if (path === 'peer') fail(voucherId !== id && eligibleVouchers(s).some(m => m.id === voucherId), 'Choose an active verified member who knows you.');
    else fail(document?.id && ['application/pdf','image/jpeg','image/png'].includes(document.type) && document.size > 0 && document.size <= 5 * 1024 * 1024, 'Choose a PDF, JPG or PNG up to 5 MB.');
    actor = { id, name:name.trim(), role:'applicant' };
    if (!existing) s.members.push({ id, name:name.trim(), email:email.trim().toLowerCase(), department, batch, identity:'Alumni', designation:'Alumnus', status:'active', verified:false, joinedAt:at, revision:1, verificationPath:path });
    else Object.assign(existing, { verificationPath:path, revision:existing.revision+1 });
    row = { id:`verify-${id}-${s.revision+1}`, memberId:id, status:'pending', method:path === 'peer' ? 'Peer endorsement' : document.kind, path, voucherId:path === 'peer' ? voucherId : null, document:path === 'document' ? document : null, evidence:path === 'document' ? 'available' : 'missing', summary:path === 'peer' ? 'Awaiting an endorsement from the selected verified member.' : document.name, submittedAt:at, revision:1 };
    s.verification.push(row);
  } else {
    row = s.verification.find(r => r.id === command.id);
    fail(row && row.path === 'peer' && row.status === 'pending' && row.revision === command.revision, 'This request changed or has already been reviewed.');
    const voucher = s.members.find(m => m.id === command.actorId), member = s.members.find(m => m.id === row.memberId);
    fail(voucher?.id === row.voucherId && voucher.verified && voucher.status === 'active', 'Only the selected active verified member can review this request.');
    fail(member && member.status === 'active' && !member.verified, 'The applicant is no longer eligible.');
    fail(['endorse','decline'].includes(command.action), 'Unsupported verification action.');
    if (command.action === 'endorse') {
      fail(command.accepted === true, 'Accept the vouching responsibility agreement before approving.');
      member.verified = true; member.verifiedBy = voucher.id; member.verifiedAt = at; member.revision += 1;
      s.endorsements ||= [];
      s.endorsements.push({ id:`vouch-${row.id}`, applicantId:member.id, voucherId:voucher.id, applicantName:member.name, voucherName:voucher.name, requestId:row.id, at, policyVersion:VOUCH_POLICY, agreement:LIABILITY_TEXT });
    }
    row.status = command.action === 'endorse' ? 'approved' : 'rejected'; row.decidedAt = at; row.reviewerName = voucher.name; row.reason = command.action === 'endorse' ? 'Identity endorsed; responsibility agreement accepted.' : 'The selected member could not confirm this identity.'; row.revision += 1;
    actor = { id:voucher.id, name:voucher.name, role:'peer' };
  }
  s.revision += 1;
  s.audit.unshift({ id:`audit-${s.revision}`, collection:'verification', entityId:row.id, actorId:actor.id, actorName:actor.name, actorRole:actor.role, subject:s.members.find(m => m.id === row.memberId).name, action:command.action, reason:row.reason || 'Alumni identity verification requested.', at, revision:row.revision, before:null, after:{status:row.status,revision:row.revision} });
  return s;
}
export async function alumniAction(command) {
  const perform = () => { const repo = createRepository(localStorage, createSeed); const next = applyAlumniAction(repo.load(), command); localStorage.setItem(STORE_KEY, JSON.stringify(next)); bridgeNotify(); return next; };
  return globalThis.navigator?.locks ? navigator.locks.request('ugrads-admin-write', perform) : perform();
}
export function documentStorage(action, id, file) {
  return new Promise((resolve,reject) => {
    const open = indexedDB.open('ugrads-verification-documents',1);
    open.onupgradeneeded = () => open.result.createObjectStore('documents');
    open.onerror = () => reject(new Error('Document storage is unavailable. Try another browser or the peer path.'));
    open.onsuccess = () => { const db=open.result; const tx=db.transaction('documents', action === 'get' ? 'readonly' : 'readwrite'); const store=tx.objectStore('documents'); const req=action === 'get' ? store.get(id) : store.put(file,id); tx.oncomplete=()=>{db.close();resolve(req.result);}; tx.onerror=()=>{db.close();reject(new Error('The document could not be saved.'));}; };
  });
}
