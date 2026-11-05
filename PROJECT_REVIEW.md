# 🔍 TheViralFindsMY — Project Review & Security Audit
> **Version:** 10.0 | **Date:** July 2025 | **Reviewer:** Code Review Agent
> **Total LOC:** ~4,300+ lines | **Tech Stack:** Next.js 16 + React 19 + Prisma + SQLite + Tailwind v4 + shadcn/ui

---

## 📊 Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **CRITICAL** | 5 | Security vulnerabilities, compilation bugs, data integrity risks |
| 🟠 **HIGH** | 7 | Architecture flaws, production-readiness gaps, SEO issues |
| 🟡 **MEDIUM** | 10 | Code quality, maintainability, performance concerns |
| 🟢 **LOW** | 6 | Nice-to-have, cleanup, minor UX improvements |

**Overall Health Score: 6.5/10** — Functional but has critical security and architecture issues that must be addressed before production deployment.

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### C1: `checkRateLimit` Import Bug — Compilation Failure Hidden
**File:** `src/lib/rate-limit-enforce.ts:21`  
**Severity:** 🔴 CRITICAL

```typescript
import { checkRateLimit, RATE_LIMITS, type RateLimitResult } from './rate-limit'
// ...
const result: RateLimitResult = checkRateLimit(req, preset.limit, preset.windowMs)
```

**Problem:** `rate-limit.ts` only exports `rateLimit`, `getClientIdentifier`, and `RateLimitResult`. There is **no `checkRateLimit` export**. This would be a TypeScript compilation error.

**Why it compiles:** `next.config.ts:7` has `ignoreBuildErrors: true` which **hides the error**.

**Impact:** Rate limiting is completely broken. Every API endpoint that calls `enforceRateLimit()` is actually throwing an unhandled runtime error.

**Fix:**
```typescript
// Option A: rename the import
import { rateLimit as checkRateLimit } from './rate-limit'

// Option B: fix the export name in rate-limit.ts
export { rateLimit as checkRateLimit }
```

Then remove `ignoreBuildErrors: true` from `next.config.ts`.

---

### C2: Hardcoded `NEXTAUTH_SECRET` Fallback — Authentication Bypass
**File:** `src/lib/auth.ts:41` | `src/middleware.ts:5`  
**Severity:** 🔴 CRITICAL

```typescript
secret: process.env.NEXTAUTH_SECRET || 'theviralfindsmy-secret-key-2025'
```

```typescript
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || 'theviralfindsmy-secret-key-2025'
```

**Problem:** If `NEXTAUTH_SECRET` is not set in production, the JWT signing secret is a **publicly known hardcoded string**. Anyone can forge JWTs and impersonate any user, including admin.

**Impact:** Complete authentication bypass. Any user can craft a valid JWT and access protected API routes.

**Fix:** Remove the fallback entirely. The app should **crash on startup** if `NEXTAUTH_SECRET` is missing:
```typescript
const secret = process.env.NEXTAUTH_SECRET
if (!secret) throw new Error('NEXTAUTH_SECRET is required')
```

---

### C3: Hardcoded Demo Credentials — Backdoor Account
**File:** `src/lib/auth.ts:10-11`  
**Severity:** 🔴 CRITICAL

```typescript
const DEMO_EMAIL = 'demo@theviralfindsmy.com'
const DEMO_PASSWORD = 'demo123'
```

**Problem:** Demo credentials are hardcoded in source code. The `ensureDemoUser()` function auto-creates this account if no users exist. Even worse, if a user tries to login with `demo@theviralfindsmy.com` and the account doesn't exist, it's **auto-created on the fly**.

**Impact:** Anyone can create/login to the demo account at any time, gaining access to all features including admin capabilities if role is not properly restricted.

**Fix:**
1. Remove auto-creation logic entirely
2. Use environment variables for demo credentials: `DEMO_EMAIL` and `DEMO_PASSWORD_HASH`
3. Only create demo user in `db:seed` script, not in auth flow

---

### C4: No CSRF Protection on State-Changing API Routes
**Files:** All POST/PATCH/DELETE API routes  
**Severity:** 🔴 CRITICAL

**Problem:** No CSRF token validation on any mutation endpoint. All API routes accept POST requests from any origin.

**Impact:** Cross-site request forgery attacks. A malicious site could trick an authenticated user into performing actions (creating links, deleting campaigns, changing settings) without their knowledge.

**Fix:**
1. Implement CSRF token generation in NextAuth.js session
2. Add `X-CSRF-Token` header validation on all POST/PATCH/DELETE routes
3. Or use `SameSite=Strict` cookies (already handled by NextAuth.js by default)

