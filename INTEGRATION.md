# SuiteSync App Integration

This document outlines the progress and next steps for integrating the SuiteSync mobile app (suitesync-new) into the main web application (suite-service-scheduler).

## Progress So Far

### Completed Tasks

- ✅ Created a mobile directory in `suite-service-scheduler/src/pages/`
- ✅ Migrated Home, About, and Settings components from suitesync-new to the new mobile directory
- ✅ Updated App.tsx to include mobile routes
- ✅ Added a link to the mobile app from the main landing page
- ✅ Enhanced run_ios.sh script with better error handling and instructions
- ✅ Fixed infinite recursion issue in Supabase user profile management
- ✅ Created utility functions for safely fetching and updating user profiles
- ✅ Added a debug tool for testing profile management functionality
- ✅ Created a shared theme system for consistent styling across platforms
- ✅ Added platform utilities for cross-platform styling and behavior

### Key Files Created/Modified

- **Utility Functions**:
  - `/src/utils/supabase.ts`: Safe utility functions for user profile management
  - `/src/utils/supabase-functions.ts`: Type-safe wrappers for Supabase RPC functions
  - `/src/utils/platform-utils.ts`: Cross-platform styling and behavior utilities
  - `/src/styles/shared-theme.ts`: Shared theme system for consistent styling

- **Debug Tools**:
  - `/src/components/debug/ProfileDebugger.tsx`: Tool for testing profile management
  - `/src/utils/create_stored_procedure.sql`: SQL script for creating the stored procedure

- **Mobile Components**:
  - `/src/pages/mobile/Home.tsx`: Mobile home screen
  - `/src/pages/mobile/About.tsx`: Mobile about screen
  - `/src/pages/mobile/Settings.tsx`: Mobile settings screen

## Next Steps

### 1. Testing

- [ ] Test the integrated application on both web and mobile platforms
- [ ] Verify that user profile management works correctly across platforms
- [ ] Test navigation between web and mobile views
- [ ] Ensure the stored procedure is working correctly in Supabase

### 2. UI/UX Improvements

- [ ] Apply the shared theme to all components for consistent styling
- [ ] Implement responsive design for all screens
- [ ] Add loading states and error handling for better user experience
- [ ] Ensure accessibility standards are met across platforms

### 3. Additional Features

- [ ] Migrate any remaining components from suitesync-new
- [ ] Implement deep linking between web and mobile views
- [ ] Add offline support for mobile views
- [ ] Implement push notifications for mobile

### 4. Documentation

- [ ] Update README.md with new project structure
- [ ] Document the shared theme system and how to use it
- [ ] Create usage examples for platform-specific utilities
- [ ] Document the user profile management system

### 5. Performance Optimization

- [ ] Implement code splitting for better load times
- [ ] Optimize bundle size for mobile
- [ ] Add caching for frequently accessed data
- [ ] Implement lazy loading for non-critical components

## How to Run the Application

### Web

```bash
cd suite-service-scheduler
npm run dev
```

### iOS

```bash
cd suite-service-scheduler
./run_ios.sh
```

### Android

```bash
cd suite-service-scheduler
npm run android
```

## Database Setup

To set up the required database functions for user profile management:

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to the SQL Editor
3. Copy and paste the contents of `/src/utils/create_stored_procedure.sql`
4. Run the query to create the stored procedure

## Troubleshooting

### Infinite Recursion in User Profiles

If you encounter infinite recursion errors when accessing user profiles:

1. Ensure the stored procedure is correctly set up in Supabase
2. Use the utility functions in `src/utils/supabase.ts` for all user profile operations
3. Test with the ProfileDebugger component at `/debug/profile`

### Cross-Platform Styling Issues

If you encounter styling inconsistencies between platforms:

1. Use the shared theme from `src/styles/shared-theme.ts`
2. Use the platform utilities from `src/utils/platform-utils.ts` for platform-specific styling
3. Test on all target platforms (web, iOS, Android)
