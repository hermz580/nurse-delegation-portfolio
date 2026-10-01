import { Request, Response, NextFunction } from 'express';

/**
 * Subscription Middleware
 * Gates routes based on subscription status
 */

interface SubscriptionUser {
    id: string;
    email: string;
    role: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    subscriptionEndsAt?: Date;
}

/**
 * Check if user has an active subscription
 * Blocks access if subscription is required and user doesn't have one
 */
export const requireSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = (req as any).user as SubscriptionUser;

        // Admins bypass subscription check
        if (user?.role === 'admin' || user?.role === 'organization_admin') {
            return next();
        }

        // Check if user exists and is authenticated
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        // TODO: Query subscription from database
        // For now, use placeholder logic
        const subscription = await getSubscriptionStatus(user.id);

        // Check subscription status
        if (!subscription.isActive) {
            return res.status(402).json({
                success: false,
                error: 'Active subscription required',
                code: 'SUBSCRIPTION_REQUIRED',
                data: {
                    redirectUrl: '/pricing',
                    message: 'Please subscribe to access this feature.',
                    plans: ['basic', 'pro', 'enterprise']
                }
            });
        }

        // Attach subscription to request for downstream use
        (req as any).subscription = subscription;
        next();
    } catch (error) {
        console.error('Subscription middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify subscription'
        });
    }
};

/**
 * Check if user has a specific subscription plan
 * @param allowedPlans - Array of plan names that can access the route
 */
export const requirePlan = (allowedPlans: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user as SubscriptionUser;

            // Admins bypass plan check
            if (user?.role === 'admin' || user?.role === 'organization_admin') {
                return next();
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                    code: 'AUTH_REQUIRED'
                });
            }

            const subscription = await getSubscriptionStatus(user.id);

            if (!subscription.isActive) {
                return res.status(402).json({
                    success: false,
                    error: 'Active subscription required',
                    code: 'SUBSCRIPTION_REQUIRED'
                });
            }

            if (!allowedPlans.includes(subscription.plan)) {
                return res.status(403).json({
                    success: false,
                    error: 'Plan upgrade required',
                    code: 'PLAN_UPGRADE_REQUIRED',
                    data: {
                        currentPlan: subscription.plan,
                        requiredPlans: allowedPlans,
                        upgradeUrl: '/pricing'
                    }
                });
            }

            (req as any).subscription = subscription;
            next();
        } catch (error) {
            console.error('Plan middleware error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to verify plan'
            });
        }
    };
};

/**
 * Allow trial users to access routes
 * More lenient than requireSubscription
 */
export const allowTrial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = (req as any).user as SubscriptionUser;

        // Admins bypass
        if (user?.role === 'admin' || user?.role === 'organization_admin') {
            return next();
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        const subscription = await getSubscriptionStatus(user.id);

        // Allow if active OR trialing
        if (!subscription.isActive && subscription.status !== 'trialing') {
            return res.status(402).json({
                success: false,
                error: 'Subscription or trial required',
                code: 'SUBSCRIPTION_REQUIRED',
                data: {
                    message: 'Start your free trial to access this feature.',
                    trialDays: 14
                }
            });
        }

        (req as any).subscription = subscription;
        next();
    } catch (error) {
        console.error('Trial middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify trial status'
        });
    }
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

interface SubscriptionStatus {
    userId: string;
    plan: string;
    status: string;
    isActive: boolean;
    isTrial: boolean;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
    features: {
        mapAccess: boolean;
        providerDirectory: boolean;
        emailAssistant: boolean;
        searchTools: boolean;
        downloadReports: boolean;
        apiAccess: boolean;
    };
}

/**
 * Get subscription status for a user
 * TODO: Replace with actual database query
 */
async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    // TODO: Query database
    // SELECT * FROM subscriptions WHERE user_id = $1

    // Placeholder - in production, query the database
    return {
        userId,
        plan: 'free',
        status: 'inactive',
        isActive: false,
        isTrial: false,
        trialEndsAt: null,
        currentPeriodEnd: null,
        features: {
            mapAccess: false,
            providerDirectory: false,
            emailAssistant: false,
            searchTools: false,
            downloadReports: false,
            apiAccess: false
        }
    };
}

/**
 * Feature flags based on plan
 */
export const PLAN_FEATURES: Record<string, Record<string, boolean>> = {
    free: {
        mapAccess: false,
        providerDirectory: false,
        emailAssistant: false,
        searchTools: false,
        downloadReports: false,
        apiAccess: false
    },
    basic: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: false,
        searchTools: true,
        downloadReports: false,
        apiAccess: false
    },
    pro: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: true,
        searchTools: true,
        downloadReports: true,
        apiAccess: false
    },
    enterprise: {
        mapAccess: true,
        providerDirectory: true,
        emailAssistant: true,
        searchTools: true,
        downloadReports: true,
        apiAccess: true
    }
};
