/**
 * Authorization Service Mock for Testing
 *
 * Provides mock implementations for authorization service testing.
 * Simulates permission checks, role validation, and access control.
 */

import {
  mockAuthorizationServiceInterface,
  mockPermissionInterface,
  mockUserInterface,
} from '../../types/types';

// Default mock permissions
const defaultMockPermissions: mockPermissionInterface[] = [
  'READ_CONTENT',
  'WRITE_CONTENT',
  'READ_USERS',
  'WRITE_USERS',
  'ADMIN_ACCESS',
];

// Default mock user with permissions
const defaultMockUser: mockUserInterface = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  role: 'USER',
  isActive: true,
  permissions: ['READ_CONTENT', 'WRITE_CONTENT'],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

/**
 * Creates a mock authorization service for testing
 *
 * @param customData - Optional custom mock data to override defaults
 * @returns A mock authorization service object
 */
export const mockAuthorizationService = (
  customData: Partial<mockAuthorizationServiceInterface> = {}
): mockAuthorizationServiceInterface => {
  const mockService: mockAuthorizationServiceInterface = {
    hasPermission: jest.fn().mockReturnValue(true),
    hasAnyPermission: jest.fn().mockReturnValue(true),
    hasAllPermissions: jest.fn().mockReturnValue(true),
    hasRole: jest.fn().mockReturnValue(true),
    hasAnyRole: jest.fn().mockReturnValue(true),
    canAccessResource: jest.fn().mockReturnValue(true),
    getEffectivePermissions: jest.fn().mockReturnValue(['READ_CONTENT', 'WRITE_CONTENT']),
    canPerformAction: jest.fn().mockReturnValue(true),
    getRolePermissions: jest.fn().mockReturnValue(['READ_CONTENT', 'WRITE_CONTENT']),
    ...customData,
  };

  return mockService;
};

/**
 * Creates a mock user with specific permissions for testing
 *
 * @param customData - Optional custom user data to override defaults
 * @returns A mock user object
 */
export const mockUserWithPermissions = (
  customData: Partial<mockUserInterface> = {}
): mockUserInterface => {
  return {
    ...defaultMockUser,
    ...customData,
  };
};

/**
 * Creates mock permissions array for testing
 *
 * @param permissions - Array of permissions to include
 * @returns Array of mock permissions
 */
export const mockPermissions = (
  permissions: mockPermissionInterface[] = defaultMockPermissions
): mockPermissionInterface[] => {
  return [...permissions];
};

// Default mock instances
export const defaultAuthorizationServiceMock = mockAuthorizationService();
export const defaultUserWithPermissionsMock = mockUserWithPermissions();
export const defaultPermissionsMock = mockPermissions();
