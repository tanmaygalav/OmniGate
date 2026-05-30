'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, ShieldAlert, ArrowLeft, Server, CheckCircle2, AlertCircle, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// Import your server actions
import { updateRateLimit, getKeyAndProjectDetails } from '../../actions';
// Import the shell
import DashboardShell from '../../DashboardShell'; 

export default function KeyUsageDashboard() {
  const params = useParams();
  const router = useRouter();
  
  const projectId = params.id as string;
  const keyId = params.keyId as string; 

  const [data, setData] = useState<any[]>([]);
  const [rateLimit, setRateLimit] = useState(100); 
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (!keyId || !projectId) return;

    getKeyAndProjectDetails(keyId, projectId).then((details) => {
      if (details.rateLimit) {
        setRateLimit(details.rateLimit);
      }

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
    <DashboardShell>
      {/* Ghost Navbar */}
      <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-silver-whisper hover:text-cloud-white transition-colors">
          <Server className="w-5 h-5 text-amber-glow/60" /> {/* Dimmed brand icon */}
          <h1 className="text-[18px] font-bold tracking-[0.14px] text-cloud-white">OmniGate</h1>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href={`/dashboard/${projectId}`} 
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[1px] font-semibold text-warm-mist hover:text-silver-whisper mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Edge Control
          </Link>
          <h1 className="text-[48px] md:text-[64px] font-black text-cloud-white leading-[1] tracking-[0.67px] uppercase font-mono flex items-center gap-4">
            <Activity className="w-10 h-10 md:w-12 md:h-12 text-amber-glow/40" /> Telemetry {/* Toned down icon opacity */}
          </h1>
        </motion.div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Requests Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-cards border border-white/5 shadow-floating flex flex-col justify-between"
          >
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-silver-whisper" /> Total Requests (7d)
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[48px] font-mono font-bold text-cloud-white leading-none">
                {data.reduce((acc: any, curr: any) => acc + curr.requests, 0)}
              </span>
            </div>
          </motion.div>

          {/* Avg Latency Card (Subdued Accent) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-amber-glow/[0.01] backdrop-blur-xl p-6 rounded-cards border border-amber-glow/10 shadow-[0_0_15px_rgba(242,185,139,0.02)] flex flex-col justify-between relative overflow-hidden"
          > {/* Dropped background opacity, border line alpha, and shadow spread */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-glow/[0.03] blur-3xl rounded-full pointer-events-none" />
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-amber-glow/60 flex items-center gap-2 relative z-10">
              <Zap className="w-3.5 h-3.5" /> Avg Latency
            </span>
            <div className="mt-4 flex items-baseline gap-2 relative z-10">
              <span className="text-[48px] font-mono font-bold text-cloud-white leading-none">
                {data.length > 0 ? Math.round(data.reduce((acc: any, curr: any) => acc + curr.latency, 0) / data.length) : 0} 
              </span>
              <span className="text-[14px] text-amber-glow/40 font-mono">ms</span>
            </div>
          </motion.div>

          {/* Rate Limit Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/[0.02] backdrop-blur-xl p-6 rounded-cards border border-white/5 shadow-floating flex flex-col justify-between"
          >
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-silver-whisper" /> Current Rate Limit
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[48px] font-mono font-bold text-cloud-white leading-none">{rateLimit}</span>
              <span className="text-[14px] text-warm-mist font-mono">req/m</span>
            </div>
          </motion.div>

        </div>

        {/* Chart Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-graphite border border-white/5 rounded-cards shadow-floating p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-cloud-white tracking-[0.14px]">Traffic Overview</h3>
            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-badges text-[10px] uppercase tracking-[1px] text-silver-whisper">
              Trailing 7 Days
            </span>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
                <XAxis dataKey="date" stroke="#868f97" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#868f97" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => (value === 0 ? '0' : value)} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141416', border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px', color: '#fefef7', fontSize: '12px', boxShadow: '0 8px 22px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ color: 'rgba(242, 185, 139, 0.8)' }}
                  cursor={{ stroke: 'rgba(242, 185, 139, 0.08)', strokeWidth: 1.5 }}
                />
                <Line 
                  type="monotone" dataKey="requests" stroke="rgba(242, 185, 139, 0.75)" strokeWidth={2} // Slimmer, slightly transparent line
                  dot={{ fill: '#0f0f10', stroke: 'rgba(242, 185, 139, 0.6)', strokeWidth: 1.5, r: 3.5 }}
                  activeDot={{ fill: '#f2b98b', stroke: '#0f0f10', strokeWidth: 2, r: 5 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Security Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-cards shadow-floating p-6 md:p-8"
        >
          <h2 className="text-[18px] font-bold text-cloud-white tracking-[0.14px] mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-glow/40" /> Security Controls
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist block mb-2">API Key Database ID</label>
              <div className="px-4 py-2.5 bg-deep-night/50 border border-white/5 rounded-md font-mono text-[13px] text-silver-whisper break-all selection:bg-amber-glow/20">
                {keyId}
              </div>
            </div>

            <div>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist">Rate Limit (Requests per minute)</label>
                  <input 
                    type="number" 
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full bg-deep-night border border-white/10 rounded-md px-4 py-2.5 text-[14px] text-cloud-white outline-none focus:border-amber-glow/40 transition-all"
                  />
                </div>
                <button 
                  onClick={handleSaveRateLimit}
                  disabled={isSaving}
                  className="w-full md:w-auto px-6 py-2.5 text-[14px] font-semibold text-cloud-white bg-transparent border border-white/10 rounded-buttons hover:bg-white/5 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
                > {/* Removed amber borders from execution action to keep it fully minimalist */}
                  {isSaving ? 'Updating...' : <><Shield className="w-4 h-4 text-warm-mist" /> Enforce Limit</>}
                </button>
              </div>

              {/* Dark Mode Themed Notifications */}
              {notification && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 text-[13px] font-medium rounded-md flex items-center gap-3 border ${
                    notification.type === 'success' 
                      ? 'bg-green-900/10 text-green-400 border-green-500/20' 
                      : 'bg-red-900/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {notification.message}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </DashboardShell>
  );
}