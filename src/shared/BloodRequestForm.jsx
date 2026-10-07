import { useState } from 'react';
import { submitPublic } from './adminBridge.js';
import { currentViewer } from './departmentStore.js';

export function BloodRequestForm({ onClose, authRole = 'student', isDark = false }) {
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const input = `w-full border rounded-lg px-3 py-2 text-sm ${isDark ? 'bg-[#171717] text-white border-white/20' : 'bg-white text-gray-900 border-gray-300'}`;
  return <form className={`space-y-4 text-left w-full ${isDark ? 'text-white' : 'text-gray-900'}`} onSubmit={e => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(v.contact.replace(/[ -]/g, ''))) throw new Error('Enter a Bangladesh mobile contact number.');
      submitPublic('requests', { ...v, id: `request-${crypto.randomUUID()}`, title: `${v.bg} · ${v.hospital}`, memberId: String(currentViewer(authRole).personId), units: Number(v.units), status: 'open', expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(), time: 'Just now', distance: 'Location supplied', match: '' });
      setSaved(true);
    } catch (err) { setError(err.message); }
  }}>
    <h2 className="text-xl font-bold">{saved ? 'Request created' : 'Create blood request'}</h2>
    {saved ? <><p className="text-sm">Your request is listed for 48 hours in this local preview. No notifications have been sent.</p><button type="button" className="w-full rounded-lg py-3 bg-red-600 text-white font-bold" onClick={onClose}>Done</button></> : <>
      <p className="text-sm opacity-70">Share the contact and location donors need. This request is saved in your browser.</p>
      {[['hospital', 'Hospital'], ['location', 'Location'], ['patientName', 'Patient name'], ['contact', 'Contact mobile number']].map(([key, label]) => <label key={key} className="block text-sm font-semibold">{label}<input className={`${input} mt-1`} name={key} required maxLength={120} type={key === 'contact' ? 'tel' : 'text'} /></label>)}
      <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Blood group<select className={`${input} mt-1`} name="bg" required>{['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}</select></label><label className="text-sm font-semibold">Units<input className={`${input} mt-1`} name="units" type="number" min="1" max="20" defaultValue="1" required /></label></div>
      <label className="block text-sm font-semibold">Urgency<select className={`${input} mt-1`} name="urgency"><option>Critical</option><option>Needed Today</option><option>Scheduled</option></select></label>
      <label className="block text-sm font-semibold">Request context<textarea className={`${input} mt-1`} name="description" maxLength={600} rows={2} required /></label>
      {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
      <div className="flex gap-3"><button type="button" className={`${input} flex-1`} onClick={onClose}>Cancel</button><button type="submit" className="flex-1 bg-red-600 text-white rounded-lg py-3 text-sm font-bold">Create request</button></div>
    </>}
  </form>;
}
