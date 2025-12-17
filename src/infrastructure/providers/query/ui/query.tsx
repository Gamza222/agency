'use client';

import { type FC, type PropsWithChildren } from 'react';

interface QueryProviderProps extends PropsWithChildren {
  // Add custom query client if needed
  client?: unknown;
}

const QueryProvider: FC<QueryProviderProps> = (props) => {
  const { children } = props;

  // For now, just return children without QueryClient to avoid build issues
  // TODO: Re-implement QueryClient properly for production
  return <>{children}</>;
};

export default QueryProvider;
