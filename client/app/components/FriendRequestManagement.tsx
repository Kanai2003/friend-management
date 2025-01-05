'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getRequests, manageFriendRequest } from '../services/api'

type FriendRequest = {
  id: string
  name: string
  avatar?: string
}

export function FriendRequestManagement() {
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null) // Track which action is in progress
  const [actionError, setActionError] = useState<string | null>(null)

  // Fetch friend requests from the API
  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRequests()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processedData = data.map((request: any) => ( {
        id: request._id,
        name: request.sender.name,
        email: request.sender.email,
        senderId: request.sender._id
      }));
      setRequests(processedData) 
    } catch (err: unknown) {
      const errorMessage = 
        err instanceof Error ? err.message : 'Failed to fetch friend requests'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle action (accept/reject)
  const handleAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    setActionLoading(requestId) // Set action as loading for the specific request
    try {
      setActionError(null)
      await manageFriendRequest(requestId, action) // Assuming success throws no error
      setRequests((prev) => prev.filter((request) => request.id !== requestId)) // Remove the request after action
    } catch (err: unknown) {
      const errorMessage = 
        err instanceof Error ? err.message : `Failed to ${action} friend request`
      setActionError(errorMessage)
    } finally {
      setActionLoading(null) // Reset loading state for the action
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Loading state for fetching requests
  if (loading) {
    return <p className="text-center text-gray-500">Loading friend requests...</p>
  }

  // Error state for fetching requests
  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>
  }

  // Empty state when no requests are available
  if (requests.length === 0) {
    return <p className="text-center text-gray-500">No friend requests available.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Friend Requests</h2>
      {actionError && (
        <p className="text-center text-red-500">Action Error: {actionError}</p>
      )}
      <ul className="space-y-4">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex items-center justify-between p-2 rounded-md bg-gray-100 shadow-sm hover:bg-gray-200"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage 
                  src={request?.avatar || '/placeholder.svg?height=32&width=32'} 
                  alt={request?.name} 
                />
                <AvatarFallback>{request?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{request.name}</span>
            </div>
            <div className="space-x-2">
              <Button
                variant="default"
                onClick={() => handleAction(request.id, 'accepted')}
                disabled={actionLoading === request.id}
              >
                {actionLoading === request.id ? 'Accepting...' : 'Accept'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction(request.id, 'rejected')}
                disabled={actionLoading === request.id}
              >
                {actionLoading === request.id ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
