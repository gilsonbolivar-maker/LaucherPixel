import React from 'react';
import { ChevronUp } from 'lucide-react';
import { AppItem, LauncherSettings } from '../types';
import { AppIcon } from './AppIcon';
import { playHapticClick } from '../utils/audio';

interface DockProps {
  dockApps: AppItem[];
  settings: LauncherSettings;
  onLaunchApp: (app: AppItem) => void;
  onOpenDrawer: () => void;
}

export const Dock: React.FC<DockProps> = ({
  dockApps,
  settings,
  onLaunchApp,
  onOpenDrawer,
}) => {
  return (
    <div className="w-full px-4 pb-2 pt-1 flex flex-col items-center select-none">
      {/* Swipe Up for App Drawer Handle */}
      <button
        onClick={() => {
          playHapticClick(settings.soundEffects);
          onOpenDrawer();
        }}
        className="w-full flex flex-col items-center justify-center py-1 opacity-75 hover:opacity-100 transition-opacity"
        title="Deslize ou toque para abrir todos os aplicativos"
      >
        <ChevronUp className="w-4 h-4 text-white animate-bounce" />
      </button>

      {/* Dock Apps Bar */}
      <div className="w-full max-w-sm px-3 py-2.5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-around">
        {dockApps.map((app) => (
          <AppIcon
            key={app.id}
            name={app.name}
            iconName={app.iconName}
            color={app.color}
            gradient={app.gradient}
            shape={settings.iconShape}
            size="md"
            unreadCount={app.unreadCount}
            showLabel={settings.showDockLabels}
            labelColor="text-white"
            onClick={() => {
              playHapticClick(settings.soundEffects);
              onLaunchApp(app);
            }}
          />
        ))}
      </div>
    </div>
  );
};
