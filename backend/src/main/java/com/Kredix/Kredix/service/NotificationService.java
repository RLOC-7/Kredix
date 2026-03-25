package com.Kredix.Kredix.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.scheduling.annotation.Scheduled;
@Service
public class NotificationService {
    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        emitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        emitter.onCompletion(() -> {
            System.out.println("SSE Completion for user: " + userId);
            removeEmitter(userId, emitter);
        });
        emitter.onTimeout(() -> {
            System.out.println("SSE Timeout for user: " + userId);
            removeEmitter(userId, emitter);
        });
        emitter.onError((e) -> {
            System.out.println("SSE Error for user: " + userId + " - " + e.getMessage());
            removeEmitter(userId, emitter);
        });
        
        // Send initial connection event to confirm handshake
        try {
            emitter.send(SseEmitter.event().name("connected").data("Conexão estabelecida"));
            System.out.println("SSE Subscribed user: " + userId + " (Total connections: " + emitters.get(userId).size() + ")");
        } catch (IOException e) {
            removeEmitter(userId, emitter);
        }
        
        return emitter;
    }

    private void removeEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters != null) {
            userEmitters.remove(emitter);
            if (userEmitters.isEmpty()) {
                emitters.remove(userId);
            }
        }
    }

    @Scheduled(fixedRate = 15000)
    public void sendPings() {
        for (Map.Entry<Long, List<SseEmitter>> entry : emitters.entrySet()) {
            for (SseEmitter emitter : entry.getValue()) {
                try {
                    emitter.send(SseEmitter.event().name("ping").data("heartbeat"));
                } catch (IOException e) {
                    removeEmitter(entry.getKey(), emitter);
                }
            }
        }
    }

    public void notifyUser(Long userId, String eventName, Object data) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters != null && !userEmitters.isEmpty()) {
            for (SseEmitter emitter : userEmitters) {
                try {
                    emitter.send(SseEmitter.event().name(eventName).data(data));
                } catch (IOException e) {
                    removeEmitter(userId, emitter);
                }
            }
        }
    }
}
