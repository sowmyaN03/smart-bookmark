"use client"

import React, { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import AuthButton from '../components/AuthButton'
import DarkToggle from '../components/DarkToggle'
import BookmarkForm from '../components/BookmarkForm'
import BookmarkList from '../components/BookmarkList'

export default function Page() {
  const [session, setSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let sessionFetchTimer: any = null

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('[Page] Fetching session...')
        const { data } = await supabase.auth.getSession()
        console.log('[Page] Session fetched:', data.session ? 'YES' : 'NO')
        if (mounted) {
          setSession(data.session)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('[Page] Failed to get session:', err)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((event: string, s: any) => {
      console.log('[Page] Auth state event:', event)
      if (mounted) {
        setSession(s)
        setIsLoading(false)
        console.log('[Page] Session updated:', s ? 'YES' : 'NO')
      }
    })

    // Handle OAuth callback: if URL has hash, wait a bit then refresh session
    if (typeof window !== 'undefined' && window.location.hash) {
      console.log('[Page] OAuth callback detected, retrying session after delay...')
      sessionFetchTimer = setTimeout(() => {
        if (mounted) {
          getInitialSession()
        }
      }, 1000)
    }

    return () => {
      mounted = false
      if (sessionFetchTimer) clearTimeout(sessionFetchTimer)
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <main>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold" style={{color: 'var(--text-dark)'}}>Smart Bookmark App</h1>
        <div className="flex items-center gap-3">
          <DarkToggle />
          <AuthButton session={session} />
        </div>
      </header>

      <p className="mb-4 text-sm muted">Save private bookmarks quickly. Sign in with Google (OAuth via Supabase).</p>

      {isLoading ? (
        <div className="p-6 card text-center">
          <p>Loading...</p>
        </div>
      ) : session ? (
        <div>
          <BookmarkForm session={session} />
          <BookmarkList session={session} />
        </div>
      ) : (
        <div className="p-6 card text-center">
          <p className="mb-4">You must sign in to manage your bookmarks.</p>
          <AuthButton session={session} />
        </div>
      )}
    </main>
  )
}
