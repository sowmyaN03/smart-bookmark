import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

let supabase: any

if (!SUPABASE_CONFIGURED) {
  console.warn('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')

  const supabaseStub = {
    auth: (() => {
      let session: any = null
      const listeners = new Set<any>()
      return {
        getSession: async () => ({ data: { session } }),
        onAuthStateChange: (cb: any) => {
          listeners.add(cb)
          return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } }
        },
        signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
        signInWithPassword: async (credentials: any) => {
          if (!credentials.email || !credentials.password) {
            return { data: null, error: new Error('Email and password required') }
          }
          session = { user: { id: Math.random().toString(36).substr(2, 9), email: credentials.email } }
          listeners.forEach((cb: any) => cb('SIGNED_IN', { session }))
          return { data: { session }, error: null }
        },
        signUp: async (credentials: any) => {
          if (!credentials.email || !credentials.password) {
            return { data: null, error: new Error('Email and password required') }
          }
          session = { user: { id: Math.random().toString(36).substr(2, 9), email: credentials.email } }
          listeners.forEach((cb: any) => cb('SIGNED_IN', { session }))
          return { data: { session }, error: null }
        },
        signOut: async () => {
          session = null
          listeners.forEach((cb: any) => cb('SIGNED_OUT', { session: null }))
          return { error: null }
        },
        signInMock: async () => {
          session = { user: { id: '00000000-0000-0000-0000-000000000000', email: 'demo@example.com' } }
          listeners.forEach((cb: any) => cb('SIGNED_IN', { session }))
          return { data: { session } }
        },
        signOutMock: async () => {
          session = null
          listeners.forEach((cb: any) => cb('SIGNED_OUT', { session: null }))
          return { data: { session: null } }
        },
      }
    })(),
    from: () => {
      let demoBookmarks: any[] = []
      const query = {
        select: (cols?: string) => ({
          eq: (col: string, val: any) => ({
            order: (sortCol: string, opts?: any) => ({
              data: demoBookmarks,
              error: null,
            }),
          }),
          order: (sortCol: string, opts?: any) => ({
            data: demoBookmarks,
            error: null,
          }),
        }),
      }
      return {
        select: (cols?: string) => query.select(cols),
        insert: async (items: any) => {
          const newItems = Array.isArray(items) ? items : [items]
          demoBookmarks = [
            ...newItems.map((item: any) => ({
              ...item,
              id: Math.random().toString(36).substr(2, 9),
              inserted_at: new Date().toISOString(),
            })),
            ...demoBookmarks,
          ]
          return { data: newItems, error: null }
        },
        delete: () => ({
          eq: (col: string, val: any) => ({
            eq: async () => ({ data: null, error: null }),
          }),
        }),
      }
    },
    channel: () => {
      const ch: any = {
        on: () => ch,  // Return self for method chaining
        subscribe: async () => ({ subscription: { unsubscribe: () => {} } }),
        unsubscribe: () => {},
      }
      return ch
    },
  }

  supabase = supabaseStub
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export default supabase
