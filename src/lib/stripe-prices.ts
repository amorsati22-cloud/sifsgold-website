// Sif's Gold — Stripe Price IDs
// Generated May 5, 2026
// All prices are SaaS — Business Use (txcd_10103101)
// NOTE: Confirm these are TEST mode IDs before using in production

export const STRIPE_PRICES = {
  // ─────────────────────────────────────────
  // BEAUTY SIDE
  // ─────────────────────────────────────────

  student: {
    pro: {
      monthly: "price_1TTs8GL1PhPZDMPBx7Y2P97Y", // $9.99/mo
      yearly: "price_1TTs8GL1PhPZDMPBVKoXCu86", // $89.99/yr
    },
    master: {
      monthly: "price_1TTsDPL1PhPZDMPBiT6LQvPf", // $14.99/mo
      yearly: "price_1TTsDPL1PhPZDMPBzfqVh3Z5", // $139.99/yr
    },
  },

  professional: {
    base: {
      monthly: "price_1TTsEDL1PhPZDMPB7r2aTblB", // $14.99/mo
      yearly: "price_1TTsEdL1PhPZDMPBC6i3VV2z", // $149.99/yr
    },
    elite: {
      monthly: "price_1TTsHjL1PhPZDMPBA23JOXUB", // $24.99/mo
      yearly: "price_1TTsIpL1PhPZDMPBBFeURRVH", // $249.99/yr
    },
  },

  client: {
    pro: {
      monthly: "price_1TTsIHL1PhPZDMPBBFeURRVH", // $6.99/mo
      yearly: "price_1TTsJDL1PhPZDMPBEAr1Vnox", // $54.99/yr
    },
  },

  school: {
    standard: {
      monthly: "price_1TTsKOL1PhPZDMPBepNrlAcd", // $99.99/mo
      yearly: "price_1TTsLjL1PhPZDMPBMusCN5bw", // $990.00/yr
    },
    partner: {
      monthly: "price_1TTsMJL1PhPZDMPBvSIrPhRa", // $199.00/mo
      yearly: "price_1TTsMtL1PhPZDMPBI8gpPkPG", // $1,990.00/yr
    },
  },

  salon: {
    pro: {
      monthly: "price_1TTsNTL1PhPZDMPBuHaqPEYq", // $49.99/mo
      yearly: "price_1TTsP8L1PhPZDMPBheKngVPV", // $499.99/yr
    },
    partner: {
      monthly: "price_1TTsOPL1PhPZDMPB8lEhtcFP", // $99.99/mo
      yearly: "price_1TTsQpL1PhPZDMPBnYBRGycp", // $999.99/yr
    },
  },

  storefront: {
    basic: { monthly: "price_1TTsRTL1PhPZDMPBFrzBAYvS" }, // $19.99/mo
    plus: { monthly: "price_1TTsSFL1PhPZDMPBbeqSC3a6" }, // $49.99/mo
  },

  brand: {
    starter: { monthly: "price_1TTsSxL1PhPZDMPB2d3wEZ5p" }, // $149.00/mo
    campaign: { monthly: "price_1TTsU3L1PhPZDMPBGGtj8d3V" }, // $299.00/mo
    premier: { monthly: "price_1TTsUeL1PhPZDMPBOZANtmxW" }, // $599.00/mo
  },

  // ─────────────────────────────────────────
  // FASHION SIDE
  // ─────────────────────────────────────────

  model: {
    essential: {
      monthly: "price_1TTsZpL1PhPZDMPBrEEIVnNO", // $12.99/mo
      yearly: "price_1TTsaML1PhPZDMPBHu2sA15b", // $124.99/yr
    },
    pro: {
      monthly: "price_1TTsbKL1PhPZDMPBBOdIe9eB", // $24.99/mo
      yearly: "price_1TTsc4L1PhPZDMPBENVbsVI5", // $239.99/yr
    },
    student: {
      monthly: "price_1TTscgL1PhPZDMPBABUmSIsL", // $9.99/mo
    },
  },

  agency: {
    starter: { monthly: "price_1TTsdfL1PhPZDMPBNJsziJtL" }, // $99.00/mo
    standard: { monthly: "price_1TTsgJL1PhPZDMPBt4Nwby3M" }, // $199.00/mo
    enterprise: { monthly: "price_1TTshXL1PhPZDMPBE33JvZmA" }, // $399.00/mo
  },

  castingDirector: {
    essential: { monthly: "price_1TTsiAL1PhPZDMPB8kqaujCY" }, // $49.00/mo
    pro: { monthly: "price_1TTsieL1PhPZDMPBrltIwea5" }, // $99.00/mo
  },

  fashionDesigner: {
    student: { monthly: "price_1TTsjLL1PhPZDMPBFqwklBrg" }, // $9.99/mo
    starter: { monthly: "price_1TTsjwL1PhPZDMPBXm52oRhF" }, // $29.99/mo
    pro: { monthly: "price_1TTskGL1PhPZDMPBB544lNtj" }, // $59.99/mo
  },

  clothingBrand: {
    standard: { monthly: "price_1TTsl1L1PhPZDMPB55xR835j" }, // $199.00/mo
    premier: { monthly: "price_1TTslPL1PhPZDMPBEGeWBwML" }, // $499.00/mo
  },

  fashionStylist: {
    essential: { monthly: "price_1TTslxL1PhPZDMPBhnPx54PV" }, // $19.99/mo
    pro: { monthly: "price_1TTsmvL1PhPZDMPB7M73wL63" }, // $39.99/mo
  },

  showroom: {
    starter: { monthly: "price_1TTsnRL1PhPZDMPBKUA6hndG" }, // $99.00/mo
    standard: { monthly: "price_1TTsoGL1PhPZDMPBiJcwa9mv" }, // $199.00/mo
    enterprise: { monthly: "price_1TTsohL1PhPZDMPBv3A11O5e" }, // $399.00/mo
  },

  fashionEventProducer: {
    standard: { monthly: "price_1TTspUL1PhPZDMPBFFcTHb1x" }, // $149.00/mo
    pro: { monthly: "price_1TTsphL1PhPZDMPBeXS6uTqb" }, // $299.00/mo
  },
} as const;

