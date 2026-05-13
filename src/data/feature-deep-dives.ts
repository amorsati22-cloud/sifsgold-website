import type { FeatureDeepDiveConfig } from "@/types/feature-deep-dive";

export const FEATURE_HUB_LINKS: {
  href: string;
  title: string;
  blurb: string;
  icon: string;
}[] = [
  {
    href: "/features/booking",
    title: "Booking & Scheduling",
    blurb: "Deposits, waitlists, multi-chair calendars, and client-ready confirmations.",
    icon: "Calendar",
  },
  {
    href: "/features/health-hub",
    title: "Health Hub",
    blurb: "Optional daily pulse, med tracker, and cycle sync — opt-in only, privacy-first.",
    icon: "Heart",
  },
  {
    href: "/features/photo-studio",
    title: "Photo Studio",
    blurb: "Before/after, healing timelines, look books, and comp-ready sets with consent.",
    icon: "Camera",
  },
  {
    href: "/features/music",
    title: "Music & Sif's Sounds Studio",
    blurb: "Session soundtracks, rights-safe libraries, and branded in-app listening.",
    icon: "Music",
  },
  {
    href: "/features/education",
    title: "Education & State Boards",
    blurb: "Study paths, CE tracking, and mentor match alongside live tools.",
    icon: "GraduationCap",
  },
  {
    href: "/features/community",
    title: "The Gold Collective",
    blurb: "Roles, reputation, and Sif's Advocates keeping standards high.",
    icon: "Users",
  },
  {
    href: "/features/payments",
    title: "Payments & Operations",
    blurb: "Stripe Connect, tips, gift cards, and calmer tax season paperwork.",
    icon: "CreditCard",
  },
  {
    href: "/features/privacy",
    title: "Privacy & Trust",
    blurb: "No ads, no data selling, Tier A encryption, and clear consent rails.",
    icon: "Shield",
  },
  {
    href: "/features/ai",
    title: "AI tools",
    blurb: "Vision assists, coaching guardrails, and scheduling intelligence you control.",
    icon: "Brain",
  },
  {
    href: "/features/state-boards",
    title: "State Board Prep",
    blurb: "Fifty states, fifty boards, deep question banks, and CE hour visibility.",
    icon: "BookOpen",
  },
  {
    href: "/features/brand-deals",
    title: "Brand Deal Marketplace",
    blurb: "Filterable matchmaking between brands and creators with fair economics.",
    icon: "ShoppingBag",
  },
  {
    href: "/features/marketplace",
    title: "Beauty Supply Store",
    blurb: "Curated retail tied to services, protocols, and chair-side education.",
    icon: "Store",
  },
];

const booking: FeatureDeepDiveConfig = {
  slug: "booking",
  source: "feature_booking_waitlist",
  pageTitle: "Booking & Scheduling — deposits, waitlists, and calm calendars",
  pageDescription:
    "Multi-mode booking, deposits, waitlists, and client confirmations built for busy salons, studios, and solo chairs in The Gold Collective.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Booking & Scheduling",
  heroTagline: "Turn chaos into choreography — for clients, providers, and front desks.",
  heroIcon: "Calendar",
  whatItIs:
    "Booking & Scheduling is the operating rhythm of The Gold Collective: it aligns availability, deposits, waitlists, and reminders so clients land in the right chair at the right time. It is built for walk-in culture, strict medical-adjacent timing, and hybrid teams — without forcing everyone into the same template.",
  grid: [
    {
      icon: "Calendar",
      title: "Multi-mode calendars",
      description: "Switch between appointment-first, hybrid walk-in, and event blocks without breaking downstream staff.",
    },
    {
      icon: "Wallet",
      title: "Deposits that feel fair",
      description: "Configurable holds for large transformations, cancellations, and high-demand Saturdays.",
    },
    {
      icon: "Users",
      title: "Team-aware routing",
      description: "Skills, stations, and seniority respected so the right provider is booked by default.",
    },
    {
      icon: "Sparkles",
      title: "Waitlist automation",
      description: "Fair rotation with transparent wait estimates — fewer hallway debates.",
    },
    {
      icon: "Shield",
      title: "Consent-aware confirmations",
      description: "Clients see what they agreed to before they arrive — deposits, policies, and prep instructions.",
    },
    {
      icon: "Package",
      title: "Retail-aware timing",
      description: "Buffer time for consults, color processing, and checkout without stacking impossible gaps.",
    },
  ],
  flow: [
    {
      title: "Set your modes",
      description: "Define booking rules per location, provider, and service — including deposits and buffers.",
    },
    {
      title: "Clients book or join the list",
      description: "Self-serve booking or waitlist entry with clear expectations and confirmations.",
    },
    {
      title: "Automations nudge everyone",
      description: "Reminders, prep steps, and rebooking prompts stay on-brand and calm.",
    },
    {
      title: "Front desk sees one truth",
      description: "A single schedule layer so substitutions and walk-ins do not fork reality.",
    },
  ],
  whoBenefits: [
    { label: "Solo providers", description: "Protect focus time while still looking professional to new clients." },
    { label: "Front desk teams", description: "Fewer double-books and clearer answers when the floor is loud." },
    { label: "Multi-chair salons", description: "Fair utilization without turning managers into traffic cops." },
    { label: "Med-adjacent studios", description: "Spacing rules and documentation reminders that respect scope." },
    { label: "Clients", description: "Predictable confirmations and rebooking windows that match real life." },
    { label: "Gold Partners", description: "Cleaner cohorts for education and activations tied to real appointments." },
  ],
  faqs: [
    {
      question: "Does this replace my POS?",
      answer:
        "Booking is the schedule of record inside The Gold Collective. Commerce and payouts live alongside it — integrations evolve with launch feedback from Sif's Advocates.",
    },
    {
      question: "Can I keep walk-ins?",
      answer: "Yes. Hybrid modes are first-class — appointments and walk-ins can coexist with fair waitlist logic.",
    },
    {
      question: "How do deposits show up for clients?",
      answer: "Clients see plain-language totals, policies, and receipts — no surprise holds after the fact.",
    },
    {
      question: "What about time zones and travel?",
      answer: "Provider and location time zones anchor the calendar so remote consults and travel blocks stay honest.",
    },
    {
      question: "Will my team need training?",
      answer: "Flows mirror how great shops already work — with guardrails so new hires do not invent their own system.",
    },
  ],
};

