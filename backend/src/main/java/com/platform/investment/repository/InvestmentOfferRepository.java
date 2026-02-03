package com.platform.investment.repository;

import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvestmentOfferRepository extends JpaRepository<InvestmentOffer, UUID> {
    List<InvestmentOffer> findByIdeaId(UUID ideaId);
    List<InvestmentOffer> findByInvestorId(UUID investorId);
    Page<InvestmentOffer> findByStatus(OfferStatus status, Pageable pageable);
    Optional<InvestmentOffer> findByIdAndInvestorId(UUID id, UUID investorId);
}
