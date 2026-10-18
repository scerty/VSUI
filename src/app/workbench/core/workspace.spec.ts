import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { WorkspaceSnapshot, WorkspaceStorage } from './contracts';
import { WorkbenchContextService } from './context';
import { WorkbenchRegistry } from './registry';
import { WORKSPACE_STORAGE, WORKSPACE_STORAGE_KEY, WorkbenchWorkspaceService } from './workspace';

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

class EditorHost {}

describe('WorkbenchWorkspaceService', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    TestBed.configureTestingModule({
      providers: [
        WorkbenchRegistry,
        WorkbenchContextService,
        WorkbenchWorkspaceService,
        { provide: WORKSPACE_STORAGE, useValue: storage },
      ],
    });
  });

  it('opens, activates, and closes editor instances', () => {
    const registry = TestBed.inject(WorkbenchRegistry);
    const workspace = TestBed.inject(WorkbenchWorkspaceService);
    registry.registerEditor({
      id: 'test.editor',
      title: 'Test editor',
      component: EditorHost as Type<unknown>,
      titleFor: (resourceId) => resourceId ?? 'Test editor',
    });

    const instanceId = workspace.openEditor({ descriptorId: 'test.editor', resourceId: 'alpha' });
    expect(workspace.editors()).toHaveLength(1);
    expect(workspace.activeEditorId()).toBe(instanceId);
    workspace.closeEditor(instanceId);
    expect(workspace.editors()).toHaveLength(0);
    expect(workspace.activeEditorId()).toBeNull();
  });

  it('restores only registered editor descriptors from persisted state', () => {
    const snapshot: WorkspaceSnapshot = {
      version: 1,
      openEditors: [
        { descriptorId: 'test.editor', resourceId: 'alpha' },
        { descriptorId: 'missing.editor', resourceId: 'ignored' },
      ],
      activeEditorId: 'test.editor:alpha',
    };
    storage.write(WORKSPACE_STORAGE_KEY, snapshot);
    const registry = TestBed.inject(WorkbenchRegistry);
    const workspace = TestBed.inject(WorkbenchWorkspaceService);
    registry.registerEditor({
      id: 'test.editor',
      title: 'Test editor',
      component: EditorHost as Type<unknown>,
      createInputs: (resourceId) => ({ resourceId }),
    });

    expect(workspace.restore()).toBe(true);
    expect(workspace.editors().map((editor) => editor.resourceId)).toEqual(['alpha']);
    expect(workspace.activeEditorId()).toBe('test.editor:alpha');
  });
});