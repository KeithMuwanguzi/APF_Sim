import { useState, useEffect } from "react";
import Sidebar from "../../components/common/adminSideNav";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProfileHeader from "../../components/adminProfilePage-components/profileHeader";
import { PersonalInfo } from '../../components/adminProfilePage-components/personalInfo';
import { ProfessionalInfo } from '../../components/adminProfilePage-components/professionalInfo';
import { SecuritySettings } from '../../components/adminProfilePage-components/securitySettings';
import { NotificationPrefs } from '../../components/adminProfilePage-components/notificationprefs';
import { useProfile } from '../../hooks/useProfile';
import { requireAdmin } from '../../utils/auth';

const AdminProfilePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    profile,
    loading,
    error,
    updating,
    uploadingPicture,
    changingPassword,
    refetchProfile,
    updateProfile,
    uploadPicture,
    deletePicture,
    updatePassword,
    clearError
  } = useProfile();

  // Check authentication on component mount
  useEffect(() => {
    if (!requireAdmin()) {
      return; // Will redirect to login
    }
  }, []);

  // Add a manual refresh handler for debugging
  const handleRefresh = async () => {
    console.log('[Profile] Manual refresh triggered');
    await refetchProfile();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`flex-1 bg-gray-50 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} flex flex-col min-h-screen min-w-0`}>
        <Header title="My Profile" />

        <div className="flex-1 bg-[#F4F2FE] p-8 space-y-10">
          <div className="max-w-[1400px] mx-auto space-y-10">
            
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[26px] font-bold text-slate-800 tracking-tight text-[#5C32A3]">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal and professional information. Keep your profile updated to ensure seamless communication.</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Refreshing...' : 'Refresh Profile'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="block sm:inline">{error}</span>
                  <button
                    onClick={clearError}
                    className="text-red-700 hover:text-red-900 ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              loading={loading}
              onUploadPicture={uploadPicture}
              onDeletePicture={deletePicture}
              uploadingPicture={uploadingPicture}
            />

            {/* Form Sections */}
            <div className="space-y-8">
              <PersonalInfo 
                profile={profile}
                onUpdate={updateProfile}
                updating={updating}
              />
              <ProfessionalInfo 
                profile={profile}
                onUpdate={updateProfile}
                updating={updating}
              />
              <SecuritySettings 
                onChangePassword={updatePassword}
                changingPassword={changingPassword}
              />
              <NotificationPrefs />
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;