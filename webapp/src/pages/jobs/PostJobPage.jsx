import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, PageHeader, FormColumn } from '../../components/layout/AppShell';
import { Button, Card, Field, IconButton, SelectInput, TextArea, TextInput } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';
import { findDepartmentById } from '../../data/departments';
import { getDepartmentAccess } from '../../lib/departmentAccess';
import { EntityAvatar } from '../../features/departments/DepartmentPrimitives';

/* /jobs/post — the mobile PostJobOverlay as a routed page. Alumni/faculty
   only; students are bounced back to the feed (same gating as mobile). */

export default function PostJobPage() {
  const { t, isDark } = useTheme();
  const { authRole } = useAppState();
  const navigate = useNavigate();
  const closeToJobs = useCloseTo('/jobs');
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* `?as=<deptId>` posts on behalf of a department hub rather than the
     signed-in person — the campus keeps ONE job board (brief §4), the
     posting identity is what changes. */
  const asDept = findDepartmentById(searchParams.get('as'));
  const deptAccess = getDepartmentAccess(asDept, authRole);
  const postingAsDept = asDept && deptAccess.canManage ? asDept : null;

  if (authRole !== 'alumni' && authRole !== 'faculty') {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <PageContainer className="animate-fade-in">
      <FormColumn>
      <div className="flex items-start gap-4">
        <div className="pt-8 lg:pt-10">
          <IconButton icon={ArrowLeft} label="Back to jobs" onClick={closeToJobs} />
        </div>
        <div className="flex-1 min-w-0">
          <PageHeader
            title={isSubmitted ? 'Status' : 'Post a Job'}
            subtitle={isSubmitted ? undefined : (postingAsDept ? `Posting as ${postingAsDept.code} Department` : 'Reviewed by admins before going live')}
          />
        </div>
      </div>

      {!isSubmitted && postingAsDept && (
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl mb-4 ${isDark ? 'bg-[#1D9BF0]/10 border-[#1D9BF0]/20' : 'bg-[#1D9BF0]/[0.07] border-[#1D9BF0]/20'} border`}>
          <EntityAvatar dept={postingAsDept} size="sm" />
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider`}>Posting as</p>
            <p className={`text-sm font-extrabold ${t.text} truncate`}>{postingAsDept.code} Department</p>
          </div>
          <button
            onClick={() => navigate('/jobs/post', { replace: true })}
            className="text-[#1D9BF0] text-[11px] font-extrabold hover:underline shrink-0"
          >
            Post as myself
          </button>
        </div>
      )}

      {!isSubmitted ? (
        <Card className="space-y-5">
          <Field label="Job Title">
            <TextInput type="text" placeholder="e.g. Frontend Developer" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Company">
              <TextInput type="text" placeholder="e.g. Pathao" />
            </Field>
            <Field label="Location">
              <TextInput type="text" placeholder="e.g. Dhaka, BD" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Job Type">
              <SelectInput defaultValue="Full-Time" aria-label="Job type">
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </SelectInput>
            </Field>
            <Field label="Salary">
              <TextInput type="text" placeholder="e.g. Negotiable" />
            </Field>
          </div>

          <Field label="Application Deadline">
            <TextInput type="text" placeholder="e.g. 15 Oct 2024" />
          </Field>

          <Field label="Job Description">
            <TextArea rows={4} placeholder="Describe the role and responsibilities..." />
          </Field>

          <Field label="Requirements (comma separated)">
            <TextArea rows={3} placeholder="e.g. React, Node.js, 2+ years experience" />
          </Field>

          <Button full onClick={() => setIsSubmitted(true)} className="shadow-lg shadow-[#1D9BF0]/40">
            Submit for Approval
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-16 animate-fade-in-up">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20 shadow-xl shadow-yellow-500/10">
            <Clock className="w-12 h-12 text-yellow-500" strokeWidth={2.5} />
          </div>
          <h3 className={`text-2xl font-extrabold ${t.text} tracking-tight mb-2 text-center`}>Pending Approval</h3>
          <p className={`text-sm font-bold ${t.textMuted} text-center mb-8 max-w-xs leading-relaxed`}>
            Your job post has been submitted. Our admin team will review it shortly. Once approved, it will be visible to all students.
          </p>
          <Button variant="neutral" full className="max-w-xs" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </div>
      )}
    </FormColumn>
    </PageContainer>
  );
}
