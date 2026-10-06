import { globalDepartments } from '../data/departments';
import { getDepartmentAccess } from './departmentAccess';
import { useAppState } from '../context/AppStateContext';

export function useOwnedDepartment() {
  const { authRole } = useAppState();
  return globalDepartments.find(dept => getDepartmentAccess(dept, authRole).isOfficial);
}
