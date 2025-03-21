import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/ThemeProvider';

// Custom render function that includes the ThemeProvider
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { theme?: 'light' | 'dark' | 'system' }
) => {
  const { theme = 'light', ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider defaultTheme={theme}>
        {children}
      </ThemeProvider>
    ),
    ...renderOptions,
  });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
