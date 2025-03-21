import { useState, useEffect, useRef } from 'react';

/**
 * A hook that returns a debounced version of the provided value.
 * The debounced value will only update after the specified delay has passed
 * without any new updates to the original value.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cancel the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * A hook that returns a throttled version of the provided value.
 * The throttled value will update at most once per specified interval.
 * 
 * @param value The value to throttle
 * @param interval The minimum interval between updates in milliseconds
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;
    
    if (timeSinceLastUpdate >= interval) {
      // Update immediately if the interval has passed
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // Schedule an update at the end of the interval
      const timeUntilUpdate = interval - timeSinceLastUpdate;
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, timeUntilUpdate);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, interval]);
  
  return throttledValue;
}

/**
 * A hook that returns a debounced callback function.
 * The callback will only be executed after the specified delay has passed
 * without any new invocations.
 * 
 * @param callback The callback function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return (...args: Parameters<T>) => {
    // Clear the previous timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a new timeout
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}

/**
 * A hook that returns a throttled callback function.
 * The callback will be executed at most once per specified interval.
 * 
 * @param callback The callback function to throttle
 * @param interval The minimum interval between executions in milliseconds
 * @returns The throttled callback function
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const lastCalledRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCalledRef.current;
    
    // Clear any pending timeouts
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (timeSinceLastCall >= interval) {
      // Execute immediately if the interval has passed
      lastCalledRef.current = now;
      callbackRef.current(...args);
    } else {
      // Schedule execution at the end of the interval
      const timeUntilCall = interval - timeSinceLastCall;
      timerRef.current = setTimeout(() => {
        lastCalledRef.current = Date.now();
        callbackRef.current(...args);
        timerRef.current = null;
      }, timeUntilCall);
    }
  };
}
