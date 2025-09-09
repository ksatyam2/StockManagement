package com.ofss.web;

import com.ofss.domain.User;
import com.ofss.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class MeController {
    private final UserRepository userRepo;
    public MeController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepo.findByUsername(username).orElseThrow();
        Map<String, Object> map = new HashMap<>();
        map.put("username", user.getUsername());
        map.put("role", user.getRole());
        if ("CUSTOMER".equals(user.getRole()) && user.getCustomer() != null) {
            map.put("customerId", user.getCustomer().getCustomerId());
            map.put("email", user.getCustomer().getEmail());
        }
        return map;
    }
}