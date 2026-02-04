import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/api/messagingService';
import { userService } from '../services/api/userService';
import { Message, Conversation, User } from '../types';

interface ConversationWithUser extends Conversation {
  otherUser?: User;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New conversation dialog
  const [newConvoOpen, setNewConvoOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');
      const data = await messagingService.getUserConversations(user.id);
      const conversationList = Array.isArray(data) ? data : data.content || [];

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
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user?.id]);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?.id) return;

      try {
        setMessagesLoading(true);
        const data = await messagingService.getMessages(selectedConversation.id);
        const messageList = Array.isArray(data) ? data : data.content || [];
        // Sort by createdAt ascending (oldest first)
        messageList.sort((a: Message, b: Message) => 
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
        setMessages(messageList);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [selectedConversation?.id]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation?.id || !user?.id) return;

    setSendingMessage(true);

    try {
      const message = await messagingService.sendMessage({
        conversationId: selectedConversation.id,
        senderId: user.id,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load users for new conversation
  const handleOpenNewConvo = async () => {
    setNewConvoOpen(true);
    setLoadingUsers(true);
    try {
      const data = await userService.getAllUsers(0, 100);
      const userList = Array.isArray(data) ? data : data.content || [];
      // Filter out current user
      setAllUsers(userList.filter((u: User) => u.id !== user?.id));
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Start new conversation
  const handleStartConversation = async () => {
    if (!selectedUser || !user?.id) return;

    try {
      const conversation = await messagingService.getOrCreateConversation(user.id, selectedUser.id);
      setNewConvoOpen(false);
      setSelectedUser(null);
      
      // Add to conversations list if not already there
      const existingConvo = conversations.find(c => c.id === conversation.id);
      if (!existingConvo) {
        const convoWithUser = { ...conversation, otherUser: selectedUser };
        setConversations(prev => [convoWithUser, ...prev]);
        setSelectedConversation(convoWithUser);
      } else {
        setSelectedConversation({ ...existingConvo, otherUser: selectedUser });
      }
    } catch (err: any) {
      console.error('Failed to create conversation:', err);
      setError('Failed to start conversation');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Messages</Typography>
        <Box>
          <IconButton onClick={loadConversations} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewConvo}
          >
            New Message
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
                <ListItemText 
                  secondary="No conversations yet. Click 'New Message' to start one." 
                />
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
                    <Avatar>
                      {conv.otherUser?.firstName?.charAt(0) || <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      conv.otherUser
                        ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
                        : 'Unknown User'
                    }
                    secondary={conv.lastMessage || 'No messages yet'}
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
                <Typography variant="caption" color="text.secondary">
                  {selectedConversation.otherUser?.email}
                </Typography>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messagesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : messages.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No messages yet. Send the first message!
                  </Typography>
                ) : (
                  messages.map((msg) => (
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
                            ? new Date(msg.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : ''}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="small"
                    disabled={sendingMessage}
                    multiline
                    maxRows={3}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    {sendingMessage ? <CircularProgress size={24} /> : <SendIcon />}
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
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                Select a conversation or start a new one
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenNewConvo}
              >
                New Message
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* New Conversation Dialog */}
      <Dialog open={newConvoOpen} onClose={() => setNewConvoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {loadingUsers ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Autocomplete
                options={allUsers}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    placeholder="Search for a user..."
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {option.firstName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {option.firstName} {option.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewConvoOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStartConversation}
            disabled={!selectedUser}
          >
            Start Conversation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MessagesPage;
