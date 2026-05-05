const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

function assertNoDbError(result, context) {
  if (result?.error) {
    const msg = result.error.message || 'database error';
    throw new Error(`${context}: ${msg}`);
  }
}

/**
 * Stripe signature verification requires the exact raw bytes of the request body.
 * If a host parses JSON into req.body first, verification cannot succeed.
 */
async function readStripeWebhookRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf8');
  if (req.body != null && typeof req.body === 'object') {
    throw new Error(
      'Webhook body was parsed as JSON before the handler ran; raw body is required for Stripe signature verification.',
    );
  }
  return await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function updateSubscriptionRow(payload) {
  const result = await supabase.from('subscriptions').upsert(payload, { onConflict: 'stripe_subscription_id' });
  assertNoDbError(result, 'subscriptions upsert');
  return result;
}

async function sendTransactionalEmail(_kind, _data) {
  return Promise.resolve();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const signature = req.headers['stripe-signature'];
  if (!signature || !webhookSecret) return res.status(400).send('Missing webhook signature/secret');

  let rawBody;
  try {
    rawBody = await readStripeWebhookRawBody(req);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created': {
        const sub = event.data.object;
        await updateSubscriptionRow({
          user_id: sub.metadata?.user_id || null,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items?.data?.[0]?.price?.id || null,
          tier: sub.metadata?.tier || 'pro',
          status: 'active',
          source: 'stripe',
          is_trial: sub.status === 'trialing',
          trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          current_period_start: sub.current_period_start ? new Date(sub.current_period_start * 1000).toISOString() : null,
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        });
        await sendTransactionalEmail('welcome', { customer: sub.customer, tier: sub.metadata?.tier });
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await updateSubscriptionRow({
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items?.data?.[0]?.price?.id || null,
          tier: sub.metadata?.tier || 'pro',
          status: sub.status === 'active' ? 'active' : sub.status,
          current_period_start: sub.current_period_start ? new Date(sub.current_period_start * 1000).toISOString() : null,
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await updateSubscriptionRow({
          stripe_subscription_id: sub.id,
          tier: 'free',
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        await sendTransactionalEmail('cancellation', { customer: sub.customer });
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        const graceUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        const invFail = await supabase
          .from('subscriptions')
          .update({ status: 'past_due', current_period_end: graceUntil, updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subId);
        assertNoDbError(invFail, 'subscriptions update (payment_failed)');
        await sendTransactionalEmail('payment_failed', { customer: invoice.customer, graceUntil });
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) break;
        const invOk = await supabase
          .from('subscriptions')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subId);
        assertNoDbError(invOk, 'subscriptions update (payment_succeeded)');
        await sendTransactionalEmail('receipt', { customer: invoice.customer, invoiceId: invoice.id });
        break;
      }
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook]', error);
    // 5xx so Stripe retries on transient DB failures; avoid echoing internal details.
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
