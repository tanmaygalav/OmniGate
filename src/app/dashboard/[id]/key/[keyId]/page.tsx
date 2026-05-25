'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, ShieldAlert, ArrowLeft, Server, CheckCircle2, AlertCircle } from 'lucide-react';
// Import the new fetcher we just made
import { updateRateLimit, getKeyAndProjectDetails } from '../../actions';

export default function KeyUsageDashboard() {
  const params = useParams();
  const router = useRouter();
  
  const projectId = params.id as string;
  const keyId = params.keyId as string; 

  const [data, setData] = useState([]);
  const [rateLimit, setRateLimit] = useState(100); // Temporary initial state
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (!keyId || !projectId) return;

    // 1. Fetch the REAL data from Supabase first
    getKeyAndProjectDetails(keyId, projectId).then((details) => {
      
      // Update the UI with the actual limit from the database (fixes the 100 bug)
      if (details.rateLimit) {
        setRateLimit(details.rateLimit);
      }

      // 2. Fetch from Tinybird using the CORRECT secure hash (fixes the empty chart bug)
      if (details.keyHash) {
        fetch(`/api/analytics?key_hash=${details.keyHash}`)
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
      }
    });
  }, [keyId, projectId]);

  const handleSaveRateLimit = async () => {
    setIsSaving(true);
    setNotification(null);
    
    try {
      const result = await updateRateLimit(projectId, rateLimit);
      if (result.success) {
        setNotification({ message: `Rate limit updated to ${rateLimit} RPM`, type: 'success' });
      } else {
        setNotification({ message: `Failed: ${result.error}`, type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'A network error occurred.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
          <Server className="w-6 h-6 text-black" />
          <h1 className="text-xl font-bold">OmniGate</h1>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
        <div>
          <Link 
            href={`/dashboard/${projectId}`} 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project Details
          </Link>
          <h1 className="text-3xl font-bold">Key Analytics</h1>
        </div>

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

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Security Controls</h2>
          
          <div className="space-y-4">
            <div>
              {/* Note: Updated label to reflect this is the Database ID, not the Key itself */}
              <label className="text-sm font-medium text-gray-500 block mb-1">API Key Database ID</label>
              <div className="px-3 py-2 bg-gray-50 border rounded-md font-mono text-xs text-gray-600 break-all">
                {keyId}
              </div>
            </div>

            <div>
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

              {notification && (
                <div className={`mt-4 p-3 text-sm font-medium rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {notification.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}