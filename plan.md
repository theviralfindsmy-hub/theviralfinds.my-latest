# Plan: TheViralFindsMY Project Review & Landing Page Improvement

## Objective
Review the entire TheViralFindsMY project (Next.js 16 + Prisma + shadcn/ui) thoroughly to identify weaknesses, loopholes, and areas for improvement. Then improve the landing page using the `design-system-builder` skill.

## Stage 1: Deep Project Review (Parallel Sub-agents)
Launch 5 parallel review agents, each focusing on a different domain:

### 1.1 Architecture & Code Review Agent (`plan` type)
- **Focus:** Project architecture, Next.js 16 App Router usage, routing decisions, code organization, dependency versions, build config
- **Key files to inspect:** `next.config.ts`, `package.json`, `src/app/page.tsx`, `tsconfig.json`, `src/app/layout.tsx`, `src/middleware.ts`
- **Questions:**
  - Is client-side routing via Zustand a good pattern for Next.js 16? SEO implications?
  - Why `ignoreBuildErrors: true`? Is this hiding real TS errors?
  - `reactStrictMode: false` — why disabled in production?
  - Why Tailwind v4 config still using old v3 format in `tailwind.config.ts`?
  - Is the middleware file pattern deprecated warning an issue?
  - Is `output: "standalone"` properly configured?
  - Are there any circular dependencies?
  - Is `bun` used consistently? Any npm/bun lock conflicts?

### 1.2 Security & API Review Agent (`plan` type)
- **Focus:** API security, auth loopholes, rate limiting, SQL injection, XSS, data validation, webhook security, secret handling
- **Key files to inspect:** `src/middleware.ts`, `src/lib/auth.ts`, `src/app/api/shopee/webhook/route.ts`, `src/lib/rate-limit-enforce.ts`, `src/lib/api-error.ts`, `src/lib/validation.ts`, `src/app/api/*/route.ts` (multiple)
- **Questions:**
  - Is `NEXTAUTH_SECRET` fallback `'theviralfindsmy-secret-key-2025'` a security vulnerability?
  - Webhook signature verification using DB secret — race condition risk?
  - Is `enforceRateLimit` properly implemented or just a stub?
  - Are all POST endpoints validated with Zod?
  - Is `db` singleton properly handled in serverless environments?
  - Any SQL injection risks in Prisma queries?
  - Are API keys masked properly?
  - Is CORS configured?
  - Is there any CSRF protection?

### 1.3 Database & Data Model Review Agent (`plan` type)
- **Focus:** Prisma schema, SQLite limitations, data integrity, model relationships, migration strategy
- **Key files to inspect:** `prisma/schema.prisma`, `src/lib/db.ts`, `src/app/api/seed/route.ts`
- **Questions:**
  - SQLite for production — is this a real concern? What about WAL mode?
  - Are all `@index` declarations correct?
  - Is there any data loss risk with `db:push` in production?
  - Are foreign keys properly configured with `onDelete`?
  - Is the schema normalized or denormalized appropriately?
  - Any missing constraints (unique, not null)?
  - Is there a backup strategy?
  - What about connection pooling with SQLite in serverless?

### 1.4 UI/UX & Frontend Review Agent (`plan` type)
- **Focus:** Component architecture, shadcn/ui usage, responsive design, mobile UX, performance, accessibility
- **Key files to inspect:** `src/app/page.tsx`, `src/components/layout/*`, `src/components/pages/*`, `src/app/globals.css`, `src/store/app-store.ts`, `src/components/onboarding/onboarding-wizard.tsx`
- **Questions:**
  - Is SPA routing with Zustand compatible with Next.js 16 App Router? SEO implications?
  - Are all 40+ lazy-loaded pages actually lazy? Is there code splitting?
  - Is the bundle size manageable? Any heavy imports that could be dynamic?
  - Are all 18+ pages accessible? Keyboard navigation?
  - Is the dark mode implementation correct? `next-themes` + Tailwind CSS v4 dark mode syntax?
  - Is there any unused shadcn/ui components being bundled?
  - Are images optimized? `next/image` usage?
  - Is there proper loading states for all data-dependent sections?
  - Are skeleton components layout-matched?
  - Is there any CLS (Cumulative Layout Shift) issues?
  - Are there any memory leaks in useEffect?

### 1.5 Business Logic & Feature Review Agent (`plan` type)
- **Focus:** Feature completeness, business model viability, AI integration, marketplace logic, payment flow
- **Key files to inspect:** `README.md`, `PRD.md`, `CHECKLIST.md`, `src/app/api/pricing/*`, `src/app/api/marketplace/*`, `src/app/api/ai/*`
- **Questions:**
  - Are Stripe/Billplz integrations actually implemented or just documented?
  - Is the marketplace content model complete?
  - Are AI-generated content properly attributed/disclosed?
  - Is there any business logic loophole (e.g., bypassing subscription checks)?
  - Are the mock data fallbacks realistic enough for demo mode?
  - Is the multi-platform commission comparison actually functional?
  - Are there any missing critical features for Malaysian market?

## Stage 2: Synthesis & Report Generation
- **Orchestrator:** Consolidate all 5 review reports into a single structured markdown document
- **Output:** `PROJECT_REVIEW.md` with:
  - Executive Summary (severity score)
  - Critical Issues (security, data integrity, business logic)
  - High Priority Issues (performance, UX, architecture)
  - Medium Priority Issues (code quality, maintainability)
  - Low Priority / Nice-to-Have
  - Landing Page Improvement Suggestions

## Stage 3: Landing Page Improvement (using design-system-builder)
- **Load skill:** `design-system-builder`
- **Approach:** Since user has no reference images, we'll design the improved landing page based on the existing design system (Shopee orange + HERMES purple) and current brand identity
- **Deliverable:** A new/improved landing page component that can be swapped in
- **Output:** Updated landing page component file + design system documentation

## File propagation
- Stage 1 outputs: 5 review reports → Stage 2
- Stage 2 output: Consolidated review → Stage 3 (for landing page design context)
- Stage 3 output: New landing page component + design docs

## Quality gates
- Each review agent must provide specific file:line references for every issue
- Must categorize by severity: CRITICAL / HIGH / MEDIUM / LOW
- Must provide actionable fix suggestions, not just complaints
- Landing page design must match existing brand colors (Shopee orange, HERMES purple)
