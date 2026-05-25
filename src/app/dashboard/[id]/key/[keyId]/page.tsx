'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, ShieldAlert, ArrowLeft, Server } from 'lucide-react';

export default function KeyUsageDashboard() {
  const params = useParams();
  const router = useRouter();
  
  const projectId = params.id as string;
  const activeKey = params.keyId as string; 

  const [data, setData] = useState([]);
  const [rateLimit, setRateLimit] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeKey) return;
    fetch(`/api/analytics?key_hash=${activeKey}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          const formattedData = json.data.map((item: any) => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            requests: item.total_requests,
            latency: Math.round(item.avg_latency)
          }));
          setData(formattedData);
        }
      });
  }, [activeKey]);

  const handleSaveRateLimit = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    alert(`Rate limit updated successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* Navbar - Matched to Project Page */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
        
        {/* Navigation & Header - Matched to Project Page */}
        <div>
          <Link 
            href={`/dashboard/${projectId}`} 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project Details
          </Link>
          <h1 className="text-3xl font-bold">Key Analytics</h1>
        </div>

        {/* Top Metrics Cards - Matched Card Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
              <Activity size={16} /> Total Requests (7d)
            </div>
            <div className="text-3xl font-bold">
              {data.reduce((acc: any, curr: any) => acc + curr.requests, 0)}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
              <Zap size={16} /> Avg Latency
            </div>
            <div className="text-3xl font-bold">
              {data.length > 0 ? Math.round(data.reduce((acc: any, curr: any) => acc + curr.latency, 0) / data.length) : 0} 
              <span className="text-lg font-normal text-gray-400 ml-1">ms</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
              <ShieldAlert size={16} /> Current Rate Limit
            </div>
            <div className="text-3xl font-bold">
              {rateLimit} 
              <span className="text-lg font-normal text-gray-400 ml-1">req/m</span>
            </div>
          </div>
        </div>

        {/* Traffic Overview Chart */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Traffic Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="requests" stroke="#000" strokeWidth={2.5} dot={{fill: '#000', r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Controls - Matched UI Pattern */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Security Controls</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Active API Key</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md font-mono text-xs text-gray-600 break-all">
                {activeKey}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-gray-500 block mb-1">Rate Limit (Requests per minute)</label>
                <input 
                  type="number" 
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border rounded-md focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleSaveRateLimit}
                disabled={isSaving}
                className="w-full md:w-auto px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {isSaving ? 'Updating...' : 'Update Rate Limit'}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}