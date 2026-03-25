package com.Kredix.Kredix.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.Kredix.Kredix.model.User;
import com.Kredix.Kredix.service.NotificationService;
import com.Kredix.Kredix.service.UserService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam("token") String token) {
        String cleanToken = token.replace("Bearer ", "");
        User user = userService.buscarUsuarioPorToken(cleanToken);
        if (user == null) {
            throw new RuntimeException("Token inválido para SSE.");
        }
        return notificationService.subscribe(user.getId());
    }
}
