import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import {
  WorkbenchConfiguration,
  WorkbenchLayoutSnapshot,
  WorkspaceStorage,
} from './contracts';
import { WorkbenchLayoutService, WORKBENCH_LAYOUT_LIMITS, WORKBENCH_LAYOUT_STORAGE_KEY } from './layout';
import { WorkbenchRegistry } from './registry';
import { WORKSPACE_STORAGE } from './workspace';

class MemoryStorage implements WorkspaceStorage {
  readonly values = new Map<string, unknown>();

  read<T>(key: string): T | null {
    return (this.values.get(key) as T | undefined) ?? null;
  }

  write<T>(key: string, value: T): void {
    this.values.set(key, value);
  }

  remove(key: string): void {
    this.values.delete(key);
  }
}

class ViewHost {}
class PanelHost {}

const configuration = (overrides: Partial<WorkbenchConfiguration> = {}): WorkbenchConfiguration => ({
  applicationId: 'layout-test',
  workspaceId: 'workspace',
  activityBar: true,
  primarySidebar: true,
  secondarySidebar: true,
  bottomPanel: true,
  statusBar: true,
  commandPalette: true,
  layoutPersistence: true,
  ...overrides,
});

describe('WorkbenchLayoutService', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [
        WorkbenchRegistry,
        WorkbenchLayoutService,
        { provide: WORKSPACE_STORAGE, useValue: storage },
      ],
    });
  });

  function registerContent(): void {
    const registry = TestBed.inject(WorkbenchRegistry);
    registry.registerActivity({ id: 'test.activity', label: 'Test', icon: 'folder', viewIds: ['test.view'] });
    registry.registerView({ id: 'test.view', title: 'Test view', icon: 'folder', region: 'primarySidebar', component: ViewHost as Type<unknown> });
    registry.registerPanel({ id: 'test.panel', title: 'Output', component: PanelHost as Type<unknown> });
  }

  it('toggles independent regions and requests predictable focus', () => {
    registerContent();
    const layout = TestBed.inject(WorkbenchLayoutService);
    layout.configure(configuration());

    layout.togglePrimarySidebar();
    expect(layout.state().primarySidebarVisible).toBe(false);
    expect(layout.state().secondarySidebarVisible).toBe(false);
    expect(layout.focusRequest()?.target).toBe('mainWorkbench');
    layout.toggleSecondarySidebar();
    expect(layout.state().secondarySidebarVisible).toBe(true);
    expect(layout.focusRequest()?.target).toBe('secondarySidebar');
    layout.togglePrimarySidebar();
    expect(layout.state().primarySidebarVisible).toBe(true);
    expect(layout.state().secondarySidebarVisible).toBe(false);
    layout.toggleBottomPanel();
    expect(layout.state().bottomPanelVisible).toBe(false);
    expect(layout.focusRequest()?.target).toBe('mainWorkbench');
  });

  it('clamps dimensions and restores a maximized panel size', () => {
    registerContent();
    const layout = TestBed.inject(WorkbenchLayoutService);
    layout.configure(configuration());

    layout.resize('primarySidebar', 999);
    layout.resize('secondarySidebar', 1);
    layout.resize('bottomPanel', 999);
    expect(layout.state().primarySidebarWidth).toBe(WORKBENCH_LAYOUT_LIMITS.primarySidebarMax);
    expect(layout.state().secondarySidebarWidth).toBe(WORKBENCH_LAYOUT_LIMITS.secondarySidebarMin);
    expect(layout.state().bottomPanelHeight).toBe(WORKBENCH_LAYOUT_LIMITS.bottomPanelMax);

    layout.resize('bottomPanel', 240);
    layout.toggleBottomPanelMaximized();
    expect(layout.state().bottomPanelMaximized).toBe(true);
    expect(layout.state().bottomPanelPreviousHeight).toBe(240);
    layout.toggleBottomPanelMaximized();
    expect(layout.state().bottomPanelMaximized).toBe(false);
    expect(layout.state().bottomPanelHeight).toBe(240);
  });

  it('persists and restores layout state without writing during initialization', () => {
    registerContent();
    const layout = TestBed.inject(WorkbenchLayoutService);
    layout.configure(configuration());
    expect(storage.values.has(WORKBENCH_LAYOUT_STORAGE_KEY)).toBe(false);
    layout.togglePrimarySidebar();
    layout.resize('primarySidebar', 340);
    layout.finishResize();
    const saved = storage.read<WorkbenchLayoutSnapshot>(WORKBENCH_LAYOUT_STORAGE_KEY);
    expect(saved?.state.primarySidebarVisible).toBe(false);
    expect(saved?.state.primarySidebarWidth).toBe(340);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [WorkbenchRegistry, WorkbenchLayoutService, { provide: WORKSPACE_STORAGE, useValue: storage }],
    });
    registerContent();
    const restored = TestBed.inject(WorkbenchLayoutService);
    restored.configure(configuration());
    expect(restored.state().primarySidebarVisible).toBe(false);
    expect(restored.state().primarySidebarWidth).toBe(340);
  });

  it('falls back safely for invalid state and never enables disabled regions', () => {
    storage.write(WORKBENCH_LAYOUT_STORAGE_KEY, {
      version: 1,
      applicationId: 'layout-test',
      workspaceId: 'workspace',
      state: {
        primarySidebarVisible: 'yes',
        secondarySidebarVisible: true,
        bottomPanelVisible: true,
        bottomPanelMaximized: false,
        primarySidebarWidth: Number.NaN,
        secondarySidebarWidth: 280,
        bottomPanelHeight: 184,
      },
    } as unknown as WorkbenchLayoutSnapshot);
    const layout = TestBed.inject(WorkbenchLayoutService);
    layout.configure(configuration({ primarySidebar: false, bottomPanel: false }));
    expect(layout.state().primarySidebarVisible).toBe(false);
    expect(layout.state().bottomPanelVisible).toBe(false);
    expect(storage.values.has(WORKBENCH_LAYOUT_STORAGE_KEY)).toBe(false);
    layout.togglePrimarySidebar();
    layout.toggleBottomPanel();
    expect(layout.state().primarySidebarVisible).toBe(false);
    expect(layout.state().bottomPanelVisible).toBe(false);
  });

  it('resets dimensions and visibility to documented defaults', () => {
    registerContent();
    const layout = TestBed.inject(WorkbenchLayoutService);
    layout.configure(configuration());
    layout.togglePrimarySidebar();
    layout.resize('primarySidebar', 420);
    layout.resetLayout();
    expect(layout.state().primarySidebarVisible).toBe(true);
    expect(layout.state().primarySidebarWidth).toBe(WORKBENCH_LAYOUT_LIMITS.primarySidebarDefault);
    expect(layout.state().bottomPanelHeight).toBe(WORKBENCH_LAYOUT_LIMITS.bottomPanelDefault);
  });
});