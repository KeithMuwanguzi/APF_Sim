import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Bold,
  Italic,
  List,
  Link2,
  Image,
  Code,
  Upload,
  Eye,
  RotateCcw,
  X,
  Send,
  Save
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useForumCategories } from '../../hooks/useForum';
import { createForumPost, getForumPostDetail, updateForumPost } from '../../services/forum.service';
import { toastMessages } from '../../utils/toast-helpers';

const CreatePostPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postContent, setPostContent] = useState('');
  const [tags, setTags] = useState(['#discussion', '@john.doe']);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const { categories: fetchedCategories, loading: categoriesLoading } = useForumCategories();

  const categories = useMemo(() => {
    if (fetchedCategories.length === 0) {
      return [
        { value: 'announcements', label: 'Announcements' },
        { value: 'suggestions', label: 'Suggestions' },
        { value: 'general', label: 'General Discussion' },
        { value: 'qa', label: 'Q&A Support' },
        { value: 'tips', label: 'Professional Tips' },
        { value: 'networking', label: 'Networking' }
      ];
    }
    return fetchedCategories.map((category) => ({
      value: category.id,
      label: category.name
    }));
  }, [fetchedCategories]);

  useEffect(() => {
    if (!isEditMode) return;
    const postId = Number(id);
    if (!Number.isFinite(postId)) return;

    const loadPost = async () => {
      setIsLoadingPost(true);
      const post = await getForumPostDetail(postId);
      setIsLoadingPost(false);

      if (!post) return;
      setPostTitle(post.title || '');
      setPostContent(post.content || '');
      setPostCategory(post.category?.slug || '');
    };

    loadPost();
  }, [id, isEditMode]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    if (!postTitle.trim()) {
      toastMessages.validation.titleRequired();
      return false;
    }
    if (!postCategory) {
      toastMessages.validation.categoryRequired();
      return false;
    }
    if (!postContent.trim()) {
      toastMessages.validation.contentRequired();
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      const selectedCategory = fetchedCategories.find((category) => category.id === postCategory);
      const payload = {
        title: postTitle,
        content: postContent,
        category_id: selectedCategory?.rawId ?? undefined,
        status: 'published'
      };
      const response = isEditMode && id
        ? await updateForumPost(Number(id), payload)
        : await createForumPost(payload);
      setIsSubmitting(false);

      if (response) {
        isEditMode ? toastMessages.post.updated() : toastMessages.post.published();
        if (!isEditMode) {
          setPostTitle('');
          setPostCategory('');
          setPostContent('');
          setTags([]);
        }
      } else {
        isEditMode ? toastMessages.post.updateFailed() : toastMessages.post.publishFailed();
      }
    }
  };

  const handleSaveDraft = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      const selectedCategory = fetchedCategories.find((category) => category.id === postCategory);
      const payload = {
        title: postTitle,
        content: postContent,
        category_id: selectedCategory?.rawId ?? undefined,
        status: 'draft'
      };
      const response = isEditMode && id
        ? await updateForumPost(Number(id), payload)
        : await createForumPost(payload);
      setIsSubmitting(false);

      if (response) {
        isEditMode ? toastMessages.post.draftUpdated() : toastMessages.post.savedAsDraft();
      } else {
        isEditMode ? toastMessages.post.updateFailed() : toastMessages.post.saveDraftFailed();
      }
    }
  };

  return (
    <DashboardLayout
      headerContent={
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#60308C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community Forum
        </Link>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Post' : 'Create New Post'}
                </h2>
              </div>

              <form className="space-y-6">
                {/* Post Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter a descriptive title for your post"
                    disabled={isSubmitting || isLoadingPost}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white"
                  />
                </div>

                {/* Post Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Post Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    disabled={categoriesLoading || isSubmitting || isLoadingPost}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tags / Mentions
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[60px] items-center">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#D689FF]/20 text-[#60308C] rounded-full text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="w-4 h-4 flex items-center justify-center rounded-full bg-white/50 hover:bg-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tags (e.g., #discussion) or mention a user (e.g., @john.doe)"
                      className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Post Content <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Editor Toolbar */}
                  <div className="flex gap-1 p-3 border border-gray-200 border-b-0 rounded-t-lg bg-gray-50">
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <List className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-2 hover:bg-[#D689FF]/20 rounded text-gray-600 hover:text-[#60308C] transition-colors">
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Start writing your post content here..."
                    rows={12}
                    disabled={isSubmitting || isLoadingPost}
                    className="w-full px-5 py-4 border border-gray-200 rounded-b-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <div className="text-gray-600 mb-2">Drag & drop files here or click to upload</div>
                    <div className="text-sm text-gray-500">Maximum file size: 10MB</div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-8 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 px-8 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Draft' : 'Save as Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-8 py-3 bg-[#60308C] text-white rounded-lg hover:bg-[#60308C]/90 transition-colors disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Publishing...' : isEditMode ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Post Preview</h3>
                <button className="p-2 hover:bg-[#D689FF]/20 rounded-lg text-gray-600 hover:text-[#60308C] transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="min-h-[300px]">
                {postTitle || postContent ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {postTitle || 'Untitled Post'}
                    </h3>
                    
                    {postCategory && (
                      <div>
                        <span className="inline-block px-3 py-1 bg-[#D689FF]/20 text-[#60308C] text-sm font-medium rounded-full">
                          {categories.find(c => c.value === postCategory)?.label}
                        </span>
                      </div>
                    )}
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              tag.startsWith('#')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-[#D689FF]/20 text-[#60308C]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-gray-700 leading-relaxed">
                      {postContent || 'Start typing your post content...'}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Eye className="w-12 h-12 text-purple-300 mb-4" />
                    <div className="font-medium mb-2">Post Preview</div>
                    <div className="text-sm">Start typing to see a live preview of your post</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePostPage;
