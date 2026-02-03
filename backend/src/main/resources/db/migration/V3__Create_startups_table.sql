CREATE TYPE startup_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    stage VARCHAR(50),
    funding_goal DECIMAL(15,2),
    current_funding DECIMAL(15,2) DEFAULT 0,
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    pitch_deck_url VARCHAR(500),
    status startup_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_startups_user_id ON startups(user_id);
CREATE INDEX idx_startups_status ON startups(status);
CREATE INDEX idx_startups_created_at ON startups(created_at DESC);
