import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualizedListOptions {
  itemHeight: number;
  overscan?: number;
  initialIndex?: number;
}

/**
 * A hook for virtualizing lists to improve performance when rendering large datasets.
 * Only renders items that are visible within the viewport plus an overscan buffer.
 * 
 * @param totalItems Total number of items in the list
 * @param containerRef Reference to the scrollable container element
 * @param options Configuration options for the virtualized list
 * @returns Object containing visible item indices and scroll handlers
 */
export function useVirtualizedList(
  totalItems: number,
  containerRef: React.RefObject<HTMLElement>,
  options: VirtualizedListOptions
) {
  const { itemHeight, overscan = 3, initialIndex = 0 } = options;
  
  // Track scroll position and container dimensions
  const [scrollTop, setScrollTop] = useState(initialIndex * itemHeight);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Calculate visible item range with bounds checking
  const visibleRange = useMemo(() => {
    // Default range if container is not yet measured
    if (containerHeight === 0) return { start: 0, end: Math.min(10, Math.max(0, totalItems - 1)) };
    
    // Ensure positive values and apply overscan
    const safeItemHeight = Math.max(1, itemHeight); // Prevent division by zero
    const safeScrollTop = Math.max(0, scrollTop);
    const safeOverscan = Math.max(0, overscan);
    
    // Calculate indices with bounds checking
    const startIndex = Math.max(0, Math.floor(safeScrollTop / safeItemHeight) - safeOverscan);
    const endIndex = Math.min(
      Math.max(0, totalItems - 1),
      Math.ceil((safeScrollTop + containerHeight) / safeItemHeight) + safeOverscan
    );
    
    return { start: startIndex, end: endIndex };
  }, [scrollTop, containerHeight, itemHeight, totalItems, overscan]);
  
  // Calculate total list height to maintain proper scrollbar dimensions
  const totalHeight = totalItems * itemHeight;
  
  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };
  
  // Update container height when it changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    
    // Initial height measurement
    updateHeight();
    
    // Set up resize observer to track container size changes
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(containerRef.current);
    
    // Set up scroll listener
    containerRef.current.addEventListener('scroll', handleScroll);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);
  
  // Scroll to a specific item with bounds checking
  const scrollToItem = (index: number, behavior: ScrollBehavior = 'auto') => {
    if (!containerRef.current) return;
    
    // Validate index is within bounds
    const safeIndex = Math.max(0, Math.min(totalItems - 1, index));
    
    // Prevent negative scroll positions
    const safeScrollTop = Math.max(0, safeIndex * Math.max(1, itemHeight));
    
    try {
      containerRef.current.scrollTo({
        top: safeScrollTop,
        behavior
      });
    } catch (error) {
      console.error('Error scrolling to item:', error);
      // Fallback to a simpler method if scrollTo fails
      if (containerRef.current) {
        containerRef.current.scrollTop = safeScrollTop;
      }
    }
  };
  
  // Get visible items with safety checks
  const visibleItems = useMemo(() => {
    // Handle edge case where end might be less than start (shouldn't happen with proper bounds checking)
    if (visibleRange.end < visibleRange.start) return [];
    
    const length = visibleRange.end - visibleRange.start + 1;
    
    // Ensure we don't create an array with negative or excessive length
    if (length <= 0 || length > 1000) {
      console.warn(`Invalid virtualized list range: ${visibleRange.start} to ${visibleRange.end}`);
      return [];
    }
    
    try {
      return Array.from(
        { length },
        (_, i) => visibleRange.start + i
      );
    } catch (error) {
      console.error('Error creating virtualized items array:', error);
      return [];
    }
  }, [visibleRange]);
  
  return {
    visibleItems,
    visibleRange,
    totalHeight,
    scrollToItem,
    itemOffsets: visibleItems.map(index => index * itemHeight)
  };
}
