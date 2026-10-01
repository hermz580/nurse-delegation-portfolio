import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: authService.User;
            userId?: string;
        }
    }
}

/**
 * Authentication middleware - requires valid JWT token
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let payload: authService.TokenPayload;
        try {
            payload = authService.verifyAccessToken(token);
        } catch (error: unknown) {
            if ((error as { name?: string }).name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please refresh your token.',
                    code: 'TOKEN_EXPIRED'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }

        // Get user from database
        const user = await authService.findUserById(payload.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please log in again.'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again.'
        });
    }
};

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = authService.verifyAccessToken(token);
        const user = await authService.findUserById(payload.userId);

        if (user && user.is_active) {
            req.user = user;
            req.userId = user.id;
        }
    } catch {
        // Token is invalid, but that's okay for optional auth
    }

    next();
};

/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    };
};

/**
 * Admin only middleware
 */
export const adminOnly = authorize('admin', 'organization_admin');

/**
 * Provider only middleware
 */
export const providerOnly = authorize('provider', 'admin');

/**
 * Require email verification
 */
export const requireVerifiedEmail = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.email_verified) {
        return res.status(403).json({
            success: false,
            message: 'Please verify your email address to access this resource',
            code: 'EMAIL_NOT_VERIFIED'
        });
    }

    next();
};
