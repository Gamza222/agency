export const getErrorMessage = (error?: Error): string => {
  if (!error) return 'An unexpected error occurred';
  return error.message || 'Something went wrong';
};

export const isChunkError = (error?: Error): boolean => {
  if (!error) return false;
  return (
    error.name === 'ChunkLoadError' ||
    error.message.includes('Loading chunk') ||
    error.message.includes('Loading CSS chunk')
  );
};

export const isNetworkError = (error?: Error): boolean => {
  if (!error) return false;
  return (
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed') ||
    error.name === 'NetworkError'
  );
};
