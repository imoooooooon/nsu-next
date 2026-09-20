import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Building2 } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { SearchInput, SegmentedControl, EmptyState } from '../../components/ui';
import { PersonCard } from '../../features/network/PersonCard';
import { DepartmentCard } from '../../features/departments/DepartmentCard';
import { globalAlumniData, globalFacultyData, globalStudentData } from '../../data/people';
import { globalDepartments } from '../../data/departments';
import { useTheme } from '../../theme/ThemeContext';

/* ---------------------------------------------------------------------------
   /network — the Directory (mobile DirectoryTab), re-laid for desktop:
   search + segmented filter on one row, blue results micro-caption, and the
   PersonCard grid instead of the single mobile column.
--------------------------------------------------------------------------- */

/* One directory, four lenses. Departments are Entity Profiles — they live in
   the network, so they are a segment here rather than a sixth nav item
   competing for a slot in a five-item capsule. */
const SEGMENTS = ['Alumni', 'Student', 'Faculty', 'Departments'];

const SEGMENT_DATA = {
  Alumni: globalAlumniData,
  Student: globalStudentData,
  Faculty: globalFacultyData,
};

export default function NetworkPage() {
  const { t } = useTheme();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const segmentParam = searchParams.get('segment');
  const [search, setSearch] = useState(q);
  const [segment, setSegment] = useState(
    SEGMENTS.includes(segmentParam) ? segmentParam : 'Alumni'
  );

  /* The desktop TopBar submits global searches to /network?q=… . Adjusting
     state during render (rather than in an effect) re-runs this component
     immediately with the new query instead of painting the stale one first. */
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setSearch(q);
  }

  /* Same trick for ?segment=… — /departments redirects here, and React Router
     reuses this component when you were already on /network, so the initial
     useState would otherwise keep showing the old lens. */
  const [lastSegmentParam, setLastSegmentParam] = useState(segmentParam);
  if (segmentParam !== lastSegmentParam) {
    setLastSegmentParam(segmentParam);
    if (SEGMENTS.includes(segmentParam)) setSegment(segmentParam);
  }

  const isDepartments = segment === 'Departments';

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (isDepartments) {
      if (!query) return globalDepartments;
      return globalDepartments.filter(d =>
        d.code.toLowerCase().includes(query) ||
        d.name.toLowerCase().includes(query) ||
        d.school.toLowerCase().includes(query)
      );
    }

    const base = SEGMENT_DATA[segment] || [];
    if (!query) return base;
    return base.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.company.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query) ||
      p.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }, [segment, search, isDepartments]);

  return (
    <PageContainer className="animate-fade-in">
      <PageHeader title="Directory" subtitle="Connect with the NSU Network" />

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder={isDepartments ? 'Search department, school...' : 'Search name, company...'}
          className="md:flex-1"
          aria-label="Search directory"
        />
        <SegmentedControl options={SEGMENTS} value={segment} onChange={setSegment} className="md:w-[26rem] shrink-0" />
      </div>

      <div className="flex items-center text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider mb-5">
        Showing {results.length} results • {segment}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={isDepartments ? Building2 : Users}
          title={isDepartments ? 'No departments match your search' : 'No people match your search'}
          className={t.text}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {isDepartments
            ? results.map(dept => <DepartmentCard key={dept.id} dept={dept} />)
            : results.map(person => <PersonCard key={person.id} person={person} variant="full" />)}
        </div>
      )}
    </PageContainer>
  );
}
