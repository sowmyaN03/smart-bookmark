import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Smart Bookmark App'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{const t=localStorage.getItem('theme'); if(t==='dark') document.documentElement.classList.add('dark');}catch(e){} })()`}} />
        <div className="min-h-screen flex items-start justify-center py-12 px-4">
          <div className="max-w-3xl w-full app-container">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
