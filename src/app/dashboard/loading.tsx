import { Server, LogOut, Plus } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header (Static so it doesn't blink) */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </div>
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 hidden md:block"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-8 space-y-12 animate-pulse">
        {/* Create Project Skeleton */}
        <section className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-100 border border-gray-200 rounded-md w-full"></div>
            </div>
            <div className="flex-1 w-full space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-10 bg-gray-100 border border-gray-200 rounded-md w-full"></div>
            </div>
            <div className="h-[42px] bg-gray-300 rounded-md w-28"></div>
          </div>
        </section>

        {/* Project List Skeleton */}
        <section>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl border shadow-sm h-[180px] flex flex-col justify-between">
                <div className="flex justify-between items-center">
                   <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                   <div className="h-8 bg-gray-100 rounded w-8"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-50 rounded border border-gray-100 w-full"></div>
                  <div className="h-8 bg-blue-50 rounded border border-blue-100 w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}