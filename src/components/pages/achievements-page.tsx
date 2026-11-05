'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useConfetti } from '@/hooks/use-confetti'
import { toast } from 'sonner'
import {
  Trophy,
  MousePointerClick,
  ShoppingCart,
  DollarSign,
  Flame,
  Share2,
  Lock,
  Star,
  Target,
  Award,
  Zap,
  Eye,
  TrendingUp,
  Crown,
  Gift,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'

// ─── Types ────────────────────────────────────────────────────────────────────

type AchievementCategory = 'clicks' | 'conversions' | 'earnings' | 'streaks' | 'social'

interface Achievement {
  id: string
  icon: typeof Trophy
  title: string
  description: string
  category: AchievementCategory
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const achievements: Achievement[] = [
  // Earned (8)
  {
    id: '1',
    icon: MousePointerClick,
    title: 'First Click',
    description: 'Receive your first affiliate link click.',
    category: 'clicks',
    earned: true,
    earnedDate: '2024-12-01',
  },
  {
    id: '2',
    icon: Eye,
    title: 'Click Master',
    description: 'Accumulate 1,000 total clicks across all links.',
    category: 'clicks',
    earned: true,
    earnedDate: '2025-01-15',
  },
  {
    id: '3',
    icon: ShoppingCart,
    title: 'First Conversion',
    description: 'Earn your first successful conversion.',
    category: 'conversions',
    earned: true,
    earnedDate: '2024-12-10',
  },
  {
    id: '4',
    icon: Target,
    title: 'Conversion Pro',
    description: 'Reach 50 total conversions.',
    category: 'conversions',
    earned: true,
    earnedDate: '2025-02-20',
  },
  {
    id: '5',
    icon: DollarSign,
    title: 'First Ringgit',
    description: 'Earn your first RM 1 in commission.',
    category: 'earnings',
    earned: true,
    earnedDate: '2024-12-10',
  },
  {
    id: '6',
    icon: TrendingUp,
    title: 'RM 1K Club',
    description: 'Accumulate RM 1,000 in total earnings.',
    category: 'earnings',
    earned: true,
    earnedDate: '2025-01-28',
  },
  {
    id: '7',
    icon: Flame,
    title: '7-Day Streak',
    description: 'Generate clicks for 7 consecutive days.',
    category: 'streaks',
    earned: true,
    earnedDate: '2025-02-05',
  },
  {
    id: '8',
    icon: Share2,
    title: 'Social Butterfly',
    description: 'Share affiliate links on 3 different platforms.',
    category: 'social',
    earned: true,
    earnedDate: '2025-01-20',
  },
  // Locked (6)
  {
    id: '9',
    icon: Zap,
    title: 'Click Legend',
    description: 'Accumulate 10,000 total clicks.',
    category: 'clicks',
    earned: false,
    progress: 3240,
    maxProgress: 10000,
  },
  {
    id: '10',
    icon: Crown,
    title: 'Conversion King',
    description: 'Reach 200 total conversions.',
    category: 'conversions',
    earned: false,
    progress: 67,
    maxProgress: 200,
  },
  {
    id: '11',
    icon: Award,
    title: 'RM 10K Earner',
    description: 'Accumulate RM 10,000 in total earnings.',
    category: 'earnings',
    earned: false,
    progress: 4280,
    maxProgress: 10000,
  },
  {
    id: '12',
    icon: Star,
    title: '30-Day Streak',
    description: 'Generate clicks for 30 consecutive days.',
    category: 'streaks',
    earned: false,
    progress: 12,
    maxProgress: 30,
  },
  {
    id: '13',
    icon: Gift,
    title: 'Viral Sensation',
    description: 'Get a single link with 500+ clicks.',
    category: 'social',
    earned: false,
    progress: 189,
    maxProgress: 500,
  },
  {
    id: '14',
    icon: Trophy,
    title: 'Top Affiliate',
    description: 'Reach the top 10 on the monthly leaderboard.',
    category: 'earnings',
    earned: false,
    progress: 0,
    maxProgress: 1,
  },
]

const categoryConfig: Record<AchievementCategory, { label: string; icon: typeof MousePointerClick }> = {
  clicks: { label: 'Clicks', icon: MousePointerClick },
  conversions: { label: 'Conversions', icon: ShoppingCart },
  earnings: { label: 'Earnings', icon: DollarSign },
  streaks: { label: 'Streaks', icon: Flame },
  social: { label: 'Social', icon: Share2 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [examplesOpen, setExamplesOpen] = useState(false)

  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements)
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const { fire } = useConfetti()

  const handleUnlock = (id: string) => {
    const ach = userAchievements.find((a) => a.id === id)
    if (!ach) return

    setAnimatingId(id)
    fire({ variant: 'milestone' })
    toast.success('Pencapaian Baru Dibuka! 🎉', {
      description: `Tahniah! Anda telah membuka pencapaian "${ach.title}" dan menerima RM 10 kredit bonus!`,
    })

    setTimeout(() => {
      setUserAchievements((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                earned: true,
                earnedDate: new Date().toISOString().split('T')[0],
                progress: a.maxProgress,
              }
            : a
        )
      )
    }, 600)

    setTimeout(() => {
      setAnimatingId(null)
    }, 1200)
  }

  const earnedCount = userAchievements.filter((a) => a.earned).length
  const totalCount = userAchievements.length

  const filteredAchievements =
    activeTab === 'all'
      ? userAchievements
      : userAchievements.filter((a) => a.category === activeTab)

  // Pick the "next achievement to unlock" — locked one with the highest progress %.
  const lockedAchievements = userAchievements.filter((a) => !a.earned && a.maxProgress)
  const nextAchievement = lockedAchievements
    .map((a) => ({
      achievement: a,
      pct: a.progress! / a.maxProgress!,
    }))
    .sort((a, b) => b.pct - a.pct)[0]?.achievement

  const scrollToNextAchievement = () => {
    if (!nextAchievement) return
    const el = document.getElementById(`achievement-${nextAchievement.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Brief highlight pulse.
      el.classList.add('ring-2', 'ring-shopee', 'ring-offset-2', 'ring-offset-background')
      window.setTimeout(() => {
        el.classList.remove(
          'ring-2',
          'ring-shopee',
          'ring-offset-2',
          'ring-offset-background',
        )
      }, 1800)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div {...fadeIn}>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground text-sm">
          Track your milestones and unlock rewards
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div {...fadeIn}>
        <Card variant="brutalist" className="transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-black dark:border-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-shopee/10 flex size-14 items-center justify-center rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Trophy className="text-shopee size-7" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider">
                    {earnedCount} / {totalCount} Achievements
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Teruskan usaha! Anda memburu pencapaian dengan pantas.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Overall Progress</span>
                  <span className="font-black text-shopee">
                    {Math.round((earnedCount / totalCount) * 100)}%
                  </span>
                </div>
                <Progress value={(earnedCount / totalCount) * 100} className="h-3 border border-black rounded-none [&>div]:bg-[#0033ff]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured: Next Achievement to Unlock — uses the locked EmptyState illustration */}
      {nextAchievement && (
        <motion.div {...fadeIn}>
          <Card className="border-hermes/20 bg-gradient-to-br from-hermes/[0.04] via-transparent to-shopee/[0.04]">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
                {/* EmptyState (unwrapped, compact) on the left */}
                <div className="mx-auto md:mx-0 max-w-xs">
                  <EmptyState
                    illustration="locked"
                    title="Unlock this achievement"
                    description="Complete the requirement below to earn this badge and RM 10 bonus credit."
                    cta={{
                      label: 'View requirement',
                      icon: ChevronDown,
                      onClick: scrollToNextAchievement,
                    }}
                    exampleAction={{
                      label: 'See unlocked examples',
                      onClick: () => setExamplesOpen(true),
                    }}
                    compact
                    unwrapped
                  />
                </div>

                {/* Next achievement preview on the right */}
                <div className="rounded-lg border bg-background/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-hermes/10 text-hermes">
                      <Lock className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold leading-tight">
                          {nextAchievement.title}
                        </h3>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {categoryConfig[nextAchievement.category].label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                        {nextAchievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {nextAchievement.progress!.toLocaleString()} /{' '}
                        {nextAchievement.maxProgress!.toLocaleString()}
                      </span>
                      <span className="font-medium text-hermes">
                        {Math.round(
                          (nextAchievement.progress! / nextAchievement.maxProgress!) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (nextAchievement.progress! / nextAchievement.maxProgress!) * 100
                      }
                      className="h-2 border border-black rounded-none [&>div]:bg-[#0033ff]"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      <Target className="inline size-3 mr-1 -translate-y-0.5" />
                      Earn <span className="font-medium text-shopee">RM 10</span>{' '}
                      bonus credit + badge when you reach{' '}
                      {nextAchievement.maxProgress!.toLocaleString()}.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Tabs */}
      <motion.div {...fadeIn}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <TabsTrigger key={key} value={key} className="gap-1.5">
                <cfg.icon className="size-3.5" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredAchievements.map((achievement) => {
                const progressPct = achievement.maxProgress
                  ? Math.round((achievement.progress! / achievement.maxProgress) * 100)
                  : 0
                const isCurrentlyAnimating = animatingId === achievement.id

                return (
                  <motion.div
                    key={achievement.id}
                    variants={fadeIn}
                    id={`achievement-${achievement.id}`}
                    animate={
                      isCurrentlyAnimating
                        ? {
                            y: [0, -10, 2, -4, 0],
                            scale: [1, 1.02, 0.98, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 0.8 }}
                  >
                    <Card
                      variant="brutalist"
                      className={cn(
                        'relative overflow-hidden transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-black dark:border-white',
                        achievement.earned
                          ? 'bg-[#ccff00]/5 border-[#0033ff]'
                          : 'bg-zinc-100/60 dark:bg-zinc-800/40 opacity-80'
                      )}
                    >
                      {achievement.earned && (
                        <div className="bg-[#ccff00]/5 absolute inset-0 pointer-events-none" />
                      )}
                      <CardContent className="relative p-4 flex flex-col h-[180px] justify-between">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className={cn(
                              'flex size-11 shrink-0 items-center justify-center rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
                              achievement.earned
                                ? 'bg-[#ccff00] text-black'
                                : 'bg-zinc-300 text-zinc-600'
                            )}
                            animate={
                              isCurrentlyAnimating
                                ? {
                                    scale: [1, 1.4, 0.8, 1.2, 1],
                                    rotate: [0, 360, 360, 360, 360],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                          >
                            {achievement.earned || isCurrentlyAnimating ? (
                              <achievement.icon className="size-5" />
                            ) : (
                              <Lock className="size-5" />
                            )}
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black uppercase tracking-wider leading-tight truncate">
                                {achievement.title}
                              </h3>
                              {achievement.earned && (
                                <Star className="size-3.5 fill-[#0033ff] text-[#0033ff] shrink-0" />
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {achievement.description}
                            </p>
                          </div>
                        </div>

                        <div>
                          {achievement.earned ? (
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                              <Trophy className="size-3 text-[#0033ff]" />
                              Earned on {achievement.earnedDate}
                            </div>
                          ) : achievement.maxProgress ? (
                            <div className="mt-1 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">
                                  {achievement.progress!.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
                                </span>
                                <span className="font-black text-black dark:text-white">{progressPct}%</span>
                              </div>
                              <Progress value={progressPct} className="h-2 border border-black rounded-none [&>div]:bg-[#0033ff]" />
                            </div>
                          ) : null}

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Badge variant="outline" className="text-[9px] capitalize border-black font-semibold rounded-none bg-white text-black">
                              {categoryConfig[achievement.category].label}
                            </Badge>
                            
                            {!achievement.earned && (
                              <Button
                                size="sm"
                                onClick={() => handleUnlock(achievement.id)}
                                className="h-6 px-2 text-[9px] font-black uppercase bg-[#ccff00] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 rounded-none shrink-0"
                              >
                                Unlock
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* "See unlocked examples" dialog — shown via the EmptyState exampleAction */}
      <Dialog open={examplesOpen} onOpenChange={setExamplesOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-shopee/10">
              <Sparkles className="size-5 text-shopee" />
            </div>
            <DialogTitle>Unlocked achievement examples</DialogTitle>
            <DialogDescription>
              Here are some badges other Malaysian affiliates have already
              earned. Each one came with bonus credit and a profile badge.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {userAchievements
              .filter((a) => a.earned)
              .slice(0, 6)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-2 rounded-md border bg-muted/30 p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-shopee/10 text-shopee">
                    <a.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{a.title}</p>
                      <Star className="size-3 shrink-0 fill-shopee text-shopee" />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                      {a.description}
                    </p>
                    <p className="mt-1 text-[10px] text-shopee">
                      Earned {a.earnedDate} · +RM 10 credit
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExamplesOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-shopee hover:bg-shopee-dark text-white gap-2"
              onClick={() => {
                setExamplesOpen(false)
                scrollToNextAchievement()
              }}
            >
              <Target className="size-4" />
              Show my next goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
