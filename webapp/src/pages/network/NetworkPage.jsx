import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Building2 } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/layout/AppShell';
import { SearchInput, SegmentedControl, EmptyState, ViewModeToggle } from '../../components/ui';
import { PersonCard, PersonList } from '../../features/network/PersonCard';
import { DepartmentList, DepartmentGrid, MyDepartmentPanel } from '../../features/departments/DepartmentDirectory';
import { globalAlumniData, globalFacultyData, globalStudentData } from '../../data/people';
import { globalDepartments, findDepartmentById } from '../../data/departments';
import { getDepartmentAccess, getViewerDepartmentId } from '../../lib/departmentAccess';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { useDirectoryView } from '../../lib/directoryView';

/* ---------------------------------------------------------------------------
   /network — the Directory (mobile DirectoryTab), re-laid for desktop:
   search + segmented filter on one row, the results caption with the
   card/list view switch, and the PersonCard grid (or the one-line list)
   instead of the single mobile column.
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
  const { authRole } = useAppState();
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

  /* The view mode is remembered per KIND of object (lib/directoryView.js):
     the people lenses share one mode with every department roster, and
     Departments keep their own. */
  const [peopleView, setPeopleView] = useDirectoryView('people');
  const [departmentView, setDepartmentView] = useDirectoryView('departments');
  const view = isDepartments ? departmentView : peopleView;
  const setView = isDepartments ? setDepartmentView : setPeopleView;

  /* The viewer's own department leads the Departments lens — membership is
     the relationship that sets an entity apart from a person. */
  const viewerDept = findDepartmentById(getViewerDepartmentId());
  const myDept = viewerDept && getDepartmentAccess(viewerDept, authRole).isMember ? viewerDept : null;

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

      {/* The results line carries the view switch: it changes how these
          results are laid out, so it sits with them, not with the filters. */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-[#1D9BF0] text-[10px] font-extrabold uppercase tracking-wider">
          Showing {results.length} results • {segment}
        </p>
        <ViewModeToggle value={view} onChange={setView} />
      </div>

      {isDepartments ? (
        /* Register + rail. The panel comes first in the DOM so it leads on
           mobile, and moves to a sticky right rail from lg. */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start pb-4">
          {myDept && (
            <aside className="lg:col-start-3 lg:row-start-1 lg:sticky lg:top-20 min-w-0">
              <MyDepartmentPanel dept={myDept} />
            </aside>
          )}
          <div className={`min-w-0 lg:row-start-1 ${myDept ? 'lg:col-span-2 lg:col-start-1' : 'lg:col-span-3'}`}>
            {results.length === 0 ? (
              <EmptyState icon={Building2} title="No departments match your search" subtitle="Try a department code, name or school." className={t.text} />
            ) : (
              view === 'list' ? <DepartmentList departments={results} /> : <DepartmentGrid departments={results} />
            )}
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon={Users} title="No people match your search" className={t.text} />
      ) : view === 'list' ? (
        <PersonList people={results} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {results.map(person => <PersonCard key={person.id} person={person} variant="full" />)}
        </div>
      )}
    </PageContainer>
  );
}
