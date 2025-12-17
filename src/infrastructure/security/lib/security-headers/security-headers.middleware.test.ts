/**
 * Security Headers Middleware Tests
 */

// Import Next.js server mocks from factory
import { MockNextRequest } from '@/shared/testing/mocks/nextjs';

// import { NextRequest } from 'next/server';
import {
  applySecurityHeaders,
  corsMiddleware,
  generateNonce,
  isSuspiciousRequest,
  reportCSPViolation,
  securityMiddleware,
  updateCSPWithNonce,
} from './security-headers.middleware';

describe('Security Headers Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applySecurityHeaders', () => {
    it('should apply security headers to response', () => {
      const mockResponse = {
        headers: {
          set: jest.fn(),
        },
      };

      applySecurityHeaders(mockResponse as any);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.any(String)
      );
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });
  });

  describe('generateNonce', () => {
    it('should generate a nonce string', () => {
      const nonce = generateNonce();
      expect(nonce).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should generate different nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('updateCSPWithNonce', () => {
    it('should add nonce to CSP', () => {
      const nonce = 'test-nonce';
      const updatedCSP = updateCSPWithNonce(nonce);

      expect(updatedCSP).toContain(`'nonce-${nonce}'`);
    });
  });

  describe('reportCSPViolation', () => {
    it('should log CSP violation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const violation = {
        blockedURI: 'http://example.com/script.js',
        documentURI: 'http://localhost:3000/',
        violatedDirective: 'script-src',
        effectiveDirective: 'script-src',
        originalPolicy: "script-src 'self'",
        referrer: 'http://localhost:3000/',
      };

      reportCSPViolation(violation);

      expect(consoleSpy).toHaveBeenCalledWith('CSP Violation:', violation);
      expect(consoleLogSpy).toHaveBeenCalledWith('CSP Violation Report:', expect.any(Object));

      consoleSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });
  });

  describe('isSuspiciousRequest', () => {
    it('should detect suspicious user agents', () => {
      const request = new MockNextRequest('http://localhost:3000/', {
        headers: {
          'user-agent': 'sqlmap/1.0',
        },
      });

      expect(isSuspiciousRequest(request as any)).toBe(true);
    });

    it('should detect suspicious origins', () => {
      const request = new MockNextRequest('http://localhost:3000/', {
        headers: {
          origin: 'http://localhost:8080',
        },
      });

      expect(isSuspiciousRequest(request as any)).toBe(true);
    });

    it('should allow normal requests', () => {
      const request = new MockNextRequest('http://localhost:3000/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          origin: 'http://localhost:3000',
        },
      });

      expect(isSuspiciousRequest(request as any)).toBe(false);
    });
  });

  describe('securityMiddleware', () => {
    it('should block suspicious requests', () => {
      const request = new MockNextRequest('http://localhost:3000/', {
        headers: {
          'user-agent': 'sqlmap/1.0',
        },
      });

      const response = securityMiddleware(request as any);
      expect(response.status).toBe(403);
    });

    it('should allow normal requests', () => {
      const request = new MockNextRequest('http://localhost:3000/', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const response = securityMiddleware(request as any);
      expect(response.status).toBe(200);
    });
  });

  describe('corsMiddleware', () => {
    it('should handle preflight requests', () => {
      const request = new MockNextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'Content-Type',
        },
      });

      const response = corsMiddleware(request as any);
      expect(response.status).toBe(200);
    });

    it('should handle actual requests', () => {
      const request = new MockNextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
        },
      });

      const response = corsMiddleware(request as any);
      expect(response.status).toBe(200);
    });
  });
});
