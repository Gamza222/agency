// This file runs once before each test file is executed.

// Extends Jest's `expect` with custom matchers for the DOM, e.g., .toBeInTheDocument()
import '@testing-library/jest-dom';

// Activates all our browser-level API mocks (localStorage, IntersectionObserver, etc.)
import '../mocks/browser';

// Activates all our network-level API mocks (WebSocket, etc.)
import '../mocks/api';

// Activates all our external library mocks (Sentry, etc.)
import '../mocks/external';

// Initialize console mocks for clean test output
import '../mocks/browser/lib/console/console.mock';
