/**
 * Authentication Service
 *
 * Handles user authentication, token management, and session handling.
 * Universal authentication service for enterprise applications.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  AuthToken,
  LoginCredentials,
  Permission,
  RegisterData,
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  User,
  UserRole,
} from '../../types/security.types';
import { securityConfig } from '../security-config';

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export class AuthService {
  private users: User[] = [];
  private securityEvents: SecurityEvent[] = [];
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  public async register(data: RegisterData): Promise<{ user: User; tokens: AuthToken }> {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: UserRole.USER,
      permissions: this.getDefaultPermissions(UserRole.USER),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store user (in real app, this would be in database)
    this.users.push({ ...user, password: hashedPassword } as User);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Log security event
    this.logSecurityEvent({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId: user.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Registration',
      details: { action: 'user_registration' },
      severity: SecuritySeverity.LOW,
    });

    return { user, tokens };
  }

  /**
   * Login user
   */
  public async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthToken }> {
    const user = await this.findUserByEmail(credentials.email);
    if (!user) {
      this.logSecurityEvent({
        type: SecurityEventType.LOGIN_FAILED,
        ipAddress: '127.0.0.1',
        userAgent: 'Login Attempt',
        details: { email: credentials.email, reason: 'user_not_found' },
        severity: SecuritySeverity.MEDIUM,
      });
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.verifyPassword(credentials.password, user.password);
    if (!isValidPassword) {
      this.logSecurityEvent({
        type: SecurityEventType.LOGIN_FAILED,
        userId: user.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Login Attempt',
        details: { email: credentials.email, reason: 'invalid_password' },
        severity: SecuritySeverity.MEDIUM,
      });
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Log security event
    this.logSecurityEvent({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId: user.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Login Success',
      details: { action: 'user_login' },
      severity: SecuritySeverity.LOW,
    });

    return { user, tokens };
  }

  /**
   * Verify JWT token
   */
  public async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, securityConfig.auth.jwtSecret) as { userId: string };
      const user = await this.findUserById(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error('Invalid token');
      }

      return user;
    } catch (error) {
      this.logSecurityEvent({
        type: SecurityEventType.INVALID_TOKEN,
        ipAddress: '127.0.0.1',
        userAgent: 'Token Verification',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: SecuritySeverity.HIGH,
      });
      throw new Error('Invalid token');
    }
  }

  /**
   * Refresh access token
   */
  public async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const decoded = jwt.verify(refreshToken, securityConfig.auth.jwtSecret) as { userId: string };
      const user = await this.findUserById(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      this.logSecurityEvent({
        type: SecurityEventType.TOKEN_EXPIRED,
        ipAddress: '127.0.0.1',
        userAgent: 'Token Refresh',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: SecuritySeverity.MEDIUM,
      });
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get security events
   */
  public getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private findUserByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((user) => user.email === email) || null);
  }

  private findUserById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((user) => user.id === id) || null);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateTokens(user: User): AuthToken {
    const payload = { userId: user.id };
    const secret = securityConfig.auth.jwtSecret;

    // Use type assertion to fix JWT overload issues
    const accessToken = (
      jwt.sign as (payload: object, secret: string, options: { expiresIn: string }) => string
    )(payload, secret, {
      expiresIn: securityConfig.auth.jwtExpiresIn,
    });

    const refreshToken = (
      jwt.sign as (payload: object, secret: string, options: { expiresIn: string }) => string
    )(payload, secret, {
      expiresIn: securityConfig.auth.refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      tokenType: 'Bearer',
    };
  }

  private getDefaultPermissions(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        return [
          Permission.READ_USERS,
          Permission.WRITE_USERS,
          Permission.DELETE_USERS,
          Permission.READ_CONTENT,
          Permission.WRITE_CONTENT,
          Permission.DELETE_CONTENT,
          Permission.READ_SYSTEM,
          Permission.WRITE_SYSTEM,
          Permission.ADMIN_SYSTEM,
        ];
      case UserRole.MODERATOR:
        return [
          Permission.READ_USERS,
          Permission.READ_CONTENT,
          Permission.WRITE_CONTENT,
          Permission.DELETE_CONTENT,
        ];
      case UserRole.USER:
        return [Permission.READ_CONTENT, Permission.WRITE_CONTENT];
      case UserRole.GUEST:
        return [Permission.READ_CONTENT];
      default:
        return [];
    }
  }

  private logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.securityEvents.push(securityEvent);

    // In real app, send to security monitoring system
    // console.log('Security Event:', securityEvent);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
