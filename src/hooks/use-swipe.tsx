
import * as React from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeOptions {
  threshold?: number; // minimum distance required for swipe detection
}

export function useSwipe(handlers: SwipeHandlers, options: SwipeOptions = {}) {
  const { threshold = 50 } = options;
  const touchStart = React.useRef<number | null>(null);
  
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  }, []);
  
  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current === null) {
        return;
      }
      
      const touchEnd = e.targetTouches[0].clientX;
      const diff = touchStart.current - touchEnd;
      
      // Left swipe
      if (diff > threshold && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
        touchStart.current = null; // Reset to prevent multiple triggers
      }
      // Right swipe
      else if (diff < -threshold && handlers.onSwipeRight) {
        handlers.onSwipeRight();
        touchStart.current = null; // Reset to prevent multiple triggers
      }
    },
    [handlers, threshold]
  );
  
  const handleTouchEnd = React.useCallback(() => {
    touchStart.current = null;
  }, []);
  
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
