import { type FC, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../data/react-query/queryClient';

interface QueryProviderProps extends PropsWithChildren {
  // Add custom query client if needed
  client?: typeof queryClient;
}

const QueryProvider: FC<QueryProviderProps> = (props) => {
  const { children, client = queryClient } = props;

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
