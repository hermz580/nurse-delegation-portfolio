import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { config } from '../config';

// Types
export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role: 'caregiver' | 'provider' | 'admin' | 'organization_admin';
    license_type?: 'RN' | 'LPN' | 'None';
    license_number?: string;
    organization_id?: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'caregiver' | 'provider';
    licenseType?: 'RN' | 'LPN' | 'None';
    licenseNumber?: string;
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

// Token generation
export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as any,
    });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn as any,
    });
};

export const generateTokens = (user: User): AuthTokens => {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};

// User operations
export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email.toLowerCase()]
    );
    return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
    const result = await query(
        'SELECT * FROM users WHERE id = $1 AND is_active = true',
        [id]
    );
    return result.rows[0] || null;
};

export const createUser = async (data: RegisterData): Promise<User> => {
    const passwordHash = await hashPassword(data.password);

    const result = await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, license_type, license_number, is_active, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true, false)
     RETURNING *`,
        [
            data.email.toLowerCase(),
            passwordHash,
            data.firstName,
            data.lastName,
            data.role,
            data.licenseType || 'None',
            data.licenseNumber || null,
        ]
    );

    return result.rows[0];
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    const passwordHash = await hashPassword(newPassword);

    await query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [passwordHash, userId]
    );
};

export const verifyUserEmail = async (userId: string): Promise<void> => {
    await query(
        'UPDATE users SET email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
    );
};

// Refresh token storage (using database)
export const storeRefreshToken = async (userId: string, token: string): Promise<void> => {
    // First, delete any existing refresh tokens for this user
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);

    // Store the new refresh token
    await query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
        [userId, token]
    );
};

export const findRefreshToken = async (token: string): Promise<{ user_id: string } | null> => {
    const result = await query(
        'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    );
    return result.rows[0] || null;
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
    await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

export const deleteAllUserRefreshTokens = async (userId: string): Promise<void> => {
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
};

// Password reset tokens
export const createPasswordResetToken = async (userId: string): Promise<string> => {
    // Generate a secure random token
    const token = [...Array(64)].map(() => Math.random().toString(36)[2]).join('');

    // Delete any existing reset tokens for this user
    await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    // Store the new reset token (expires in 1 hour)
    await query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\')',
        [userId, token]
    );

    return token;
};

export const findPasswordResetToken = async (token: string): Promise<{ user_id: string } | null> => {
    const result = await query(
        'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    );
    return result.rows[0] || null;
};

export const deletePasswordResetToken = async (token: string): Promise<void> => {
    await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
};
