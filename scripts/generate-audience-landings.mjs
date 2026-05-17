import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "src/data/audience-landings.ts");

const faq = (audienceLabel, collective = "The Gold Collective") => [
  {
    question: `What does Sif's Circle mean for ${audienceLabel}?`,
    answer: `Sif's Circle is our early access list: launch timing, founding perks when you qualify, and a direct line to the team while Sif's Advocates and Gold Partners help shape the roadmap for ${collective}.`,
  },
  {
    question: "Will my data stay private?",
    answer:
      "We design for least-privilege access, clear consent on sensitive records, and industry-aligned defaults. Exact controls ship with launch documentation and your onboarding checklist.",
  },
  {
    question: "Is this only for big teams?",
    answer:
      "No. Solo chairs, single-location studios, and independent pros get the same core workflows — scale features unlock when you actually need them.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Transparent tiers with monthly and annual options where applicable. Use the pricing snapshot on this page, then compare everything side-by-side on the full pricing page.",
  },
  {
    question: "When can I start?",
    answer:
      "Join the waitlist on this page to reserve your place. Fashion-forward modules roll on the June 30 cadence where noted; other verticals follow the broader launch window.",
  },
  {
    question: "Who are Sif's Advocates?",
    answer:
      "Sif's Advocates are trusted pros and educators who stress-test workflows, mentor peers, and keep standards high across The Gold Collective.",
  },
  {
    question: "What is a Gold Partner?",
    answer:
      "Gold Partners are brands, schools, and organizations that co-build distribution, education, and compliance rails with us — without turning your client list into ad inventory.",
  },
];

const stepsDefault = [
  {
    title: "Tell us who you serve",
    description: "Pick your lane so intake, scheduling, and compliance templates match how you actually work.",
  },
  {
    title: "Connect your workflow",
    description: "Bring bookings, forms, and client context into one Gold Collective profile — fewer tabs, fewer mistakes.",
  },
  {
    title: "Launch with your circle",
    description: "Invite clients, assistants, or partners with clear roles so everyone sees the right information at the right time.",
  },
];

const F = (icon, headline, description) => ({ icon, headline, description });