const healthHub: FeatureDeepDiveConfig = {
  slug: "health-hub",
  source: "feature_health_hub_waitlist",
  pageTitle: "Health Hub — opt-in wellness tracking inside The Gold Collective",
  pageDescription:
    "Optional daily pulse, medication reminders, and cycle sync with Tier A zero-knowledge encryption — tracking tools, not medical advice.",
  heroEyebrow: "Platform pillar · opt-in only",
  heroTitle: "Health Hub",
  heroTagline: "Sensitive data stays yours — enable only what helps your day, with clear exits.",
  heroIcon: "Heart",
  whatItIs:
    "Health Hub is an entirely optional space for members who want lightweight wellness context next to their beauty, grooming, fitness, and fashion workflows. Nothing here is medical advice: these are tracking tools that help you notice patterns, remember routines, and prepare for appointments — only after you explicitly opt in. Tier A zero-knowledge encryption applies to all Health Hub data, and you can pause or delete it anytime.",
  grid: [
    {
      icon: "Heart",
      title: "Daily pulse (opt-in)",
      description: "Subjective check-ins you choose — energy, stress, sleep notes — never inferred without permission.",
    },
    {
      icon: "Package",
      title: "Medication tracker (opt-in)",
      description: "Reminder rails for prescriptions you add yourself — not dosing instructions from the platform.",
    },
    {
      icon: "Calendar",
      title: "Cycle sync (optional for anyone with a cycle)",
      description: "Inclusive language and privacy defaults — track only if it helps you plan services and self-care.",
    },
    {
      icon: "Lock",
      title: "Tier A zero-knowledge encryption",
      description: "Health Hub payloads are designed for zero-knowledge posture — separate from public profile data.",
    },
    {
      icon: "Shield",
      title: "Clear separation from bookings",
      description: "Providers see only what you explicitly share for appointment safety — never the whole vault by default.",
    },
    {
      icon: "Users",
      title: "Advocate-reviewed UX",
      description: "Sif's Advocates help us keep language humble, inclusive, and free of medical overreach.",
    },
  ],
  flow: [
    {
      title: "Choose to enable Health Hub",
      description: "You see scope, risks, and plain-language permissions before anything is stored.",
    },
    {
      title: "Add only what helps you",
      description: "Pulse, medications, and cycle fields are modular — leave entire sections off if you prefer.",
    },
    {
      title: "Share narrowly for appointments",
      description: "If a provider needs context (for example contraindications), you pick the fields and duration.",
    },
    {
      title: "Pause or wipe instantly",
      description: "Global off switch and deletion paths stay obvious — no maze of settings.",
    },
  ],
  whoBenefits: [
    { label: "Clients who want context", description: "Keep personal signals private while still preparing for services." },
    { label: "Athletes and performers", description: "Track readiness without mixing sensitive notes into DMs." },
    { label: "Anyone with a cycle", description: "Optional tracking with inclusive copy — never assumed by gender presentation." },
    { label: "Providers who respect boundaries", description: "Receive only what clients choose to disclose for that visit." },
    { label: "Gold Partners building education", description: "Run programs with consent-first data practices baked in." },
  ],
  faqs: [
    {
      question: "Is this medical advice?",
      answer:
        "No. Health Hub offers tracking tools, not diagnosis or treatment guidance. Always consult licensed clinicians for medical decisions.",
    },
    {
      question: "Who can see my Health Hub data?",
      answer:
        "By default, only you. If you share fields for a booking, that disclosure is explicit, scoped, and revocable.",
    },
    {
      question: "What does zero-knowledge mean here?",
      answer:
        "We architect Health Hub data for Tier A zero-knowledge encryption — minimizing what operators can read while preserving your ability to recover access securely.",
    },
    {
      question: "Do I have to use cycle tracking?",
      answer:
        "No. Cycle sync is optional for anyone with a cycle to track — the entire module can remain off.",
    },
    {
      question: "Can I export or delete my data?",
      answer: "Yes. Export and deletion paths are part of the launch checklist — privacy is not a footnote.",
    },
  ],
};

