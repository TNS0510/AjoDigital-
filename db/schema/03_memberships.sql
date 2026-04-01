CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    payout_turn INTEGER,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Add comments for documentation
COMMENT ON TABLE memberships IS 'Links users to groups and tracks their payout turn.';
