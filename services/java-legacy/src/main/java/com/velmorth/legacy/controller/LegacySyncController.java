package com.velmorth.legacy.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/legacy")
@CrossOrigin(origins = "*")
public class LegacySyncController {

    public static class SyncRequest {
        private String uid;
        private String username;
        private int xp;
        private int streak;
        private int level;

        // Getters and Setters
        public String getUid() { return uid; }
        public void setUid(String uid) { this.uid = uid; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public int getXp() { return xp; }
        public void setXp(int xp) { this.xp = xp; }
        public int getStreak() { return streak; }
        public void setStreak(int streak) { this.streak = streak; }
        public int getLevel() { return level; }
        public void setLevel(int level) { this.level = level; }
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "healthy");
        res.put("service", "java-legacy");
        return res;
    }

    @PostMapping("/sync")
    public Map<String, Object> syncUser(@RequestBody SyncRequest request) {
        Map<String, Object> res = new HashMap<>();
        
        // Simulating writing to a legacy database
        String transactionId = UUID.randomUUID().toString();
        
        res.put("synced", true);
        res.put("uid", request.getUid());
        res.put("username", request.getUsername());
        res.put("transactionId", transactionId);
        res.put("message", "Successfully synced learning progress to Enterprise ERP database.");
        res.put("timestamp", System.currentTimeMillis());
        
        return res;
    }
}
