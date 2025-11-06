import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hashtechventures.karmaterra',
  appName: 'KarmaTerra',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Enable cleartext traffic for local development
    cleartext: true,
    // Allow in-app navigation to trusted domains (product pages, CDN, APIs)
    allowNavigation: [
      // KarmaTerra site
      'karmaterra.in',
      '*.karmaterra.in',
      'www.karmaterra.in',
      // Supabase (api + storage buckets)
      'aagehceioskhyxvtolfz.supabase.co',
      'rputuujndhlocoitsbxn.supabase.co',
      '*.supabase.co',
      // CDNs and images
      'images.unsplash.com',
      '*.unsplash.com',
      'via.placeholder.com',
      // Social/external intents
      'chat.whatsapp.com',
      'wa.me'
    ]
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
          // Ensure splash screen respects safe areas and does not crop logo
          androidScaleType: 'CENTER_INSIDE',
      iosSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e',
      // Overlay webview for proper safe area handling
      overlay: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
      // Improved keyboard handling for Android
      accessBar: false
    }
  }
};

export default config;
