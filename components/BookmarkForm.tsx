"use client"

import React, { useState } from 'react'
import supabase from '../lib/supabaseClient'

export default function BookmarkForm({ session }: { session: any }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!title || !url) {
      setError('Please provide both title and url')
      return
    }
    try {
      new URL(url)
    } catch (err) {
      setError('Invalid URL format')
      return
    }

    console.log('[BookmarkForm] Adding bookmark with user_id:', session.user?.id)
    setLoading(true)
    try {
      const { data, error } = await supabase.from('bookmarks').insert([{ title, url, user_id: session.user.id }])
      console.log('[BookmarkForm] Insert result:', { data, error })
      
      if (error) throw error
      
      setTitle('')
      setUrl('')
      setSuccess('Bookmark added')
      
      // Force refresh the list by reloading bookmarks
      setTimeout(() => setSuccess(''), 2000)
    } catch (err: any) {
      console.error('[BookmarkForm] Insert error:', err)
      setError('Failed to add bookmark: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 card">
      <div className="flex gap-2 mb-2">
        <input className="flex-1 p-3 border rounded" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="flex-1 p-3 border rounded" placeholder="https://example.com" value={url} onChange={(e)=>setUrl(e.target.value)} />
        <button className="btn-primary" disabled={loading}>{loading? 'Adding': 'Add'}</button>
      </div>
      <div className="flex items-center gap-4">
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
      </div>
      <div className="text-xs muted mt-2">Bookmarks are private to your account.</div>
    </form>
  )
}
