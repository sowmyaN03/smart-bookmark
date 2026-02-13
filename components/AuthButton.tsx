"use client"

import React, { useState } from 'react'
import supabase, { SUPABASE_CONFIGURED } from '../lib/supabaseClient'

export default function AuthButton({ session }: { session: any }) {
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')

  const signInWithEmail = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    setEmailMessage('')
    setLoading(true)
    try {
      console.log('[AuthButton] Email auth attempt:', { email, isSignUp })
      
      if (isSignUp) {
        // For signup, always use signUp
        console.log('[AuthButton] Attempting sign up with email:', email)
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        })
        console.log('[AuthButton] Sign up response:', { data, error: error?.message })
        
        if (error) {
          setEmailMessage('Error: ' + (error.message || 'Sign up failed'))
        } else if (data?.user) {
          if (data?.session) {
            // Direct login worked
            console.log('[AuthButton] Sign up successful with immediate session!')
            setShowEmailForm(false)
            setEmail('')
            setPassword('')
            setIsSignUp(false)
          } else {
            // Email verification required
            setEmailMessage('Signup successful! Check your email to confirm your account.')
            setTimeout(() => {
              setShowEmailForm(false)
              setEmail('')
              setPassword('')
              setIsSignUp(false)
              setEmailMessage('')
            }, 3000)
          }
        }
      } else {
        // For signin, try password auth
        console.log('[AuthButton] Attempting sign in with email:', email)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        console.log('[AuthButton] Sign in response:', { data, error: error?.message })
        
        if (error?.status === 400 || error?.message?.includes('Invalid login') || (error?.message || '').toLowerCase().includes('invalid')) {
          // User doesn't exist, try sign up
          console.log('[AuthButton] User not found, attempting sign up...')
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
          })
          console.log('[AuthButton] Sign up response:', { signUpData, signUpError: signUpError?.message })
          
          if (signUpError) {
            // If the user already exists (e.g. created via OAuth), show a helpful message
            if (String(signUpError.message).toLowerCase().includes('already')) {
              setEmailMessage('An account already exists for this email. Use Google sign-in or reset your password.')
            } else {
              setEmailMessage('Error: ' + (signUpError.message || 'Could not create account'))
            }
          } else if (signUpData?.user) {
            if (signUpData?.session) {
              console.log('[AuthButton] Auto signup successful!')
              setShowEmailForm(false)
              setEmail('')
              setPassword('')
            } else {
              setEmailMessage('Account created! Check your email to verify.')
              setTimeout(() => {
                setShowEmailForm(false)
                setEmail('')
                setPassword('')
                setEmailMessage('')
              }, 3000)
            }
          }
        } else if (error) {
          // If sign-in failed because the account exists but has no password (created via OAuth)
          if (String(error.message).toLowerCase().includes('password') || String(error.message).toLowerCase().includes('invalid')) {
            setEmailMessage('Sign in failed. If you registered with Google, use Google sign-in or reset your password.')
          } else {
            setEmailMessage('Error: ' + (error.message || 'Sign in failed'))
          }
        } else if (data?.session) {
          console.log('[AuthButton] Sign in successful!')
          setShowEmailForm(false)
          setEmail('')
          setPassword('')
        }
      }
    } catch (err: any) {
      console.error('[AuthButton] Email auth catch error:', err)
      setEmailMessage('Error: ' + (err.message || 'An unexpected error occurred'))
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      if (!SUPABASE_CONFIGURED) {
        console.error('[AuthButton] Supabase not configured')
        alert('Supabase not configured.\n\nTo enable Google OAuth:\n1. Create a Supabase project at supabase.com\n2. Add credentials to .env.local\n3. Configure Google OAuth in Supabase console\n\nFor now, use Email or Demo account to test.')
        setLoading(false)
        return
      }
      console.log('[AuthButton] Starting Google OAuth...')
      const res = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
      console.log('[AuthButton] OAuth response:', res)
      if (res?.error) {
        console.error('[AuthButton] OAuth error:', res.error)
        alert('Google sign-in not available.\n\nError: ' + (res.error.message || String(res.error)) + '\n\nTry Email or Demo account instead.')
      }
    } catch (err: any) {
      console.error('[AuthButton] Google OAuth catch error:', err)
      alert('Google sign-in failed: ' + (err.message || 'Network error. Try Email or Demo account.'))
    } finally {
      setLoading(false)
    }
  }

  const signInDemo = async () => {
    setLoading(true)
    try {
      console.log('[AuthButton] Starting demo sign-in...')
      await supabase.auth.signInMock()
      console.log('[AuthButton] Demo sign-in successful!')
    } catch (err) {
      console.error('[AuthButton] Demo sign-in error:', err)
      alert('Unexpected demo sign-in error')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error(err)
      alert('Sign out failed')
    } finally {
      setLoading(false)
    }
  }

  const sendPasswordReset = async () => {
    if (!email) {
      setEmailMessage('Please enter your email to reset password')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
      console.log('[AuthButton] Reset password response:', { data, error })
      if (error) {
        setEmailMessage('Error sending reset email: ' + (error.message || 'Unknown error'))
      } else {
        setEmailMessage('Password reset email sent. Check your inbox.')
      }
    } catch (err: any) {
      console.error('[AuthButton] Reset password catch:', err)
      setEmailMessage('Error sending reset email')
    } finally {
      setLoading(false)
    }
  }

  return session ? (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-700">{session.user.email}</div>
      <button onClick={signOut} disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded">{loading? 'Signing out...': 'Sign out'}</button>
    </div>
  ) : showEmailForm ? (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="max-w-sm w-full card">
        <h2 className="text-lg font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'} with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={loading}
        />
        {emailMessage && (
          <div className={`p-2 rounded mb-3 text-sm ${emailMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {emailMessage}
          </div>
        )}
        <button
          onClick={signInWithEmail}
          disabled={loading}
          className="w-full btn-primary mb-2 disabled:opacity-60"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        {!isSignUp && (
          <button
            onClick={sendPasswordReset}
            disabled={loading}
            className="w-full text-sm text-blue-700 underline mb-2"
          >
            Forgot password?
          </button>
        )}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setEmailMessage(''); }}
          disabled={loading}
          className="w-full p-2 text-sm text-gray-600 mb-2"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        <button
          onClick={() => { setShowEmailForm(false); setEmail(''); setPassword(''); setEmailMessage(''); }}
          disabled={loading}
          className="w-full p-2 bg-gray-200 text-gray-700 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <button onClick={() => setShowEmailForm(true)} disabled={loading} className="btn-primary">
        {loading ? 'Loading...' : 'Sign in with Email'}
      </button>
      <button onClick={signInWithGoogle} disabled={loading} className="btn-accent">
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {!SUPABASE_CONFIGURED && (
        <button onClick={signInDemo} disabled={loading} className="btn-primary">
          {loading ? 'Signing in...' : 'Use demo account'}
        </button>
      )}
    </div>
  )
}
