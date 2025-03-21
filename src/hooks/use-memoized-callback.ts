import { useCallback, useRef } from 'react';

/**
 * A hook that returns a memoized callback that only changes if one of the dependencies changes.
 * Unlike useCallback, this hook ensures referential equality even if the callback itself changes.
 * 
 * @param callback The callback function to memoize
 * @param dependencies The dependencies array that determines when to update the callback
 * @returns A memoized version of the callback
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  // Store the callback in a ref to avoid unnecessary re-renders
  const callbackRef = useRef<T>(callback);
  
  // Update the ref whenever the callback changes
  callbackRef.current = callback;
  
  // Return a memoized version of the callback that uses the ref
  return useCallback(
    ((...args: any[]) => {
      try {
        // Ensure the callback exists before calling it
        if (typeof callbackRef.current !== 'function') {
          console.error('Expected a function in useMemoizedCallback, got:', typeof callbackRef.current);
          return undefined;
        }
        
        // Call the function with proper error handling
        return callbackRef.current(...args);
      } catch (error) {
        console.error('Error in memoized callback:', error);
        // Re-throw to maintain expected behavior
        throw error;
      }
    }) as T,
    dependencies || []
  );
}