const photoStudio: FeatureDeepDiveConfig = {
  slug: "photo-studio",
  source: "feature_photo_studio_waitlist",
  pageTitle: "Photo Studio — consent-first media for pros and talent",
  pageDescription:
    "Before/after sets, healing timelines, look books, and comp cards with consent, versioning, and role-aware access in The Gold Collective.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Photo Studio",
  heroTagline: "Beautiful media with receipts — consent, context, and calm organization.",
  heroIcon: "Camera",
  whatItIs:
    "Photo Studio is where visual proof lives without becoming a liability. It connects before/after timelines, look books, digitals, and comp cards to the same consent rails as booking and education — so clients, models, and providers all see the right image for the right moment. Healing checkpoints and session notes stay adjacent to the pixels they belong to.",
  grid: [
    { icon: "Camera", title: "Before / after sets", description: "Standardized angles and lighting prompts for fair comparisons over time." },
    { icon: "Calendar", title: "Healing timelines", description: "Optional checkpoints for peels, tattoos, and lash fills — always client-controlled." },
    { icon: "BookOpen", title: "Look books & line sheets", description: "Fashion and retail teams keep sets tied to SKUs, seasons, and approvals." },
    { icon: "Users", title: "Comp cards & digitals", description: "Agency-ready packages with usage windows and guardian workflows where required." },
    { icon: "Lock", title: "Role-aware galleries", description: "Assistants, providers, and partners see only what their role requires." },
    { icon: "Shield", title: "Consent versioning", description: "Know which release covers which shoot — disputes get shorter, not louder." },
  ],
  flow: [
    { title: "Capture with intent", description: "Pick the template: clinical, editorial, or portfolio — the app nudges missing fields early." },
    { title: "Attach consent", description: "Clients confirm scope, usage, and retention before images leave the private vault." },
    { title: "Organize by story", description: "Sessions, outfits, and services stay threaded so fills and follow-ups stay honest." },
    { title: "Share on purpose", description: "Time-boxed links for castings, coaches, or retail partners — watermarks when you need them." },
  ],
  whoBenefits: [
    { label: "Estheticians & injectors", description: "Comparable angles for consults without messy camera rolls." },
    { label: "Tattoo & piercing studios", description: "Healing documentation with BBP-aware habits." },
    { label: "Lash & brow artists", description: "Map photos that survive weeks between fills." },
    { label: "Models & agencies", description: "Digitals and packages that respect minors and usage contracts." },
    { label: "Brands & educators", description: "Campaign and classroom assets with clear rights." },
  ],
  faqs: [
    { question: "Who owns the photos?", answer: "Clients and talent retain rights unless a contract you upload says otherwise — the platform tracks the release, not the drama." },
    { question: "Can I turn off cloud sync?", answer: "Launch controls prioritize least sharing by default; offline-first details ship with advocate feedback." },
    { question: "How are sensitive medical photos handled?", answer: "They live behind Health Hub and clinical privacy patterns — separate visibility from marketing galleries." },
    { question: "Do you compress images?", answer: "We balance fidelity and speed per use case — clinical comparables keep higher fidelity than social previews." },
  ],
};

const music: FeatureDeepDiveConfig = {
  slug: "music",
  source: "feature_music_waitlist",
  pageTitle: "Music & Sif's Sounds Studio — session soundtracks, safely",
  pageDescription:
    "Rights-aware libraries, branded listening, and session soundtracks for pros who want atmosphere without copyright roulette.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Music & Sif's Sounds Studio",
  heroTagline: "Set the mood in-app — without stealing from artists.",
  heroIcon: "Music",
  whatItIs:
    "Sif's Sounds Studio gives providers and studios a sanctioned lane for music inside The Gold Collective — curated stations, session playlists, and optional branded audio moments that respect licensing. It is designed so ambiance never becomes a legal afterthought for Gold Partners or solo chairs.",
  grid: [
    { icon: "Music", title: "Rights-aware libraries", description: "Stations built from licensed catalogs — not random uploads from the staff." },
    { icon: "Sparkles", title: "Session soundtracks", description: "Match energy to service type — calm facials vs high-tempo fades." },
    { icon: "Users", title: "Shared room audio", description: "Front desk and floor agree on volume curves and do-not-play lists." },
    { icon: "Shield", title: "DMCA-conscious defaults", description: "No personal streaming logins embedded in client-facing surfaces." },
    { icon: "Store", title: "Brand audio moments", description: "Gold Partners can sponsor stations that still feel on-brand for the room." },
    { icon: "Calendar", title: "Timer-linked fades", description: "Music eases when processing timers hit — small detail, big professionalism." },
  ],
  flow: [
    { title: "Pick a station or build a list", description: "Start from templates vetted with Sif's Advocates." },
    { title: "Link to appointment type", description: "Color, massage, or runway block pulls the right default." },
    { title: "Clients hear optional audio", description: "Waiting room and treatment room modes stay separate." },
    { title: "Log usage for partners", description: "Partners see aggregate listening — not private client dossiers." },
  ],
  whoBenefits: [
    { label: "Salons & barbershops", description: "Consistent vibe without one rogue Bluetooth speaker." },
    { label: "Fitness studios", description: "Class tempos and cooldowns that match coach plans." },
    { label: "Fashion sets", description: "Runway rehearsal tracks with clear licensing paperwork." },
    { label: "Solo providers", description: "Professional sound without hiring a DJ each Saturday." },
  ],
  faqs: [
    { question: "Can I use my own playlists?", answer: "Personal uploads are restricted to avoid copyright risk — licensed lanes are the default." },
    { question: "Will this work offline?", answer: "Caching strategies are on the roadmap with advocate-led testing in low-signal suites." },
    { question: "Does music slow the app?", answer: "Audio streams lazily and respects data saver modes on client devices." },
    { question: "What about explicit content?", answer: "Station policies and room locks keep family-friendly locations safe by default." },
  ],
};

