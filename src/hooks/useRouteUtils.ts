
import { useLocation } from "react-router-dom";

export const useRouteUtils = () => {
  const location = useLocation();

  /**
   * Get the base path for dashboard routes based on role
   */
  const getBasePath = (role?: string) => {
    return role ? `/dashboard/${role}/` : '/dashboard/';
  };

  /**
   * Check if a route is active based on the current location
   */
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return { getBasePath, isActiveRoute };
};
