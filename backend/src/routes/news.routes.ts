import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// ==============================================
// PUBLIC NEWS ROUTES
// For fetching active news items for the ticker
// Connected to PostgreSQL database
// ==============================================

/**
 * GET /api/v1/news
 * Get active news items for public display
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, limit = 10 } = req.query;

        // Build query with optional category filter
        let sql = `
            SELECT 
                id,
                title,
                content,
                category,
                link,
                is_pinned as "isPinned",
                priority,
                publish_at as "publishAt",
                expires_at as "expiresAt",
                created_at as "createdAt"
            FROM news_items
            WHERE is_active = true 
            AND (publish_at IS NULL OR publish_at <= NOW())
            AND (expires_at IS NULL OR expires_at > NOW())
        `;

        const params: unknown[] = [];

        if (category) {
            sql += ` AND category = $1`;
            params.push(category);
        }

        sql += ` ORDER BY is_pinned DESC, priority DESC, created_at DESC`;
        sql += ` LIMIT $${params.length + 1}`;
        params.push(Number(limit));

        const result = await query(sql, params);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch news' });
    }
});

/**
 * GET /api/v1/news/:id
 * Get a single news item by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT 
                id,
                title,
                content,
                category,
                link,
                is_pinned as "isPinned",
                priority,
                publish_at as "publishAt",
                expires_at as "expiresAt",
                created_at as "createdAt",
                updated_at as "updatedAt"
            FROM news_items
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'News item not found' });
        }

        return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching news item:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch news item' });
    }
});

export default router;
