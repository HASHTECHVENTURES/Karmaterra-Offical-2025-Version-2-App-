import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hashtechventures.karmaterra',
  appName: 'KarmaTerra',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#22c55e'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e'
    }
  }
};

export default config;
