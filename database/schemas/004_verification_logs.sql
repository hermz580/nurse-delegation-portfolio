-- Verification Logs Schema
-- Stores credential verification results and audit trail

-- Verification logs table
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    verification_status VARCHAR(50) NOT NULL CHECK (verification_status IN ('active', 'expired', 'not_found', 'error', 'pending')),
    credential_number VARCHAR(100),
    credential_type VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    doh_response JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_logs_user ON verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_certification ON verification_logs(certification_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_status ON verification_logs(verification_status);
CREATE INDEX IF NOT EXISTS idx_verification_logs_verified_at ON verification_logs(verified_at);
CREATE INDEX IF NOT EXISTS idx_verification_logs_expires_at ON verification_logs(expires_at);

-- Trigger for updated_at
CREATE TRIGGER update_verification_logs_updated_at BEFORE UPDATE ON verification_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get latest verification for a user
CREATE OR REPLACE FUNCTION get_latest_verification(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    verification_status VARCHAR(50),
    credential_number VARCHAR(100),
    verified_at TIMESTAMP,
    expires_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vl.id,
        vl.verification_status,
        vl.credential_number,
        vl.verified_at,
        vl.expires_at
    FROM verification_logs vl
    WHERE vl.user_id = p_user_id
    ORDER BY vl.verified_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check if verification is stale (older than 30 days)
CREATE OR REPLACE FUNCTION is_verification_stale(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    last_verified TIMESTAMP;
BEGIN
    SELECT verified_at INTO last_verified
    FROM verification_logs
    WHERE user_id = p_user_id
    ORDER BY verified_at DESC
    LIMIT 1;
    
    IF last_verified IS NULL THEN
        RETURN TRUE;
    END IF;
    
    RETURN (CURRENT_TIMESTAMP - last_verified) > INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
