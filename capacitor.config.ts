import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4c97fc617ad349448102733b7bfaebf7',
  appName: 'ReforestWallet',
  webDir: 'dist',
  server: {
    url: 'https://4c97fc61-7ad3-4944-8102-733b7bfaebf7.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#000000',
    preferredContentMode: 'mobile',
  },
  android: {
    backgroundColor: '#000000',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      launchAutoHide: true,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
  },
};

export default config;
