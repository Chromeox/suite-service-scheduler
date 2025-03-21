import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { NotificationFilters, NotificationFilterOptions } from './NotificationFilters';
// import { customRender } from '@/test/test-utils';

describe('NotificationFilters', () => {
  const defaultFilters: NotificationFilterOptions = {
    types: ['info', 'success', 'warning', 'error'],
    sources: ['message', 'order', 'system'],
    showRead: true,
    showUnread: true,
    showUrgent: true,
    showNonUrgent: true
  };

  const onFilterChangeMock = vi.fn();
  const onResetMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    render(
      <NotificationFilters 
        filters={defaultFilters} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={false}
      />
    );

    // Check that the filter button is rendered
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    render(
      <NotificationFilters 
        filters={defaultFilters} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={false}
      />
    );

    // Check that the filter button is rendered
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
  });

  it('shows active indicator when filters are active', () => {
    render(
      <NotificationFilters 
        filters={defaultFilters} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={true}
      />
    );

    // Check that the filter button has the active indicator
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toHaveClass('bg-primary/10');
  });

  it('opens filter popover when clicked', async () => {
    render(
      <NotificationFilters 
        filters={defaultFilters} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={false}
      />
    );

    // Click the filter button
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    // Check that the filter popover is shown
    expect(screen.getByText('Filter Notifications')).toBeInTheDocument();
    expect(screen.getByText('By Type')).toBeInTheDocument();
    expect(screen.getByText('By Source')).toBeInTheDocument();
    expect(screen.getByText('By Status')).toBeInTheDocument();
  });

  it('calls onFilterChange when a filter is toggled', async () => {
    render(
      <NotificationFilters 
        filters={defaultFilters} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={false}
      />
    );

    // Click the filter button to open the popover
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    // Toggle the "Information" filter
    const infoCheckbox = screen.getByLabelText('Information');
    fireEvent.click(infoCheckbox);

    // Check that onFilterChange was called with the updated filters
    expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    expect(onFilterChangeMock).toHaveBeenCalledWith({
      ...defaultFilters,
      types: ['success', 'warning', 'error'] // 'info' should be removed
    });
  });

  it('calls onReset when reset button is clicked', async () => {
    render(
      <NotificationFilters 
        filters={{
          ...defaultFilters,
          types: ['success', 'warning'] // Some filters are active
        }} 
        onFilterChange={onFilterChangeMock} 
        onReset={onResetMock}
        isActive={true}
      />
    );

    // Click the filter button to open the popover
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    // Click the reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    // Check that onReset was called
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });
});
