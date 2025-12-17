import { BuildMode } from '../common';

/**
 * Core application configuration interface
 */
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  isProd: boolean;
  isDev: boolean;
  mode: BuildMode;
  port: number;
}

/**
 * Defines the essential build paths for the application
 */
export interface BuildPaths {
  entry: string;
  output: string;
  public: string;
}