const education: FeatureDeepDiveConfig = {
  slug: "education",
  source: "feature_education_waitlist",
  pageTitle: "Education & State Boards — study, CE, and mentors together",
  pageDescription:
    "Board-aligned study, CE hour tracking, and mentor match living next to the same tools students will use as pros.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Education & State Boards",
  heroTagline: "Clock hours, crush exams, and graduate into workflows you already know.",
  heroIcon: "GraduationCap",
  whatItIs:
    "Education inside The Gold Collective connects schools, students, and working pros through shared rails: board-aligned question banks, CE hour tracking, and mentor match with Sif's Advocates. The goal is simple — reduce the cliff between classroom software and real floor software.",
  grid: [
    { icon: "BookOpen", title: "Board-aligned study modes", description: "Scenario drills, sanitation games, and timed practice that feel like the real exam." },
    { icon: "Calendar", title: "CE hour tracking", description: "Attach certificates, reminders, and supervisor approvals where your state requires them." },
    { icon: "Users", title: "Mentor match", description: "Pair students with advocates who speak their discipline and state context." },
    { icon: "Sparkles", title: "Bridge to Licensed Pro", description: "Graduate accounts without losing history or hours." },
    { icon: "Shield", title: "Integrity tooling", description: "Academic honesty prompts and audit trails for institutions." },
    { icon: "Map", title: "State-aware content flags", description: "When rules diverge, learners see the right module for their board." },
  ],
  flow: [
    { title: "Pick your state & pathway", description: "Student, assistant, or renewal — the dashboard adapts." },
    { title: "Study in short bursts", description: "Mobile-first drills that respect clinical schedules." },
    { title: "Log hours with proof", description: "Supervisors get clear queues instead of inbox archaeology." },
    { title: "Launch into pro mode", description: "Same login, new permissions — mentors stay one tap away." },
  ],
  whoBenefits: [
    { label: "Students", description: "Board prep that fits between clients and commutes." },
    { label: "Schools", description: "Cohort analytics without invasive surveillance." },
    { label: "Working pros renewing", description: "CE reminders tied to the calendar you already live in." },
    { label: "Sif's Advocates", description: "Mentorship rails that scale without burning out volunteers." },
  ],
  faqs: [
    { question: "Do you guarantee I will pass?", answer: "No platform can promise outcomes — we provide structured prep and transparency about coverage." },
    { question: "How often is content updated?", answer: "Updates follow board changes with versioning so instructors know what changed." },
    { question: "Can employers verify hours?", answer: "Yes — export packets designed for audits and HR checks." },
    { question: "Is mentor match required?", answer: "No — it is optional, but encouraged where programs require mentorship hours." },
  ],
};

