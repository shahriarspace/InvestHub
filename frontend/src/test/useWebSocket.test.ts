import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock SockJS and Stomp
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();
const mockSend = vi.fn();
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('sockjs-client', () => ({
  default: vi.fn(() => ({})),
}));

// Create mock Stomp client
const mockStompClient = {
  connected: false,
  connect: mockConnect,
  disconnect: mockDisconnect,
  send: mockSend,
  subscribe: mockSubscribe,
  debug: null,
};

// Mock Stomp.over
(global as any).Stomp = {
  over: vi.fn(() => mockStompClient),
};

import { useWebSocket } from '../hooks/useWebSocket';

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStompClient.connected = false;
    
    // Setup connect to succeed
    mockConnect.mockImplementation((headers, onConnect, onError) => {
      mockStompClient.connected = true;
      onConnect({ command: 'CONNECTED' });
    });
    
    mockDisconnect.mockImplementation((callback) => {
      mockStompClient.connected = false;
      callback();
    });
    
    mockSubscribe.mockReturnValue({
      id: 'sub-1',
      unsubscribe: mockUnsubscribe,
    });
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));
    
    expect(result.current.connected).toBe(false);
    expect(result.current.connecting).toBe(false);
  });

  it('should auto-connect when autoConnect is true', async () => {
    const onConnect = vi.fn();
    
    const { result } = renderHook(() => useWebSocket({ 
      autoConnect: true,
      onConnect 
    }));
    
    // Wait for connection
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    expect(onConnect).toHaveBeenCalled();
  });

  it('should manually connect when connect() is called', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));
    
    expect(result.current.connected).toBe(false);
    
    act(() => {
      result.current.connect();
    });
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
  });

  it('should disconnect when disconnect() is called', async () => {
    const onDisconnect = vi.fn();
    
    const { result } = renderHook(() => useWebSocket({ 
      autoConnect: true,
      onDisconnect 
    }));
    
    // Wait for connection
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    act(() => {
      result.current.disconnect();
    });
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(false);
    });
    
    expect(onDisconnect).toHaveBeenCalled();
  });

  it('should subscribe to conversation', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    const onMessage = vi.fn();
    const conversationId = 'test-conversation-id';
    
    act(() => {
      result.current.subscribeToConversation(conversationId, onMessage);
    });
    
    expect(mockSubscribe).toHaveBeenCalledWith(
      `/topic/conversation/${conversationId}`,
      expect.any(Function)
    );
  });

  it('should send message to conversation', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    const conversationId = 'test-conversation-id';
    const senderId = 'sender-id';
    const content = 'Hello, world!';
    
    act(() => {
      result.current.sendMessage(conversationId, senderId, content);
    });
    
    expect(mockSend).toHaveBeenCalledWith(
      `/app/chat.send/${conversationId}`,
      {},
      expect.stringContaining(content)
    );
  });

  it('should send typing indicator', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    const conversationId = 'test-conversation-id';
    const userId = 'user-id';
    
    act(() => {
      result.current.sendTypingIndicator(conversationId, userId, true);
    });
    
    expect(mockSend).toHaveBeenCalledWith(
      `/app/chat.typing/${conversationId}`,
      {},
      expect.stringContaining(userId)
    );
  });

  it('should mark conversation as read', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    const conversationId = 'test-conversation-id';
    const userId = 'user-id';
    
    act(() => {
      result.current.markAsRead(conversationId, userId);
    });
    
    expect(mockSend).toHaveBeenCalledWith(
      `/app/chat.read/${conversationId}`,
      {},
      expect.any(String)
    );
  });

  it('should not send message when disconnected', () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));
    
    const success = result.current.sendMessage('conv-id', 'sender-id', 'Hello');
    
    expect(success).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('should unsubscribe from topic', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));
    
    await vi.waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
    
    const conversationId = 'test-conversation-id';
    const onMessage = vi.fn();
    
    act(() => {
      result.current.subscribeToConversation(conversationId, onMessage);
    });
    
    act(() => {
      result.current.unsubscribe(`/topic/conversation/${conversationId}`);
    });
    
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
