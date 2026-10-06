import "./department-workspace.css";
import { createElement, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Briefcase,
  Droplet,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  KeyRound,
  LifeBuoy,
  Mail,
  MapPin,
  Megaphone,
  Pencil,
  Phone,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Select } from "../components/ui/Select";
import { SegmentedPill } from "../components/ui/controls";
import {
  PERMISSIONS,
  scenarios,
  officialEmail,
  affiliationDepartmentId,
} from "./departmentModel";
import {
  actOnDepartment,
  allStaff,
  currentAccess,
  currentStaff,
  currentViewer,
  liveDepartment,
  resetDepartmentDemo,
  updateDepartmentState,
  useDepartmentState,
} from "./departmentStore";

const inputClass = (t) =>
  `w-full h-12 px-3 rounded-xl border ${t.inputBorder} ${t.inputBg} ${t.text} text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`;
export const Action = ({
  children,
  onClick,
  t,
  secondary,
  danger,
  className = "",
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    {...props}
    className={`inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${danger ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" : secondary ? `${t.card} ${t.text} border ${t.border} hover:border-[#1D9BF0]/40` : "bg-[#1D9BF0] text-white hover:bg-[#1A8CD8]"} ${className}`}
  >
    {children}
  </button>
);
const Panel = ({ t, children, className = "" }) => (
  <section
    className={`rounded-2xl border ${t.border} ${t.card} p-5 ${className}`}
  >
    {children}
  </section>
);
const Eyebrow = ({ children, t }) => (
  <p
    className={`text-[10px] font-extrabold tracking-wider uppercase ${t.textMuted}`}
  >
    {children}
  </p>
);
const Field = ({ label, t, children }) => (
  <label className="block space-y-2">
    <span className={`text-xs font-bold ${t.textMuted}`}>{label}</span>
    {children}
  </label>
);
const Person = ({ person, t, children, onOpen }) => (
  <div
    className={`flex items-center gap-3 py-3 border-b last:border-0 ${t.borderSoft}`}
  >
    <div
      className={`rounded-full w-10 h-10 shrink-0 flex items-center justify-center ${person.userType === "staff" ? "bg-teal-500/10 text-teal-500" : "bg-[#1D9BF0]/10 text-[#1D9BF0]"}`}
    >
      <UserRound size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <button
        type="button"
        disabled={!onOpen}
        onClick={() => onOpen?.(person)}
        className={`text-left text-sm font-extrabold ${t.text} enabled:hover:text-[#1D9BF0]`}
      >
        {person.name}
      </button>
      <p className={`text-[11px] ${t.textMuted} mt-0.5`}>
        {person.role} · {person.dept}
      </p>
      {children}
    </div>
  </div>
);

export function ExperienceDialog({ title, onClose, t, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      aria-label={title}
      className={`m-auto w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-2xl p-0 border ${t.border} ${t.bg} ${t.text} backdrop:bg-black/40 backdrop:backdrop-blur-sm`}
    >
      <div
        className={`p-5 border-b ${t.borderSoft} flex items-center justify-between gap-3`}
      >
        <h2 className="text-lg font-extrabold">{title}</h2>
        <button
          aria-label="Close dialog"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-500/10 focus-visible:ring-2 focus-visible:ring-[#1D9BF0]"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </dialog>
  );
}

export function PrototypePanel({
  t,
  isDark,
  authRole,
  onSwitch,
  onHome,
  onDepartment,
  onSignup,
  onTheme,
  mobile = false,
}) {
  const state = useDepartmentState();
  const [open, setOpen] = useState(false);
  const viewer = currentViewer(authRole);
  return (
    <div
      className={`${mobile ? "absolute bottom-24 right-3" : "fixed bottom-24 right-4 lg:bottom-5"} z-[120] font-jakarta`}
    >
      {open && (
        <div
          className={`mb-2 p-4 w-[min(320px,calc(100vw-2rem))] rounded-2xl border ${t.border} ${t.surface} ${t.text} shadow-sm space-y-4 max-h-[65dvh] overflow-y-auto`}
        >
          <div className="flex items-start justify-between">
            <div>
              <Eyebrow t={t}>Prototype controls</Eyebrow>
              <p className="text-sm font-extrabold mt-1">
                Explore every perspective
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close prototype controls"
              className="p-1"
            >
              <X size={18} />
            </button>
          </div>
          <p className={`text-xs leading-relaxed ${t.textMuted}`}>
            Review mode only. Changes stay in this session. No emails are sent.
          </p>
          <Select
            t={t}
            isDark={isDark}
            aria-label="Preview as"
            value={viewer.id}
            options={scenarios.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(id) => {
              const next = scenarios.find((s) => s.id === id);
              updateDepartmentState((s) => ({ ...s, viewer: next }));
              onSwitch(next.role);
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <Action
              t={t}
              secondary
              onClick={() => {
                onHome();
                setOpen(false);
              }}
            >
              Home
            </Action>
            <Action
              t={t}
              onClick={() => {
                onDepartment(affiliationDepartmentId(viewer.dept));
                setOpen(false);
              }}
            >
              Department
            </Action>
            <Action
              t={t}
              secondary
              onClick={() => {
                onSignup();
                setOpen(false);
              }}
            >
              Staff signup
            </Action>
            <Action t={t} secondary onClick={onTheme}>
              {isDark ? "Light mode" : "Dark mode"}
            </Action>
          </div>
          <button
            className={`text-xs font-bold ${t.textMuted} hover:text-red-500`}
            onClick={() => {
              resetDepartmentDemo();
              onSwitch("student");
              onHome();
            }}
          >
            Reset demo changes
            {state.events.length > 0
              ? ` · ${state.events.length} event(s)`
              : ""}
          </button>
        </div>
      )}
      <button
        aria-expanded={open}
        aria-label="Prototype controls"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border ${t.border} ${t.surface} ${t.text} px-3 py-2.5 text-[11px] font-extrabold shadow-sm hover:text-[#1D9BF0] focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
      >
        <SlidersHorizontal size={15} /> Prototype{" "}
        <span className="w-1.5 h-1.5 bg-[#1D9BF0] rounded-full" />
      </button>
    </div>
  );
}

export function DepartmentEntry({
  dept: rawDept,
  authRole,
  t,
  isDark,
  onManage,
}) {
  const state = useDepartmentState();
  const dept = liveDepartment(rawDept);
  const access = currentAccess(dept, authRole);
  const [requestOpen, setRequestOpen] = useState(false);
  const [message, setMessage] = useState("");
  const viewer = currentViewer(authRole);
  const pending = state.requests[`d:${dept.id}:u:${viewer.personId}`];
  return (
    <div className="space-y-4 mb-5">
      {dept.cover && (
        <img
          src={dept.cover}
          alt={`${dept.code} department banner`}
          className="w-full aspect-[3/1] object-cover rounded-2xl"
        />
      )}
      {access.canManage && (
        <div
          className={`p-3 rounded-2xl border ${t.border} ${t.card} flex flex-wrap items-center gap-3`}
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-extrabold ${t.text}`}>{access.label}</p>
            <p className={`text-[11px] ${t.textMuted} mt-1`}>
              You’re viewing the public department page.
            </p>
          </div>
          <SegmentedPill
            t={t}
            isDark={isDark}
            value="public"
            options={[
              { id: "public", label: "Public View" },
              { id: "admin", label: "Admin View" },
            ]}
            onChange={(v) => v === "admin" && onManage()}
            className="w-60 shrink-0"
          />
        </div>
      )}
      {access.canRequestOwnership && (
        <Panel t={t}>
          <div className="flex gap-3">
            <KeyRound className="text-[#1D9BF0] shrink-0" size={22} />
            <div>
              <h3 className={`text-sm font-extrabold ${t.text}`}>
                {pending
                  ? "Ownership request under review"
                  : "Help lead your department’s hub"}
              </h3>
              <p className={`text-xs leading-relaxed mt-2 ${t.textMuted}`}>
                {pending
                  ? "Your request is with the Ugrads team. You’ll be notified after verification. No admin access has been granted yet."
                  : "This official page has no owner yet. Verified faculty can request ownership from the Ugrads team."}
              </p>
              {!pending && (
                <Action
                  t={t}
                  onClick={() => setRequestOpen(true)}
                  className="mt-4"
                >
                  Request Ownership <ArrowUpRight size={15} />
                </Action>
              )}
            </div>
          </div>
        </Panel>
      )}
      {requestOpen && (
        <ExperienceDialog
          t={t}
          title="Request department ownership"
          onClose={() => setRequestOpen(false)}
        >
          <p className={`text-sm ${t.textMuted}`}>
            Request ownership of {dept.name}. The Ugrads team verifies your
            affiliation before assigning the single Super Admin role.
          </p>
          <Field t={t} label="Your role or reason (optional)">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass(t)} min-h-24 py-3`}
            />
          </Field>
          <Action
            t={t}
            onClick={() => {
              actOnDepartment(dept, authRole, { type: "request", message });
              setRequestOpen(false);
            }}
          >
            Submit request
          </Action>
        </ExperienceDialog>
      )}
    </div>
  );
}

export function DepartmentWorkspace({
  dept: rawDept,
  authRole,
  t,
  isDark,
  people,
  threads = [],
  eventCount = 0,
  broadcastCount = 0,
  onPublic,
  onBroadcast,
  onEvent,
  onThread,
  onPerson,
  onPostJob,
  onPostBlood,
  onToast,
}) {
  const state = useDepartmentState();
  const dept = liveDepartment(rawDept);
  const access = currentAccess(dept, authRole);
  const [section, setSection] = useState("overview");
  const [dialog, setDialog] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [permission, setPermission] = useState("helpdesk");
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState(() => ({
    about: dept.about,
    office: dept.office,
    officeHours: dept.officeHours,
    phone: dept.phone,
    email: dept.email,
    cover: dept.cover || "",
  }));
  const [error, setError] = useState("");
  const everyone = [
    ...people.filter((p) => p.userType !== "staff"),
    ...allStaff(),
  ];
  const personById = (id) => everyone.find((p) => p.id === Number(id));
  const owner = personById(dept.officialId);
  const admins = Object.entries(dept.assignments)
    .map(([id, role]) => ({ person: personById(id), permission: role }))
    .filter((x) => x.person);
  const unresolved = threads.filter((x) => !state.resolved[x.id]);
  const candidates = everyone
    .filter((p) => p.verified && p.id !== dept.officialId)
    .filter((p) =>
      `${p.name} ${p.nsuId || `NSU-${p.id}`} ${
        p.email ||
        `${p.name
          .replace(/^(Dr\.|Mr\.|Ms\.|Ar\.)\s*/, "")
          .toLowerCase()
          .replaceAll(" ", ".")}@northsouth.edu`
      }`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
  const openDialog = (kind) => {
    setDialog(kind);
    setQuery("");
    setSelected(null);
    setConfirmed(false);
    setPermission("helpdesk");
  };
  const save = () => {
    if (
      !draft.office.trim() ||
      !draft.officeHours.trim() ||
      !draft.about.trim()
    ) {
      setError(
        "Add a description, office location and office hours before saving.",
      );
      return;
    }
    actOnDepartment(dept, authRole, { type: "metadata", values: draft });
    setError("");
    onToast?.("Department page updated");
  };
  const upload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, cover: reader.result }));
      setError("");
    };
    reader.readAsDataURL(file);
  };
  if (!access.canManage)
    return (
      <Panel t={t}>
        <ShieldCheck className="text-[#1D9BF0] mb-3" />
        <h2 className={`text-lg font-extrabold ${t.text}`}>
          This workspace needs an assignment
        </h2>
        <p className={`text-sm my-3 ${t.textMuted}`}>
          Your current account does not have admin access to this department.
        </p>
        <Action t={t} onClick={onPublic}>
          View public page
        </Action>
      </Panel>
    );
  return (
    <div className={`department-workspace @container space-y-5 py-5 ${t.text}`} data-theme={isDark ? "dark" : "light"}>
      <div className="flex items-center gap-3">
        <button
          aria-label="Back to department"
          onClick={onPublic}
          className={`p-3 rounded-xl border ${t.border} ${t.card}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <Eyebrow t={t}>Department workspace</Eyebrow>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1">
            Manage {dept.short}
          </h1>
        </div>
      </div>
      <Panel t={t} className="workspace-identity">
        <div className="flex flex-wrap items-center gap-4">
          <div className="workspace-entity w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-extrabold">
            {dept.short}
          </div>
          <div className="flex-1 min-w-40">
            <h2 className="text-base font-extrabold">{dept.name}</h2>
            <p className={`text-xs mt-1 ${t.textMuted}`}>
              <span className="workspace-access"><ShieldCheck size={12} />{access.label}</span>
            </p>
          </div>
          <SegmentedPill
            t={t}
            isDark={isDark}
            value="admin"
            options={[
              { id: "public", label: "Public View" },
              { id: "admin", label: "Admin View" },
            ]}
            onChange={(v) => v === "public" && onPublic()}
            className="w-60 shrink-0"
          />
        </div>
      </Panel>
      <SegmentedPill
        t={t}
        isDark={isDark}
        options={[
          { id: "overview", label: "Overview" },
          { id: "team", label: "Team & access" },
          { id: "settings", label: "Page settings" },
        ]}
        value={section}
        onChange={setSection}
        className="max-w-xl"
      />
      {section === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Community members", value: dept.memberCount.toLocaleString(), note: "Auto-enrolled in your hub", tone: "blue" },
              { icon: CalendarPlus, label: "Upcoming events", value: eventCount, note: "On the campus calendar", tone: "violet" },
              { icon: Megaphone, label: "Broadcasts sent", value: broadcastCount, note: "In this session", tone: "teal" },
              access.canHelpDesk
                ? { icon: LifeBuoy, label: "Open conversations", value: unresolved.length, note: unresolved.length ? "Ready for your response" : "You're all caught up", tone: "amber" }
                : { icon: ShieldCheck, label: "Workspace team", value: admins.length + (owner ? 1 : 0), note: "Owner and assigned admins", tone: "amber" },
            ].map(({ icon: Icon, label, value, note, tone }) => (
              <Panel key={label} t={t} className={`workspace-stat workspace-tone-${tone}`}>
                <div className="workspace-stat-icon">{createElement(Icon, { size: 19 })}</div>
                <p className="text-3xl font-extrabold tracking-tight mt-4">{value}</p>
                <h3 className="text-xs font-extrabold mt-1">{label}</h3>
                <p className={`text-[10px] mt-2 ${t.textMuted}`}>{note}</p>
              </Panel>
            ))}
          </div>
          <div className="grid grid-cols-1 @4xl:grid-cols-3 gap-5 items-start">
            <div className="@4xl:col-span-2 space-y-5 min-w-0">
              <section>
                <h2 className="text-base font-extrabold mb-3">Create & manage</h2>
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-3">
                  {[
                    access.canBroadcast && { icon: Megaphone, title: "Publish a broadcast", text: "Keep your community in the loop", tone: "blue", action: onBroadcast },
                    access.canCreateEvent && { icon: CalendarPlus, title: "Create an event", text: "Bring your department together", tone: "violet", action: onEvent },
                    access.canHelpDesk && { icon: LifeBuoy, title: "Manage Help Desk", text: `${unresolved.length} conversations awaiting resolution`, tone: "amber", action: () => { const target = document.getElementById("workspace-helpdesk"); target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); target?.focus({ preventScroll: true }); } },
                    access.canEditMetadata && { icon: Pencil, title: "Edit page details", text: "Your banner, contacts and hours", tone: "teal", action: () => setSection("settings") },
                  ].filter(Boolean).map(({ icon: Icon, title, text, tone, action }) => (
                    <button key={title} onClick={action} className={`workspace-action workspace-tone-${tone} text-left rounded-2xl border ${t.border} ${t.card} p-4 focus-visible:ring-2 focus-visible:ring-[#1D9BF0] active:scale-[0.98] transition-all`}>
                      <div className="flex justify-between items-start mb-4"><span className="workspace-action-icon">{createElement(Icon, { size: 24 })}</span><ArrowUpRight size={17} className={t.textMuted} /></div>
                      <h3 className="text-sm font-extrabold">{title}</h3>
                      <p className={`text-xs mt-1.5 leading-relaxed ${t.textMuted}`}>{text}</p>
                    </button>
                  ))}
                </div>
              </section>
              {access.canHelpDesk && (
                <Panel t={t} className="workspace-support">
                  <div id="workspace-helpdesk" tabIndex={-1} className="flex items-center gap-3 mb-4 scroll-mt-24 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1D9BF0]">
                    <span className="workspace-support-icon"><LifeBuoy size={22} /></span>
                    <div className="flex-1"><h3 className="font-extrabold text-base">Student Help Desk</h3><p className={`text-[11px] mt-1 ${t.textMuted}`}>Reply as {dept.short} Department</p></div>
                    <span className="workspace-status workspace-status-open">{unresolved.length} open</span>
                  </div>
                  {threads.length === 0 ? (
                    <div className={`text-center py-8 ${t.textMuted}`}><CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={30} /><p className="text-sm font-bold">All caught up</p><p className="text-xs mt-1">New student questions will appear here.</p></div>
                  ) : [...threads].sort((a, b) => Number(!!state.resolved[a.id]) - Number(!!state.resolved[b.id])).map(thread => (
                    <div key={thread.id} className={`py-4 border-t ${t.borderSoft}`}>
                      <button className="w-full text-left flex gap-3 items-start rounded-lg hover:text-[#1D9BF0] focus-visible:ring-2 focus-visible:ring-[#1D9BF0]" onClick={() => onThread(thread)}>
                        <span className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-xs font-extrabold ${t.inputBg}`}>{thread.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>
                        <span className="flex-1 min-w-0"><span className="block text-sm font-extrabold">{thread.name}</span><span className={`block text-xs mt-1 line-clamp-2 ${t.textMuted}`}>{state.replies[thread.id]?.at(-1)?.text || thread.msg}</span><span className={`block text-[10px] mt-2 ${t.textMuted}`}>{thread.time}</span></span>
                        <ChevronRight size={16} className="shrink-0 mt-1" />
                      </button>
                      <div className="flex flex-wrap items-center justify-between gap-2 ml-12 mt-3">
                        <span className={`workspace-status ${state.resolved[thread.id] ? 'workspace-status-done' : 'workspace-status-open'}`}>{state.resolved[thread.id] ? 'Resolved' : 'Awaiting reply'}</span>
                        <button onClick={() => updateDepartmentState(s => ({ ...s, resolved: { ...s.resolved, [thread.id]: !s.resolved[thread.id] } }))} className="text-[11px] font-bold text-[#1D9BF0] hover:underline rounded-md focus-visible:ring-2 focus-visible:ring-[#1D9BF0]">{state.resolved[thread.id] ? 'Reopen conversation' : 'Mark resolved'}</button>
                      </div>
                    </div>
                  ))}
                </Panel>
              )}
            </div>
            <aside className="space-y-4 min-w-0 @4xl:pt-9">
              <Panel t={t} className="workspace-team-summary">
                <div className="flex items-center justify-between"><span className="workspace-team-icon"><ShieldCheck size={22} /></span><span className={`text-xs font-bold ${t.textMuted}`}>{admins.length + (owner ? 1 : 0)} people</span></div>
                <h3 className="text-base font-extrabold mt-4">Your workspace team</h3>
                <div className="flex -space-x-2 my-4" aria-hidden="true">{[owner, ...admins.map(item => item.person)].filter(Boolean).slice(0, 5).map(person => <span key={person.id} className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${t.border} ${t.surface} text-[#1D9BF0] text-[10px] font-extrabold`}>{person.name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, '').split(' ').map(part => part[0]).slice(0, 2).join('')}</span>)}</div>
                <p className={`text-xs leading-relaxed ${t.textMuted}`}>{owner ? `${owner.name} leads this hub.` : 'No owner assigned.'}</p>
                <button onClick={() => setSection('team')} className="mt-5 flex w-full items-center justify-between text-xs font-extrabold text-[#1D9BF0] rounded-md focus-visible:ring-2 focus-visible:ring-[#1D9BF0]">View team & access <ArrowUpRight size={16} /></button>
              </Panel>
              {access.canEditMetadata && (onPostJob || onPostBlood) && <Panel t={t}>
                <h3 className="text-sm font-extrabold mb-3">Support your community</h3>
                {onPostJob && <button onClick={onPostJob} className="workspace-utility text-emerald-600 dark:text-emerald-400"><Briefcase size={18} /><span>Post a job</span><ChevronRight size={15} /></button>}
                {onPostBlood && <button onClick={onPostBlood} className="workspace-utility text-red-500"><Droplet size={18} /><span>Post blood request</span><ChevronRight size={15} /></button>}
              </Panel>}
              <div className={`flex items-start gap-2 px-2 text-[11px] leading-relaxed ${t.textMuted}`}><Eye size={16} className="shrink-0" /><p>Only your assigned team can see this workspace.</p></div>
            </aside>
          </div>
        </div>
      )}
      {section === "team" && (
        <div className="grid grid-cols-1 @4xl:grid-cols-3 gap-5">
          <Panel t={t} className="@4xl:col-span-2 workspace-team-panel">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="font-extrabold text-lg">
                  The people behind the page
                </h2>
                <p className={`text-xs mt-1 ${t.textMuted}`}>
                  One owner. Clear responsibilities for everyone.
                </p>
              </div>
              {access.canGrantAccess && (
                <Action t={t} onClick={() => openDialog("grant")}>
                  <Users size={16} /> Add teammate
                </Action>
              )}
            </div>
            {owner && (
              <Person person={owner} t={t} onOpen={onPerson}>
                <span className="workspace-status workspace-status-owner mt-2">
                  <KeyRound size={12} /> Super Admin · Owner
                </span>
              </Person>
            )}
            {admins.map(({ person, permission: role }) => (
              <Person key={person.id} person={person} t={t} onOpen={onPerson}>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <span className="workspace-status workspace-status-done">
                    {PERMISSIONS[role].label}
                  </span>
                  {access.canGrantAccess && (
                    <div className="flex gap-3">
                      <button
                        className="text-[11px] text-[#1D9BF0] font-bold"
                        onClick={() => {
                          openDialog("grant");
                          setSelected(person);
                          setPermission(role);
                        }}
                      >
                        Change role
                      </button>
                      <button
                        aria-label={`Remove ${person.name}`}
                        onClick={() => {
                          setSelected(person);
                          setDialog("revoke");
                        }}
                        className="p-1 text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </Person>
            ))}
            {!access.canGrantAccess && (
              <p className={`text-xs mt-4 ${t.textMuted}`}>
                Only the Super Admin can add, remove or change team access.
              </p>
            )}
          </Panel>
          <Panel t={t}>
            <ShieldCheck className="text-[#1D9BF0] mb-3" size={24} />
            <h3 className="font-extrabold text-sm">
              Right access, right responsibility
            </h3>
            <div className="workspace-permissions space-y-4 mt-4">
              {Object.values(PERMISSIONS).map((role) => (
                <div key={role.label} className={`p-3 rounded-xl border ${t.borderSoft} ${t.inputBg}`}>
                  <p className="text-xs font-extrabold">{role.label}</p>
                  <p className={`text-xs leading-relaxed mt-1 ${t.textMuted}`}>
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
      {section === "settings" && (
        <div className="space-y-5 max-w-3xl">
          <Panel t={t}>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Settings2 size={22} className="text-teal-500" /> Your department, at a glance
            </h2>
            <p className={`text-xs mt-1 mb-5 ${t.textMuted}`}>
              {access.canEditMetadata
                ? "Changes appear on the public hub as soon as you save."
                : "Page editing is available to the owner and Primary Admins."}
            </p>
            <fieldset
              disabled={!access.canEditMetadata}
              className="space-y-4 disabled:opacity-70"
            >
              <div
                className={`aspect-[3/1] rounded-xl overflow-hidden border ${t.border} bg-[#1D9BF0]/10 flex items-center justify-center`}
              >
                {draft.cover ? (
                  <img
                    alt="Banner preview"
                    src={draft.cover}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={40} className="text-[#1D9BF0]/50" />
                )}
              </div>
              <Field t={t} label="Cover banner · JPG, PNG or WebP, up to 5 MB">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={upload}
                  className={`block w-full text-xs ${t.textMuted} file:rounded-lg file:border-0 file:py-2 file:px-3 file:mr-3 file:bg-[#1D9BF0]/10 file:text-[#1D9BF0]`}
                />
              </Field>
              {draft.cover && (
                <button
                  onClick={() => setDraft((d) => ({ ...d, cover: "" }))}
                  className="text-xs text-red-500 font-bold"
                >
                  Remove banner
                </button>
              )}
              <Field t={t} label="About the department">
                <textarea
                  value={draft.about}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, about: e.target.value }))
                  }
                  className={`${inputClass(t)} min-h-32 py-3`}
                />
              </Field>
              <div className="grid @lg:grid-cols-2 gap-4">
                {[
                  ["office", "Office location"],
                  ["officeHours", "Office hours"],
                  ["email", "Office email"],
                  ["phone", "Office contact / extension"],
                ].map(([key, label]) => (
                  <Field key={key} t={t} label={label}>
                    <input
                      value={draft[key]}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [key]: e.target.value }))
                      }
                      className={inputClass(t)}
                    />
                  </Field>
                ))}
              </div>
            </fieldset>
            {error && (
              <p role="alert" className="text-xs text-red-500 mt-3">
                {error}
              </p>
            )}
            {access.canEditMetadata && (
              <Action t={t} onClick={save} className="mt-5">
                <Check size={16} /> Save page details
              </Action>
            )}
          </Panel>
          {access.canTransfer && (
            <Panel t={t}>
              <div className="flex gap-3">
                <KeyRound size={22} className="text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm">
                    Department ownership
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${t.textMuted}`}>
                    Transfer the single Super Admin role to another verified
                    member. You’ll remain a Primary Admin, but only the new
                    owner can manage team access.
                  </p>
                  <Action
                    t={t}
                    secondary
                    className="mt-4"
                    onClick={() => openDialog("transfer")}
                  >
                    Transfer ownership
                  </Action>
                </div>
              </div>
            </Panel>
          )}
        </div>
      )}
      {(dialog === "grant" || dialog === "transfer") && (
        <ExperienceDialog
          t={t}
          title={
            dialog === "grant"
              ? "Assign department access"
              : "Transfer ownership"
          }
          onClose={() => setDialog(null)}
        >
          <p className={`text-xs leading-relaxed ${t.textMuted}`}>
            {dialog === "grant"
              ? "Find a verified member and choose only the access they need."
              : `Choose the next owner of ${dept.name}. There can only be one Super Admin.`}
          </p>
          <Field t={t} label="Search by name, NSU ID or email">
            <input
              autoComplete="off"
              placeholder="Name, NSU-301 or email"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              className={inputClass(t)}
            />
          </Field>
          <div
            className={`max-h-48 overflow-auto rounded-xl border ${t.borderSoft}`}
          >
            {candidates.length === 0 ? (
              <p className={`p-4 text-xs ${t.textMuted}`}>
                No verified members match. Try another name, ID or email.
              </p>
            ) : (
              candidates.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelected(person)}
                  className={`w-full text-left p-3 border-b last:border-0 ${t.borderSoft} flex gap-2 items-center ${selected?.id === person.id ? "bg-[#1D9BF0]/10" : "hover:bg-gray-500/5"}`}
                >
                  <div className="flex-1">
                    <p className="text-xs font-extrabold">{person.name}</p>
                    <p className={`text-[10px] mt-1 ${t.textMuted}`}>
                      {person.nsuId || `NSU-${person.id}`} · {person.role} ·{" "}
                      {person.dept}
                    </p>
                  </div>
                  {selected?.id === person.id && (
                    <CheckCircle2 size={18} className="text-[#1D9BF0]" />
                  )}
                </button>
              ))
            )}
          </div>
          {dialog === "grant" ? (
            <>
              <Field label="Permission level" t={t}>
                <Select
                  t={t}
                  isDark={isDark}
                  value={permission}
                  onChange={setPermission}
                  options={Object.entries(PERMISSIONS).map(([value, p]) => ({
                    value,
                    label: p.label,
                  }))}
                />
              </Field>
              <p className={`text-xs ${t.textMuted}`}>
                {PERMISSIONS[permission].description}
              </p>
            </>
          ) : (
            <label
              className={`flex items-start gap-3 text-xs leading-relaxed ${t.textMuted}`}
            >
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 accent-[#1D9BF0]"
              />
              I understand that I will lose ownership and team management
              access. The new owner will be able to remove my remaining access.
            </label>
          )}
          <div className="flex justify-end gap-2">
            <Action t={t} secondary onClick={() => setDialog(null)}>
              Cancel
            </Action>
            <Action
              t={t}
              disabled={!selected || (dialog === "transfer" && !confirmed)}
              onClick={() => {
                actOnDepartment(dept, authRole, {
                  type: dialog,
                  person: selected,
                  permission,
                });
                setDialog(null);
                onToast?.(
                  dialog === "transfer"
                    ? `Ownership transferred to ${selected.name}`
                    : `Access updated for ${selected.name}`,
                );
              }}
            >
              {dialog === "transfer" ? "Confirm transfer" : "Save access"}
            </Action>
          </div>
        </ExperienceDialog>
      )}
      {dialog === "revoke" && (
        <ExperienceDialog
          t={t}
          title="Remove team access?"
          onClose={() => setDialog(null)}
        >
          <p className={`text-sm ${t.textMuted}`}>
            {selected.name} will lose all management access to {dept.short}.
            Their previous messages and posts will remain.
          </p>
          <div className="flex gap-2 justify-end">
            <Action t={t} secondary onClick={() => setDialog(null)}>
              Cancel
            </Action>
            <Action
              t={t}
              danger
              onClick={() => {
                actOnDepartment(dept, authRole, {
                  type: "revoke",
                  personId: selected.id,
                });
                setDialog(null);
                onToast?.("Team access removed");
              }}
            >
              Remove access
            </Action>
          </div>
        </ExperienceDialog>
      )}
    </div>
  );
}

export function StaffHome({
  t,
  authRole,
  departments,
  onManage,
  onDirectory,
  onProfile,
}) {
  useDepartmentState();
  const staff = currentStaff(authRole);
  const assigned = departments.filter(
    (d) => currentAccess(d, authRole).canManage,
  );
  return (
    <div className={`space-y-5 py-6 ${t.text}`}>
      <div>
        <Eyebrow t={t}>University staff / official</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">
          Welcome, {staff.name.split(" ")[0]}
        </h1>
        <p className={`text-sm mt-2 ${t.textMuted}`}>
          {staff.role} · {staff.dept}
        </p>
      </div>
      {assigned.length ? (
        <>
          <h2 className="text-lg font-extrabold">Your workspace</h2>
          {assigned.map((d) => (
            <Panel key={d.id} t={t}>
              <div className="flex gap-3">
                <div className="rounded-xl p-3 bg-[#1D9BF0]/10 text-[#1D9BF0] font-extrabold text-sm">
                  {d.short}
                </div>
                <div>
                  <h3 className="font-extrabold">{d.name}</h3>
                  <p className={`text-xs mt-1 ${t.textMuted}`}>
                    {currentAccess(d, authRole).label}
                  </p>
                </div>
              </div>
              <p className={`text-sm my-4 ${t.textMuted}`}>
                Your department’s people, communication and daily work in one
                place.
              </p>
              <Action t={t} onClick={() => onManage(d)}>
                Open Admin View <ArrowUpRight size={16} />
              </Action>
            </Panel>
          ))}
        </>
      ) : (
        <Panel t={t} className="text-center py-10">
          <div className="inline-flex p-4 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0]">
            <ShieldCheck size={28} />
          </div>
          <h2 className="font-extrabold text-xl mt-4">Your account is ready</h2>
          <p
            className={`text-sm leading-relaxed max-w-md mx-auto mt-3 ${t.textMuted}`}
          >
            You are not assigned any role. Please ask your respective official
            to assign you.
          </p>
          <p className={`text-xs mt-3 ${t.textMuted}`}>
            Your staff verification is complete. Department access is assigned
            separately.
          </p>
          <Action t={t} onClick={onDirectory} className="mt-5">
            Find your department
          </Action>
        </Panel>
      )}
      <Panel t={t}>
        <h3 className="font-extrabold text-sm">Stay connected to campus</h3>
        <p className={`text-xs mt-2 ${t.textMuted}`}>
          Your staff profile helps students find the right person.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Action t={t} secondary onClick={onProfile}>
            View my staff profile
          </Action>
          <Action t={t} secondary onClick={onDirectory}>
            Browse departments
          </Action>
        </div>
      </Panel>
    </div>
  );
}

export function StaffProfile({ person, t, onBack, onDepartment, onMessage }) {
  return (
    <div className={`space-y-5 py-5 ${t.text}`}>
      {onBack && (
        <Action t={t} secondary onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Action>
      )}
      <Panel t={t}>
        <div className="w-20 h-20 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mb-5">
          <UserRound size={34} />
        </div>
        <Eyebrow t={t}>University staff / official</Eyebrow>
        <h1 className="text-2xl font-extrabold tracking-tight mt-2">
          {person.name}{" "}
          <BadgeCheck className="inline text-[#1D9BF0]" size={20} />
        </h1>
        <p className="text-base font-bold mt-2">{person.role}</p>
        <button
          onClick={onDepartment}
          className="text-sm text-[#1D9BF0] font-bold mt-2 hover:underline"
        >
          {person.dept} · North South University
        </button>
        <div className="flex flex-wrap gap-2 mt-5">
          <Action t={t} onClick={onDepartment}>
            <Building2 size={16} /> Department hub
          </Action>
          {onMessage && (
            <Action t={t} secondary onClick={onMessage}>
              <Mail size={16} /> Contact department
            </Action>
          )}
        </div>
      </Panel>
      <Panel t={t}>
        <h2 className="font-extrabold text-base mb-4">Office & contact</h2>
        {[
          [MapPin, "Office location", person.office],
          [
            Phone,
            "Contact / extension",
            person.phone || "Contact the department office",
          ],
          [Mail, "Official email", person.email],
        ].map(([Icon, label, value]) => (
          <div
            key={label}
            className={`flex items-start gap-3 py-3 border-t ${t.borderSoft}`}
          >
            {createElement(Icon, {
              size: 18,
              className: `mt-1 ${t.textMuted}`,
            })}
            <div className="min-w-0">
              <Eyebrow t={t}>{label}</Eyebrow>
              <p className="text-sm font-bold mt-1 break-words">{value}</p>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

export function StaffSignup({ t, isDark, onBack, onComplete }) {
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    role: "",
    dept: "CSE",
    office: "",
    phone: "",
  });
  const [step, setStep] = useState("details");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!officialEmail(draft.email)) {
      setError("Use your official @northsouth.edu email address.");
      return;
    }
    if (["name", "role", "office"].some((k) => !draft[k].trim())) {
      setError("Complete all required fields.");
      return;
    }
    setError("");
    setStep("verify");
  };
  const verify = (e) => {
    e.preventDefault();
    if (code !== "123456") {
      setError("Enter the six-digit demo code: 123456.");
      return;
    }
    const profile = {
      ...allStaff()[3],
      ...Object.fromEntries(
        Object.entries(draft).map(([k, v]) => [k, v.trim()]),
      ),
      id: 304,
      verified: true,
      location: draft.office,
    };
    updateDepartmentState((s) => ({
      ...s,
      profile,
      viewer: {
        ...scenarios.find((x) => x.id === "unassigned"),
        dept: draft.dept,
      },
    }));
    onComplete();
  };
  return (
    <div className={`px-5 py-7 @container space-y-5 py-5 ${t.text}`}>
      <Action
        t={t}
        secondary
        onClick={() => (step === "verify" ? setStep("details") : onBack())}
      >
        <ArrowLeft size={16} /> Back
      </Action>
      <div>
        <Eyebrow t={t}>University staff / official</Eyebrow>
        <h1 className="text-2xl font-extrabold mt-2 tracking-tight">
          {step === "verify"
            ? "Verify your work email"
            : "Your place on campus"}
        </h1>
        <p className={`text-sm leading-relaxed mt-2 ${t.textMuted}`}>
          {step === "verify"
            ? `Confirm ${draft.email} to finish setting up your staff profile.`
            : "Help students find you. Set up your official staff profile in a few details."}
        </p>
      </div>
      {step === "details" ? (
        <form onSubmit={submit} className="space-y-4">
          {[
            ["name", "Full name *", "e.g. Farhana Rahman"],
            ["email", "Official email *", "yourname@northsouth.edu"],
            [
              "role",
              "Job title / designation *",
              "e.g. Program Coordination Officer",
            ],
          ].map(([key, label, placeholder]) => (
            <Field key={key} t={t} label={label}>
              <input
                required
                type={key === "email" ? "email" : "text"}
                autoComplete={
                  key === "name"
                    ? "name"
                    : key === "email"
                      ? "email"
                      : "organization-title"
                }
                value={draft[key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className={inputClass(t)}
              />
            </Field>
          ))}
          <Field t={t} label="Department / office affiliation *">
            <Select
              t={t}
              isDark={isDark}
              value={draft.dept}
              onChange={(dept) => setDraft((d) => ({ ...d, dept }))}
              options={[
                "CSE",
                "ECE",
                "BBA",
                "Architecture",
                "Registrar’s Office",
                "Student Affairs",
              ]}
            />
          </Field>
          {[
            ["office", "Office location *", "e.g. SAC 945"],
            [
              "phone",
              "Office contact / extension (optional)",
              "e.g. Ext. 1502",
            ],
          ].map(([key, label, placeholder]) => (
            <Field key={key} t={t} label={label}>
              <input
                required={key === "office"}
                value={draft[key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className={inputClass(t)}
              />
            </Field>
          ))}
          {error && (
            <p role="alert" className="text-xs text-red-500">
              {error}
            </p>
          )}
          <Action type="submit" t={t} className="w-full">
            Send verification code
          </Action>
          <p className={`text-[11px] leading-relaxed ${t.textMuted}`}>
            Department management access is delegated by your department’s owner
            after verification.
          </p>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-5">
          <div className="rounded-xl bg-[#1D9BF0]/10 text-[#1D9BF0] p-3 text-xs leading-relaxed">
            Prototype verification · use <strong>123456</strong>. No real email
            is sent.
          </div>
          <Field t={t} label="Six-digit verification code">
            <input
              autoComplete="one-time-code"
              aria-label="Verification code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass(t)} text-center tracking-[0.5em]`}
            />
          </Field>
          {error && (
            <p role="alert" className="text-xs text-red-500">
              {error}
            </p>
          )}
          <Action type="submit" t={t} className="w-full">
            Verify & create account
          </Action>
          <button
            type="button"
            className="text-xs font-bold text-[#1D9BF0]"
            onClick={() => {
              setResent(true);
              setError("");
            }}
          >
            {resent ? "Demo code ready: 123456" : "Resend code"}
          </button>
        </form>
      )}
    </div>
  );
}

export function StaffDirectory({ people, t, view = "card", onSelect }) {
  return (
    <div
      className={`@container grid gap-3 ${view === "card" ? "@lg:grid-cols-2 @4xl:grid-cols-3" : ""}`}
    >
      {people.map((person) => (
        <button
          key={person.id}
          onClick={() => onSelect(person)}
          className={`text-left p-5 rounded-2xl border ${t.border} ${t.card} ${t.text} hover:border-[#1D9BF0]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
        >
          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
              <UserRound size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">
                {person.name}{" "}
                <BadgeCheck size={14} className="inline text-[#1D9BF0]" />
              </p>
              <p className={`text-xs font-semibold mt-1 ${t.textMuted}`}>
                {person.role}
              </p>
              <p className="text-[11px] font-bold text-teal-500 mt-2">
                University staff · {person.dept}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 mt-4 pt-3 border-t ${t.borderSoft} text-xs font-bold`}
          >
            <MapPin size={14} className={t.textMuted} />
            {person.office}
            <ChevronRight size={14} className="ml-auto text-[#1D9BF0]" />
          </div>
        </button>
      ))}
    </div>
  );
}
