const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const PRICE_MAP = {
  student_pro_monthly: process.env.STRIPE_PRICE_STUDENT_PRO_MONTHLY || 'price_student_pro_monthly',
  student_pro_yearly: process.env.STRIPE_PRICE_STUDENT_PRO_YEARLY || 'price_student_pro_yearly',
  student_master_monthly: process.env.STRIPE_PRICE_STUDENT_MASTER_MONTHLY || 'price_student_master_monthly',
  student_master_yearly: process.env.STRIPE_PRICE_STUDENT_MASTER_YEARLY || 'price_student_master_yearly',
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  elite_monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_elite_monthly',
  elite_yearly: process.env.STRIPE_PRICE_ELITE_YEARLY || 'price_elite_yearly',
  client_pro_monthly: process.env.STRIPE_PRICE_CLIENT_PRO_MONTHLY || 'price_client_pro_monthly',
  client_pro_yearly: process.env.STRIPE_PRICE_CLIENT_PRO_YEARLY || 'price_client_pro_yearly',
  client_vip_monthly: process.env.STRIPE_PRICE_CLIENT_VIP_MONTHLY || 'price_client_vip_monthly',
  client_vip_yearly: process.env.STRIPE_PRICE_CLIENT_VIP_YEARLY || 'price_client_vip_yearly',
  school_standard_monthly: process.env.STRIPE_PRICE_SCHOOL_STANDARD_MONTHLY || 'price_school_standard_monthly',
  school_standard_yearly: process.env.STRIPE_PRICE_SCHOOL_STANDARD_YEARLY || 'price_school_standard_yearly',
  school_partner_monthly: process.env.STRIPE_PRICE_SCHOOL_PARTNER_MONTHLY || 'price_school_partner_monthly',
  school_partner_yearly: process.env.STRIPE_PRICE_SCHOOL_PARTNER_YEARLY || 'price_school_partner_yearly',
  school_elite_monthly: process.env.STRIPE_PRICE_SCHOOL_ELITE_MONTHLY || 'price_school_elite_monthly',
  school_elite_yearly: process.env.STRIPE_PRICE_SCHOOL_ELITE_YEARLY || 'price_school_elite_yearly',
  salon_5_monthly: process.env.STRIPE_PRICE_SALON_5_MONTHLY || 'price_salon_5_monthly',
  salon_5_yearly: process.env.STRIPE_PRICE_SALON_5_YEARLY || 'price_salon_5_yearly',
  salon_15_monthly: process.env.STRIPE_PRICE_SALON_15_MONTHLY || 'price_salon_15_monthly',
  salon_15_yearly: process.env.STRIPE_PRICE_SALON_15_YEARLY || 'price_salon_15_yearly',
  salon_unlimited_monthly: process.env.STRIPE_PRICE_SALON_UNLIMITED_MONTHLY || 'price_salon_unlimited_monthly',
  salon_unlimited_yearly: process.env.STRIPE_PRICE_SALON_UNLIMITED_YEARLY || 'price_salon_unlimited_yearly',
  store_basic_monthly: process.env.STRIPE_PRICE_STORE_BASIC_MONTHLY || 'price_store_basic_monthly',
  store_featured_monthly: process.env.STRIPE_PRICE_STORE_FEATURED_MONTHLY || 'price_store_featured_monthly',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!stripe) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });

  try {
    const { plan, email } = req.body || {};
    const price = PRICE_MAP[plan];
    if (!price) return res.status(400).json({ error: 'Unknown plan' });

    const origin = `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      customer_email: email || undefined,
      success_url: `${origin}/success?tier=${encodeURIComponent(plan)}`,
      cancel_url: `${origin}/cancel`,
      metadata: { plan },
      subscription_data: {
        metadata: { tier: plan },
      },
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Checkout session error' });
  }
};
