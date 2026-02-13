"use client"

import React, { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

export default function BookmarkList({ session }: { session: any }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) {
      console.log('[BookmarkList] No session')
      return
    }

    console.log('[BookmarkList] Session user ID:', session.user?.id)
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        console.log('[BookmarkList] Loading bookmarks for user:', session.user?.id)
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', session.user.id)
          .order('inserted_at', { ascending: false })
        
        console.log('[BookmarkList] Query result:', { data, error })
        
        if (error) {
          console.error('[BookmarkList] Query error:', error)
          setError(error.message || 'Failed to load bookmarks')
        } else if (mounted) {
          console.log('[BookmarkList] Bookmarks loaded:', data?.length || 0)
          setItems(data ?? [])
          setError('')
        }
      } catch (err: any) {
        console.error('[BookmarkList] Load exception:', err)
        setError(err.message || 'Failed to load bookmarks')
      } finally {
        setLoading(false)
      }
    }

    load()

    // Set up real-time subscription
    const channel = supabase.channel(`user-bookmarks-${session.user.id}`)
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${session.user.id}` }, (payload: any) => {
      console.log('[BookmarkList] New bookmark inserted:', payload.new)
      setItems((prev) => [payload.new, ...prev])
    })
    channel.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${session.user.id}` }, (payload: any) => {
      console.log('[BookmarkList] Bookmark deleted:', payload.old.id)
      setItems((prev) => prev.filter(i => i.id !== payload.old.id))
    })
    channel.subscribe((status: string) => {
      console.log('[BookmarkList] Subscription status:', status)
    })

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [session])

  const remove = async (id: string) => {
    if (!confirm('Delete this bookmark?')) return
    await supabase.from('bookmarks').delete().eq('id', id).eq('user_id', session.user.id)
  }

  if (loading) return <div className="p-4">Loading bookmarks...</div>

  if (error) return <div className="p-4 text-red-600">{error}</div>

  if (!items.length) return <div className="p-4 card">No bookmarks yet.</div>

  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item.id} className="card bookmark-item flex items-start justify-between">
          <div>
            <a className="font-medium text-lg" href={item.url} target="_blank" rel="noreferrer" style={{color: 'var(--text-dark)'}}>{item.title}</a>
            <div className="text-xs muted">{new Date(item.inserted_at).toLocaleString()}</div>
          </div>
          <div>
            <button onClick={() => remove(item.id)} className="text-sm text-red-500">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
