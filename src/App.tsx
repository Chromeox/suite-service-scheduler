
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelect from "./pages/RoleSelect";
import Dashboard from "./pages/Dashboard";
import Suites from "./pages/Suites";
import SuiteDetails from "./pages/SuiteDetails";
import Orders from "./pages/Orders";
import DrinkOrders from "./pages/DrinkOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/dashboard/:role" element={<Dashboard />} />
            <Route path="/dashboard/:role/suites" element={<Suites />} />
            <Route path="/dashboard/:role/suites/:suiteId" element={<SuiteDetails />} />
            <Route path="/dashboard/:role/orders" element={<Orders />} />
            <Route path="/dashboard/:role/drink-orders" element={<DrinkOrders />} />
            <Route path="/dashboard/:role/communications" element={<Orders />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