---

### C5: Webhook Payload Not Sanitized — Injection Risk
**File:** `src/app/api/shopee/webhook/route.ts:65-81`  
**Severity:** 🔴 CRITICAL

```typescript
const { order_sn, item_id, item_name, commission, commission_rate } = payload.data
// ...
await db.conversion.create({
  data: {
    orderId: order_sn,
    amount: commission_rate,
    commission: commission,
    // ...
  }
})
```

**Problem:** Webhook payload data is used directly in Prisma queries without validation. While Prisma is parameterized, the `item_id` is used in a `.toString()` call and `item_name` is used in a notification description string.

**Impact:** If webhook verification is bypassed or the secret is compromised, malicious payloads could cause unexpected behavior. The `item_name` is used in a notification string that could be an XSS vector if rendered without escaping.

**Fix:** Validate all webhook payload fields with Zod before processing. Sanitize `item_name` before storing in notification description.

---

## 🟠 HIGH PRIORITY ISSUES

### H1: `ignoreBuildErrors: true` — Hiding Real TypeScript Errors
**File:** `next.config.ts:7`  
**Severity:** 🟠 HIGH

**Problem:** This flag suppresses ALL TypeScript errors during build. The `checkRateLimit` bug (C1) is just one example of errors being hidden. There may be more.

**Impact:** Deploying broken code to production. Silent failures, runtime crashes.

**Fix:** Remove this flag immediately. Fix all TypeScript errors properly.

---

### H2: `reactStrictMode: false` — Disabled in Production
**File:** `next.config.ts:9`  
**Severity:** 🟠 HIGH

**Problem:** React Strict Mode is disabled. Strict Mode helps detect:
- Unsafe lifecycle methods
- Side effects in render
- Deprecated API usage
- Memory leaks

**Impact:** Subtle bugs in useEffect, memory leaks, and non-deterministic behavior may go unnoticed.

**Fix:** Remove this line or set to `true`. Then fix any Strict Mode warnings that appear.

---

### H3: Client-Side Routing Only — Zero SEO
**File:** `src/app/page.tsx`, `src/store/app-store.ts`  
**Severity:** 🟠 HIGH

**Problem:** The entire app uses Zustand `activePage` state for navigation instead of Next.js file-based routing. All 40+ "pages" are loaded in a single `page.tsx`.

**Impact:**
- **Zero SEO** — No individual page URLs. All pages share the same URL (`/`).
- **No server-side rendering** — Everything is client-side rendered.
- **No social sharing** — Can't share a link to "Analytics" or "Trends" page.
- **No deep linking** — Refreshing the page resets to Dashboard.
- **Browser back button doesn't work** — Standard browser navigation is broken.

**Fix:** This is a major refactor. Options:
1. **Recommended:** Use Next.js App Router properly. Create `src/app/dashboard/page.tsx`, `src/app/products/page.tsx`, etc. Use Zustand only for state, not routing.
2. **Quick fix:** Add URL hash routing (`/#products`, `/#analytics`) so that the active page is reflected in the URL. Implement `popstate` listener for browser back/forward.

---

### H4: SQLite in Production — Not Suitable for Scale
**Files:** `prisma/schema.prisma`, `.env`  
**Severity:** 🟠 HIGH

**Problem:** SQLite is used as the primary database. While fine for demos:
- No concurrent write support (file locking issues)
- No connection pooling
- No horizontal scaling (single file on one server)
- `db:push` is used instead of proper migrations (`db:migrate`)
- No WAL mode configured (better for concurrent reads)

**Impact:** Data corruption under concurrent load. Can't scale horizontally. No proper migration history.

**Fix:**
1. Switch to PostgreSQL for production: `bun add pg @types/pg`
2. Update Prisma datasource: `provider = "postgresql"`
3. Use `prisma migrate deploy` in production instead of `db:push`
4. If staying on SQLite: enable WAL mode (`PRAGMA journal_mode = WAL;`)

---

### H5: Public API Routes Bypass Authentication
**File:** `src/middleware.ts:12-18`  
**Severity:** 🟠 HIGH

```typescript
const PUBLIC_API_PREFIXES = [
  // ...
  '/api/export',         // Data exports (CSV/PDF)
  '/api/pricing/plans',  // Public pricing catalog
]
```

**Problem:** `/api/export` is listed as a public API prefix, meaning anyone can call CSV/PDF export endpoints without authentication. The export routes fall back to demo data when DB is empty, but if a user has data, it could be accessible.

