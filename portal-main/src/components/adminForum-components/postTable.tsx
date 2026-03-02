import { ForumPost, PostStatus } from './types';
import { Trash2, ThumbsUp, MessageSquare } from 'lucide-react';

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const styles: Record<PostStatus, string> = {
    published: "bg-emerald-50 text-emerald-600 border-emerald-100",
    draft: "bg-gray-50 text-gray-400 border-gray-100",
    reported: "bg-red-50 text-red-600 border-red-100",
    archived: "bg-amber-50 text-amber-600 border-amber-100",
  };
  
  const labels: Record<PostStatus, string> = {
    published: "Published",
    draft: "Draft",
    reported: "Reported",
    archived: "Archived",
  };
  
  return (
    <span className={`px-3 py-1 rounded-md text-[10px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

interface PostTableProps {
  posts: ForumPost[];
  onDeletePost: (id: number) => void;
  loading?: boolean;
}

export const PostTable = ({ posts, onDeletePost, loading = false }: PostTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">All Forum Posts</h2>
        </div>
        <div className="p-12 text-center text-gray-400">
          Loading posts...
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">All Forum Posts</h2>
        </div>
        <div className="p-12 text-center text-gray-400">
          No posts found. Try adjusting your filters.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">All Forum Posts</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Post Title</th>
              <th className="px-6 py-4 font-semibold">Author</th>
              <th className="px-6 py-4 font-semibold">Tags</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold">Engagement</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 max-w-[280px]">
                    <div className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1">
                    {post.title}
                  </div>
                  <div className="text-[11px] text-gray-400 whitespace-nowrap">
                    {post.category?.name || 'Uncategorized'} • {post.views_count} views
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {post.author.initials}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{post.author.full_name}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1 items-start">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag.id} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold">
                        #{tag.name}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-[9px] text-gray-400">+{post.tags.length - 2} more</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5 text-center">
                  <StatusBadge status={post.status} />
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> {post.comment_count} comments
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={12} /> {post.like_count} likes
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-5 text-[12px] text-gray-500 font-medium whitespace-nowrap">
                  {formatDate(post.created_at)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-center items-center gap-5 text-gray-400">
                    <button 
                      onClick={() => onDeletePost(post.id)}
                      className="hover:text-red-500 transition-colors" 
                      title="Delete"
                    >
                      <Trash2 size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};