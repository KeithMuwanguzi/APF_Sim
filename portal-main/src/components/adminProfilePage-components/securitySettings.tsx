
import { useState } from 'react';
import { Input, ActionButton } from './ui'; 

interface SecuritySettingsProps {
  onChangePassword?: (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => Promise<boolean>;
  changingPassword?: boolean;
}

export const SecuritySettings = ({ 
  onChangePassword, 
  changingPassword = false 
}: SecuritySettingsProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async () => {
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (onChangePassword) {
      const success = await onChangePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (success) {
        // Clear form on success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-6">
      <div className="border-l-4 border-[#5C32A3] pl-4 mb-8">
        <h2 className="text-xl font-bold text-gray-800">Security & Login Settings</h2>
        <p className="text-sm text-gray-400">Update your password. MFA is enabled by default for all accounts.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Input 
          label="Current Password" 
          type="password" 
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={changingPassword}
        />
        <Input 
          label="New Password" 
          type="password" 
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={changingPassword}
        />
        <Input 
          label="Confirm New Password" 
          type="password" 
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={changingPassword}
        />
      </div>

      {/* MFA Status Info */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <p className="text-sm font-semibold text-green-800">Multi-Factor Authentication Enabled</p>
        </div>
        <p className="text-xs text-green-600 mt-1">
          MFA is automatically enabled for all accounts. OTP verification is required for login.
        </p>
      </div>
  
      <ActionButton 
        text={changingPassword ? "Updating Password..." : "Update Password"}
        onClick={handlePasswordChange}
        disabled={changingPassword}
      />
    </section>
  );
};