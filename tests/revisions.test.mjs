import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../nsunext-admin/src/data/seed.js';
import { applyAlumniAction, LIABILITY_TEXT, VOUCH_POLICY } from '../src/shared/verificationService.js';
import { transition } from '../nsunext-admin/src/lib/model.js';
import { createRepository, STORE_KEY } from '../nsunext-admin/src/data/repository.js';
import { selectConversations, connectedIds, archivedIds, toggleArchive } from '../src/shared/communityPreferences.js';
const now=Date.parse('2026-10-12T10:00:00Z');
const submit={action:'submit',id:'alumni-test',name:'Test Applicant',email:'test@example.test',department:'CSE',batch:'191',path:'peer',voucherId:'1'};
const pending=()=>applyAlumniAction(createSeed(now),submit,now);
const decision=s=>({action:'endorse',id:s.verification.at(-1).id,revision:1,actorId:'1',accepted:true});
test('alumni submission stays unverified and validates duplicate email, pending requests and voucher eligibility',()=>{
 const s=pending();assert.equal(s.members.at(-1).verified,false);assert.equal(s.verification.at(-1).status,'pending');
 assert.throws(()=>applyAlumniAction(s,submit,now),/pending/);
 assert.throws(()=>applyAlumniAction(s,{...submit,id:'alumni-second'},now),/email/);
 assert.throws(()=>applyAlumniAction(createSeed(now),{...submit,voucherId:'5'},now),/verified member/);
 assert.throws(()=>applyAlumniAction(createSeed(now),{...submit,voucherId:submit.id},now),/verified member/);
});
test('only selected active voucher can endorse with explicit responsibility acceptance',()=>{
 const s=pending();const cmd=decision(s);
 assert.throws(()=>applyAlumniAction(s,{...cmd,accepted:false},now),/agreement/);
 assert.throws(()=>applyAlumniAction(s,{...cmd,actorId:'2'},now),/selected/);
 const inactive=structuredClone(s);inactive.members.find(m=>m.id==='1').status='suspended';
 assert.throws(()=>applyAlumniAction(inactive,cmd,now),/selected/);
 const approved=applyAlumniAction(s,cmd,now);assert.equal(approved.members.at(-1).verified,true);assert.equal(approved.members.at(-1).verifiedBy,'1');
 assert.equal(approved.endorsements[0].agreement,LIABILITY_TEXT);assert.equal(approved.endorsements[0].policyVersion,VOUCH_POLICY);
 assert.throws(()=>applyAlumniAction(approved,cmd,now),/already been reviewed/);
 assert.equal(s.members.at(-1).verified,false);
});
test('peer reviews cannot be overridden by admin document approval; declined applicant may retry',()=>{
 const s=pending(),cmd=decision(s);
 assert.throws(()=>transition(s,'admin-owner',{collection:'verification',id:cmd.id,revision:1,action:'approve',values:{reviewed:true}},now),/selected voucher/);
 const declined=applyAlumniAction(s,{...cmd,action:'decline',accepted:false},now);
 assert.equal(declined.members.at(-1).verified,false);
 const retried=applyAlumniAction(declined,submit,now);assert.equal(retried.verification.at(-1).status,'pending');assert.notEqual(retried.verification.at(-1).id,cmd.id);
});
test('endorsement history survives reload and account restrictions never cascade',()=>{
 const s=pending(),approved=applyAlumniAction(s,decision(s),now);
 const suspended=transition(approved,'admin-owner',{collection:'members',id:submit.id,revision:2,action:'suspend',reason:'Test manual investigation'},now);
 assert.equal(suspended.members.find(m=>m.id==='1').status,'active');assert.deepEqual(suspended.endorsements,approved.endorsements);
 const store=new Map([[STORE_KEY,JSON.stringify(suspended)]]);const repo=createRepository({getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},()=>createSeed(now));
 assert.equal(repo.load().members.at(-1).verifiedBy,'1');assert.equal(repo.load().endorsements.length,1);
 approved.admins.push({id:'reviewing-owner',name:'Second Owner',role:'owner',active:true,revision:1});
 const voucherSuspended=transition(approved,'reviewing-owner',{collection:'members',id:'1',revision:approved.members.find(m=>m.id==='1').revision,action:'suspend',reason:'Test individual restriction'},now);
 assert.equal(voucherSuspended.members.at(-1).status,'active');assert.equal(voucherSuspended.members.at(-1).verified,true);
});
test('document path validates evidence and requires admin review to verify',()=>{
 const document={id:'document-test',name:'certificate.pdf',kind:'Degree certificate',type:'application/pdf',size:1024};
 assert.throws(()=>applyAlumniAction(createSeed(now),{...submit,path:'document'},now),/PDF/);
 assert.throws(()=>applyAlumniAction(createSeed(now),{...submit,path:'document',document:{...document,size:6*1024*1024}},now),/PDF/);
 const s=applyAlumniAction(createSeed(now),{...submit,path:'document',document},now),row=s.verification.at(-1);
 assert.equal(s.members.at(-1).verified,false);
 const command={collection:'verification',id:row.id,revision:1,action:'approve',values:{reviewed:true}};
 assert.throws(()=>transition(s,'admin-owner',{...command,values:{}},now),/evidence/);
 assert.equal(transition(s,'admin-owner',command,now).members.at(-1).verified,true);
});
test('messages separate requests, help desk and archived conversations with search',()=>{
 const input={conversations:[{id:1,name:'Sarah',isRequest:false,unread:true},{id:2,name:'New contact',isRequest:true}],channels:[{id:'broadcast',kind:'broadcast'},{id:'help',kind:'helpdesk'}],helpdesk:[{id:'incoming',name:'Student question'}],archived:new Set(['1']),segment:'All Chats'};
 assert.deepEqual(selectConversations(input).map(c=>c.id),['broadcast']);
 assert.deepEqual(selectConversations({...input,filter:'Requests'}).map(c=>c.id),[2]);
 assert.deepEqual(selectConversations({...input,segment:'Archived'}).map(c=>c.id),[1]);
 assert.deepEqual(selectConversations({...input,segment:'Help Desk'}).map(c=>c.id),['help','incoming']);
 assert.deepEqual(selectConversations({...input,segment:'Archived',search:'unknown'}),[]);
});
test('archive preferences persist per viewer; new applicants have no invented connections',()=>{
 const previous=globalThis.localStorage,store=new Map();globalThis.localStorage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
 try {assert.equal(connectedIds('alumni-new').size,0);assert.equal(toggleArchive('1','chat'),true);assert.ok(archivedIds('1').has('chat'));assert.equal(archivedIds('2').size,0);assert.equal(toggleArchive('1','chat'),false);}finally{globalThis.localStorage=previous;}
});