const community: FeatureDeepDiveConfig = {
  slug: "community",
  source: "feature_community_waitlist",
  pageTitle: "The Gold Collective — community, reputation, and Sif's Advocates",
  pageDescription:
    "Roles, reputation, programs, and Sif's Advocates that keep The Gold Collective professional without turning social feeds into a marketplace free-for-all.",
  heroEyebrow: "Platform pillar",
  heroTitle: "The Gold Collective",
  heroTagline: "Belonging with boundaries — mentorship, programs, and trust that scale.",
  heroIcon: "Users",
  whatItIs:
    "The Gold Collective is the social fabric of the platform — not an endless feed of ads, but structured spaces for mentorship, cohort programs, and reputation earned through real work. Sif's Advocates set the tone: generous with knowledge, strict about consent and safety. Gold Partners meet the community on those same rails.",
  grid: [
    { icon: "Users", title: "Role-aware spaces", description: "Students, pros, brands, and clients see contexts that match their responsibilities." },
    { icon: "Shield", title: "Safety tooling", description: "Reporting, moderation, and escalation tuned for intimate service industries." },
    { icon: "Sparkles", title: "Programs & challenges", description: "Run cohorts with checkpoints instead of chaotic group chats." },
    { icon: "Heart", title: "Recognition that is not vanity", description: "Badges tied to verified milestones — not purchased clout." },
    { icon: "BookOpen", title: "Office hours", description: "Advocates host live sessions with calendars that respect their capacity." },
    { icon: "CreditCard", title: "Partner activations", description: "Gold Partners sponsor education — not surveillance ads." },
  ],
  flow: [
    { title: "Join with a role", description: "Permissions default to least privilege for your pathway." },
    { title: "Participate in programs", description: "Structured prompts keep threads on-topic and inclusive." },
    { title: "Earn trust signals", description: "Reputation accrues from verified work — not follower counts." },
    { title: "Escalate safely", description: "Moderation routes protect reporters and witnesses." },
  ],
  whoBenefits: [
    { label: "New pros", description: "Find mentors without cold-DM roulette." },
    { label: "Schools", description: "Host cohorts with visibility into engagement, not private DMs." },
    { label: "Brands", description: "Educate through advocates instead of spray-and-pray ads." },
    { label: "Clients", description: "See community proof without exposing private threads." },
  ],
  faqs: [
    { question: "Is this another social network?", answer: "No — it is purpose-built for professional growth and programs, not infinite scrolling." },
    { question: "How are Sif's Advocates vetted?", answer: "Multi-step applications, reference checks, and ongoing accountability — details ship in the advocate handbook." },
    { question: "Can I mute brands?", answer: "Yes — controls prioritize member comfort; partner surfaces are labeled and optional." },
    { question: "What about minors?", answer: "Guardian workflows and restricted modes are default-on where fashion and education overlap." },
  ],
};

const payments: FeatureDeepDiveConfig = {
  slug: "payments",
  source: "feature_payments_waitlist",
  pageTitle: "Payments & Operations — Stripe Connect, tips, and calmer taxes",
  pageDescription:
    "Stripe Connect payouts, tips, gift cards, and operations data that keep chairs, suites, and studios solvent without spreadsheet nights.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Payments & Operations",
  heroTagline: "Money moves with the same clarity as your calendar.",
  heroIcon: "CreditCard",
  whatItIs:
    "Payments & Operations unifies deposits, checkout, tips, gift cards, and payout splits on Stripe Connect rails — so owners, booth renters, and solo providers see the same numbers clients paid. Tax-friendly exports and role-based visibility keep audits shorter and tempers cooler.",
  grid: [
    { icon: "CreditCard", title: "Stripe Connect payouts", description: "Split earnings cleanly between providers, locations, and partners." },
    { icon: "Wallet", title: "Tips without awkward cash runs", description: "Clients tip in flow; staff see transparent distribution rules." },
    { icon: "Package", title: "Gift cards & packages", description: "Prepaid services that respect expiration law and state-specific rules." },
    { icon: "Calendar", title: "Refunds tied to appointments", description: "Policy templates that match how you actually enforce cancellations." },
    { icon: "Shield", title: "Role-based finance views", description: "Booth renters see their lane; owners see consolidated truth." },
    { icon: "Sparkles", title: "Exports for accountants", description: "CSV bundles that line up with deposit batches." },
  ],
  flow: [
    { title: "Connect accounts once", description: "KYC-friendly flows with plain-language status for every provider." },
    { title: "Clients pay in-context", description: "Checkout matches the appointment, add-ons, and taxes shown upfront." },
    { title: "Tips and splits settle nightly", description: "Automations follow your house rules — not spreadsheets on Sunday." },
    { title: "Close the month calmly", description: "Reconciliation dashboards highlight anomalies instead of hiding them." },
  ],
  whoBenefits: [
    { label: "Solo providers", description: "Professional checkout without a hardware zoo." },
    { label: "Booth renters", description: "Transparent splits and statements they can send to lenders." },
    { label: "Multi-location owners", description: "Roll-ups that still respect per-site nuances." },
    { label: "Clients", description: "Receipts that match what they experienced at checkout." },
  ],
  faqs: [
    { question: "Does Sif's Gold hold my money?", answer: "Funds flow through Stripe Connect with industry-standard settlement — we do not sit on balances as a bank." },
    { question: "How are chargebacks handled?", answer: "Dispute workflows surface evidence tied to appointments and signed policies." },
    { question: "Can I pass Stripe fees through?", answer: "Configurable surcharge rules where law allows — always labeled at checkout." },
    { question: "What about sales tax?", answer: "Stripe Tax hooks help automate common cases; accountants still review final filings." },
  ],
};

