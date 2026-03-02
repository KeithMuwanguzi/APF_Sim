/**
 * Toast Helper Functions
 * Centralized toast messages for consistent UX across the application
 * 
 * Usage:
 * import { showSuccess, showError } from '@/utils/toast-helpers'
 * showSuccess('Payment successful')
 */

import { toast } from '../hooks/useToast'

/**
 * Show success toast
 */
export const showSuccess = (message: string, title: string = 'Success') => {
  toast({
    title,
    description: message,
    variant: 'success',
  })
}

/**
 * Show error toast
 */
export const showError = (message: string, title: string = 'Error') => {
  toast({
    title,
    description: message,
    variant: 'destructive',
  })
}

/**
 * Show warning toast
 */
export const showWarning = (message: string, title: string = 'Warning') => {
  toast({
    title,
    description: message,
    variant: 'warning',
  })
}

/**
 * Show info toast
 */
export const showInfo = (message: string, title: string = 'Info') => {
  toast({
    title,
    description: message,
    variant: 'default',
  })
}

// Specific action-based toast messages
export const toastMessages = {
  // Payment messages
  payment: {
    success: () => showSuccess('Your payment has been processed successfully'),
    failed: () => showError('Payment failed. Please try again or contact support'),
    processing: () => showInfo('Processing your payment...'),
  },
  
  // Document messages
  document: {
    uploaded: () => showSuccess('Document uploaded successfully! It will now be reviewed by admin'),
    replaced: (name: string) => showSuccess(`${name} has been re-uploaded successfully! It will now be reviewed by admin`),
    downloaded: (name: string) => showSuccess(`${name} downloaded successfully`),
    deleted: (name: string) => showSuccess(`${name} has been removed successfully`),
    uploadFailed: () => showError('Upload failed. Please try again'),
    sizeLimitExceeded: (maxSize: number) => showError(`File size exceeds ${maxSize}MB limit. Please select a smaller file`),
  },
  
  // Forum/Post messages
  post: {
    published: () => showSuccess('Post published successfully!'),
    updated: () => showSuccess('Post updated successfully!'),
    deleted: () => showSuccess('Post deleted successfully'),
    savedAsDraft: () => showSuccess('Post saved as draft successfully!'),
    draftUpdated: () => showSuccess('Draft updated successfully!'),
    publishFailed: () => showError('Failed to publish post. Please try again'),
    updateFailed: () => showError('Failed to update post. Please try again'),
    deleteFailed: () => showError('Failed to delete post. Please try again'),
    saveDraftFailed: () => showError('Failed to save draft. Please try again'),
  },
  
  // Comment messages
  comment: {
    added: () => showSuccess('Comment added successfully'),
    addFailed: () => showError('Failed to add comment. Please try again'),
  },
  
  // Profile messages
  profile: {
    updated: () => showSuccess('Profile updated successfully'),
    updateFailed: () => showError('Failed to update profile. Please try again'),
    passwordChanged: () => showSuccess('Password changed successfully!'),
    passwordMismatch: () => showError('New passwords do not match!'),
    passwordTooShort: () => showError('Password must be at least 8 characters long!'),
  },
  
  // Notification messages
  notification: {
    markedAsRead: () => showSuccess('Notification marked as read'),
    allMarkedAsRead: () => showSuccess('All notifications marked as read'),
  },
  
  // Announcement messages
  announcement: {
    sent: () => showSuccess('Announcement sent successfully'),
    deleted: () => showSuccess('Announcement deleted successfully'),
    duplicated: () => showSuccess('Announcement duplicated successfully'),
    sendFailed: () => showError('Failed to send announcement'),
    deleteFailed: () => showError('Failed to delete announcement'),
    duplicateFailed: () => showError('Failed to duplicate announcement'),
  },
  
  // Report messages
  report: {
    generated: () => showSuccess('Report generated successfully! Check your downloads folder'),
    downloaded: () => showSuccess('Report downloaded successfully'),
    generateFailed: () => showError('Failed to generate report. Please try again'),
    downloadFailed: () => showError('Failed to download report. Please try again'),
  },
  
  // Export messages
  export: {
    success: () => showSuccess('Data exported successfully'),
    failed: () => showError('Failed to export data. Please try again'),
  },
  
  // Form validation messages
  validation: {
    titleRequired: () => showError('Please enter a post title'),
    categoryRequired: () => showError('Please select a category'),
    contentRequired: () => showError('Please enter post content'),
  },
  
  // Auth messages
  auth: {
    loginRequired: () => showInfo('Please login again to receive a new OTP code'),
    sessionExpired: () => showWarning('Your session has expired. Please login again'),
  },
}
