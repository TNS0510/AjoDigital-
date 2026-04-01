CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    contribution_amount NUMERIC NOT NULL CHECK (contribution_amount > 0),
    frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly')),
    total_members INTEGER NOT NULL CHECK (total_members > 0),
    organizer_id UUID NOT NULL REFERENCES users(id),
    status TEXT NOT NULL CHECK (status IN ('recruiting', 'active', 'completed')) DEFAULT 'recruiting',
    rotation_order UUID[],
    current_cycle INTEGER DEFAULT 1,
    start_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE groups IS 'Stores Ajo/Esusu savings group configurations.';
COMMENT ON COLUMN groups.rotation_order IS 'Ordered array of user IDs representing the payout sequence.';
