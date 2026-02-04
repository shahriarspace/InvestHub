import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, Frame, Message as StompMessage } from 'stompjs';

// Use relative URL for WebSocket (nginx proxies /ws to backend)
const WS_URL = '/ws';

interface UseWebSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  autoConnect?: boolean;
}

interface MessagePayload {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
}

interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}

interface ReadReceipt {
  userId: string;
  conversationId: string;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { onConnect, onDisconnect, onError, autoConnect = true } = options;
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const subscriptions = useRef<Map<string, any>>(new Map());

  const connect = useCallback(() => {
    if (stompClient.current?.connected || connecting) {
      return;
    }

    setConnecting(true);

    const socket = new SockJS(WS_URL);
    const client = (window as any).Stomp.over(socket);
    
    // Disable debug logs in production
    client.debug = process.env.NODE_ENV === 'development' ? console.log : null;

    client.connect(
      {},
      (frame: Frame) => {
        console.log('WebSocket connected:', frame);
        stompClient.current = client;
        setConnected(true);
        setConnecting(false);
        onConnect?.();
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        setConnecting(false);
        onError?.(error);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (!stompClient.current?.connected) {
            connect();
          }
        }, 5000);
      }
    );
  }, [onConnect, onError, connecting]);

  const disconnect = useCallback(() => {
    if (stompClient.current?.connected) {
      // Unsubscribe from all subscriptions
      subscriptions.current.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.warn('Error unsubscribing:', e);
        }
      });
      subscriptions.current.clear();

      stompClient.current.disconnect(() => {
        console.log('WebSocket disconnected');
        setConnected(false);
        onDisconnect?.();
      });
    }
  }, [onDisconnect]);

  // Subscribe to a conversation's messages
  const subscribeToConversation = useCallback(
    (conversationId: string, onMessage: (message: MessagePayload) => void) => {
      if (!stompClient.current?.connected) {
        console.warn('WebSocket not connected. Cannot subscribe.');
        return null;
      }

      const topic = `/topic/conversation/${conversationId}`;
      
      // Avoid duplicate subscriptions
      if (subscriptions.current.has(topic)) {
        return subscriptions.current.get(topic);
      }

      const subscription = stompClient.current.subscribe(topic, (message: StompMessage) => {
        try {
          const payload = JSON.parse(message.body) as MessagePayload;
          onMessage(payload);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });

      subscriptions.current.set(topic, subscription);
      return subscription;
    },
    []
  );

  // Subscribe to typing indicators for a conversation
  const subscribeToTyping = useCallback(
    (conversationId: string, onTyping: (indicator: TypingIndicator) => void) => {
      if (!stompClient.current?.connected) {
        return null;
      }

      const topic = `/topic/conversation/${conversationId}/typing`;
      
      if (subscriptions.current.has(topic)) {
        return subscriptions.current.get(topic);
      }

      const subscription = stompClient.current.subscribe(topic, (message: StompMessage) => {
        try {
          const payload = JSON.parse(message.body) as TypingIndicator;
          onTyping(payload);
        } catch (e) {
          console.error('Error parsing typing indicator:', e);
        }
      });

      subscriptions.current.set(topic, subscription);
      return subscription;
    },
    []
  );

  // Subscribe to read receipts for a conversation
  const subscribeToReadReceipts = useCallback(
    (conversationId: string, onRead: (receipt: ReadReceipt) => void) => {
      if (!stompClient.current?.connected) {
        return null;
      }

      const topic = `/topic/conversation/${conversationId}/read`;
      
      if (subscriptions.current.has(topic)) {
        return subscriptions.current.get(topic);
      }

      const subscription = stompClient.current.subscribe(topic, (message: StompMessage) => {
        try {
          const payload = JSON.parse(message.body) as ReadReceipt;
          onRead(payload);
        } catch (e) {
          console.error('Error parsing read receipt:', e);
        }
      });

      subscriptions.current.set(topic, subscription);
      return subscription;
    },
    []
  );

  // Send a message to a conversation
  const sendMessage = useCallback(
    (conversationId: string, senderId: string, content: string) => {
      if (!stompClient.current?.connected) {
        console.warn('WebSocket not connected. Cannot send message.');
        return false;
      }

      const payload: MessagePayload = {
        conversationId,
        senderId,
        content,
      };

      stompClient.current.send(
        `/app/chat.send/${conversationId}`,
        {},
        JSON.stringify(payload)
      );

      return true;
    },
    []
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (conversationId: string, userId: string, isTyping: boolean) => {
      if (!stompClient.current?.connected) {
        return false;
      }

      const payload: TypingIndicator = {
        userId,
        isTyping,
      };

      stompClient.current.send(
        `/app/chat.typing/${conversationId}`,
        {},
        JSON.stringify(payload)
      );

      return true;
    },
    []
  );

  // Mark conversation as read
  const markAsRead = useCallback(
    (conversationId: string, userId: string) => {
      if (!stompClient.current?.connected) {
        return false;
      }

      const payload: ReadReceipt = {
        userId,
        conversationId,
      };

      stompClient.current.send(
        `/app/chat.read/${conversationId}`,
        {},
        JSON.stringify(payload)
      );

      return true;
    },
    []
  );

  // Unsubscribe from a specific topic
  const unsubscribe = useCallback((topic: string) => {
    const subscription = subscriptions.current.get(topic);
    if (subscription) {
      try {
        subscription.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing from topic:', topic, e);
      }
      subscriptions.current.delete(topic);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  return {
    connected,
    connecting,
    connect,
    disconnect,
    subscribeToConversation,
    subscribeToTyping,
    subscribeToReadReceipts,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    unsubscribe,
  };
};

export default useWebSocket;
