'use client'

import { useAuth } from './contexts/AuthContext'
import { AuthForms } from './components/AuthForms'
import { SearchBar } from './components/SearchBar'
import { FriendList } from './components/FriendList'
import { FriendSuggestions } from './components/FriendSuggestions'
import { FriendRequestManagement } from './components/FriendRequestManagement'
import { Button } from '@/components/ui/button'
import { RandomUserSuggestions } from './components/FriendSuggestionsRandom'

export default function Home() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <AuthForms />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Social Network</h1>
          <Button onClick={logout}>Logout</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <SearchBar />
              <FriendRequestManagement />
              <FriendSuggestions />
              <RandomUserSuggestions />
            </div>
            <div>
              <FriendList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

