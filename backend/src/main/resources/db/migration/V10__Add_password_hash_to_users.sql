-- Add password_hash column to users table for BCrypt password storage

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Create index for faster password-based authentication
CREATE INDEX IF NOT EXISTS idx_users_password_auth ON users(email, password_hash) WHERE password_hash IS NOT NULL;

-- Comment on column
COMMENT ON COLUMN users.password_hash IS 'BCrypt hashed password for email/password authentication';
