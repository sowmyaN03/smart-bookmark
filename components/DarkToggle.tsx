"use client"

import React, { useEffect, useState } from 'react'

export default function DarkToggle() {
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = saved ? saved === 'dark' : prefersDark
      setDark(isDark)
      if (isDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch (e) {
      // ignore
    }
  }, [])

  const toggle = () => {
    try {
      const next = !dark
      setDark(next)
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="px-3 py-1 rounded bg-white/70 text-sm" style={{backdropFilter: 'blur(6px)'}}>
      {dark ? '🌙 Dark' : '🌤️ Light'}
    </button>
  )
}
