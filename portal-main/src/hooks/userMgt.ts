import { useState, useEffect, useCallback } from 'react';
import { userManagementApi } from '../services/manageuser';
import { User } from '../components/manageusers-components/users';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userManagementApi.fetchMembers();
      
     
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Data received is not an array:", data);
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load members');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (isPerformingAction) return;

    try {
      setIsPerformingAction(true);
      if (currentStatus === 'Suspended') {
        await userManagementApi.reactivateMember(id);
      } else {
        await userManagementApi.suspendMember(id);
      }
      
     
      await fetchUsers();
      
    } catch (err: any) {
      alert("Status update failed. Please try again.");
    } finally {
      setIsPerformingAction(false);
    }
  };

  return { users, loading, isPerformingAction, error, handleToggleStatus };
};