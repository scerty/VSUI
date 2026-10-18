import { Injectable, inject } from '@angular/core';
import { ProjectExplorerComponent } from './project-explorer';
import { DemoDocumentEditor } from './document-editor';
import { DemoOutputPanelComponent } from './output-panel';
import { WorkbenchContextService } from '../workbench/core/context';
import { Disposable, WorkbenchFeature, WorkbenchRegistryLike } from '../workbench/core/contracts';
import { WorkbenchWorkspaceService } from '../workbench/core/workspace';

@Injectable({ providedIn: 'root' })
export class DemoFeature implements WorkbenchFeature {
  readonly id = 'demo.documents';
  private readonly context = inject(WorkbenchContextService);
  private readonly workspace = inject(WorkbenchWorkspaceService);

  register(registry: WorkbenchRegistryLike): Disposable {
    const contributions: Disposable[] = [
      registry.registerActivity({ id: 'explorer', label: 'Explorer', icon: 'folder', viewIds: ['demo.project-explorer'], order: 1 }),
      registry.registerView({ id: 'demo.project-explorer', title: 'Project Explorer', icon: 'folder', region: 'primarySidebar', component: ProjectExplorerComponent }),
      registry.registerPanel({ id: 'demo.output', title: 'Output', component: DemoOutputPanelComponent, order: 1 }),
      registry.registerEditor({
        id: 'demo.document',
        title: 'Document',
        icon: 'note',
        component: DemoDocumentEditor,
        titleFor: (resourceId) => ({
          'workbench-brief': 'Workbench Brief',
          'extension-contracts': 'Extension Contracts',
          'restoration-notes': 'Restoration Notes',
        })[resourceId ?? ''] ?? 'Document',
        createInputs: (resourceId) => ({ documentId: resourceId ?? 'workbench-brief' }),
      }),
      registry.registerCommand({
        id: 'demo.open-selected',
        title: 'Open Selected Document',
        category: 'Demo',
        keybinding: 'Enter',
        when: (context) => context.selection?.kind === 'document',
        execute: (context) => {
          const selection = context.selection;
          if (selection?.kind === 'document') {
            this.workspace.openEditor({ descriptorId: 'demo.document', resourceId: selection.id });
          }
        },
      }),
      registry.registerCommand({
        id: 'demo.open-brief',
        title: 'Open Workbench Brief',
        category: 'Demo',
        execute: () => {
          this.workspace.openEditor({ descriptorId: 'demo.document', resourceId: 'workbench-brief' });
        },
      }),
      registry.registerContextMenuAction({
        id: 'demo.open-selected-action',
        title: 'Open in editor',
        commandId: 'demo.open-selected',
        location: 'view',
        order: 1,
        when: (context) => context.selection?.kind === 'document',
      }),
    ];
    return {
      dispose: () => contributions.reverse().forEach((contribution) => contribution.dispose()),
    };
  }

  clearSelection(): void {
    this.context.setSelection(null);
  }
}