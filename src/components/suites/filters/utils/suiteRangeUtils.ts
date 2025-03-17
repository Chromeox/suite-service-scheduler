
/**
 * Helper function to ensure min and max suite numbers are in the correct order
 */
export const getOrderedSuiteRange = (min: string, max: string) => {
  if (!min && !max) {
    return { min: "", max: "" };
  }
  
  const minNum = min ? parseInt(min) : undefined;
  const maxNum = max ? parseInt(max) : undefined;
  
  // If one value is empty, return the other as both min and max
  if (minNum && !maxNum) {
    return { min, max: min };
  }
  if (!minNum && maxNum) {
    return { min: max, max };
  }
  
  // If both exist, return them in the correct order
  if (minNum && maxNum && minNum > maxNum) {
    return { min: max, max: min };
  }
  
  return { min, max };
};
