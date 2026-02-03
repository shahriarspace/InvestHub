CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    bio TEXT,
    website VARCHAR(500),
    location VARCHAR(255),
    phone_number VARCHAR(20),
    company_name VARCHAR(255),
    founded_year INTEGER,
    team_size INTEGER,
    stage VARCHAR(50),
    investment_budget DECIMAL(15,2),
    min_ticket_size DECIMAL(15,2),
    max_ticket_size DECIMAL(15,2),
    sectors_interested JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
