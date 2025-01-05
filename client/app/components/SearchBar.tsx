'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { searchUsers, sendFriendRequest } from '../services/api'

type SearchResult = {
  _id: string
  name: string
  email: string
  avatar?: string
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await searchUsers(searchTerm);

        setSearchResults(response) 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults()
    }, 300) // Debounce API call by 300ms

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

   const handleAddFriend = async (receiverId: string) => {
      try {
        const response = await sendFriendRequest(receiverId)
  
        if (!response.data) {
          throw new Error(response.data.message || 'Failed to add friend')
        }
  
        // Remove the suggestion from the list upon success
        setSearchResults((prev) => prev.filter((suggestion) => suggestion._id !== receiverId))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message)
      }
    }

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="search"
        placeholder="Search for friends..."
        className="w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p className="absolute mt-1 text-sm text-gray-500">Searching...</p>}

      {error && <p className="absolute mt-1 text-sm text-red-500">Error: {error}</p>}

      {searchResults.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {searchResults.map((result) => (
            <li key={result._id} className="flex items-center justify-between p-2 hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={result.avatar || '/placeholder.svg?height=32&width=32'} alt={result.name} />
                  <AvatarFallback>{result.name[0]}</AvatarFallback>
                </Avatar>
                <span>{result.name}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAddFriend(result._id)}>
                Add Friend
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!loading && searchTerm && searchResults.length === 0 && (
        <p className="absolute mt-1 text-sm text-gray-500">No results found</p>
      )}
    </div>
  )
}
