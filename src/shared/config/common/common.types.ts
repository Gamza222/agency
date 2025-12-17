/**
 * Common application types and configuration interfaces
 */

/** Represents the build mode for the application */
export enum BuildMode {
  Development = 'development',
  Production = 'production',
}

/** Defines the essential build paths for the application */
export interface BuildPaths {
  entry: string;
  output: string;
  public: string;
}

/** Core application configuration interface */
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  isProd: boolean;
  isDev: boolean;
  mode: BuildMode;
  port: number;
}
