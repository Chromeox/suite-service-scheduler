
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export function useHapticFeedback() {
  // Function to trigger haptic feedback based on impact style
  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // Vibration with different patterns
  const vibrate = async (pattern: number[] = [100, 50, 100]) => {
    try {
      await Haptics.vibrate({ duration: 1000 });
    } catch (error) {
      console.log("Vibration not available");
    }
  };

  // Success feedback
  const successFeedback = async () => {
    try {
      await Haptics.notification({ type: "SUCCESS" });
    } catch (error) {
      console.log("Notification haptics not available");
    }
  };

  // Warning feedback
  const warningFeedback = async () => {
    try {
      await Haptics.notification({ type: "WARNING" });
    } catch (error) {
      console.log("Notification haptics not available");
    }
  };

  // Error feedback
  const errorFeedback = async () => {
    try {
      await Haptics.notification({ type: "ERROR" });
    } catch (error) {
      console.log("Notification haptics not available");
    }
  };

  return {
    triggerHaptic,
    vibrate,
    successFeedback,
    warningFeedback,
    errorFeedback
  };
}
