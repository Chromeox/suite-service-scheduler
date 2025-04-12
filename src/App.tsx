
import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import global styles
import "@/styles/mobile.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider as ShadcnThemeProvider } from "@/components/ThemeProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SecurityProvider } from "@/components/security/SecurityProvider";

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

// Mobile app components
const MobileAppEntry = lazy(() => import(/* webpackChunkName: "mobile-entry" */ "@/pages/MobileAppEntry"));
const MobileHome = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Home"));
const MobileAbout = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/About"));
const MobileSettings = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Settings"));
const MobileAppointments = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Appointments"));
const MobileSchedule = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Schedule"));
const MobileClients = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Clients"));
const MobileAnalytics = lazy(() => import(/* webpackChunkName: "mobile" */ "@/pages/mobile/Analytics"));

// Debug components
const ProfileDebugger = lazy(() => import(/* webpackChunkName: "debug" */ "@/components/debug/ProfileDebugger"));

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

// Error component for error boundaries
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-700 mb-4">The application encountered an error while loading this component.</p>
      <details className="bg-white p-3 rounded border border-red-100">
        <summary className="cursor-pointer font-medium">Error details</summary>
        <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-50 rounded">
          {error.message}
        </pre>
      </details>
    </div>
  </div>
);

// Custom error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// Wrap lazy components with Suspense and ErrorBoundary
const wrapWithSuspense = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingComponent />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
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
  // Mobile app routes
  {
    path: "/mobile-app",
    element: wrapWithSuspense(MobileAppEntry),
  },
  {
    path: "/mobile",
    element: wrapWithSuspense(MobileHome),
  },
  {
    path: "/mobile/about",
    element: wrapWithSuspense(MobileAbout),
  },
  {
    path: "/mobile/settings",
    element: wrapWithSuspense(MobileSettings),
  },
  {
    path: "/mobile/appointments",
    element: wrapWithSuspense(MobileAppointments),
  },
  {
    path: "/mobile/schedule",
    element: wrapWithSuspense(MobileSchedule),
  },
  {
    path: "/mobile/clients",
    element: wrapWithSuspense(MobileClients),
  },
  {
    path: "/mobile/analytics",
    element: wrapWithSuspense(MobileAnalytics),
  },
  // Debug routes
  {
    path: "/debug/profile",
    element: wrapWithSuspense(ProfileDebugger),
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
    <SecurityProvider>
      <QueryClientProvider client={queryClient}>
        <ShadcnThemeProvider defaultTheme="system">
          <ThemeProvider>
            <UserStatusProvider>
              <ToastProvider>
                <RouterProvider router={router} />
                <Toaster />
              </ToastProvider>
            </UserStatusProvider>
          </ThemeProvider>
        </ShadcnThemeProvider>
      </QueryClientProvider>
    </SecurityProvider>
  );
}

export default App;
