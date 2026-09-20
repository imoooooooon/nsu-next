import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Ban, Bookmark, Copy, Edit, Eye, Megaphone, MessageSquare,
  MoreVertical, Pause, Play, Plus, RotateCcw, Trash2, X
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { PageContainer } from '../../components/layout/AppShell';
import { ActionSheetModal, Button, IconButton } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';
import { SEEKING_STATUS_LABEL } from '../../features/seeking/constants';
import { getSeekingCategoryStyle, getSeekingStatusStyle } from '../../features/seeking/utils';
import { SeekingEmptyState } from '../../features/seeking/SeekingEmptyState';

/* --- SEEKING: MY POSTS MANAGEMENT (route /jobs/seeking/my-posts) --- */
const MY_SEEKING_SEGMENTS = ['Active', 'Pending', 'Paused', 'Expired', 'Drafts'];

const MY_SEEKING_EMPTY_COPY = {
  Active: { title: 'No active posts', description: 'Let the university network know what you are looking for.' },
  Pending: { title: 'Nothing waiting for review', description: 'Submitted posts appear here until they are approved.' },
  Paused: { title: 'No paused posts', description: 'Pause a post when you are not available for a while.' },
  Expired: { title: 'No expired posts', description: 'Posts that reach their end date will be listed here.' },
  Drafts: { title: 'No drafts saved', description: 'Start a post and it will be kept here until you submit it.' }
};

export default function MySeekingPostsPage() {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const close = useCloseTo('/jobs/seeking');
  const { authRole, mySeekingPosts, handleMySeekingAction } = useAppState();
  const [segment, setSegment] = useState('Active');
  const [menuPost, setMenuPost] = useState(null);

  if (authRole !== 'student') {
    return <Navigate to="/jobs/seeking" replace />;
  }

  const statusForSegment = { Active: 'active', Pending: 'pending', Paused: 'paused', Expired: 'expired', Drafts: 'draft' };
  const displayed = mySeekingPosts.filter((p) => p.status === statusForSegment[segment]);

  const countFor = (seg) => mySeekingPosts.filter((p) => p.status === statusForSegment[seg]).length;

  const openCreate = () => navigate('/jobs/seeking/new');
  const viewPost = (post) => navigate(`/jobs/seeking/${post.id}`);
  const editPost = (post) => navigate(`/jobs/seeking/new?edit=${post.id}`);

  const actionsForPost = (post) => {
    const closeMenu = () => setMenuPost(null);
    const run = (action) => () => { closeMenu(); handleMySeekingAction(post.id, action); };
    const view = { label: post.status === 'pending' ? 'Preview' : 'View', icon: Eye, onClick: () => { closeMenu(); viewPost(post); } };
    const edit = { label: post.status === 'draft' ? 'Continue Editing' : 'Edit', icon: Edit, onClick: () => { closeMenu(); editPost(post); } };
    const del = { label: 'Delete', icon: Trash2, isDestructive: true, onClick: run('delete') };

    switch (post.status) {
      case 'active':
        return [view, edit, { label: 'Pause', icon: Pause, onClick: run('pause') }, { label: 'Mark as Unavailable', icon: Ban, onClick: run('unavailable') }, del];
      case 'pending':
        return [view, edit, { label: 'Withdraw', icon: X, isDestructive: true, onClick: run('withdraw') }];
      case 'paused':
        return [view, { label: 'Resume', icon: Play, onClick: run('resume') }, edit, del];
      case 'expired':
        return [{ label: 'Renew', icon: RotateCcw, onClick: run('renew') }, { label: 'Duplicate', icon: Copy, onClick: run('duplicate') }, del];
      default:
        return [edit, del];
    }
  };

  return (
    <PageContainer className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-8 lg:pt-10 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <IconButton icon={ArrowLeft} label="Back to seeking" onClick={close} />
          <h2 className={`text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${t.text} truncate`}>
            My Seeking Posts
          </h2>
        </div>
        <Button size="sm" icon={Plus} onClick={openCreate}>New Post</Button>
      </div>

      <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
        {MY_SEEKING_SEGMENTS.map((seg) => (
          <button
            key={seg}
            type="button"
            onClick={() => setSegment(seg)}
            aria-pressed={segment === seg}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all border shrink-0 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] ${
              segment === seg
                ? 'bg-[#1D9BF0] text-white border-[#1D9BF0] shadow-sm'
                : `${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-white/50 text-gray-700 border-white/60'}`
            }`}
          >
            {seg}
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${segment === seg ? 'bg-white/25 text-white' : 'bg-[#1D9BF0]/15 text-[#1D9BF0]'}`}>
              {countFor(seg)}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-5 pb-12">
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayed.map((post) => (
              <div key={post.id} className={`h-full flex flex-col rounded-2xl p-4 ${t.card} border ${t.border} ${t.cardShadow}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingCategoryStyle(post.category, isDark)}`}>
                      {post.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${getSeekingStatusStyle(post.status, isDark)}`}>
                      {SEEKING_STATUS_LABEL[post.status]}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Actions for ${post.headline}`}
                    onClick={() => setMenuPost(post)}
                    className={`shrink-0 w-8 h-8 -mt-0.5 -mr-1 rounded-lg flex items-center justify-center ${t.textMuted} hover:text-[#1D9BF0] active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
                  >
                    <MoreVertical className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

                <h3 className={`text-[15px] font-extrabold ${t.text} tracking-tight leading-tight truncate`}>{post.headline}</h3>

                <p className={`text-[11px] font-bold ${t.textMuted} mt-1.5`}>
                  {post.status === 'expired'
                    ? `Posted ${post.postedDate} · Expired`
                    : post.status === 'draft'
                      ? `Last edited ${post.postedDate}`
                      : `Posted ${post.postedDate} · ${post.expiresIn === '—' ? 'No end date' : `Expires in ${post.expiresIn}`}`}
                </p>

                <div className="mt-auto">
                  <div className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t ${t.borderSoft}`}>
                    {[
                      { icon: Eye, label: 'Views', value: post.views },
                      { icon: Bookmark, label: 'Saves', value: post.saves },
                      { icon: MessageSquare, label: 'Messages', value: post.messages }
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col items-center">
                        <stat.icon className={`w-3.5 h-3.5 ${t.textMuted} mb-1`} strokeWidth={2.5} />
                        <span className={`text-sm font-extrabold ${t.text} leading-none`}>{stat.value}</span>
                        <span className={`text-[9px] font-extrabold ${t.textMuted} uppercase tracking-wider mt-1`}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SeekingEmptyState
            icon={segment === 'Drafts' ? Edit : Megaphone}
            t={t}
            isDark={isDark}
            title={MY_SEEKING_EMPTY_COPY[segment].title}
            description={MY_SEEKING_EMPTY_COPY[segment].description}
            actions={segment === 'Active' || segment === 'Drafts' ? [{ label: 'Create Seeking Post', onClick: openCreate, primary: true }] : []}
          />
        )}
      </div>

      {menuPost && (
        <ActionSheetModal
          title={menuPost.headline}
          onClose={() => setMenuPost(null)}
          actions={actionsForPost(menuPost)}
        />
      )}
    </PageContainer>
  );
}