**Impact:** Potential data leakage. Anyone can export earnings data without logging in.

**Fix:** Remove `/api/export` from `PUBLIC_API_PREFIXES`. Require authentication for all exports.

---

### H6: No Input Validation on Webhook Payload
**File:** `src/app/api/shopee/webhook/route.ts`  
**Severity:** 🟠 HIGH

**Problem:** After signature verification, the payload is parsed as JSON but not validated against a schema. The code directly destructures `payload.data` without checking if fields exist or are the correct type.

**Impact:** Type mismatches, unexpected errors, or malicious data causing crashes.

**Fix:** Add a Zod schema for webhook payload:
```typescript
const webhookSchema = z.object({
  event_type: z.enum(['order_conversion', 'click', 'commission_update']),
  data: z.object({
    order_sn: z.string().optional(),
    item_id: z.union([z.string(), z.number()]).optional(),
    item_name: z.string().optional(),
    commission: z.number().optional(),
    commission_rate: z.number().optional(),
  }),
})
```

---

### H7: No Rate Limiting on Webhook Endpoint
**File:** `src/app/api/shopee/webhook/route.ts`  
**Severity:** 🟠 HIGH

**Problem:** While `enforceRateLimit` is called, it doesn't actually work (due to C1). But even if fixed, the webhook endpoint is called by Shopee's servers, not by the user. Rate limiting by IP would block Shopee's servers if they send many webhooks.

**Impact:** Potential webhook flooding or replay attacks.

**Fix:**
1. Implement webhook signature verification (already done — good!)
2. Add webhook replay detection: store processed `order_sn` + timestamp in a deduplication table
3. Implement exponential backoff for failed webhook responses

---

## 🟡 MEDIUM PRIORITY ISSUES

### M1: In-Memory Rate Limiting Not Suitable for Production
**File:** `src/lib/rate-limit.ts`  
**Severity:** 🟡 MEDIUM

**Problem:** Rate limiting is stored in a JavaScript `Map`. This works for a single Next.js process but:
- Lost on server restart
- Not shared across multiple instances (horizontal scaling)
- Memory leak risk if `MAX_ENTRIES` is exceeded (purging is lazy)

**Fix:** Use Redis for production rate limiting. Or at minimum, implement a proper Redis-backed rate limiter.

---

### M2: No CORS Configuration
**File:** None found  
**Severity:** 🟡 MEDIUM

**Problem:** No CORS configuration in Next.js. The API routes accept requests from any origin.

**Impact:** While not a critical security issue for a web app, it opens the door for:
- Unauthorized API calls from other domains
- Potential for XSS via malicious iframes

