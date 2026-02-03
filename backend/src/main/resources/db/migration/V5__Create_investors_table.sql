CREATE TYPE investor_status AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE');

CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    investment_budget DECIMAL(15,2),
    investment_stage JSONB,
    sectors_interested JSONB,
    min_ticket_size DECIMAL(15,2),
    max_ticket_size DECIMAL(15,2),
    portfolio_companies JSONB,
    status investor_status NOT NULL DEFAULT 'PENDING_APPROVAL',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_investors_user_id ON investors(user_id);
CREATE INDEX idx_investors_status ON investors(status);
