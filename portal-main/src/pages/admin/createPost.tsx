import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/adminSideNav';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CreatePostForm from '../../components/adminForum-components/CreatePostForm';
import { useCategories, useTags, useCreatePost } from '../../hooks/useForumData';
import { CreatePostRequest } from '../../components/adminForum-components/types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const CreatePost = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch categories and tags
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: tags, loading: tagsLoading } = useTags();
  const { createPost, loading: createLoading, error: createError } = useCreatePost();

  const handleSubmit = async (data: CreatePostRequest) => {
    const post = await createPost(data);
    
    if (post) {
      setShowSuccess(true);
      
      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        navigate('/admin/communityForum');
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate('/admin/communityForum');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="Create Post" />

        <div className="flex-1 bg-[#F4F7FE] p-8">
          <div className="max-w-[900px] mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-[#5C32A3] transition-colors mb-4 font-medium"
              >
                <ArrowLeft size={20} />
                Back to Forum
              </button>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Post</h1>
              <nav className="text-sm font-medium text-gray-400">
                Admin Dashboard <span className="mx-1">&gt;</span> Community Forum <span className="mx-1">&gt;</span> Create Post
              </nav>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="font-bold">Post created successfully!</p>
                  <p className="text-sm">Redirecting to forum...</p>
                </div>
              </div>
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Post Details</h2>
                <p className="text-sm text-gray-500">
                  Fill in the details below to create your forum post. Fields marked with * are required.
                </p>
              </div>

              {/* Loading State */}
              {(categoriesLoading || tagsLoading) ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C32A3] mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading form data...</p>
                </div>
              ) : (
                <CreatePostForm
                  categories={categories}
                  tags={tags}
                  onSubmit={handleSubmit}
                  loading={createLoading}
                  error={createError}
                />
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-indigo-900 mb-3">Tips for Creating Great Posts</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Be clear and descriptive:</strong> Use a title that accurately describes your post content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Provide context:</strong> Include relevant details and background information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Use categories and tags:</strong> Help users find your post by selecting appropriate categories and tags</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Save as draft:</strong> Not ready to publish? Save your post as a draft and come back later</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default CreatePost;
