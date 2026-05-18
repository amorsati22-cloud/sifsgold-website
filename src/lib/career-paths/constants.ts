import type { EndRole, RoleCategory, StartingPoint } from "@/types/career-paths";

export const STARTING_POINT_LABELS: Record<StartingPoint, string> = {
  high_school: "High school / new to beauty",
  career_change: "Career change",
  currently_licensed: "Currently licensed",
  experienced_pro: "Experienced professional",
};

export const END_ROLE_LABELS: Record<EndRole, string> = {
  salon_owner: "Salon or studio owner",
  platform_artist: "Platform / brand artist",
  educator: "Educator or school instructor",
  celebrity_stylist: "Celebrity / session stylist",
};

export const CATEGORY_LABELS: Record<RoleCategory, string> = {
  hair: "Hair",
  skin: "Skin & esthetics",
  nails: "Nails",
  lashes: "Lashes & brows",
  massage: "Massage & bodywork",
  tattoo: "Tattoo & PMU",
  business: "Business & leadership",
};

export const BLS_DISCLAIMER =
  "Median annual wage from U.S. Bureau of Labor Statistics Occupational Employment and Wage Statistics (OEWS). Not guaranteed earnings — actual income varies by market, chair model, tips, and self-employment.";

export const SALARY_ESTIMATE_NOTE = "Median salary (estimate)";

/** Deterministic IDs for SQL seeds */
export const ROLE_IDS = {
  cosmetologist: "r1000001-0001-4001-8001-000000000001",
  barber: "r1000002-0002-4002-8002-000000000002",
  esthetician: "r1000003-0003-4003-8003-000000000003",
  nailTech: "r1000004-0004-4004-8004-000000000004",
  massageTherapist: "r1000005-0005-4005-8005-000000000005",
  tattooArtist: "r1000006-0006-4006-8006-000000000006",
  colorSpecialist: "r1000007-0007-4007-8007-000000000007",
  salonManager: "r1000008-0008-4008-8008-000000000008",
  salonOwner: "r1000009-0009-4009-8009-000000000009",
  platformArtist: "r1000010-0010-4010-8010-000000000010",
  educator: "r1000011-0011-4011-8011-000000000011",
  celebrityStylist: "r1000012-0012-4012-8012-000000000012",
  mobilePro: "r1000013-0013-4013-8013-000000000013",
  suiteOwner: "r1000014-0014-4014-8014-000000000014",
  medSpaTech: "r1000015-0015-4015-8015-000000000015",
  laserTech: "r1000016-0016-4016-8016-000000000016",
  weddingStylist: "r1000017-0017-4017-8017-000000000017",
  nailArtSpecialist: "r1000018-0018-4018-8018-000000000018",
  lashArtist: "r1000019-0019-4019-8019-000000000019",
  browSpecialist: "r1000020-0020-4020-8020-000000000020",
  personalTrainer: "r1000021-0021-4021-8021-000000000021",
  multiLocationOwner: "r1000022-0022-4022-8022-000000000022",
  brandAmbassador: "r1000023-0023-4023-8023-000000000023",
  barberShopOwner: "r1000024-0024-4024-8024-000000000024",
  balayageExpert: "r1000025-0025-4025-8025-000000000025",
  medSpaProvider: "r1000026-0026-4026-8026-000000000026",
  nailEducator: "r1000027-0027-4027-8027-000000000027",
  studioBarber: "r1000028-0028-4028-8028-000000000028",
} as const;

export const PATH_IDS = {
  hsToSalonOwner: "p1000001-0001-4001-8001-000000000001",
  careerChangeBarber: "p1000002-0002-4002-8002-000000000002",
  careerChangeMedspa: "p1000003-0003-4003-8003-000000000003",
  licensedToEducator: "p1000004-0004-4004-8004-000000000004",
  licensedToMultiOwner: "p1000005-0005-4005-8005-000000000005",
  schoolToColorEducator: "p1000006-0006-4006-8006-000000000006",
  estheticsToLaser: "p1000007-0007-4007-8007-000000000007",
  nailToInfluencer: "p1000008-0008-4008-8008-000000000008",
  cosmoToCelebrity: "p1000009-0009-4009-8009-000000000009",
  massageSpecialty: "p1000010-0010-4010-8010-000000000010",
} as const;

/** Legacy stub slug → role UUID for redirects */
export const LEGACY_SLUG_TO_ROLE_ID: Record<string, string> = {
  cosmetologist: ROLE_IDS.cosmetologist,
  barber: ROLE_IDS.barber,
  esthetician: ROLE_IDS.esthetician,
  "nail-tech": ROLE_IDS.nailTech,
  "tattoo-artist": ROLE_IDS.tattooArtist,
  "massage-therapist": ROLE_IDS.massageTherapist,
  "personal-trainer": ROLE_IDS.personalTrainer,
  "med-spa-provider": ROLE_IDS.medSpaTech,
  model: ROLE_IDS.brandAmbassador,
  designer: ROLE_IDS.brandAmbassador,
};
