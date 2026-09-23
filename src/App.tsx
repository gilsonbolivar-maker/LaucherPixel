import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Code,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  ArrowLeft,
  X,
  Download,
} from 'lucide-react';

import {
  AppItem,
  LauncherSettings,
  NotificationItem,
  WallpaperOption,
  EnvironmentId,
  PhoneEnvironment,
} from './types';

import {
  INITIAL_APPS,
  WALLPAPERS,
  DEFAULT_SETTINGS,
  ENVIRONMENTS,
} from './data/launcherData';

import { StatusBar } from './components/StatusBar';
import { QuickSettingsShade } from './components/QuickSettingsShade';
import { HomeScreen } from './components/HomeScreen';
import { Dock } from './components/Dock';
import { NavigationBar } from './components/NavigationBar';
import { AppDrawer } from './components/AppDrawer';
import { RecentsOverview } from './components/RecentsOverview';
import { BinderTabs } from './components/BinderTabs';
import { PWAInstallButton } from './components/PWAInstallButton';
import { InstallGuideModal } from './components/InstallGuideModal';

// Sub Apps
import { CalculatorApp } from './components/apps/CalculatorApp';
import { PhoneApp } from './components/apps/PhoneApp';
import { MessagesApp } from './components/apps/MessagesApp';
import { CameraApp } from './components/apps/CameraApp';
import { ClockApp } from './components/apps/ClockApp';
import { NotesApp } from './components/apps/NotesApp';
import { GalleryApp } from './components/apps/GalleryApp';
import { BrowserApp } from './components/apps/BrowserApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { AndroidDevApp } from './components/apps/AndroidDevApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { CodeEditorApp } from './components/apps/CodeEditorApp';
import { RestClientApp } from './components/apps/RestClientApp';
import { PaletteStudioApp } from './components/apps/PaletteStudioApp';
import { GitTrackerApp } from './components/apps/GitTrackerApp';
import { SystemProfilerApp } from './components/apps/SystemProfilerApp';
import { GitHubCLIApp } from './components/apps/GitHubCLIApp';
import { GDriveCLIApp } from './components/apps/GDriveCLIApp';
import { PixelNexoApp } from './components/apps/PixelNexoApp';
import { PixelNexoLogo } from './components/PixelNexoLogo';

import { playHapticClick } from './utils/audio';
import { isNativeLauncher, getNativeApps, NativeApp } from './native';

