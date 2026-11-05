'use client'

/**
 * LandingPage v3 — TheViralFindsMY
 * MINIMALIST BRUTALISM × FRAMER MOTION
 *
 * Design: Electric Blue (#1b55ff) + Acid Lime (#c3ff00) — bold, geometric, high contrast
 * Font: Space Grotesk (matching logo wordmark)
 * Animation: Parallax, 3D transforms, staggered reveals, magnetic hover
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type Variants,
} from 'framer-motion'
import {
  ShoppingBag,
  TrendingUp,
  Sparkles,
  BarChart3,
  ArrowRight,
  Check,
  Play,
  Star,
  Zap,
  Shield,
  Lock,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Wallet,
  Target,
  Rocket,
  Lightbulb,
  Link as LinkIcon,
  Users,
  Megaphone,
  Bot,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Globe,
  Mail,
  Menu,
  X,
  Search,
  LineChart,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

import { ChangelogWidget } from '@/components/marketing/changelog-widget'

// ─── Types ───────────────────────────────────────────────────────────────────

interface LandingPageProps {
  onStartFree?: () => void
  onSignIn?: () => void
  onWatchDemo?: () => void
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 22, delay: i * 0.12 },
  }),
}

// ─── Utility: Section Wrapper with Scroll Animation ─────────────────────────

function AnimatedSection({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id={id} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}

// ─── Utility: Magnetic Button ────────────────────────────────────────────────

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.15)
    y.set((e.clientY - cy) * 0.15)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ─── Utility: Count-Up ──────────────────────────────────────────────────────

function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1500,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * value)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// ─── Floating Geometric Shape ────────────────────────────────────────────────

function FloatingShape({
  className,
  delay = 0,
  duration = 6,
  size = 80,
  shape = 'circle',
}: {
  className?: string
  delay?: number
  duration?: number
  size?: number
  shape?: 'circle' | 'square' | 'triangle'
}) {
  return (
    <motion.div
      className={cn('absolute pointer-events-none', className)}
      animate={{
        y: [0, -20, 0],
        rotate: shape === 'square' ? [0, 90, 0] : [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ width: size, height: size }}
    >
      {shape === 'circle' && (
        <div className="w-full h-full rounded-full border-2 border-[#c3ff00]/20" />
      )}
      {shape === 'square' && (
        <div className="w-full h-full border-2 border-white/10 rotate-12" />
      )}
      {shape === 'triangle' && (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 95,90 5,90"
            fill="none"
            stroke="rgba(195,255,0,0.15)"
            strokeWidth="2"
          />
        </svg>
      )}
    </motion.div>
  )
}

// ─── STICKY NAV ──────────────────────────────────────────────────────────────

function LandingNav({ onStartFree, onSignIn }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setMobileOpen(false)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <img src="/logo.svg" alt="TheViralFinds Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-lg tracking-[-0.04em] uppercase text-white">
              THEVIRALFINDS
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              onClick={() => onSignIn?.()}
            >
              Sign In
            </button>
            <MagneticButton
              className="px-5 py-2.5 bg-[#c3ff00] text-black font-bold text-sm tracking-tight hover:bg-[#d4ff33] transition-colors"
              onClick={() => onStartFree?.()}
            >
              START FREE →
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/[0.06]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Separator className="my-2 bg-white/10" />
              <button
                className="w-full py-3 bg-[#c3ff00] text-black font-bold text-sm tracking-tight"
                onClick={() => {
                  setMobileOpen(false)
                  onStartFree?.()
                }}
              >
                START FREE — NO CREDIT CARD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────

function HeroSection({ onStartFree, onWatchDemo }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const mockupRotateX = useTransform(scrollYProgress, [0, 0.5], [12, 0])
  const mockupScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const heroInView = useInView(heroRef, { once: true })

  // Word-by-word headline
  const headline = ['Find.', 'Create.', 'Earn.']

  const floatingCards = [
    { icon: Wallet, label: "Today's Earnings", value: 'RM 1,247', sub: '+18.4%' },
    { icon: TrendingUp, label: 'Conversion Rate', value: '8.7%', sub: 'Above avg' },
    { icon: Bot, label: 'HERMES AI', value: '12 ready', sub: 'Manglish ✓' },
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Geometric background shapes */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] bg-[#1b55ff]/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-[#c3ff00]/[0.05] rounded-full blur-[100px]" />
        <FloatingShape shape="circle" size={120} className="top-[15%] right-[20%]" delay={0} />
        <FloatingShape shape="square" size={60} className="bottom-[30%] left-[8%]" delay={1.5} />
        <FloatingShape shape="triangle" size={90} className="top-[60%] right-[8%]" delay={0.8} />
        <FloatingShape shape="square" size={40} className="top-[20%] left-[25%]" delay={2} />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ y: textY, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-12"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 border border-[#c3ff00]/30 text-[#c3ff00] text-xs font-bold tracking-widest uppercase">
                <Zap className="w-3 h-3" />
                v10.0 — PREMIUM UX
              </span>
            </motion.div>

            {/* Word-by-word headline */}
            <div className="flex flex-wrap gap-x-4 gap-y-0">
              {headline.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 60, rotateX: -40 }}
                  animate={heroInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    'text-5xl sm:text-6xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.95]',
                    i === 0 && 'text-white',
                    i === 1 && 'text-[#1b55ff]',
                    i === 2 && 'text-[#c3ff00]'
                  )}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-white/50 leading-relaxed max-w-md"
            >
              The AI platform built exclusively for Malaysian Shopee affiliates. 
              Discover trending products, generate Manglish captions, track every sen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                className="px-8 py-4 bg-[#c3ff00] text-black font-black text-base tracking-tight hover:bg-[#d4ff33] transition-all shadow-[0_0_40px_rgba(195,255,0,0.2)]"
                onClick={() => onStartFree?.()}
              >
                START FREE — NO CARD NEEDED
                <ArrowRight className="inline ml-2 w-4 h-4" />
              </MagneticButton>
              <button
                className="flex items-center gap-2 px-6 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
                onClick={() => onWatchDemo?.()}
              >
                <Play className="w-4 h-4 fill-[#1b55ff] text-[#1b55ff]" />
                WATCH 60s DEMO
              </button>
              <Link
                href="/showcase"
                className="flex items-center gap-2 px-6 py-4 border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:border-[#00f0ff]/70 transition-all text-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                3D INTERACTIVE SHOWCASE
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-5 text-xs text-white/30 uppercase tracking-wider font-medium"
            >
              {['Free forever plan', 'No API needed', 'Cancel anytime'].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#c3ff00]" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Dashboard Mockup */}
          <motion.div
            style={{ y: mockupY, rotateX: mockupRotateX, scale: mockupScale }}
            className="relative hidden lg:block"
            initial={{ opacity: 0, y: 60 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative border border-white/10 bg-[#111] overflow-hidden shadow-2xl"
              style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
              {/* Fake title bar */}
              <div className="h-10 bg-gradient-to-r from-[#1b55ff] to-[#1040cc] flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                </div>
                <span className="ml-auto text-[10px] text-white/60 font-mono tracking-wide">
                  dashboard.theviralfinds.my
                </span>
              </div>

              {/* Dashboard content */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: 'CLICKS', val: '14.2K', color: 'bg-[#1b55ff]/20 border-[#1b55ff]/30' },
                    { label: 'CONVERTS', val: '847', color: 'bg-[#c3ff00]/10 border-[#c3ff00]/20' },
                    { label: 'EARNINGS', val: 'RM 4.2K', color: 'bg-[#1b55ff]/20 border-[#1b55ff]/30' },
                    { label: 'RATE', val: '5.96%', color: 'bg-[#c3ff00]/10 border-[#c3ff00]/20' },
                  ].map((item) => (
                    <div key={item.label} className={cn('border p-2.5', item.color)}>
                      <div className="text-[9px] text-white/40 tracking-wider font-bold">{item.label}</div>
                      <div className="text-sm font-black text-white mt-1">{item.val}</div>
                    </div>
                  ))}
                </div>

                {/* Chart bars */}
                <div className="border border-white/[0.06] bg-white/[0.02] p-4 h-36 flex items-end gap-1.5">
                  {[65, 45, 80, 55, 90, 70, 85, 40, 75, 60, 95, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        'flex-1',
                        i % 3 === 0 ? 'bg-[#c3ff00]/40' : 'bg-[#1b55ff]/40'
                      )}
                      initial={{ height: 0 }}
                      animate={heroInView ? { height: `${h}%` } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.04 }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="border border-white/[0.06] bg-white/[0.02] p-3 h-14" />
                  <div className="border border-white/[0.06] bg-white/[0.02] p-3 h-14" />
                </div>
              </div>
            </div>

            {/* Floating metric cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 1.0 + i * 0.15,
                }}
                className={cn(
                  'absolute bg-[#111] border border-white/10 p-3 w-40 shadow-xl',
                  i === 0 && '-top-4 -right-4',
                  i === 1 && 'bottom-12 -left-8',
                  i === 2 && 'top-24 -left-10'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#1b55ff] flex items-center justify-center">
                    <card.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wider">{card.label}</div>
                    <div className="text-xs font-black text-white">{card.value}</div>
                  </div>
                </div>
                <div className="text-[10px] text-[#c3ff00] mt-1 font-bold">{card.sub}</div>
              </motion.div>
            ))}

            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#1b55ff]/20 via-transparent to-[#c3ff00]/10 blur-2xl -z-10" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-white/20" />
      </motion.div>
    </section>
  )
}

// ─── SOCIAL PROOF ────────────────────────────────────────────────────────────

function SocialProofSection() {
  const stats = [
    { value: 47382, prefix: 'RM ', label: 'Earned today' },
    { value: 12847, label: 'Active affiliates' },
    { value: 98.7, suffix: '%', label: 'Uptime', decimals: 1 },
    { value: 4.9, suffix: '/5', label: 'Rating', decimals: 1 },
  ]

  return (
    <AnimatedSection className="relative py-16 bg-[#0a0a0a] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                  decimals={stat.decimals || 0}
                />
              </div>
              <div className="text-xs text-white/30 uppercase tracking-[0.15em] font-bold mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── PROBLEM → SOLUTION ─────────────────────────────────────────────────────

function ProblemSolutionSection() {
  const painPoints = [
    { icon: Target, label: 'Hours finding trending products', detail: 'Scrolling Shopee for hours hoping something clicks' },
    { icon: Megaphone, label: 'Writing captions in BM/Manglish', detail: 'Struggling to write viral copy that sounds natural' },
    { icon: BarChart3, label: 'Tracking commissions manually', detail: 'Spreadsheets, screenshots, confusion every month' },
    { icon: Wallet, label: 'No idea what actually converts', detail: 'Posting blindly without data on what works' },
  ]

  return (
    <AnimatedSection className="relative py-24 sm:py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Pain */}
          <div>
            <motion.div variants={fadeUp}>
              <span className="text-[#c3ff00] text-xs font-bold tracking-[0.2em] uppercase">
                THE PROBLEM
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4"
            >
              You&apos;re doing everything
              <br />
              <span className="text-white/30">the hard way.</span>
            </motion.h2>

            <div className="mt-8 space-y-4">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point.label}
                  variants={fadeUp}
                  custom={i + 2}
                  className="flex items-start gap-4 p-4 border border-red-500/10 bg-red-500/[0.02] group hover:border-red-500/20 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-5 h-5 text-red-400/60" />
                  </div>
                  <div>
                    <div className="font-bold text-white/80 text-sm">{point.label}</div>
                    <div className="text-xs text-white/30 mt-0.5">{point.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Solution */}
          <div>
            <motion.div variants={fadeUp}>
              <span className="text-[#1b55ff] text-xs font-bold tracking-[0.2em] uppercase">
                THE SOLUTION
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4"
            >
              One platform.
              <br />
              <span className="text-[#c3ff00]">Zero friction.</span>
            </motion.h2>

            <div className="mt-8 space-y-4">
              {[
                { icon: Search, label: 'AI Product Discovery', detail: 'HERMES scans trending items across 50+ categories daily', color: 'border-[#1b55ff]/20 bg-[#1b55ff]/[0.03]' },
                { icon: MessageSquare, label: 'Manglish Caption Generator', detail: 'One-click viral captions in BM, Manglish, or English', color: 'border-[#c3ff00]/20 bg-[#c3ff00]/[0.03]' },
                { icon: LineChart, label: 'Real-Time Commission Tracker', detail: 'Every click, conversion, and ringgit tracked automatically', color: 'border-[#1b55ff]/20 bg-[#1b55ff]/[0.03]' },
                { icon: Sparkles, label: 'AI Content Strategy', detail: 'Data-driven posting times, hashtags, and platforms', color: 'border-[#c3ff00]/20 bg-[#c3ff00]/[0.03]' },
              ].map((point, i) => (
                <motion.div
                  key={point.label}
                  variants={fadeUp}
                  custom={i + 2}
                  className={cn('flex items-start gap-4 p-4 border group hover:border-[#c3ff00]/30 transition-colors', point.color)}
                >
                  <div className="w-10 h-10 bg-[#1b55ff]/20 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-5 h-5 text-[#1b55ff]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{point.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{point.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: 'AI Product Discovery',
      desc: 'HERMES AI scans 50+ Shopee categories daily. Get curated product recommendations with profit margins, competition levels, and trend scores.',
      accent: 'from-[#1b55ff] to-[#1040cc]',
      stats: '50+ categories scanned daily',
    },
    {
      icon: MessageSquare,
      title: 'Manglish Content Engine',
      desc: 'Generate viral captions in authentic Manglish, BM, or English. Optimized for TikTok, Instagram, and X with hashtag recommendations.',
      accent: 'from-[#c3ff00] to-[#9acc00]',
      stats: '10x faster content creation',
    },
    {
      icon: LineChart,
      title: 'Smart Commission Tracker',
      desc: 'Real-time dashboard tracking every click, conversion, and commission. Weekly reports delivered straight to your WhatsApp.',
      accent: 'from-[#1b55ff] to-[#c3ff00]',
      stats: 'Real-time RM tracking',
    },
  ]

  return (
    <AnimatedSection id="features" className="relative py-24 sm:py-32 bg-[#0d0d0d] overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1b55ff]/[0.04] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.span
            variants={fadeUp}
            className="text-[#c3ff00] text-xs font-bold tracking-[0.2em] uppercase"
          >
            CORE FEATURES
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4"
          >
            Everything you need.
            <br />
            <span className="text-white/30">Nothing you don&apos;t.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              custom={i}
              whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className="group relative bg-[#111] border border-white/[0.06] p-8 hover:border-[#1b55ff]/30 transition-colors overflow-hidden"
            >
              {/* Gradient accent top */}
              <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', feature.accent)} />

              <div className="w-12 h-12 bg-[#1b55ff]/10 border border-[#1b55ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#1b55ff]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#1b55ff]" />
              </div>

              <h3 className="text-lg font-black text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 mt-3 leading-relaxed">
                {feature.desc}
              </p>

              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] text-[#c3ff00] font-bold tracking-[0.15em] uppercase">
                  {feature.stats}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card, no Shopee API needed.', icon: Rocket },
    { num: '02', title: 'Connect & Discover', desc: 'HERMES AI immediately starts scanning trending products in your niche.', icon: Search },
    { num: '03', title: 'Create & Post', desc: 'Generate viral Manglish captions and share across TikTok, IG, and X.', icon: Sparkles },
    { num: '04', title: 'Track & Earn', desc: 'Watch your commissions roll in with real-time tracking and weekly reports.', icon: Wallet },
  ]

  return (
    <AnimatedSection id="how-it-works" className="relative py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            variants={fadeUp}
            className="text-[#1b55ff] text-xs font-bold tracking-[0.2em] uppercase"
          >
            HOW IT WORKS
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4"
          >
            Four steps to
            <br />
            <span className="text-[#c3ff00]">passive income.</span>
          </motion.h2>
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              custom={i}
              className="relative flex gap-6 sm:gap-8 items-start pb-12 last:pb-0"
            >
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] sm:left-[27px] top-14 bottom-0 w-px bg-gradient-to-b from-[#1b55ff]/30 to-transparent" />
              )}

              {/* Number */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1b55ff] flex items-center justify-center flex-shrink-0 relative z-10">
                <span className="text-white font-black text-sm">{step.num}</span>
              </div>

              {/* Content */}
              <div className="pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-4 h-4 text-[#c3ff00]" />
                  <h3 className="text-lg font-black text-white tracking-tight">{step.title}</h3>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

function PricingSection({ onStartFree }: LandingPageProps) {
  const plans = [
    {
      name: 'FREE',
      price: 'RM 0',
      period: 'forever',
      desc: 'Perfect to start',
      features: ['5 product searches/day', 'Basic analytics', '10 AI captions/month', 'Community support'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'STARTER',
      price: 'RM 29',
      period: '/month',
      desc: 'For growing affiliates',
      features: ['50 product searches/day', 'Full analytics dashboard', '100 AI captions/month', 'Email support', 'Weekly WhatsApp reports'],
      cta: 'Start Starter',
      popular: false,
    },
    {
      name: 'PRO',
      price: 'RM 79',
      period: '/month',
      desc: 'For serious earners',
      features: ['Unlimited searches', 'Advanced analytics + export', 'Unlimited AI captions', 'Priority support', 'HERMES AI full access', 'Custom content calendar'],
      cta: 'Start Pro',
      popular: true,
    },
    {
      name: 'AGENCY',
      price: 'RM 199',
      period: '/month',
      desc: 'For teams & agencies',
      features: ['Everything in Pro', 'Team management (5 seats)', 'White-label reports', 'API access', 'Dedicated account manager', 'Custom integrations'],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <AnimatedSection id="pricing" className="relative py-24 sm:py-32 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            variants={fadeUp}
            className="text-[#c3ff00] text-xs font-bold tracking-[0.2em] uppercase"
          >
            PRICING
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4"
          >
            Simple, transparent
            <br />
            <span className="text-white/30">pricing.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={scaleIn}
              custom={i}
              whileHover={{ y: -6 }}
              className={cn(
                'relative p-6 border transition-all',
                plan.popular
                  ? 'bg-[#1b55ff]/10 border-[#1b55ff]/40 shadow-[0_0_60px_rgba(27,85,255,0.1)]'
                  : 'bg-[#111] border-white/[0.06] hover:border-white/10'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#c3ff00] text-black text-[10px] font-black tracking-wider px-3 py-1 uppercase">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-white/30">{plan.period}</span>
              </div>
              <p className="text-xs text-white/40 mt-1">{plan.desc}</p>

              <Separator className="my-5 bg-white/[0.06]" />

              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 text-[#c3ff00] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  'w-full mt-6 py-3 text-sm font-bold tracking-tight transition-all',
                  plan.popular
                    ? 'bg-[#c3ff00] text-black hover:bg-[#d4ff33]'
                    : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.03]'
                )}
                onClick={() => onStartFree?.()}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Do I need a Shopee Affiliate Program account?',
      a: 'Yes, you need an existing Shopee affiliate account. TheViralFinds enhances your workflow — we don\'t replace the Shopee platform itself.',
    },
    {
      q: 'Is the Free plan really free forever?',
      a: 'Yes. The Free plan includes core features with usage limits. No credit card needed, no trial period, no hidden fees. Upgrade when you\'re ready.',
    },
    {
      q: 'What makes HERMES AI different from ChatGPT?',
      a: 'HERMES is fine-tuned specifically for Malaysian e-commerce. It understands Manglish, Shopee product trends, and local buying patterns. It\'s not a generic chatbot.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes. Cancel anytime from your dashboard. No lock-in contracts, no cancellation fees. Your data remains accessible on the Free plan.',
    },
    {
      q: 'Is my commission data secure?',
      a: 'Absolutely. We use AES-256 encryption, SSL throughout, and never share your data with third parties. We\'re SOC 2 ready and GDPR compliant.',
    },
    {
      q: 'Do you support TikTok Shop affiliates?',
      a: 'TikTok Shop integration is coming in Q2 2025. Currently we support Shopee Malaysia with plans for Lazada and TikTok Shop.',
    },
  ]

  return (
    <AnimatedSection id="faq" className="relative py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            variants={fadeUp}
            className="text-[#1b55ff] text-xs font-bold tracking-[0.2em] uppercase"
          >
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4"
          >
            Common questions.
          </motion.h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="border border-white/[0.06] bg-[#111] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 pb-5 text-sm text-white/40 leading-relaxed border-t border-white/[0.04] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── TRUST SECTION ───────────────────────────────────────────────────────────

function TrustSection() {
  const badges = [
    { label: 'SSL Encrypted', icon: Lock },
    { label: 'SOC 2 Ready', icon: BadgeCheck },
    { label: 'GDPR Compliant', icon: Shield },
    { label: 'AES-256 Storage', icon: Lock },
  ]

  return (
    <AnimatedSection className="relative py-16 bg-[#0d0d0d] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              variants={fadeIn}
              custom={i}
              className="flex items-center gap-2 text-white/30"
            >
              <badge.icon className="w-4 h-4 text-[#c3ff00]/60" />
              <span className="text-xs font-bold tracking-wider uppercase">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────

function FinalCTASection({ onStartFree }: LandingPageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Full-bleed Electric Blue background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-[#1b55ff]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20" />

      {/* Floating shapes */}
      <FloatingShape shape="circle" size={200} className="top-[10%] right-[5%]" delay={0} />
      <FloatingShape shape="square" size={80} className="bottom-[15%] left-[10%]" delay={1} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
        >
          Start earning
          <br />
          <span className="text-[#c3ff00]">while you sleep.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-white/60 mt-6 max-w-lg mx-auto"
        >
          Join 12,000+ Malaysian affiliates already using TheViralFinds to find products, create content, and track every commission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <MagneticButton
            className="px-10 py-5 bg-[#c3ff00] text-black font-black text-lg tracking-tight hover:bg-[#d4ff33] transition-all shadow-[0_0_60px_rgba(195,255,0,0.3)]"
            onClick={() => onStartFree?.()}
          >
            START FREE NOW
            <ArrowRight className="inline ml-2 w-5 h-5" />
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-xs text-white/30 mt-6 uppercase tracking-wider"
        >
          No credit card required • Free forever plan • Cancel anytime
        </motion.p>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.04] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 flex items-center justify-center">
                <img src="/logo.svg" alt="TheViralFinds Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-sm tracking-[-0.03em] uppercase text-white">
                THEVIRALFINDS
              </span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              AI-powered Shopee affiliate management platform. Built for Malaysia.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-white/[0.06] flex items-center justify-center hover:border-[#1b55ff]/40 hover:bg-[#1b55ff]/10 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon className="w-3.5 h-3.5 text-white/30" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'HERMES AI', 'Changelog'] },
            { title: 'Resources', links: ['Blog', 'Help Center', 'API Docs', 'Community'] },
            { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-white/30 hover:text-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/[0.04]" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/20 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} TheViralFindsMY. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Malaysia (MYR)
            </span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-[#c3ff00]/50" />
              Shopee Affiliate Partner
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function LandingPage({ onStartFree, onSignIn, onWatchDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#c3ff00] selection:text-black">
      <LandingNav onStartFree={onStartFree} onSignIn={onSignIn} />

      <main>
        <HeroSection onStartFree={onStartFree} onWatchDemo={onWatchDemo} />
        <SocialProofSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection onStartFree={onStartFree} />
        <FAQSection />
        <TrustSection />
        <FinalCTASection onStartFree={onStartFree} />
      </main>

      <Footer />

      {/* Changelog widget */}
      <div className="fixed bottom-4 right-4 z-40">
        <ChangelogWidget compact />
      </div>
    </div>
  )
}

export default LandingPage
