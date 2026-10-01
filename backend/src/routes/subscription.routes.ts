import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// ==============================================
// SUBSCRIPTION ROUTES
// Stripe integration for subscription management
// Connected to PostgreSQL database
// ==============================================

// Plan feature definitions
const PLAN_FEATURES: Record<string, {
    mapAccess: boolean;
    providerDirectory: boolean;
    emailAssistant: boolean;
    searchTools: boolean;
    downloadReports: boolean;
    apiAccess: boolean;
    teamMembers: number;
}> = {
    free: {
        mapAccess: false,
        providerDirectory: false,
        emailAssistant: false,
        searchTools: false,
        downloadReports: false,
        apiAccess: false,
        teamMembers: 1
    },
    basic: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: false,
        searchTools: true,
        downloadReports: false,
        apiAccess: false,
        teamMembers: 1
    },
    pro: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: true,
        searchTools: true,
        downloadReports: true,
        apiAccess: false,
        teamMembers: 5
    },
    enterprise: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: true,
        searchTools: true,
        downloadReports: true,
        apiAccess: true,
        teamMembers: -1 // unlimited
    }
};

/**
 * GET /api/v1/subscriptions/status
 * Get current user's subscription status
 */
router.get('/status', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.json({
                success: true,
                data: {
                    userId: null,
                    plan: 'free',
                    status: 'inactive',
                    isActive: false,
                    canAccessSite: false,
                    features: PLAN_FEATURES.free
                }
            });
        }

        // Query user's subscription
        const result = await query(`
            SELECT 
                id,
                user_id as "userId",
                stripe_customer_id as "stripeCustomerId",
                stripe_subscription_id as "stripeSubscriptionId",
                plan,
                status,
                current_period_start as "currentPeriodStart",
                current_period_end as "currentPeriodEnd",
                cancel_at_period_end as "cancelAtPeriodEnd",
                trial_start as "trialStart",
                trial_end as "trialEnd"
            FROM subscriptions
            WHERE user_id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                data: {
                    userId,
                    plan: 'free',
                    status: 'inactive',
                    isActive: false,
                    canAccessSite: false,
                    features: PLAN_FEATURES.free
                }
            });
        }

        const subscription = result.rows[0];
        const isActive = ['active', 'trialing'].includes(subscription.status);
        const now = new Date();

        // Calculate trial days remaining
        let trialDaysRemaining = 0;
        if (subscription.status === 'trialing' && subscription.trialEnd) {
            const trialEnd = new Date(subscription.trialEnd);
            trialDaysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        }

        return res.json({
            success: true,
            data: {
                ...subscription,
                isActive,
                canAccessSite: isActive,
                trialDaysRemaining,
                features: PLAN_FEATURES[subscription.plan] || PLAN_FEATURES.free
            }
        });
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch subscription status' });
    }
});

/**
 * GET /api/v1/subscriptions/plans
 * Get available subscription plans
 */
router.get('/plans', async (_req: Request, res: Response) => {
    try {
        const plans = [
            {
                id: 'basic',
                name: 'Basic',
                description: 'Essential access for case workers',
                priceMonthly: 29,
                priceYearly: 290,
                stripePriceIdMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
                stripePriceIdYearly: process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_basic_yearly',
                features: [
                    'Full map access',
                    'Provider directory',
                    'County filtering',
                    'Basic search',
                    'Email support'
                ],
                recommended: false
            },
            {
                id: 'pro',
                name: 'Professional',
                description: 'Full access for active delegators',
                priceMonthly: 79,
                priceYearly: 790,
                stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
                stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
                features: [
                    'Everything in Basic',
                    'AI-powered search',
                    'Email assistant',
                    'Download reports',
                    'Priority support',
                    'Provider profile listing'
                ],
                recommended: true
            },
            {
                id: 'enterprise',
                name: 'Enterprise',
                description: 'For organizations and agencies',
                priceMonthly: 199,
                priceYearly: 1990,
                stripePriceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
                stripePriceIdYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
                features: [
                    'Everything in Pro',
                    'Unlimited team members',
                    'Custom integrations',
                    'API access',
                    'Dedicated support',
                    'Analytics dashboard'
                ],
                recommended: false
            }
        ];

        res.json({ success: true, data: plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch plans' });
    }
});

/**
 * POST /api/v1/subscriptions/create-checkout
 * Create a Stripe Checkout session
 */
router.post('/create-checkout', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { priceId, successUrl, cancelUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        if (!priceId) {
            return res.status(400).json({ success: false, error: 'Price ID is required' });
        }

        // TODO: Implement actual Stripe checkout session creation
        // For now, return a placeholder URL
        const checkoutUrl = `https://checkout.stripe.com/placeholder?price=${priceId}&success_url=${encodeURIComponent(successUrl || '')}&cancel_url=${encodeURIComponent(cancelUrl || '')}`;

        return res.json({ success: true, data: { url: checkoutUrl } });
    } catch (error) {
        console.error('Error creating checkout:', error);
        return res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
});

/**
 * POST /api/v1/subscriptions/create-portal
 * Create a Stripe Customer Portal session for managing subscription
 */
router.post('/create-portal', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { returnUrl } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        // Get user's Stripe customer ID
        const result = await query(`
            SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1
        `, [userId]);

        if (result.rows.length === 0 || !result.rows[0].stripe_customer_id) {
            return res.status(404).json({ success: false, error: 'No subscription found' });
        }

        // TODO: Implement actual Stripe portal session creation
        const portalUrl = `https://billing.stripe.com/placeholder?return_url=${encodeURIComponent(returnUrl || '')}`;

        return res.json({ success: true, data: { url: portalUrl } });
    } catch (error) {
        console.error('Error creating portal:', error);
        return res.status(500).json({ success: false, error: 'Failed to create portal session' });
    }
});

/**
 * POST /api/v1/subscriptions/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            return res.status(400).json({ success: false, error: 'Missing signature' });
        }

        // TODO: Verify webhook signature with Stripe
        const event = req.body;

        // Handle different event types
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                // Update subscription in database
                console.log('Subscription event:', event.type);
                break;
            case 'customer.subscription.deleted':
                // Mark subscription as canceled
                console.log('Subscription deleted:', event.data.object.id);
                break;
            case 'invoice.payment_succeeded':
                console.log('Payment succeeded:', event.data.object.id);
                break;
            case 'invoice.payment_failed':
                console.log('Payment failed:', event.data.object.id);
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }

        return res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({ success: false, error: 'Webhook failed' });
    }
});

/**
 * POST /api/v1/subscriptions/cancel
 * Cancel current subscription
 */
router.post('/cancel', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { immediately } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        // Update subscription status in database
        const result = await query(`
            UPDATE subscriptions 
            SET 
                cancel_at_period_end = $1,
                status = CASE WHEN $2 THEN 'canceled' ELSE status END,
                canceled_at = CASE WHEN $2 THEN NOW() ELSE canceled_at END
            WHERE user_id = $3
            RETURNING id
        `, [!immediately, immediately, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'No subscription found' });
        }

        // TODO: Call Stripe API to cancel the subscription

        return res.json({
            success: true,
            message: immediately
                ? 'Subscription canceled immediately'
                : 'Subscription will cancel at the end of the billing period'
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
    }
});

export default router;
