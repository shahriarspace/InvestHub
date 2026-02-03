CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id UUID NOT NULL,
    participant2_id UUID NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(participant1_id, participant2_id)
);

CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);
