import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import {
  EditorInstance,
  OpenEditorRequest,
  WorkspaceSnapshot,
  WorkspaceStorage,
} from './contracts';
import { WorkbenchContextService } from './context';
import { WorkbenchRegistry } from './registry';

export const WORKSPACE_STORAGE_KEY = 'modular-workbench.workspace';

@Injectable({ providedIn: 'root' })
export class BrowserWorkspaceStorage implements WorkspaceStorage {
  read<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Persistence is optional and must not prevent the workbench from running.
    }
  }

  remove(key: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
}

export const WORKSPACE_STORAGE = new InjectionToken<WorkspaceStorage>('WORKSPACE_STORAGE', {
  providedIn: 'root',
  factory: () => inject(BrowserWorkspaceStorage),
});

@Injectable({ providedIn: 'root' })
export class WorkbenchWorkspaceService {
  private readonly registry = inject(WorkbenchRegistry);
  private readonly context = inject(WorkbenchContextService);
  private readonly storage = inject(WORKSPACE_STORAGE);
  private readonly editorState = signal<readonly EditorInstance[]>([]);

  readonly editors = this.editorState.asReadonly();
  readonly activeEditorId = signal<string | null>(null);

  openEditor(request: OpenEditorRequest): string {
    const descriptor = this.registry.getEditor(request.descriptorId);
    if (!descriptor) {
      throw new Error(`Editor descriptor "${request.descriptorId}" is not registered.`);
    }
    const instanceId = this.instanceId(request);
    const existing = this.editorState().find((editor) => editor.instanceId === instanceId);
    if (existing) {
      this.activateEditor(instanceId);
      return instanceId;
    }
    const editor: EditorInstance = {
      ...request,
      instanceId,
      title: descriptor.titleFor?.(request.resourceId) ?? descriptor.title,
      icon: descriptor.icon ?? 'document',
      component: descriptor.component,
      inputs: descriptor.createInputs?.(request.resourceId) ?? {},
    };
    this.editorState.update((editors) => [...editors, editor]);
    this.activateEditor(instanceId);
    this.persist();
    return instanceId;
  }

  activateEditor(instanceId: string): void {
    if (!this.editorState().some((editor) => editor.instanceId === instanceId)) {
      return;
    }
    this.activeEditorId.set(instanceId);
    this.context.patch({ activeEditorId: instanceId });
    this.persist();
  }

  closeEditor(instanceId: string): void {
    const editors = this.editorState();
    const index = editors.findIndex((editor) => editor.instanceId === instanceId);
    if (index === -1) {
      return;
    }
    const remaining = editors.filter((editor) => editor.instanceId !== instanceId);
    this.editorState.set(remaining);
    if (this.activeEditorId() === instanceId) {
      const next = remaining[index] ?? remaining[index - 1] ?? null;
      this.activeEditorId.set(next?.instanceId ?? null);
      this.context.patch({ activeEditorId: next?.instanceId ?? null });
    }
    this.persist();
  }

  restore(): boolean {
    const snapshot = this.storage.read<WorkspaceSnapshot>(WORKSPACE_STORAGE_KEY);
    if (!snapshot || snapshot.version !== 1 || !Array.isArray(snapshot.openEditors)) {
      return false;
    }
    try {
      for (const request of snapshot.openEditors) {
        if (this.registry.getEditor(request.descriptorId)) {
          this.openEditor(request);
        }
      }
      if (snapshot.activeEditorId) {
        this.activateEditor(snapshot.activeEditorId);
      }
      return this.editorState().length > 0;
    } catch {
      this.storage.remove(WORKSPACE_STORAGE_KEY);
      this.editorState.set([]);
      this.activeEditorId.set(null);
      this.context.patch({ activeEditorId: null });
      return false;
    }
  }

  clearPersistence(): void {
    this.storage.remove(WORKSPACE_STORAGE_KEY);
  }

  private persist(): void {
    const snapshot: WorkspaceSnapshot = {
      version: 1,
      openEditors: this.editorState().map(({ descriptorId, resourceId }) => ({
        descriptorId,
        ...(resourceId ? { resourceId } : {}),
      })),
      activeEditorId: this.activeEditorId(),
    };
    this.storage.write(WORKSPACE_STORAGE_KEY, snapshot);
  }

  private instanceId(request: OpenEditorRequest): string {
    return `${request.descriptorId}:${request.resourceId ?? 'default'}`;
  }
}