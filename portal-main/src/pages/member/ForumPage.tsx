import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  List, 
  MessageSquare, 
  Eye, 
  Heart, 
  Bookmark, 
  Reply,
  ChevronRight,
  Megaphone,
  Lightbulb,
  HelpCircle,
  Briefcase,
  UserPlus,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useForumPosts, useForumCategories, useActiveUsers } from '../../hooks/useForum';
import { getForumPostViewers } from '../../services/forum.service';

const ForumPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [viewerListLoading, setViewerListLoading] = useState(false);
  const [viewerListPostId, setViewerListPostId] = useState<number | null>(null);
  const [viewerList, setViewerList] = useState<Array<{ id: number; full_name?: string; initials?: string; profile_picture_url?: string | null }>>([]);

  // Use hooks to fetch data
  const { posts: forumPosts, loading: postsLoading, error: postsError } = useForumPosts(activeCategory, activeFilter);
  const { categories, loading: categoriesLoading } = useForumCategories();
  const { users: activeUsers, loading: usersLoading } = useActiveUsers();

  // Default categories if API returns empty
  const defaultCategories = [
    { id: 'announcements', name: 'Announcements', icon: Megaphone, count: 0 },
    { id: 'suggestions', name: 'Suggestions', icon: Lightbulb, count: 0 },
    { id: 'general', name: 'General Discussion', icon: MessageSquare, count: 0 },
    { id: 'qa', name: 'Q&A Support', icon: HelpCircle, count: 0 },
    { id: 'tips', name: 'Professional Tips', icon: Briefcase, count: 0 },
    { id: 'networking', name: 'Networking', icon: UserPlus, count: 0 }
  ];

  const categoryIconMap: Record<string, any> = {
    announcements: Megaphone,
    suggestions: Lightbulb,
    general: MessageSquare,
    qa: HelpCircle,
    tips: Briefcase,
    networking: UserPlus
  };

  const displayCategories = (categories.length > 0 ? categories : defaultCategories).map((category) => ({
    ...category,
    icon: category.icon || categoryIconMap[category.id] || MessageSquare
  }));

  const handleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleBookmark = (postId: number) => {
    if (bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
    } else {
      setBookmarkedPosts([...bookmarkedPosts, postId]);
    }
  };

  const openViewerList = async (postId: number) => {
    setViewerListPostId(postId);
    setViewerListLoading(true);
    const viewers = await getForumPostViewers(postId);
    setViewerList(viewers);
    setViewerListLoading(false);
  };


  // Loading state
  if (postsLoading || categoriesLoading || usersLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading forum...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (postsError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Failed to load forum</p>
            <p className="text-gray-600 text-sm">{postsError}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
            <p className="text-gray-600">Connect, share, and discover insights with the APF community.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/forum/create-post">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-5 h-5" />
                Create New Post
              </button>
            </Link>
            <Link to="/forum/my-posts">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <List className="w-5 h-5" />
                My Posts
              </button>
            </Link>
          </div>
        </div>

        {/* Forum Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Forum Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                Forum Categories
              </h3>
              <div className="space-y-2">
                {displayCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-2 py-1 rounded-full min-w-[32px] text-center">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">
                Active Members
              </h3>
              {activeUsers.length > 0 ? (
                <div className="space-y-3">
                  {activeUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.initials}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              user.status === 'online'
                                ? 'bg-green-500'
                                : user.status === 'away'
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                            }`}
                          ></div>
                          <span className="capitalize">{user.status}</span>
                          <span>•</span>
                          <span>{user.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No active members at the moment
                </div>
              )}
            </div>
          </div>

          {/* Forum Content */}
          <div className="lg:col-span-3">
            {/* Forum Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['all', 'popular', 'recent', 'unanswered'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        activeFilter === filter
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)} Posts
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Latest Activity</option>
                    <option>Most Replies</option>
                    <option>Most Likes</option>
                    <option>Date Posted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-6">
              {forumPosts.length === 0 ? (
                <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to start a discussion in the APF community
                  </p>
                  <Link to="/forum/create-post">
                    <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto">
                      <Plus className="w-5 h-5" />
                      Create First Post
                    </button>
                  </Link>
                </div>
              ) : (
                forumPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden relative">
                        {post.authorProfilePictureUrl ? (
                          <>
                            <img
                              src={post.authorProfilePictureUrl}
                              alt={post.author}
                              className="w-full h-full object-cover relative z-10"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center z-0">
                              {post.authorInitials}
                            </span>
                          </>
                        ) : (
                          <span>{post.authorInitials}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.author}</div>
                        <div className="text-sm text-gray-500">{post.time}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <Link to={`/forum/post/${post.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-height-tight hover:text-purple-600 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 mb-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span>{post.replies} Replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span>{post.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                                className="w-7 h-7 rounded-full border-2 border-white bg-purple-600 text-white text-[10px] font-semibold flex items-center justify-center overflow-hidden"
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
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span>{post.views} Views</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span>{post.views} Views</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Link to={`/forum/post/${post.id}`}>
                        <button className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-5 py-2 border rounded-lg transition-colors ${
                          likedPosts.includes(post.id)
                            ? 'border-red-200 bg-red-50 text-red-600'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        {likedPosts.includes(post.id) ? 'Liked' : 'Like'}
                      </button>
                      <button 
                        onClick={() => handleBookmark(post.id)}
                        className={`flex items-center gap-2 px-5 py-2 border rounded-lg transition-colors ${
                          bookmarkedPosts.includes(post.id)
                            ? 'border-purple-200 bg-purple-50 text-purple-600'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        {bookmarkedPosts.includes(post.id) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    </div>
                    <Link to={`/forum/post/${post.id}`} className="flex items-center gap-1 text-purple-600 font-semibold hover:underline">
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForumPage;
