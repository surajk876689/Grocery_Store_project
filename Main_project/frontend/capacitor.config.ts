import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grocerystore.app',
  appName: 'Grocery Store',
  webDir: 'dist',
  // No server.url = loads bundled files from dist/ (works offline, no PC needed)
  // The app will call the backend API via VITE_API_URL set at build time
};

export default config;
