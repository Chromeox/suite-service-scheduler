
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.suitesync',
  appName: 'SuiteSync',
  webDir: 'dist',
  server: {
    url: 'https://77261d08-0b07-4b38-a5d6-dece654a6301.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
