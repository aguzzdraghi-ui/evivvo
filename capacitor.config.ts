import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evivvo.app',
  appName: 'Evivvo',
  webDir: 'out',
  
  // Server configuration for development
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Uncomment for live reload during development
    // url: 'http://YOUR_LOCAL_IP:3000',
    // cleartext: true
  },
  
  // iOS specific configuration
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#FAFBFF',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
  },
  
  // Android specific configuration
  android: {
    backgroundColor: '#FAFBFF',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set to true for development
  },
  
  // Plugins configuration
  plugins: {
    // Status bar configuration
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FAFBFF',
    },
    
    // Splash screen configuration
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FAFBFF',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    
    // Keyboard configuration
    Keyboard: {
      resize: 'body',
      style: 'LIGHT',
      resizeOnFullScreen: true,
    },
    
    // Push notifications
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    
    // Local notifications
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#4F7BF7',
      sound: 'notification.wav',
    },
    
    // Camera
    Camera: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;
