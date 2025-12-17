import React from 'react';
import { mockImagePropsInterface } from '../types/types';

/**
 * Mock Image component for testing
 * Replaces Next.js Image component in tests
 */
export const mockImage: React.FC<mockImagePropsInterface> = ({ alt, ...props }) => {
  return <img alt={alt} {...props} />;
};

// Default export for Jest moduleNameMapper (image files are imported as default)
export default mockImage;
