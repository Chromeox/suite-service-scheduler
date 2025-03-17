
/**
 * Helper function to ensure start suite is always lower than end suite
 * @param start - Start suite number/id
 * @param end - End suite number/id
 * @returns Object with ordered min and max values
 */
export const getOrderedSuiteRange = (start: string = "", end: string = "") => {
  if (!start && !end) return { min: "", max: "" };
  
  if (!start) return { min: "", max: end };
  if (!end) return { min: start, max: "" };
  
  // Compare suite numbers numerically if possible
  const startNum = parseInt(start);
  const endNum = parseInt(end);
  
  if (!isNaN(startNum) && !isNaN(endNum)) {
    return { 
      min: Math.min(startNum, endNum).toString(), 
      max: Math.max(startNum, endNum).toString() 
    };
  }
  
  // Fallback to string comparison
  return start.localeCompare(end) <= 0 
    ? { min: start, max: end }
    : { min: end, max: start };
};

/**
 * Format time to show only hour and minutes
 * @param dateString - ISO date string
 * @returns Formatted time string (HH:MM)
 */
export const formatDeliveryTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};
