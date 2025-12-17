/**
 * IntersectionObserver Mock for Testing
 *
 * Provides a mock implementation of IntersectionObserver for testing environments
 * where the API is not available (like jsdom).
 */

// Mock implementation
class MockIntersectionObserver implements IntersectionObserver {
  private callback: IntersectionObserverCallback;
  public root: Element | Document | null = null;
  public rootMargin: string = '0px';
  public thresholds: ReadonlyArray<number> = [0];
  private observedElements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = options?.threshold
      ? Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold]
      : [0];
  }

  observe(target: Element): void {
    this.observedElements.add(target);

    // Simulate immediate intersection
    const entry: IntersectionObserverEntry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds:
        this.root && 'getBoundingClientRect' in this.root
          ? this.root.getBoundingClientRect()
          : null,
      isIntersecting: true,
      intersectionRatio: 1,
      target,
      time: Date.now(),
    } as IntersectionObserverEntry;

    // Call the callback with the mock entry
    this.callback([entry], this as unknown as IntersectionObserver);
  }

  unobserve(target: Element): void {
    this.observedElements.delete(target);
  }

  disconnect(): void {
    this.observedElements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Helper method for testing - trigger intersection
  triggerIntersection(target: Element, isIntersecting: boolean): void {
    if (!this.observedElements.has(target)) {
      return;
    }

    const entry: IntersectionObserverEntry = {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: isIntersecting ? target.getBoundingClientRect() : new DOMRect(),
      rootBounds:
        this.root && 'getBoundingClientRect' in this.root
          ? this.root.getBoundingClientRect()
          : null,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      target,
      time: Date.now(),
    } as IntersectionObserverEntry;

    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

// Mock IntersectionObserver globally
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Export for direct usage in tests
export { MockIntersectionObserver };
