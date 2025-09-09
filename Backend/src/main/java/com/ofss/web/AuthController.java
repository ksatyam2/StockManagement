package com.ofss.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @PostMapping("/api/login")
    public ResponseEntity<?> fakeLogin() {
       
        return ResponseEntity.ok().build();
    }
}