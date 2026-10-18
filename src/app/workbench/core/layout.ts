import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import {
  LayoutFocusTarget,
  LayoutResizeTarget,
  WorkbenchConfiguration,
  WorkbenchLayoutSnapshot,
  WorkbenchLayoutState,
  WorkspaceStorage,
} from './contracts';
import { WorkbenchRegistry } from './registry';
import { WORKSPACE_STORAGE } from './workspace';

export const WORKBENCH_LAYOUT_STORAGE_KEY = 'modular-workbench.layout';
export const WORKBENCH_LAYOUT_LIMITS = {
  primarySidebarMin: 200,
  primarySidebarMax: 480,
  secondarySidebarMin: 220,
  secondarySidebarMax: 460,
  bottomPanelMin: 96,
  bottomPanelMax: 520,
  bottomPanelDefault: 184,
  primarySidebarDefault: 264,
  secondarySidebarDefault: 280,
} as const;

export interface LayoutFocusRequest {
  readonly target: LayoutFocusTarget;
  readonly sequence: number;
}

const DEFAULT_STATE: WorkbenchLayoutState = {
  activeActivityId: null,
  activePrimaryViewId: null,
  activeSecondaryViewId: null,
  activePanelId: null,
  primarySidebarVisible: true,
  secondarySidebarVisible: false,
  bottomPanelVisible: true,
  bottomPanelMaximized: false,
  bottomPanelPreviousHeight: null,
  primarySidebarWidth: WORKBENCH_LAYOUT_LIMITS.primarySidebarDefault,
  secondarySidebarWidth: WORKBENCH_LAYOUT_LIMITS.secondarySidebarDefault,
  bottomPanelHeight: WORKBENCH_LAYOUT_LIMITS.bottomPanelDefault,
};

@Injectable({ providedIn: 'root' })
export class WorkbenchLayoutService {
  private readonly registry = inject(WorkbenchRegistry);
  private readonly storage = inject(WORKSPACE_STORAGE);
  private configuration: WorkbenchConfiguration | null = null;
  private configuredScope: string | null = null;
  private focusSequence = 0;

  readonly state = signal<WorkbenchLayoutState>(DEFAULT_STATE);
  readonly focusRequest = signal<LayoutFocusRequest | null>(null);

  configure(configuration: WorkbenchConfiguration): void {
    const scope = `${configuration.applicationId}:${configuration.workspaceId}`;
    this.configuration = configuration;
    if (this.configuredScope === scope) {
      this.state.update((current) => this.enforceConfiguration(current));
      return;
    }
    this.configuredScope = scope;
    const restored = configuration.layoutPersistence === false ? null : this.restore(configuration);
    this.state.set(this.enforceConfiguration(restored ?? this.defaultState()));
  }

  togglePrimarySidebar(): void {
    if (!this.configuration?.primarySidebar) {
      return;
    }
    const visible = !this.state().primarySidebarVisible;
    this.update({ primarySidebarVisible: visible, secondarySidebarVisible: false });
    this.requestFocus(visible ? 'primarySidebar' : 'mainWorkbench');
  }

  toggleSecondarySidebar(): void {
    if (!this.configuration?.secondarySidebar) {
      return;
    }
    const visible = !this.state().secondarySidebarVisible;
    this.update({ secondarySidebarVisible: visible });
    this.requestFocus(visible ? 'secondarySidebar' : 'mainWorkbench');
  }

  toggleBottomPanel(): void {
    if (!this.configuration?.bottomPanel) {
      return;
    }
    const visible = !this.state().bottomPanelVisible;
    this.update({ bottomPanelVisible: visible });
    this.requestFocus(visible ? 'bottomPanel' : 'mainWorkbench');
  }

  toggleBottomPanelMaximized(): void {
    if (!this.configuration?.bottomPanel) {
      return;
    }
    const current = this.state();
    if (current.bottomPanelMaximized) {
      this.update({
        bottomPanelMaximized: false,
        bottomPanelHeight: current.bottomPanelPreviousHeight ?? WORKBENCH_LAYOUT_LIMITS.bottomPanelDefault,
        bottomPanelPreviousHeight: null,
        bottomPanelVisible: true,
      });
      return;
    }
    this.update({
      bottomPanelMaximized: true,
      bottomPanelPreviousHeight: current.bottomPanelHeight,
      bottomPanelVisible: true,
    });
  }

  setPrimarySidebarVisible(visible: boolean): void {
    if (this.configuration?.primarySidebar) {
      this.update({ primarySidebarVisible: visible });
    }
  }

  setSecondarySidebarVisible(visible: boolean): void {
    if (this.configuration?.secondarySidebar) {
      this.update({ secondarySidebarVisible: visible });
    }
  }

  setBottomPanelVisible(visible: boolean): void {
    if (this.configuration?.bottomPanel) {
      this.update({ bottomPanelVisible: visible });
    }
  }

  resize(target: LayoutResizeTarget, size: number, persist = false): void {
    const limits = this.limits(target);
    const clamped = Math.max(limits.min, Math.min(limits.max, Math.round(size)));
    if (target === 'primarySidebar') {
      this.update({ primarySidebarWidth: clamped }, persist);
    } else if (target === 'secondarySidebar') {
      this.update({ secondarySidebarWidth: clamped }, persist);
    } else {
      this.update({ bottomPanelHeight: clamped }, persist);
    }
  }

