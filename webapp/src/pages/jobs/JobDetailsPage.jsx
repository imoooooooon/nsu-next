import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, BookmarkIcon, Briefcase, ChevronRight,
  Clock, DollarSign, MapPin, User,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, DetailHeader } from '../../components/layout/AppShell';
import { Button, Card, EmptyState, IconButton, TintedCard } from '../../components/ui';
import { findJobById } from '../../data/jobs';
import { useCloseTo } from '../../lib/navigation';

/* /jobs/:jobId — the mobile JobDetailView, re-laid as main column + sticky
   action rail on desktop, with the fixed bottom Apply bar kept on mobile. */

/* The Apply CTA, gated exactly like mobile: students apply, alumni/faculty
   see the disabled gray "View Details". */
const ApplyButton = ({ gated, onApply }) => (
  <button
    disabled={gated}
    onClick={gated ? undefined : onApply}
    className={`w-full h-14 rounded-xl font-extrabold text-base transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
      gated
        ? 'bg-gray-400 dark:bg-gray-700 text-white/80 cursor-not-allowed opacity-60'
        : 'active:scale-[0.97] bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
    }`}
  >
    {gated ? 'View Details' : 'Apply Now'}
  </button>
);

export default function JobDetailsPage() {
  const { t, isDark } = useTheme();
  const { authRole, showToast } = useAppState();
  const navigate = useNavigate();
  const closeToJobs = useCloseTo('/jobs');
  const { jobId } = useParams();

  const job = findJobById(jobId);
  const gated = authRole === 'alumni' || authRole === 'faculty';

  if (!job) {
    return (
      <PageContainer className="animate-fade-in">
        <EmptyState
          icon={Briefcase}
          title="Job not found"
          subtitle="This posting may have been removed or the link is incorrect."
          action="Back to Jobs"
          onAction={() => navigate('/jobs')}
          className={t.text}
        />
      </PageContainer>
    );
  }

  const posterFirstName = job.postedBy ? job.postedBy.name.split(' ')[0] : null;
  const onApply = () => showToast('Application submitted');

  return (
    <PageContainer className="animate-fade-in">
      <DetailHeader title={job.title} onBack={closeToJobs}>
        <IconButton icon={BookmarkIcon} label="Save job" onClick={() => showToast('Job saved')} />
      </DetailHeader>

      <div className="lg:grid lg:grid-cols-3 gap-8 pb-28 lg:pb-0">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Emerald hero */}
          {/* Company mark and title sit on one line from sm up — the centred
              mobile stack leaves a tall empty band at desktop widths. */}
          <TintedCard tint="emerald" className="p-6" contentClassName="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 text-center sm:text-left">
              <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/60'} border-2 ${isDark ? 'border-white/10' : 'border-white'} flex items-center justify-center shadow-lg shrink-0 mx-auto sm:mx-0`}>
                <Briefcase className={`w-8 h-8 ${t.text}`} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h2 className={`font-extrabold text-2xl tracking-tight leading-tight ${t.text} mb-1`}>{job.title}</h2>
                <p className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-base`}>{job.company}</p>
              </div>
            </div>

            <div className={`w-full grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/[0.04]'}`}>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                <MapPin className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{job.location}</span>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                <Briefcase className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{job.type}</span>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-black/30' : 'bg-white/50 border border-white'} flex flex-col items-center shadow-sm`}>
                <DollarSign className={`w-4 h-4 ${t.textMuted} mb-1.5`} strokeWidth={2.5} />
                <span className={`text-xs font-extrabold ${t.text}`}>{job.salary}</span>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'} flex flex-col items-center shadow-sm`}>
                <Clock className="w-4 h-4 text-red-500 mb-1.5" strokeWidth={2.5} />
                <span className="text-xs font-extrabold text-red-500">{job.deadline}</span>
              </div>
            </div>
          </TintedCard>

          {/* Posted By */}
          {job.postedBy && (
            <Card
              padded={false}
              className="p-4 flex items-center space-x-3 cursor-pointer active:scale-[0.98] transition-transform hover:opacity-90"
              onClick={() => navigate(`/network/${job.postedBy.userId}`)}
            >
              <div className={`w-11 h-11 rounded-full ${isDark ? 'bg-white/10' : 'bg-white border border-gray-200'} shadow-sm flex items-center justify-center shrink-0`}>
                <User className={`w-5 h-5 ${t.text}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-0.5`}>Posted By</p>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-sm font-extrabold ${t.text} truncate`}>{job.postedBy.name}</span>
                  {job.postedBy.verified && <BadgeCheck className="w-4 h-4 text-[#1D9BF0] shrink-0" strokeWidth={2.5} />}
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${job.postedBy.type === 'Faculty' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                    {job.postedBy.type}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${t.textMuted}`} strokeWidth={2.5} />
            </Card>
          )}

          {/* Description */}
          <Card padded={false} className="p-6">
            <h3 className={`text-lg font-extrabold ${t.text} tracking-tight mb-4`}>Job Description</h3>
            <p className={`${t.text} text-sm font-medium leading-relaxed opacity-90 mb-6`}>{job.preview} We are a fast-growing startup looking for hungry individuals who want to make a real impact. You will be responsible for end-to-end delivery of features.</p>

            <h4 className={`text-sm font-extrabold ${t.text} tracking-tight mb-3`}>Requirements</h4>
            <ul className="space-y-2">
              {job.reqs.map((req, idx) => (
                <li key={idx} className={`flex items-center text-sm font-medium ${t.text} opacity-90`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-3"></div>
                  {req}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Desktop action rail — replaces the mobile bottom CTA bar. */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <Card className="space-y-4">
              <div>
                <span className="inline-flex items-center text-red-500 text-[10px] font-extrabold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                  <Clock className="w-3 h-3 mr-1" strokeWidth={3} /> {job.deadline}
                </span>
              </div>
              <div>
                <p className={`text-[10px] font-extrabold ${t.textMuted} uppercase tracking-wider mb-0.5`}>Salary</p>
                <p className={`text-sm font-extrabold ${t.text}`}>{job.salary}</p>
              </div>
              <ApplyButton gated={gated} onApply={onApply} />
              {job.postedBy && (
                <Button variant="secondary" size="md" full onClick={() => navigate('/messages/1')}>
                  Message {posterFirstName}
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom CTA — sits above the floating capsule nav. */}
      <div className="lg:hidden fixed bottom-24 inset-x-0 z-30 px-5">
        <div className={`${t.glass} border rounded-2xl p-3 shadow-lg shadow-black/10`}>
          <ApplyButton gated={gated} onApply={onApply} />
        </div>
      </div>
    </PageContainer>
  );
}
