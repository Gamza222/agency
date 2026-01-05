import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageLoadParams {
  containerRef: React.RefObject<HTMLDivElement>;
  onLoadComplete?: () => void;
}

/**
 * Hook to handle image loading logic
 * Checks for cached images and handles load events
 */
export const useImageLoad = ({
  containerRef,
  onLoadComplete,
}: UseImageLoadParams) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const didCompleteLoad = useRef(false);

  const handleImageLoad = useCallback(() => {
    if (didCompleteLoad.current) return;
    didCompleteLoad.current = true;
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

  // Check for cached image on mount
  useEffect(() => {
    const img = containerRef.current?.querySelector("img");
    if (img?.complete) {
      handleImageLoad();
    }
  }, [containerRef, handleImageLoad]);

  return {
    isLoaded,
    handleImageLoad,
  };
};