const privacy: FeatureDeepDiveConfig = {
  slug: "privacy",
  source: "feature_privacy_waitlist",
  pageTitle: "Privacy & Trust — no ads, no data selling, Tier A encryption",
  pageDescription:
    "Privacy-first defaults, Tier A encryption for sensitive categories, and consent surfaces that stay readable — with policies documented at /legal/privacy.",
  heroEyebrow: "Platform pillar",
  heroTitle: "No ads. No data selling. Ever.",
  heroTagline: "Privacy & Trust — Tier A encryption where it matters, consent you can explain out loud.",
  heroIcon: "Shield",
  whatItIs:
    "Privacy & Trust is the spine of The Gold Collective: we do not monetize attention with ads, and we do not sell member data — full stop. Sensitive categories like Health Hub use Tier A zero-knowledge encryption patterns, while everyday commerce and booking data use strict least-privilege access. Policies and subprocessors live in our privacy center so schools, studios, and partners can diligence us without NDAs for basics.",
  grid: [
    { icon: "Shield", title: "No ads in the product experience", description: "We do not auction your attention to the highest bidder — partners meet you in context, not through creepy retargeting." },
    { icon: "Lock", title: "Tier A encryption for sensitive vaults", description: "Health Hub and clinical-adjacent media use hardened encryption lanes with separate keys." },
    { icon: "Users", title: "Consent toggles you can audit", description: "Every category of data has a plain-language explanation and an obvious switch." },
    { icon: "FileText", title: "Data minimization by design", description: "Forms ask for what the appointment needs — not everything you might ever know." },
    { icon: "Sparkles", title: "Transparency for partners", description: "Gold Partners see aggregate outcomes — not shadow profiles of clients." },
    { icon: "BookOpen", title: "Policy docs that stay current", description: "Linked legal pages versioned with change logs — diligence friendly." },
  ],
  flow: [
    { title: "See defaults clearly", description: "Onboarding explains what is on, what is off, and why." },
    { title: "Tune category by category", description: "Marketing, health, and commerce toggles stay separate — no bundled traps." },
    { title: "Share with purpose", description: "Time-boxed disclosures for bookings, castings, or school oversight." },
    { title: "Export or delete", description: "Self-serve paths for members and admins — not a support ticket maze." },
  ],
  whoBenefits: [
    { label: "Clients", description: "Confidence that sensitive notes are not marketing fuel." },
    { label: "Studios & schools", description: "Compliance storytelling that holds up with legal counsel." },
    { label: "Providers", description: "Fewer awkward conversations about where photos and notes live." },
    { label: "Gold Partners", description: "Ethical activations with receipts — not surveillance optics." },
  ],
  faqs: [
    { question: "Where can I read the full privacy policy?", answer: "Visit /legal/privacy for the latest policy, subprocessors, and contact paths." },
    { question: "Do you train AI on my photos?", answer: "We default to no training on member media without explicit, revocable opt-in — detailed in policy." },
    { question: "What happens during a breach?", answer: "Incident response playbooks, notifications, and regulator timelines are documented for launch readiness." },
    { question: "Can EU or UK members use the platform?", answer: "International readiness is on the roadmap — sign up for updates as we expand jurisdictional packs." },
    { question: "How do minors work?", answer: "Guardian consent, restricted modes, and fashion-specific workflows ship with advocate review." },
  ],
};

const ai: FeatureDeepDiveConfig = {
  slug: "ai",
  source: "feature_ai_waitlist",
  pageTitle: "AI tools — vision assists, coaching guardrails, scheduling smarts",
  pageDescription:
    "Human-in-the-loop AI for scheduling, coaching prompts, and vision assists — with medical guardrails and clear opt-outs inside The Gold Collective.",
  heroEyebrow: "Platform pillar",
  heroTitle: "AI tools",
  heroTagline: "Augment judgment — never replace licensed scope.",
  heroIcon: "Brain",
  whatItIs:
    "Our AI tools focus on operational lift: drafting reminders, summarizing long threads with consent, suggesting schedule patches, and offering coaching prompts that Sif's Advocates review for tone and safety. Medical guardrails block diagnostic language — the assistant points to tracking and education, not treatment plans.",
  grid: [
    { icon: "Brain", title: "Scheduling intelligence", description: "Detects risky overlaps, travel buffers, and double-book patterns before clients notice." },
    { icon: "Camera", title: "Vision assists (opt-in)", description: "Flag when before/after sets are incomplete — never auto-judge clinical outcomes." },
    { icon: "Shield", title: "Medical guardrails", description: "Hard stops on diagnostic claims; prompts redirect to licensed professionals." },
    { icon: "Users", title: "Human-in-the-loop edits", description: "Providers approve anything client-facing — nothing ships silently." },
    { icon: "Sparkles", title: "Coaching tone controls", description: "Advocate-vetted voice packs for education and community posts." },
    { icon: "Lock", title: "Data use transparency", description: "Clear logs for which features touched which fields — auditable for schools and med-adjacent studios." },
  ],
  flow: [
    { title: "Opt in per workspace", description: "Owners decide which AI surfaces are enabled for staff." },
    { title: "Draft privately", description: "Suggestions appear inline — humans accept, edit, or discard." },
    { title: "Ship with accountability", description: "Client-facing sends require explicit confirmation." },
    { title: "Review outcomes", description: "Telemetry stays aggregate — no secret per-client model training by default." },
  ],
  whoBenefits: [
    { label: "Front desk", description: "Fewer repetitive messages without sounding robotic." },
    { label: "Educators", description: "Scenario prompts that still feel human and inclusive." },
    { label: "Med-adjacent admins", description: "Guardrails that reduce risk before posts go live." },
    { label: "Busy owners", description: "Scheduling hints that respect house rules." },
  ],
  faqs: [
    { question: "Will AI replace providers?", answer: "No — it removes busywork so humans spend more time in the chair or classroom." },
    { question: "Can I turn AI off completely?", answer: "Yes — workspace-level killswitches are mandatory in our design spec." },
    { question: "What about bias?", answer: "Advocates and diverse testers review prompts; we publish known limitations." },
    { question: "Does AI touch Health Hub data?", answer: "Only with explicit, scoped consent — defaults keep health payloads isolated." },
  ],
};

