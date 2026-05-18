-- Sif's Gold Career Paths — roles, milestones, interactive maps
-- Run after public.profiles exists.
-- Seeds: npx tsx scripts/gen-career-sql.ts → append schema-career-paths-seeds.generated.sql

CREATE TABLE IF NOT EXISTS public.career_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('hair', 'skin', 'nails', 'lashes', 'massage', 'tattoo', 'business')
  ),
  description text NOT NULL,
  median_annual_salary integer NOT NULL,
  salary_range_low integer NOT NULL,
  salary_range_high integer NOT NULL,
  bls_source_link text NOT NULL,
  salary_data_year integer NOT NULL,
  required_license_types text[] NOT NULL DEFAULT '{}',
  required_education text NOT NULL,
  typical_continuing_education text NOT NULL,
  specialty_certifications text[] NOT NULL DEFAULT '{}',
  career_advancement text NOT NULL,
  icon text NOT NULL DEFAULT 'Briefcase'
);

CREATE INDEX IF NOT EXISTS career_roles_category_idx ON public.career_roles (category);
CREATE INDEX IF NOT EXISTS career_roles_median_salary_idx ON public.career_roles (median_annual_salary);

CREATE TABLE IF NOT EXISTS public.career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starting_point text NOT NULL CHECK (
    starting_point IN ('high_school', 'career_change', 'currently_licensed', 'experienced_pro')
  ),
  end_role text NOT NULL CHECK (
    end_role IN ('salon_owner', 'platform_artist', 'educator', 'celebrity_stylist')
  ),
  name text NOT NULL,
  description text NOT NULL,
  estimated_total_years integer NOT NULL,
  estimated_total_investment integer NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS career_paths_start_end_idx
  ON public.career_paths (starting_point, end_role);

CREATE TABLE IF NOT EXISTS public.career_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
  milestone_order integer NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  estimated_duration_months integer NOT NULL,
  estimated_cost integer NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  typical_outcomes text[] NOT NULL DEFAULT '{}',
  UNIQUE (path_id, milestone_order)
);

CREATE TABLE IF NOT EXISTS public.career_path_roles (
  path_id uuid NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.career_roles(id) ON DELETE CASCADE,
  milestone_order integer NOT NULL,
  PRIMARY KEY (path_id, role_id, milestone_order)
);

