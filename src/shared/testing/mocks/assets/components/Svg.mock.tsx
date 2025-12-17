import React from 'react';
import { mockSvgPropsInterface } from '../types/types';

/**
 * Mock SVG component for testing
 * Replaces SVG imports in tests
 */
export const mockSvg: React.FC<mockSvgPropsInterface> = ({ title, ...props }) => {
  return (
    <svg data-testid="svg-mock" {...props}>
      {title && <title>{title}</title>}
      <rect width="24" height="24" fill="currentColor" />
    </svg>
  );
};

// Default export for Jest moduleNameMapper (SVG files are imported as default)
export default mockSvg;
