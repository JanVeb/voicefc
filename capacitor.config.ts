import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.veble.voicefc',
  appName: 'voicefc',
  webDir: 'dist',
  server: {
    hostname: 'localhost',
    iosScheme: 'https',
    androidScheme: 'https'
  }
};

export default config;
