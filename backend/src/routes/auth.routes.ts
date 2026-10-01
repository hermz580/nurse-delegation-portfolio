import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as authService from '../services/auth.service';

const router = Router();

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

// ============================================
// POST /api/v1/auth/register
// Create a new user account
// ============================================
router.post('/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('role').isIn(['caregiver', 'provider']).withMessage('Role must be caregiver or provider'),
    body('licenseType').optional().isIn(['RN', 'LPN', 'None']),
    body('licenseNumber').optional().trim(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role, licenseType, licenseNumber } = req.body;

      // Check if user already exists
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      // Provider role requires license info
      if (role === 'provider' && (!licenseType || licenseType === 'None')) {
        return res.status(400).json({
          success: false,
          message: 'Providers must have a valid license type (RN or LPN)'
        });
      }

      // Create user
      const user = await authService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
        licenseType,
        licenseNumber,
      });

      // Generate tokens
      const tokens = authService.generateTokens(user);

      // Store refresh token
      await authService.storeRefreshToken(user.id, tokens.refreshToken);

      // Return user data (without password)
      const { password_hash, ...userWithoutPassword } = user;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: userWithoutPassword,
          tokens
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create account. Please try again.'
      });
    }
  }
);

// ============================================
// POST /api/v1/auth/login
// Authenticate user and return tokens
// ============================================
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate tokens
      const tokens = authService.generateTokens(user);

      // Store refresh token
      await authService.storeRefreshToken(user.id, tokens.refreshToken);

      // Return user data (without password)
      const { password_hash, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }
);

// ============================================
// POST /api/v1/auth/refresh
// Refresh access token using refresh token
// ============================================
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Verify the refresh token
      let payload: authService.TokenPayload;
      try {
        payload = authService.verifyRefreshToken(refreshToken);
      } catch {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token'
        });
      }

      // Check if refresh token exists in database
      const storedToken = await authService.findRefreshToken(refreshToken);
      if (!storedToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token has been revoked'
        });
      }

      // Get user
      const user = await authService.findUserById(payload.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new tokens
      const tokens = authService.generateTokens(user);

      // Replace refresh token
      await authService.storeRefreshToken(user.id, tokens.refreshToken);

      return res.json({
        success: true,
        data: { tokens }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to refresh token'
      });
    }
  }
);

// ============================================
// POST /api/v1/auth/logout
// Invalidate refresh token
// ============================================
router.post('/logout',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Delete the refresh token
      await authService.deleteRefreshToken(refreshToken);

      return res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
);

// ============================================
// POST /api/v1/auth/forgot-password
// Send password reset email
// ============================================
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await authService.findUserByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      // Create reset token
      const resetToken = await authService.createPasswordResetToken(user.id);

      // TODO: Send email with reset link
      // For now, log the token (remove in production)
      console.log(`Password reset token for ${email}: ${resetToken}`);

      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Include token in dev mode only
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process request'
      });
    }
  }
);

// ============================================
// POST /api/v1/auth/reset-password
// Reset password with token
// ============================================
router.post('/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      // Find the reset token
      const tokenRecord = await authService.findPasswordResetToken(token);
      if (!tokenRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password
      await authService.updateUserPassword(tokenRecord.user_id, password);

      // Delete the reset token
      await authService.deletePasswordResetToken(token);

      // Invalidate all refresh tokens for this user (force re-login)
      await authService.deleteAllUserRefreshTokens(tokenRecord.user_id);

      return res.json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }
);

// ============================================
// GET /api/v1/auth/me
// Get current user from token
// ============================================
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let payload: authService.TokenPayload;
    try {
      payload = authService.verifyAccessToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user
    const user = await authService.findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

export default router;
