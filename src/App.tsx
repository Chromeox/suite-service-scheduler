
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import RoleSelect from "@/pages/RoleSelect";
import Dashboard from "@/pages/Dashboard";
import Suites from "@/pages/Suites";
import Orders from "@/pages/Orders";
import Beverages from "@/pages/Beverages";
import SuiteDetails from "@/pages/SuiteDetails";
import SuiteAnalytics from "@/pages/SuiteAnalytics";
import Communications from "@/pages/Communications";
import NotFound from "@/pages/NotFound";
import { ToastProvider } from "@/components/ui/toast";
import Settings from "@/pages/Settings";
import { Toaster } from "@/components/ui/toaster";

// Main router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/role-select",
    element: <RoleSelect />,
  },
  {
    path: "/dashboard/:role",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/:role/suites",
    element: <Suites />,
  },
  {
    path: "/dashboard/:role/orders",
    element: <Orders />,
  },
  {
    path: "/dashboard/:role/beverages",
    element: <Beverages />,
  },
  {
    path: "/dashboard/:role/suites/:id",
    element: <SuiteDetails />,
  },
  {
    path: "/dashboard/:role/analytics",
    element: <SuiteAnalytics />,
  },
  {
    path: "/dashboard/:role/communications",
    element: <Communications />,
  },
  {
    path: "/dashboard/:role/settings",
    element: <Settings />,
  },
]);

function App() {
  return (
    <>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
      <Toaster />
    </>
  );
}

export default App;
