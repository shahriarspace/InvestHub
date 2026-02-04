package com.platform.analytics.controller;

import com.platform.analytics.model.AnalyticsDTO.*;
import com.platform.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/platform-stats")
    public ResponseEntity<PlatformStats> getPlatformStats() {
        PlatformStats stats = analyticsService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/investment-trends")
    public ResponseEntity<List<InvestmentTrend>> getInvestmentTrends(
            @RequestParam(defaultValue = "12") int months) {
        List<InvestmentTrend> trends = analyticsService.getInvestmentTrends(months);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/stage-distribution")
    public ResponseEntity<List<StageDistribution>> getStageDistribution() {
        List<StageDistribution> distribution = analyticsService.getStageDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/sector-distribution")
    public ResponseEntity<List<SectorDistribution>> getSectorDistribution() {
        List<SectorDistribution> distribution = analyticsService.getSectorDistribution();
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/top-startups")
    public ResponseEntity<List<TopStartup>> getTopStartups(
            @RequestParam(defaultValue = "10") int limit) {
        List<TopStartup> topStartups = analyticsService.getTopStartups(limit);
        return ResponseEntity.ok(topStartups);
    }

    @GetMapping("/top-investors")
    public ResponseEntity<List<TopInvestor>> getTopInvestors(
            @RequestParam(defaultValue = "10") int limit) {
        List<TopInvestor> topInvestors = analyticsService.getTopInvestors(limit);
        return ResponseEntity.ok(topInvestors);
    }
}
