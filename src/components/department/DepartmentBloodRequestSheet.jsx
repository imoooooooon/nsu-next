import { useState } from 'react';
import { Droplet, AlertTriangle } from 'lucide-react';
import { EntityAvatar, DepartmentSheet } from './DepartmentPrimitives';

/* ---------------------------------------------------------------------------
   Posting an Emergency Blood request AS the department (brief §4).

   The department posts on behalf of someone else, so the form asks two things
   a personal request never does: who it is for, and who at the department is
   accountable. The identity band at the top is not decoration — it answers
   "whose name goes on this", which is the whole risk of posting for another.
--------------------------------------------------------------------------- */

const BLOOD_GROUPS = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
const URGENCIES = ['Critical', 'Needed Today', 'Within 3 Days'];
const BENEFICIARIES = ['A student', 'A faculty member', 'Department staff', "A member's family"];

export const DepartmentBloodRequestSheet = ({ dept, t, isDark, onClose, onPost }) => {
  const [bg, setBg] = useState('B+');
  const [urgency, setUrgency] = useState('Critical');
  const [hospital, setHospital] = useState('');

  const inputClass = `w-full ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-4 text-sm font-bold ${t.text} outline-none shadow-sm placeholder:font-bold`;
  const labelClass = `text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-2 block`;

  return (
    <DepartmentSheet title="Post Blood Request" onClose={onClose} t={t} isDark={isDark}>
      <div className="space-y-5">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft}`}>
          <EntityAvatar dept={dept} size="sm" isDark={isDark} />
          <div className="min-w-0">
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posting as</p>
            <p className={`text-sm font-extrabold ${t.text} truncate`}>{dept.code} Department</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Blood Group</label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map(g => (
              <button
                key={g}
                onClick={() => setBg(g)}
                aria-pressed={bg === g}
                className={`h-11 rounded-xl text-xs font-extrabold border transition-all active:scale-[0.97] ${
                  bg === g
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/60 text-gray-700 border-white'}`
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Units</label>
            <input type="number" min="1" defaultValue="2" aria-label="Units needed" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" placeholder="Bashundhara" aria-label="Location" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Hospital</label>
          <input
            type="text"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            placeholder="e.g. Evercare Hospital"
            aria-label="Hospital"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Requested On Behalf Of</label>
          <select defaultValue={BENEFICIARIES[0]} aria-label="Requested on behalf of" className={`${inputClass} appearance-none cursor-pointer`}>
            {BENEFICIARIES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Urgency</label>
          <div className="flex gap-2">
            {URGENCIES.map(u => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                aria-pressed={urgency === u}
                className={`flex-1 h-11 rounded-xl text-[11px] font-extrabold border transition-all active:scale-[0.97] ${
                  urgency === u
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/60 text-gray-700 border-white'}`
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Details</label>
          <textarea
            rows="3"
            placeholder="Ward, contact person, any constraint donors should know…"
            aria-label="Details"
            className={`w-full ${t.inputBg} border ${t.inputBorder} rounded-xl p-4 text-sm font-bold ${t.text} outline-none resize-none shadow-sm placeholder:font-bold`}
          />
        </div>

        <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-red-300' : 'text-red-700'}`}>
            This goes to the campus-wide Emergency Blood network under the department's name.
            Confirm the patient consents to being listed before posting.
          </p>
        </div>

        <button
          onClick={() => onPost(dept, bg)}
          disabled={!hospital.trim()}
          className="w-full h-12 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center disabled:opacity-40 active:scale-[0.97] transition-transform"
        >
          <Droplet className="w-4 h-4 mr-2" strokeWidth={2.5} /> Post as {dept.code} Department
        </button>
      </div>
    </DepartmentSheet>
  );
};
