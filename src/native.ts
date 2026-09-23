// Ponte com o app Android nativo (WebView). Só existe quando o launcher roda como APK.
export interface NativeApp {
  label: string;
  packageName: string;
  icon: string; // data URL (PNG)
}

interface PixelNexoBridge {
  getInstalledApps(): string;
  launchApp(packageName: string): void;
  openAppInfo(packageName: string): void;
  openHomeSettings(): void;
}

declare global {
  interface Window {
    PixelNexoAndroid?: PixelNexoBridge;
  }
}

export const isNativeLauncher = (): boolean =>
  typeof window !== 'undefined' && !!window.PixelNexoAndroid;

export const getNativeApps = (): NativeApp[] => {
  try {
    return window.PixelNexoAndroid ? JSON.parse(window.PixelNexoAndroid.getInstalledApps()) : [];
  } catch {
    return [];
  }
};

export const launchNativeApp = (packageName: string) => {
  window.PixelNexoAndroid?.launchApp(packageName);
};

export const openNativeAppInfo = (packageName: string) => {
  window.PixelNexoAndroid?.openAppInfo(packageName);
};
