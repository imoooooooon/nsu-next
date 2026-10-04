import { DepartmentWorkspace } from "../../shared/DepartmentExperience";
import { departmentHelpDeskThreads } from "./data";
export const DepartmentManageOverlay = ({
  dept,
  authRole,
  t,
  isDark,
  facultyData,
  broadcastsSent,
  onBack,
  onOpenChannel,
  onCreateEvent,
  onPostJob,
  onPostBlood,
  onSelectUser,
  upcomingEventCount,
  onToast,
}) => (
  <div className={`absolute inset-0 z-[60] overflow-y-auto p-5 pb-28 ${t.bg}`}>
    <DepartmentWorkspace
      dept={dept}
      authRole={authRole}
      t={t}
      isDark={isDark}
      people={facultyData}
      threads={departmentHelpDeskThreads[dept.id] || []}
      eventCount={upcomingEventCount}
      broadcastCount={broadcastsSent}
      onPublic={onBack}
      onBroadcast={() => onOpenChannel(dept, "broadcast")}
      onEvent={() => onCreateEvent(dept)}
      onThread={(thread) => onOpenChannel(dept, "helpdesk-thread", thread)}
      onPerson={onSelectUser}
      onPostJob={() => onPostJob(dept)}
      onPostBlood={() => onPostBlood(dept)}
      onToast={onToast}
    />
  </div>
);