CREATE TABLE IF NOT EXISTS public.user_career_interests (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  interested_roles uuid[] NOT NULL DEFAULT '{}',
  starting_point text CHECK (
    starting_point IN ('high_school', 'career_change', 'currently_licensed', 'experienced_pro')
  ),
  target_role uuid REFERENCES public.career_roles(id) ON DELETE SET NULL,
  saved_path_id uuid REFERENCES public.career_paths(id) ON DELETE SET NULL,
  milestone_progress jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_path_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_career_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read career roles" ON public.career_roles;
CREATE POLICY "Public read career roles"
  ON public.career_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read career paths" ON public.career_paths;
CREATE POLICY "Public read career paths"
  ON public.career_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read milestones" ON public.career_milestones;
CREATE POLICY "Public read milestones"
  ON public.career_milestones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read path roles" ON public.career_path_roles;
CREATE POLICY "Public read path roles"
  ON public.career_path_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own career interests" ON public.user_career_interests;
CREATE POLICY "Users manage own career interests"
  ON public.user_career_interests FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
-- Auto-generated (28 roles, 10 paths)
INSERT INTO public.career_roles (
  id, name, category, description, median_annual_salary, salary_range_low, salary_range_high,
  bls_source_link, salary_data_year, required_license_types, required_education,
  typical_continuing_education, specialty_certifications, career_advancement, icon
) VALUES
  ('r1000001-0001-4001-8001-000000000001'::uuid, 'Licensed Cosmetologist', 'hair', 'Provides haircutting, coloring, styling, and basic chemical services within state scope.', 35080, 22600, 55000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_cosmetology_license']::text[], 'State-approved cosmetology program (typically 1,000–1,600 clock hours depending on jurisdiction).', 'Renewal CE per state board (often 4–16 hours biennially).', ARRAY['Manufacturer color certifications', 'Texture / extension modules']::text[], 'Color specialist, salon lead, suite rental, educator, or salon ownership.', 'Scissors'),
  ('r1000002-0002-4002-8002-000000000002'::uuid, 'Barber', 'hair', 'Men''s grooming, fades, beard design, and straight-razor services where permitted.', 38420, 24000, 62000, 'https://www.bls.gov/oes/current/oes395011.htm', 2023, ARRAY['state_barber_or_cosmetology_license']::text[], 'Barber or cosmetology program per state (often 1,000–1,500 hours).', 'Bloodborne pathogen refreshers; razor endorsement where required.', ARRAY['Straight razor certification', 'Fade / texture workshops']::text[], 'Shop lead, mobile barber, studio owner, or platform educator.', 'Scissors'),
  ('r1000003-0003-4003-8003-000000000003'::uuid, 'Licensed Esthetician', 'skin', 'Facials, skin analysis, hair removal, and foundational device services within scope.', 43140, 28000, 72000, 'https://www.bls.gov/oes/current/oes395094.htm', 2023, ARRAY['state_esthetics_license']::text[], 'Esthetics program (often 600–1,200 hours by state).', 'State renewal CE; device training per manufacturer.', ARRAY['Chemical peel tiers', 'Microcurrent / LED device certs']::text[], 'Med spa technician, spa lead, or esthetics educator.', 'Sparkles'),
  ('r1000004-0004-4004-8004-000000000004'::uuid, 'Nail Technician', 'nails', 'Manicures, pedicures, enhancements, and nail health-focused services.', 32270, 22000, 48000, 'https://www.bls.gov/oes/current/oes395092.htm', 2023, ARRAY['state_manicurist_or_nail_license']::text[], 'Nail technology program (often 300–600 hours).', 'Sanitation refreshers; e-file safety courses.', ARRAY['Hard gel / acrylic manufacturer certs', 'Nail art masterclasses']::text[], 'Nail art specialist, suite owner, or social educator.', 'Sparkles'),
  ('r1000005-0005-4005-8005-000000000005'::uuid, 'Massage Therapist (LMT)', 'massage', 'Therapeutic massage in spa, clinical, or independent practice settings.', 55310, 32000, 79000, 'https://www.bls.gov/oes/current/oes311131.htm', 2023, ARRAY['state_massage_license']::text[], 'Massage therapy program (typically 500–1,000 hours).', 'Ethics and pathology refreshers per state.', ARRAY['Sports massage', 'Medical / orthopedic massage CE']::text[], 'Clinical specialist, spa director, or private practice owner.', 'Hand'),
  ('r1000006-0006-4006-8006-000000000006'::uuid, 'Tattoo Artist', 'tattoo', 'Custom tattoo application under local licensure and apprenticeship standards.', 57990, 28000, 95000, 'https://www.bls.gov/oes/current/oes271013.htm', 2023, ARRAY['local_tattoo_registration', 'bloodborne_pathogen_training']::text[], 'Apprenticeship (typical 1–3 years). BLS reports Fine Artists; tattoo wages vary widely by market.', 'Annual BBP renewal; local health department updates.', ARRAY['Style specialties (realism, blackwork) via mentorship']::text[], 'Private studio, convention circuit, or shop ownership.', 'PenTool'),
  ('r1000007-0007-4007-8007-000000000007'::uuid, 'Hair Color Specialist', 'hair', 'Advanced formulation, corrective color, and lightening services.', 38000, 26000, 72000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_cosmetology_license']::text[], 'Licensed cosmetologist plus advanced color CE.', 'Manufacturer academies; corrective color workshops.', ARRAY['Balayage', 'Vivid fashion color', 'Color correction']::text[], 'Balayage expert, platform artist, or color educator.', 'Palette'),
  ('r1000008-0008-4008-8008-000000000008'::uuid, 'Salon Manager', 'business', 'Floor leadership, scheduling, retail, and service standards for a salon team.', 38760, 28000, 58000, 'https://www.bls.gov/oes/current/oes391022.htm', 2023, ARRAY['cosmetology_license_recommended']::text[], 'License plus management / business CE or associate coursework.', 'Leadership, HR basics, and inventory management.', ARRAY['Salon management certificates', 'Retail leadership']::text[], 'Salon owner, multi-location operator, or brand educator.', 'Users'),
  ('r1000009-0009-4009-8009-000000000009'::uuid, 'Salon Owner', 'business', 'Owns or partners in a salon — P&L, hiring, marketing, and compliance.', 49260, 35000, 120000, 'https://www.bls.gov/oes/current/oes119179.htm', 2023, ARRAY['state_cosmetology_or_barber_license', 'business_registration']::text[], 'Active license plus business planning; income varies with ownership model.', 'Business law, tax, and leadership CE.', ARRAY['Small business management', 'Salon suite franchise training']::text[], 'Multi-location owner, product line, or education company.', 'Building2'),
  ('r1000010-0010-4010-8010-000000000010'::uuid, 'Platform Artist', 'hair', 'Travels for brand education, stage demos, and content creation.', 45000, 32000, 95000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_cosmetology_or_barber_license']::text[], 'License plus portfolio; brand contract training.', 'Teaching methodology and stage presentation.', ARRAY['Brand ambassador programs', 'Stage cut / color certs']::text[], 'Creative director, product development consultant.', 'Mic'),
  ('r1000011-0011-4011-8011-000000000011'::uuid, 'Beauty Educator', 'business', 'Teaches in cosmetology schools or delivers CE to licensed professionals.', 42000, 32000, 68000, 'https://www.bls.gov/oes/current/oes259032.htm', 2023, ARRAY['instructor_license_where_required', 'active_practitioner_license']::text[], 'License plus instructor training (often 500+ additional hours).', 'Adult learning theory; curriculum updates.', ARRAY['CIDESCO-adjacent CE', 'State instructor license']::text[], 'School director, platform artist, or curriculum author.', 'GraduationCap'),
  ('r1000012-0012-4012-8012-000000000012'::uuid, 'Celebrity / Session Stylist', 'hair', 'On-set, tour, and red-carpet styling for talent and production.', 52000, 35000, 150000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_cosmetology_license']::text[], 'License plus union / production networking; highly variable income.', 'Session styling and wig work workshops.', ARRAY['Extension mastery', 'Period styling']::text[], 'Creative director, product collaborator, or agency representation.', 'Star'),
  ('r1000013-0013-4013-8013-000000000013'::uuid, 'Mobile Beauty Professional', 'business', 'Brings services to clients'' homes, events, or corporate settings.', 36000, 24000, 65000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_license_in_service_category']::text[], 'License plus mobile business permits and liability insurance.', 'Sanitation for mobile setups.', ARRAY['Bridal styling', 'On-location color']::text[], 'Suite owner, agency lead, or product educator.', 'Car'),
  ('r1000014-0014-4014-8014-000000000014'::uuid, 'Suite / Studio Owner', 'business', 'Rents or owns a suite within a collective; self-directed clientele.', 45000, 30000, 95000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_license', 'business_registration']::text[], 'License plus lease economics and tax planning.', 'Business CE and marketing.', ARRAY['Suite franchise onboarding']::text[], 'Multi-suite investor or educator.', 'DoorOpen'),
  ('r1000015-0015-4015-8015-000000000015'::uuid, 'Med Spa Technician', 'skin', 'Device-backed treatments in medical-spa settings under appropriate supervision.', 46000, 34000, 72000, 'https://www.bls.gov/oes/current/oes395094.htm', 2023, ARRAY['esthetics_license', 'medical_director_oversight']::text[], 'Esthetics license plus device manufacturer training.', 'Laser / RF safety refreshers.', ARRAY['Laser hair reduction', 'Microneedling (where allowed)']::text[], 'Lead technician, clinic manager, or trainer.', 'Stethoscope'),
  ('r1000016-0016-4016-8016-000000000016'::uuid, 'Laser Technician', 'skin', 'Performs laser and light-based services where state rules allow under MD oversight.', 47000, 35000, 75000, 'https://www.bls.gov/oes/current/oes395094.htm', 2023, ARRAY['esthetics_or_rn_scope', 'laser_certification']::text[], 'Esthetics or nursing pathway plus laser safety course.', 'Device-specific annual training.', ARRAY['Laser physics & safety', 'IPL protocols']::text[], 'Med spa lead or aesthetic nurse pathway (RN).', 'Zap'),
  ('r1000017-0017-4017-8017-000000000017'::uuid, 'Wedding & Event Stylist', 'hair', 'Bridal parties, editorial, and on-location event styling.', 40000, 28000, 78000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['state_cosmetology_license']::text[], 'License plus portfolio and contract templates.', 'Bridal business and trial planning.', ARRAY['Airbrush makeup (if dual-licensed)', 'Extension styling']::text[], 'Celebrity session work or agency ownership.', 'Heart'),
  ('r1000018-0018-4018-8018-000000000018'::uuid, 'Nail Art Specialist', 'nails', 'Competition-level art, structure, and social content monetization.', 35000, 24000, 62000, 'https://www.bls.gov/oes/current/oes395092.htm', 2023, ARRAY['nail_technology_license']::text[], 'Nail program plus art / structure CE.', 'E-file and chemistry safety.', ARRAY['Competition nail art', '3D sculpting']::text[], 'Educator, brand ambassador, or suite owner.', 'Brush'),
  ('r1000019-0019-4019-8019-000000000019'::uuid, 'Lash Artist', 'lashes', 'Classic and volume lash extensions within state scope.', 38000, 26000, 65000, 'https://www.bls.gov/oes/current/oes395094.htm', 2023, ARRAY['esthetics_or_cosmetology_license', 'lash_certification']::text[], 'Base license plus certified lash training (varies by state).', 'Isolation safety and adhesive chemistry.', ARRAY['Volume / mega-volume', 'Lash lift & tint']::text[], 'Suite owner or lash educator.', 'Eye'),
  ('r1000020-0020-4020-8020-000000000020'::uuid, 'Brow & Lamination Specialist', 'lashes', 'Brow shaping, tinting, lamination, and henna where permitted.', 36000, 25000, 58000, 'https://www.bls.gov/oes/current/oes395094.htm', 2023, ARRAY['esthetics_or_cosmetology_license']::text[], 'License plus brow / lamination certification.', 'Patch testing and contraindications.', ARRAY['Brow lamination', 'Microblading PMU (separate regulation)']::text[], 'Full-face aesthetic specialist or educator.', 'ScanFace'),
  ('r1000021-0021-4021-8021-000000000021'::uuid, 'Personal Trainer', 'massage', 'Fitness coaching — often complementary to beauty/wellness careers.', 46480, 28000, 78000, 'https://www.bls.gov/oes/current/oes399031.htm', 2023, ARRAY['nationally_accredited_certification']::text[], 'CPT certification (ACE, NASM, ISSA, etc.).', 'CPR/AED; specialty populations.', ARRAY['Corrective exercise', 'Nutrition coaching (non-RD scope)']::text[], 'Studio owner, online coach, or wellness brand partner.', 'Dumbbell'),
  ('r1000022-0022-4022-8022-000000000022'::uuid, 'Multi-Location Owner', 'business', 'Operates two or more salons, suites, or franchise units.', 72000, 45000, 180000, 'https://www.bls.gov/oes/current/oes119179.htm', 2023, ARRAY['business_entities', 'licensed_managers_on_site']::text[], 'Prior ownership experience plus finance and HR systems.', 'Multi-unit operations and compliance.', ARRAY['Franchise operations', 'MBA / business courses (optional)']::text[], 'Regional brand, product distribution, or private equity exit.', 'Network'),
  ('r1000023-0023-4023-8023-000000000023'::uuid, 'Brand Ambassador', 'business', 'Represents product lines through content, classes, and retail partnerships.', 42000, 30000, 85000, 'https://www.bls.gov/oes/current/oes419091.htm', 2023, ARRAY['active_license_in_category']::text[], 'License plus brand contract and social compliance training.', 'Product chemistry and FTC disclosure rules.', ARRAY['Brand-specific academies']::text[], 'Platform artist or product development role.', 'Megaphone'),
  ('r1000024-0024-4024-8024-000000000024'::uuid, 'Barber Shop Owner', 'business', 'Owns a barbershop — chair rental, culture, and service menu.', 52000, 38000, 110000, 'https://www.bls.gov/oes/current/oes119179.htm', 2023, ARRAY['barber_license', 'business_registration']::text[], 'Barber license plus shop operations experience.', 'Shop safety audits and tax planning.', ARRAY['Barbershop management workshops']::text[], 'Multi-shop owner or education brand.', 'Store'),
  ('r1000025-0025-4025-8025-000000000025'::uuid, 'Balayage Expert', 'hair', 'Specializes in hand-painted lightening and lived-in color.', 45000, 32000, 85000, 'https://www.bls.gov/oes/current/oes395012.htm', 2023, ARRAY['cosmetology_license']::text[], 'License plus advanced lightening CE.', 'Toning and bond-building protocols.', ARRAY['Balayage / babylight academies']::text[], 'Educator, platform artist, or celebrity stylist.', 'Sun'),
  ('r1000026-0026-4026-8026-000000000026'::uuid, 'Medical Aesthetics Provider', 'skin', 'RN or NP pathway for injectables and advanced med-aesthetics (separate licensure).', 77000, 55000, 120000, 'https://www.bls.gov/oes/current/oes291141.htm', 2023, ARRAY['registered_nurse_or_np', 'medical_director']::text[], 'Nursing degree plus aesthetic nursing CE.', 'Injection anatomy and complication management.', ARRAY['Aesthetic nursing certifications']::text[], 'Clinic director or training institute lead.', 'Syringe'),
  ('r1000027-0027-4027-8027-000000000027'::uuid, 'Nail Educator', 'nails', 'Teaches nail technology in schools or advanced CE classes.', 40000, 32000, 58000, 'https://www.bls.gov/oes/current/oes259032.htm', 2023, ARRAY['nail_license', 'instructor_license_where_required']::text[], 'Nail license plus instructor credentials.', 'Teaching methodology.', ARRAY['Competition judging', 'Product chemistry']::text[], 'School director or social educator.', 'BookOpen'),
  ('r1000028-0028-4028-8028-000000000028'::uuid, 'Mobile Barber / Studio Owner', 'hair', 'Barber with owned studio or mobile unit — common career-change outcome.', 48000, 32000, 90000, 'https://www.bls.gov/oes/current/oes395011.htm', 2023, ARRAY['barber_license']::text[], 'Barber school plus business setup.', 'Mobile sanitation and booking systems.', ARRAY['Shop ownership workshops']::text[], 'Multi-chair shop owner or educator.', 'Truck')
ON CONFLICT (id) DO UPDATE SET median_annual_salary = EXCLUDED.median_annual_salary;

INSERT INTO public.career_paths (
  id, starting_point, end_role, name, description, estimated_total_years, estimated_total_investment, order_index
) VALUES
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'high_school', 'salon_owner', 'High school → salon owner', 'Cosmetology school, licensure, floor experience, management, and ownership — multiple valid branches along the way.', 7, 45000, 1),
  ('p1000002-0002-4002-8002-000000000002'::uuid, 'career_change', 'salon_owner', 'Career change → barber → studio owner', 'Pivot into barbering, build a book, then mobile or studio ownership.', 5, 32000, 2),
  ('p1000003-0003-4003-8003-000000000003'::uuid, 'career_change', 'educator', 'Career change → esthetics → med spa', 'Esthetics license, device training, med-spa employment — clinical lane optional later.', 4, 22000, 3),
  ('p1000004-0004-4004-8004-000000000004'::uuid, 'currently_licensed', 'educator', 'Licensed pro → educator → platform artist', 'Leverage existing license toward teaching and brand partnerships.', 4, 12000, 4),
  ('p1000005-0005-4005-8005-000000000005'::uuid, 'experienced_pro', 'salon_owner', 'Experienced pro → manager → multi-location owner', 'Business coursework and unit economics for scaling beyond one site.', 5, 55000, 5),
  ('p1000006-0006-4006-8006-000000000006'::uuid, 'high_school', 'educator', 'Cosmetology school → color specialist → educator', 'Hair color depth, balayage expertise, then teaching credentials.', 6, 28000, 6),
  ('p1000007-0007-4007-8007-000000000007'::uuid, 'currently_licensed', 'educator', 'Esthetics → laser certification → med spa lead', 'Device credentials and clinical environment experience.', 3, 15000, 7),
  ('p1000008-0008-4008-8008-000000000008'::uuid, 'career_change', 'platform_artist', 'Nail tech → nail art specialist → educator / influencer', 'Structure, art, content, and brand partnerships.', 4, 14000, 8),
  ('p1000009-0009-4009-8009-000000000009'::uuid, 'experienced_pro', 'celebrity_stylist', 'Cosmetology → wedding focus → celebrity stylist', 'Event portfolio, agency networking, session work.', 8, 20000, 9),
  ('p1000010-0010-4010-8010-000000000010'::uuid, 'career_change', 'salon_owner', 'Massage school → LMT → specialty → private practice', 'Clinical or sports specialty with optional solo practice.', 4, 18000, 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.career_milestones (
  id, path_id, milestone_order, name, description, estimated_duration_months, estimated_cost, requirements, typical_outcomes
) VALUES
  ('m0000010000-4000-8000-000000000001'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 1, 'Explore cosmetology programs', 'Research accredited schools and state hour requirements.', 3, 500, ARRAY['research_schools']::text[], ARRAY['Shortlist programs']::text[]),
  ('m0000020000-4000-8000-000000000002'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 2, 'Complete cosmetology school', 'Clock hours, mock boards, and practical exams.', 12, 18000, ARRAY['state_cosmetology_program']::text[], ARRAY['Graduate eligible for board']::text[]),
  ('m0000030000-4000-8000-000000000003'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 3, 'Pass state board exams', 'Written + practical per your state vendor.', 2, 400, ARRAY['state_board_exams']::text[], ARRAY['Licensed cosmetologist']::text[]),
  ('m0000040000-4000-8000-000000000004'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 4, 'Associate / commission chair', 'Build speed, rebooking, and retail attachment.', 24, 2000, ARRAY['employment']::text[], ARRAY['Consistent book']::text[]),
  ('m0000050000-4000-8000-000000000005'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 5, 'Lead stylist or team lead', 'Mentor juniors and own advanced tickets.', 24, 3000, ARRAY['continuing_education']::text[], ARRAY['Senior title']::text[]),
  ('m0000060000-4000-8000-000000000006'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 6, 'Salon manager track', 'Scheduling, P&L exposure, hiring.', 18, 2500, ARRAY['management_ce']::text[], ARRAY['Manager role']::text[]),
  ('m0000070000-4000-8000-000000000007'::uuid, 'p1000001-0001-4001-8001-000000000001'::uuid, 7, 'Open or buy a salon', 'Lease, build-out, insurance, marketing.', 12, 20000, ARRAY['business_license', 'capital']::text[], ARRAY['Owner']::text[]),
  ('m0000080000-4000-8000-000000000008'::uuid, 'p1000002-0002-4002-8002-000000000002'::uuid, 1, 'Barber school enrollment', 'Verify state barber vs cosmetology path.', 1, 300, ARRAY['school_application']::text[], ARRAY['Accepted']::text[]),
  ('m0000090000-4000-8000-000000000009'::uuid, 'p1000002-0002-4002-8002-000000000002'::uuid, 2, 'Complete barber program', 'Fades, sanitation, state law.', 10, 14000, ARRAY['barber_program']::text[], ARRAY['Graduate']::text[]),
  ('m0000100000-4000-8000-000000000010'::uuid, 'p1000002-0002-4002-8002-000000000002'::uuid, 3, 'Licensed barber on floor', 'Shop employment or rental.', 18, 1500, ARRAY['state_license']::text[], ARRAY['Full book']::text[]),
  ('m0000110000-4000-8000-000000000011'::uuid, 'p1000002-0002-4002-8002-000000000002'::uuid, 4, 'Mobile barber clientele', 'Equipment + liability coverage.', 12, 4000, ARRAY['business_registration']::text[], ARRAY['Mobile income']::text[]),
  ('m0000120000-4000-8000-000000000012'::uuid, 'p1000002-0002-4002-8002-000000000002'::uuid, 5, 'Studio / shop ownership', 'Chair rental model or owned shop.', 18, 12000, ARRAY['capital', 'lease']::text[], ARRAY['Owner']::text[]),
  ('m0000130000-4000-8000-000000000013'::uuid, 'p1000003-0003-4003-8003-000000000003'::uuid, 1, 'Esthetics school', 'Skin science and sanitation foundations.', 8, 12000, ARRAY['esthetics_program']::text[], ARRAY['Graduate']::text[]),
  ('m0000140000-4000-8000-000000000014'::uuid, 'p1000003-0003-4003-8003-000000000003'::uuid, 2, 'State esthetics license', 'Board exams per jurisdiction.', 2, 350, ARRAY['state_board']::text[], ARRAY['Licensed']::text[]),
  ('m0000150000-4000-8000-000000000015'::uuid, 'p1000003-0003-4003-8003-000000000003'::uuid, 3, 'Spa employment', 'Build facial series and retail.', 12, 1000, ARRAY['employment']::text[], ARRAY['Stable clientele']::text[]),
  ('m0000160000-4000-8000-000000000016'::uuid, 'p1000003-0003-4003-8003-000000000003'::uuid, 4, 'Laser / device certification', 'Manufacturer-led training.', 3, 4500, ARRAY['device_cert']::text[], ARRAY['Med spa eligible']::text[]),
  ('m0000170000-4000-8000-000000000017'::uuid, 'p1000003-0003-4003-8003-000000000003'::uuid, 5, 'Med spa technician', 'Work under medical director.', 18, 1500, ARRAY['medical_oversight']::text[], ARRAY['Clinical track']::text[]),
  ('m0000180000-4000-8000-000000000018'::uuid, 'p1000004-0004-4004-8004-000000000004'::uuid, 1, 'Document mastery portfolio', 'Before/afters, timing, testimonials.', 6, 500, ARRAY['portfolio']::text[], ARRAY['Teaching-ready work']::text[]),
  ('m0000190000-4000-8000-000000000019'::uuid, 'p1000004-0004-4004-8004-000000000004'::uuid, 2, 'Continuing education depth', 'Advanced CE in your specialty.', 12, 3500, ARRAY['continuing_education_hours']::text[], ARRAY['Specialist positioning']::text[]),
  ('m0000200000-4000-8000-000000000020'::uuid, 'p1000004-0004-4004-8004-000000000004'::uuid, 3, 'Instructor license (if required)', 'Additional hours per state.', 6, 6000, ARRAY['instructor_license']::text[], ARRAY['School-eligible']::text[]),
  ('m0000210000-4000-8000-000000000021'::uuid, 'p1000004-0004-4004-8004-000000000004'::uuid, 4, 'School or freelance educator', 'Paid classes and content.', 18, 2000, ARRAY['teaching_contract']::text[], ARRAY['Educator income']::text[]),
  ('m0000220000-4000-8000-000000000022'::uuid, 'p1000004-0004-4004-8004-000000000004'::uuid, 5, 'Platform artist', 'Brand stages and travel.', 24, 1000, ARRAY['brand_contract']::text[], ARRAY['Platform career']::text[]),
  ('m0000230000-4000-8000-000000000023'::uuid, 'p1000005-0005-4005-8005-000000000005'::uuid, 1, 'Salon management role', 'KPIs, labor law basics.', 12, 1500, ARRAY['management']::text[], ARRAY['Manager title']::text[]),
  ('m0000240000-4000-8000-000000000024'::uuid, 'p1000005-0005-4005-8005-000000000005'::uuid, 2, 'First salon ownership', 'Single unit P&L ownership.', 24, 35000, ARRAY['capital', 'lease']::text[], ARRAY['Owner']::text[]),
  ('m0000250000-4000-8000-000000000025'::uuid, 'p1000005-0005-4005-8005-000000000005'::uuid, 3, 'Systems & hiring playbook', 'SOPs, training, retention.', 12, 5000, ARRAY['hr_systems']::text[], ARRAY['Scalable ops']::text[]),
  ('m0000260000-4000-8000-000000000026'::uuid, 'p1000005-0005-4005-8005-000000000005'::uuid, 4, 'Second location or acquisition', 'Financing and duplicate leadership.', 18, 12000, ARRAY['financing']::text[], ARRAY['Multi-unit']::text[]),
  ('m0000270000-4000-8000-000000000027'::uuid, 'p1000006-0006-4006-8006-000000000006'::uuid, 1, 'Cosmetology program', 'Core license pathway.', 12, 17000, ARRAY['cosmetology_program']::text[], ARRAY['Licensed']::text[]),
  ('m0000280000-4000-8000-000000000028'::uuid, 'p1000006-0006-4006-8006-000000000006'::uuid, 2, 'Color specialist floor time', 'Formulation and corrections.', 18, 2500, ARRAY['employment']::text[], ARRAY['Color book']::text[]),
  ('m0000290000-4000-8000-000000000029'::uuid, 'p1000006-0006-4006-8006-000000000006'::uuid, 3, 'Balayage mastery', 'Advanced lightening CE.', 12, 4000, ARRAY['advanced_ce']::text[], ARRAY['Premium services']::text[]),
  ('m0000300000-4000-8000-000000000030'::uuid, 'p1000006-0006-4006-8006-000000000006'::uuid, 4, 'Assistant educator → lead educator', 'Classroom hours.', 18, 4500, ARRAY['instructor_license']::text[], ARRAY['Teaching']::text[]),
  ('m0000310000-4000-8000-000000000031'::uuid, 'p1000007-0007-4007-8007-000000000007'::uuid, 1, 'Active esthetics license', 'Maintain renewal CE.', 1, 200, ARRAY['license_renewal']::text[], ARRAY['Active']::text[]),
  ('m0000320000-4000-8000-000000000032'::uuid, 'p1000007-0007-4007-8007-000000000007'::uuid, 2, 'Laser safety certification', 'Physics and protocols.', 2, 5000, ARRAY['laser_cert']::text[], ARRAY['Device-ready']::text[]),
  ('m0000330000-4000-8000-000000000033'::uuid, 'p1000007-0007-4007-8007-000000000007'::uuid, 3, 'Med spa employment', 'Series-based revenue.', 18, 1000, ARRAY['employment']::text[], ARRAY['Clinical experience']::text[]),
  ('m0000340000-4000-8000-000000000034'::uuid, 'p1000007-0007-4007-8007-000000000007'::uuid, 4, 'Lead technician or trainer', 'Protocol ownership.', 12, 3000, ARRAY['leadership']::text[], ARRAY['Lead role']::text[]),
  ('m0000350000-4000-8000-000000000035'::uuid, 'p1000008-0008-4008-8008-000000000008'::uuid, 1, 'Nail technology school', 'License pathway.', 6, 8000, ARRAY['nail_program']::text[], ARRAY['Licensed']::text[]),
  ('m0000360000-4000-8000-000000000036'::uuid, 'p1000008-0008-4008-8008-000000000008'::uuid, 2, 'Structure + e-file mastery', 'Speed with safe chemistry.', 12, 1500, ARRAY['e_file_cert']::text[], ARRAY['Full book']::text[]),
  ('m0000370000-4000-8000-000000000037'::uuid, 'p1000008-0008-4008-8008-000000000008'::uuid, 3, 'Nail art specialization', 'Competition-level skills.', 12, 2500, ARRAY['art_ce']::text[], ARRAY['Premium sets']::text[]),
  ('m0000380000-4000-8000-000000000038'::uuid, 'p1000008-0008-4008-8008-000000000008'::uuid, 4, 'Content + brand deals', 'FTC-compliant partnerships.', 18, 2000, ARRAY['social_compliance']::text[], ARRAY['Educator / ambassador']::text[]),
  ('m0000390000-4000-8000-000000000039'::uuid, 'p1000009-0009-4009-8009-000000000009'::uuid, 1, 'Licensed cosmetologist', 'Active license.', 1, 200, ARRAY['license']::text[], ARRAY['Active']::text[]),
  ('m0000400000-4000-8000-000000000040'::uuid, 'p1000009-0009-4009-8009-000000000009'::uuid, 2, 'Wedding & event portfolio', 'Trials, contracts, travel kits.', 24, 5000, ARRAY['portfolio']::text[], ARRAY['Event book']::text[]),
  ('m0000410000-4000-8000-000000000041'::uuid, 'p1000009-0009-4009-8009-000000000009'::uuid, 3, 'Agency / representation', 'Session and tour opportunities.', 24, 8000, ARRAY['networking']::text[], ARRAY['Session work']::text[]),
  ('m0000420000-4000-8000-000000000042'::uuid, 'p1000009-0009-4009-8009-000000000009'::uuid, 4, 'Celebrity stylist positioning', 'Union rates where applicable.', 36, 7000, ARRAY['contracts']::text[], ARRAY['Top-tier clients']::text[]),
  ('m0000430000-4000-8000-000000000043'::uuid, 'p1000010-0010-4010-8010-000000000010'::uuid, 1, 'Massage therapy program', 'Accredited hours.', 9, 12000, ARRAY['massage_program']::text[], ARRAY['Graduate']::text[]),
  ('m0000440000-4000-8000-000000000044'::uuid, 'p1000010-0010-4010-8010-000000000010'::uuid, 2, 'State massage license', 'MBLEx or state exam.', 2, 400, ARRAY['state_license']::text[], ARRAY['LMT']::text[]),
  ('m0000450000-4000-8000-000000000045'::uuid, 'p1000010-0010-4010-8010-000000000010'::uuid, 3, 'Spa or clinical employment', 'Build modalities.', 12, 800, ARRAY['employment']::text[], ARRAY['Specialty focus']::text[]),
  ('m0000460000-4000-8000-000000000046'::uuid, 'p1000010-0010-4010-8010-000000000010'::uuid, 4, 'Sports or medical massage CE', 'Advanced certification.', 6, 3500, ARRAY['specialty_ce']::text[], ARRAY['Higher ticket']::text[]),
  ('m0000470000-4000-8000-000000000047'::uuid, 'p1000010-0010-4010-8010-000000000010'::uuid, 5, 'Private practice / suite', 'Business setup.', 12, 2500, ARRAY['business_license']::text[], ARRAY['Owner-practitioner']::text[])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.career_path_roles (path_id, role_id, milestone_order) VALUES
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'r1000001-0001-4001-8001-000000000001'::uuid, 3),
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'r1000001-0001-4001-8001-000000000001'::uuid, 4),
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'r1000007-0007-4007-8007-000000000007'::uuid, 5),
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'r1000008-0008-4008-8008-000000000008'::uuid, 6),
  ('p1000001-0001-4001-8001-000000000001'::uuid, 'r1000009-0009-4009-8009-000000000009'::uuid, 7),
  ('p1000002-0002-4002-8002-000000000002'::uuid, 'r1000002-0002-4002-8002-000000000002'::uuid, 2),
  ('p1000002-0002-4002-8002-000000000002'::uuid, 'r1000002-0002-4002-8002-000000000002'::uuid, 3),
  ('p1000002-0002-4002-8002-000000000002'::uuid, 'r1000013-0013-4013-8013-000000000013'::uuid, 4),
  ('p1000002-0002-4002-8002-000000000002'::uuid, 'r1000028-0028-4028-8028-000000000028'::uuid, 5),
  ('p1000003-0003-4003-8003-000000000003'::uuid, 'r1000003-0003-4003-8003-000000000003'::uuid, 2),
  ('p1000003-0003-4003-8003-000000000003'::uuid, 'r1000003-0003-4003-8003-000000000003'::uuid, 3),
  ('p1000003-0003-4003-8003-000000000003'::uuid, 'r1000016-0016-4016-8016-000000000016'::uuid, 4),
  ('p1000003-0003-4003-8003-000000000003'::uuid, 'r1000015-0015-4015-8015-000000000015'::uuid, 5),
  ('p1000004-0004-4004-8004-000000000004'::uuid, 'r1000007-0007-4007-8007-000000000007'::uuid, 2),
  ('p1000004-0004-4004-8004-000000000004'::uuid, 'r1000011-0011-4011-8011-000000000011'::uuid, 3),
  ('p1000004-0004-4004-8004-000000000004'::uuid, 'r1000011-0011-4011-8011-000000000011'::uuid, 4),
  ('p1000004-0004-4004-8004-000000000004'::uuid, 'r1000010-0010-4010-8010-000000000010'::uuid, 5),
  ('p1000005-0005-4005-8005-000000000005'::uuid, 'r1000008-0008-4008-8008-000000000008'::uuid, 1),
  ('p1000005-0005-4005-8005-000000000005'::uuid, 'r1000009-0009-4009-8009-000000000009'::uuid, 2),
  ('p1000005-0005-4005-8005-000000000005'::uuid, 'r1000022-0022-4022-8022-000000000022'::uuid, 4),
  ('p1000006-0006-4006-8006-000000000006'::uuid, 'r1000001-0001-4001-8001-000000000001'::uuid, 1),
  ('p1000006-0006-4006-8006-000000000006'::uuid, 'r1000007-0007-4007-8007-000000000007'::uuid, 2),
  ('p1000006-0006-4006-8006-000000000006'::uuid, 'r1000025-0025-4025-8025-000000000025'::uuid, 3),
  ('p1000006-0006-4006-8006-000000000006'::uuid, 'r1000011-0011-4011-8011-000000000011'::uuid, 4),
  ('p1000007-0007-4007-8007-000000000007'::uuid, 'r1000016-0016-4016-8016-000000000016'::uuid, 2),
  ('p1000007-0007-4007-8007-000000000007'::uuid, 'r1000015-0015-4015-8015-000000000015'::uuid, 3),
  ('p1000007-0007-4007-8007-000000000007'::uuid, 'r1000015-0015-4015-8015-000000000015'::uuid, 4),
  ('p1000008-0008-4008-8008-000000000008'::uuid, 'r1000004-0004-4004-8004-000000000004'::uuid, 1),
  ('p1000008-0008-4008-8008-000000000008'::uuid, 'r1000004-0004-4004-8004-000000000004'::uuid, 2),
  ('p1000008-0008-4008-8008-000000000008'::uuid, 'r1000018-0018-4018-8018-000000000018'::uuid, 3),
  ('p1000008-0008-4008-8008-000000000008'::uuid, 'r1000027-0027-4027-8027-000000000027'::uuid, 4),
  ('p1000009-0009-4009-8009-000000000009'::uuid, 'r1000001-0001-4001-8001-000000000001'::uuid, 1),
  ('p1000009-0009-4009-8009-000000000009'::uuid, 'r1000017-0017-4017-8017-000000000017'::uuid, 2),
  ('p1000009-0009-4009-8009-000000000009'::uuid, 'r1000012-0012-4012-8012-000000000012'::uuid, 3),
  ('p1000009-0009-4009-8009-000000000009'::uuid, 'r1000012-0012-4012-8012-000000000012'::uuid, 4),
  ('p1000010-0010-4010-8010-000000000010'::uuid, 'r1000005-0005-4005-8005-000000000005'::uuid, 2),
  ('p1000010-0010-4010-8010-000000000010'::uuid, 'r1000005-0005-4005-8005-000000000005'::uuid, 4),
  ('p1000010-0010-4010-8010-000000000010'::uuid, 'r1000014-0014-4014-8014-000000000014'::uuid, 5)
ON CONFLICT (path_id, role_id, milestone_order) DO NOTHING;
