package com.platform.messaging.repository;

import com.platform.messaging.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    @Query("SELECT c FROM Conversation c WHERE (c.participant1Id = :user1 AND c.participant2Id = :user2) OR (c.participant1Id = :user2 AND c.participant2Id = :user1)")
    Optional<Conversation> findByParticipants(@Param("user1") UUID user1, @Param("user2") UUID user2);

    @Query("SELECT c FROM Conversation c WHERE c.participant1Id = :userId OR c.participant2Id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserId(@Param("userId") UUID userId);
}
