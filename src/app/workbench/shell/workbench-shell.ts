import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Blocks,
  Bug,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Command,
  FileText,
  Files,
  GitBranch,
  LucideAngularModule,
  LucideIconData,
  Maximize2,
  Minimize2,
  PanelBottom,
  RotateCcw,
  Search,
  Settings,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-angular';
import { WorkbenchContextService } from '../core/context';
import {
  CommandDescriptor,
  LayoutFocusTarget,
  LayoutResizeTarget,
  WorkbenchConfiguration,
  WorkbenchRegion,
} from '../core/contracts';
import { WorkbenchRegistry } from '../core/registry';
import { WorkbenchLayoutService } from '../core/layout';
import { WorkbenchWorkspaceService } from '../core/workspace';
import { ThemePreset, WorkbenchThemeSettingsComponent } from './theme-settings';

type ThemeColorKey =
  | 'canvas'
  | 'surface'
  | 'surfaceRaised'
  | 'surfaceHover'
  | 'title'
  | 'rail'
  | 'railActive'
  | 'railMuted'
  | 'tab'
  | 'tabInactive'
  | 'status'
  | 'statusText'
  | 'border'
  | 'borderStrong'
  | 'text'
  | 'textSoft'
  | 'muted'
  | 'accent'
  | 'accentDim'
  | 'green'
  | 'red';

interface ThemeColorToken {
  readonly key: ThemeColorKey;
  readonly label: string;
  readonly description: string;
}

const DARK_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#020617',
  surface: '#0f172a',
  surfaceRaised: '#1e293b',
  surfaceHover: '#334155',
  title: '#111827',
  rail: '#020617',
  railActive: '#164e63',
  railMuted: '#94a3b8',
  tab: '#0f172a',
  tabInactive: '#1e293b',
  status: '#164e63',
  statusText: '#cffafe',
  border: '#334155',
  borderStrong: '#475569',
  text: '#f1f5f9',
  textSoft: '#cbd5e1',
  muted: '#94a3b8',
  accent: '#22d3ee',
  accentDim: '#0891b2',
  green: '#4ade80',
  red: '#fb7185',
};

const LIGHT_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#f8fafc',
  surface: '#f1f5f9',
  surfaceRaised: '#ffffff',
  surfaceHover: '#e2e8f0',
  title: '#f8fafc',
  rail: '#e0f2fe',
  railActive: '#bae6fd',
  railMuted: '#64748b',
  tab: '#f1f5f9',
  tabInactive: '#e2e8f0',
  status: '#2563eb',
  statusText: '#ffffff',
  border: '#cbd5e1',
  borderStrong: '#94a3b8',
  text: '#0f172a',
  textSoft: '#334155',
  muted: '#64748b',
  accent: '#2563eb',
  accentDim: '#1d4ed8',
  green: '#15803d',
  red: '#dc2626',
};

const STONE_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#0c0a09',
  surface: '#1c1917',
  surfaceRaised: '#292524',
  surfaceHover: '#44403c',
  title: '#1c1917',
  rail: '#0c0a09',
  railActive: '#44403c',
  railMuted: '#a8a29e',
  tab: '#1c1917',
  tabInactive: '#292524',
  status: '#57534e',
  statusText: '#fafaf9',
  border: '#44403c',
  borderStrong: '#57534e',
  text: '#fafaf9',
  textSoft: '#d6d3d1',
  muted: '#a8a29e',
  accent: '#d6d3d1',
  accentDim: '#78716c',
  green: '#86efac',
  red: '#fca5a5',
};

const ZINC_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#09090b',
  surface: '#18181b',
  surfaceRaised: '#27272a',
  surfaceHover: '#3f3f46',
  title: '#18181b',
  rail: '#09090b',
  railActive: '#3f3f46',
  railMuted: '#a1a1aa',
  tab: '#18181b',
  tabInactive: '#27272a',
  status: '#52525b',
  statusText: '#fafafa',
  border: '#3f3f46',
  borderStrong: '#52525b',
  text: '#fafafa',
  textSoft: '#d4d4d8',
  muted: '#a1a1aa',
  accent: '#d4d4d8',
  accentDim: '#71717a',
  green: '#86efac',
  red: '#fda4af',
};

