// Development tools for enhanced developer experience
// Only available in development mode

export { DebugPanel } from './debug-panel';
export { PerformanceMonitor } from './performance-monitor';
export { componentGenerator } from './generators/component-generator';
export { fsdValidator } from './generators/fsd-validator';

// Development mode check
import { envConfig } from '../../../../config/env';
export const isDevelopment = envConfig.isDevelopment;
