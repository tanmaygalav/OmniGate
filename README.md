# OmniGate 🚀

OmniGate is an enterprise-grade, serverless API Gateway built with Next.js 15. It provides ultra-low latency request proxying, secure API key management, robust Redis-backed rate limiting, and real-time analytics telemetry—all managed through a premium, highly responsive dashboard.

## ✨ Core Features

- **⚡ Edge Routing & Proxying:** Blazing fast request forwarding utilizing Vercel's Edge and optimized Node.js runtimes for minimal geographic latency.
- **🔐 API Key Management:** Generate, track, and permanently revoke secure API keys. Data is securely stored and indexed using Supabase.
- **🛡️ Global Rate Limiting:** Prevent abuse with highly accurate sliding-window rate limiting powered by Upstash Redis.
- **📊 Real-time Analytics:** Asynchronous, non-blocking telemetry securely logs latency, status codes, and traffic data into Tinybird without slowing down user requests.
- **🎨 Premium Dashboard UI:** A frictionless developer experience featuring instant optimistic UI updates, Next.js route prefetching, Framer Motion page transitions, and stacking toast notifications (Sonner).

## 🏗️ Architecture Flow

1. **Client Request:** User hits the OmniGate proxy URL with their Bearer token (`/v1/[projectId]`).
2. **Authentication & Validation:** OmniGate hashes the token and verifies it against the Supabase database.
3. **Rate Limiting:** Upstash Redis checks the sliding window constraints. If exceeded, a `429 Too Many Requests` is instantly returned.
4. **Proxy Forwarding:** If valid, the request is forwarded to the destination Backend/Target URL.
5. **Asynchronous Telemetry:** The proxy returns the response to the user while concurrently awaiting a background fetch to log the traffic metrics into Tinybird.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Deployment:** [Vercel](https://vercel.com/) (Serverless & Edge Functions)
- **Database / Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Rate Limiting:** [Upstash](https://upstash.com/) (Serverless Redis)
- **Analytics Ingestion:** [Tinybird](https://tinybird.co/) (ClickHouse)
- **Styling & UI:** Tailwind CSS, Lucide Icons, Recharts, Framer Motion, Sonner
