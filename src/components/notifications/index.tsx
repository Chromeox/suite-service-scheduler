import React, { lazy, Suspense } from 'react';

// Lazy load notification components
const NotificationsDialog = lazy(() => import('./NotificationsDialog').then(module => ({ default: module.NotificationsDialog })));
const NotificationFilters = lazy(() => import('./NotificationFilters').then(module => ({ default: module.NotificationFilters })));
const NotificationBadge = lazy(() => import('./NotificationBadge').then(module => ({ default: module.NotificationBadge })));

// Loading fallback component
const NotificationLoadingFallback = () => (
  <div className="inline-flex items-center justify-center">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  </div>
);

// Wrapped components with Suspense
export const LazyNotificationsDialog = (props) => (
  <Suspense fallback={<NotificationLoadingFallback />}>
    <NotificationsDialog {...props} />
  </Suspense>
);

export const LazyNotificationFilters = (props) => (
  <Suspense fallback={<NotificationLoadingFallback />}>
    <NotificationFilters {...props} />
  </Suspense>
);

export const LazyNotificationBadge = (props) => (
  <Suspense fallback={<NotificationLoadingFallback />}>
    <NotificationBadge {...props} />
  </Suspense>
);

// Re-export for backward compatibility
export { NotificationsDialog, NotificationFilters, NotificationBadge };
