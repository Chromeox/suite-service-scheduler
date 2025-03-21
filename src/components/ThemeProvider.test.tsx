import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { act } from 'react-dom/test-utils';

describe('ThemeProvider', () => {
  // Mock localStorage
  let localStorageStore: Record<string, string> = {};
  const localStorageMock = {
    getItem: vi.fn((key: string) => localStorageStore[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      localStorageStore[key] = value;
    }),
    clear: vi.fn(() => {
      localStorageStore = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete localStorageStore[key];
    }),
  };

  // Mock matchMedia
  const matchMediaMock = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });
    
    // Clear mocks between tests
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageStore = {};
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toHaveTextContent('Test Child');
  });

  it('applies light theme by default', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    // Check that the light theme class is applied to the document
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark theme when specified', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    // Check that the dark theme class is applied to the document
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('saves theme preference to localStorage', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    // Light theme should be set in localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Clear mocks
    vi.clearAllMocks();
    
    // Render with dark theme
    render(
      <ThemeProvider defaultTheme="dark">
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    // Now dark theme should be set
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('uses system preference when theme is set to system', () => {
    // Mock system preference to dark
    matchMediaMock.mockImplementationOnce(() => ({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider defaultTheme="system">
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>
    );
    
    // System preference is dark, so dark theme should be applied
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
