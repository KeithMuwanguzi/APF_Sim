import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Mail, Phone, Upload, Trash2, User } from 'lucide-react';
import { UserProfile } from '../../services/profileApi';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  loading?: boolean;
  onUploadPicture: (file: File) => Promise<boolean>;
  onDeletePicture: () => Promise<boolean>;
  uploadingPicture?: boolean;
}

const ContactChip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
    <span className="text-gray-400 w-4 h-4">{icon}</span>
    <span className="text-xs text-gray-600 font-medium">{text}</span>
  </div>
);

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  loading = false,
  onUploadPicture,
  onDeletePicture,
  uploadingPicture = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPictureMenu, setShowPictureMenu] = useState(false);

  // Log when profile changes
  useEffect(() => {
    console.log('[ProfileHeader] Profile updated:', profile ? {
      full_name: profile.full_name,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
    } : 'null');
  }, [profile]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUploadPicture(file);
      setShowPictureMenu(false);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeletePicture = async () => {
    await onDeletePicture();
    setShowPictureMenu(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-8 mb-6 border-l-8 border-[#5C32A3]">
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="flex gap-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center mb-6 border-l-8 border-[#5C32A3]">
        <p className="text-gray-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-8 mb-6 border-l-8 border-[#5C32A3]">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
          {profile.profile_picture_url ? (
            <img 
              src={profile.profile_picture_url}
              alt={profile.full_name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#5C32A3] to-[#4A2882] flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {profile.initials}
              </span>
            </div>
          )}
        </div>
        
        {/* Picture upload button */}
        <div className="absolute bottom-0 right-0">
          <button
            onClick={() => setShowPictureMenu(!showPictureMenu)}
            disabled={uploadingPicture}
            className="bg-[#5C32A3] p-1.5 rounded-full border-2 border-white hover:bg-purple-800 transition-colors disabled:opacity-50"
          >
            {uploadingPicture ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Pencil className="w-3 h-3 text-white" />
            )}
          </button>
          
          {/* Picture menu */}
          {showPictureMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              {profile.profile_picture_url && (
                <button
                  onClick={handleDeletePicture}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Photo
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <p className="text-gray-500 text-sm">
            {profile.user_role === '1' ? 'Admin' : 'Member'} • 
            {profile.icpau_registration_number && (
              <span className="font-mono ml-1">ICPAU Reg. No: {profile.icpau_registration_number}</span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <ContactChip icon={<Mail size={14} />} text={profile.email} />
          {profile.phone_number && (
            <ContactChip icon={<Phone size={14} />} text={profile.phone_number} />
          )}
          {profile.organization && (
            <ContactChip icon={<User size={14} />} text={profile.organization} />
          )}
        </div>
      </div>
      
      {/* Click outside to close menu */}
      {showPictureMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowPictureMenu(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;