import { Router, Request, Response } from 'express';
import verificationService from '../services/verification.service';
import { generateVerificationCode, isValidVerificationCode } from '../utils/verification.utils';
import pool from '../config/database';

const router = Router();

/**
 * Get all certifications for the authenticated user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        c.*,
        vl.verification_status,
        vl.verified_at,
        vl.expires_at as verification_expires_at
      FROM certifications c
      LEFT JOIN LATERAL (
        SELECT verification_status, verified_at, expires_at
        FROM verification_logs
        WHERE certification_id = c.id
        ORDER BY verified_at DESC
        LIMIT 1
      ) vl ON true
      WHERE c.user_id = $1
      ORDER BY c.issue_date DESC`,
      [userId]
    );

    res.json({ certifications: result.rows });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

/**
 * Get a specific certification by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `SELECT 
        c.*,
        vl.verification_status,
        vl.credential_number,
        vl.verified_at,
        vl.expires_at as verification_expires_at
      FROM certifications c
      LEFT JOIN LATERAL (
        SELECT verification_status, credential_number, verified_at, expires_at
        FROM verification_logs
        WHERE certification_id = c.id
        ORDER BY verified_at DESC
        LIMIT 1
      ) vl ON true
      WHERE c.id = $1 AND ($2::uuid IS NULL OR c.user_id = $2)`,
      [id, userId || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    res.json({ certification: result.rows[0] });
  } catch (error) {
    console.error('Error fetching certification:', error);
    res.status(500).json({ error: 'Failed to fetch certification' });
  }
});

/**
 * Verify a user's credentials
 */
router.post('/verify/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const userCheck = await pool.query(
      'SELECT id, first_name, last_name FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Perform verification
    const result = await verificationService.verifyUserById(userId);

    res.json({
      success: true,
      verification: {
        status: result.status,
        credentialNumber: result.credentialNumber,
        credentialType: result.credentialType,
        verifiedAt: result.verifiedAt,
        expiresAt: result.expiresAt,
        errorMessage: result.errorMessage
      }
    });
  } catch (error) {
    console.error('Error verifying credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify credentials'
    });
  }
});

/**
 * Public verification lookup by verification code
 */
router.get('/verify/public/:verificationCode', async (req: Request, res: Response) => {
  try {
    const { verificationCode } = req.params;

    if (!isValidVerificationCode(verificationCode)) {
      return res.status(400).json({ error: 'Invalid verification code format' });
    }

    // Find certification by verification code
    const certResult = await pool.query(
      `SELECT 
        c.id,
        c.certification_type,
        c.issue_date,
        c.expiration_date,
        c.certificate_number,
        c.status,
        u.first_name,
        u.last_name,
        vl.verification_status,
        vl.credential_number,
        vl.verified_at
      FROM certifications c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT verification_status, credential_number, verified_at
        FROM verification_logs
        WHERE certification_id = c.id
        ORDER BY verified_at DESC
        LIMIT 1
      ) vl ON true
      WHERE c.verification_code = $1`,
      [verificationCode]
    );

    if (certResult.rows.length === 0) {
      return res.status(404).json({ error: 'Verification code not found' });
    }

    const cert = certResult.rows[0];

    res.json({
      valid: true,
      certification: {
        holderName: `${cert.first_name} ${cert.last_name}`,
        certificationType: cert.certification_type,
        certificateNumber: cert.certificate_number,
        issueDate: cert.issue_date,
        expirationDate: cert.expiration_date,
        status: cert.status,
        verificationStatus: cert.verification_status,
        credentialNumber: cert.credential_number,
        verifiedAt: cert.verified_at
      }
    });
  } catch (error) {
    console.error('Error in public verification:', error);
    res.status(500).json({ error: 'Verification lookup failed' });
  }
});

/**
 * Batch verify multiple users
 */
router.post('/verify/batch', async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'Invalid userIds array' });
    }

    if (userIds.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 users per batch' });
    }

    const results = await verificationService.batchVerify(userIds);

    // Convert Map to object for JSON response
    const resultsObj: Record<string, any> = {};
    results.forEach((value, key) => {
      resultsObj[key] = value;
    });

    res.json({
      success: true,
      results: resultsObj,
      total: userIds.length,
      verified: Array.from(results.values()).filter(r => r.status === 'active').length
    });
  } catch (error) {
    console.error('Error in batch verification:', error);
    res.status(500).json({
      success: false,
      error: 'Batch verification failed'
    });
  }
});

/**
 * Generate a new certification with verification code
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { certificationType, assessmentId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify user completed required assessments
    // This is a placeholder - implement actual assessment completion check

    const issueDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 2); // 2 year validity

    const certificateNumber = `ND-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Insert certification
    const certResult = await pool.query(
      `INSERT INTO certifications (
        user_id,
        certification_type,
        issue_date,
        expiration_date,
        certificate_number,
        status,
        verification_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        certificationType || 'Nurse Delegation',
        issueDate,
        expirationDate,
        certificateNumber,
        'active',
        generateVerificationCode(userId)
      ]
    );

    const certification = certResult.rows[0];

    // Trigger verification
    await verificationService.verifyUserById(userId);

    res.status(201).json({
      success: true,
      certification
    });
  } catch (error) {
    console.error('Error generating certification:', error);
    res.status(500).json({ error: 'Failed to generate certification' });
  }
});

/**
 * Get verification status for a certification
 */
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        verification_status,
        credential_number,
        credential_type,
        verified_at,
        expires_at,
        error_message
      FROM verification_logs
      WHERE certification_id = $1
      ORDER BY verified_at DESC
      LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No verification found for this certification' });
    }

    res.json({ verification: result.rows[0] });
  } catch (error) {
    console.error('Error fetching verification status:', error);
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
});

export default router;

