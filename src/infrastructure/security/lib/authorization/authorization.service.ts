/**
 * Authorization Service
 *
 * Handles user authorization, permission checking, and access control.
 * Universal authorization service for enterprise applications.
 */

import {
  AuthorizationContext,
  Permission,
  PermissionCheck,
  User,
  UserRole,
} from '../../types/security.types';

// ============================================================================
// AUTHORIZATION SERVICE
// ============================================================================

export class AuthorizationService {
  private static instance: AuthorizationService;

  public constructor() {}

  public static getInstance(): AuthorizationService {
    if (!AuthorizationService.instance) {
      AuthorizationService.instance = new AuthorizationService();
    }
    return AuthorizationService.instance;
  }

  /**
   * Check if user has specific permission
   */
  public hasPermission(user: User, permission: Permission): PermissionCheck {
    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    const userPermissions = this.getEffectivePermissions(user);
    const hasPermission = userPermissions.includes(permission);

    return {
      hasPermission,
      reason: hasPermission ? undefined : `User lacks permission: ${permission}`,
    };
  }

  /**
   * Check if user has any of the specified permissions
   */
  public hasAnyPermission(user: User, permissions: Permission[]): PermissionCheck {
    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    const userPermissions = this.getEffectivePermissions(user);
    const hasAnyPermission = permissions.some((permission) => userPermissions.includes(permission));

    return {
      hasPermission: hasAnyPermission,
      reason: hasAnyPermission
        ? undefined
        : `User lacks any of the required permissions: ${permissions.join(', ')}`,
    };
  }

  /**
   * Check if user has all of the specified permissions
   */
  public hasAllPermissions(user: User, permissions: Permission[]): PermissionCheck {
    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    const userPermissions = this.getEffectivePermissions(user);
    const hasAllPermissions = permissions.every((permission) =>
      userPermissions.includes(permission)
    );

    return {
      hasPermission: hasAllPermissions,
      reason: hasAllPermissions
        ? undefined
        : `User lacks required permissions: ${permissions.filter((p) => !userPermissions.includes(p)).join(', ')}`,
    };
  }

  /**
   * Check if user has specific role
   */
  public hasRole(user: User, role: UserRole): PermissionCheck {
    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    const hasRole = user.role === role;

    return {
      hasPermission: hasRole,
      reason: hasRole
        ? undefined
        : `User role '${user.role}' does not match required role '${role}'`,
    };
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(user: User, roles: UserRole[]): PermissionCheck {
    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    const hasAnyRole = roles.includes(user.role);

    return {
      hasPermission: hasAnyRole,
      reason: hasAnyRole
        ? undefined
        : `User role '${user.role}' is not in required roles: ${roles.join(', ')}`,
    };
  }

  /**
   * Check if user can access a specific resource
   */
  public canAccessResource(context: AuthorizationContext): PermissionCheck {
    const { user, resource, action } = context;

    if (!user.isActive) {
      return {
        hasPermission: false,
        reason: 'User account is inactive',
      };
    }

    // Admin users can access everything
    if (user.role === UserRole.ADMIN) {
      return { hasPermission: true };
    }

    // Check resource-specific permissions
    if (resource && action) {
      const requiredPermission = this.getResourcePermission(resource, action);
      if (requiredPermission) {
        return this.hasPermission(user, requiredPermission);
      }
    }

    return { hasPermission: false, reason: 'Access denied' };
  }

  /**
   * Check if user can perform a specific action
   */
  public canPerformAction(
    user: User,
    resource: string,
    action: string,
    resourceId?: string
  ): PermissionCheck {
    return this.canAccessResource({ user, resource, action, resourceId });
  }

  /**
   * Get effective permissions for a user (role + user-specific)
   */
  public getEffectivePermissions(user: User): Permission[] {
    if (!user.isActive) {
      return [];
    }
    const rolePermissions = this.getRolePermissions(user.role);
    const userPermissions = user.permissions || [];
    const allPermissions = [...rolePermissions, ...userPermissions];
    // Use Array.from instead of spread operator to avoid potential issues
    const result = Array.from(new Set(allPermissions));
    return result;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Get permissions for a role
   */
  private getRolePermissions(role: UserRole): Permission[] {
    const rolePermissions: Record<UserRole, Permission[]> = {
      [UserRole.ADMIN]: [
        Permission.READ_USERS,
        Permission.WRITE_USERS,
        Permission.DELETE_USERS,
        Permission.READ_CONTENT,
        Permission.WRITE_CONTENT,
        Permission.DELETE_CONTENT,
        Permission.READ_SYSTEM,
        Permission.WRITE_SYSTEM,
        Permission.ADMIN_SYSTEM,
      ],
      [UserRole.MODERATOR]: [
        Permission.READ_USERS,
        Permission.READ_CONTENT,
        Permission.WRITE_CONTENT,
        Permission.DELETE_CONTENT,
      ],
      [UserRole.USER]: [Permission.READ_CONTENT, Permission.WRITE_CONTENT],
      [UserRole.GUEST]: [Permission.READ_CONTENT],
    };

    return rolePermissions[role] || [];
  }

  /**
   * Get permission required for resource action
   */
  private getResourcePermission(resource: string, action: string): Permission | null {
    const permissionMap: Record<string, Record<string, Permission>> = {
      users: {
        read: Permission.READ_USERS,
        write: Permission.WRITE_USERS,
        delete: Permission.DELETE_USERS,
      },
      content: {
        read: Permission.READ_CONTENT,
        write: Permission.WRITE_CONTENT,
        delete: Permission.DELETE_CONTENT,
      },
      system: {
        read: Permission.READ_SYSTEM,
        write: Permission.WRITE_SYSTEM,
        admin: Permission.ADMIN_SYSTEM,
      },
    };

    return permissionMap[resource]?.[action] || null;
  }
}

// Export singleton instance
export const authorizationService = AuthorizationService.getInstance();
