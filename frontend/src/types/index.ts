// User types
export enum UserRole {
  ADMIN = 'ADMIN',
  STARTUP = 'STARTUP',
  INVESTOR = 'INVESTOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export interface User {
  id: string;
  googleId?: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Startup types
export enum StartupStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Startup {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  stage: string;
  fundingGoal: number;
  currentFunding: number;
  website?: string;
  linkedinUrl?: string;
  pitchDeckUrl?: string;
  status: StartupStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Investor types
export enum InvestorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Investor {
  id: string;
  userId: string;
  companyName: string;
  investmentFocus: string;
  minInvestment: number;
  maxInvestment: number;
  status: InvestorStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Investment Offer types
export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface InvestmentOffer {
  id: string;
  ideaId: string;
  investorId: string;
  amount: number;
  equity: number;
  terms: string;
  status: OfferStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Messaging types
export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp?: string;
  path?: string;
}
