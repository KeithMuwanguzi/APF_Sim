import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Eye, 
  Heart, 
  Edit3,
  Trash2,
  Search,
  Calendar,
  ChevronLeft,
  Loader2,
  Send
} from 'lucide-react';
import { toastMessages } from '../../utils/toast-helpers';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useUserPosts } from '../../hooks/useForum';
import { deleteForumPost, getForumPostViewers, getForumComments, updateForumPost } from '../../services/forum.service';

const MyPostsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewerListLoading, setViewerListLoading] = useState(false);
  const [viewerListPostId, setViewerListPostId] = useState<number | null>(null);
  const [viewerList, setViewerList] = useState<Array<{ id: number; full_name?: string; initials?: string; profile_picture_url?: string | null }>>([]);
  const [commentsPostId, setCommentsPostId] = useState<number | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState<Array<{
    id: number;
    authorName: string;
    authorInitials: string;
    content: string;
    createdAt: string;
    replyCount: number;
  }>>([]);

  // Use hook to fetch user's posts
  const { posts: myPosts, loading, error, refetch } = useUserPosts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional Tips':
        return 'bg-blue-100 text-blue-700';
      case 'Q&A Support':
        return 'bg-orange-100 text-orange-700';
      case 'General Discussion':
        return 'bg-purple-100 text-purple-700';
      case 'Networking':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPosts = myPosts.filter(post => {
    const matchesFilter = activeFilter === 'all' || post.status === activeFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats from posts
  const totalViews = myPosts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = myPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalReplies = myPosts.reduce((sum, post) => sum + post.replies, 0)

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const openViewerList = async (postId: number) => {
    setViewerListPostId(postId);
    setViewerListLoading(true);
    const viewers = await getForumPostViewers(postId);
    setViewerList(viewers);
    setViewerListLoading(false);
  };

  const toggleComments = async (postId: number) => {
    if (commentsPostId === postId) {
      setCommentsPostId(null);
      setComments([]);
      return;
    }
    setCommentsPostId(postId);
    setCommentsLoading(true);
    const data = await getForumComments(postId);
    const mapped = data.map((comment) => ({
      id: comment.id,
      authorName: comment.author?.full_name || comment.author?.email || 'Member',
      authorInitials: comment.author?.initials || 'U',
      content: comment.content,
      createdAt: comment.created_at,
      replyCount: comment.reply_count
    }));
    setComments(mapped);
    setCommentsLoading(false);
  };


  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        headerContent={
          <Link 
            to="/forum" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Community Forum
          </Link>
        }
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your posts...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        headerContent={
          <Link 
            to="/forum" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Community Forum
          </Link>
        }
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Failed to load your posts</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      headerContent={
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Community Forum
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
            <p className="text-gray-600">Manage and track all your forum contributions</p>
          </div>
          <Link to="/forum/create-post">
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-5 h-5" />
              Create New Post
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{myPosts.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Replies</p>
                <p className="text-2xl font-bold text-gray-900">{totalReplies}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeFilter === filter
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} Posts
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Posts List or Empty State */}
        {myPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Start sharing your knowledge and insights with the APF community
            </p>
            <Link to="/forum/create-post">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto">
                <Plus className="w-5 h-5" />
                Create Your First Post
              </button>
            </Link>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setActiveFilter('all')
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/forum/post/${post.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status || 'published')}`}>
                        {post.status || 'published'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {post.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {post.status === 'draft' && (
                      <button
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Submit draft"
                        onClick={async () => {
                          const ok = await updateForumPost(post.id, { status: 'published' });
                          if (ok) {
                            await refetch();
                          } else {
                            toastMessages.post.publishFailed();
                          }
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <Link to={`/forum/post/${post.id}/edit`}>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={async () => {
                        const confirmed = window.confirm('Delete this post? This cannot be undone.');
                        if (!confirmed) return;
                        const ok = await deleteForumPost(post.id);
                        if (ok) {
                          await refetch();
                        } else {
                          toastMessages.post.deleteFailed();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Post Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {viewerListPostId === post.id ? (
                      viewerListLoading ? (
                        <span className="text-sm text-gray-500">Loading viewers...</span>
                      ) : viewerList.length === 0 ? (
                        <span className="text-sm text-gray-500">No viewers yet</span>
                      ) : (
                        <div className="flex -space-x-2">
                          {viewerList.map((viewer) => (
                            <div
                              key={viewer.id}
                              className="w-6 h-6 rounded-full border-2 border-white bg-purple-600 text-white text-[10px] font-semibold flex items-center justify-center overflow-hidden"
                              title={viewer.full_name || ''}
                            >
                              {viewer.profile_picture_url ? (
                                <img
                                  src={viewer.profile_picture_url}
                                  alt={viewer.full_name || 'Viewer'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{viewer.initials || 'U'}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ) : post.views > 0 ? (
                      <button
                        type="button"
                        onClick={() => openViewerList(post.id)}
                        className="flex items-center gap-2 hover:text-purple-700 transition-colors"
                        aria-label="Viewers"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{post.views} views</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{post.views} views</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </button>
                </div>

                {commentsPostId === post.id && (
                  <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
                    {commentsLoading ? (
                      <div className="text-sm text-gray-500">Loading comments...</div>
                    ) : comments.length === 0 ? (
                      <div className="text-sm text-gray-500">No comments yet</div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#60308C] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {comment.authorInitials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-gray-900 text-sm">{comment.authorName}</div>
                              <div className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</div>
                            </div>
                            <div className="text-sm text-gray-700">{comment.content}</div>
                            {comment.replyCount > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {comment.replyCount} replies
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPostsPage;