const LIME_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#1a2e05',
  surface: '#365314',
  surfaceRaised: '#3f6212',
  surfaceHover: '#4d7c0f',
  title: '#1a2e05',
  rail: '#1a2e05',
  railActive: '#4d7c0f',
  railMuted: '#bef264',
  tab: '#365314',
  tabInactive: '#3f6212',
  status: '#65a30d',
  statusText: '#f7fee7',
  border: '#4d7c0f',
  borderStrong: '#65a30d',
  text: '#f7fee7',
  textSoft: '#d9f99d',
  muted: '#bef264',
  accent: '#a3e635',
  accentDim: '#65a30d',
  green: '#bef264',
  red: '#fda4af',
};

const BLUE_THEME_COLORS: Record<ThemeColorKey, string> = {
  canvas: '#172554',
  surface: '#1e3a8a',
  surfaceRaised: '#1e40af',
  surfaceHover: '#1d4ed8',
  title: '#172554',
  rail: '#172554',
  railActive: '#1d4ed8',
  railMuted: '#93c5fd',
  tab: '#1e3a8a',
  tabInactive: '#1e40af',
  status: '#2563eb',
  statusText: '#eff6ff',
  border: '#1d4ed8',
  borderStrong: '#2563eb',
  text: '#eff6ff',
  textSoft: '#bfdbfe',
  muted: '#93c5fd',
  accent: '#60a5fa',
  accentDim: '#2563eb',
  green: '#86efac',
  red: '#fda4af',
};

const THEME_VARIABLES: Record<ThemeColorKey, string> = {
  canvas: '--wb-canvas',
  surface: '--wb-surface',
  surfaceRaised: '--wb-surface-raised',
  surfaceHover: '--wb-surface-hover',
  title: '--wb-title',
  rail: '--wb-rail',
  railActive: '--wb-rail-active',
  railMuted: '--wb-rail-muted',
  tab: '--wb-tab',
  tabInactive: '--wb-tab-inactive',
  status: '--wb-status',
  statusText: '--wb-status-text',
  border: '--wb-border',
  borderStrong: '--wb-border-strong',
  text: '--wb-text',
  textSoft: '--wb-text-soft',
  muted: '--wb-muted',
  accent: '--wb-accent',
  accentDim: '--wb-accent-dim',
  green: '--wb-green',
  red: '--wb-red',
};

const THEME_COLOR_TOKENS: readonly ThemeColorToken[] = [
  { key: 'canvas', label: 'Canvas', description: 'Main workbench background' },
  { key: 'surface', label: 'Surface', description: 'Panels and sidebars' },
  { key: 'surfaceRaised', label: 'Raised surface', description: 'Elevated controls' },
  { key: 'surfaceHover', label: 'Hover surface', description: 'Interactive hover state' },
  { key: 'title', label: 'Title bar', description: 'Window title background' },
  { key: 'rail', label: 'Activity rail', description: 'Activity Bar background' },
  { key: 'railActive', label: 'Active rail', description: 'Selected activity state' },
  { key: 'railMuted', label: 'Rail muted', description: 'Inactive activity icons' },
  { key: 'tab', label: 'Tab strip', description: 'Editor tab background' },
  { key: 'tabInactive', label: 'Inactive tab', description: 'Unselected editor tabs' },
  { key: 'status', label: 'Status bar', description: 'Bottom status background' },
  { key: 'statusText', label: 'Status text', description: 'Bottom status foreground' },
  { key: 'border', label: 'Border', description: 'Default separators' },
  { key: 'borderStrong', label: 'Strong border', description: 'Focused separators' },
  { key: 'text', label: 'Text', description: 'Primary foreground' },
  { key: 'textSoft', label: 'Soft text', description: 'Secondary foreground' },
  { key: 'muted', label: 'Muted text', description: 'Low emphasis foreground' },
  { key: 'accent', label: 'Accent', description: 'Primary highlight' },
  { key: 'accentDim', label: 'Dim accent', description: 'Low emphasis highlight' },
  { key: 'green', label: 'Success', description: 'Positive state' },
  { key: 'red', label: 'Danger', description: 'Destructive state' },
];

function createThemePreset(
  id: string,
  name: string,
  description: string,
  base: Record<ThemeColorKey, string>,
  overrides: Partial<Record<ThemeColorKey, string>>,
  swatches: readonly string[],
): ThemePreset {
  return { id, name, description, colors: { ...base, ...overrides }, swatches };
}

