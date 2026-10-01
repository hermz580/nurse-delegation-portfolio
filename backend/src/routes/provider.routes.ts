import { Router, Request, Response } from 'express';
import { query, withTransaction } from '../config/database';

const router = Router();

// ==============================================
// PROVIDER ROUTES
// Full CRUD for nurse delegation providers
// Connected to PostgreSQL database
// ==============================================

/**
 * GET /api/v1/providers
 * List all active providers with their service counties
 * Query params: county, search, page, limit
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { county, search, page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        // Build dynamic query with filters
        let whereClause = 'WHERE p.is_active = true';
        const params: unknown[] = [];
        let paramIndex = 1;

        if (search) {
            whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.display_name ILIKE $${paramIndex} OR p.email ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (county) {
            whereClause += ` AND pc.county ILIKE $${paramIndex}`;
            params.push(`%${county}%`);
            paramIndex++;
        }

        // Get total count
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM providers p
            LEFT JOIN provider_counties pc ON p.id = pc.provider_id
            ${whereClause}
        `;
        const countResult = await query(countQuery, params);
        const total = parseInt(countResult.rows[0]?.total || '0', 10);

        // Get providers with counties
        const providersQuery = `
            SELECT 
                p.id,
                p.name,
                p.display_name as "displayName",
                p.phone,
                p.email,
                p.provider_id as "providerId",
                p.website,
                p.is_active as "isActive",
                p.is_verified as "isVerified",
                p.accepting_new_clients as "acceptingNewClients",
                p.created_at as "createdAt",
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pc.id,
                            'county', pc.county,
                            'lat', pc.lat,
                            'lng', pc.lng,
                            'isPrimary', pc.is_primary
                        )
                    ) FILTER (WHERE pc.id IS NOT NULL),
                    '[]'
                ) as counties
            FROM providers p
            LEFT JOIN provider_counties pc ON p.id = pc.provider_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.name ASC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        const providersResult = await query(providersQuery, [...params, Number(limit), offset]);

        res.json({
            success: true,
            data: providersResult.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch providers' });
    }
});

/**
 * GET /api/v1/providers/meta/counties
 * Get list of all counties with provider counts
 * NOTE: This must be defined BEFORE /:id to avoid route conflicts
 */
router.get('/meta/counties', async (_req: Request, res: Response) => {
    try {
        const result = await query(`
            SELECT 
                pc.county,
                COUNT(DISTINCT pc.provider_id) as "providerCount"
            FROM provider_counties pc
            JOIN providers p ON pc.provider_id = p.id
            WHERE p.is_active = true
            GROUP BY pc.county
            ORDER BY "providerCount" DESC, pc.county ASC
        `);

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching counties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch counties' });
    }
});