  finishResize(): void {
    this.persist();
  }

  selectPrimaryView(viewId: string | null): void {
    this.update({ activePrimaryViewId: viewId });
  }

  selectSecondaryView(viewId: string | null): void {
    this.update({ activeSecondaryViewId: viewId });
  }

  selectActivity(activityId: string | null): void {
    this.update({ activeActivityId: activityId });
  }

  selectPanel(panelId: string | null): void {
    this.update({ activePanelId: panelId });
  }

  resetLayout(): void {
    this.state.set(this.enforceConfiguration(this.defaultState()));
    this.persist();
  }

  requestFocus(target: LayoutFocusTarget): void {
    this.focusSequence += 1;
    this.focusRequest.set({ target, sequence: this.focusSequence });
  }

  clearPersistence(): void {
    this.storage.remove(WORKBENCH_LAYOUT_STORAGE_KEY);
  }

  private update(change: Partial<WorkbenchLayoutState>, persist = true): void {
    this.state.update((current) => ({ ...current, ...change }));
    if (persist) {
      this.persist();
    }
  }

  private defaultState(): WorkbenchLayoutState {
    const firstActivity = this.registry.activities()[0];
    const firstPrimaryView = this.registry.views().find((view) => view.region === 'primarySidebar');
    const firstSecondaryView = this.registry.views().find((view) => view.region === 'secondarySidebar');
    const firstPanel = this.registry.panels()[0];
    return {
      ...DEFAULT_STATE,
      activeActivityId: firstActivity?.id ?? null,
      activePrimaryViewId: firstPrimaryView?.id ?? null,
      activeSecondaryViewId: firstSecondaryView?.id ?? null,
      activePanelId: firstPanel?.id ?? null,
    };
  }

  private enforceConfiguration(state: WorkbenchLayoutState): WorkbenchLayoutState {
    return {
      ...state,
      primarySidebarVisible: this.configuration?.primarySidebar === true && state.primarySidebarVisible,
      secondarySidebarVisible: this.configuration?.secondarySidebar === true && state.secondarySidebarVisible,
      bottomPanelVisible: this.configuration?.bottomPanel === true && state.bottomPanelVisible,
      bottomPanelMaximized: this.configuration?.bottomPanel === true && state.bottomPanelMaximized,
    };
  }

  private restore(configuration: WorkbenchConfiguration): WorkbenchLayoutState | null {
    const snapshot = this.storage.read<WorkbenchLayoutSnapshot>(WORKBENCH_LAYOUT_STORAGE_KEY);
    if (!snapshot || snapshot.version !== 1 || snapshot.applicationId !== configuration.applicationId || snapshot.workspaceId !== configuration.workspaceId) {
      return null;
    }
    if (!this.isValidState(snapshot.state)) {
      this.storage.remove(WORKBENCH_LAYOUT_STORAGE_KEY);
      return null;
    }
    return {
      ...snapshot.state,
      primarySidebarWidth: this.clamp(snapshot.state.primarySidebarWidth, WORKBENCH_LAYOUT_LIMITS.primarySidebarMin, WORKBENCH_LAYOUT_LIMITS.primarySidebarMax),
      secondarySidebarWidth: this.clamp(snapshot.state.secondarySidebarWidth, WORKBENCH_LAYOUT_LIMITS.secondarySidebarMin, WORKBENCH_LAYOUT_LIMITS.secondarySidebarMax),
      bottomPanelHeight: this.clamp(snapshot.state.bottomPanelHeight, WORKBENCH_LAYOUT_LIMITS.bottomPanelMin, WORKBENCH_LAYOUT_LIMITS.bottomPanelMax),
    };
  }

  private persist(): void {
    if (!this.configuration || this.configuration.layoutPersistence === false) {
      return;
    }
    const snapshot: WorkbenchLayoutSnapshot = {
      version: 1,
      applicationId: this.configuration.applicationId,
      workspaceId: this.configuration.workspaceId,
      state: this.state(),
    };
    this.storage.write(WORKBENCH_LAYOUT_STORAGE_KEY, snapshot);
  }

  private isValidState(state: WorkbenchLayoutState): boolean {
    if (!state || typeof state !== 'object') {
      return false;
    }
    const booleans = [state.primarySidebarVisible, state.secondarySidebarVisible, state.bottomPanelVisible, state.bottomPanelMaximized];
    const numbers = [state.primarySidebarWidth, state.secondarySidebarWidth, state.bottomPanelHeight];
    return booleans.every((value) => typeof value === 'boolean') && numbers.every((value) => typeof value === 'number' && Number.isFinite(value));
  }

  private limits(target: LayoutResizeTarget): { min: number; max: number } {
    if (target === 'primarySidebar') {
      return { min: WORKBENCH_LAYOUT_LIMITS.primarySidebarMin, max: WORKBENCH_LAYOUT_LIMITS.primarySidebarMax };
    }
    if (target === 'secondarySidebar') {
      return { min: WORKBENCH_LAYOUT_LIMITS.secondarySidebarMin, max: WORKBENCH_LAYOUT_LIMITS.secondarySidebarMax };
    }
    return { min: WORKBENCH_LAYOUT_LIMITS.bottomPanelMin, max: WORKBENCH_LAYOUT_LIMITS.bottomPanelMax };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, Math.round(value)));
  }
}