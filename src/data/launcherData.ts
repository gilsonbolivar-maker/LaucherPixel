import { AppItem, WallpaperOption, LauncherSettings, PhoneEnvironment } from '../types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'pixel_nexo',
    name: 'Pixel Nexo',
    iconName: 'PixelNexo',
    color: '#F5B942',
    gradient: 'from-[#190429] via-[#23083B] to-[#430f6b]',
    category: 'design',
    isFavorite: true,
    componentId: 'pixel_nexo',
    badge: 'BRAND',
  },
  {
    id: 'terminal',
    name: 'Terminal CLI',
    iconName: 'Terminal',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-800',
    category: 'dev',
    inDock: true,
    isFavorite: true,
    componentId: 'terminal',
    badge: 'bash',
  },
  {
    id: 'code_editor',
    name: 'Dev Studio',
    iconName: 'Code',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-700',
    category: 'dev',
    inDock: true,
    isFavorite: true,
    componentId: 'code_editor',
    badge: 'IDE',
  },
  {
    id: 'rest_client',
    name: 'REST Client',
    iconName: 'Send',
    color: '#F97316',
    gradient: 'from-orange-500 to-amber-700',
    category: 'network',
    inDock: true,
    isFavorite: true,
    componentId: 'rest_client',
    badge: 'HTTP',
  },
  {
    id: 'git_tracker',
    name: 'Git Monitor',
    iconName: 'GitBranch',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-700',
    category: 'dev',
    inDock: true,
    isFavorite: true,
    componentId: 'git_tracker',
    badge: 'main',
  },
  {
    id: 'gh_terminal',
    name: 'GitHub CLI',
    iconName: 'Github',
    color: '#181717',
    gradient: 'from-zinc-800 to-zinc-950',
    category: 'dev',
    isFavorite: true,
    componentId: 'gh_terminal',
    badge: 'gh',
  },
  {
    id: 'gdrive_terminal',
    name: 'Google Drive',
    iconName: 'HardDrive',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-700',
    category: 'tools',
    isFavorite: true,
    componentId: 'gdrive_terminal',
    badge: '15GB',
  },
  {
    id: 'settings',
    name: 'Config DevOS',
    iconName: 'Settings',
    color: '#64748B',
    gradient: 'from-slate-600 to-slate-800',
    category: 'system',
    inDock: true,
    isFavorite: true,
    componentId: 'settings',
  },
  {
    id: 'android_dev',
    name: 'Launcher Kotlin',
    iconName: 'Layers',
    color: '#3DDC84',
    gradient: 'from-emerald-400 to-emerald-600',
    category: 'dev',
    isFavorite: true,
    componentId: 'android_dev',
  },
  {
    id: 'palette_studio',
    name: 'Design Tokens',
    iconName: 'Palette',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-indigo-600',
    category: 'design',
    isFavorite: true,
    componentId: 'palette_studio',
  },
  {
    id: 'calculator',
    name: 'Calc Programador',
    iconName: 'Binary',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-blue-700',
    category: 'tools',
    isFavorite: true,
    componentId: 'calculator',
  },
  {
    id: 'notes',
    name: 'Dev Scratchpad',
    iconName: 'FileCode',
    color: '#FB8C00',
    gradient: 'from-amber-500 to-orange-600',
    category: 'tools',
    isFavorite: true,
    componentId: 'notes',
  },
  {
    id: 'system_monitor',
    name: 'Logcat Profiler',
    iconName: 'Activity',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-teal-700',
    category: 'system',
    isFavorite: true,
    componentId: 'system_monitor',
  },
  {
    id: 'chrome',
    name: 'Dev Docs (Web)',
    iconName: 'Globe',
    color: '#0284C7',
    gradient: 'from-sky-500 to-blue-600',
    category: 'tools',
    isFavorite: true,
    componentId: 'chrome',
  },
  {
    id: 'clock',
    name: 'Relógio & Foco',
    iconName: 'Clock',
    color: '#9333EA',
    gradient: 'from-purple-600 to-indigo-800',
    category: 'tools',
    componentId: 'clock',
  },
  {
    id: 'camera',
    name: 'Câmera & QR',
    iconName: 'Camera',
    color: '#475569',
    gradient: 'from-zinc-700 to-zinc-900',
    category: 'tools',
    componentId: 'camera',
  },
  {
    id: 'gallery',
    name: 'Assets & Fotos',
    iconName: 'Image',
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-700',
    category: 'design',
    componentId: 'gallery',
  },
  {
    id: 'phone',
    name: 'Terminal VoIP',
    iconName: 'Phone',
    color: '#0D9488',
    gradient: 'from-teal-500 to-emerald-700',
    category: 'system',
    componentId: 'phone',
  },
  {
    id: 'messages',
    name: 'Dev Chat / IRC',
    iconName: 'MessageSquare',
    color: '#2563EB',
    gradient: 'from-blue-600 to-indigo-700',
    category: 'system',
    unreadCount: 1,
    componentId: 'messages',
  },
];

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'pixel-nexo-core',
    name: 'Pixel Nexo Violet & Gold',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#F5B942',
    category: 'cyberpunk',
  },
  {
    id: 'pixel-nexo-matrix',
    name: 'Pixel Nexo Cyber Grid',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#F5B942',
    category: 'cyberpunk',
  },
  {
    id: 'matrix-terminal',
    name: 'Matrix Code Stream',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#10B981',
    category: 'code',
  },
  {
    id: 'circuit-blueprint',
    name: 'Silício & Circuitos',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#06B6D4',
    category: 'blueprint',
  },
  {
    id: 'tokyo-night-ide',
    name: 'Tokyo Night IDE',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#8B5CF6',
    category: 'cyberpunk',
  },
  {
    id: 'creative-mesh',
    name: 'Gradiente Criativo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#3B82F6',
    category: 'minimal',
  },
  {
    id: 'obsidian-schematic',
    name: 'Obsidiana Minimal',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1080&q=80',
    theme: 'dark',
    accentColor: '#E2E8F0',
    category: 'minimal',
  },
];

