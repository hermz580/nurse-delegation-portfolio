-- Nurse Delegation Network Database Migration: Providers, Subscriptions, and News
-- Run after init.sql

-- ============================================
-- PROVIDERS TABLE
-- Core provider data (migrated from CSV)
-- ============================================
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Link to user account (if claimed/registered)
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    provider_id VARCHAR(100), -- External DSHS provider ID
    website VARCHAR(500),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    accepting_new_clients BOOLEAN DEFAULT true, -- Provider availability status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- PROVIDER COUNTIES (Service Areas)
-- Many-to-many: One provider can serve multiple counties
-- ============================================
CREATE TABLE IF NOT EXISTS provider_counties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    county VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider_id, county)
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- Stripe-integrated subscription tracking
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    plan VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    status VARCHAR(50) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'inactive', 'paused')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ============================================
-- NEWS / ANNOUNCEMENTS TABLE
-- For news ticker and admin announcements
-- ============================================
CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    category VARCHAR(50) CHECK (category IN ('announcement', 'update', 'alert', 'news')),
    is_active BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0, -- Higher = more important
    publish_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMIN SETTINGS TABLE
-- Key-value store for site configuration
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_providers_name ON providers(name);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE INDEX IF NOT EXISTS idx_provider_counties_provider ON provider_counties(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_counties_county ON provider_counties(county);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_news_active ON news_items(is_active);
CREATE INDEX IF NOT EXISTS idx_news_publish ON news_items(publish_at);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_items_updated_at BEFORE UPDATE ON news_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DEFAULT ADMIN SETTINGS
-- ============================================
INSERT INTO admin_settings (key, value, description) VALUES
    ('site_name', '"Nurse Delegation Network"', 'Public site name'),
    ('subscription_required', 'true', 'Whether subscription is required to access the site'),
    ('trial_days', '14', 'Number of trial days for new users'),
    ('stripe_enabled', 'false', 'Whether Stripe payments are enabled'),
    ('maintenance_mode', 'false', 'Whether the site is in maintenance mode')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SAMPLE PROVIDERS (for development)
-- ============================================
INSERT INTO providers (name, display_name, phone, email, provider_id, is_active, is_verified) VALUES
    ('Seattle Nurse Delegation Services', 'Seattle NDS', '(206) 555-0101', 'contact@example.com', 'DSHS-001', true, true),
    ('Tacoma Healthcare Delegation', 'Tacoma HD', '(253) 555-0102', 'info@example.com', 'DSHS-002', true, true),
    ('Spokane RN Delegators', 'Spokane RND', '(509) 555-0103', 'hello@example.com', 'DSHS-003', true, true)
ON CONFLICT DO NOTHING;

-- Link sample providers to counties
DO $$
DECLARE
    seattle_id UUID;
    tacoma_id UUID;
    spokane_id UUID;
BEGIN
    SELECT id INTO seattle_id FROM providers WHERE provider_id = 'DSHS-001' LIMIT 1;
    SELECT id INTO tacoma_id FROM providers WHERE provider_id = 'DSHS-002' LIMIT 1;
    SELECT id INTO spokane_id FROM providers WHERE provider_id = 'DSHS-003' LIMIT 1;
    
    IF seattle_id IS NOT NULL THEN
        INSERT INTO provider_counties (provider_id, county, lat, lng, is_primary) VALUES
            (seattle_id, 'King', 47.6062, -122.3321, true),
            (seattle_id, 'Snohomish', 48.0419, -122.1710, false),
            (seattle_id, 'Pierce', 47.0676, -122.1295, false)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF tacoma_id IS NOT NULL THEN
        INSERT INTO provider_counties (provider_id, county, lat, lng, is_primary) VALUES
            (tacoma_id, 'Pierce', 47.2529, -122.4443, true),
            (tacoma_id, 'Thurston', 46.9965, -122.9024, false)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF spokane_id IS NOT NULL THEN
        INSERT INTO provider_counties (provider_id, county, lat, lng, is_primary) VALUES
            (spokane_id, 'Spokane', 47.6588, -117.4260, true),
            (spokane_id, 'Lincoln', 47.5716, -118.4088, false)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- SAMPLE NEWS ITEMS
-- ============================================
INSERT INTO news_items (title, content, category, is_active, is_pinned, priority) VALUES
    ('Welcome to the Nurse Delegation Network!', 'The Washington Nurse Delegation Network is now live.', 'announcement', true, true, 100),
    ('New Provider Sign-ups Open', 'RN delegators can now register for our directory.', 'news', true, false, 50),
    ('WAC 246-840 Updates', 'Recent regulatory updates affecting nurse delegation.', 'update', true, false, 30)
ON CONFLICT DO NOTHING;
