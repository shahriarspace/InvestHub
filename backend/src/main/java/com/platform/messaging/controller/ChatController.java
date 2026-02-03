package com.platform.messaging.controller;

import com.platform.messaging.model.MessageDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public MessageDTO sendMessage(MessageDTO message) {
        return message;
    }

    @MessageMapping("/chat.join")
    @SendTo("/topic/messages")
    public MessageDTO join(MessageDTO message) {
        return message;
    }

    @MessageMapping("/chat.leave")
    @SendTo("/topic/messages")
    public MessageDTO leave(MessageDTO message) {
        return message;
    }
}