const THEME_PRESETS: readonly ThemePreset[] = [
  createThemePreset('midnight', 'Midnight', 'Slate and cyan workspace', DARK_THEME_COLORS, {}, ['#020617', '#0f172a', '#22d3ee', '#334155']),
  createThemePreset('arctic', 'Arctic', 'Slate and blue light workspace', LIGHT_THEME_COLORS, {}, ['#f8fafc', '#ffffff', '#2563eb', '#cbd5e1']),
  createThemePreset('stone', 'Stone', 'Dark neutral workspace', STONE_THEME_COLORS, {}, ['#0c0a09', '#1c1917', '#d6d3d1', '#44403c']),
  createThemePreset('zinc', 'Zinc', 'Cool neutral workspace', ZINC_THEME_COLORS, {}, ['#09090b', '#18181b', '#d4d4d8', '#3f3f46']),
  createThemePreset('lime', 'Lime', 'Bright green workspace', LIME_THEME_COLORS, {}, ['#1a2e05', '#365314', '#a3e635', '#4d7c0f']),
  createThemePreset('blue', 'Blue', 'Deep blue workspace', BLUE_THEME_COLORS, {}, ['#172554', '#1e3a8a', '#60a5fa', '#1d4ed8']),
  createThemePreset('stone-amber', 'Stone Amber', 'Stone base with amber accents', STONE_THEME_COLORS, {
    status: '#b45309', statusText: '#fffbeb', borderStrong: '#d97706', accent: '#f59e0b', accentDim: '#b45309',
  }, ['#0c0a09', '#1c1917', '#f59e0b', '#b45309']),
  createThemePreset('forest', 'Forest', 'Emerald and green workspace', DARK_THEME_COLORS, {
    canvas: '#052e16', surface: '#064e3b', surfaceRaised: '#065f46', surfaceHover: '#047857', title: '#022c22',
    rail: '#022c22', railActive: '#14532d', railMuted: '#86efac', tab: '#064e3b', tabInactive: '#065f46',
    status: '#166534', statusText: '#dcfce7', border: '#166534', borderStrong: '#22c55e', text: '#ecfdf5',
    textSoft: '#a7f3d0', muted: '#6ee7b7', accent: '#34d399', accentDim: '#059669', green: '#86efac', red: '#fb7185',
  }, ['#052e16', '#064e3b', '#34d399', '#166534']),
  createThemePreset('solar', 'Solar', 'Amber and orange workspace', LIGHT_THEME_COLORS, {
    canvas: '#fffbeb', surface: '#fef3c7', surfaceRaised: '#fff7ed', surfaceHover: '#fde68a', title: '#fff7ed',
    rail: '#fef3c7', railActive: '#fed7aa', railMuted: '#92400e', tab: '#fff7ed', tabInactive: '#fde68a',
    status: '#c2410c', statusText: '#fff7ed', border: '#fcd34d', borderStrong: '#f59e0b', text: '#292524',
    textSoft: '#57534e', muted: '#78716c', accent: '#ea580c', accentDim: '#c2410c', green: '#15803d', red: '#dc2626',
  }, ['#fffbeb', '#fef3c7', '#ea580c', '#fcd34d']),
];

