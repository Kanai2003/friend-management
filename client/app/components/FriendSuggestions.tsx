'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getFriendRecommendations, sendFriendRequest } from '../services/api';

type Suggestion = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  [key: string]: unknown;
};

export function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRequests, setLoadingRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await getFriendRecommendations();

        if (!response) {
          throw new Error('Failed to fetch friend suggestions');
        }

        setSuggestions(response);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch suggestions';
        console.error('Error fetching suggestions:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleAddFriend = async (suggestionId: string) => {
    try {
      setLoadingRequests((prev) => [...prev, suggestionId]);
      const response = await sendFriendRequest(suggestionId);

      if (!response || response.status !== 'success') {
        throw new Error(response.message || 'Failed to add friend');
      }

      // Remove the successfully added friend from suggestions
      setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== suggestionId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send friend request';
      console.error('Error adding friend:', errorMessage);
      setError(errorMessage);
    } finally {
      // Remove the suggestionId from loading state
      setLoadingRequests((prev) => prev.filter((id) => id !== suggestionId));
    }
  };

  // UI for loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading suggestions...</p>;
  }

  // UI for error state
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  // UI for empty suggestions
  if (suggestions.length === 0) {
    return <p className="text-center text-gray-500">No friend suggestions available at the moment.</p>;
  }

  // Main UI
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">People You May Know</h2>
      <ul className="space-y-4">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="flex items-center justify-between p-4 rounded-md bg-gray-100 shadow-sm hover:bg-gray-200"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  alt={suggestion.name}
                  src={suggestion.profileImage || '/default-avatar.png'}
                />
                <AvatarFallback>{suggestion.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-sm text-gray-500">{suggestion.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleAddFriend(suggestion.id)}
              disabled={loadingRequests.includes(suggestion.id)}
            >
              {loadingRequests.includes(suggestion.id) ? 'Adding...' : 'Add Friend'}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
