import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Filter, Plus, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import {
  Button, IconButton, Fab, ChipTabs, SearchInput, EmptyState,
  DropdownPanel, DropdownHeading, DropdownItem, DropdownDivider,
} from '../../components/ui';
import { JobCard } from '../../features/jobs/JobCard';
import { JobsModeToggle } from '../../features/jobs/JobsModeToggle';
import { globalJobsData } from '../../data/jobs';

/* /jobs — the Hiring feed. Same records, segments and filter voice as the
   mobile JobsTab (hiring mode), laid out as a two-column card grid on web. */

const HIRING_SEGMENTS = ['All Jobs', 'For You', 'Saved'];
const FILTER_OPTIONS = ['Full-Time', 'Internship', 'Remote'];

export default function JobsPage() {
  const { t, isDark } = useTheme();
  const { authRole } = useAppState();
  const navigate = useNavigate();

  const [jobSegment, setJobSegment] = useState('All Jobs');
  const [jobFilter, setJobFilter] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const canPost = authRole === 'alumni' || authRole === 'faculty';

  /* Same order as mobile: segment → filter, then the (web-wired) search. */
  let displayedJobs = globalJobsData;
  if (jobSegment === 'Saved') displayedJobs = globalJobsData.slice(0, 1);
  else if (jobSegment === 'For You') displayedJobs = globalJobsData.filter(job => job.match);
  if (jobFilter) {
    displayedJobs = displayedJobs.filter(job => job.type === jobFilter || job.location === jobFilter);
  }
  const query = search.trim().toLowerCase();
  if (query) {
    displayedJobs = displayedJobs.filter(job =>
      job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query)
    );
  }

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader title="Jobs" subtitle="Opportunities from the verified NSU network">
        {jobFilter && (
          <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-[#1D9BF0]/10'} border ${t.borderSoft} animate-fade-in`}>
            <span className={`text-[10px] font-extrabold ${isDark ? 'text-white' : 'text-[#1D9BF0]'} uppercase tracking-wider`}>{jobFilter}</span>
            <button
              onClick={() => setJobFilter(null)}
              aria-label="Clear job filter"
              className={`opacity-70 hover:opacity-100 ${isDark ? 'text-white' : 'text-[#1D9BF0]'}`}
            >
              <X className="w-3 h-3" strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Stop mousedown from reaching the document so the panel's outside-click
            close doesn't race the trigger's own toggle. */}
        <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
          <IconButton
            icon={Filter}
            label="Filter jobs"
            size="sm"
            active={Boolean(jobFilter) || isFilterOpen}
            aria-haspopup="menu"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen(o => !o)}
          />
          {isFilterOpen && (
            <DropdownPanel onClose={() => setIsFilterOpen(false)}>
              <DropdownHeading>Filter By</DropdownHeading>
              {FILTER_OPTIONS.map(f => (
                <DropdownItem
                  key={f}
                  label={f}
                  selected={jobFilter === f}
                  onClick={() => { setJobFilter(f); setIsFilterOpen(false); }}
                />
              ))}
              <DropdownDivider />
              <DropdownItem
                label="Clear Filter"
                destructive
                onClick={() => { setJobFilter(null); setIsFilterOpen(false); }}
              />
            </DropdownPanel>
          )}
        </div>

        {canPost && (
          <Button variant="primary" size="sm" icon={Plus} onClick={() => navigate('/jobs/post')}>
            Post a Job
          </Button>
        )}
      </PageHeader>

      <JobsModeToggle mode="hiring" className="max-w-sm mb-4" />

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search by title or company..."
          className="md:max-w-md"
        />
        <ChipTabs options={HIRING_SEGMENTS} value={jobSegment} onChange={setJobSegment} />
      </div>

      {displayedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No jobs found for this filter" className={t.text} />
      )}

      {canPost && (
        <Fab
          icon={Plus}
          label="Post a job"
          className="lg:hidden fixed bottom-28 right-5 z-30"
          onClick={() => navigate('/jobs/post')}
        />
      )}
    </PageContainer>
  );
}
