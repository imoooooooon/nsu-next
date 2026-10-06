import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { DepartmentWorkspace } from "../../../../src/shared/DepartmentExperience";
import { PageContainer } from "../../components/layout/AppShell";
import { useTheme } from "../../theme/ThemeContext";
import { useAppState } from "../../context/AppStateContext";
import {
  findDepartmentById,
  departmentHelpDeskThreads,
} from "../../data/departments";
import { allDirectoryUsers } from "../../data/people";
import { getDepartmentEvents } from "../../data/events";
import { DepartmentBloodRequestModal } from "../../features/departments/DepartmentBloodRequestModal";
import { DepartmentOwnerNav } from "../../features/departments/DepartmentOwnerNav";
export default function DepartmentManagePage() {
  const { t, isDark } = useTheme();
  const { authRole, showToast, sentBroadcasts } = useAppState();
  const navigate = useNavigate();
  const { deptId } = useParams();
  const [blood, setBlood] = useState(false);
  const dept = findDepartmentById(deptId);
  if (!dept) return <Navigate to="/departments" replace />;
  return (
    <PageContainer>
      <DepartmentOwnerNav />
      <DepartmentWorkspace
        key={dept.id}
        dept={dept}
        authRole={authRole}
        t={t}
        isDark={isDark}
        people={allDirectoryUsers}
        threads={departmentHelpDeskThreads[dept.id] || []}
        eventCount={getDepartmentEvents(dept.id).length}
        broadcastCount={(sentBroadcasts[dept.id] || []).length}
        onPublic={() => navigate(`/departments/${dept.id}`)}
        onBroadcast={() => navigate(`/messages/dept-${dept.id}-broadcast`)}
        onEvent={() => navigate(`/events/create?as=${dept.id}`)}
        onThread={(thread) => navigate(`/messages/${thread.id}`)}
        onPerson={(p) => navigate(`/network/${p.id}`)}
        onToast={showToast}
        onPostJob={() => navigate(`/jobs/post?as=${dept.id}`)}
        onPostBlood={() => setBlood(true)}
      />
      {blood && (
        <DepartmentBloodRequestModal
          dept={dept}
          onClose={() => setBlood(false)}
        />
      )}
    </PageContainer>
  );
}