export const ACCENT_PALETTES = [
  { name: 'Pixel Nexo Gold', hex: '#F5B942', text: 'text-amber-400', bg: 'bg-amber-400' },
  { name: 'Pixel Nexo Violet', hex: '#8022B8', text: 'text-purple-400', bg: 'bg-purple-600' },
  { name: 'Kotlin Emerald', hex: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500' },
  { name: 'TypeScript Blue', hex: '#3B82F6', text: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'Rust Orange', hex: '#F97316', text: 'text-orange-400', bg: 'bg-orange-500' },
  { name: 'Cyberpunk Cyan', hex: '#06B6D4', text: 'text-cyan-400', bg: 'bg-cyan-500' },
];

export const ENVIRONMENTS: PhoneEnvironment[] = [
  {
    id: 'nexo',
    name: 'Pixel Nexo',
    shortLabel: 'NEXO',
    tagline: 'Design System, Marca & Tokens',
    iconName: 'Sparkles',
    color: '#F5B942',
    tabBg: 'bg-gradient-to-r from-[#23083B] to-[#3b0d5c]',
    tabBorder: 'border-[#F5B942]/80',
    tabTextColor: 'text-[#F5B942]',
    accentColor: '#F5B942',
    wallpaperId: 'pixel-nexo-core',
    appIds: ['pixel_nexo', 'palette_studio', 'gallery', 'camera', 'system_monitor', 'settings'],
    statusText: 'Pixel Nexo OS v2.5 • Violet Matrix',
    statusBadge: 'BRAND',
    metricLabel: 'Tokens Ativos',
    metricValue: '18 tokens',
  },
  {
    id: 'dev',
    name: 'Desenvolvedor',
    shortLabel: 'DEV',
    tagline: 'CLI, Git, Dev Studio & Depuração',
    iconName: 'Terminal',
    color: '#10B981',
    tabBg: 'bg-gradient-to-r from-emerald-950 to-teal-900',
    tabBorder: 'border-emerald-500/80',
    tabTextColor: 'text-emerald-400',
    accentColor: '#10B981',
    wallpaperId: 'matrix-terminal',
    appIds: ['terminal', 'code_editor', 'git_tracker', 'gh_terminal', 'rest_client', 'android_dev'],
    statusText: 'Node v22.14 LTS • git:main (98f02a)',
    statusBadge: 'LOCAL',
    metricLabel: 'Porta HTTP',
    metricValue: ':3000 online',
  },
  {
    id: 'work',
    name: 'Trabalho & Prod',
    shortLabel: 'WORK',
    tagline: 'Cloud Drive, Docs, Tarefas & Foco',
    iconName: 'Briefcase',
    color: '#38BDF8',
    tabBg: 'bg-gradient-to-r from-sky-950 to-blue-900',
    tabBorder: 'border-sky-500/80',
    tabTextColor: 'text-sky-400',
    accentColor: '#38BDF8',
    wallpaperId: 'circuit-blueprint',
    appIds: ['gdrive_terminal', 'notes', 'chrome', 'clock', 'calculator', 'messages'],
    statusText: 'Google Drive 15GB • Pomodoro 25m',
    statusBadge: 'CLOUD',
    metricLabel: 'Docs Sincronizados',
    metricValue: '14 arquivos',
  },
  {
    id: 'personal',
    name: 'Pessoal & Social',
    shortLabel: 'SOCIAL',
    tagline: 'Mensagens, Chamadas, Câmera & Dia a Dia',
    iconName: 'Heart',
    color: '#F43F5E',
    tabBg: 'bg-gradient-to-r from-rose-950 to-pink-900',
    tabBorder: 'border-rose-500/80',
    tabTextColor: 'text-rose-400',
    accentColor: '#F43F5E',
    wallpaperId: 'creative-mesh',
    appIds: ['messages', 'phone', 'camera', 'gallery', 'clock', 'notes'],
    statusText: '3 Mensagens novas • Câmera Pronta',
    statusBadge: 'DAILY',
    metricLabel: 'Notificações',
    metricValue: '3 ativas',
  },
  {
    id: 'ops',
    name: 'SysOps & Telemetria',
    shortLabel: 'OPS',
    tagline: 'Logcat, Profiler, Portas & Hardware',
    iconName: 'Cpu',
    color: '#A855F7',
    tabBg: 'bg-gradient-to-r from-purple-950 to-indigo-950',
    tabBorder: 'border-purple-500/80',
    tabTextColor: 'text-purple-400',
    accentColor: '#A855F7',
    wallpaperId: 'tokyo-night-ide',
    appIds: ['system_monitor', 'terminal', 'rest_client', 'settings', 'android_dev', 'gh_terminal'],
    statusText: '8 Cores • 31.4°C Estável • ADB Wireless On',
    statusBadge: 'KERNEL',
    metricLabel: 'Heap RAM',
    metricValue: '58% (4.8GB)',
  },
];

export const DEFAULT_SETTINGS: LauncherSettings = {
  wallpaperId: 'pixel-nexo-core',
  accentColor: '#F5B942',
  gridSize: '4x5',
  iconShape: 'squircle',
  navStyle: 'gestures',
  isDarkMode: true,
  showDockLabels: false,
  showDeviceFrame: true,
  soundEffects: true,
  showGitBranchInStatus: true,
  showLogcatOverlay: false,
  adbWirelessEnabled: true,
  devFocusMode: false,
  activeEnvironmentId: 'nexo',
  binderPosition: 'right',
  showBinderRings: true,
  binderTabsCompact: false,
  dockApps: ['terminal', 'code_editor', 'rest_client', 'git_tracker', 'settings'],
  homeApps: ['pixel_nexo', 'palette_studio', 'gallery', 'camera', 'system_monitor', 'settings'],
};

export const KOTLIN_ANDROID_CODE = `// ==========================================
// 1. AndroidManifest.xml (Como declarar o Launcher)
// ==========================================
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.exemplo.meulauncher">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/Theme.MeuLauncher">

        <!-- ATIVIDADE PRINCIPAL CONFIGURADA COMO HOME LAUNCHER -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:clearTaskOnLaunch="true"
            android:stateNotNeeded="true">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <!-- Estas 2 categorias transformam o App em um Launcher do Android: -->
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>
    </application>

</manifest>

// ==========================================
// 2. MainActivity.kt (Listar e abrir aplicativos instalados)
// ==========================================
package com.exemplo.meulauncher

import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.drawable.Drawable
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.google.accompanist.drawablepainter.rememberDrawablePainter

data class AppModel(
    val label: String,
    val packageName: String,
    val icon: Drawable
)

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                LauncherScreen()
            }
        }
    }

    // Impede que o botão "Voltar" feche o launcher
    override fun onBackPressed() {
        // No Launcher, voltar apenas recolhe a gaveta de apps
    }
}

@Composable
fun LauncherScreen() {
    val context = LocalContext.current
    var installedApps by remember { mutableStateOf<List<AppModel>>(emptyList()) }

    LaunchedEffect(Unit) {
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfoList: List<ResolveInfo> = pm.queryIntentActivities(mainIntent, 0)
        
        installedApps = resolveInfoList.map { info ->
            AppModel(
                label = info.loadLabel(pm).toString(),
                packageName = info.activityInfo.packageName,
                icon = info.activityInfo.loadIcon(pm)
            )
        }.sortedBy { it.label }
    }

    LazyVerticalGrid(
        columns = GridCells.Fixed(4),
        modifier = Modifier.fillMaxSize().padding(16.dp)
    ) {
        items(installedApps) { app ->
            Column(
                modifier = Modifier
                    .padding(8.dp)
                    .clickable {
                        val launchIntent = context.packageManager.getLaunchIntentForPackage(app.packageName)
                        if (launchIntent != null) {
                            context.startActivity(launchIntent)
                        }
                    },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = rememberDrawablePainter(drawable = app.icon),
                    contentDescription = app.label,
                    modifier = Modifier.size(56.dp)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = app.label, maxLines = 1)
            }
        }
    }
}
`;
