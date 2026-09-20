import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { PageContainer, PageHeader, FormColumn } from '../../components/layout/AppShell';
import { Button, Card, Field, IconButton, SelectInput, TextArea, TextInput } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';

/* /events/create — ported from CreateEventScreen in the mobile app. */
export default function CreateEventPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const goBack = useCloseTo('/events');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [schedules, setSchedules] = useState([{ time: '', title: '' }]);

  const addSchedule = () => setSchedules([...schedules, { time: '', title: '' }]);
  const removeSchedule = (idx) => setSchedules(schedules.filter((_, i) => i !== idx));
  const updateSchedule = (idx, field, value) => {
    setSchedules(prev => prev.map((sch, i) => (i === idx ? { ...sch, [field]: value } : sch)));
  };

  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-center gap-3">
        <IconButton icon={ArrowLeft} label="Back" onClick={goBack} />
        <PageHeader className="flex-1" title={isSubmitted ? 'Status' : 'Create Event'} />
      </div>

      {!isSubmitted ? (
        <Card className="space-y-5 mb-8">
          <Field label="Event Title">
            <TextInput type="text" placeholder="e.g. Annual Tech Symposium" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <SelectInput>
                <option>Academic</option><option>Workshop</option><option>Competition</option>
                <option>Career</option><option>Cultural</option><option>Sports</option>
              </SelectInput>
            </Field>
            <Field label="Capacity">
              <TextInput type="number" placeholder="e.g. 150" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Event Date">
              <TextInput type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
            </Field>
            <Field label="Reg. Deadline">
              <TextInput type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-50" />
            </Field>
          </div>

          {/* Dynamic Event Schedule Builder */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-[11px] font-extrabold ${t.textMuted} uppercase tracking-wider block`}>Event Schedule</label>
              <button
                onClick={addSchedule}
                className="text-[#1D9BF0] text-[10px] font-extrabold flex items-center bg-[#1D9BF0]/10 px-2 py-1 rounded-md active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {schedules.map((sch, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={sch.time}
                    onChange={(e) => updateSchedule(idx, 'time', e.target.value)}
                    aria-label={`Schedule item ${idx + 1} time`}
                    className={`w-28 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-2 text-xs font-bold ${t.text} focus:outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-50`}
                  />
                  <input
                    type="text"
                    placeholder="Agenda title"
                    value={sch.title}
                    onChange={(e) => updateSchedule(idx, 'title', e.target.value)}
                    aria-label={`Schedule item ${idx + 1} title`}
                    className={`flex-1 min-w-0 ${t.inputBg} border ${t.inputBorder} rounded-xl h-12 px-3 text-xs font-bold ${t.text} focus:outline-none transition-all shadow-sm`}
                  />
                  {schedules.length > 1 && (
                    <button
                      onClick={() => removeSchedule(idx)}
                      aria-label={`Remove schedule item ${idx + 1}`}
                      className="w-10 h-12 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl shrink-0 active:scale-95 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Field label="Venue">
            <div className="space-y-3">
              <TextInput type="text" placeholder="e.g. AUDI 801" />
              <TextInput type="text" placeholder="Venue Details (e.g. Admin Building, Level 8)" />
            </div>
          </Field>

          <Field label="Cover Image URL">
            <TextInput type="url" placeholder="https://..." />
          </Field>

          <Field label="Description">
            <TextArea rows={4} placeholder="What is this event about?" />
          </Field>

          <Field label="Registration Info">
            <TextArea rows={2} placeholder="e.g. Free for CSE students" />
          </Field>

          <Button full size="lg" onClick={() => setIsSubmitted(true)}>
            Publish Event
          </Button>
        </Card>
      ) : (
        <Card padded={false} className="px-6 py-16 mb-8 flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Event Created!</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 max-w-xs leading-relaxed`}>
            Your event has been successfully published and is now live for students to register.
          </p>
          <Button variant="neutral" size="lg" className="w-full max-w-xs" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </Card>
      )}
    </FormColumn>
    </PageContainer>
  );
}