/**
 * GET /api/v1/providers/:id
 * Get a single provider by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT 
                p.id,
                p.name,
                p.display_name as "displayName",
                p.phone,
                p.email,
                p.provider_id as "providerId",
                p.website,
                p.notes,
                p.is_active as "isActive",
                p.is_verified as "isVerified",
                p.accepting_new_clients as "acceptingNewClients",
                p.created_at as "createdAt",
                p.updated_at as "updatedAt",
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pc.id,
                            'county', pc.county,
                            'lat', pc.lat,
                            'lng', pc.lng,
                            'isPrimary', pc.is_primary
                        )
                    ) FILTER (WHERE pc.id IS NOT NULL),
                    '[]'
                ) as counties
            FROM providers p
            LEFT JOIN provider_counties pc ON p.id = pc.provider_id
            WHERE p.id = $1
            GROUP BY p.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Provider not found' });
        }

        return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error fetching provider:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch provider' });
    }
});

/**
 * POST /api/v1/providers
 * Create a new provider (Admin only)
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, displayName, phone, email, providerId, website, notes, counties } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ success: false, error: 'Provider name is required' });
        }

        const newProvider = await withTransaction(async (client) => {
            // Insert provider
            const providerResult = await client.query(`
                INSERT INTO providers (name, display_name, phone, email, provider_id, website, notes)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING 
                    id, name, display_name as "displayName", phone, email, 
                    provider_id as "providerId", website, notes,
                    is_active as "isActive", is_verified as "isVerified",
                    accepting_new_clients as "acceptingNewClients",
                    created_at as "createdAt"
            `, [name, displayName || name, phone, email, providerId, website, notes]);

            const provider = providerResult.rows[0];

            // Insert counties if provided
            if (counties && counties.length > 0) {
                for (const countyData of counties) {
                    await client.query(`
                        INSERT INTO provider_counties (provider_id, county, lat, lng, is_primary)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [provider.id, countyData.county, countyData.lat, countyData.lng, countyData.isPrimary || false]);
                }
            }

            // Fetch counties
            const countiesResult = await client.query(`
                SELECT id, county, lat, lng, is_primary as "isPrimary"
                FROM provider_counties WHERE provider_id = $1
            `, [provider.id]);

            return { ...provider, counties: countiesResult.rows };
        });

        return res.status(201).json({ success: true, data: newProvider });
    } catch (error) {
        console.error('Error creating provider:', error);
        return res.status(500).json({ success: false, error: 'Failed to create provider' });
    }
});

/**
 * PUT /api/v1/providers/:id
 * Update a provider (Admin only)
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, displayName, phone, email, providerId, website, notes, isActive, isVerified, acceptingNewClients } = req.body;

        // Build dynamic update query
        const updates: string[] = [];
        const params: unknown[] = [];
        let paramIndex = 1;

        if (name !== undefined) { updates.push(`name = $${paramIndex++}`); params.push(name); }
        if (displayName !== undefined) { updates.push(`display_name = $${paramIndex++}`); params.push(displayName); }
        if (phone !== undefined) { updates.push(`phone = $${paramIndex++}`); params.push(phone); }
        if (email !== undefined) { updates.push(`email = $${paramIndex++}`); params.push(email); }
        if (providerId !== undefined) { updates.push(`provider_id = $${paramIndex++}`); params.push(providerId); }
        if (website !== undefined) { updates.push(`website = $${paramIndex++}`); params.push(website); }
        if (notes !== undefined) { updates.push(`notes = $${paramIndex++}`); params.push(notes); }
        if (isActive !== undefined) { updates.push(`is_active = $${paramIndex++}`); params.push(isActive); }
        if (isVerified !== undefined) { updates.push(`is_verified = $${paramIndex++}`); params.push(isVerified); }
        if (acceptingNewClients !== undefined) { updates.push(`accepting_new_clients = $${paramIndex++}`); params.push(acceptingNewClients); }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update' });
        }

        params.push(id);
        const result = await query(`
            UPDATE providers SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING 
                id, name, display_name as "displayName", phone, email,
                provider_id as "providerId", website, notes,
                is_active as "isActive", is_verified as "isVerified",
                accepting_new_clients as "acceptingNewClients",
                updated_at as "updatedAt"
        `, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Provider not found' });
        }

        return res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating provider:', error);
        return res.status(500).json({ success: false, error: 'Failed to update provider' });
    }
});

/**
 * DELETE /api/v1/providers/:id
 * Soft-delete a provider (Admin only)
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await query(`
            UPDATE providers SET is_active = false
            WHERE id = $1
            RETURNING id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Provider not found' });
        }

        return res.json({ success: true, message: 'Provider deactivated successfully' });
    } catch (error) {
        console.error('Error deleting provider:', error);
        return res.status(500).json({ success: false, error: 'Failed to delete provider' });
    }
});

/**
 * POST /api/v1/providers/:id/counties
 * Add a county to a provider's service area (Admin only)
 */
router.post('/:id/counties', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { county, lat, lng, isPrimary } = req.body;

        if (!county) {
            return res.status(400).json({ success: false, error: 'County name is required' });
        }

        // Verify provider exists
        const providerCheck = await query('SELECT id FROM providers WHERE id = $1', [id]);
        if (providerCheck.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Provider not found' });
        }

        const result = await query(`
            INSERT INTO provider_counties (provider_id, county, lat, lng, is_primary)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (provider_id, county) DO UPDATE SET lat = $3, lng = $4, is_primary = $5
            RETURNING id, provider_id as "providerId", county, lat, lng, is_primary as "isPrimary"
        `, [id, county, lat, lng, isPrimary || false]);

        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error adding county:', error);
        return res.status(500).json({ success: false, error: 'Failed to add county' });
    }
});

/**
 * DELETE /api/v1/providers/:id/counties/:countyId
 * Remove a county from a provider's service area (Admin only)
 */
router.delete('/:id/counties/:countyId', async (req: Request, res: Response) => {
    try {
        const { id, countyId } = req.params;

        const result = await query(`
            DELETE FROM provider_counties 
            WHERE id = $1 AND provider_id = $2
            RETURNING id
        `, [countyId, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'County not found for this provider' });
        }

        return res.json({ success: true, message: 'County removed successfully' });
    } catch (error) {
        console.error('Error removing county:', error);
        return res.status(500).json({ success: false, error: 'Failed to remove county' });
    }
});

export default router;
