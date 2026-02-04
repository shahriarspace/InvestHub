import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/api/authService';
import apiClient from '../services/api/apiClient';

// Mock apiClient
vi.mock('../services/api/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call login endpoint with correct credentials', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            userRole: 'STARTUP',
            status: 'ACTIVE',
          },
        },
      };
      
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on invalid credentials', async () => {
      const error = new Error('Invalid email or password');
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register', () => {
    it('should call register endpoint with correct data', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '123',
            email: 'newuser@example.com',
            firstName: 'New',
            lastName: 'User',
            userRole: 'INVESTOR',
            status: 'ACTIVE',
          },
        },
      };
      
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        userRole: 'INVESTOR',
      };

      const result = await authService.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when email already exists', async () => {
      const error = new Error('Email already registered');
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
        userRole: 'STARTUP',
      };

      await expect(authService.register(registerData)).rejects.toThrow('Email already registered');
    });
  });

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('getCurrentUser', () => {
    it('should call me endpoint and return user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userRole: 'STARTUP',
        status: 'ACTIVE',
      };
      
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when not authenticated', async () => {
      const error = new Error('Unauthorized');
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(authService.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('refreshToken', () => {
    it('should call refresh endpoint', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-access-token',
        },
      };
      
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('googleLogin', () => {
    it('should call google login endpoint with token', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          user: {
            id: '123',
            email: 'google@example.com',
            firstName: 'Google',
            lastName: 'User',
            userRole: 'STARTUP',
            status: 'ACTIVE',
          },
        },
      };
      
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const googleToken = 'google-oauth-token';
      const result = await authService.googleLogin(googleToken);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/google', { token: googleToken });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
