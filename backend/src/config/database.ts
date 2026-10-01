import { Pool } from 'pg';
import { config } from './index';

// Create PostgreSQL connection pool
const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if can't connect
});

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
    console.error('❌ Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Helper function to execute queries
export const query = async (text: string, params?: unknown[]) => {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (config.nodeEnv === 'development') {
        console.log('📊 Query executed', { text: text.substring(0, 50) + '...', duration: `${duration}ms`, rows: result.rowCount });
    }

    return result;
};

// Get a client from the pool (for transactions)
export const getClient = async () => {
    const client = await pool.connect();
    const release = client.release.bind(client);

    // Set a timeout to auto-release connections
    const timeout = setTimeout(() => {
        console.error('⚠️ Client has been checked out for too long!');
    }, 5000);

    // Override release to clear timeout
    client.release = () => {
        clearTimeout(timeout);
        return release();
    };

    return client;
};

// Transaction helper
import { PoolClient } from 'pg';

export const withTransaction = async <T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
    const client = await getClient();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
    try {
        await pool.query('SELECT 1');
        return true;
    } catch {
        return false;
    }
};

// Graceful shutdown
export const closeDatabasePool = async () => {
    await pool.end();
    console.log('📦 PostgreSQL connection pool closed');
};

export default pool;
