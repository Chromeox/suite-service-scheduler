import React, { memo, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { NotificationType, NotificationSourceType } from '@/services/notifications/types';

export interface NotificationFilterOptions {
  types: NotificationType[];
  sources: NotificationSourceType[];
  showRead: boolean;
  showUnread: boolean;
  showUrgent: boolean;
  showNonUrgent: boolean;
}

interface NotificationFiltersProps {
  filters: NotificationFilterOptions;
  onFilterChange: (filters: NotificationFilterOptions) => void;
  onReset: () => void;
  isActive: boolean;
}

export const NotificationFilters = memo(function NotificationFilters({
  filters,
  onFilterChange,
  onReset,
  isActive
}: NotificationFiltersProps) {
  const handleTypeToggle = useCallback((type: NotificationType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    onFilterChange({
      ...filters,
      types: newTypes
    });
  }, [filters, onFilterChange]);

  const handleSourceToggle = useCallback((source: NotificationSourceType) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    
    onFilterChange({
      ...filters,
      sources: newSources
    });
  }, [filters, onFilterChange]);

  const handleReadToggle = useCallback((value: boolean) => {
    onFilterChange({
      ...filters,
      showRead: value
    });
  }, [filters, onFilterChange]);

  const handleUnreadToggle = useCallback((value: boolean) => {
    onFilterChange({
      ...filters,
      showUnread: value
    });
  }, [filters, onFilterChange]);

  const handleUrgentToggle = useCallback((value: boolean) => {
    onFilterChange({
      ...filters,
      showUrgent: value
    });
  }, [filters, onFilterChange]);

  const handleNonUrgentToggle = useCallback((value: boolean) => {
    onFilterChange({
      ...filters,
      showNonUrgent: value
    });
  }, [filters, onFilterChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1 ${isActive ? 'bg-primary/10' : ''}`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {isActive && (
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Notifications</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
          <Separator />
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">By Type</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-info" 
                  checked={filters.types.includes('info')}
                  onCheckedChange={() => handleTypeToggle('info')}
                />
                <Label htmlFor="filter-info" className="text-sm">Information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-success" 
                  checked={filters.types.includes('success')}
                  onCheckedChange={() => handleTypeToggle('success')}
                />
                <Label htmlFor="filter-success" className="text-sm">Success</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-warning" 
                  checked={filters.types.includes('warning')}
                  onCheckedChange={() => handleTypeToggle('warning')}
                />
                <Label htmlFor="filter-warning" className="text-sm">Warning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-error" 
                  checked={filters.types.includes('error')}
                  onCheckedChange={() => handleTypeToggle('error')}
                />
                <Label htmlFor="filter-error" className="text-sm">Error</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">By Source</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-message" 
                  checked={filters.sources.includes('message')}
                  onCheckedChange={() => handleSourceToggle('message')}
                />
                <Label htmlFor="filter-message" className="text-sm">Messages</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-order" 
                  checked={filters.sources.includes('order')}
                  onCheckedChange={() => handleSourceToggle('order')}
                />
                <Label htmlFor="filter-order" className="text-sm">Orders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-system" 
                  checked={filters.sources.includes('system')}
                  onCheckedChange={() => handleSourceToggle('system')}
                />
                <Label htmlFor="filter-system" className="text-sm">System</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">By Status</h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-read" 
                  checked={filters.showRead}
                  onCheckedChange={(checked) => handleReadToggle(!!checked)}
                />
                <Label htmlFor="filter-read" className="text-sm">Read</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-unread" 
                  checked={filters.showUnread}
                  onCheckedChange={(checked) => handleUnreadToggle(!!checked)}
                />
                <Label htmlFor="filter-unread" className="text-sm">Unread</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-urgent" 
                  checked={filters.showUrgent}
                  onCheckedChange={(checked) => handleUrgentToggle(!!checked)}
                />
                <Label htmlFor="filter-urgent" className="text-sm">Urgent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-non-urgent" 
                  checked={filters.showNonUrgent}
                  onCheckedChange={(checked) => handleNonUrgentToggle(!!checked)}
                />
                <Label htmlFor="filter-non-urgent" className="text-sm">Non-urgent</Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
