import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase the warning limit for chunk sizes
    chunkSizeWarningLimit: 1500, // in kB, increased from default 500
    rollupOptions: {
      output: {
        // Manual chunking configuration using a function
        manualChunks: (id) => {
          // Vendor chunks for node_modules with more granular splitting
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('node_modules/react/') || id.includes('node_modules/scheduler/')) {
              return 'vendor-react-core';
            }
            // React DOM
            if (id.includes('node_modules/react-dom/')) {
              return 'vendor-react-dom';
            }
            // React Router
            if (id.includes('node_modules/react-router')) {
              return 'vendor-router';
            }
            // React Query
            if (id.includes('node_modules/@tanstack/react-query')) {
              return 'vendor-query';
            }
            // Security libraries
            if (id.includes('node_modules/dompurify') || id.includes('node_modules/sanitize')) {
              return 'vendor-security';
            }
            // UI libraries
            if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/class-variance-authority')) {
              return 'vendor-ui-libs';
            }
            // Form libraries
            if (id.includes('node_modules/formik') || id.includes('node_modules/yup') || id.includes('node_modules/zod')) {
              return 'vendor-forms';
            }
            // Date libraries
            if (id.includes('node_modules/date-fns') || id.includes('node_modules/dayjs')) {
              return 'vendor-dates';
            }
            // All other node_modules
            return 'vendor-others';
          }
          
          // UI components
          if (id.includes('/components/ui/') || id.includes('/components/ThemeProvider')) {
            return 'ui';
          }
          
          // Notification components
          if (id.includes('/components/notifications/') || 
              id.includes('/hooks/use-notifications') || 
              id.includes('/hooks/use-virtualized-list')) {
            return 'notifications';
          }
          
          // Dashboard pages
          if (id.includes('/pages/Dashboard') || 
              id.includes('/pages/Suites') || 
              id.includes('/pages/Orders') || 
              id.includes('/pages/Beverages') || 
              id.includes('/pages/SuiteDetails') || 
              id.includes('/pages/SuiteAnalytics') || 
              id.includes('/pages/Communications') || 
              id.includes('/pages/Settings')) {
            return 'dashboard';
          }
          
          // Auth pages
          if (id.includes('/pages/Login') || 
              id.includes('/pages/Signup') || 
              id.includes('/pages/RoleSelect')) {
            return 'auth';
          }
          
          // Default chunk
          return null;
        }
      }
    }
  }
}));
