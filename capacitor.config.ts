import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shaikh.fivesalats',
  appName: '5 Salats',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
};

export default config;
