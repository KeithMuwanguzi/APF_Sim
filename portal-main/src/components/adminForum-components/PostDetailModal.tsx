import { X, MessageSquare, ThumbsUp, Calendar, Send } from 'lucide-react';
import { ForumPost, Comment } from './types';
import { useState } from 'react';

interface PostDetailModalProps {
  post: ForumPost;
  isOpen: boolean;
  onClose: () => void;
  onToggleLike: (postId: number, isLiked: boolean) => void;
  comments: Comment[];
  onAddComment: (postId: number, content: string) => Promise<boolean>;
  loadingComments: boolean;
}

const PostDetailModal = ({ 
  post, 
  isOpen, 
  onClose, 
  onToggleLike,
  comments,
  onAddComment,
  loadingComments
}: PostDetailModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAddComment(post.id, commentText.trim());
    
    if (success) {
      setCommentText('');
    }
    setIsSubmitting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs">
                  {post.author.initials}
                </div>
                <span className="font-medium text-gray-700">{post.author.full_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          {post.category && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                {post.category.name}
              </span>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments ({comments.length})
            </h3>

            {/* Comment Input */}
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a comment... (Press Enter to submit, Shift+Enter for new line)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C32A3] focus:border-transparent resize-none"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmitting}
                  className="bg-[#5C32A3] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4A2885] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loadingComments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C32A3] mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to comment on this post!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {comment.author.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {comment.author.full_name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatCommentDate(comment.created_at)}
                          </span>
                          {comment.is_edited && (
                            <span className="text-xs text-gray-400 italic">(edited)</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 text-gray-600 text-sm font-medium">
              <span className="flex items-center gap-2">
                <MessageSquare size={18} /> 
                <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
              </span>
              <button 
                onClick={() => onToggleLike(post.id, post.is_liked)}
                className={`flex items-center gap-2 transition-colors ${
                  post.is_liked ? 'text-indigo-600' : 'hover:text-indigo-600'
                }`}
              >
                <ThumbsUp size={18} fill={post.is_liked ? 'currentColor' : 'none'} /> 
                <span>{post.like_count} {post.like_count === 1 ? 'Like' : 'Likes'}</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-[#5C32A3] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#4A2885] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
