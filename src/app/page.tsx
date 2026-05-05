import type { ReactNode } from "react";
import {
  Award,
  BookOpen,
  Check,
  Crown,
  Gamepad2,
  GraduationCap,
  Heart,
  MessageSquareLock,
  Scissors,
  Sheet,
  Sparkles,
  Store,
  Tv,
  Users,
  UsersRound,
} from "lucide-react";
import { GoldButton } from "@/components/ui/GoldButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { StatCard } from "@/components/ui/StatCard";
import { LaunchCountdown } from "@/components/sections/LaunchCountdown";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { HERO_STARFIELD_PLACES } from "@/lib/hero-starfield";

type UserTypeCard = {
  icon: ReactNode;
  title: string;
  description: string;
  tag?: string;
};

const USER_TYPES: UserTypeCard[] = [
  {
    icon: <Scissors className="h-6 w-6" aria-hidden />,
    title: "Licensed Professionals",
    description:
      "Booking, analytics, client records, and everything to run your business.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" aria-hidden />,
    title: "Students",
    description:
      "State board prep, hour tracking, streaks, and your Bridge to licensure.",
  },
  {
    icon: <Users className="h-6 w-6" aria-hidden />,
    title: "Salons and Barbershops",
    description: "Floor management, staff scheduling, and The Floor or The Fade dashboard.",
  },
  {
    icon: <BookOpen className="h-6 w-6" aria-hidden />,
    title: "Beauty Schools",
    description: "Roster management, clinic scheduling, and board pass rate tracking.",
  },
  {
    icon: <Heart className="h-6 w-6" aria-hidden />,
    title: "Clients",
    description: "Find, book, and build relationships with your beauty pros.",
  },
  {
    icon: <Store className="h-6 w-6" aria-hidden />,
    title: "Storefronts",
    description: "Reach verified beauty professionals with your products.",
  },
  {
    icon: <Sparkles className="h-6 w-6" aria-hidden />,
    title: "Brand Partners",
    description: "Connect with the Sif's Advocates platform ambassador network.",
  },
  {
    icon: <Crown className="h-6 w-6" aria-hidden />,
    title: "Fashion Side (Coming June 30)",
    description:
      "Models, agencies, casting directors, designers, stylists, and producers.",
    tag: "Fashion Expansion",
  },
];

const PLATFORM_FEATURES: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <Gamepad2 className="h-6 w-6" aria-hidden />,
    title: "300+ Platform Games",
    description:
      "Skill-building, board prep, and business training games for every user type.",
  },
  {
    icon: <UsersRound className="h-6 w-6" aria-hidden />,
    title: "The Drop Community",
    description:
      "A beauty and fashion community where professionals connect, share, and grow.",
  },
  {
    icon: <Award className="h-6 w-6" aria-hidden />,
    title: "Gold Standard Score",
    description:
      "Your professional reputation score built from real booking behavior and client feedback.",
  },
  {
    icon: <Sheet className="h-6 w-6" aria-hidden />,
    title: "Green Sheet",
    description:
      "Income tracking, platform fees, product costs, and net profit in one financial dashboard.",
  },
  {
    icon: <MessageSquareLock className="h-6 w-6" aria-hidden />,
    title: "Pass a Note",
    description: "Encrypted professional messaging built for beauty. Not a generic chat tool.",
  },
  {
    icon: <Tv className="h-6 w-6" aria-hidden />,
    title: "Gold TV",
    description:
      "Short-form content from real beauty professionals. Created for the craft, not the algorithm.",
  },
];

const BRIDGE_CHECKS = [
  "Board Pass Verified",
  "Calendar Live",
  "First Client Ready",
] as const;

export default function HomePage() {
  return (
    <main>
      {/* Section 1 — Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-6 py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          {HERO_STARFIELD_PLACES.map(([top, left], i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white opacity-20"
              style={{ top: `${top}%`, left: `${left}%` }}
            />
          ))}
        </div>
        <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-gold to-teal" />
        <div className="relative z-20 flex max-w-4xl flex-col items-center text-center">
          <SectionBadge>Launching June 1–7, 2026</SectionBadge>
          <h1 className="mt-8 font-heading text-4xl font-bold text-white md:text-6xl">
            <span className="block">The Beauty Platform</span>
            <span className="mt-2 block">Built for</span>
            <span className="mt-2 block text-gold">Everyone</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-white/60">
            One platform for students, professionals, schools, salons, clients, and fashion
            talent. Built for every role, every discipline, every path in beauty.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-4 md:max-w-none md:flex-row md:flex-wrap md:items-center md:justify-center">
            <GoldButton label="Join the Waitlist" href="/#waitlist" variant="solid" size="lg" />
            <GoldButton
              label="See the Platform"
              href="/for-professionals"
              variant="outlined"
              size="lg"
            />
          </div>
          <p className="mt-6 text-xs text-white/40">
            No credit card required · Free to join the waitlist
          </p>
        </div>
      </section>

      {/* Section 2 — Countdown */}
      <LaunchCountdown />

      {/* Section 3 — Social proof */}
      <section className="border-y border-gold/20 bg-gold/5 py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col flex-wrap items-center justify-center gap-10 px-6 md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-12">
          <StatCard number="15,000+" label="State Board Questions" />
          <StatCard number="16" label="User Types Served" />
          <StatCard number="300+" label="Platform Games" />
          <StatCard number="2" label="Industries Covered" />
        </div>
      </section>

      {/* Section 4 — Who it's for */}
      <SectionWrapper className="bg-navy">
        <div className="text-center">
          <SectionBadge>Built for your role</SectionBadge>
          <h2 className="mt-6 font-heading text-3xl text-white md:text-4xl">
            Every role in beauty has a home here
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {USER_TYPES.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              tag={item.tag}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Section 5 — The Bridge */}
      <SectionWrapper className="bg-navy-dark">
        <div className="text-center lg:text-left">
          <SectionBadge>For students</SectionBadge>
          <h2 className="mt-6 font-heading text-3xl text-white md:text-4xl">
            Graduate with momentum, not just a license
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-base leading-relaxed text-white/70">
              The Bridge is the graduation transition built into the platform. Pass your boards,
              activate The Bridge, and your student profile converts to a professional profile
              with your booking calendar, service menu, and client records ready to go.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gold/10 p-2 text-gold">
                <Crown className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-heading text-xl text-gold">Bridge Activated</h3>
            </div>
            <p className="mt-2 text-sm text-white/50">
              Licensed Professional — Activated June 3, 2026
            </p>
            <ul className="mt-6 space-y-3">
              {BRIDGE_CHECKS.map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="h-5 w-5 shrink-0 text-teal" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      {/* Section 6 — Platform features */}
      <SectionWrapper className="bg-navy">
        <div className="text-center">
          <SectionBadge>What&apos;s inside</SectionBadge>
          <h2 className="mt-6 font-heading text-3xl text-white md:text-4xl">
            A full platform, not just a booking tool
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PLATFORM_FEATURES.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Section 7 — Waitlist CTA */}
      <SectionWrapper id="waitlist" className="bg-navy text-center">
        <h2 className="font-heading text-3xl text-white md:text-4xl">
          Get founding member access
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/60">
          Users who join during launch week — June 1–7, 2026 — receive a permanent Founding
          Member badge on their profile and priority access to every feature drop.
        </p>
        <div className="mt-10">
          <WaitlistForm />
        </div>
      </SectionWrapper>
    </main>
  );
}
