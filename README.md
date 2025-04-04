# SuiteSync - Consolidated Service Scheduling Application

## Project Overview

SuiteSync is a comprehensive service scheduling solution designed to streamline appointment management for service-based businesses. This repository contains the consolidated version of SuiteSync, which merges two previously separate applications:

1. **suitesync-new**: A React Native mobile app built with Expo
2. **suite-service-scheduler**: A web application built with Vite, React, TypeScript, and Shadcn UI

## Technologies Used

This project leverages a modern tech stack for cross-platform development:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI (based on Radix UI)
- **Styling**: Tailwind CSS
- **Mobile Support**: Capacitor for native iOS/Android capabilities
- **State Management**: React Context and TanStack Query
- **Routing**: React Router
- **Backend Integration**: Supabase

## Project Structure

The project follows a modular structure with clear separation of concerns:

```
suite-service-scheduler/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── mobile/         # Mobile-specific components
│   │   └── ui/             # Shadcn UI components
│   ├── pages/              # Application pages
│   │   ├── mobile/         # Mobile-specific pages
│   │   └── ...             # Web application pages
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # Context providers
│   ├── integrations/       # Third-party integrations
│   └── App.tsx            # Main application component
├── ios/                    # iOS native project (Capacitor)
├── android/                # Android native project (Capacitor)
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- For iOS development: macOS with Xcode 14+
- For Android development: Android Studio with SDK tools

### Installation

```sh
# Clone the repository
git clone <YOUR_REPO_URL>

# Navigate to the project directory
cd suite-service-scheduler

# Install dependencies
npm install
```

### Running the Application

#### Web Version

```sh
# Start the development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

#### iOS Version

```sh
# Build and prepare the app for iOS
./run_ios.sh
```

This will:
1. Build the web app
2. Sync with Capacitor
3. Open the project in Xcode

From Xcode, select a simulator and run the app.

#### Android Version

```sh
# Build and run on Android
npm run android
```

## Mobile App Access

The mobile version of the app can be accessed in several ways:

1. **Within the web app**: Click on "Open Mobile App" on the landing page
2. **Direct URL**: Navigate to `/mobile-app` or `/mobile` routes
3. **Native apps**: Use the iOS or Android apps built with Capacitor

## Development Notes

### Platform Detection

The application includes utilities for platform detection in `src/utils/platform.ts`. This allows for responsive design and platform-specific behavior.

### Responsive Design

The mobile interface uses a responsive container that adapts to different screen sizes. On desktop browsers, the mobile view is displayed in a phone-like container for better testing and preview.

## Deployment

The application can be deployed as:

1. A web application on any static hosting service
2. Native iOS and Android apps through the App Store and Google Play

## Contributing

When contributing to this project, please follow these guidelines:

- Use TypeScript for all code
- Follow the existing code style and structure
- Write functional components with proper TypeScript interfaces
- Test on both web and mobile platforms before submitting changes

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.