const pages = [
  {
    slug: "for-clients",
    source: "for_clients_waitlist",
    title: "For clients — book beauty, grooming, fitness, and fashion with confidence",
    description:
      "Discover vetted pros, keep preferences and history in one place, and rebook on rhythm — built for clients, not generic marketplaces.",
    eyebrow: "For clients",
    headline: "Your chair. Your rhythm. Your story.",
    subheadline:
      "Scout-style discovery, loyalty that follows the relationship, and rebooking windows tuned to color, cut, skin, and training cycles — all inside The Gold Collective.",
    heroBadge: undefined,
    pricingTierIds: ["client-free", "client-plus", "storefront-starter"],
    features: [
      F("Sparkles", "Mood-first discovery", "Match services to how you feel today — not endless scrolling through random listings."),
      F("Target", "Style preferences that stick", "Save guardrails and goals so every pro sees the same version of great."),
      F("Calendar", "Beauty Clock rebooking", "Land back in the chair when your color, cut, or skin routine actually needs you."),
      F("Heart", "Loyalty with the relationship", "Recognition that follows the pro you trust — not just one salon brand."),
      F("MessageSquare", "Clear communication", "Structured updates, reminders, and consent trails you can actually find later."),
      F("Shield", "Privacy-forward defaults", "Share what is needed for the appointment — not your whole digital life."),
    ],
    steps: stepsDefault,
    faqs: faq("clients"),
  },
  {
    slug: "for-pros",
    source: "for_pros_waitlist",
    title: "For licensed pros — one operating system for your chair or suite",
    description:
      "Licensed Pro tiers for booking, intake, photos, retail, and growth — with mentor access and student pathways inside The Gold Collective.",
    eyebrow: "For licensed professionals",
    headline: "Run the day like a pro — not like ten apps.",
    subheadline:
      "Service menus, booking modes, client records, photo studio, and license tracking in one flow. Built with Sif's Advocates so it respects real salon, barber, med spa, and studio realities.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "licensed-pro-premium"],
    features: [
      F("ClipboardList", "Menus that match reality", "Services, add-ons, timing buffers, and notes that travel with the appointment."),
      F("Calendar", "Four booking modes", "From strict deposits to walk-in friendly — configure what your market expects."),
      F("Camera", "Photo studio & consent", "Before/after sets with clear consent and organized client galleries."),
      F("LineChart", "Growth signals", "See rebooking, retail attachment, and no-show patterns without spreadsheet archaeology."),
      F("Users", "Mentor match access", "Connect with Sif's Advocates for board prep, technique, and business coaching rails."),
      F("BadgeCheck", "License tracking", "Renewals and documentation reminders so your chair stays audit-ready."),
    ],
    steps: stepsDefault,
    faqs: faq("licensed professionals"),
  },
  {
    slug: "for-students",
    source: "for_students_waitlist",
    title: "For students — board prep, hours, and mentorship in one lane",
    description:
      "Student Free and Student tiers with board prep, games, hour tracking, and mentor match — built for beauty and grooming learners in The Gold Collective.",
    eyebrow: "For students",
    headline: "Clock hours. Crush boards. Find mentors.",
    subheadline:
      "Study dashboards, hour tracking, and mentor match live next to the same tools you will use as a licensed pro — so graduation day is not day-zero on software.",
    heroBadge: undefined,
    pricingTierIds: ["student-free", "student", "licensed-pro-standard"],
    features: [
      F("BookOpen", "Board prep that scales", "Start with core states on Student Free; unlock full coverage when you upgrade."),
      F("ClipboardList", "Hour tracking", "Clock clinical and floor hours with supervisor visibility where required."),
      F("Users", "Mentor match", "Pair with Sif's Advocates who have walked your path and speak your discipline."),
      F("Sparkles", "Study games", "Reinforce sanitation, anatomy, and client scenarios without stale PDFs alone."),
      F("Target", "Bridge to Licensed Pro", "Graduate your profile into pro workflows without losing history."),
      F("Shield", "Ethics & consent drills", "Practice client communication with guardrails before you touch the public."),
    ],
    steps: stepsDefault,
    faqs: faq("students"),
  },
  {
    slug: "for-schools",
    source: "for_schools_waitlist",
    title: "For schools — cohort visibility, hour verification, and employer pipelines",
    description:
      "Place students into salon-ready workflows with oversight, compliance reminders, and partner introductions through The Gold Collective.",
    eyebrow: "For schools & educators",
    headline: "Graduate operators — not app tourists.",
    subheadline:
      "Cohort dashboards, verified hours, and employer-ready portfolios sit on the same rails salons and studios use — so hiring managers see skills, not screenshots.",
    heroBadge: undefined,
    pricingTierIds: ["student", "salon-standard", "salon-pro"],
    features: [
      F("Users", "Cohort oversight", "Instructors see progress, risk flags, and readiness without invasive micromanagement."),
      F("ClipboardList", "Verified hour workflows", "Supervisor sign-offs and audit trails that match common state expectations."),
      F("BookOpen", "Curriculum-aligned modules", "Tie lessons to live tools students will use on the floor."),
      F("BarChart3", "Placement analytics", "Understand which partners hire your graduates and where to invest next."),
      F("MessageSquare", "Employer introductions", "Warm intros to Gold Partners and verified studios seeking talent."),
      F("Shield", "Compliance guardrails", "Consent, media, and communications defaults tuned for educational settings."),
    ],
    steps: stepsDefault,
    faqs: faq("schools and educators"),
  },
  {
    slug: "for-salons",
    source: "for_salons_waitlist",
    title: "For salons — multi-chair operations with retail and culture intact",
    description:
      "Salon Standard through Premium with team scheduling, inventory, marketing, and analytics — built for busy floors in The Gold Collective.",
    eyebrow: "For salons",
    headline: "Keep the floor calm. Keep the books honest.",
    subheadline:
      "Team scheduling, service consistency, retail attachment, and client rebooking — without turning stylists into overnight data analysts.",
    heroBadge: undefined,
    pricingTierIds: ["salon-standard", "salon-pro", "salon-premium"],
    features: [
      F("Calendar", "Team-aware scheduling", "Avoid double-books while respecting seniority and specialty stations."),
      F("Package", "Retail that actually moves", "Attach products to services with clear incentives and inventory signals."),
      F("LineChart", "Chair economics", "See utilization, average ticket, and rebooking by provider — not vanity totals."),
      F("MessageSquare", "Front desk + provider comms", "One thread model so clients never get conflicting answers."),
      F("Camera", "Portfolio consistency", "Brand-level photo standards without killing individual creative voice."),
      F("Shield", "Role-based access", "Assistants see what they need; owners see what they must."),
    ],
    steps: stepsDefault,
    faqs: faq("salon teams"),
  },
  {
    slug: "for-fashion",
    source: "for_fashion_waitlist",
    title: "For fashion — castings, showrooms, and brand storytelling in one lane",
    description:
      "Model, agency, designer, and event workflows with portfolios, measurements, and approvals — fashion modules on the June 30 cadence inside The Gold Collective.",
    eyebrow: "For fashion",
    headline: "Run castings without chaos.",
    subheadline:
      "Portfolios, measurements, approvals, and logistics in one Gold Collective lane — so creatives spend time on the work, not the spreadsheet.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["aspiring-model", "working-model", "fashion-designer-standard"],
    features: [
      F("Camera", "Portfolio-ready media", "Organize digitals, runway, and commercial sets with clear usage rights."),
      F("ClipboardList", "Measurements that stay current", "Update sizes and constraints without DM archaeology."),
      F("Calendar", "Casting logistics", "Hold windows, callbacks, and travel blocks with conflict checks."),
      F("Users", "Agency-ready roles", "Separate access for bookers, parents/guardians where applicable, and creatives."),
      F("Shield", "Consent and usage trails", "Know who can share what — before the campaign ships."),
      F("Sparkles", "Showroom and event rails", "Line sheets, appointments, and buyer notes connected to the same profiles."),
    ],
    steps: stepsDefault,
    faqs: faq("fashion teams"),
  },
  {
    slug: "for-brands",
    source: "for_brands_waitlist",
    title: "For brands — discovery, advocacy, and storefronts without spammy ads",
    description:
      "Brand Partner tiers for discovery campaigns, advocate programs, and measurable lift — aligned with The Gold Collective values.",
    eyebrow: "For brands",
    headline: "Reach people who already care.",
    subheadline:
      "Partner with Sif's Advocates and Gold Partners to place products where services happen — with reporting that respects privacy and real outcomes.",
    heroBadge: undefined,
    pricingTierIds: ["brand-partner-discovery", "brand-partner-pro", "brand-partner-enterprise"],
    features: [
      F("Target", "Advocate-aligned distribution", "Meet clients in context — education, sampling, and authentic use cases."),
      F("BarChart3", "Lift you can explain", "Attach results to cohorts and regions without creepy surveillance marketing."),
      F("Store", "Storefront rails", "Starter through Plus paths when you are ready to sell direct alongside partners."),
      F("MessageSquare", "Campaign briefs", "Creative guardrails and compliance notes travel with every activation."),
      F("Shield", "Brand safety defaults", "Clear rules on claims, before/after usage, and regulated categories."),
      F("Wallet", "Partner economics", "Transparent commercial rails so advocates are not an afterthought."),
    ],
    steps: stepsDefault,
    faqs: faq("brand teams"),
  },
  {
    slug: "for-storefronts",
    source: "for_storefronts_waitlist",
    title: "For storefronts — sell products with the same trust as your services",
    description:
      "Storefront Starter through Plus for catalog, checkout, and fulfillment — connected to pros and clients in The Gold Collective.",
    eyebrow: "For storefronts",
    headline: "Commerce that feels like your brand.",
    subheadline:
      "Curated catalogs, bundles with services, and fulfillment signals that keep clients confident — not another generic web store bolted on sideways.",
    heroBadge: undefined,
    pricingTierIds: ["storefront-starter", "storefront-standard", "storefront-plus"],
    features: [
      F("Package", "Bundles that make sense", "Pair retail with appointments and aftercare protocols automatically."),
      F("CreditCard", "Checkout clients understand", "Clear totals, taxes handled at payment, and receipts that match reality."),
      F("LineChart", "Inventory signals", "Know what moves per location and which pros drive attachment."),
      F("MessageSquare", "Post-purchase care", "Automated education without drowning people in noise."),
      F("Shield", "Claims-aware merchandising", "Guardrails for regulated and sensitive categories."),
      F("MapPin", "Pickup and local options", "Support BOPIS and studio pickup without operational spaghetti."),
    ],
    steps: stepsDefault,
    faqs: faq("storefront operators"),
  },
  {
    slug: "for-barbers",
    source: "for_barbers_waitlist",
    title: "For barbers — the shop, in your pocket",
    description:
      "Walk-in queue, lineup tracking, beard protocols, and chair culture — built for barbers inside The Gold Collective.",
    eyebrow: "For barbers",
    headline: "The shop, in your pocket.",
    subheadline:
      "Walk-in queue, lineup tracking, beard protocols, and the brotherhood of the chair — built for barbers, not borrowed from beauty.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "barbershop-standard"],
    features: [
      F("Calendar", "Walk-in queue intelligence", "Fair rotation, wait estimates, and no mystery line drama."),
      F("Scissors", "Cut and beard protocols", "Service templates that match fades, tapers, and beard geometry."),
      F("Camera", "Lineup and shape records", "Photo references clients consent to share for the next visit."),
      F("MessageSquare", "Chair-side comms", "Quick updates without losing the vibe of a busy floor."),
      F("Wallet", "Deposits that feel fair", "Simple rules for big transformations and busy Saturdays."),
      F("Shield", "Sanitation checklists", "Visible standards clients and inspectors can trust."),
    ],
    steps: stepsDefault,
    faqs: faq("barbers"),
  },
  {
    slug: "for-tattoo-artists",
    source: "for_tattoo_artists_waitlist",
    title: "For tattoo artists — healing, stencils, and compliance in one studio OS",
    description:
      "Healing timelines, stencil libraries, aftercare consent, and bloodborne pathogens documentation for independent artists in The Gold Collective.",
    eyebrow: "For tattoo artists",
    headline: "Your studio, your style, your records.",
    subheadline:
      "Healing timelines, stencil libraries, aftercare consent, and bloodborne pathogens compliance — all in one place.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "tattoo-shop-small"],
    features: [
      F("Palette", "Stencil and flash libraries", "Organize references, revisions, and client picks without lost DMs."),
      F("ClipboardList", "Session notes & placement", "Track placement, session length, and future session planning."),
      F("Heart", "Healing timelines", "Automated aftercare reminders clients can follow without guesswork."),
      F("Shield", "Consent and ID trails", "Clear capture for minors where applicable and medical considerations."),
      F("FileText", "BBP documentation", "Logs and training reminders aligned to common health department expectations."),
      F("Camera", "Healing progress photos", "Optional check-ins with explicit consent and private galleries."),
    ],
    steps: stepsDefault,
    faqs: faq("tattoo artists"),
  },
  {
    slug: "for-nail-techs",
    source: "for_nail_techs_waitlist",
    title: "For nail techs — art, chemistry, and rebooking on rhythm",
    description:
      "Design archives, product compatibility notes, soak-off timing, and fill schedules tuned to nail reality in The Gold Collective.",
    eyebrow: "For nail techs",
    headline: "Art that lasts starts with the record.",
    subheadline:
      "Design archives, chemistry notes, soak-off timing, and fill windows that keep sets strong — without sticky notes on every lamp.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "salon-standard"],
    features: [
      F("Palette", "Design archives", "Save sets, charms, and palettes with quick recall for fills."),
      F("ClipboardList", "Product maps", "Brand, color number, and layer order so removals do not become guesswork."),
      F("Calendar", "Fill rhythm", "Smart rebooking nudges based on service type and client lifestyle."),
      F("Camera", "Inspiration + result", "Before, inspo, and after in one timeline per client."),
      F("MessageSquare", "Aftercare in plain language", "Short, readable instructions clients actually follow."),
      F("Shield", "Sanitation logs", "Perishable product dates and tool processing reminders."),
    ],
    steps: stepsDefault,
    faqs: faq("nail techs"),
  },
  {
    slug: "for-lash-artists",
    source: "for_lash_artists_waitlist",
    title: "For lash artists — maps, fills, and adhesive sensitivity tracking",
    description:
      "Mapping photos, fill cadence, adhesive batches, and sensitivity notes for lash pros in The Gold Collective.",
    eyebrow: "For lash artists",
    headline: "Maps, fills, and trust — on one timeline.",
    subheadline:
      "Track curl maps, adhesive batches, sensitivity reactions, and fill cadence so every appointment picks up exactly where the last one ended.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "solo-studio"],
    features: [
      F("Target", "Mapping discipline", "Curl, length, and density notes that survive weeks between visits."),
      F("Package", "Adhesive batch tracking", "Log opens and environmental notes when issues appear."),
      F("Heart", "Sensitivity history", "Flag adhesives, tapes, and under-eye products that caused reactions."),
      F("Calendar", "Fill windows", "Nudge clients at the right time — not too early, not too late."),
      F("Camera", "Progress photos", "Consent-first galleries for fills and style changes."),
      F("MessageSquare", "Aftercare nudges", "Short reminders that protect retention without spam."),
    ],
    steps: stepsDefault,
    faqs: faq("lash artists"),
  },
  {
    slug: "for-brow-artists",
    source: "for_brow_artists_waitlist",
    title: "For brow artists — pigment, shape, and healing in one client file",
    description:
      "Shape maps, pigment formulas, touch-up cadence, and contraindications for brow and PMU-focused pros in The Gold Collective.",
    eyebrow: "For brow artists",
    headline: "Shape science, pigment memory, calm healing.",
    subheadline:
      "Store maps, pigment mixes, contraindications, and touch-up cadence so every session is a continuation — not a forensic interview.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "med-spa-provider-individual"],
    features: [
      F("Palette", "Pigment formulas", "Track brands, lots, and adjustments across sessions."),
      F("ClipboardList", "Contraindication checks", "Medications, pregnancy, and skin conditions in one view."),
      F("Camera", "Healing checkpoints", "Document stages with consent for future adjustments."),
      F("Calendar", "Touch-up rhythm", "Cadence tuned to technique and skin response."),
      F("Shield", "Consent packets", "Clear aftercare and risk acknowledgment stored with the file."),
      F("Sparkles", "Style goals", "Translate client language into measurable brow plans."),
    ],
    steps: stepsDefault,
    faqs: faq("brow artists"),
  },
  {
    slug: "for-massage-therapists",
    source: "for_massage_therapists_waitlist",
    title: "For massage therapists — SOAP notes, pressure prefs, and scope clarity",
    description:
      "Session notes, pressure maps, contraindications, and rebooking tuned to bodywork — inside The Gold Collective.",
    eyebrow: "For massage therapists",
    headline: "Notes that protect you — and them.",
    subheadline:
      "SOAP-friendly session capture, pressure preferences, contraindications, and rebooking tuned to tissue response — not generic spa software.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "solo-studio"],
    features: [
      F("FileText", "Session documentation", "Fast templates that still read like real clinical notes."),
      F("Heart", "Pressure and focus maps", "Shoulders vs hips vs stress holds — remembered visit to visit."),
      F("Shield", "Scope and boundary prompts", "Clear intake reminders for sensitive areas and draping standards."),
      F("Calendar", "Cadence for bodywork", "Rebook based on modality and client goals."),
      F("MessageSquare", "Home care without overload", "Short follow-ups clients can follow."),
      F("Lock", "Private by default", "Notes visibility tied to role and consent."),
    ],
    steps: stepsDefault,
    faqs: faq("massage therapists"),
  },
  {
    slug: "for-makeup-artists",
    source: "for_makeup_artists_waitlist",
    title: "For makeup artists — face charts, kit lists, and longevity notes",
    description:
      "Face charts, flash times, kit substitutions, and photography-friendly touch-up plans for artists in The Gold Collective.",
    eyebrow: "For makeup artists",
    headline: "Face charts that survive the heat.",
    subheadline:
      "Kit lists, substitutions, flash photography notes, and touch-up windows — so brides, talent, and editorial teams see the same plan.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "working-model"],
    features: [
      F("Palette", "Face charts & palettes", "Save looks with product breakdowns per lighting condition."),
      F("Camera", "Reference and result", "Lighting notes for editorial vs bridal vs HD video."),
      F("ClipboardList", "Kit substitutions", "Allergies and stock-outs handled with clear alternates."),
      F("Calendar", "Call times and touch-ups", "Buffer for changes, tears, and weather surprises."),
      F("Video", "Look approvals", "Share short clips when remote sign-off is needed."),
      F("Sparkles", "Longevity plans", "Primers, powders, and misting schedules clients understand."),
    ],
    steps: stepsDefault,
    faqs: faq("makeup artists"),
  },
  {
    slug: "for-estheticians",
    source: "for_estheticians_waitlist",
    title: "For estheticians — skin journeys, peel series, and home care",
    description:
      "Skin typing, treatment series, photos, and retail attachment built for estheticians in The Gold Collective.",
    eyebrow: "For estheticians",
    headline: "Skin journeys, not one-off facials.",
    subheadline:
      "Track concerns, peel series contraindications, home care adherence, and retail attachment — so results compound instead of resetting.",
    heroBadge: undefined,
    pricingTierIds: ["licensed-pro-standard", "licensed-pro-pro", "med-spa-standard"],
    features: [
      F("ClipboardList", "Treatment series planning", "Peels and modalities with spacing rules you set."),
      F("Camera", "Progress photography", "Angles and lighting guidance for comparable sets."),
      F("Package", "Home care adherence", "Simple routines clients can follow between visits."),
      F("LineChart", "Outcome tracking", "Texture, breakout, and pigment notes over time."),
      F("MessageSquare", "Check-in cadence", "Short prompts after strong active treatments."),
      F("Shield", "Consent for photos and peels", "Packets tuned to common spa liability needs."),
    ],
    steps: stepsDefault,
    faqs: faq("estheticians"),
  },
  {
    slug: "for-medspa-providers",
    source: "for_medspa_providers_waitlist",
    title: "For med spa providers — clinical-grade tools with beauty-industry experience",
    description:
      "HIPAA-aware intake, CPOM reminders, injectable lot tracking, and photo documentation with consent in The Gold Collective.",
    eyebrow: "For med spa providers",
    headline: "Clinical-grade tools. Beauty-industry experience.",
    subheadline:
      "HIPAA-aware intake, CPOM compliance reminders, lot-number tracking on injectables, and photo documentation with patient consent.",
    heroBadge: undefined,
    pricingTierIds: ["med-spa-provider-individual", "med-spa-standard", "med-spa-premium"],
    features: [
      F("Shield", "Consent-forward intake", "Procedures, risks, and photography permissions captured clearly."),
      F("ClipboardList", "Injectable lot tracking", "Units, lots, and follow-up windows in one record."),
      F("Camera", "Clinical photography", "Standardized angles with access tied to role."),
      F("FileText", "CPOM-aware reminders", "Documentation nudges based on jurisdiction and practice model."),
      F("Lock", "Least-privilege access", "Front desk, providers, and medical director views separated."),
      F("MessageSquare", "Follow-up protocols", "Post-treatment checklists clients can complete on device."),
    ],
    steps: stepsDefault,
    faqs: faq("med spa providers"),
  },
  {
    slug: "for-trainers",
    source: "for_trainers_waitlist",
    title: "For personal trainers — programs, adherence, and safe progression",
    description:
      "Programming blocks, readiness notes, progress photos, and liability-friendly check-ins for trainers in The Gold Collective.",
    eyebrow: "For personal trainers",
    headline: "Programs that survive real life.",
    subheadline:
      "Track readiness, pain flags, progression blocks, and adherence — so clients stay safe when travel, work, and sleep go sideways.",
    heroBadge: undefined,
    pricingTierIds: ["fitness-studio-standard", "licensed-pro-pro", "fitness-studio-premium"],
    features: [
      F("Target", "Progression blocks", "Mesocycles with deload rules you can explain in plain language."),
      F("Heart", "Readiness and pain flags", "Subjective scores that trigger conservative adjustments."),
      F("Calendar", "Session rhythm", "Makeups, travel weeks, and hybrid coaching windows."),
      F("Video", "Form check-ins", "Short clips with consent for remote coaching."),
      F("ClipboardList", "Liability-friendly notes", "Scope reminders and referral prompts when needed."),
      F("LineChart", "Strength and metric trends", "Simple charts clients actually understand."),
    ],
    steps: stepsDefault,
    faqs: faq("trainers"),
  },
  {
    slug: "for-barbershops",
    source: "for_barbershops_waitlist",
    title: "For barbershops — chairs, culture, and Saturday throughput",
    description:
      "Barbershop Standard with walk-ins, booth rental splits, and retail — multi-chair operations in The Gold Collective.",
    eyebrow: "For barbershops",
    headline: "Throughput without killing the culture.",
    subheadline:
      "Chair rotation, booth splits, retail at the counter, and wait-time honesty — built for busy shops, not quiet suites.",
    heroBadge: undefined,
    pricingTierIds: ["barbershop-standard", "salon-pro", "salon-premium"],
    features: [
      F("Users", "Chair and booth economics", "Fair splits and visibility owners can defend."),
      F("Calendar", "Saturday-grade scheduling", "Walk-ins plus appointments without mystery waits."),
      F("LineChart", "Shop-level KPIs", "Ticket, rebooking, and retail by chair."),
      F("Package", "Counter retail", "Bundles that match clipper, beard, and home care routines."),
      F("MessageSquare", "Team announcements", "One place for policy updates and guest notes."),
      F("Shield", "Role-based visibility", "Booth renters see their book; owners see the whole shop."),
    ],
    steps: stepsDefault,
    faqs: faq("barbershop owners"),
  },
  {
    slug: "for-tattoo-shops",
    source: "for_tattoo_shops_waitlist",
    title: "For tattoo shops — guest artists, deposits, and shop-wide compliance",
    description:
      "Guest artist windows, deposit rules, consent archives, and health department readiness for tattoo shops in The Gold Collective.",
    eyebrow: "For tattoo shops",
    headline: "Guest weeks without guest chaos.",
    subheadline:
      "Artist windows, deposits, consent archives, and shop-wide sanitation visibility — so health departments and clients see the same standards.",
    heroBadge: undefined,
    pricingTierIds: ["tattoo-shop-small", "tattoo-shop-standard", "tattoo-shop-premium"],
    features: [
      F("Calendar", "Guest artist scheduling", "Hold blocks, deposits, and portfolio links in one flow."),
      F("Wallet", "Deposit discipline", "Clear rules for cancellations and redraws."),
      F("FileText", "Shop compliance binder", "Logs and training reminders centralized."),
      F("Users", "Artist roles", "Private client notes stay with the artist when required."),
      F("Shield", "Consent vault", "Searchable archives when questions arise later."),
      F("BarChart3", "Shop performance", "Utilization and average project value without micromanaging art."),
    ],
    steps: stepsDefault,
    faqs: faq("tattoo shop owners"),
  },
  {
    slug: "for-piercing-studios",
    source: "for_piercing_studios_waitlist",
    title: "For piercing studios — jewelry specs, aftercare, and minor consent rails",
    description:
      "Jewelry materials, gauge notes, aftercare by placement, and guardian consent workflows for studios in The Gold Collective.",
    eyebrow: "For piercing studios",
    headline: "Jewelry memory that prevents surprises.",
    subheadline:
      "Material specs, threading styles, aftercare by placement, and minor consent rails — so swaps and downsizes stay safe.",
    heroBadge: undefined,
    pricingTierIds: ["piercing-studio", "tattoo-shop-standard", "salon-standard"],
    features: [
      F("Package", "Jewelry inventory intelligence", "Know what you have by material, gauge, and gem."),
      F("ClipboardList", "Placement protocols", "Angles, starter lengths, and downsizing timelines."),
      F("Shield", "Guardian consent", "Clear capture for minors with jurisdictional prompts."),
      F("Heart", "Aftercare by region", "Ear vs oral vs surface — instructions that match anatomy."),
      F("Camera", "Healing checks", "Optional photo consent for troubleshooting."),
      F("MessageSquare", "Swap reminders", "Nudge clients when downsizes are due."),
    ],
    steps: stepsDefault,
    faqs: faq("piercing studios"),
  },
  {
    slug: "for-nail-salons",
    source: "for_nail_salons_waitlist",
    title: "For nail salons — tables, dry time, and team consistency",
    description:
      "Table timing, dry stations, dip powder logs, and team menus for nail salons in The Gold Collective.",
    eyebrow: "For nail salons",
    headline: "Tables turn. Sets stay strong.",
    subheadline:
      "Dry time reality, tech assignment, and service consistency across a busy floor — without turning managers into hallway traffic cops.",
    heroBadge: undefined,
    pricingTierIds: ["salon-standard", "salon-pro", "salon-premium"],
    features: [
      F("Calendar", "Table and dry-time aware booking", "Fewer accidental overlaps at the lamp."),
      F("Users", "Tech load balancing", "Fair distribution of complex sets."),
      F("Palette", "Salon-wide design standards", "Brand-level menus with room for tech creativity."),
      F("Shield", "Sanitation visibility", "Logs that help during inspections and insurance questions."),
      F("LineChart", "Retail attachment by tech", "Coaching moments, not shame boards."),
      F("MessageSquare", "Client comms at scale", "Consistent tone from front desk to tech."),
    ],
    steps: stepsDefault,
    faqs: faq("nail salon teams"),
  },
  {
    slug: "for-lash-brow-studios",
    source: "for_lash_brow_studios_waitlist",
    title: "For lash & brow studios — specialty menus and sensitive-skin discipline",
    description:
      "Specialty menus, sensitivity tracking, and fill cadence for combined studios in The Gold Collective.",
    eyebrow: "For lash & brow studios",
    headline: "Two specialties. One standard.",
    subheadline:
      "Separate menus that still share client sensitivity history — so lifts, tints, and extensions do not fight each other chemically.",
    heroBadge: undefined,
    pricingTierIds: ["solo-studio", "salon-standard", "salon-pro"],
    features: [
      F("Target", "Cross-service sensitivity", "One profile for adhesives, dyes, and lifting solutions."),
      F("Calendar", "Fill and tint spacing", "Avoid stacking incompatible appointments."),
      F("Camera", "Before/after discipline", "Angles that work for both lash maps and brow healing."),
      F("ClipboardList", "Patch test records", "Dates, products, and reactions searchable later."),
      F("Users", "Specialist roles", "Lash vs brow leads with shared reception."),
      F("Sparkles", "Retail that fits", "Aftercare kits matched to services performed."),
    ],
    steps: stepsDefault,
    faqs: faq("lash and brow studios"),
  },
  {
    slug: "for-medspas",
    source: "for_medspas_waitlist",
    title: "For med spas — medical oversight, aesthetics floor, and retail harmony",
    description:
      "Med Spa Standard and Premium for charting, photography, inventory, and multi-provider coordination in The Gold Collective.",
    eyebrow: "For med spas",
    headline: "Medical rigor. Aesthetics pace.",
    subheadline:
      "Separate clinical and aesthetic workflows with shared client context — so injectors, laser techs, and estheticians stop duplicating intake.",
    heroBadge: undefined,
    pricingTierIds: ["med-spa-standard", "med-spa-premium", "licensed-pro-premium"],
    features: [
      F("Users", "Medical director visibility", "Oversight where required without slowing the floor."),
      F("Lock", "Chart privacy tiers", "Access tied to licensure and scope."),
      F("ClipboardList", "Injectable and laser logs", "Devices, settings, and lots in structured fields."),
      F("Camera", "Standardized clinical photos", "Comparables that hold up for consults."),
      F("Package", "Retail that respects clinical advice", "Attach home care to provider notes."),
      F("BarChart3", "Location performance", "Multi-room utilization without guesswork."),
    ],
    steps: stepsDefault,
    faqs: faq("med spa operators"),
  },
  {
    slug: "for-fitness-studios",
    source: "for_fitness_studios_waitlist",
    title: "For fitness studios — classes, memberships, and coach handoffs",
    description:
      "Fitness Studio Standard and Premium for schedules, memberships, and coach notes in The Gold Collective.",
    eyebrow: "For fitness studios",
    headline: "Classes full. Coaches aligned.",
    subheadline:
      "Schedules, capacity, membership tiers, and coach handoffs — so substitutions do not reset client progress stories.",
    heroBadge: undefined,
    pricingTierIds: ["fitness-studio-standard", "fitness-studio-premium", "salon-pro"],
    features: [
      F("Calendar", "Capacity-aware scheduling", "Waitlists that respect room and equipment limits."),
      F("Users", "Coach handoff notes", "Injuries, goals, and modifications travel session to session."),
      F("Wallet", "Membership clarity", "Trials, freezes, and upgrades clients understand."),
      F("Video", "Hybrid options", "On-demand or livestream add-ons where you allow them."),
      F("LineChart", "Retention signals", "Attendance patterns before churn hardens."),
      F("Shield", "Waivers and PAR-Q", "Digital capture with versioning."),
    ],
    steps: stepsDefault,
    faqs: faq("fitness studio owners"),
  },
  {
    slug: "for-solo-studios",
    source: "for_solo_studios_waitlist",
    title: "For solo studios — one room, one brand, enterprise-grade calm",
    description:
      "Solo Studio tier for independent suites needing pro tools without enterprise bloat in The Gold Collective.",
    eyebrow: "For solo studios",
    headline: "Suite life. Enterprise calm.",
    subheadline:
      "One room does not mean toy software — run deposits, intake, retail, and reminders like a pro without hiring an ops team.",
    heroBadge: undefined,
    pricingTierIds: ["solo-studio", "licensed-pro-pro", "licensed-pro-premium"],
    features: [
      F("Calendar", "Solo-friendly booking", "Buffers, cleanup, and travel time honored automatically."),
      F("Wallet", "Deposits without awkward DMs", "Policies clients accept at booking."),
      F("Camera", "Private galleries", "Consent-first photos that stay organized."),
      F("MessageSquare", "Automations that sound human", "Short, on-brand reminders and follow-ups."),
      F("LineChart", "Simple economics", "Average ticket, rebooking, and retail in one glance."),
      F("Shield", "Security without IT", "Role defaults that match a one-person shop."),
    ],
    steps: stepsDefault,
    faqs: faq("solo studio owners"),
  },
  {
    slug: "for-models",
    source: "for_models_waitlist",
    title: "For models — digitals, measurements, and bookings without inbox chaos",
    description:
      "Aspiring and working model tiers with portfolios, comp cards, and logistics — fashion modules on the June 30 cadence in The Gold Collective.",
    eyebrow: "For models",
    headline: "Your book, always ready.",
    subheadline:
      "Digitals, measurements, and availability that update everywhere — so castings stop hunting through old threads.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["aspiring-model", "working-model", "stylist-assistant-fashion"],
    features: [
      F("Camera", "Digitals and tears", "Organized sets with clear usage rights."),
      F("ClipboardList", "Measurements that stay honest", "Update once, propagate to agencies and clients you approve."),
      F("Calendar", "Casting logistics", "Callbacks, travel blocks, and rest windows."),
      F("Shield", "Guardian and consent rails", "Age-appropriate defaults where applicable."),
      F("Sparkles", "Polaroids and polar moods", "Quick capture workflows for open calls."),
      F("MessageSquare", "Agency-ready comms", "Threads that stay professional under pressure."),
    ],
    steps: stepsDefault,
    faqs: faq("models"),
  },
  {
    slug: "for-modeling-agencies",
    source: "for_modeling_agencies_waitlist",
    title: "For modeling agencies — rosters, packages, and buyer-ready exports",
    description:
      "Boutique through Premium agency tiers with roster tools and approvals — June 30 fashion cadence in The Gold Collective.",
    eyebrow: "For modeling agencies",
    headline: "Rosters that buyers actually open.",
    subheadline:
      "Packages, polaroids, and digitals with approvals, expirations, and clear usage — so talent stays protected and bookings move faster.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["modeling-agency-boutique", "modeling-agency-standard", "modeling-agency-premium"],
    features: [
      F("Users", "Roster roles", "Bookers, parents/guardians, and talent views separated cleanly."),
      F("Package", "Package builder", "Comp cards and digitals that stay on-brand."),
      F("Shield", "Usage and territory controls", "Stop accidental over-sharing."),
      F("Calendar", "Go-sees and travel", "Conflicts surfaced before planes are booked."),
      F("BarChart3", "Booking velocity", "Understand markets without exploiting talent data."),
      F("MessageSquare", "Client-ready threads", "Professional tone preserved across the team."),
    ],
    steps: stepsDefault,
    faqs: faq("modeling agencies"),
  },
  {
    slug: "for-designers",
    source: "for_designers_waitlist",
    title: "For fashion designers — line sheets, appointments, and showroom flow",
    description:
      "Designer Standard and Pro with line sheets, appointments, and buyer notes — June 30 cadence in The Gold Collective.",
    eyebrow: "For designers",
    headline: "Line sheets buyers can navigate.",
    subheadline:
      "Lookbooks, appointments, and showroom notes connected to the same inventory story — fewer PDFs, fewer mistakes.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["fashion-designer-standard", "fashion-designer-pro", "showroom-boutique"],
    features: [
      F("Layers", "Line sheet discipline", "Colorways, sizes, and MOQs in structured views."),
      F("Calendar", "Showroom appointments", "Buyer blocks with prep checklists."),
      F("MessageSquare", "Buyer notes tied to SKU", "Feedback that does not get lost in email."),
      F("Palette", "Creative references", "Mood, textile, and trim libraries linked to seasons."),
      F("Package", "Sample inventory", "Know what is out, with whom, and when it returns."),
      F("Shield", "NDA-friendly sharing", "Watermarked previews where you need them."),
    ],
    steps: stepsDefault,
    faqs: faq("designers"),
  },
  {
    slug: "for-casting-directors",
    source: "for_casting_directors_waitlist",
    title: "For casting directors — shortlists, callbacks, and talent comms",
    description:
      "Indie through Premium casting director tiers with logistics and approvals — June 30 cadence in The Gold Collective.",
    eyebrow: "For casting directors",
    headline: "Shortlists that stay respectful.",
    subheadline:
      "Callbacks, holds, and talent comms with clear status — so nobody learns bad news from a rumor mill.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["casting-director-indie", "casting-director-pro", "casting-director-premium"],
    features: [
      F("Users", "Role-separated rooms", "Clients, creatives, and talent teams see appropriate slices."),
      F("Calendar", "Callback grids", "Conflicts and travel surfaced early."),
      F("ClipboardList", "Brief ingestion", "Roles, sizes, skills, and constraints structured."),
      F("Shield", "Consent for tapes and photos", "Usage tied to project and window."),
      F("MessageSquare", "Agency-grade comms", "Templates that stay humane under deadlines."),
      F("BarChart3", "Pipeline clarity", "Where the search stalls — without blaming talent."),
    ],
    steps: stepsDefault,
    faqs: faq("casting directors"),
  },
  {
    slug: "for-showrooms",
    source: "for_showrooms_waitlist",
    title: "For showrooms — appointments, lines, and buyer relationships",
    description:
      "Boutique and Standard showroom tiers with appointments and notes — June 30 cadence in The Gold Collective.",
    eyebrow: "For showrooms",
    headline: "Appointments that feel bespoke.",
    subheadline:
      "Buyer history, line preferences, and follow-ups in one Gold Collective lane — so the room remembers the relationship.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["showroom-boutique", "showroom-standard", "fashion-designer-standard"],
    features: [
      F("Calendar", "Buyer calendars", "Season previews with prep tasks."),
      F("ClipboardList", "Line memory", "What they bought, skipped, and asked to see again."),
      F("MessageSquare", "Follow-ups that convert", "Short, tailored nudges after market."),
      F("Users", "Team roles", "Sales vs ops vs designer visibility."),
      F("LineChart", "Appointment yield", "Understand time invested vs outcomes."),
      F("Sparkles", "Presentation polish", "Digital boards that match the room aesthetic."),
    ],
    steps: stepsDefault,
    faqs: faq("showrooms"),
  },
  {
    slug: "for-clothing-brands",
    source: "for_clothing_brands_waitlist",
    title: "For clothing brands — wholesale rhythm and advocate activations",
    description:
      "Clothing Brand Standard and Pro with wholesale notes and advocate programs — June 30 cadence in The Gold Collective.",
    eyebrow: "For clothing brands",
    headline: "Wholesale rhythm without spreadsheet fatigue.",
    subheadline:
      "Linesheets, door counts, reorder signals, and advocate activations — so growth does not depend on opaque ad tax.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["clothing-brand-standard", "clothing-brand-pro", "brand-partner-pro"],
    features: [
      F("BarChart3", "Door performance", "Which accounts move which SKUs."),
      F("Package", "Season logistics", "Samples, market dates, and returns tracked."),
      F("Target", "Advocate activations", "Authentic education in service settings."),
      F("MessageSquare", "Account comms", "Notes buyers and reps can trust."),
      F("Shield", "MAP and claims guardrails", "Protect brand and partners."),
      F("Store", "Direct path when ready", "Storefront tiers when DTC fits."),
    ],
    steps: stepsDefault,
    faqs: faq("clothing brands"),
  },
  {
    slug: "for-fashion-events",
    source: "for_fashion_events_waitlist",
    title: "For fashion events — crews, call times, and vendor coordination",
    description:
      "Fashion event producer Indie through Premium with run-of-show and vendor coordination — June 30 cadence in The Gold Collective.",
    eyebrow: "For fashion events",
    headline: "Call times everyone actually sees.",
    subheadline:
      "Run-of-show, vendor load-in, model holds, and backstage comms — one command layer instead of fifty group chats.",
    heroBadge: "Launching June 30, 2026",
    pricingTierIds: ["fashion-event-producer-indie", "fashion-event-producer-pro", "fashion-event-producer-premium"],
    features: [
      F("Calendar", "Load-in to strike", "Trucks, rooms, and holds on one timeline."),
      F("Users", "Crew roles", "Hair, makeup, dressers, and stage managers see the right slices."),
      F("MessageSquare", "Backstage comms", "Urgent channels that do not spam everyone."),
      F("ClipboardList", "Run-of-show", "Changes propagate with version clarity."),
      F("MapPin", "Venue logistics", "Rooms, routes, and accessibility notes."),
      F("Shield", "Talent safety defaults", "Minor and guardian workflows where required."),
    ],
    steps: stepsDefault,
    faqs: faq("fashion event producers"),
  },
];

