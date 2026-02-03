package com.platform.startup.repository;

import com.platform.startup.model.Idea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, UUID> {
    List<Idea> findByStartupId(UUID startupId);
    Page<Idea> findAll(Pageable pageable);
    Optional<Idea> findByIdAndStartupId(UUID id, UUID startupId);
}
