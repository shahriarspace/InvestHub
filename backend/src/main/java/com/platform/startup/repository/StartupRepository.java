package com.platform.startup.repository;

import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StartupRepository extends JpaRepository<Startup, UUID> {
    List<Startup> findByUserId(UUID userId);
    Page<Startup> findByStatus(StartupStatus status, Pageable pageable);
    Page<Startup> findAll(Pageable pageable);
    Optional<Startup> findByIdAndUserId(UUID id, UUID userId);
}