const header = `import type { AudienceLandingConfig } from "@/types/audience-landing";
import type { AudienceIconName } from "@/components/audience/audience-icons";

const pages: AudienceLandingConfig[] = `;

const footer = `;

const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p])) as Record<string, AudienceLandingConfig>;

export function getAudienceLanding(slug: string): AudienceLandingConfig | undefined {
  return bySlug[slug];
}

export const audienceLandingSlugs = Object.keys(bySlug) as string[];
`;

function esc(s) {
  return JSON.stringify(s);
}

const serialized = pages
  .map((p) => {
    const ogTitle = p.headline.length > 52 ? p.title.replace(/\s*\|\s*.*$/, "").slice(0, 60) : p.headline;
    return `{
    slug: ${esc(p.slug)},
    source: ${esc(p.source)},
    title: ${esc(p.title)},
    description: ${esc(p.description)},
    eyebrow: ${esc(p.eyebrow)},
    headline: ${esc(p.headline)},
    subheadline: ${esc(p.subheadline)},
    heroBadge: ${p.heroBadge === undefined ? "undefined" : esc(p.heroBadge)},
    openGraphTitle: ${esc(ogTitle)},
    pricingTierIds: ${esc(p.pricingTierIds)},
    features: ${JSON.stringify(p.features, null, 6).replace(/"icon": "([^"]+)"/g, 'icon: "$1" as AudienceIconName')},
    steps: ${JSON.stringify(p.steps)},
    faqs: ${JSON.stringify(p.faqs)},
  }`;
  })
  .join(",\n");

fs.writeFileSync(out, `${header}[\n${serialized}\n]${footer}`);

console.error("Wrote", out, "pages:", pages.length);
