// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for importing from outside the app directory
config.watchFolders = [path.resolve(__dirname, '..')];

// Handle various file extensions
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

// Ensure proper asset handling
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];

module.exports = config;
