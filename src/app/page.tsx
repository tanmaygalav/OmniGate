import Link from 'next/link';
import { ArrowRight, Shield, Zap, BarChart3, Globe, Server } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-black" />
            <span className="text-xl font-bold tracking-tight">OmniGate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            v1.0 is now live
          </div> */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
            Enterprise API Gateway <br className="hidden md:block" />
            <span className="text-gray-400">built for the Edge.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Secure, route, and analyze your API traffic with zero latency. OmniGate provides dynamic routing, cryptographic key validation, and distributed rate limiting right at the edge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all active:scale-95"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com" 
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black border border-gray-200 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all active:scale-95"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Everything you need to scale</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Replace fragmented infrastructure with a single, unified data plane designed for modern SaaS applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dynamic Routing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Multi-tenant proxying that instantly resolves target URLs and dynamically routes traffic without hardcoded endpoints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Edge Rate Limiting</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Powered by Upstash Redis, enforce strict, customizable rate limits globally before requests ever hit your backend.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Zero-Trust Security</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Cryptographically hashed API keys ensure your infrastructure remains secure, even if databases are compromised.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Real-Time Telemetry</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Asynchronous background logging via Tinybird gives your users sub-second visibility into their API usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Server className="w-5 h-5" />
            OmniGate
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} OmniGate. Built for modern APIs.
          </p>
        </div>
      </footer>
    </div>
  );
}