/**
 * Auth Service Mock for Testing
 *
 * Provides mock implementations for authentication service testing.
 * Simulates user registration, login, and token verification.
 */

import {
  mockAuthServiceInterface,
  mockLoginCredentialsInterface,
  mockUserInterface,
} from '../../types/types';

// Default mock user data
const defaultMockUser: mockUserInterface = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  role: 'USER',
  isActive: true,
  permissions: [],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

// Default mock credentials
const defaultMockCredentials: mockLoginCredentialsInterface = {
  email: 'test@example.com',
  password: 'password123',
};

/**
 * Creates a mock auth service for testing
 *
 * @param customData - Optional custom mock data to override defaults
 * @returns A mock auth service object
 */
export const mockAuthService = (
  customData: Partial<mockAuthServiceInterface> = {}
): mockAuthServiceInterface => {
  const mockService: mockAuthServiceInterface = {
    register: jest.fn().mockResolvedValue({
      user: defaultMockUser,
      token: 'mock-jwt-token',
    }),
    login: jest.fn().mockResolvedValue({
      user: defaultMockUser,
      token: 'mock-jwt-token',
    }),
    verifyToken: jest.fn().mockResolvedValue(defaultMockUser),
    getSecurityEvents: jest.fn().mockReturnValue([]),
    ...customData,
  };

  return mockService;
};

/**
 * Creates a mock user for testing
 *
 * @param customData - Optional custom user data to override defaults
 * @returns A mock user object
 */
export const mockUser = (customData: Partial<mockUserInterface> = {}): mockUserInterface => {
  return {
    ...defaultMockUser,
    ...customData,
  };
};

/**
 * Creates mock login credentials for testing
 *
 * @param customData - Optional custom credentials to override defaults
 * @returns Mock login credentials
 */
export const mockLoginCredentials = (
  customData: Partial<mockLoginCredentialsInterface> = {}
): mockLoginCredentialsInterface => {
  return {
    ...defaultMockCredentials,
    ...customData,
  };
};

// Default mock instances
export const defaultAuthServiceMock = mockAuthService();
export const defaultUserMock = mockUser();
export const defaultCredentialsMock = mockLoginCredentials();
