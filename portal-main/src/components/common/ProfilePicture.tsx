/**
 * Reusable ProfilePicture component
 * Shows profile picture or initials with upload/edit functionality
 */

import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { validateProfilePicture } from '../../services/profileApi';

interface ProfilePictureProps {
  // Display props
  src?: string | null;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Functionality props
  editable?: boolean;
  uploading?: boolean;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  
  // Style props
  className?: string;
  showUploadHint?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-16 h-16 text-base',
  lg: 'w-24 h-24 text-lg',
  xl: 'w-32 h-32 text-xl'
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  initials = 'U',
  size = 'lg',
  editable = false,
  uploading = false,
  onUpload,
  onRemove,
  className = '',
  showUploadHint = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file
    const validationError = validateProfilePicture(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (onUpload) {
      onUpload(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main profile picture container */}
      <div
        className={`
          relative rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-purple-500 to-purple-700
          ${sizeClasses[size]}
          ${editable ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}
          ${dragOver ? 'ring-4 ring-purple-300 ring-opacity-50' : ''}
          ${className}
        `}
        onClick={editable ? handleUploadClick : undefined}
        onDrop={editable ? handleDrop : undefined}
        onDragOver={editable ? handleDragOver : undefined}
        onDragLeave={editable ? handleDragLeave : undefined}
      >
        {src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold">
            {uploading ? (
              <div className="animate-spin">
                <Upload className="w-1/3 h-1/3" />
              </div>
            ) : (
              <span className="select-none">{initials}</span>
            )}
          </div>
        )}

        {/* Upload overlay */}
        {editable && !uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <Camera className="w-1/3 h-1/3 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin">
              <Upload className="w-1/3 h-1/3 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Edit button */}
      {editable && !uploading && (
        <button
          onClick={handleUploadClick}
          className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full border-2 border-white shadow-lg transition-colors"
          title="Change profile picture"
        >
          <Camera className="w-4 h-4" />
        </button>
      )}

      {/* Remove button */}
      {editable && src && !uploading && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full border-2 border-white shadow-lg transition-colors"
          title="Remove profile picture"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Hidden file input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      )}

      {/* Upload hint */}
      {editable && showUploadHint && !src && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
          Click or drag to upload
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;