import { Server } from 'lucide-react'
import DashboardShell from './[id]/DashboardShell'

export default function DashboardLoading() {
  return (
    <DashboardShell>
      {/* Ghost Navbar (Static so it matches the loaded state exactly) */}
      <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-glow/10 border border-amber-glow/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-amber-glow/60" />
          </div>
          <h1 className="text-[18px] font-bold tracking-[0.14px] text-cloud-white">OmniGate</h1>
        </div>
        
        {/* Nav right side pulsing */}
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-32 hidden md:block"></div>
          <div className="h-8 bg-white/5 rounded-buttons w-24"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-16 animate-pulse">
        
        {/* Header Text Skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-12 bg-white/10 rounded w-64 md:w-96"></div>
          <div className="h-4 bg-white/5 rounded w-full max-w-xl"></div>
          <div className="h-4 bg-white/5 rounded w-2/3 max-w-md"></div>
        </div>

        {/* Creation Panel Skeleton */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-cards shadow-floating p-6 md:p-8">
          <div className="h-5 bg-white/10 rounded w-48 mb-6"></div>
          
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="h-3 bg-white/5 rounded w-24"></div>
              <div className="h-[42px] bg-deep-night/50 border border-white/5 rounded-md w-full"></div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-2">
              <div className="h-3 bg-white/5 rounded w-32"></div>
              <div className="h-[42px] bg-deep-night/50 border border-white/5 rounded-md w-full"></div>
            </div>
            
            <div className="h-[42px] bg-white/5 border border-white/10 rounded-buttons w-full md:w-32 shrink-0"></div>
          </div>
        </div>

        {/* Project Grid Skeleton */}
        <div>
          <div className="h-4 bg-white/10 rounded w-40 mb-6 flex items-center gap-2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-graphite border border-white/5 rounded-cards shadow-floating flex flex-col overflow-hidden">
                
                {/* Card Header Skeleton */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-deep-night/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded w-24"></div>
                      <div className="h-2 bg-white/5 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-buttons bg-white/5"></div>
                </div>

                {/* Card Body Skeleton */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="h-2 bg-white/5 rounded w-20"></div>
                    <div className="h-9 bg-deep-night rounded-md border border-white/5"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 bg-amber-glow/20 rounded w-24"></div>
                    <div className="h-9 bg-amber-glow/5 rounded-md border border-amber-glow/10"></div>
                  </div>
                </div>

                {/* Card Footer Skeleton */}
                <div className="p-2 bg-deep-night/50 border-t border-white/5">
                  <div className="h-9 w-full bg-white/5 rounded-buttons"></div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardShell>
  )
}