import { Message, Conversation } from '../../types';
export declare const messagingService: {
    createConversation: (participantIds: string[]) => Promise<Conversation>;
    getConversationById: (conversationId: string) => Promise<Conversation>;
    getUserConversations: (userId: string, page?: number, size?: number) => Promise<any>;
    sendMessage: (message: Partial<Message>) => Promise<Message>;
    getMessages: (conversationId: string, page?: number, size?: number) => Promise<any>;
    getUnreadCount: (conversationId: string) => Promise<number>;
    markMessageAsRead: (messageId: string) => Promise<Message>;
    markAllAsRead: (conversationId: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
};
