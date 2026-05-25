# OmniGate

OmniGate is an enterprise-grade, edge-first API Gateway designed for modern SaaS applications. It provides a unified data plane to secure, route, analyze, and control API traffic with near-zero latency.

## Key Features

### 🌍 Dynamic Multi-Tenant Routing
- **Universal Gateway:** Proxy requests to any backend URL (OpenAI, custom microservices, third-party APIs).
- **Path-Based Routing:** Seamlessly appends request paths and query parameters to the target destination.

### ⚡ Edge-First Performance
- **Global Deployment:** Built using Next.js Edge Runtime, ensuring the proxy runs closer to the user for minimal latency.
- **Asynchronous Telemetry:** Logs analytics to [Tinybird](https://www.tinybird.co/) in the background, ensuring logging never impacts API response times.

### 🛡️ Robust Security & Controls
- **Cryptographic Auth:** Uses SHA-256 hashed API keys stored securely in [Supabase](https://supabase.com/), ensuring no raw keys are ever compromised at rest.
- **Edge Rate Limiting:** Powered by [Upstash Redis](https://upstash.com/), enforcing strict requests-per-minute limits globally before requests reach your backend.

### 📊 Professional Developer Portal
- **Key Management:** Generate, track, and revoke API keys with fine-grained security controls.
- **Real-Time Analytics:** Visualize traffic, request counts, and average latency through an intuitive dashboard powered by Recharts.

## Specialities

- **Developer Experience (DX):** Built with Next.js 15 Server Actions, providing a secure and type-safe backend integration.
- **Production-Ready:** Includes CORS preflight support, standard RateLimit headers, and automated cache revalidation for a seamless UI experience.
- **Scalability:** The architecture decouples telemetry, storage, and proxying, allowing each layer to scale independently as your API grows.

---

*Built with Next.js, Supabase, Upstash Redis, and Tinybird.*