const stateBoards: FeatureDeepDiveConfig = {
  slug: "state-boards",
  source: "feature_state_boards_waitlist",
  pageTitle: "State Board Prep — 50 states, deep question banks, CE visibility",
  pageDescription:
    "Fifty states, fifty boards, roughly three hundred questions per state at launch density, plus CE hour tracking teasers for major jurisdictions.",
  heroEyebrow: "Platform pillar",
  heroTitle: "State Board Prep",
  heroTagline: "Fifty states. Fifty boards. Three hundred questions per state — drilled the way boards actually ask.",
  heroIcon: "BookOpen",
  whatItIs:
    "State Board Prep is the deep licensure lane inside Education: every state board gets its own pathway with rich question banks — about three hundred questions per state at launch density — plus rationales written with Sif's Advocates. CE hour tracking hooks connect so renewals do not sneak up as a separate panic.",
  grid: [
    { icon: "Map", title: "Coverage map (all gold at launch)", description: "Visual snapshot of national coverage — every state activated day one for prep content." },
    { icon: "BookOpen", title: "Board-accurate stems", description: "Scenario-heavy items that mirror practical exams, not trivia apps." },
    { icon: "Calendar", title: "CE hour teasers", description: "See how many hours your renewal window expects — with links to deeper tracking." },
    { icon: "Users", title: "Mentor tie-ins", description: "Flag weak domains and pair with advocates who teach that unit." },
    { icon: "Shield", title: "Integrity mode", description: "Timed attempts, randomized pools, and institution overrides where needed." },
    { icon: "Sparkles", title: "Study games", description: "Micro drills for sanitation, anatomy, and client communication." },
  ],
  flow: [
    { title: "Pick your state board", description: "The map highlights your pathway — all gold at launch." },
    { title: "Baseline diagnostic", description: "Know which domains to prioritize before cram night." },
    { title: "Drill with rationales", description: "Understand why the right answer is right — not just what to memorize." },
    { title: "Simulate exam day", description: "Timed mixes that mirror official weightings." },
  ],
  whoBenefits: [
    { label: "Cosmetology students", description: "High-yield repetition with context that sticks." },
    { label: "Barbering candidates", description: "State-specific statutes and infection control emphasis." },
    { label: "Esthetics & nail pathways", description: "Domain splits that match practical stations." },
    { label: "Instructors", description: "Cohort dashboards that highlight class risk without shaming individuals in public feeds." },
  ],
  faqs: [
    { question: "Is three hundred questions per state enough?", answer: "It is the launch density — pools expand as boards update and advocates contribute new stems." },
    { question: "Do you cover practical exams?", answer: "Theory and practical checklists ship together; video upload details follow beta feedback." },
    { question: "How often are states updated?", answer: "When boards publish changes, we version shifts with clear instructor release notes." },
    { question: "Can schools white-label reports?", answer: "Exports for accreditation and insurers are on the roadmap with institution controls." },
  ],
};