@Component({
  selector: 'workbench-shell',
  imports: [CommonModule, FormsModule, LucideAngularModule, NgComponentOutlet, WorkbenchThemeSettingsComponent],
  templateUrl: './workbench-shell.html',
  styleUrl: './workbench-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchShellComponent implements OnChanges {
  private static readonly themeStorageKey = 'modular-workbench.theme';
  private static readonly customThemeStorageKey = 'modular-workbench.custom-theme';

  @Input() configuration: WorkbenchConfiguration = {
    applicationId: 'workbench',
    workspaceId: 'default',
    activityBar: true,
    primarySidebar: true,
    secondarySidebar: false,
    bottomPanel: false,
    statusBar: true,
    commandPalette: true,
    layoutPersistence: true,
  };

  readonly registry = inject(WorkbenchRegistry);
  readonly contextService = inject(WorkbenchContextService);
  readonly layout = inject(WorkbenchLayoutService);
  readonly workspace = inject(WorkbenchWorkspaceService);
  readonly paletteOpen = signal(false);
  readonly paletteQuery = signal('');
  readonly commandError = signal<string | null>(null);
  readonly theme = signal<'dark' | 'light'>(this.readTheme());
  readonly themeSettingsOpen = signal(false);
  readonly customThemeColors = signal<Partial<Record<ThemeColorKey, string>>>(this.readCustomTheme());
  readonly themeColorTokens = THEME_COLOR_TOKENS;
  readonly themePresets = THEME_PRESETS;
  readonly themeColorValues = computed(() => Object.fromEntries(
    THEME_COLOR_TOKENS.map(({ key }) => [key, this.themeColorValue(key)]),
  ) as Record<ThemeColorKey, string>);
  readonly activePresetId = computed(() => {
    const colors = this.themeColorValues();
    return this.themePresets.find((preset) => Object.entries(preset.colors).every(([key, value]) => colors[key as ThemeColorKey] === value))?.id ?? null;
  });

  @HostBinding('style')
  get themeVariables(): string {
    const variables = THEME_COLOR_TOKENS.map(({ key }) => `${THEME_VARIABLES[key]}: ${this.themeColorValue(key)}`);
    variables.push(`--wb-accent-soft: color-mix(in srgb, ${this.themeColorValue('accent')} 12%, transparent)`);
    return variables.join('; ');
  }

  @HostBinding('class.light-theme')
  get lightTheme(): boolean {
    return this.theme() === 'light';
  }

  readonly icons = {
    blocks: Blocks,
    bug: Bug,
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
    check: CircleCheck,
    command: Command,
    fileText: FileText,
    files: Files,
    gitBranch: GitBranch,
    maximize: Maximize2,
    minimize: Minimize2,
    moon: Moon,
    panelBottom: PanelBottom,
    reset: RotateCcw,
    search: Search,
    settings: Settings,
    agents: Sparkles,
    sun: Sun,
    user: User,
    close: X,
  };
  readonly activityIcons: Record<string, LucideIconData> = {
    agents: Sparkles,
    folder: Files,
    search: Search,
    source: GitBranch,
    debug: Bug,
    extensions: Blocks,
  };

  readonly activeView = computed(() => {
    const activeViewId = this.contextService.context().activeViewId;
    return this.registry.views().find((view) => view.id === activeViewId && view.region === 'primarySidebar');
  });
  readonly secondaryViews = computed(() => this.visibleViews('secondarySidebar'));
  readonly bottomPanels = computed(() => this.registry.panels().filter((panel) => this.isVisible(panel.when)));
  readonly activeEditor = computed(() =>
    this.workspace.editors().find((editor) => editor.instanceId === this.workspace.activeEditorId()),
  );
  readonly paletteCommands = computed(() => {
    const query = this.paletteQuery().trim().toLowerCase();
    return this.registry.availableCommands(this.contextService.context()).filter((command) => {
      if (!query) {
        return true;
      }
      return `${command.title} ${command.category ?? ''} ${command.id}`.toLowerCase().includes(query);
    });
  });
  readonly activePanel = computed(() => {
    const panels = this.bottomPanels();
    return panels.find((panel) => panel.id === this.layout.state().activePanelId) ?? panels[0];
  });

  @ViewChild('mainWorkbench') private mainWorkbench?: ElementRef<HTMLElement>;
  @ViewChild('primarySidebar') private primarySidebar?: ElementRef<HTMLElement>;
  @ViewChild('secondarySidebar') private secondarySidebar?: ElementRef<HTMLElement>;
  @ViewChild('bottomPanel') private bottomPanel?: ElementRef<HTMLElement>;
  @ViewChild('paletteInput') private paletteInput?: ElementRef<HTMLInputElement>;

  private resizeSession: {
    readonly target: LayoutResizeTarget;
    readonly pointerId: number;
    readonly startX: number;
    readonly startY: number;
    readonly startSize: number;
  } | null = null;

  private readonly focusEffect = effect(() => {
    const request = this.layout.focusRequest();
    if (request) {
      queueMicrotask(() => this.focusTarget(request.target));
    }
  });

  ngOnChanges(): void {
    this.contextService.configure(this.configuration.applicationId, this.configuration.workspaceId);
    this.layout.configure(this.configuration);
    const state = this.layout.state();
    const activity = this.registry.activities().find((entry) => entry.id === state.activeActivityId) ?? this.registry.activities()[0];
    if (activity) {
      const activityView = this.registry.views().find((view) => activity.viewIds.includes(view.id));
      const primaryView = this.registry.views().find((view) => view.id === state.activePrimaryViewId && view.region === 'primarySidebar') ??
        this.registry.views().find((view) => view.region === 'primarySidebar');
      if (activityView?.region === 'secondarySidebar') {
        this.layout.selectSecondaryView(activityView.id);
        this.contextService.patch({ activeActivityId: activity.id, activeViewId: primaryView?.id ?? null });
      } else {
        this.contextService.patch({ activeActivityId: activity.id, activeViewId: primaryView?.id ?? activityView?.id ?? null });
      }
    }
  }

  selectActivity(activityId: string): void {
    const activity = this.registry.activities().find((entry) => entry.id === activityId);
    const activityView = this.registry.views().find((view) => activity?.viewIds.includes(view.id));
    this.layout.selectActivity(activityId);
    if (activityView?.region === 'secondarySidebar') {
      this.layout.selectSecondaryView(activityView.id);
      this.layout.setSecondarySidebarVisible(true);
      const primaryView = this.registry.views().find((view) => view.id === this.layout.state().activePrimaryViewId && view.region === 'primarySidebar') ??
        this.registry.views().find((view) => view.region === 'primarySidebar');
      this.contextService.patch({
        activeActivityId: activityId,
        activeViewId: this.contextService.context().activeViewId ?? primaryView?.id ?? null,
      });
      return;
    }
    this.layout.selectPrimaryView(activityView?.id ?? null);
    this.contextService.patch({ activeActivityId: activityId, activeViewId: activityView?.id ?? null });
  }

  openPalette(): void {
    this.paletteQuery.set('');
    this.commandError.set(null);
    this.paletteOpen.set(true);
  }

  closePalette(): void {
    this.paletteOpen.set(false);
    this.commandError.set(null);
  }

  toggleTheme(): void {
    const nextTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    try {
      window.localStorage.setItem(WorkbenchShellComponent.themeStorageKey, nextTheme);
    } catch {
    }
  }

  toggleThemeSettings(): void {
    this.themeSettingsOpen.update((open) => !open);
  }

  closeThemeSettings(): void {
    this.themeSettingsOpen.set(false);
  }

  themeColorValue(key: ThemeColorKey): string {
    return this.customThemeColors()[key] ?? (this.theme() === 'light' ? LIGHT_THEME_COLORS[key] : DARK_THEME_COLORS[key]);
  }

  updateThemeColor(key: string, value: string): void {
    if (!(key in THEME_VARIABLES) || !this.isHexColor(value)) {
      return;
    }
    this.customThemeColors.update((colors) => ({ ...colors, [key as ThemeColorKey]: value }));
    this.persistCustomTheme();
  }

  applyThemePreset(presetId: string): void {
    const preset = this.themePresets.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }
    this.customThemeColors.set({ ...preset.colors });
    this.persistCustomTheme();
  }

  resetCustomTheme(): void {
    this.customThemeColors.set({});
    try {
      window.localStorage.removeItem(WorkbenchShellComponent.customThemeStorageKey);
    } catch {
    }
  }

  openPaletteAndFocus(): void {
    this.openPalette();
    queueMicrotask(() => queueMicrotask(() => this.paletteInput?.nativeElement.focus()));
  }

  async execute(command: CommandDescriptor): Promise<void> {
    try {
      this.commandError.set(null);
      await this.registry.executeCommand(command.id, this.contextService.context());
      if (command.id !== 'workbench.open-command-palette') {
        this.closePalette();
      }
    } catch (error) {
      this.commandError.set(error instanceof Error ? error.message : 'Command failed.');
    }
  }

  async executeCommandById(commandId: string): Promise<void> {
    const command = this.registry.getCommand(commandId);
    if (command) {
      await this.execute(command);
    }
  }

  startResize(target: LayoutResizeTarget, event: PointerEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const state = this.layout.state();
    this.resizeSession = {
      target,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: target === 'primarySidebar' ? state.primarySidebarWidth : target === 'secondarySidebar' ? state.secondarySidebarWidth : state.bottomPanelHeight,
    };
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const session = this.resizeSession;
    if (!session || session.pointerId !== event.pointerId) {
      return;
    }
    const delta = session.target === 'primarySidebar'
      ? event.clientX - session.startX
      : session.target === 'secondarySidebar'
        ? session.startX - event.clientX
        : session.startY - event.clientY;
    this.layout.resize(session.target, session.startSize + delta);
  }

  @HostListener('window:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.resizeSession?.pointerId === event.pointerId) {
      this.finishResize();
    }
  }

  @HostListener('window:pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent): void {
    if (this.resizeSession?.pointerId === event.pointerId) {
      this.finishResize();
    }
  }

  finishResize(): void {
    this.layout.finishResize();
    this.resizeSession = null;
  }

  resizeWithKeyboard(target: LayoutResizeTarget, event: KeyboardEvent): void {
    const direction = target === 'bottomPanel'
      ? event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0
      : event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const state = this.layout.state();
    const current = target === 'primarySidebar' ? state.primarySidebarWidth : target === 'secondarySidebar' ? state.secondarySidebarWidth : state.bottomPanelHeight;
    const limits = target === 'primarySidebar' ? { min: 200, max: 480 } : target === 'secondarySidebar' ? { min: 220, max: 460 } : { min: 96, max: 520 };
    const next = event.key === 'Home' ? limits.min : event.key === 'End' ? limits.max : current + direction * (event.shiftKey ? 48 : 16);
    if (direction !== 0 || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.layout.resize(target, next);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented || this.isEditableTarget(event.target)) {
      return;
    }
    const binding = this.keybinding(event);
    const command = this.registry.commands().find((entry) => entry.keybinding === binding && (!entry.when || entry.when(this.contextService.context())));
    if (command) {
      event.preventDefault();
      event.stopPropagation();
      void this.execute(command);
    }
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  trackByInstance(_: number, item: { instanceId: string }): string {
    return item.instanceId;
  }

  private visibleViews(region: WorkbenchRegion) {
    return this.registry.views().filter((view) => view.region === region && this.isVisible(view.when));
  }

  private isVisible(when?: (context: ReturnType<WorkbenchContextService['context']>) => boolean): boolean {
    return !when || when(this.contextService.context());
  }

  private focusTarget(target: LayoutFocusTarget): void {
    if (target === 'commandPalette') {
      this.openPaletteAndFocus();
      return;
    }
    const element = target === 'primarySidebar'
      ? this.primarySidebar?.nativeElement
      : target === 'secondarySidebar'
        ? this.secondarySidebar?.nativeElement
        : target === 'bottomPanel'
          ? this.bottomPanel?.nativeElement
          : this.mainWorkbench?.nativeElement;
    (element ?? this.mainWorkbench?.nativeElement)?.focus({ preventScroll: true });
  }

  private keybinding(event: KeyboardEvent): string {
    const modifiers = [event.ctrlKey ? 'Ctrl' : '', event.altKey ? 'Alt' : '', event.shiftKey ? 'Shift' : ''].filter(Boolean);
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    return [...modifiers, key].join('+');
  }

  private isEditableTarget(target: EventTarget | null): boolean {
    const element = target as HTMLElement | null;
    return element?.tagName === 'INPUT' || element?.tagName === 'TEXTAREA' || element?.isContentEditable === true;
  }

  private readTheme(): 'dark' | 'light' {
    try {
      return window.localStorage.getItem(WorkbenchShellComponent.themeStorageKey) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }

  private readCustomTheme(): Partial<Record<ThemeColorKey, string>> {
    try {
      const raw = window.localStorage.getItem(WorkbenchShellComponent.customThemeStorageKey);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return Object.fromEntries(
        Object.entries(parsed).filter(([key, value]) => key in THEME_VARIABLES && typeof value === 'string' && this.isHexColor(value)),
      ) as Partial<Record<ThemeColorKey, string>>;
    } catch {
      return {};
    }
  }

  private persistCustomTheme(): void {
    try {
      window.localStorage.setItem(WorkbenchShellComponent.customThemeStorageKey, JSON.stringify(this.customThemeColors()));
    } catch {
    }
  }

  private isHexColor(value: string): boolean {
    return /^#[0-9a-f]{6}$/i.test(value);
  }
}