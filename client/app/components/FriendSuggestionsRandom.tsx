'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getRandomUsers, sendFriendRequest } from '../services/api';

type User = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  [key: string]: unknown;
};

export function RandomUserSuggestions() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRequests, setLoadingRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getRandomUsers();

        if (!response) {
          throw new Error('Failed to fetch random users');
        }

        setUsers(response);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch random users';
        console.error('Error fetching users:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async (userId: string) => {
    try {
      setLoadingRequests((prev) => [...prev, userId]);
      const response = await sendFriendRequest(userId);

      if (!response || response.status !== 'success') {
        throw new Error(response.message || 'Failed to send friend request');
      }

      // Remove the successfully added user from suggestions
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send friend request';
      console.error('Error adding friend:', errorMessage);
      setError(errorMessage);
    } finally {
      // Remove the userId from loading state
      setLoadingRequests((prev) => prev.filter((id) => id !== userId));
    }
  };

  // UI for loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading users...</p>;
  }

  // UI for error state
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  // UI for empty user list
  if (users.length === 0) {
    return <p className="text-center text-gray-500">No random users available at the moment.</p>;
  }

  // Main UI
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Random People You May Know</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-4 rounded-md bg-gray-100 shadow-sm hover:bg-gray-200"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  alt={user.name}
                  src={user.profileImage || '/default-avatar.png'}
                />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleAddFriend(user._id)}
              disabled={loadingRequests.includes(user._id)}
            >
              {loadingRequests.includes(user._id) ? 'Adding...' : 'Add Friend'}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