export default function App() {
  // Load settings
  const [settings, setSettings] = useState<LauncherSettings>(() => {
    try {
      const saved = localStorage.getItem('android_launcher_settings');
      const loaded: LauncherSettings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
      // No APK o launcher ocupa a tela inteira: sem moldura de smartphone simulada
      return isNativeLauncher() ? { ...loaded, showDeviceFrame: false } : loaded;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      appId: 'git_tracker',
      appName: 'DevOS Git Monitor',
      title: 'Commit 98f02ac integrado',
      body: 'feat: Material You widgets & developer telemetry deployados com sucesso.',
      time: 'Agora',
      type: 'git',
      read: false,
    },
    {
      id: '2',
      appId: 'system_monitor',
      appName: 'DevOS CI/CD',
      title: 'Pipeline #142 (main) Passed',
      body: '342 testes unitários passaram. APK release gerado em 4.1s.',
      time: '12m atrás',
      type: 'ci',
      read: false,
    },
    {
      id: '3',
      appId: 'terminal',
      appName: 'ADB Wireless Debugger',
      title: 'Depuração sem fio conectada',
      body: 'Conectado a 192.168.1.104:5555. Daemon de depuração ativo.',
      time: '25m atrás',
      type: 'adb',
      read: false,
    },
  ]);

  // UI overlays state
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);
  const [recentApps, setRecentApps] = useState<AppItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);

  // Apps reais instalados no celular (somente no APK)
  const [nativeApps, setNativeApps] = useState<NativeApp[]>([]);
  useEffect(() => {
    if (!isNativeLauncher()) return;
    const refresh = () => setNativeApps(getNativeApps());
    refresh();
    window.addEventListener('pixelnexo:apps-changed', refresh);
    return () => window.removeEventListener('pixelnexo:apps-changed', refresh);
  }, []);

  // Gallery captured photos
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Browser auto search query
  const [initialBrowserQuery, setInitialBrowserQuery] = useState('');

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('android_launcher_settings', JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  // Current wallpaper
  const activeWallpaper =
    WALLPAPERS.find((w) => w.id === settings.wallpaperId) || WALLPAPERS[0];

  // Open an app
  const handleLaunchApp = (app: AppItem) => {
    playHapticClick(settings.soundEffects);
    setActiveApp(app);
    setIsDrawerOpen(false);
    setIsQuickSettingsOpen(false);
    setIsRecentsOpen(false);

    // Track in recents
    setRecentApps((prev) => {
      const filtered = prev.filter((a) => a.id !== app.id);
      return [app, ...filtered.slice(0, 7)];
    });
  };

  // Close app (Go Home)
  const handleGoHome = () => {
    setActiveApp(null);
    setIsDrawerOpen(false);
    setIsQuickSettingsOpen(false);
    setIsRecentsOpen(false);
  };

  // Handle Back
  const handleBack = () => {
    if (isQuickSettingsOpen) {
      setIsQuickSettingsOpen(false);
    } else if (isRecentsOpen) {
      setIsRecentsOpen(false);
    } else if (isDrawerOpen) {
      setIsDrawerOpen(false);
    } else if (activeApp) {
      setActiveApp(null);
    }
  };

  // Botões físicos/gestos do Android (enviados pelo MainActivity)
  useEffect(() => {
    const onBack = () => handleBack();
    const onHome = () => handleGoHome();
    window.addEventListener('pixelnexo:back', onBack);
    window.addEventListener('pixelnexo:home', onHome);
    return () => {
      window.removeEventListener('pixelnexo:back', onBack);
      window.removeEventListener('pixelnexo:home', onHome);
    };
  });

  // Handle Recents
  const handleRecents = () => {
    setIsRecentsOpen(true);
    setIsDrawerOpen(false);
    setIsQuickSettingsOpen(false);
  };

  const handleUpdateSettings = (newSettings: Partial<LauncherSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Binder Environment State
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [envToast, setEnvToast] = useState<{
    name: string;
    color: string;
    shortLabel: string;
    tagline: string;
  } | null>(null);

  const activeEnvId = settings.activeEnvironmentId || 'nexo';
  const activeEnvironment =
    ENVIRONMENTS.find((e) => e.id === activeEnvId) || ENVIRONMENTS[0];

  const handleSwitchEnvironment = (envId: EnvironmentId) => {
    const env = ENVIRONMENTS.find((e) => e.id === envId);
    if (!env) return;

    handleUpdateSettings({
      activeEnvironmentId: envId,
      accentColor: env.accentColor,
      wallpaperId: env.wallpaperId || settings.wallpaperId,
    });

    setEnvToast({
      name: env.name,
      color: env.color,
      shortLabel: env.shortLabel,
      tagline: env.tagline,
    });

    // If an app is active, return home to that environment's page
    if (activeApp) {
      setActiveApp(null);
    }

    setTimeout(() => {
      setEnvToast((prev) => (prev?.name === env.name ? null : prev));
    }, 2400);
  };

  // App filter lists
  const dockApps = INITIAL_APPS.filter((app) =>
    settings.dockApps.includes(app.id)
  );
  // Filter home apps based on the active binder environment!
  const homeApps = INITIAL_APPS.filter((app) =>
    activeEnvironment.appIds.includes(app.id)
  );

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 opacity-20 filter blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${settings.accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* Top Desktop Controls Bar (When frame is enabled) */}
      {settings.showDeviceFrame && (
        <header className="hidden md:flex items-center justify-between w-full max-w-4xl px-6 py-2.5 mb-2 z-30 bg-[#1f0733]/80 backdrop-blur-md border border-[#8022B8]/40 rounded-full shadow-[0_4px_25px_rgba(31,7,51,0.7)]">
          <div
            onClick={() => {
              playHapticClick(settings.soundEffects);
              handleLaunchApp(
                INITIAL_APPS.find((a) => a.id === 'pixel_nexo') || INITIAL_APPS[0]
              );
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <PixelNexoLogo variant="badge" size="sm" />
            <div>
              <span className="text-[10px] text-purple-300/80 block font-mono">Dev Launcher • Android 15</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[10px] font-mono text-zinc-400 mr-1 hidden lg:inline">Fichário:</span>
            {ENVIRONMENTS.map((env) => {
              const isActive = env.id === activeEnvId;
              return (
                <button
                  key={env.id}
                  onClick={() => handleSwitchEnvironment(env.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-850 text-white border shadow-md font-semibold'
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                  }`}
                  style={{
                    borderColor: isActive ? env.color : undefined,
                    boxShadow: isActive ? `0 0 10px ${env.color}40` : undefined,
                  }}
                  title={`Alternar para ${env.name}: ${env.tagline}`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: env.color }}
                  />
                  <span>{env.shortLabel}</span>
                </button>
              );
            })}

            <div className="h-4 w-[1px] bg-zinc-700 mx-1 hidden sm:block" />

            <PWAInstallButton soundEnabled={settings.soundEffects} />

            <a
              href="/pixel-nexo-launcher.zip"
              download="pixel-nexo-launcher.zip"
              className="px-2.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 flex items-center space-x-1.5 transition-colors font-mono text-xs cursor-pointer"
              title="Baixar código-fonte e projeto completo em ZIP (360 KB)"
            >
              <Download className="w-3.5 h-3.5 text-[#F5B942]" />
              <span className="hidden sm:inline">Baixar ZIP</span>
            </a>

            <button
              onClick={() =>
                handleUpdateSettings({
                  showDeviceFrame: !settings.showDeviceFrame,
                })
              }
              className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Alternar Tela Cheia"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Smartphone Shell / Viewport Container */}
      <div
        id="android-phone-frame"
        className={`relative transition-all duration-300 overflow-hidden flex flex-col justify-between ${
          settings.showDeviceFrame
            ? 'w-full max-w-[390px] h-[820px] max-h-[92vh] rounded-[48px] border-[10px] border-zinc-900 ring-1 ring-zinc-700/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            : 'w-full h-screen rounded-none border-none ring-0'
        }`}
        style={{
          backgroundImage: `url(${activeWallpaper.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Soft overlay gradient for wallpaper legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-0" />

        {/* Binder Side Tabs (Abas Laterais de Fichário para Mudar Ambientes) */}
        <BinderTabs
          environments={ENVIRONMENTS}
          activeEnvironmentId={activeEnvId}
          onSelectEnvironment={handleSwitchEnvironment}
          position={settings.binderPosition || 'right'}
          onTogglePosition={() =>
            handleUpdateSettings({
              binderPosition: settings.binderPosition === 'left' ? 'right' : 'left',
            })
          }
          showRings={settings.showBinderRings !== false}
          onToggleRings={() =>
            handleUpdateSettings({
              showBinderRings: settings.showBinderRings === false ? true : false,
            })
          }
          soundEnabled={settings.soundEffects}
        />

        {/* Environment Switch Banner Toast */}
        <AnimatePresence>
          {envToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-4 right-4 z-40 bg-[#160424]/95 backdrop-blur-2xl border rounded-2xl px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-between pointer-events-none"
              style={{ borderColor: `${envToast.color}80` }}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs"
                  style={{
                    backgroundColor: `${envToast.color}25`,
                    color: envToast.color,
                    border: `1px solid ${envToast.color}60`,
                  }}
                >
                  {envToast.shortLabel}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-mono font-bold text-white">
                      {envToast.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                      Fichário
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans line-clamp-1">{envToast.tagline}</p>
                </div>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
                style={{
                  backgroundColor: `${envToast.color}20`,
                  color: envToast.color,
                }}
              >
                Ativo
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Android Status Bar */}
        <div className="relative z-30">
          <StatusBar
            onToggleQuickSettings={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
            textColor={activeWallpaper.theme === 'light' ? 'text-zinc-900' : 'text-white'}
            isDarkTheme={settings.isDarkMode}
          />
        </div>

        {/* 2. Main Viewport: Home Screen or Active App */}
        <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeApp ? (
              <motion.div
                key={activeApp.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-zinc-950 z-20 flex flex-col"
              >
                {/* Active App Header Bar */}
                <div className="h-10 px-4 flex items-center justify-between border-b border-zinc-850 bg-zinc-900/90 select-none">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleBack}
                      className="p-1 rounded-full text-zinc-400 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-zinc-200">
                      {activeApp.name}
                    </span>
                  </div>
                  <button
                    onClick={handleGoHome}
                    className="p-1 rounded-full text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* App Content */}
                <div className="flex-1 overflow-hidden relative">
                  {activeApp.componentId === 'pixel_nexo' && (
                    <PixelNexoApp
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'terminal' && (
                    <TerminalApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                      activeEnvironmentId={activeEnvId}
                      onSwitchEnvironment={handleSwitchEnvironment}
                    />
                  )}
                  {activeApp.componentId === 'gh_terminal' && (
                    <GitHubCLIApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'gdrive_terminal' && (
                    <GDriveCLIApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'code_editor' && (
                    <CodeEditorApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'rest_client' && (
                    <RestClientApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'palette_studio' && (
                    <PaletteStudioApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'git_tracker' && (
                    <GitTrackerApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'system_monitor' && (
                    <SystemProfilerApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'calculator' && (
                    <CalculatorApp
                      accentColor={settings.accentColor}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'phone' && (
                    <PhoneApp
                      soundEnabled={settings.soundEffects}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {activeApp.componentId === 'messages' && (
                    <MessagesApp
                      soundEnabled={settings.soundEffects}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {activeApp.componentId === 'camera' && (
                    <CameraApp
                      soundEnabled={settings.soundEffects}
                      onPhotoTaken={(photo) =>
                        setCapturedPhotos((prev) => [photo, ...prev])
                      }
                    />
                  )}
                  {activeApp.componentId === 'clock' && (
                    <ClockApp
                      soundEnabled={settings.soundEffects}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {activeApp.componentId === 'notes' && (
                    <NotesApp
                      soundEnabled={settings.soundEffects}
                      accentColor={settings.accentColor}
                    />
                  )}
                  {activeApp.componentId === 'gallery' && (
                    <GalleryApp
                      photos={capturedPhotos}
                      soundEnabled={settings.soundEffects}
                    />
                  )}
                  {activeApp.componentId === 'chrome' && (
                    <BrowserApp soundEnabled={settings.soundEffects} />
                  )}
                  {activeApp.componentId === 'settings' && (
                    <SettingsApp
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      onOpenDevGuide={() =>
                        handleLaunchApp(
                          INITIAL_APPS.find((a) => a.id === 'android_dev') ||
                            INITIAL_APPS[0]
                        )
                      }
                      onOpenInstallGuide={() => setShowInstallGuide(true)}
                    />
                  )}
                  {activeApp.componentId === 'android_dev' && (
                    <AndroidDevApp soundEnabled={settings.soundEffects} />
                  )}
                  {/* Fallback for other apps like maps, music, files, weather */}
                  {![
                    'pixel_nexo',
                    'terminal',
                    'gh_terminal',
                    'gdrive_terminal',
                    'code_editor',
                    'rest_client',
                    'palette_studio',
                    'git_tracker',
                    'system_monitor',
                    'calculator',
                    'phone',
                    'messages',
                    'camera',
                    'clock',
                    'notes',
                    'gallery',
                    'chrome',
                    'settings',
                    'android_dev',
                  ].includes(activeApp.componentId || '') && (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-3">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl"
                        style={{ backgroundColor: activeApp.color }}
                      >
                        {activeApp.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white">{activeApp.name}</h3>
                      <p className="text-xs text-zinc-400 max-w-xs leading-relaxed font-sans">
                        Este aplicativo está configurado na grade do launcher. Você pode abrir o{' '}
                        <strong className="text-emerald-400">Launcher Kotlin</strong> para aprender a integrar todos os apps reais no Android.
                      </p>
                      <button
                        onClick={handleGoHome}
                        className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-semibold"
                      >
                        Voltar para Início
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              // Home Screen
              <motion.div
                key="home-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between"
              >
                <HomeScreen
                  apps={homeApps}
                  settings={settings}
                  activeEnvironment={activeEnvironment}
                  onSwitchEnvironment={handleSwitchEnvironment}
                  onLaunchApp={handleLaunchApp}
                  onOpenBrowserWithQuery={(query) => {
                    handleLaunchApp(
                      INITIAL_APPS.find((a) => a.id === 'chrome') || INITIAL_APPS[0]
                    );
                  }}
                  onOpenClock={() =>
                    handleLaunchApp(
                      INITIAL_APPS.find((a) => a.id === 'clock') || INITIAL_APPS[0]
                    )
                  }
                  onOpenSettings={() =>
                    handleLaunchApp(
                      INITIAL_APPS.find((a) => a.id === 'settings') || INITIAL_APPS[0]
                    )
                  }
                  onOpenInstallGuide={() => setShowInstallGuide(true)}
                />

                {/* Bottom Dock */}
                <Dock
                  dockApps={dockApps}
                  settings={settings}
                  onLaunchApp={handleLaunchApp}
                  onOpenDrawer={() => setIsDrawerOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Bottom Navigation Bar */}
        <div className="relative z-30">
          <NavigationBar
            navStyle={settings.navStyle}
            onHome={handleGoHome}
            onBack={handleBack}
            onRecents={handleRecents}
            soundEnabled={settings.soundEffects}
            isAppOpen={!!activeApp}
          />
        </div>

        {/* 4. Quick Settings Shade Overlay */}
        <QuickSettingsShade
          isOpen={isQuickSettingsOpen}
          onClose={() => setIsQuickSettingsOpen(false)}
          accentColor={settings.accentColor}
          isDarkMode={settings.isDarkMode}
          onToggleDarkMode={() =>
            handleUpdateSettings({ isDarkMode: !settings.isDarkMode })
          }
          onOpenSettings={() => {
            setIsQuickSettingsOpen(false);
            handleLaunchApp(
              INITIAL_APPS.find((a) => a.id === 'settings') || INITIAL_APPS[0]
            );
          }}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          onDismissNotification={(id) =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
        />

        {/* 5. App Drawer Overlay */}
        <AppDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          apps={INITIAL_APPS}
          nativeApps={nativeApps}
          settings={settings}
          onLaunchApp={handleLaunchApp}
        />

        {/* 6. Recents Overview Overlay */}
        <RecentsOverview
          isOpen={isRecentsOpen}
          onClose={() => setIsRecentsOpen(false)}
          recentApps={recentApps}
          onSelectApp={(app) => {
            setIsRecentsOpen(false);
            handleLaunchApp(app);
          }}
          onClearAll={() => {
            setRecentApps([]);
            setIsRecentsOpen(false);
          }}
          onCloseApp={(id) =>
            setRecentApps((prev) => prev.filter((a) => a.id !== id))
          }
          soundEnabled={settings.soundEffects}
        />
      </div>

      {/* Floating Fullscreen / Mobile frame toggle when in full screen */}
      {!settings.showDeviceFrame && !isNativeLauncher() && (
        <button
          onClick={() => handleUpdateSettings({ showDeviceFrame: true })}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 shadow-xl backdrop-blur-md transition-transform active:scale-95"
          title="Restaurar Moldura de Smartphone"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}

      {/* PWA & Native Install Guide Modal */}
      <InstallGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
        soundEnabled={settings.soundEffects}
      />
    </main>
  );
}
