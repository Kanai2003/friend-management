"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFriendsList } from "../services/api";

type Friend = {
  id: string;
  name: string;
  email:string;
  avatar?: string;
};

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch friends list from the API
  const fetchFriends = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Clear any previous error
      const friendsList = await getFriendsList(); // Fetch friends
      setFriends(friendsList); // Update friends state
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage); // Handle error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch friends when the component mounts
  useEffect(() => {
    fetchFriends();
  }, []);

  // Loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading friends...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  // Empty state
  if (friends.length === 0) {
    return <p className="text-center text-gray-500">No friends found.</p>;
  }

  // Render friends list
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Friends</h2>
      <ul className="space-y-2">
        {friends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center space-x-4 p-2 rounded-md bg-gray-100 shadow-sm hover:bg-gray-200"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={friend.avatar || "/placeholder.svg?height=32&width=32"}
                alt={friend.name}
              />
              <AvatarFallback>{friend.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
