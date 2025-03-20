
import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("unknown");

  useEffect(() => {
    // Get initial network status
    const getInitialStatus = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        setConnectionType(status.connectionType);
      } catch (error) {
        // Fallback for web or when Capacitor isn't available
        setIsOnline(navigator.onLine);
      }
    };

    // Listen for network status changes
    const setupListeners = async () => {
      try {
        await Network.addListener("networkStatusChange", (status) => {
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);
        });
      } catch (error) {
        // Fallback for web
        window.addEventListener("online", () => setIsOnline(true));
        window.addEventListener("offline", () => setIsOnline(false));
      }
    };

    getInitialStatus();
    setupListeners();

    return () => {
      // Cleanup listeners
      const cleanup = async () => {
        try {
          await Network.removeAllListeners();
        } catch (error) {
          window.removeEventListener("online", () => setIsOnline(true));
          window.removeEventListener("offline", () => setIsOnline(false));
        }
      };
      cleanup();
    };
  }, []);

  return { isOnline, connectionType };
}
