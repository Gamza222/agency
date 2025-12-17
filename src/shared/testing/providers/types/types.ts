import type { NextRouter } from 'next/router';
import type { ReactNode } from 'react';

export interface RouterWrapperPropsInterface {
  children: ReactNode;
  router?: Partial<NextRouter>;
}
