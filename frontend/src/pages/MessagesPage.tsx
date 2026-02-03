import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Paper,
  Divider,
  Badge,
  CircularProgress,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/api/messagingService';
import { userService } from '../services/api/userService';
import { useWebSocket } from '../hooks/useWebSocket';
import { Message, Conversation, User } from '../types';

interface ConversationWithUser extends Conversation {
  otherUser?: User;
  unreadCount?: number;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    connected,
    subscribeToConversation,
    subscribeToTyping,
    sendMessage: wsSendMessage,
    sendTypingIndicator,
    markAsRead,
    unsubscribe,
  } = useWebSocket({
    onConnect: () => console.log('WebSocket connected'),
    onDisconnect: () => console.log('WebSocket disconnected'),
    onError: (error) => console.error('WebSocket error:', error),
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await messagingService.getUserConversations(user.id);
        const conversationList = data.content || data || [];
        
        // Fetch other user details for each conversation
        const conversationsWithUsers = await Promise.all(
          conversationList.map(async (conv: Conversation) => {
            const otherUserId = conv.participantIds?.find((id: string) => id !== user.id);
            let otherUser: User | undefined;
            
            if (otherUserId) {
              try {
                otherUser = await userService.getUserById(otherUserId);
              } catch (e) {
                console.warn('Could not fetch user:', otherUserId);
              }
            }
            
            return { ...conv, otherUser };
          })
        );
        
        setConversations(conversationsWithUsers);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?.id]);

  // Subscribe to WebSocket when conversation is selected
  useEffect(() => {
    if (!selectedConversation?.id || !connected) return;

    // Subscribe to messages
    subscribeToConversation(selectedConversation.id, (message) => {
      setMessages((prev) => [...prev, message as Message]);
      
      // Mark as read if from other user
      if (message.senderId !== user?.id) {
        markAsRead(selectedConversation.id, user?.id || '');
      }
    });

    // Subscribe to typing indicators
    subscribeToTyping(selectedConversation.id, (indicator) => {
      if (indicator.userId !== user?.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (indicator.isTyping) {
            newSet.add(indicator.userId);
          } else {
            newSet.delete(indicator.userId);
          }
          return newSet;
        });
      }
    });

    return () => {
      unsubscribe(`/topic/conversation/${selectedConversation.id}`);
      unsubscribe(`/topic/conversation/${selectedConversation.id}/typing`);
    };
  }, [selectedConversation?.id, connected, user?.id]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?.id) return;
      
      try {
        const data = await messagingService.getMessages(selectedConversation.id);
        const messageList = data.content || data || [];
        setMessages(messageList.reverse()); // Reverse to show oldest first
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [selectedConversation?.id]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation?.id || !user?.id) return;

    setSendingMessage(true);
    
    try {
      // Try WebSocket first, fall back to REST API
      if (connected) {
        wsSendMessage(selectedConversation.id, user.id, newMessage.trim());
      } else {
        const message = await messagingService.sendMessage({
          conversationId: selectedConversation.id,
          senderId: user.id,
          content: newMessage.trim(),
        });
        setMessages((prev) => [...prev, message]);
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!selectedConversation?.id || !user?.id || !connected) return;

    // Send typing indicator
    sendTypingIndicator(selectedConversation.id, user.id, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(selectedConversation.id, user.id, false);
    }, 2000);
  }, [selectedConversation?.id, user?.id, connected, sendTypingIndicator]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
        {connected && (
          <Chip 
            label="Live" 
            color="success" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        )}
      </Typography>
      
      <Paper sx={{ display: 'flex', height: '70vh' }}>
        {/* Conversations List */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Conversations
          </Typography>
          <Divider />
          <List sx={{ overflow: 'auto', maxHeight: 'calc(70vh - 60px)' }}>
            {conversations.length === 0 ? (
              <ListItem>
                <ListItemText secondary="No conversations yet" />
              </ListItem>
            ) : (
              conversations.map((conv) => (
                <ListItem
                  key={conv.id}
                  button
                  selected={selectedConversation?.id === conv.id}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <ListItemAvatar>
                    <Badge badgeContent={conv.unreadCount} color="primary">
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      conv.otherUser
                        ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
                        : 'Unknown User'
                    }
                    secondary={conv.lastMessage || 'No messages'}
                    secondaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: 180 },
                    }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {selectedConversation.otherUser
                    ? `${selectedConversation.otherUser.firstName} ${selectedConversation.otherUser.lastName}`
                    : 'Conversation'}
                </Typography>
                {typingUsers.size > 0 && (
                  <Typography variant="caption" color="textSecondary">
                    typing...
                  </Typography>
                )}
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        bgcolor: msg.senderId === user?.id ? 'primary.main' : 'grey.200',
                        color: msg.senderId === user?.id ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{msg.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString()
                          : ''}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    size="small"
                    disabled={sendingMessage}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="textSecondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default MessagesPage;
