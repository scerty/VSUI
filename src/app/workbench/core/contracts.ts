import { Type } from '@angular/core';

export type WorkbenchRegion = 'primarySidebar' | 'secondarySidebar' | 'bottomPanel';
export type ContextMenuLocation = 'view' | 'editor' | 'panel';
export type LayoutResizeTarget = 'primarySidebar' | 'secondarySidebar' | 'bottomPanel';
export type LayoutFocusTarget = 'mainWorkbench' | 'primarySidebar' | 'secondarySidebar' | 'bottomPanel' | 'commandPalette';

export interface Disposable {
  dispose(): void;
}

export interface WorkbenchSelection {
  readonly kind: string;
  readonly id: string;
  readonly label: string;
  readonly [key: string]: unknown;
}

export interface WorkspaceContext {
  readonly applicationId: string;
  readonly workspaceId: string;
  readonly activeExtensionId: string | null;
  readonly activeActivityId: string | null;
  readonly activeViewId: string | null;
  readonly activeEditorId: string | null;
  readonly selection: WorkbenchSelection | null;
  readonly permissions: readonly string[];
}

export type ContextPredicate = (context: WorkspaceContext) => boolean;

export interface ViewDescriptor {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly region: WorkbenchRegion;
  readonly component: Type<unknown>;
  readonly order?: number;
  readonly when?: ContextPredicate;
}

export interface PanelDescriptor {
  readonly id: string;
  readonly title: string;
  readonly component: Type<unknown>;
  readonly order?: number;
  readonly when?: ContextPredicate;
}

export interface EditorDescriptor {
  readonly id: string;
  readonly title: string;
  readonly icon?: string;
  readonly component: Type<unknown>;
  readonly titleFor?: (resourceId?: string) => string;
  readonly createInputs?: (resourceId?: string) => Record<string, unknown>;
}

export interface OpenEditorRequest {
  readonly descriptorId: string;
  readonly resourceId?: string;
}

export interface EditorInstance extends OpenEditorRequest {
  readonly instanceId: string;
  readonly title: string;
  readonly icon: string;
  readonly component: Type<unknown>;
  readonly inputs: Record<string, unknown>;
}

export interface CommandDescriptor {
  readonly id: string;
  readonly title: string;
  readonly category?: string;
  readonly keybinding?: string;
  readonly order?: number;
  readonly when?: ContextPredicate;
  readonly execute: (context: WorkspaceContext) => void | Promise<void>;
}

export interface ContextMenuActionDescriptor {
  readonly id: string;
  readonly title: string;
  readonly commandId: string;
  readonly location: ContextMenuLocation;
  readonly order?: number;
  readonly when?: ContextPredicate;
}

export interface AiRequestContext {
  readonly prompt: string;
  readonly workspace: WorkspaceContext;
  readonly selection: WorkbenchSelection | null;
}

export interface AiSuggestion {
  readonly id: string;
  readonly title: string;
  readonly detail?: string;
  readonly commandId?: string;
}

export interface AiActionDescriptor {
  readonly id: string;
  readonly title: string;
  readonly when?: ContextPredicate;
  readonly execute: (request: AiRequestContext) => void | Promise<void>;
}

export interface AiCapability {
  readonly id: string;
  suggest(request: AiRequestContext): readonly AiSuggestion[] | Promise<readonly AiSuggestion[]>;
  actions: readonly AiActionDescriptor[];
}

export interface ActivityDescriptor {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly viewIds: readonly string[];
  readonly order?: number;
}

export interface WorkbenchFeature {
  readonly id: string;
  register(registry: WorkbenchRegistryLike): Disposable;
}

export interface WorkbenchRegistryLike {
  registerView(view: ViewDescriptor): Disposable;
  registerPanel(panel: PanelDescriptor): Disposable;
  registerEditor(editor: EditorDescriptor): Disposable;
  registerCommand(command: CommandDescriptor): Disposable;
  registerContextMenuAction(action: ContextMenuActionDescriptor): Disposable;
  registerActivity(activity: ActivityDescriptor): Disposable;
}

export interface WorkbenchConfiguration {
  readonly applicationId: string;
  readonly workspaceId: string;
  readonly activityBar: boolean;
  readonly primarySidebar: boolean;
  readonly secondarySidebar: boolean;
  readonly bottomPanel: boolean;
  readonly statusBar: boolean;
  readonly commandPalette: boolean;
  readonly layoutPersistence?: boolean;
}

export interface WorkbenchLayoutState {
  readonly activeActivityId: string | null;
  readonly activePrimaryViewId: string | null;
  readonly activeSecondaryViewId: string | null;
  readonly activePanelId: string | null;
  readonly primarySidebarVisible: boolean;
  readonly secondarySidebarVisible: boolean;
  readonly bottomPanelVisible: boolean;
  readonly bottomPanelMaximized: boolean;
  readonly bottomPanelPreviousHeight: number | null;
  readonly primarySidebarWidth: number;
  readonly secondarySidebarWidth: number;
  readonly bottomPanelHeight: number;
}

export interface WorkbenchLayoutSnapshot {
  readonly version: 1;
  readonly applicationId: string;
  readonly workspaceId: string;
  readonly state: WorkbenchLayoutState;
}

export function validateWorkbenchConfiguration(configuration: WorkbenchConfiguration): readonly string[] {
  const errors: string[] = [];
  if (!configuration.applicationId.trim()) {
    errors.push('applicationId must not be empty.');
  }
  if (!configuration.workspaceId.trim()) {
    errors.push('workspaceId must not be empty.');
  }
  for (const key of ['activityBar', 'primarySidebar', 'secondarySidebar', 'bottomPanel', 'statusBar', 'commandPalette'] as const) {
    if (typeof configuration[key] !== 'boolean') {
      errors.push(`${key} must be a boolean.`);
    }
  }
  return errors;
}

export interface WorkspaceSnapshot {
  readonly version: 1;
  readonly openEditors: readonly OpenEditorRequest[];
  readonly activeEditorId: string | null;
}

export interface WorkspaceStorage {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}

import type { WorkbenchRegistry } from './registry';