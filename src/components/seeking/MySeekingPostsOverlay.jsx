import { useState } from 'react';
import { ArrowLeft, Ban, Bookmark, Copy, Edit, Eye, Megaphone, MessageSquare, MoreVertical, Pause, Play, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { SEEKING_STATUS_LABEL } from './constants';
import { getSeekingCategoryStyle, getSeekingStatusStyle } from './utils';
import { SeekingEmptyState } from './SeekingEmptyState';
import { SeekingActionSheet } from './SeekingPrimitives';

// --- SEEKING: MY POSTS MANAGEMENT ---
const MY_SEEKING_SEGMENTS = ['Active', 'Pending', 'Paused', 'Expired', 'Drafts'];

const MY_SEEKING_EMPTY_COPY = {
  Active: { title: 'No active posts', description: 'Let the university network know what you are looking for.' },
  Pending: { title: 'Nothing waiting for review', description: 'Submitted posts appear here until they are approved.' },
  Paused: { title: 'No paused posts', description: 'Pause a post when you are not available for a while.' },
  Expired: { title: 'No expired posts', description: 'Posts that reach their end date will be listed here.' },
  Drafts: { title: 'No drafts saved', description: 'Start a post and it will be kept here until you submit it.' }
};

export const MySeekingPostsOverlay = ({ posts, t, isDark, onClose, onCreate, onView, onEdit, onAction }) => {
  const [segment, setSegment] = useState('Active');
  const [menuPost, setMenuPost] = useState(null);

  const statusForSegment = { Active: 'active', Pending: 'pending', Paused: 'paused', Expired: 'expired', Drafts: 'draft' };
  const displayed = posts.filter((p) => p.status === statusForSegment[segment]);

  const countFor = (seg) => posts.filter((p) => p.status === statusForSegment[seg]).length;

  const actionsForPost = (post) => {
    const close = () => setMenuPost(null);
    const run = (action) => () => { close(); onAction(post.id, action); };
    const view = { label: post.status === 'pending' ? 'Preview' : 'View', icon: Eye, onClick: () => { close(); onView(post); } };
    const edit = { label: post.status === 'draft' ? 'Continue Editing' : 'Edit', icon: Edit, onClick: () => { close(); onEdit(post); } };
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
    <div className={`absolute inset-0 z-50 flex flex-col animate-slide-up ${t.bg}`}>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500">
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[60%] bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-[140px] ${isDark ? 'opacity-10' : 'opacity-[0.15]'}`} />
      </div>

      <div className={`px-4 pt-12 pb-3 ${t.glass} border-b sticky top-0 z-20 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button type="button" aria-label="Go back" onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-lg ${t.card} border ${t.borderSoft} transition-colors active:scale-95`}>
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <h2 className={`text-base font-extrabold ${t.text} leading-tight`}>My Seeking Posts</h2>
          <button type="button" aria-label="Create a Seeking Work post" onClick={onCreate} className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[#1D9BF0] text-white shadow-sm active:scale-95 transition-transform`}>
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
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
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10 relative z-10 space-y-3">
        {displayed.length > 0 ? (
          displayed.map((post) => (
            <div key={post.id} className={`rounded-2xl p-4 ${t.card} border ${t.border} ${t.cardShadow}`}>
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
                  className={`shrink-0 w-8 h-8 -mt-0.5 -mr-1 rounded-lg flex items-center justify-center ${t.textMuted} hover:${t.text} active:scale-90 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]`}
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
          ))
        ) : (
          <SeekingEmptyState
            icon={segment === 'Drafts' ? Edit : Megaphone}
            t={t}
            isDark={isDark}
            title={MY_SEEKING_EMPTY_COPY[segment].title}
            description={MY_SEEKING_EMPTY_COPY[segment].description}
            actions={segment === 'Active' || segment === 'Drafts' ? [{ label: 'Create Seeking Post', onClick: onCreate, primary: true }] : []}
          />
        )}
      </div>

      {menuPost && (
        <SeekingActionSheet
          title={menuPost.headline}
          t={t}
          isDark={isDark}
          onClose={() => setMenuPost(null)}
          actions={actionsForPost(menuPost)}
        />
      )}
    </div>
  );
};
