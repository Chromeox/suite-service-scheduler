
import * as React from "react";

export function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  
  React.useEffect(() => {
    // This only applies to mobile devices with Capacitor
    if (typeof window !== 'undefined' && 'Capacitor' in window) {
      const handleKeyboardShow = () => {
        setIsKeyboardVisible(true);
      };
      
      const handleKeyboardHide = () => {
        setIsKeyboardVisible(false);
      };
      
      // Add event listeners
      window.addEventListener('keyboardWillShow', handleKeyboardShow);
      window.addEventListener('keyboardDidShow', handleKeyboardShow);
      window.addEventListener('keyboardWillHide', handleKeyboardHide);
      window.addEventListener('keyboardDidHide', handleKeyboardHide);
      
      return () => {
        // Clean up event listeners
        window.removeEventListener('keyboardWillShow', handleKeyboardShow);
        window.removeEventListener('keyboardDidShow', handleKeyboardShow);
        window.removeEventListener('keyboardWillHide', handleKeyboardHide);
        window.removeEventListener('keyboardDidHide', handleKeyboardHide);
      };
    }
    
    // Fallback for browsers - detect input focus
    const handleFocus = (e: Event) => {
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        setIsKeyboardVisible(true);
      }
    };
    
    const handleBlur = (e: Event) => {
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        setIsKeyboardVisible(false);
      }
    };
    
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);
  
  // Scroll to input when focused
  const scrollToInput = React.useCallback((element: HTMLElement) => {
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, []);
  
  return { isKeyboardVisible, scrollToInput };
}
