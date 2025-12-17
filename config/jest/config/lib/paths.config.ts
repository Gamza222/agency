import type { Config } from '@jest/types';
import { resolve } from 'path';

export const pathsConfig: Config.InitialOptions = {
  rootDir: resolve(__dirname, '../../../../'),
  modulePaths: [resolve(__dirname, '../../../../src')],
  moduleDirectories: ['node_modules', 'src'],
};
