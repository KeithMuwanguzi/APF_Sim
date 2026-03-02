/**
 * Debug component to show authentication state
 * Remove this in production
 */
import { useState } from 'react';
import { getCurrentUser, getAccessToken, isAuthenticated, isAdmin } from '../../utils/auth';

export function AuthDebug() {
  const [isVisible, setIsVisible] = useState(false);
  
  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Debug Auth
        </button>
      </div>
    );
  }

  const user = getCurrentUser();
  const token = getAccessToken();
  const authenticated = isAuthenticated();
  const adminUser = isAdmin();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Auth Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="text-xs space-y-1">
        <div>
          <strong>Authenticated:</strong> {authenticated ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Is Admin:</strong> {adminUser ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>User:</strong> {user ? `${user.email} (role: ${user.role})` : 'None'}
        </div>
        <div>
          <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Clear & Reload
          </button>
        </div>
      </div>
    </div>
  );
}