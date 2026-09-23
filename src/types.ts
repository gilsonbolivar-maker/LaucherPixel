export type IconShape = 'circle' | 'squircle' | 'rounded' | 'teardrop';
export type NavStyle = 'gestures' | '3-button';
export type GridSize = '4x4' | '4x5' | '5x5';
export type DevCategory = 'dev' | 'design' | 'system' | 'network' | 'tools';

export interface AppItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  gradient?: string;
  category: DevCategory;
  inDock?: boolean;
  isFavorite?: boolean;
  unreadCount?: number;
  componentId?: string;
  badge?: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  theme: 'dark' | 'light';
  accentColor: string;
  category?: 'code' | 'cyberpunk' | 'blueprint' | 'minimal' | 'nature';
}

export interface LauncherSettings {
  wallpaperId: string;
  customWallpaperUrl?: string;
  accentColor: string;
  gridSize: GridSize;
  iconShape: IconShape;
  navStyle: NavStyle;
  isDarkMode: boolean;
  showDockLabels: boolean;
  showDeviceFrame: boolean;
  soundEffects: boolean;
  dockApps: string[];
  homeApps: string[];
  // Dev specific toggles
  showGitBranchInStatus?: boolean;
  showLogcatOverlay?: boolean;
  adbWirelessEnabled?: boolean;
  devFocusMode?: boolean;
  terminalFont?: 'monospace' | 'jetbrains' | 'fira';
  activeBranch?: string;
  // Binder / Environment tabs
  activeEnvironmentId?: EnvironmentId;
  binderPosition?: 'right' | 'left';
  showBinderRings?: boolean;
  binderTabsCompact?: boolean;
}

export type EnvironmentId = 'dev' | 'nexo' | 'work' | 'personal' | 'ops';

export interface PhoneEnvironment {
  id: EnvironmentId;
  name: string;
  shortLabel: string;
  tagline: string;
  iconName: string;
  color: string;
  tabBg: string;
  tabBorder: string;
  tabTextColor: string;
  accentColor: string;
  wallpaperId?: string;
  appIds: string[];
  statusText: string;
  statusBadge: string;
  metricLabel: string;
  metricValue: string;
}

export interface NotificationItem {
  id: string;
  appId: string;
  appName: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type?: 'git' | 'ci' | 'adb' | 'server' | 'system';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  pinned?: boolean;
  tag?: 'RFC' | 'BUG' | 'API' | 'TODO' | 'SNIPPET';
}

export interface DevSnippet {
  id: string;
  title: string;
  language: 'kotlin' | 'typescript' | 'python' | 'json' | 'css';
  code: string;
  description: string;
}
