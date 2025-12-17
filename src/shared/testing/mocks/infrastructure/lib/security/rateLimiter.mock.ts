/**
 * Rate Limiter Service Mock for Testing
 *
 * Provides mock implementations for rate limiter service testing.
 * Simulates rate limiting, request tracking, and statistics.
 */

import { mockRateLimiterServiceInterface, mockRateLimitInfoInterface } from '../../types/types';

// Default mock rate limit info
const defaultMockRateLimitInfo: mockRateLimitInfoInterface = {
  count: 0,
  resetTime: Date.now() + 60000, // 1 minute from now
  limit: 100,
  remaining: 100,
  windowMs: 60000,
};

/**
 * Creates a mock rate limiter service for testing
 *
 * @param customData - Optional custom mock data to override defaults
 * @returns A mock rate limiter service object
 */
export const mockRateLimiterService = (
  customData: Partial<mockRateLimiterServiceInterface> = {}
): mockRateLimiterServiceInterface => {
  const mockService: mockRateLimiterServiceInterface = {
    checkRateLimit: jest.fn().mockReturnValue({
      allowed: true,
      info: defaultMockRateLimitInfo,
    }),
    getRateLimitInfo: jest.fn().mockReturnValue(defaultMockRateLimitInfo),
    resetRateLimit: jest.fn().mockReturnValue(true),
    generateKey: jest.fn().mockReturnValue('mock-key'),
    getAllActiveRateLimits: jest.fn().mockReturnValue([]),
    getStatistics: jest.fn().mockReturnValue({
      totalRequests: 0,
      blockedRequests: 0,
      activeLimits: 0,
    }),
    ...customData,
  };

  return mockService;
};

/**
 * Creates mock rate limit info for testing
 *
 * @param customData - Optional custom rate limit info to override defaults
 * @returns Mock rate limit info
 */
export const mockRateLimitInfo = (
  customData: Partial<mockRateLimitInfoInterface> = {}
): mockRateLimitInfoInterface => {
  return {
    ...defaultMockRateLimitInfo,
    ...customData,
  };
};

/**
 * Creates mock rate limit check result for testing
 *
 * @param allowed - Whether the request is allowed
 * @param customInfo - Optional custom rate limit info
 * @returns Mock rate limit check result
 */
export const mockRateLimitResult = (
  allowed: boolean = true,
  customInfo?: Partial<mockRateLimitInfoInterface>
) => {
  return {
    allowed,
    info: mockRateLimitInfo(customInfo),
  };
};

// Default mock instances
export const defaultRateLimiterServiceMock = mockRateLimiterService();
export const defaultRateLimitInfoMock = mockRateLimitInfo();
export const defaultRateLimitResultMock = mockRateLimitResult();
