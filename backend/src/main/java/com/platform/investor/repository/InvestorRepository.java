package com.platform.investor.repository;

import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvestorRepository extends JpaRepository<Investor, UUID> {
    Optional<Investor> findByUserId(UUID userId);
    Page<Investor> findByStatus(InvestorStatus status, Pageable pageable);
    Page<Investor> findAll(Pageable pageable);
}
