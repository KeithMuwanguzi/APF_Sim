import { useState, useEffect } from 'react';
import { Input, ActionButton } from './ui';
import { UserProfile, ProfileUpdateData } from '../../services/profileApi';

interface PersonalInfoProps {
  profile: UserProfile | null;
  onUpdate: (data: ProfileUpdateData) => Promise<boolean>;
  updating?: boolean;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ 
  profile, 
  onUpdate, 
  updating = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    console.log('[PersonalInfo] Profile prop changed:', profile ? {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      updated_at: profile.updated_at,
    } : 'null');
    
    if (profile) {
      const newFormData = {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || ''
      };
      setFormData(newFormData);
      setHasChanges(false);
      
      console.log('[PersonalInfo] Form data updated:', newFormData);
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check if there are changes
    if (profile) {
      const originalData = {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || ''
      };
      
      const hasChanges = Object.keys(newFormData).some(
        key => newFormData[key as keyof typeof newFormData] !== originalData[key as keyof typeof originalData]
      );
      setHasChanges(hasChanges);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || updating) {
      console.log('[PersonalInfo] Submit blocked:', { hasChanges, updating });
      return;
    }

    console.log('[PersonalInfo] Submitting update:', formData);
    console.log('[PersonalInfo] Current profile:', profile ? {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      updated_at: profile.updated_at,
    } : 'null');

    const success = await onUpdate(formData);
    console.log('[PersonalInfo] Update result:', success);
    
    if (success) {
      console.log('[PersonalInfo] Update successful, resetting form state');
      setHasChanges(false);
      setIsEditing(false);
    } else {
      console.log('[PersonalInfo] Update failed');
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || ''
      });
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    // Display mode - show existing data with modify button
    return (
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
              <p className="text-sm text-gray-400">Your contact and personal details.</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#5C32A3] text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium"
            >
              Modify
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.first_name || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.last_name || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.phone_number || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.date_of_birth || 'Not provided'}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.email || 'Loading...'}
            </p>
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              ℹ️ Email cannot be changed for security reasons
            </p>
          </div>

          {profile?.icpau_registration_number && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ICPAU Registration Number</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border font-mono">
                {profile.icpau_registration_number}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                ℹ️ Verified and locked for security
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Edit mode - show form
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Edit Personal Information</h2>
        <p className="text-sm text-gray-400">Update your contact and personal details.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input 
            label="First Name" 
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
          />
          <Input 
            label="Last Name" 
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
          />
          <Input 
            label="Phone Number" 
            placeholder="+256 770 123 456"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
          />
          <Input 
            label="Date of Birth" 
            type="date"
            placeholder="Select Date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <Input 
            label="Email Address" 
            placeholder={profile?.email || "Loading..."}
            value={profile?.email || ''}
            disabled={true}
          />
          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
            ℹ️ Email cannot be changed for security reasons
          </p>
        </div>

        {profile?.icpau_registration_number && (
          <div className="mb-6">
            <Input 
              label="ICPAU Registration Number" 
              placeholder="CM000000000000"
              value={profile.icpau_registration_number}
              disabled={true}
            />
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              ℹ️ Verified and locked for security
            </p>
          </div>
        )}
        
        <div className="flex gap-4">
          <ActionButton 
            text={updating ? "Saving..." : "Save Changes"} 
            disabled={!hasChanges || updating}
            type="submit"
          />
          <button
            type="button"
            onClick={handleCancel}
            disabled={updating}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};