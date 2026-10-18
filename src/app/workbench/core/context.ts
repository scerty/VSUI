import { Injectable, computed, signal } from '@angular/core';
import { WorkbenchSelection, WorkspaceContext } from './contracts';

@Injectable({ providedIn: 'root' })
export class WorkbenchContextService {
  private readonly state = signal<WorkspaceContext>({
    applicationId: 'workbench',
    workspaceId: 'default',
    activeExtensionId: null,
    activeActivityId: null,
    activeViewId: null,
    activeEditorId: null,
    selection: null,
    permissions: [],
  });

  readonly context = this.state.asReadonly();
  readonly selection = computed(() => this.state().selection);

  configure(applicationId: string, workspaceId: string): void {
    this.patch({ applicationId, workspaceId });
  }

  patch(change: Partial<WorkspaceContext>): void {
    this.state.update((current) => ({ ...current, ...change }));
  }

  setSelection(selection: WorkbenchSelection | null): void {
    this.patch({ selection });
  }
}