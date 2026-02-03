CREATE TYPE idea_status AS ENUM ('DRAFT', 'PUBLISHED', 'LOOKING_FOR_INVESTORS', 'FUNDED', 'REJECTED');

CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT,
    solution_description TEXT,
    target_market VARCHAR(255),
    revenue_model VARCHAR(255),
    requested_investment DECIMAL(15,2),
    equity_offered DECIMAL(5,2),
    status idea_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

CREATE INDEX idx_ideas_startup_id ON ideas(startup_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
