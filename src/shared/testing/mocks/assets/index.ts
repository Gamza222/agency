/**
 * Assets Mocks
 *
 * Type: 📦 MANUAL
 *
 * This file exports all mocks for assets (images, SVGs) that need to be manually imported
 * and configured in tests.
 *
 * These are MANUAL mocks - they use named exports for components that need to be imported
 * and controlled in tests.
 */

// Export named components
export { mockImage } from './components/Image.mock';
export { mockSvg } from './components/Svg.mock';

// Export types
export type { mockImagePropsInterface, mockSvgPropsInterface } from './types/types';

// Re-export default exports for convenience
export { default as MockImageDefault } from './components/Image.mock';
export { default as MockSvgDefault } from './components/Svg.mock';
