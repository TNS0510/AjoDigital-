CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    display_name TEXT,
    email TEXT UNIQUE,
    photo_url TEXT,
    role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user profile information, linked to Supabase Auth.';
COMMENT ON COLUMN users.id IS 'Matches the UID from auth.users.';
