import { OperationList, OperationDetail, OperationCreate } from './features/Operations';
import { Analytics, Audit, Settings } from './features/Administration';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAdmin } from './app/context';
import { can } from './lib/model';
import Shell from './components/layout/Shell';
import { Empty, ButtonLink } from './components/ui';
import Login from './features/Login';
import Overview from './features/Overview';
import { MemberList, MemberDetail } from './features/Members';
import { VerificationList, VerificationDetail, ClaimList, ClaimDetail } from './features/Reviews';
import { DepartmentList, DepartmentDetail, DepartmentCreate } from './features/Departments';
import { CareerList, CareerDetail } from './features/Careers';
function Session() { const { actor } = useAdmin(); const location = useLocation(); return actor ? <Shell /> : <Navigate to="/login" state={{ returnTo: location.pathname + location.search }} replace />; }
function Guard({ capability }) { const { actor } = useAdmin(); return can(actor, capability) ? <Outlet /> : <AccessDenied />; }
export function AccessDenied() { return <Empty level={1} title="Access denied" description="Your platform role does not include this workspace. Contact a Platform Owner to request access." action={<ButtonLink to="/">Back to overview</ButtonLink>} />; }
export function NotFound() { return <Empty level={1} title="Page not found" description="This link may be out of date, or the record is no longer available." action={<ButtonLink to="/">Back to overview</ButtonLink>} />; }
export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route element={<Session />}>
    <Route index element={<Overview />} />
    <Route element={<Guard capability="members" />}><Route path="members" element={<MemberList />} /><Route path="members/:id" element={<MemberDetail />} /></Route>
    <Route element={<Guard capability="verification" />}><Route path="verification" element={<VerificationList />} /><Route path="verification/:id" element={<VerificationDetail />} /></Route>
    <Route element={<Guard capability="departments" />}><Route path="departments" element={<DepartmentList />} /><Route path="departments/new" element={<DepartmentCreate />} /><Route path="departments/claims" element={<ClaimList />} /><Route path="departments/claims/:id" element={<ClaimDetail />} /><Route path="departments/:id" element={<DepartmentDetail />} /></Route>
    <Route path="jobs" element={<Navigate to="/jobs/hiring" replace />} />
    <Route element={<Guard capability="hiring" />}><Route path="jobs/hiring" element={<CareerList kind="hiring" />} /><Route path="jobs/hiring/:id" element={<CareerDetail kind="hiring" />} /></Route>
    <Route element={<Guard capability="seeking" />}><Route path="jobs/seeking" element={<CareerList kind="seeking" />} /><Route path="jobs/seeking/:id" element={<CareerDetail kind="seeking" />} /></Route>
    {['events', 'moderation', 'campaigns'].map(kind => <Route key={kind} element={<Guard capability={kind} />}><Route path={kind} element={<OperationList kind={kind} />} />{kind !== 'moderation' && <Route path={`${kind}/new`} element={<OperationCreate kind={kind} />} />}<Route path={`${kind}/:id`} element={<OperationDetail kind={kind} />} /></Route>)}
    <Route path="emergency" element={<Navigate to="/emergency/requests" replace />} />
    {['requests', 'donors'].map(kind => <Route key={kind} element={<Guard capability={kind} />}><Route path={`emergency/${kind}`} element={<OperationList kind={kind} />} /><Route path={`emergency/${kind}/:id`} element={<OperationDetail kind={kind} />} /></Route>)}
    <Route element={<Guard capability="analytics" />}><Route path="analytics" element={<Analytics />} /></Route>
    <Route element={<Guard capability="audit" />}><Route path="audit" element={<Audit />} /><Route path="audit/:id" element={<Audit detail />} /></Route>
    <Route path="settings" element={<Navigate to="/settings/preferences" replace />} />
    {['general', 'team', 'policies', 'preferences'].map(section => <Route key={section} element={<Guard capability={section === 'team' ? 'admins' : section === 'preferences' ? 'preferences' : 'settings'} />}><Route path={`settings/${section}`} element={<Settings section={section} />} /></Route>)}
    <Route path="access-denied" element={<AccessDenied />} /><Route path="*" element={<NotFound />} />
  </Route></Routes>;
}
