package com.platform.analytics.service;

import com.platform.analytics.model.AnalyticsDTO.*;
import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.repository.InvestmentOfferRepository;
import com.platform.investor.model.Investor;
import com.platform.investor.repository.InvestorRepository;
import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.repository.StartupRepository;
import com.platform.user.model.User;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final StartupRepository startupRepository;
    private final InvestorRepository investorRepository;
    private final InvestmentOfferRepository investmentOfferRepository;
    private final UserRepository userRepository;

    public AnalyticsService(StartupRepository startupRepository,
                           InvestorRepository investorRepository,
                           InvestmentOfferRepository investmentOfferRepository,
                           UserRepository userRepository) {
        this.startupRepository = startupRepository;
        this.investorRepository = investorRepository;
        this.investmentOfferRepository = investmentOfferRepository;
        this.userRepository = userRepository;
    }

    public PlatformStats getPlatformStats() {
        PlatformStats stats = new PlatformStats();

        // Count entities
        stats.setTotalStartups(startupRepository.count());
        stats.setTotalInvestors(investorRepository.count());
        stats.setTotalOffers(investmentOfferRepository.count());

        // Calculate total funding raised (sum of currentFunding for all startups)
        List<Startup> startups = startupRepository.findAll();
        BigDecimal totalFunding = startups.stream()
            .map(s -> s.getCurrentFunding() != null ? s.getCurrentFunding() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalFundingRaised(totalFunding);

        // Count accepted offers
        List<InvestmentOffer> allOffers = investmentOfferRepository.findAll();
        long acceptedCount = allOffers.stream()
            .filter(o -> o.getStatus() == OfferStatus.ACCEPTED)
            .count();
        stats.setAcceptedOffersCount(acceptedCount);

        // Calculate average offer amount
        if (!allOffers.isEmpty()) {
            BigDecimal totalOfferAmount = allOffers.stream()
                .map(o -> o.getOfferedAmount() != null ? o.getOfferedAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            stats.setAverageOfferAmount(totalOfferAmount.divide(
                BigDecimal.valueOf(allOffers.size()), 2, RoundingMode.HALF_UP));
        } else {
            stats.setAverageOfferAmount(BigDecimal.ZERO);
        }

        // Count active users
        List<User> users = userRepository.findAll();
        long activeUsers = users.stream()
            .filter(u -> u.getStatus() == UserStatus.ACTIVE)
            .count();
        stats.setActiveUsers(activeUsers);

        return stats;
    }

    public List<InvestmentTrend> getInvestmentTrends(int months) {
        List<InvestmentTrend> trends = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = months - 1; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1).minusSeconds(1);

            List<InvestmentOffer> monthOffers = investmentOfferRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && 
                            o.getCreatedAt().isAfter(monthStart) && 
                            o.getCreatedAt().isBefore(monthEnd))
                .collect(Collectors.toList());

            long offerCount = monthOffers.size();
            BigDecimal totalAmount = monthOffers.stream()
                .map(o -> o.getOfferedAmount() != null ? o.getOfferedAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            long acceptedCount = monthOffers.stream()
                .filter(o -> o.getStatus() == OfferStatus.ACCEPTED)
                .count();

            trends.add(new InvestmentTrend(
                monthStart.getMonthValue(),
                monthStart.getYear(),
                offerCount,
                totalAmount,
                acceptedCount
            ));
        }

        return trends;
    }

    public List<StageDistribution> getStageDistribution() {
        List<Startup> startups = startupRepository.findAll();
        long totalStartups = startups.size();

        Map<String, List<Startup>> byStage = startups.stream()
            .filter(s -> s.getStage() != null)
            .collect(Collectors.groupingBy(Startup::getStage));

        List<StageDistribution> distributions = new ArrayList<>();
        for (Map.Entry<String, List<Startup>> entry : byStage.entrySet()) {
            List<Startup> stageStartups = entry.getValue();
            BigDecimal totalFunding = stageStartups.stream()
                .map(s -> s.getCurrentFunding() != null ? s.getCurrentFunding() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal avgFunding = stageStartups.isEmpty() ? BigDecimal.ZERO :
                totalFunding.divide(BigDecimal.valueOf(stageStartups.size()), 2, RoundingMode.HALF_UP);

            StageDistribution dist = new StageDistribution(
                entry.getKey(),
                stageStartups.size(),
                avgFunding,
                totalFunding
            );
            if (totalStartups > 0) {
                dist.setPercentage((double) stageStartups.size() / totalStartups * 100);
            }
            distributions.add(dist);
        }

        return distributions.stream()
            .sorted((a, b) -> Long.compare(b.getStartupCount(), a.getStartupCount()))
            .collect(Collectors.toList());
    }

    public List<SectorDistribution> getSectorDistribution() {
        // For now, we'll use a simplified approach since sectors aren't stored directly
        // This would typically parse the description or have a dedicated sector field
        List<Investor> investors = investorRepository.findAll();
        Map<String, Long> sectorCounts = new HashMap<>();
        
        for (Investor investor : investors) {
            if (investor.getSectorsInterested() != null) {
                String[] sectors = investor.getSectorsInterested().split(",");
                for (String sector : sectors) {
                    String trimmed = sector.trim();
                    sectorCounts.merge(trimmed, 1L, Long::sum);
                }
            }
        }

        long total = sectorCounts.values().stream().mapToLong(Long::longValue).sum();
        
        return sectorCounts.entrySet().stream()
            .map(e -> {
                SectorDistribution dist = new SectorDistribution(e.getKey(), e.getValue(), BigDecimal.ZERO);
                if (total > 0) {
                    dist.setPercentage((double) e.getValue() / total * 100);
                }
                return dist;
            })
            .sorted((a, b) -> Long.compare(b.getStartupCount(), a.getStartupCount()))
            .collect(Collectors.toList());
    }

    public List<TopStartup> getTopStartups(int limit) {
        List<Startup> startups = startupRepository.findAll();
        
        return startups.stream()
            .filter(s -> s.getStatus() == StartupStatus.PUBLISHED)
            .sorted((a, b) -> {
                BigDecimal fundingA = a.getCurrentFunding() != null ? a.getCurrentFunding() : BigDecimal.ZERO;
                BigDecimal fundingB = b.getCurrentFunding() != null ? b.getCurrentFunding() : BigDecimal.ZERO;
                return fundingB.compareTo(fundingA);
            })
            .limit(limit)
            .map(s -> {
                TopStartup top = new TopStartup();
                top.setId(s.getId().toString());
                top.setCompanyName(s.getCompanyName());
                top.setStage(s.getStage());
                top.setCurrentFunding(s.getCurrentFunding() != null ? s.getCurrentFunding() : BigDecimal.ZERO);
                top.setFundingGoal(s.getFundingGoal() != null ? s.getFundingGoal() : BigDecimal.ZERO);
                if (s.getFundingGoal() != null && s.getFundingGoal().compareTo(BigDecimal.ZERO) > 0) {
                    top.setFundingProgress(s.getCurrentFunding()
                        .divide(s.getFundingGoal(), 4, RoundingMode.HALF_UP)
                        .doubleValue() * 100);
                }
                return top;
            })
            .collect(Collectors.toList());
    }

    public List<TopInvestor> getTopInvestors(int limit) {
        List<Investor> investors = investorRepository.findAll();
        List<InvestmentOffer> allOffers = investmentOfferRepository.findAll();
        
        Map<UUID, List<InvestmentOffer>> offersByInvestor = allOffers.stream()
            .collect(Collectors.groupingBy(InvestmentOffer::getInvestorId));

        return investors.stream()
            .map(inv -> {
                TopInvestor top = new TopInvestor();
                top.setId(inv.getId().toString());
                
                // Get user name
                User user = userRepository.findById(inv.getUserId()).orElse(null);
                if (user != null) {
                    top.setName(user.getFirstName() + " " + user.getLastName());
                }

                List<InvestmentOffer> investorOffers = offersByInvestor.getOrDefault(inv.getId(), new ArrayList<>());
                top.setOffersMade(investorOffers.size());
                
                long acceptedCount = investorOffers.stream()
                    .filter(o -> o.getStatus() == OfferStatus.ACCEPTED)
                    .count();
                top.setOffersAccepted((int) acceptedCount);

                BigDecimal totalInvested = investorOffers.stream()
                    .filter(o -> o.getStatus() == OfferStatus.ACCEPTED)
                    .map(o -> o.getOfferedAmount() != null ? o.getOfferedAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                top.setTotalInvested(totalInvested);

                if (inv.getSectorsInterested() != null) {
                    top.setSectorsInterested(Arrays.asList(inv.getSectorsInterested().split(",")));
                }

                return top;
            })
            .sorted((a, b) -> b.getTotalInvested().compareTo(a.getTotalInvested()))
            .limit(limit)
            .collect(Collectors.toList());
    }
}
