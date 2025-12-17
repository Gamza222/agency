/**
 * Security Headers Middleware
 *
 * Middleware for setting security headers in Next.js applications.
 * Universal security headers middleware for enterprise applications.
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityConfig } from '../security-config';

// ============================================================================
// SECURITY HEADERS MIDDLEWARE
// ============================================================================

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = securityConfig.headers;

  // Apply all security headers
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value as string);
    }
  });

  return response;
}

/**
 * Generate CSP nonce for inline scripts/styles
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Update CSP with nonce
 */
export function updateCSPWithNonce(nonce: string): string {
  const baseCSP = securityConfig.headers['Content-Security-Policy'];

  if (!baseCSP) {
    return '';
  }

  // Add nonce to script-src and style-src
  return baseCSP
    .replace("script-src 'self'", `script-src 'self' 'nonce-${nonce}'`)
    .replace("style-src 'self'", `style-src 'self' 'nonce-${nonce}'`);
}

/**
 * Report CSP violations
 */
export function reportCSPViolation(violation: unknown): void {
  // 1. Log the violation
  console.error('CSP Violation:', violation);

  // 2. Log it to your security monitoring system
  // eslint-disable-next-line no-console
  console.log('CSP Violation Report:', {
    timestamp: new Date().toISOString(),
    blockedURI: (violation as { blockedURI?: string })?.blockedURI,
    documentURI: (violation as { documentURI?: string })?.documentURI,
    violatedDirective: (violation as { violatedDirective?: string })?.violatedDirective,
    effectiveDirective: (violation as { effectiveDirective?: string })?.effectiveDirective,
    originalPolicy: (violation as { originalPolicy?: string })?.originalPolicy,
    referrer: (violation as { referrer?: string })?.referrer,
    sourceFile: (violation as { sourceFile?: string })?.sourceFile,
    lineNumber: (violation as { lineNumber?: number })?.lineNumber,
    columnNumber: (violation as { columnNumber?: number })?.columnNumber,
  });

  // 3. Send alerts for critical violations (in production)
}

/**
 * Check if request is suspicious
 */
export function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';

  // Block requests with suspicious user agents
  const suspiciousUserAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'burp'];

  const isSuspiciousUA = suspiciousUserAgents.some((ua) =>
    userAgent.toLowerCase().includes(ua.toLowerCase())
  );

  if (isSuspiciousUA) {
    return true;
  }

  // Block requests from suspicious origins
  const suspiciousOrigins = ['localhost:8080', '127.0.0.1:8080', '0.0.0.0:8080'];

  const isSuspiciousOrigin = suspiciousOrigins.some(
    (susOrigin) => origin.includes(susOrigin) || referer.includes(susOrigin)
  );

  return isSuspiciousOrigin;
}

/**
 * Main security middleware
 */
export function securityMiddleware(request: NextRequest): NextResponse {
  // Check for suspicious requests
  if (isSuspiciousRequest(request)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Create response
  const response = NextResponse.next();

  // Apply security headers
  return applySecurityHeaders(response);
}

/**
 * CORS middleware
 */
export function corsMiddleware(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  const method = request.headers.get('access-control-request-method');
  const headers = request.headers.get('access-control-request-headers');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });

    if (origin && securityConfig.cors.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    if (method) {
      response.headers.set('Access-Control-Allow-Methods', method);
    }

    if (headers) {
      response.headers.set('Access-Control-Allow-Headers', headers);
    }

    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  // Handle actual requests
  const response = NextResponse.next();

  if (origin && securityConfig.cors.origin.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', securityConfig.cors.methods.join(', '));
  response.headers.set(
    'Access-Control-Allow-Headers',
    securityConfig.cors.allowedHeaders.join(', ')
  );
  response.headers.set(
    'Access-Control-Expose-Headers',
    securityConfig.cors.exposedHeaders.join(', ')
  );
  response.headers.set('Access-Control-Max-Age', securityConfig.cors.maxAge.toString());

  return response;
}