const brandDeals: FeatureDeepDiveConfig = {
  slug: "brand-deals",
  source: "feature_brand_deals_waitlist",
  pageTitle: "Brand Deal Marketplace — 70% to creators, transparent matchmaking",
  pageDescription:
    "Seventy percent to creators and thirty percent to the platform on standard marketplace deals — with FTC endorsement rule (16 CFR Part 255) compliance tooling and a three-strike policy for undisclosed posts.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Brand Deal Marketplace",
  heroTagline: "Seventy percent to creators, thirty percent to the platform — generous splits with receipts.",
  heroIcon: "ShoppingBag",
  whatItIs:
    "The Brand Deal Marketplace connects Gold Partners with Sif's Advocates and verified creators through filterable discovery — specialty, region, audience tone, and compliance readiness. Standard marketplace splits send seventy percent to creators and thirty percent to the platform, documented up front. Built-in disclosure templates align with FTC endorsement rules (16 CFR Part 255), including auto-disclosure snippets and a three-strike system for repeated omissions.",
  grid: [
    { icon: "ShoppingBag", title: "Filterable discovery", description: "Brands search by lane, compliance tier, and content style — creators opt in to visibility." },
    { icon: "Shield", title: "FTC endorsement rule pack", description: "Auto-disclosure blocks, plain-language reminders, and audit trails for campaigns." },
    { icon: "Sparkles", title: "Three-strike enforcement", description: "Education-first warnings, then suspensions from paid deals for repeated undisclosed posts." },
    { icon: "Wallet", title: "Seventy / thirty economics", description: "Default split posted clearly — custom enterprise deals require mutual signatures." },
    { icon: "Users", title: "Advocate co-sign", description: "Sif's Advocates can vouch for fit without becoming unpaid agency staff." },
    { icon: "FileText", title: "Contract vault", description: "Store scopes, deliverables, and usage windows next to payouts." },
  ],
  flow: [
    { title: "Brand sets brief & budget", description: "Compliance toggles upfront — no surprise morality clauses buried on page nine." },
    { title: "Creators apply with portfolios", description: "Photo Studio and community proof travel with the application." },
    { title: "Match & disclose", description: "Approved creators get disclosure snippets injected into required surfaces." },
    { title: "Pay on delivery", description: "Stripe Connect releases funds when milestones verify — disputes have paperwork attached." },
  ],
  whoBenefits: [
    { label: "Micro-influencers", description: "Fair splits without negotiating blind." },
    { label: "Mid-size brands", description: "Regional activations with compliance receipts." },
    { label: "Agencies", description: "Roster oversight without spreadsheet hell." },
    { label: "Studios", description: "Protect junior staff from predatory brand outreach." },
  ],
  faqs: [
    { question: "Is the seventy / thirty split negotiable?", answer: "Enterprise and nonprofit packs can differ — everything is contractually explicit." },
    { question: "What counts as a strike?", answer: "Documented missing disclosures after automated and human review — appeals stay human-paced." },
    { question: "Do you verify followers?", answer: "We prioritize engagement quality signals over vanity counts — details ship in trust docs." },
    { question: "Can brands sponsor education only?", answer: "Yes — non-cash educational activations have their own compliance pack." },
  ],
};

const marketplace: FeatureDeepDiveConfig = {
  slug: "marketplace",
  source: "feature_marketplace_waitlist",
  pageTitle: "Beauty Supply Store — curated retail tied to services",
  pageDescription:
    "Curated beauty supply with bundles tied to services, protocols, and chair-side education inside The Gold Collective storefront rails.",
  heroEyebrow: "Platform pillar",
  heroTitle: "Beauty Supply Store",
  heroTagline: "Retail that remembers the service — bundles, refills, and education in one lane.",
  heroIcon: "Store",
  whatItIs:
    "The Beauty Supply Store is the commerce pillar for formulas, tools, and aftercare clients actually need — not random SKUs dumped beside checkout. Bundles attach to Photo Studio and booking protocols so recommendations stay consistent with what happened in the chair. Gold Partners can stock education-first kits without turning client lists into ad audiences.",
  grid: [
    { icon: "Store", title: "Curated catalogs", description: "SKUs vetted for authenticity and partner guidelines." },
    { icon: "Package", title: "Service-tied bundles", description: "Aftercare kits auto-suggested from the appointment record." },
    { icon: "Sparkles", title: "Chair-side education", description: "Short clips and QR deep links so clients use products correctly." },
    { icon: "CreditCard", title: "Storefront checkout", description: "Tax-aware totals with Stripe-backed payments." },
    { icon: "Users", title: "Multi-location inventory", description: "See what moves per site and which pros drive attachment." },
    { icon: "Shield", title: "Claims-aware merchandising", description: "Guardrails for regulated categories and state-specific labeling." },
  ],
  flow: [
    { title: "Provider recommends in context", description: "Retail suggestions pull from the service card — not memory." },
    { title: "Client reviews bundle", description: "Plain-language ingredients and return windows before purchase." },
    { title: "Checkout & pickup", description: "Ship-to-home or studio pickup with status pings." },
    { title: "Rebuy nudges", description: "Refill windows respect usage, not spam." },
  ],
  whoBenefits: [
    { label: "Salons & suites", description: "Attach retail to tickets without hard selling." },
    { label: "Clients", description: "Buy what matches the service they just received." },
    { label: "Brands", description: "Education-led distribution with measurable lift." },
    { label: "Educators", description: "Student kits aligned to curriculum modules." },
  ],
  faqs: [
    { question: "Do you dropship?", answer: "Fulfillment modes depend on partner integrations — launch focuses on partner-backed inventory." },
    { question: "Can I return opened product?", answer: "Policies vary by SKU category — each listing shows hygiene rules up front." },
    { question: "How do pros earn?", answer: "Commission structures are transparent per bundle — statements live next to payouts." },
    { question: "Is marketplace available internationally?", answer: "Initial launch targets US fulfillment — join the waitlist for regional expansion." },
  ],
};

export const FEATURE_DEEP_DIVES: Record<string, FeatureDeepDiveConfig> = {
  booking,
  "health-hub": healthHub,
  "photo-studio": photoStudio,
  music,
  education,
  community,
  payments,
  privacy,
  ai,
  "state-boards": stateBoards,
  "brand-deals": brandDeals,
  marketplace,
};

export function getFeatureDeepDive(slug: string): FeatureDeepDiveConfig | undefined {
  return FEATURE_DEEP_DIVES[slug];
}
