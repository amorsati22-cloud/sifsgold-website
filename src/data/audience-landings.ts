import type { AudienceLandingConfig } from "@/types/audience-landing";
import type { AudienceIconName } from "@/components/audience/audience-icons";

const pages: AudienceLandingConfig[] = [
{
    slug: "for-clients",
    source: "for_clients_waitlist",
    title: "For clients — book beauty, grooming, fitness, and fashion with confidence",
    description: "Discover vetted pros, keep preferences and history in one place, and rebook on rhythm — built for clients, not generic marketplaces.",
    eyebrow: "For clients",
    headline: "Your chair. Your rhythm. Your story.",
    subheadline: "Scout-style discovery, loyalty that follows the relationship, and rebooking windows tuned to color, cut, skin, and training cycles — all inside The Gold Collective.",
    heroBadge: undefined,
    openGraphTitle: "Your chair. Your rhythm. Your story.",
    pricingTierIds: ["client-free","client-plus","storefront-starter"],
    features: [
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Mood-first discovery",
            "description": "Match services to how you feel today — not endless scrolling through random listings."
      },
      {
            icon: "Target" as AudienceIconName,
            "headline": "Style preferences that stick",
            "description": "Save guardrails and goals so every pro sees the same version of great."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Beauty Clock rebooking",
            "description": "Land back in the chair when your color, cut, or skin routine actually needs you."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Loyalty with the relationship",
            "description": "Recognition that follows the pro you trust — not just one salon brand."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Clear communication",
            "description": "Structured updates, reminders, and consent trails you can actually find later."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Privacy-forward defaults",
            "description": "Share what is needed for the appointment — not your whole digital life."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for clients?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-pros",
    source: "for_pros_waitlist",
    title: "For licensed pros — one operating system for your chair or suite",
    description: "Licensed Pro tiers for booking, intake, photos, retail, and growth — with mentor access and student pathways inside The Gold Collective.",
    eyebrow: "For licensed professionals",
    headline: "Run the day like a pro — not like ten apps.",
    subheadline: "Service menus, booking modes, client records, photo studio, and license tracking in one flow. Built with Sif's Advocates so it respects real salon, barber, med spa, and studio realities.",
    heroBadge: undefined,
    openGraphTitle: "Run the day like a pro — not like ten apps.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","licensed-pro-premium"],
    features: [
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Menus that match reality",
            "description": "Services, add-ons, timing buffers, and notes that travel with the appointment."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Four booking modes",
            "description": "From strict deposits to walk-in friendly — configure what your market expects."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Photo studio & consent",
            "description": "Before/after sets with clear consent and organized client galleries."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Growth signals",
            "description": "See rebooking, retail attachment, and no-show patterns without spreadsheet archaeology."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Mentor match access",
            "description": "Connect with Sif's Advocates for board prep, technique, and business coaching rails."
      },
      {
            icon: "BadgeCheck" as AudienceIconName,
            "headline": "License tracking",
            "description": "Renewals and documentation reminders so your chair stays audit-ready."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for licensed professionals?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-students",
    source: "for_students_waitlist",
    title: "For students — board prep, hours, and mentorship in one lane",
    description: "Student Free and Student tiers with board prep, games, hour tracking, and mentor match — built for beauty and grooming learners in The Gold Collective.",
    eyebrow: "For students",
    headline: "Clock hours. Crush boards. Find mentors.",
    subheadline: "Study dashboards, hour tracking, and mentor match live next to the same tools you will use as a licensed pro — so graduation day is not day-zero on software.",
    heroBadge: undefined,
    openGraphTitle: "Clock hours. Crush boards. Find mentors.",
    pricingTierIds: ["student-free","student","licensed-pro-standard"],
    features: [
      {
            icon: "BookOpen" as AudienceIconName,
            "headline": "Board prep that scales",
            "description": "Start with core states on Student Free; unlock full coverage when you upgrade."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Hour tracking",
            "description": "Clock clinical and floor hours with supervisor visibility where required."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Mentor match",
            "description": "Pair with Sif's Advocates who have walked your path and speak your discipline."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Study games",
            "description": "Reinforce sanitation, anatomy, and client scenarios without stale PDFs alone."
      },
      {
            icon: "Target" as AudienceIconName,
            "headline": "Bridge to Licensed Pro",
            "description": "Graduate your profile into pro workflows without losing history."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Ethics & consent drills",
            "description": "Practice client communication with guardrails before you touch the public."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for students?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-schools",
    source: "for_schools_waitlist",
    title: "For schools — cohort visibility, hour verification, and employer pipelines",
    description: "Place students into salon-ready workflows with oversight, compliance reminders, and partner introductions through The Gold Collective.",
    eyebrow: "For schools & educators",
    headline: "Graduate operators — not app tourists.",
    subheadline: "Cohort dashboards, verified hours, and employer-ready portfolios sit on the same rails salons and studios use — so hiring managers see skills, not screenshots.",
    heroBadge: undefined,
    openGraphTitle: "Graduate operators — not app tourists.",
    pricingTierIds: ["student","salon-standard","salon-pro"],
    features: [
      {
            icon: "Users" as AudienceIconName,
            "headline": "Cohort oversight",
            "description": "Instructors see progress, risk flags, and readiness without invasive micromanagement."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Verified hour workflows",
            "description": "Supervisor sign-offs and audit trails that match common state expectations."
      },
      {
            icon: "BookOpen" as AudienceIconName,
            "headline": "Curriculum-aligned modules",
            "description": "Tie lessons to live tools students will use on the floor."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Placement analytics",
            "description": "Understand which partners hire your graduates and where to invest next."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Employer introductions",
            "description": "Warm intros to Gold Partners and verified studios seeking talent."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Compliance guardrails",
            "description": "Consent, media, and communications defaults tuned for educational settings."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for schools and educators?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-salons",
    source: "for_salons_waitlist",
    title: "For salons — multi-chair operations with retail and culture intact",
    description: "Salon Standard through Premium with team scheduling, inventory, marketing, and analytics — built for busy floors in The Gold Collective.",
    eyebrow: "For salons",
    headline: "Keep the floor calm. Keep the books honest.",
    subheadline: "Team scheduling, service consistency, retail attachment, and client rebooking — without turning stylists into overnight data analysts.",
    heroBadge: undefined,
    openGraphTitle: "Keep the floor calm. Keep the books honest.",
    pricingTierIds: ["salon-standard","salon-pro","salon-premium"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Team-aware scheduling",
            "description": "Avoid double-books while respecting seniority and specialty stations."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Retail that actually moves",
            "description": "Attach products to services with clear incentives and inventory signals."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Chair economics",
            "description": "See utilization, average ticket, and rebooking by provider — not vanity totals."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Front desk + provider comms",
            "description": "One thread model so clients never get conflicting answers."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Portfolio consistency",
            "description": "Brand-level photo standards without killing individual creative voice."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Role-based access",
            "description": "Assistants see what they need; owners see what they must."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for salon teams?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-fashion",
    source: "for_fashion_waitlist",
    title: "For fashion — castings, showrooms, and brand storytelling in one lane",
    description: "Model, agency, designer, and event workflows with portfolios, measurements, and approvals — fashion modules on the June 30 cadence inside The Gold Collective.",
    eyebrow: "For fashion",
    headline: "Run castings without chaos.",
    subheadline: "Portfolios, measurements, approvals, and logistics in one Gold Collective lane — so creatives spend time on the work, not the spreadsheet.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Run castings without chaos.",
    pricingTierIds: ["aspiring-model","working-model","fashion-designer-standard"],
    features: [
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Portfolio-ready media",
            "description": "Organize digitals, runway, and commercial sets with clear usage rights."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Measurements that stay current",
            "description": "Update sizes and constraints without DM archaeology."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Casting logistics",
            "description": "Hold windows, callbacks, and travel blocks with conflict checks."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Agency-ready roles",
            "description": "Separate access for bookers, parents/guardians where applicable, and creatives."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent and usage trails",
            "description": "Know who can share what — before the campaign ships."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Showroom and event rails",
            "description": "Line sheets, appointments, and buyer notes connected to the same profiles."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for fashion teams?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-brands",
    source: "for_brands_waitlist",
    title: "For brands — discovery, advocacy, and storefronts without spammy ads",
    description: "Brand Partner tiers for discovery campaigns, advocate programs, and measurable lift — aligned with The Gold Collective values.",
    eyebrow: "For brands",
    headline: "Reach people who already care.",
    subheadline: "Partner with Sif's Advocates and Gold Partners to place products where services happen — with reporting that respects privacy and real outcomes.",
    heroBadge: undefined,
    openGraphTitle: "Reach people who already care.",
    pricingTierIds: ["brand-partner-discovery","brand-partner-pro","brand-partner-enterprise"],
    features: [
      {
            icon: "Target" as AudienceIconName,
            "headline": "Advocate-aligned distribution",
            "description": "Meet clients in context — education, sampling, and authentic use cases."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Lift you can explain",
            "description": "Attach results to cohorts and regions without creepy surveillance marketing."
      },
      {
            icon: "Store" as AudienceIconName,
            "headline": "Storefront rails",
            "description": "Starter through Plus paths when you are ready to sell direct alongside partners."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Campaign briefs",
            "description": "Creative guardrails and compliance notes travel with every activation."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Brand safety defaults",
            "description": "Clear rules on claims, before/after usage, and regulated categories."
      },
      {
            icon: "Wallet" as AudienceIconName,
            "headline": "Partner economics",
            "description": "Transparent commercial rails so advocates are not an afterthought."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for brand teams?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-storefronts",
    source: "for_storefronts_waitlist",
    title: "For storefronts — sell products with the same trust as your services",
    description: "Storefront Starter through Plus for catalog, checkout, and fulfillment — connected to pros and clients in The Gold Collective.",
    eyebrow: "For storefronts",
    headline: "Commerce that feels like your brand.",
    subheadline: "Curated catalogs, bundles with services, and fulfillment signals that keep clients confident — not another generic web store bolted on sideways.",
    heroBadge: undefined,
    openGraphTitle: "Commerce that feels like your brand.",
    pricingTierIds: ["storefront-starter","storefront-standard","storefront-plus"],
    features: [
      {
            icon: "Package" as AudienceIconName,
            "headline": "Bundles that make sense",
            "description": "Pair retail with appointments and aftercare protocols automatically."
      },
      {
            icon: "CreditCard" as AudienceIconName,
            "headline": "Checkout clients understand",
            "description": "Clear totals, taxes handled at payment, and receipts that match reality."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Inventory signals",
            "description": "Know what moves per location and which pros drive attachment."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Post-purchase care",
            "description": "Automated education without drowning people in noise."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Claims-aware merchandising",
            "description": "Guardrails for regulated and sensitive categories."
      },
      {
            icon: "MapPin" as AudienceIconName,
            "headline": "Pickup and local options",
            "description": "Support BOPIS and studio pickup without operational spaghetti."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for storefront operators?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-barbers",
    source: "for_barbers_waitlist",
    title: "For barbers — the shop, in your pocket",
    description: "Walk-in queue, lineup tracking, beard protocols, and chair culture — built for barbers inside The Gold Collective.",
    eyebrow: "For barbers",
    headline: "The shop, in your pocket.",
    subheadline: "Walk-in queue, lineup tracking, beard protocols, and the brotherhood of the chair — built for barbers, not borrowed from beauty.",
    heroBadge: undefined,
    openGraphTitle: "The shop, in your pocket.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","barbershop-standard"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Walk-in queue intelligence",
            "description": "Fair rotation, wait estimates, and no mystery line drama."
      },
      {
            icon: "Scissors" as AudienceIconName,
            "headline": "Cut and beard protocols",
            "description": "Service templates that match fades, tapers, and beard geometry."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Lineup and shape records",
            "description": "Photo references clients consent to share for the next visit."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Chair-side comms",
            "description": "Quick updates without losing the vibe of a busy floor."
      },
      {
            icon: "Wallet" as AudienceIconName,
            "headline": "Deposits that feel fair",
            "description": "Simple rules for big transformations and busy Saturdays."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Sanitation checklists",
            "description": "Visible standards clients and inspectors can trust."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for barbers?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-tattoo-artists",
    source: "for_tattoo_artists_waitlist",
    title: "For tattoo artists — healing, stencils, and compliance in one studio OS",
    description: "Healing timelines, stencil libraries, aftercare consent, and bloodborne pathogens documentation for independent artists in The Gold Collective.",
    eyebrow: "For tattoo artists",
    headline: "Your studio, your style, your records.",
    subheadline: "Healing timelines, stencil libraries, aftercare consent, and bloodborne pathogens compliance — all in one place.",
    heroBadge: undefined,
    openGraphTitle: "Your studio, your style, your records.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","tattoo-shop-small"],
    features: [
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Stencil and flash libraries",
            "description": "Organize references, revisions, and client picks without lost DMs."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Session notes & placement",
            "description": "Track placement, session length, and future session planning."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Healing timelines",
            "description": "Automated aftercare reminders clients can follow without guesswork."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent and ID trails",
            "description": "Clear capture for minors where applicable and medical considerations."
      },
      {
            icon: "FileText" as AudienceIconName,
            "headline": "BBP documentation",
            "description": "Logs and training reminders aligned to common health department expectations."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Healing progress photos",
            "description": "Optional check-ins with explicit consent and private galleries."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for tattoo artists?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-nail-techs",
    source: "for_nail_techs_waitlist",
    title: "For nail techs — art, chemistry, and rebooking on rhythm",
    description: "Design archives, product compatibility notes, soak-off timing, and fill schedules tuned to nail reality in The Gold Collective.",
    eyebrow: "For nail techs",
    headline: "Art that lasts starts with the record.",
    subheadline: "Design archives, chemistry notes, soak-off timing, and fill windows that keep sets strong — without sticky notes on every lamp.",
    heroBadge: undefined,
    openGraphTitle: "Art that lasts starts with the record.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","salon-standard"],
    features: [
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Design archives",
            "description": "Save sets, charms, and palettes with quick recall for fills."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Product maps",
            "description": "Brand, color number, and layer order so removals do not become guesswork."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Fill rhythm",
            "description": "Smart rebooking nudges based on service type and client lifestyle."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Inspiration + result",
            "description": "Before, inspo, and after in one timeline per client."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Aftercare in plain language",
            "description": "Short, readable instructions clients actually follow."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Sanitation logs",
            "description": "Perishable product dates and tool processing reminders."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for nail techs?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-lash-artists",
    source: "for_lash_artists_waitlist",
    title: "For lash artists — maps, fills, and adhesive sensitivity tracking",
    description: "Mapping photos, fill cadence, adhesive batches, and sensitivity notes for lash pros in The Gold Collective.",
    eyebrow: "For lash artists",
    headline: "Maps, fills, and trust — on one timeline.",
    subheadline: "Track curl maps, adhesive batches, sensitivity reactions, and fill cadence so every appointment picks up exactly where the last one ended.",
    heroBadge: undefined,
    openGraphTitle: "Maps, fills, and trust — on one timeline.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","solo-studio"],
    features: [
      {
            icon: "Target" as AudienceIconName,
            "headline": "Mapping discipline",
            "description": "Curl, length, and density notes that survive weeks between visits."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Adhesive batch tracking",
            "description": "Log opens and environmental notes when issues appear."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Sensitivity history",
            "description": "Flag adhesives, tapes, and under-eye products that caused reactions."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Fill windows",
            "description": "Nudge clients at the right time — not too early, not too late."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Progress photos",
            "description": "Consent-first galleries for fills and style changes."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Aftercare nudges",
            "description": "Short reminders that protect retention without spam."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for lash artists?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-brow-artists",
    source: "for_brow_artists_waitlist",
    title: "For brow artists — pigment, shape, and healing in one client file",
    description: "Shape maps, pigment formulas, touch-up cadence, and contraindications for brow and PMU-focused pros in The Gold Collective.",
    eyebrow: "For brow artists",
    headline: "Shape science, pigment memory, calm healing.",
    subheadline: "Store maps, pigment mixes, contraindications, and touch-up cadence so every session is a continuation — not a forensic interview.",
    heroBadge: undefined,
    openGraphTitle: "Shape science, pigment memory, calm healing.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","med-spa-provider-individual"],
    features: [
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Pigment formulas",
            "description": "Track brands, lots, and adjustments across sessions."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Contraindication checks",
            "description": "Medications, pregnancy, and skin conditions in one view."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Healing checkpoints",
            "description": "Document stages with consent for future adjustments."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Touch-up rhythm",
            "description": "Cadence tuned to technique and skin response."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent packets",
            "description": "Clear aftercare and risk acknowledgment stored with the file."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Style goals",
            "description": "Translate client language into measurable brow plans."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for brow artists?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-massage-therapists",
    source: "for_massage_therapists_waitlist",
    title: "For massage therapists — SOAP notes, pressure prefs, and scope clarity",
    description: "Session notes, pressure maps, contraindications, and rebooking tuned to bodywork — inside The Gold Collective.",
    eyebrow: "For massage therapists",
    headline: "Notes that protect you — and them.",
    subheadline: "SOAP-friendly session capture, pressure preferences, contraindications, and rebooking tuned to tissue response — not generic spa software.",
    heroBadge: undefined,
    openGraphTitle: "Notes that protect you — and them.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","solo-studio"],
    features: [
      {
            icon: "FileText" as AudienceIconName,
            "headline": "Session documentation",
            "description": "Fast templates that still read like real clinical notes."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Pressure and focus maps",
            "description": "Shoulders vs hips vs stress holds — remembered visit to visit."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Scope and boundary prompts",
            "description": "Clear intake reminders for sensitive areas and draping standards."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Cadence for bodywork",
            "description": "Rebook based on modality and client goals."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Home care without overload",
            "description": "Short follow-ups clients can follow."
      },
      {
            icon: "Lock" as AudienceIconName,
            "headline": "Private by default",
            "description": "Notes visibility tied to role and consent."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for massage therapists?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-makeup-artists",
    source: "for_makeup_artists_waitlist",
    title: "For makeup artists — face charts, kit lists, and longevity notes",
    description: "Face charts, flash times, kit substitutions, and photography-friendly touch-up plans for artists in The Gold Collective.",
    eyebrow: "For makeup artists",
    headline: "Face charts that survive the heat.",
    subheadline: "Kit lists, substitutions, flash photography notes, and touch-up windows — so brides, talent, and editorial teams see the same plan.",
    heroBadge: undefined,
    openGraphTitle: "Face charts that survive the heat.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","working-model"],
    features: [
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Face charts & palettes",
            "description": "Save looks with product breakdowns per lighting condition."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Reference and result",
            "description": "Lighting notes for editorial vs bridal vs HD video."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Kit substitutions",
            "description": "Allergies and stock-outs handled with clear alternates."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Call times and touch-ups",
            "description": "Buffer for changes, tears, and weather surprises."
      },
      {
            icon: "Video" as AudienceIconName,
            "headline": "Look approvals",
            "description": "Share short clips when remote sign-off is needed."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Longevity plans",
            "description": "Primers, powders, and misting schedules clients understand."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for makeup artists?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-estheticians",
    source: "for_estheticians_waitlist",
    title: "For estheticians — skin journeys, peel series, and home care",
    description: "Skin typing, treatment series, photos, and retail attachment built for estheticians in The Gold Collective.",
    eyebrow: "For estheticians",
    headline: "Skin journeys, not one-off facials.",
    subheadline: "Track concerns, peel series contraindications, home care adherence, and retail attachment — so results compound instead of resetting.",
    heroBadge: undefined,
    openGraphTitle: "Skin journeys, not one-off facials.",
    pricingTierIds: ["licensed-pro-standard","licensed-pro-pro","med-spa-standard"],
    features: [
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Treatment series planning",
            "description": "Peels and modalities with spacing rules you set."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Progress photography",
            "description": "Angles and lighting guidance for comparable sets."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Home care adherence",
            "description": "Simple routines clients can follow between visits."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Outcome tracking",
            "description": "Texture, breakout, and pigment notes over time."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Check-in cadence",
            "description": "Short prompts after strong active treatments."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent for photos and peels",
            "description": "Packets tuned to common spa liability needs."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for estheticians?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-medspa-providers",
    source: "for_medspa_providers_waitlist",
    title: "For med spa providers — clinical-grade tools with beauty-industry experience",
    description: "HIPAA-aware intake, CPOM reminders, injectable lot tracking, and photo documentation with consent in The Gold Collective.",
    eyebrow: "For med spa providers",
    headline: "Clinical-grade tools. Beauty-industry experience.",
    subheadline: "HIPAA-aware intake, CPOM compliance reminders, lot-number tracking on injectables, and photo documentation with patient consent.",
    heroBadge: undefined,
    openGraphTitle: "Clinical-grade tools. Beauty-industry experience.",
    pricingTierIds: ["med-spa-provider-individual","med-spa-standard","med-spa-premium"],
    features: [
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent-forward intake",
            "description": "Procedures, risks, and photography permissions captured clearly."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Injectable lot tracking",
            "description": "Units, lots, and follow-up windows in one record."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Clinical photography",
            "description": "Standardized angles with access tied to role."
      },
      {
            icon: "FileText" as AudienceIconName,
            "headline": "CPOM-aware reminders",
            "description": "Documentation nudges based on jurisdiction and practice model."
      },
      {
            icon: "Lock" as AudienceIconName,
            "headline": "Least-privilege access",
            "description": "Front desk, providers, and medical director views separated."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Follow-up protocols",
            "description": "Post-treatment checklists clients can complete on device."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for med spa providers?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-trainers",
    source: "for_trainers_waitlist",
    title: "For personal trainers — programs, adherence, and safe progression",
    description: "Programming blocks, readiness notes, progress photos, and liability-friendly check-ins for trainers in The Gold Collective.",
    eyebrow: "For personal trainers",
    headline: "Programs that survive real life.",
    subheadline: "Track readiness, pain flags, progression blocks, and adherence — so clients stay safe when travel, work, and sleep go sideways.",
    heroBadge: undefined,
    openGraphTitle: "Programs that survive real life.",
    pricingTierIds: ["fitness-studio-standard","licensed-pro-pro","fitness-studio-premium"],
    features: [
      {
            icon: "Target" as AudienceIconName,
            "headline": "Progression blocks",
            "description": "Mesocycles with deload rules you can explain in plain language."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Readiness and pain flags",
            "description": "Subjective scores that trigger conservative adjustments."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Session rhythm",
            "description": "Makeups, travel weeks, and hybrid coaching windows."
      },
      {
            icon: "Video" as AudienceIconName,
            "headline": "Form check-ins",
            "description": "Short clips with consent for remote coaching."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Liability-friendly notes",
            "description": "Scope reminders and referral prompts when needed."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Strength and metric trends",
            "description": "Simple charts clients actually understand."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for trainers?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-barbershops",
    source: "for_barbershops_waitlist",
    title: "For barbershops — chairs, culture, and Saturday throughput",
    description: "Barbershop Standard with walk-ins, booth rental splits, and retail — multi-chair operations in The Gold Collective.",
    eyebrow: "For barbershops",
    headline: "Throughput without killing the culture.",
    subheadline: "Chair rotation, booth splits, retail at the counter, and wait-time honesty — built for busy shops, not quiet suites.",
    heroBadge: undefined,
    openGraphTitle: "Throughput without killing the culture.",
    pricingTierIds: ["barbershop-standard","salon-pro","salon-premium"],
    features: [
      {
            icon: "Users" as AudienceIconName,
            "headline": "Chair and booth economics",
            "description": "Fair splits and visibility owners can defend."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Saturday-grade scheduling",
            "description": "Walk-ins plus appointments without mystery waits."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Shop-level KPIs",
            "description": "Ticket, rebooking, and retail by chair."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Counter retail",
            "description": "Bundles that match clipper, beard, and home care routines."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Team announcements",
            "description": "One place for policy updates and guest notes."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Role-based visibility",
            "description": "Booth renters see their book; owners see the whole shop."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for barbershop owners?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-tattoo-shops",
    source: "for_tattoo_shops_waitlist",
    title: "For tattoo shops — guest artists, deposits, and shop-wide compliance",
    description: "Guest artist windows, deposit rules, consent archives, and health department readiness for tattoo shops in The Gold Collective.",
    eyebrow: "For tattoo shops",
    headline: "Guest weeks without guest chaos.",
    subheadline: "Artist windows, deposits, consent archives, and shop-wide sanitation visibility — so health departments and clients see the same standards.",
    heroBadge: undefined,
    openGraphTitle: "Guest weeks without guest chaos.",
    pricingTierIds: ["tattoo-shop-small","tattoo-shop-standard","tattoo-shop-premium"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Guest artist scheduling",
            "description": "Hold blocks, deposits, and portfolio links in one flow."
      },
      {
            icon: "Wallet" as AudienceIconName,
            "headline": "Deposit discipline",
            "description": "Clear rules for cancellations and redraws."
      },
      {
            icon: "FileText" as AudienceIconName,
            "headline": "Shop compliance binder",
            "description": "Logs and training reminders centralized."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Artist roles",
            "description": "Private client notes stay with the artist when required."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent vault",
            "description": "Searchable archives when questions arise later."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Shop performance",
            "description": "Utilization and average project value without micromanaging art."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for tattoo shop owners?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-piercing-studios",
    source: "for_piercing_studios_waitlist",
    title: "For piercing studios — jewelry specs, aftercare, and minor consent rails",
    description: "Jewelry materials, gauge notes, aftercare by placement, and guardian consent workflows for studios in The Gold Collective.",
    eyebrow: "For piercing studios",
    headline: "Jewelry memory that prevents surprises.",
    subheadline: "Material specs, threading styles, aftercare by placement, and minor consent rails — so swaps and downsizes stay safe.",
    heroBadge: undefined,
    openGraphTitle: "Jewelry memory that prevents surprises.",
    pricingTierIds: ["piercing-studio","tattoo-shop-standard","salon-standard"],
    features: [
      {
            icon: "Package" as AudienceIconName,
            "headline": "Jewelry inventory intelligence",
            "description": "Know what you have by material, gauge, and gem."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Placement protocols",
            "description": "Angles, starter lengths, and downsizing timelines."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Guardian consent",
            "description": "Clear capture for minors with jurisdictional prompts."
      },
      {
            icon: "Heart" as AudienceIconName,
            "headline": "Aftercare by region",
            "description": "Ear vs oral vs surface — instructions that match anatomy."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Healing checks",
            "description": "Optional photo consent for troubleshooting."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Swap reminders",
            "description": "Nudge clients when downsizes are due."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for piercing studios?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-nail-salons",
    source: "for_nail_salons_waitlist",
    title: "For nail salons — tables, dry time, and team consistency",
    description: "Table timing, dry stations, dip powder logs, and team menus for nail salons in The Gold Collective.",
    eyebrow: "For nail salons",
    headline: "Tables turn. Sets stay strong.",
    subheadline: "Dry time reality, tech assignment, and service consistency across a busy floor — without turning managers into hallway traffic cops.",
    heroBadge: undefined,
    openGraphTitle: "Tables turn. Sets stay strong.",
    pricingTierIds: ["salon-standard","salon-pro","salon-premium"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Table and dry-time aware booking",
            "description": "Fewer accidental overlaps at the lamp."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Tech load balancing",
            "description": "Fair distribution of complex sets."
      },
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Salon-wide design standards",
            "description": "Brand-level menus with room for tech creativity."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Sanitation visibility",
            "description": "Logs that help during inspections and insurance questions."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Retail attachment by tech",
            "description": "Coaching moments, not shame boards."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Client comms at scale",
            "description": "Consistent tone from front desk to tech."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for nail salon teams?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-lash-brow-studios",
    source: "for_lash_brow_studios_waitlist",
    title: "For lash & brow studios — specialty menus and sensitive-skin discipline",
    description: "Specialty menus, sensitivity tracking, and fill cadence for combined studios in The Gold Collective.",
    eyebrow: "For lash & brow studios",
    headline: "Two specialties. One standard.",
    subheadline: "Separate menus that still share client sensitivity history — so lifts, tints, and extensions do not fight each other chemically.",
    heroBadge: undefined,
    openGraphTitle: "Two specialties. One standard.",
    pricingTierIds: ["solo-studio","salon-standard","salon-pro"],
    features: [
      {
            icon: "Target" as AudienceIconName,
            "headline": "Cross-service sensitivity",
            "description": "One profile for adhesives, dyes, and lifting solutions."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Fill and tint spacing",
            "description": "Avoid stacking incompatible appointments."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Before/after discipline",
            "description": "Angles that work for both lash maps and brow healing."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Patch test records",
            "description": "Dates, products, and reactions searchable later."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Specialist roles",
            "description": "Lash vs brow leads with shared reception."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Retail that fits",
            "description": "Aftercare kits matched to services performed."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for lash and brow studios?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-medspas",
    source: "for_medspas_waitlist",
    title: "For med spas — medical oversight, aesthetics floor, and retail harmony",
    description: "Med Spa Standard and Premium for charting, photography, inventory, and multi-provider coordination in The Gold Collective.",
    eyebrow: "For med spas",
    headline: "Medical rigor. Aesthetics pace.",
    subheadline: "Separate clinical and aesthetic workflows with shared client context — so injectors, laser techs, and estheticians stop duplicating intake.",
    heroBadge: undefined,
    openGraphTitle: "Medical rigor. Aesthetics pace.",
    pricingTierIds: ["med-spa-standard","med-spa-premium","licensed-pro-premium"],
    features: [
      {
            icon: "Users" as AudienceIconName,
            "headline": "Medical director visibility",
            "description": "Oversight where required without slowing the floor."
      },
      {
            icon: "Lock" as AudienceIconName,
            "headline": "Chart privacy tiers",
            "description": "Access tied to licensure and scope."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Injectable and laser logs",
            "description": "Devices, settings, and lots in structured fields."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Standardized clinical photos",
            "description": "Comparables that hold up for consults."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Retail that respects clinical advice",
            "description": "Attach home care to provider notes."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Location performance",
            "description": "Multi-room utilization without guesswork."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for med spa operators?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-fitness-studios",
    source: "for_fitness_studios_waitlist",
    title: "For fitness studios — classes, memberships, and coach handoffs",
    description: "Fitness Studio Standard and Premium for schedules, memberships, and coach notes in The Gold Collective.",
    eyebrow: "For fitness studios",
    headline: "Classes full. Coaches aligned.",
    subheadline: "Schedules, capacity, membership tiers, and coach handoffs — so substitutions do not reset client progress stories.",
    heroBadge: undefined,
    openGraphTitle: "Classes full. Coaches aligned.",
    pricingTierIds: ["fitness-studio-standard","fitness-studio-premium","salon-pro"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Capacity-aware scheduling",
            "description": "Waitlists that respect room and equipment limits."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Coach handoff notes",
            "description": "Injuries, goals, and modifications travel session to session."
      },
      {
            icon: "Wallet" as AudienceIconName,
            "headline": "Membership clarity",
            "description": "Trials, freezes, and upgrades clients understand."
      },
      {
            icon: "Video" as AudienceIconName,
            "headline": "Hybrid options",
            "description": "On-demand or livestream add-ons where you allow them."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Retention signals",
            "description": "Attendance patterns before churn hardens."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Waivers and PAR-Q",
            "description": "Digital capture with versioning."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for fitness studio owners?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-solo-studios",
    source: "for_solo_studios_waitlist",
    title: "For solo studios — one room, one brand, enterprise-grade calm",
    description: "Solo Studio tier for independent suites needing pro tools without enterprise bloat in The Gold Collective.",
    eyebrow: "For solo studios",
    headline: "Suite life. Enterprise calm.",
    subheadline: "One room does not mean toy software — run deposits, intake, retail, and reminders like a pro without hiring an ops team.",
    heroBadge: undefined,
    openGraphTitle: "Suite life. Enterprise calm.",
    pricingTierIds: ["solo-studio","licensed-pro-pro","licensed-pro-premium"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Solo-friendly booking",
            "description": "Buffers, cleanup, and travel time honored automatically."
      },
      {
            icon: "Wallet" as AudienceIconName,
            "headline": "Deposits without awkward DMs",
            "description": "Policies clients accept at booking."
      },
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Private galleries",
            "description": "Consent-first photos that stay organized."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Automations that sound human",
            "description": "Short, on-brand reminders and follow-ups."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Simple economics",
            "description": "Average ticket, rebooking, and retail in one glance."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Security without IT",
            "description": "Role defaults that match a one-person shop."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for solo studio owners?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-models",
    source: "for_models_waitlist",
    title: "For models — digitals, measurements, and bookings without inbox chaos",
    description: "Aspiring and working model tiers with portfolios, comp cards, and logistics — fashion modules on the June 30 cadence in The Gold Collective.",
    eyebrow: "For models",
    headline: "Your book, always ready.",
    subheadline: "Digitals, measurements, and availability that update everywhere — so castings stop hunting through old threads.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Your book, always ready.",
    pricingTierIds: ["aspiring-model","working-model","stylist-assistant-fashion"],
    features: [
      {
            icon: "Camera" as AudienceIconName,
            "headline": "Digitals and tears",
            "description": "Organized sets with clear usage rights."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Measurements that stay honest",
            "description": "Update once, propagate to agencies and clients you approve."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Casting logistics",
            "description": "Callbacks, travel blocks, and rest windows."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Guardian and consent rails",
            "description": "Age-appropriate defaults where applicable."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Polaroids and polar moods",
            "description": "Quick capture workflows for open calls."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Agency-ready comms",
            "description": "Threads that stay professional under pressure."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for models?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-modeling-agencies",
    source: "for_modeling_agencies_waitlist",
    title: "For modeling agencies — rosters, packages, and buyer-ready exports",
    description: "Boutique through Premium agency tiers with roster tools and approvals — June 30 fashion cadence in The Gold Collective.",
    eyebrow: "For modeling agencies",
    headline: "Rosters that buyers actually open.",
    subheadline: "Packages, polaroids, and digitals with approvals, expirations, and clear usage — so talent stays protected and bookings move faster.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Rosters that buyers actually open.",
    pricingTierIds: ["modeling-agency-boutique","modeling-agency-standard","modeling-agency-premium"],
    features: [
      {
            icon: "Users" as AudienceIconName,
            "headline": "Roster roles",
            "description": "Bookers, parents/guardians, and talent views separated cleanly."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Package builder",
            "description": "Comp cards and digitals that stay on-brand."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Usage and territory controls",
            "description": "Stop accidental over-sharing."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Go-sees and travel",
            "description": "Conflicts surfaced before planes are booked."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Booking velocity",
            "description": "Understand markets without exploiting talent data."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Client-ready threads",
            "description": "Professional tone preserved across the team."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for modeling agencies?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-designers",
    source: "for_designers_waitlist",
    title: "For fashion designers — line sheets, appointments, and showroom flow",
    description: "Designer Standard and Pro with line sheets, appointments, and buyer notes — June 30 cadence in The Gold Collective.",
    eyebrow: "For designers",
    headline: "Line sheets buyers can navigate.",
    subheadline: "Lookbooks, appointments, and showroom notes connected to the same inventory story — fewer PDFs, fewer mistakes.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Line sheets buyers can navigate.",
    pricingTierIds: ["fashion-designer-standard","fashion-designer-pro","showroom-boutique"],
    features: [
      {
            icon: "Layers" as AudienceIconName,
            "headline": "Line sheet discipline",
            "description": "Colorways, sizes, and MOQs in structured views."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Showroom appointments",
            "description": "Buyer blocks with prep checklists."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Buyer notes tied to SKU",
            "description": "Feedback that does not get lost in email."
      },
      {
            icon: "Palette" as AudienceIconName,
            "headline": "Creative references",
            "description": "Mood, textile, and trim libraries linked to seasons."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Sample inventory",
            "description": "Know what is out, with whom, and when it returns."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "NDA-friendly sharing",
            "description": "Watermarked previews where you need them."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for designers?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-casting-directors",
    source: "for_casting_directors_waitlist",
    title: "For casting directors — shortlists, callbacks, and talent comms",
    description: "Indie through Premium casting director tiers with logistics and approvals — June 30 cadence in The Gold Collective.",
    eyebrow: "For casting directors",
    headline: "Shortlists that stay respectful.",
    subheadline: "Callbacks, holds, and talent comms with clear status — so nobody learns bad news from a rumor mill.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Shortlists that stay respectful.",
    pricingTierIds: ["casting-director-indie","casting-director-pro","casting-director-premium"],
    features: [
      {
            icon: "Users" as AudienceIconName,
            "headline": "Role-separated rooms",
            "description": "Clients, creatives, and talent teams see appropriate slices."
      },
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Callback grids",
            "description": "Conflicts and travel surfaced early."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Brief ingestion",
            "description": "Roles, sizes, skills, and constraints structured."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Consent for tapes and photos",
            "description": "Usage tied to project and window."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Agency-grade comms",
            "description": "Templates that stay humane under deadlines."
      },
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Pipeline clarity",
            "description": "Where the search stalls — without blaming talent."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for casting directors?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-showrooms",
    source: "for_showrooms_waitlist",
    title: "For showrooms — appointments, lines, and buyer relationships",
    description: "Boutique and Standard showroom tiers with appointments and notes — June 30 cadence in The Gold Collective.",
    eyebrow: "For showrooms",
    headline: "Appointments that feel bespoke.",
    subheadline: "Buyer history, line preferences, and follow-ups in one Gold Collective lane — so the room remembers the relationship.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Appointments that feel bespoke.",
    pricingTierIds: ["showroom-boutique","showroom-standard","fashion-designer-standard"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Buyer calendars",
            "description": "Season previews with prep tasks."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Line memory",
            "description": "What they bought, skipped, and asked to see again."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Follow-ups that convert",
            "description": "Short, tailored nudges after market."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Team roles",
            "description": "Sales vs ops vs designer visibility."
      },
      {
            icon: "LineChart" as AudienceIconName,
            "headline": "Appointment yield",
            "description": "Understand time invested vs outcomes."
      },
      {
            icon: "Sparkles" as AudienceIconName,
            "headline": "Presentation polish",
            "description": "Digital boards that match the room aesthetic."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for showrooms?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-clothing-brands",
    source: "for_clothing_brands_waitlist",
    title: "For clothing brands — wholesale rhythm and advocate activations",
    description: "Clothing Brand Standard and Pro with wholesale notes and advocate programs — June 30 cadence in The Gold Collective.",
    eyebrow: "For clothing brands",
    headline: "Wholesale rhythm without spreadsheet fatigue.",
    subheadline: "Linesheets, door counts, reorder signals, and advocate activations — so growth does not depend on opaque ad tax.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Wholesale rhythm without spreadsheet fatigue.",
    pricingTierIds: ["clothing-brand-standard","clothing-brand-pro","brand-partner-pro"],
    features: [
      {
            icon: "BarChart3" as AudienceIconName,
            "headline": "Door performance",
            "description": "Which accounts move which SKUs."
      },
      {
            icon: "Package" as AudienceIconName,
            "headline": "Season logistics",
            "description": "Samples, market dates, and returns tracked."
      },
      {
            icon: "Target" as AudienceIconName,
            "headline": "Advocate activations",
            "description": "Authentic education in service settings."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Account comms",
            "description": "Notes buyers and reps can trust."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "MAP and claims guardrails",
            "description": "Protect brand and partners."
      },
      {
            icon: "Store" as AudienceIconName,
            "headline": "Direct path when ready",
            "description": "Storefront tiers when DTC fits."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for clothing brands?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  },
{
    slug: "for-fashion-events",
    source: "for_fashion_events_waitlist",
    title: "For fashion events — crews, call times, and vendor coordination",
    description: "Fashion event producer Indie through Premium with run-of-show and vendor coordination — June 30 cadence in The Gold Collective.",
    eyebrow: "For fashion events",
    headline: "Call times everyone actually sees.",
    subheadline: "Run-of-show, vendor load-in, model holds, and backstage comms — one command layer instead of fifty group chats.",
    heroBadge: "Launching June 30, 2026",
    openGraphTitle: "Call times everyone actually sees.",
    pricingTierIds: ["fashion-event-producer-indie","fashion-event-producer-pro","fashion-event-producer-premium"],
    features: [
      {
            icon: "Calendar" as AudienceIconName,
            "headline": "Load-in to strike",
            "description": "Trucks, rooms, and holds on one timeline."
      },
      {
            icon: "Users" as AudienceIconName,
            "headline": "Crew roles",
            "description": "Hair, makeup, dressers, and stage managers see the right slices."
      },
      {
            icon: "MessageSquare" as AudienceIconName,
            "headline": "Backstage comms",
            "description": "Urgent channels that do not spam everyone."
      },
      {
            icon: "ClipboardList" as AudienceIconName,
            "headline": "Run-of-show",
            "description": "Changes propagate with version clarity."
      },
      {
            icon: "MapPin" as AudienceIconName,
            "headline": "Venue logistics",
            "description": "Rooms, routes, and accessibility notes."
      },
      {
            icon: "Shield" as AudienceIconName,
            "headline": "Talent safety defaults",
            "description": "Minor and guardian workflows where required."
      }
],
    steps: [{"title":"Tell us who you serve","description":"Pick your lane so intake, scheduling, and compliance templates match how you actually work."},{"title":"Connect your workflow","description":"Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes."},{"title":"Launch with your circle","description":"Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time."}],
    faqs: [{"question":"What does Sif's Circle mean for fashion event producers?","answer":"Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for The Gold Collective."},{"question":"Will my data stay private?","answer":"We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist."},{"question":"Is this only for big teams?","answer":"No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them."},{"question":"How does pricing work?","answer":"Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page."},{"question":"When can I start?","answer":"Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window."},{"question":"Who are Sif's Advocates?","answer":"Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective."},{"question":"What is a Gold Partner?","answer":"Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory."}],
  }
];

const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p])) as Record<string, AudienceLandingConfig>;

export function getAudienceLanding(slug: string): AudienceLandingConfig | undefined {
  return bySlug[slug];
}

export const audienceLandingSlugs = Object.keys(bySlug) as string[];
