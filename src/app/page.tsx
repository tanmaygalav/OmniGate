'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Zap, BarChart3, Globe, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-deep-night text-silver-whisper relative overflow-hidden font-sans selection:bg-amber-glow/30 selection:text-cloud-white">
      
      {/* The Ambient "Golden Horizon" Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-golden-horizon rounded-full mix-blend-screen filter blur-[140px] opacity-[0.05] animate-pulse pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-amber-glow rounded-full mix-blend-screen filter blur-[120px] opacity-[0.03] pointer-events-none" />

      {/* Navigation - Frosted Glass Bar */}
      <nav className="relative z-10 border-b border-white/5 bg-deep-night/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-amber-glow/10 border border-amber-glow/20 flex items-center justify-center group-hover:bg-amber-glow/20 transition-colors">
              <Server className="w-4 h-4 text-amber-glow" />
            </div>
            <span className="text-[18px] font-bold tracking-[0.14px] text-cloud-white">OmniGate</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[14px] font-semibold text-silver-whisper hover:text-cloud-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-5 py-2.5 text-[14px] font-semibold text-cloud-white bg-transparent border border-amber-glow rounded-buttons hover:bg-amber-glow/10 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(242,185,139,0.15)] hover:shadow-[0_0_25px_rgba(242,185,139,0.25)]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[56px] md:text-[80px] font-black text-cloud-white leading-[1.1] tracking-[0.67px] uppercase font-mono"
          >
            Enterprise API Gateway <br className="hidden md:block" />
            <span className="text-amber-glow/80 mix-blend-plus-lighter">built for the Edge.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-[16px] md:text-[18px] text-warm-mist max-w-2xl mx-auto leading-[1.69]"
          >
            Secure, route, and analyze your API traffic with zero latency. OmniGate provides dynamic routing, cryptographic key validation, and distributed rate limiting right at the edge.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-glow/10 border border-amber-glow text-cloud-white px-8 py-4 rounded-buttons text-[16px] font-semibold hover:bg-amber-glow/20 transition-all shadow-[0_0_20px_rgba(242,185,139,0.15)] hover:shadow-[0_0_30px_rgba(242,185,139,0.25)]"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com/tanmaygalav/OmniGate" 
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 text-cloud-white border border-white/10 px-8 py-4 rounded-buttons text-[16px] font-semibold hover:bg-white/10 transition-all"
            >
              View Documentation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-deep-night/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-[32px] md:text-[48px] font-bold text-cloud-white mb-4 tracking-[0.14px]">
              Everything you need to scale
            </h2>
            <p className="text-warm-mist max-w-xl mx-auto text-[16px] leading-[1.69]">
              Replace fragmented infrastructure with a single, unified data plane designed for modern distributed applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: "Dynamic Routing",
                desc: "Multi-tenant proxying that instantly resolves target URLs and dynamically routes traffic without hardcoded endpoints.",
                delay: 0.1
              },
              {
                icon: Zap,
                title: "Edge Rate Limiting",
                desc: "Powered by Upstash Redis, enforce strict, customizable rate limits globally before requests ever hit your backend.",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Zero-Trust Security",
                desc: "Cryptographically hashed API keys ensure your infrastructure remains secure, even if databases are compromised.",
                delay: 0.3
              },
              {
                icon: BarChart3,
                title: "Real-Time Telemetry",
                desc: "Asynchronous background logging via Tinybird gives your users sub-second visibility into their API usage.",
                delay: 0.4
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-cards border border-white/5 shadow-floating hover:border-white/10 hover:bg-white/[0.03] transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/5 text-amber-glow rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold text-cloud-white mb-3 tracking-[0.14px]">{feature.title}</h3>
                <p className="text-warm-mist text-[14px] leading-[1.69]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-deep-night py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-cloud-white font-bold tracking-[0.14px]">
            <Server className="w-4 h-4 text-amber-glow" />
            OmniGate
          </div>
          <div className="flex items-center gap-6 text-[12px] font-semibold uppercase tracking-[1px] text-warm-mist">
            <Link href="https://github.com/tanmaygalav/OmniGate" className="hover:text-amber-glow transition-colors">GitHub</Link>
            <Link href="/login" className="hover:text-amber-glow transition-colors">Login</Link>
          </div>
          <p className="text-[12px] text-ash-gray font-mono">
            © {new Date().getFullYear()} OMNIGATE. Edge Infrastructure.
          </p>
        </div>
      </footer>
    </div>
  );
}