**Fix:** Add CORS configuration in `next.config.ts` or middleware:
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL || 'http://localhost:3000' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE' },
      ],
    },
  ]
}
```

---

### M3: `PRISMA_SCHEMA_VERSION` Hardcoded — Manual Sync Required
**File:** `src/lib/db.ts:7`  
**Severity:** 🟡 MEDIUM

```typescript
const PRISMA_SCHEMA_VERSION = 'social-accounts-v2'
```

**Problem:** This version string is hardcoded. When the schema changes, a developer must manually update this string. If forgotten, the old Prisma client is reused, causing runtime errors.

**Impact:** Subtle bugs where new models aren't available, old models are missing new fields.

**Fix:** Auto-generate this from `package.json` version or Prisma schema hash.

---

### M4: `db:push` in Production Scripts — Data Loss Risk
**File:** `package.json:12-15`  
**Severity:** 🟡 MEDIUM

```json
"db:push": "prisma db push",
"db:migrate": "prisma migrate dev",
"db:reset": "prisma migrate reset"
```

**Problem:** `db:push` is designed for prototyping, not production. It can:
- Drop columns that were removed from the schema
- Lose data during schema changes
- Not create a migration history

**Impact:** Potential data loss in production.

**Fix:**
1. Use `prisma migrate deploy` for production
2. Remove `db:push` and `db:reset` from production scripts
3. Add a separate `db:studio` script for local development

---

### M5: Notification Service CORS Too Permissive
**File:** `mini-services/notification-service/index.ts:55`  
**Severity:** 🟡 MEDIUM

```typescript
cors: { origin: '*', methods: ['GET', 'POST'] }
```

**Problem:** Socket.io server allows connections from any origin.

**Impact:** Any website can connect to the WebSocket server.

**Fix:** Restrict CORS to the app's domain:
```typescript
cors: { 
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'] 
}
```

---

### M6: No Backup/Disaster Recovery Strategy
**File:** None found  
**Severity:** 🟡 MEDIUM

**Problem:** No automated backup strategy for the SQLite database or any other data.

**Impact:** Data loss if server crashes, disk failure, or accidental deletion.

**Fix:**
1. Implement automated SQLite backups (cron job to copy `db/*.db` to S3/R2)
2. If switching to PostgreSQL: use managed DB with automatic backups

---

### M7: No `.env.example` File
**File:** Missing  
**Severity:** 🟡 MEDIUM

**Problem:** No `.env.example` file to document required environment variables.

**Impact:** New developers can't easily set up the project. Missing required env vars (like `NEXTAUTH_SECRET`) won't be discovered until runtime.

**Fix:** Create a `.env.example` file with all required and optional variables:
```env
# Required
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-secure-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional - OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Optional - Shopee API
SHOPEE_APP_ID=""
SHOPEE_SECRET=""
SHOPEE_REGION="my"

# Optional - Notifications
NOTIFICATION_SERVICE_PORT=3003
NOTIFICATION_CONTROL_PORT=3004
```

---

### M8: `worklog.md` is 3,790 Lines — Should Be Archived
**File:** `worklog.md`  
**Severity:** 🟡 MEDIUM

**Problem:** The worklog is extremely long (3,790 lines) and contains detailed agent conversation logs. This is not useful for production and bloats the repository.

**Impact:** Repository bloat, confusion for new developers.

**Fix:** Move to `docs/worklog-archive.md` or `.archive/worklog.md`. Keep only a summary in the main `worklog.md`.

---

### M9: No Input Length Limits on AI Chat
**File:** `src/app/api/hermes/chat/route.ts`  
**Severity:** 🟡 MEDIUM

**Problem:** No maximum message length validation. Users could send extremely long messages to the AI API, causing:
- High token costs
- API timeouts
- Denial of service

**Fix:** Add `maxLength` validation to `hermesChatSchema`:
```typescript
export const hermesChatSchema = z.object({
  message: z.string().min(1).max(4000), // 4000 chars max
  conversationId: z.string().optional(),
})
```

---

### M10: No API Versioning
**Files:** All API routes  
**Severity:** 🟡 MEDIUM

**Problem:** All API routes are at `/api/*` without versioning. Once the app is live, breaking changes to API routes will break client integrations.

**Impact:** Can't evolve the API without breaking existing clients.

**Fix:** Implement API versioning:
- `/api/v1/shopee/products`
- `/api/v1/hermes/chat`
- Or use `Accept-Version` header

---

## 🟢 LOW PRIORITY / NICE-TO-HAVE

### L1: No `next/image` Usage for Optimization
**File:** Various page components  
**Severity:** 🟢 LOW

**Problem:** The app doesn't use Next.js `<Image>` component for product images, avatars, etc. Standard `<img>` tags are used instead.

**Impact:** No automatic image optimization, WebP conversion, lazy loading, or responsive images.

**Fix:** Replace `<img>` with Next.js `<Image>` where possible. For external URLs, configure `images.remotePatterns` in `next.config.ts`.

---

### L2: Missing `robots.txt` and `sitemap.xml`
**File:** Missing from `public/`  
**Severity:** 🟢 LOW

**Problem:** No `robots.txt` or `sitemap.xml` files. Since the app is an SPA, this is less critical, but still needed for good SEO hygiene.

**Fix:** Create `public/robots.txt` and `public/sitemap.xml` (or generate dynamically).

---

### L3: No Analytics/Monitoring Integration
**File:** None found  
**Severity:** 🟢 LOW

**Problem:** No error tracking (Sentry), no performance monitoring (Vercel Analytics), no usage analytics.

**Fix:** Add Sentry for error tracking, Vercel Analytics for performance, or Plausible for privacy-friendly analytics.

---

### L4: Tailwind v4 Config Using v3 Syntax
**File:** `tailwind.config.ts`  
**Severity:** 🟢 LOW

**Problem:** The project uses Tailwind CSS v4 (`"tailwindcss": "^4"` in devDependencies) but the `tailwind.config.ts` still uses the v3 configuration format.

**Impact:** May cause compatibility issues or prevent using v4 features.

**Fix:** Migrate to Tailwind v4's CSS-based configuration (using `@theme` in `globals.css`) or downgrade to Tailwind v3.

---

### L5: No Error Tracking for Webhook Failures
**File:** `src/app/api/shopee/webhook/route.ts`  
**Severity:** 🟢 LOW

**Problem:** Webhook failures are only logged to console. No alerting or retry mechanism for failed webhook processing.

**Fix:** Add webhook failure logging to a `WebhookLog` table. Implement retry with exponential backoff for transient failures.

---

### L6: Landing Page / Login Page is 1,488 Lines — Needs Refactoring
**File:** `src/components/pages/login-page.tsx`  
**Severity:** 🟢 LOW

**Problem:** The login/landing page is a massive 1,488-line single file. This is difficult to maintain and likely causes long initial load times for unauthenticated users.

**Fix:** Refactor into smaller components:
- `HeroSection`
- `FeatureGrid`
- `PricingPreview`
- `TestimonialSection`
- `LoginForm`
- `RegisterForm`
- `StatsTicker`

---

## 🎯 Landing Page Improvement Suggestions

### Current State
The pre-auth landing page (login-page.tsx) is 1,488 lines and serves dual purpose: marketing site + auth forms. It's functional but:
- **Too long** — single file, hard to maintain
- **No separate landing page** — unauthenticated users immediately see login forms
- **Missing key marketing elements** — no clear CTA, no social proof integration, no demo video
- **Not optimized for conversion** — no A/B testing framework, no analytics tracking
- **Mobile UX issues** — 1,488 lines likely has mobile responsiveness issues

### Recommended Improvements

1. **Separate Landing Page from Auth** — Create a dedicated `landing-page.tsx` that is shown first, with a "Get Started" CTA that transitions to login/register
2. **Add Video Demo Section** — Embed a 60-second demo video or animated GIF
3. **Add Live Stats Counter** — Animated count-up of "affiliates earning", "products discovered", etc.
4. **Add Trust Badges** — SSL, Shopee Partner, data encryption, GDPR compliance
5. **Add FAQ Section** — Address common questions about pricing, commissions, support
6. **Add Footer** — Links to terms, privacy, contact, social media
7. **Optimize for SEO** — Proper heading hierarchy, meta tags, structured data
8. **Add Analytics** — Track conversion rate from landing page to signup
9. **Implement A/B Testing** — Test different hero copy, CTAs, color schemes
10. **Add Language Switcher** — English / Bahasa Malaysia toggle for the Malaysian market

---

## ✅ Strengths of the Project

Despite the issues, the project has many strong points:

1. **Comprehensive Feature Set** — 40+ pages, 5 major fasas, AI integration, multi-platform support
2. **Good UI Component Library** — shadcn/ui with 46 components, consistent design
3. **Error Handling Pattern** — `ApiError` + `handleError` is consistent across routes
4. **Zod Validation** — Most POST endpoints have input validation
5. **Mock Data Fallback** — Demo mode works without external API keys
6. **Real-time Notifications** — WebSocket-based notification system
7. **Dark Mode Support** — `next-themes` integration with proper CSS variables
8. **PWA Support** — Service worker, manifest, offline banner
9. **Rate Limiting Framework** — In place (though currently broken)
10. **Documentation** — Extensive README, PRD, and CHECKLIST

---

## 📝 Action Plan

### Phase 1: Critical Fixes (Do This Week)
1. Fix `checkRateLimit` import bug (C1)
2. Remove `ignoreBuildErrors: true` (H1)
3. Remove hardcoded `NEXTAUTH_SECRET` fallback (C2)
4. Remove hardcoded demo credentials (C3)
5. Add CSRF protection (C4)
6. Validate webhook payload (C5)

### Phase 2: High Priority (Next 2 Weeks)
7. Fix routing — add URL hash or migrate to App Router (H3)
8. Switch to PostgreSQL or enable WAL mode (H4)
9. Remove `/api/export` from public prefixes (H5)
10. Enable React Strict Mode (H2)
11. Fix rate limiting for production (M1)
12. Add CORS configuration (M2)

### Phase 3: Medium Priority (Next Month)
13. Replace `db:push` with proper migrations (M4)
14. Add `.env.example` (M7)
15. Archive worklog.md (M8)
16. Add API versioning (M10)
17. Add input length limits on AI chat (M9)
18. Restrict notification service CORS (M5)

### Phase 4: Polish (Ongoing)
19. Refactor landing page into smaller components (L6)
20. Add `next/image` optimization (L1)
21. Add analytics/monitoring (L3)
22. Add `robots.txt` and `sitemap.xml` (L2)
23. Fix Tailwind v4 config (L4)

---

> **End of Review** | Generated by Code Review Agent | 5 CRITICAL + 7 HIGH + 10 MEDIUM + 6 LOW = 28 issues identified
