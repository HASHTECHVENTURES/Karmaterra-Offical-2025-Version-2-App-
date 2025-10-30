import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hashtechventures.karmaterra',
  appName: 'KarmaTerra',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Enable cleartext traffic for local development
    cleartext: true
  },
  android: {
    // Enable edge-to-edge display for Android
    backgroundColor: '#ffffff',
    // Allow web view to handle display cutouts
    allowMixedContent: true
  },
  ios: {
    // iOS-specific configurations
    contentInset: 'always',
    // Handle safe areas properly
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#22c55e',
      // Ensure splash screen respects safe areas
      androidScaleType: 'CENTER_CROP',
      iosSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e',
      // Overlay webview for proper safe area handling
      overlay: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
