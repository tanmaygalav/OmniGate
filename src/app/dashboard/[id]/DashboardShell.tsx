'use client'

import { ReactNode } from 'react'

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-deep-night relative overflow-hidden font-sans text-silver-whisper">
      {/* The "Golden Horizon" Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-golden-horizon rounded-full mix-blend-screen filter blur-[140px] opacity-[0.05] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-glow rounded-full mix-blend-screen filter blur-[120px] opacity-[0.03] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-24">
        {children}
      </div>
    </div>
  )
}