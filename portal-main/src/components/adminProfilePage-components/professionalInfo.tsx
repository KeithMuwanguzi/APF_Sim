
import { useState, useEffect } from 'react';
import { Input, ActionButton } from './ui';
import { UserProfile, ProfileUpdateData } from '../../services/profileApi';

interface ProfessionalInfoProps {
  profile: UserProfile | null;
  onUpdate: (data: ProfileUpdateData) => Promise<boolean>;
  updating?: boolean;
}

export const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ 
  profile, 
  onUpdate, 
  updating = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    job_title: '',
    organization: '',
    department: '',
    icpau_registration_number: '',
    years_of_experience: '',
    specializations: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when profile changes
  useEffect(() => {
    console.log('[ProfessionalInfo] Profile prop changed:', profile ? {
      job_title: profile.job_title,
      organization: profile.organization,
      updated_at: profile.updated_at,
    } : 'null');
    
    if (profile) {
      const newFormData = {
        job_title: profile.job_title || '',
        organization: profile.organization || '',
        department: profile.department || '',
        icpau_registration_number: profile.icpau_registration_number || '',
        years_of_experience: profile.years_of_experience?.toString() || '',
        specializations: profile.specializations || ''
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check if there are changes
    if (profile) {
      const originalData = {
        job_title: profile.job_title || '',
        organization: profile.organization || '',
        department: profile.department || '',
        icpau_registration_number: profile.icpau_registration_number || '',
        years_of_experience: profile.years_of_experience?.toString() || '',
        specializations: profile.specializations || ''
      };
      
      const hasChanges = Object.keys(newFormData).some(
        key => newFormData[key as keyof typeof newFormData] !== originalData[key as keyof typeof originalData]
      );
      setHasChanges(hasChanges);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || updating) return;

    // Convert years_of_experience back to number
    const updateData: ProfileUpdateData = {
      ...formData,
      years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
    };

    const success = await onUpdate(updateData);
    if (success) {
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profile) {
      setFormData({
        job_title: profile.job_title || '',
        organization: profile.organization || '',
        department: profile.department || '',
        icpau_registration_number: profile.icpau_registration_number || '',
        years_of_experience: profile.years_of_experience?.toString() || '',
        specializations: profile.specializations || ''
      });
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    // Display mode - show existing data with modify button
    return (
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
        <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Professional Information</h2>
              <p className="text-sm text-gray-400">Your professional details and credentials.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.job_title || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.organization || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.department || 'Not provided'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.years_of_experience ? `${profile.years_of_experience} years` : 'Not provided'}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">ICPAU Registration Number</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border font-mono">
              {profile?.icpau_registration_number || 'Not provided'}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
              {profile?.specializations || 'Not provided'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Edit mode - show form
  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Edit Professional Information</h2>
        <p className="text-sm text-gray-400">Update your professional details and credentials.</p>
      </div>
  
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input 
            label="Job Title" 
            placeholder="Senior Accountant"
            value={formData.job_title}
            onChange={(e) => handleInputChange('job_title', e.target.value)}
          />
          <Input 
            label="Organization / Firm" 
            placeholder="APF Audit"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
          />
          <Input 
            label="Department" 
            placeholder="Audit Department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
          />
          <Input 
            label="Years of Experience" 
            type="number"
            placeholder="5"
            value={formData.years_of_experience}
            onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
          />
          <Input 
            label="ICPAU Registration Number" 
            placeholder="F/ICPAU/2015/001"
            value={formData.icpau_registration_number}
            onChange={(e) => handleInputChange('icpau_registration_number', e.target.value)}
          />
          <Input 
            label="Specializations" 
            placeholder="Audit, Tax, Financial Advisory"
            value={formData.specializations}
            onChange={(e) => handleInputChange('specializations', e.target.value)}
          />
        </div>
  
        {/* Help Text */}
        <p className="text-[10px] text-gray-400 mb-6 flex items-center gap-1">
          <span role="img" aria-label="info">ℹ️</span> Professional information updates are applied immediately for admin accounts
        </p>
  
        <div className="flex gap-4">
          <ActionButton 
            text={updating ? "Updating..." : "Update Professional Info"} 
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