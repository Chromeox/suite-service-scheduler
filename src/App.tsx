
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

// Eagerly loaded components
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Lazily loaded components with more specific chunks

// Auth components
const Login = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/Login"));
const Signup = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/Signup"));
const RoleSelect = lazy(() => import(/* webpackChunkName: "auth" */ "@/pages/RoleSelect"));

// Core dashboard
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard-core" */ "@/pages/Dashboard"));

// Suite management
const Suites = lazy(() => import(/* webpackChunkName: "suite-management" */ "@/pages/Suites"));
const SuiteDetails = lazy(() => import(/* webpackChunkName: "suite-management" */ "@/pages/SuiteDetails"));
const SuiteAnalytics = lazy(() => import(/* webpackChunkName: "suite-analytics" */ "@/pages/SuiteAnalytics"));

// Order management
const Orders = lazy(() => import(/* webpackChunkName: "order-management" */ "@/pages/Orders"));
const Beverages = lazy(() => import(/* webpackChunkName: "order-management" */ "@/pages/Beverages"));

// Communication and settings
const Communications = lazy(() => import(/* webpackChunkName: "communications" */ "@/pages/Communications"));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ "@/pages/Settings"));

// Import TanStack Query dependencies
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import UserStatusProvider
import { UserStatusProvider } from "@/providers/UserStatusProvider";
import { toast } from "@/hooks/use-toast";

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Wrap lazy components with Suspense
const wrapWithSuspense = (Component) => (
  <Suspense fallback={<LoadingComponent />}>
    <Component />
  </Suspense>
);

// Main router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: wrapWithSuspense(Login),
  },
  {
    path: "/signup",
    element: wrapWithSuspense(Signup),
  },
  {
    path: "/role-select",
    element: wrapWithSuspense(RoleSelect),
  },
  {
    path: "/dashboard/:role",
    element: wrapWithSuspense(Dashboard),
  },
  {
    path: "/dashboard/:role/suites",
    element: wrapWithSuspense(Suites),
  },
  {
    path: "/dashboard/:role/orders",
    element: wrapWithSuspense(Orders),
  },
  {
    path: "/dashboard/:role/beverages",
    element: wrapWithSuspense(Beverages),
  },
  {
    path: "/dashboard/:role/suites/:id",
    element: wrapWithSuspense(SuiteDetails),
  },
  {
    path: "/dashboard/:role/analytics",
    element: wrapWithSuspense(SuiteAnalytics),
  },
  {
    path: "/dashboard/:role/communications",
    element: wrapWithSuspense(Communications),
  },
  {
    path: "/dashboard/:role/settings",
    element: wrapWithSuspense(Settings),
  },
]);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
