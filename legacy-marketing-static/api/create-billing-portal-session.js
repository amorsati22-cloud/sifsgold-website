const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!stripe) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
  try {
    // Never trust a client-supplied Stripe customer id (spoofable header). Resolve from auth + DB in production.
    const customerId = process.env.STRIPE_DEFAULT_CUSTOMER_ID;
    if (!customerId) return res.status(400).json({ error: 'Missing Stripe customer id' });
    const origin = `https://${req.headers.host}`;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account`,
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Portal session error' });
  }
};
