-- Performance Indexes for AjoDigital

-- Groups
CREATE INDEX IF NOT EXISTS idx_groups_organizer ON groups(organizer_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);

-- Memberships
CREATE INDEX IF NOT EXISTS idx_memberships_group ON memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- Contributions
CREATE INDEX IF NOT EXISTS idx_contributions_group_cycle ON contributions(group_id, cycle_number);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);

-- Add comments
COMMENT ON INDEX idx_contributions_group_cycle IS 'Optimizes dashboard views for current cycle status.';
