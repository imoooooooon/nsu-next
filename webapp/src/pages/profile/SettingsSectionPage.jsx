import { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Clock, Lock, Mail, MapPin, Monitor, Phone, Smartphone, User,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { getViewerIdentity } from '../../data/people';
import { PageContainer, PageHeader, FormColumn } from '../../components/layout/AppShell';
import { Button, Card, Field, FieldLabel, IconButton, SelectInput, TextArea, TextInput } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';

/* ---------------------------------------------------------------------------
   /profile/settings/:section — the mobile SettingsFlowOverlay as a routed
   page. Each section's form is a 1:1 port of the overlay content.
--------------------------------------------------------------------------- */

const SECTION_TITLES = {
  personal_info: 'Personal Information',
  email_phone: 'Email & Phone',
  password: 'Change Password',
  language: 'Language Preferences',
  visibility: 'Profile Visibility',
  sessions: 'Active Sessions',
};

/* Selectable option row (language / visibility) — port of the overlay rows. */
const OptionRow = ({ label, selected, onSelect }) => {
  const { t, isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full p-4 rounded-xl border ${selected ? `border-[#1D9BF0] ${isDark ? 'bg-[#1D9BF0]/10' : 'bg-blue-50'}` : `${t.inputBorder} ${t.inputBg}`} flex justify-between items-center cursor-pointer transition-all shadow-sm active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
    >
      <span className={`text-sm font-bold ${selected ? 'text-[#1D9BF0]' : t.text}`}>{label}</span>
      {selected && <CheckCircle2 className="w-5 h-5 text-[#1D9BF0]" strokeWidth={2.5} />}
    </button>
  );
};

export default function SettingsSectionPage() {
  const { section } = useParams();
  const { t, isDark } = useTheme();
  const {
    authRole, showToast,
    appLanguage, setAppLanguage,
    profileVisibility, setProfileVisibility,
    activeSessions, setActiveSessions,
  } = useAppState();
  const close = useCloseTo('/profile');

  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef(null);
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const title = SECTION_TITLES[section];
  if (!title) return <Navigate to="/profile" replace />;

  const identity = getViewerIdentity(authRole);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    saveTimer.current = setTimeout(() => {
      setIsSaving(false);
      showToast('Changes saved');
      close();
    }, 1000);
  };

  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-center gap-4">
        <div className="pt-8 lg:pt-10 pb-5 shrink-0">
          <IconButton icon={ArrowLeft} label="Back to Control Center" onClick={close} />
        </div>
        <div className="flex-1 min-w-0">
          <PageHeader title={title} />
        </div>
      </div>

      <Card padded={false} className="p-6 space-y-5">
        {section === 'personal_info' && (
          <>
            <Field label="Full Name">
              <TextInput icon={User} type="text" defaultValue={identity.fullName} />
            </Field>
            <Field label="Bio / Tagline">
              <TextArea rows={3} defaultValue={identity.roleSub} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location">
                <TextInput icon={MapPin} type="text" defaultValue="Dhaka, BD" />
              </Field>
              <Field label="Blood Group">
                <SelectInput defaultValue="B+">
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </SelectInput>
              </Field>
            </div>
            <Field label="Last Donated Date">
              <TextInput
                icon={Clock}
                type="date"
                defaultValue="2023-08-14"
                style={{ colorScheme: isDark ? 'dark' : 'light' }}
                className="[&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
              />
            </Field>
          </>
        )}

        {section === 'email_phone' && (
          <>
            <Field label="University Email (Primary)" hint="Primary university email cannot be changed.">
              <TextInput
                icon={Mail}
                type="email"
                defaultValue={identity.email}
                disabled
                aria-label="University email (cannot be changed)"
                className="disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </Field>
            <Field label="Recovery Email">
              <TextInput icon={Mail} type="email" placeholder="Add recovery email" />
            </Field>
            <Field label="Phone Number">
              <TextInput icon={Phone} type="tel" defaultValue="+880 1712 345678" />
            </Field>
          </>
        )}

        {section === 'password' && (
          <>
            <Field label="Current Password">
              <TextInput icon={Lock} type="password" placeholder="Enter current password" />
            </Field>
            <Field label="New Password">
              <TextInput icon={Lock} type="password" placeholder="Enter new password" />
            </Field>
            <Field label="Confirm New Password">
              <TextInput icon={Lock} type="password" placeholder="Confirm new password" />
            </Field>
          </>
        )}

        {section === 'language' && (
          <div>
            <FieldLabel className="mb-3">Select Display Language</FieldLabel>
            <div className="space-y-3">
              {['English', 'Bengali', 'Spanish', 'French'].map((lang) => (
                <OptionRow
                  key={lang}
                  label={lang}
                  selected={appLanguage === lang}
                  onSelect={() => setAppLanguage(lang)}
                />
              ))}
            </div>
          </div>
        )}

        {section === 'visibility' && (
          <div>
            <FieldLabel className="mb-3">Who can see your profile</FieldLabel>
            <div className="space-y-3">
              {['Public', 'NSU Network', 'Connections Only', 'Private'].map((vis) => (
                <OptionRow
                  key={vis}
                  label={vis}
                  selected={profileVisibility === vis}
                  onSelect={() => setProfileVisibility(vis)}
                />
              ))}
            </div>
          </div>
        )}

        {section === 'sessions' && (
          <div>
            <FieldLabel className="mb-3">Current Sessions</FieldLabel>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border ${t.inputBorder} ${t.inputBg} flex justify-between items-center shadow-sm`}
                >
                  <div className="flex items-center space-x-3">
                    {session.type === 'mobile'
                      ? <Smartphone className={`w-5 h-5 ${t.text}`} strokeWidth={2} />
                      : <Monitor className={`w-5 h-5 ${t.textMuted}`} strokeWidth={2} />}
                    <div>
                      <p className={`text-sm font-bold ${t.text}`}>{session.device}</p>
                      <p className={`text-[10px] font-extrabold ${session.active ? 'text-[#1D9BF0]' : t.textMuted} uppercase tracking-wider mt-0.5`}>
                        {session.active ? `Active Now • ${session.location}` : `${session.time} • ${session.location}`}
                      </p>
                    </div>
                  </div>
                  {!session.active && (
                    <button
                      onClick={() => setActiveSessions((prev) => prev.filter((s) => s.id !== session.id))}
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors rounded outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Log Out
                    </button>
                  )}
                </div>
              ))}
            </div>
            {activeSessions.length > 1 && (
              <button
                onClick={() => setActiveSessions((prev) => prev.filter((s) => s.active))}
                className="w-full mt-6 h-12 rounded-xl font-bold text-sm border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Log Out of All Other Devices
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Sticky save footer — sticks above the mobile capsule nav / desktop edge. */}
      <div className="sticky bottom-28 lg:bottom-6 z-20 mt-6">
        <Button
          size="lg"
          full
          onClick={handleSave}
          aria-busy={isSaving}
          aria-label="Save Changes"
          className="shadow-lg shadow-[#1D9BF0]/20"
        >
          {isSaving
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : 'Save Changes'}
        </Button>
      </div>
    </FormColumn>
    </PageContainer>
  );
}
