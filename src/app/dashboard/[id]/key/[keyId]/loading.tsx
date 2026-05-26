import { Server, ArrowLeft, Activity, Zap, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Project Details
          </div>
          <div className="h-8 bg-gray-200 rounded-md w-48 mb-2"></div>
        </div>

        {/* Top Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-4">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-md w-16"></div>
            </div>
          ))}
        </div>

        {/* Main Chart Skeleton */}
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[380px] flex flex-col">
          <div className="h-6 bg-gray-200 rounded-md w-32 mb-6"></div>
          <div className="flex-1 bg-gray-100 rounded-lg"></div>
        </div>
        
        {/* Controls Skeleton */}
        <div className="bg-white p-6 rounded-xl border shadow-sm h-[200px]">
           <div className="h-6 bg-gray-200 rounded-md w-40 mb-6"></div>
           <div className="space-y-4">
             <div className="h-4 bg-gray-200 rounded w-32"></div>
             <div className="h-10 bg-gray-100 rounded-md w-full"></div>
           </div>
        </div>
      </main>
    </div>
  );
}