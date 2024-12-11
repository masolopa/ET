import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.duoc.asistencia',
  appName: 'Asistencia Duoc',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
