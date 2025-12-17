/**
 * Authorization Service Tests
 */

import { AuthorizationService } from './authorization.service';
import { Permission, User, UserRole } from '../../types/security.types';

describe('AuthorizationService', () => {
  let authService: AuthorizationService;

  const mockUser: User = {
    id: 'user_1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    role: UserRole.USER,
    permissions: [], // User permissions are empty, role permissions will be used
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminUser: User = {
    id: 'admin_1',
    email: 'admin@example.com',
    username: 'admin',
    password: 'hashedpassword',
    role: UserRole.ADMIN,
    permissions: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Use the singleton instance
    authService = AuthorizationService.getInstance();
  });

  // Debug test to check enum values
  it('should have correct enum values', () => {
    expect(UserRole.USER).toBe('user');
    expect(Permission.READ_CONTENT).toBe('read:content');
    expect(Permission.WRITE_CONTENT).toBe('write:content');
  });

  // Debug test to check getEffectivePermissions
  it('should return correct permissions for USER role', () => {
    // Debug the issue
    // console.log('mockUser:', mockUser);
    // console.log('mockUser.isActive:', mockUser.isActive);
    // console.log('mockUser.role:', mockUser.role);

    const permissions = authService.getEffectivePermissions(mockUser);
    // console.log('permissions:', permissions);

    expect(permissions).toContain(Permission.READ_CONTENT);
    expect(permissions).toContain(Permission.WRITE_CONTENT);
    expect(permissions).not.toContain(Permission.READ_USERS);
  });

  // Debug test to check role permissions directly
  it('should return correct role permissions', () => {
    // Access the private method through any casting
    const getRolePermissions = (authService as any).getRolePermissions;
    const userPermissions = getRolePermissions(UserRole.USER);
    expect(userPermissions).toContain(Permission.READ_CONTENT);
    expect(userPermissions).toContain(Permission.WRITE_CONTENT);
  });

  // Debug test to check user object
  it('should have correct user object', () => {
    expect(mockUser.isActive).toBe(true);
    expect(mockUser.role).toBe(UserRole.USER);
    expect(mockUser.permissions).toEqual([]);
  });

  // Debug test to step through getEffectivePermissions
  it('should debug getEffectivePermissions step by step', () => {
    // Check if user is active
    expect(mockUser.isActive).toBe(true);

    // Check role permissions with mockUser.role
    const getRolePermissions = (authService as any).getRolePermissions;
    const rolePermissions = getRolePermissions(mockUser.role);

    // Debug: Check what mockUser.role actually is
    expect(mockUser.role).toBe(UserRole.USER);
    expect(typeof mockUser.role).toBe('string');
    expect(mockUser.role).toBe('user');

    // Check if rolePermissions is empty
    if (rolePermissions.length === 0) {
      // This means the role lookup failed
      expect(rolePermissions).toContain(Permission.READ_CONTENT);
    } else {
      expect(rolePermissions).toContain(Permission.READ_CONTENT);
    }
  });

  // Direct test of getEffectivePermissions
  it('should return permissions from getEffectivePermissions directly', () => {
    // TODO: Fix authorization service getEffectivePermissions issue
    const permissions = authService.getEffectivePermissions(mockUser);
    expect(permissions.length).toBeGreaterThan(0);
    expect(permissions).toContain(Permission.READ_CONTENT);
  });

  // Debug test to check what's happening in getEffectivePermissions
  it('should debug getEffectivePermissions method', () => {
    // TODO: Fix authorization service getEffectivePermissions issue
    // Check if user is active
    expect(mockUser.isActive).toBe(true);

    // Check role permissions directly with UserRole.USER
    const getRolePermissions = (authService as any).getRolePermissions;
    const rolePermissionsDirect = getRolePermissions(UserRole.USER);
    expect(rolePermissionsDirect.length).toBeGreaterThan(0);

    // Check role permissions with mockUser.role
    const rolePermissionsFromUser = getRolePermissions(mockUser.role);

    // Debug: Check if they're the same
    expect(mockUser.role).toBe(UserRole.USER);
    expect(rolePermissionsFromUser.length).toBe(rolePermissionsDirect.length);
    expect(rolePermissionsFromUser).toEqual(rolePermissionsDirect);

    // Check user permissions
    const userPermissions = mockUser.permissions || [];
    expect(userPermissions).toEqual([]);

    // Check combined permissions
    const allPermissions = [...rolePermissionsFromUser, ...userPermissions];
    expect(allPermissions.length).toBeGreaterThan(0);

    // Check final result
    const finalPermissions = Array.from(new Set(allPermissions));
    expect(finalPermissions.length).toBeGreaterThan(0);

    // Now test the actual method
    const result = authService.getEffectivePermissions(mockUser);
    expect(result.length).toBeGreaterThan(0);
  });

  const mockInactiveUser: User = {
    id: 'inactive_1',
    email: 'inactive@example.com',
    username: 'inactive',
    password: 'hashedpassword',
    role: UserRole.USER,
    permissions: [Permission.READ_CONTENT],
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('hasPermission', () => {
    it('should return true if user has permission', () => {
      // TODO: Fix authorization service getEffectivePermissions issue
      const result = authService.hasPermission(mockUser, Permission.READ_CONTENT);
      expect(result.hasPermission).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return false if user lacks permission', () => {
      const result = authService.hasPermission(mockUser, Permission.READ_USERS);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User lacks permission');
    });

    it('should return false for inactive user', () => {
      const result = authService.hasPermission(mockInactiveUser, Permission.READ_CONTENT);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toBe('User account is inactive');
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has any of the permissions', () => {
      // TODO: Fix authorization service getEffectivePermissions issue
      const result = authService.hasAnyPermission(mockUser, [
        Permission.READ_CONTENT,
        Permission.READ_USERS,
      ]);
      expect(result.hasPermission).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return false if user has none of the permissions', () => {
      const result = authService.hasAnyPermission(mockUser, [
        Permission.READ_USERS,
        Permission.WRITE_USERS,
      ]);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User lacks any of the required permissions');
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all permissions', () => {
      // TODO: Fix authorization service getEffectivePermissions issue
      const result = authService.hasAllPermissions(mockUser, [
        Permission.READ_CONTENT,
        Permission.WRITE_CONTENT,
      ]);
      expect(result.hasPermission).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return false if user lacks some permissions', () => {
      const result = authService.hasAllPermissions(mockUser, [
        Permission.READ_CONTENT,
        Permission.READ_USERS,
      ]);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User lacks required permissions');
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the role', () => {
      const result = authService.hasRole(mockUser, UserRole.USER);
      expect(result.hasPermission).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return false if user has different role', () => {
      const result = authService.hasRole(mockUser, UserRole.ADMIN);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User role');
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the roles', () => {
      const result = authService.hasAnyRole(mockUser, [UserRole.USER, UserRole.ADMIN]);
      expect(result.hasPermission).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return false if user has none of the roles', () => {
      const result = authService.hasAnyRole(mockUser, [UserRole.ADMIN, UserRole.MODERATOR]);
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User role');
    });
  });

  describe('canAccessResource', () => {
    it('should allow admin users to access any resource', () => {
      const result = authService.canAccessResource({
        user: mockAdminUser,
        resource: 'users',
        action: 'delete',
      });
      expect(result.hasPermission).toBe(true);
    });

    it('should deny access to inactive users', () => {
      const result = authService.canAccessResource({
        user: mockInactiveUser,
        resource: 'content',
        action: 'read',
      });
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toBe('User account is inactive');
    });

    it('should allow access based on permissions', () => {
      // TODO: Fix authorization service getEffectivePermissions issue
      const result = authService.canAccessResource({
        user: mockUser,
        resource: 'content',
        action: 'read',
      });
      expect(result.hasPermission).toBe(true);
    });

    it('should deny access if user lacks required permission', () => {
      const result = authService.canAccessResource({
        user: mockUser,
        resource: 'users',
        action: 'read',
      });
      expect(result.hasPermission).toBe(false);
      expect(result.reason).toContain('User lacks permission');
    });
  });

  describe('getEffectivePermissions', () => {
    it('should return empty array for inactive users', () => {
      const result = authService.getEffectivePermissions(mockInactiveUser);
      expect(result).toEqual([]);
    });

    it('should return combined role and user permissions', () => {
      // TODO: Fix this test - there's an issue with the getRolePermissions method
      const result = authService.getEffectivePermissions(mockUser);
      expect(result).toContain(Permission.READ_CONTENT);
      expect(result).toContain(Permission.WRITE_CONTENT);
    });

    it('should return all permissions for admin users', () => {
      // TODO: Fix this test - there's an issue with the getRolePermissions method
      const result = authService.getEffectivePermissions(mockAdminUser);
      expect(result).toContain(Permission.READ_USERS);
      expect(result).toContain(Permission.WRITE_USERS);
      expect(result).toContain(Permission.DELETE_USERS);
    });
  });

  describe('canPerformAction', () => {
    it('should allow action if user has permission', () => {
      // TODO: Fix authorization service getEffectivePermissions issue
      const result = authService.canPerformAction(mockUser, 'content', 'read');
      expect(result.hasPermission).toBe(true);
    });

    it('should deny action if user lacks permission', () => {
      const result = authService.canPerformAction(mockUser, 'users', 'delete');
      expect(result.hasPermission).toBe(false);
    });
  });
});
