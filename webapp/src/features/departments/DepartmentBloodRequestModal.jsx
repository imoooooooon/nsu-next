import { useState } from 'react';
import { Droplet, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { Modal, Button, Field, TextInput, SelectInput, TextArea } from '../../components/ui';
import { EntityAvatar } from './DepartmentPrimitives';
import { bloodGroups } from '../../data/emergency';

/* ---------------------------------------------------------------------------
   Posting an Emergency Blood request AS the department (brief §4).

   The department posts on behalf of someone else, so the form asks two things
   a personal request never does: who it is for, and who at the department is
   accountable for it. The identity band at the top is not decoration — it is
   the answer to "whose name goes on this", which is the whole risk of posting
   on another person's behalf.
--------------------------------------------------------------------------- */

const URGENCIES = ['Critical', 'Needed Today', 'Within 3 Days'];
const BENEFICIARIES = ['A student', 'A faculty member', 'Department staff', "A member's family"];

export const DepartmentBloodRequestModal = ({ dept, onClose }) => {
  const { t, isDark } = useTheme();
  const { showToast } = useAppState();
  const [bg, setBg] = useState('B+');
  const [urgency, setUrgency] = useState('Critical');
  const [hospital, setHospital] = useState('');

  const canPost = hospital.trim().length > 0;

  const handlePost = () => {
    onClose();
    showToast(`${bg} request posted as ${dept.code} Department`);
  };

  return (
    <Modal onClose={onClose} title="Post Blood Request" size="md">
      <div className="space-y-5 pb-2">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} border ${t.borderSoft}`}>
          <EntityAvatar dept={dept} size="sm" />
          <div className="min-w-0">
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posting as</p>
            <p className={`text-sm font-extrabold ${t.text} truncate`}>{dept.code} Department</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Blood Group">
            <SelectInput value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Blood group">
              {bloodGroups.map(g => <option key={g.bg} value={g.bg}>{g.bg}</option>)}
            </SelectInput>
          </Field>
          <Field label="Units Needed">
            <TextInput type="number" min="1" defaultValue="2" aria-label="Units needed" />
          </Field>
        </div>

        <Field label="Hospital">
          <TextInput
            type="text"
            placeholder="e.g. Evercare Hospital"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          />
        </Field>

        <Field label="Location">
          <TextInput type="text" placeholder="e.g. Bashundhara, Dhaka" />
        </Field>

        <Field label="Requested On Behalf Of">
          <SelectInput defaultValue={BENEFICIARIES[0]} aria-label="Requested on behalf of">
            {BENEFICIARIES.map(b => <option key={b} value={b}>{b}</option>)}
          </SelectInput>
        </Field>

        <Field label="Urgency">
          <div className="flex gap-2">
            {URGENCIES.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                aria-pressed={urgency === u}
                className={`flex-1 h-11 rounded-xl text-[11px] font-extrabold border transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 ${
                  urgency === u
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/60 text-gray-700 border-white'}`
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Details">
          <TextArea rows="3" placeholder="Ward, contact person, any constraint donors should know…" />
        </Field>

        <div className={`flex items-start gap-3 p-3.5 rounded-xl ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border`}>
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-red-300' : 'text-red-700'}`}>
            This goes to the campus-wide Emergency Blood network under the department's name.
            Confirm the patient consents to being listed before posting.
          </p>
        </div>

        <Button variant="danger" size="md" full icon={Droplet} disabled={!canPost} onClick={handlePost}>
          Post as {dept.code} Department
        </Button>
      </div>
    </Modal>
  );
};
