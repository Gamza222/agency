/**
 * Authentication Service Tests
 */

import { AuthService } from './auth.service';
import { SecurityEventType, UserRole } from '../../types/security.types';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = AuthService.getInstance();
    // Clear any existing users and events
    (authService as any).users = [];
    (authService as any).securityEvents = [];
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const jwt = jest.requireMock('jsonwebtoken');
      jest.mocked(jwt.sign).mockReturnValueOnce('mock_access_token');
      jest.mocked(jwt.sign).mockReturnValueOnce('mock_refresh_token');

      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = await authService.register(registerData);

      expect(result.user.email).toBe(registerData.email);
      expect(result.user.username).toBe(registerData.username);
      expect(result.user.role).toBe(UserRole.USER);
      expect(result.tokens.accessToken).toBe('mock_access_token');
      expect(result.tokens.refreshToken).toBe('mock_refresh_token');
    });

    it('should throw error if user already exists', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Register first user
      await authService.register(registerData);

      // Try to register same user again
      await expect(authService.register(registerData)).rejects.toThrow('User already exists');
    });

    it('should throw error if passwords do not match', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      await expect(authService.register(registerData)).rejects.toThrow('Passwords do not match');
    });

    it('should throw error for invalid email format', async () => {
      const registerData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await expect(authService.register(registerData)).rejects.toThrow('Invalid email format');
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const jwt = jest.requireMock('jsonwebtoken');
      const bcrypt = jest.requireMock('bcryptjs');

      // Mock bcrypt.hash for registration
      jest.mocked(bcrypt.hash).mockResolvedValue('hashed_password');
      // Mock bcrypt.compare for login
      jest.mocked(bcrypt.compare).mockResolvedValue(true);
      // Mock JWT sign for both registration and login
      jest.mocked(jwt.sign).mockReturnValue('mock_token');

      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Register user first
      await authService.register(registerData);

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(loginData);

      expect(result.user.email).toBe(loginData.email);
      expect(result.tokens.accessToken).toBe('mock_token');
      expect(result.tokens.refreshToken).toBe('mock_token');
    });

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for inactive user', async () => {
      const jwt = jest.requireMock('jsonwebtoken');
      const bcrypt = jest.requireMock('bcryptjs');

      // Mock bcrypt.hash for registration
      jest.mocked(bcrypt.hash).mockResolvedValue('hashed_password');
      // Mock bcrypt.compare for login
      jest.mocked(bcrypt.compare).mockResolvedValue(true);
      // Mock JWT sign for registration
      jest.mocked(jwt.sign).mockReturnValue('mock_token');

      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Register user first
      await authService.register(registerData);

      // Manually deactivate the user in the service's internal storage
      const users = (authService as any).users;
      const user = users.find((u: any) => u.email === 'test@example.com');
      if (user) {
        user.isActive = false;
      }

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginData)).rejects.toThrow('Account is inactive');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token successfully', async () => {
      const jwt = jest.requireMock('jsonwebtoken');
      jest.mocked(jwt.verify).mockReturnValue({ userId: 'user_123' });

      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await authService.register(registerData);
      (authService as any).users[0].id = 'user_123';

      const result = await authService.verifyToken('valid_token');

      expect(result.id).toBe('user_123');
    });

    it('should throw error for invalid token', async () => {
      const jwt = jest.requireMock('jsonwebtoken');
      jest.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken('invalid_token')).rejects.toThrow('Invalid token');
    });
  });

  describe('getSecurityEvents', () => {
    it('should return security events', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await authService.register(registerData);

      const events = authService.getSecurityEvents();
      expect(events).toHaveLength(1);
      expect(events[0]?.type).toBe(SecurityEventType.LOGIN_SUCCESS);
    });
  });
});