// ─────────────────────────────────────────
// ENTITLEMENT MAP
// Maps price IDs to feature access level
// Used by canAccess() in lib/paywall-router.ts
// ─────────────────────────────────────────

export const PRICE_TO_ENTITLEMENT: Record<string, string> = {
  [STRIPE_PRICES.student.pro.monthly]: "student_pro",
  [STRIPE_PRICES.student.pro.yearly]: "student_pro",
  [STRIPE_PRICES.student.master.monthly]: "student_master",
  [STRIPE_PRICES.student.master.yearly]: "student_master",
  [STRIPE_PRICES.professional.base.monthly]: "pro_base",
  [STRIPE_PRICES.professional.base.yearly]: "pro_base",
  [STRIPE_PRICES.professional.elite.monthly]: "pro_elite",
  [STRIPE_PRICES.professional.elite.yearly]: "pro_elite",
  [STRIPE_PRICES.client.pro.monthly]: "client_pro",
  [STRIPE_PRICES.client.pro.yearly]: "client_pro",
  [STRIPE_PRICES.school.standard.monthly]: "school_standard",
  [STRIPE_PRICES.school.standard.yearly]: "school_standard",
  [STRIPE_PRICES.school.partner.monthly]: "school_partner",
  [STRIPE_PRICES.school.partner.yearly]: "school_partner",
  [STRIPE_PRICES.salon.pro.monthly]: "salon_pro",
  [STRIPE_PRICES.salon.pro.yearly]: "salon_pro",
  [STRIPE_PRICES.salon.partner.monthly]: "salon_partner",
  [STRIPE_PRICES.salon.partner.yearly]: "salon_partner",
  [STRIPE_PRICES.storefront.basic.monthly]: "storefront_basic",
  [STRIPE_PRICES.storefront.plus.monthly]: "storefront_plus",
  [STRIPE_PRICES.brand.starter.monthly]: "brand_starter",
  [STRIPE_PRICES.brand.campaign.monthly]: "brand_campaign",
  [STRIPE_PRICES.brand.premier.monthly]: "brand_premier",
  [STRIPE_PRICES.model.essential.monthly]: "model_essential",
  [STRIPE_PRICES.model.essential.yearly]: "model_essential",
  [STRIPE_PRICES.model.pro.monthly]: "model_pro",
  [STRIPE_PRICES.model.pro.yearly]: "model_pro",
  [STRIPE_PRICES.model.student.monthly]: "model_student",
  [STRIPE_PRICES.agency.starter.monthly]: "agency_starter",
  [STRIPE_PRICES.agency.standard.monthly]: "agency_standard",
  [STRIPE_PRICES.agency.enterprise.monthly]: "agency_enterprise",
  [STRIPE_PRICES.castingDirector.essential.monthly]: "casting_essential",
  [STRIPE_PRICES.castingDirector.pro.monthly]: "casting_pro",
  [STRIPE_PRICES.fashionDesigner.student.monthly]: "designer_student",
  [STRIPE_PRICES.fashionDesigner.starter.monthly]: "designer_starter",
  [STRIPE_PRICES.fashionDesigner.pro.monthly]: "designer_pro",
  [STRIPE_PRICES.clothingBrand.standard.monthly]: "clothing_brand_standard",
  [STRIPE_PRICES.clothingBrand.premier.monthly]: "clothing_brand_premier",
  [STRIPE_PRICES.fashionStylist.essential.monthly]: "stylist_essential",
  [STRIPE_PRICES.fashionStylist.pro.monthly]: "stylist_pro",
  [STRIPE_PRICES.showroom.starter.monthly]: "showroom_starter",
  [STRIPE_PRICES.showroom.standard.monthly]: "showroom_standard",
  [STRIPE_PRICES.showroom.enterprise.monthly]: "showroom_enterprise",
  [STRIPE_PRICES.fashionEventProducer.standard.monthly]: "producer_standard",
  [STRIPE_PRICES.fashionEventProducer.pro.monthly]: "producer_pro",
};
