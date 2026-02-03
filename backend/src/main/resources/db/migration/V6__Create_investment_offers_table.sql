CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'NEGOTIATING', 'WITHDRAWN');

CREATE TABLE investment_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL,
    idea_id UUID NOT NULL,
    offered_amount DECIMAL(15,2) NOT NULL,
    equity_percentage DECIMAL(5,2) NOT NULL,
    valuation DECIMAL(15,2),
    message TEXT,
    status offer_status NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
);

CREATE INDEX idx_investment_offers_investor_id ON investment_offers(investor_id);
CREATE INDEX idx_investment_offers_idea_id ON investment_offers(idea_id);
CREATE INDEX idx_investment_offers_status ON investment_offers(status);
CREATE INDEX idx_investment_offers_created_at ON investment_offers(created_at DESC);
