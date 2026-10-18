import { Component, computed, inject, signal } from '@angular/core';
import { ChevronDown, ChevronRight, FileText, Files, LucideAngularModule } from 'lucide-angular';
import { WorkbenchContextService } from '../workbench/core/context';
import { ContextMenuActionDescriptor } from '../workbench/core/contracts';
import { WorkbenchRegistry } from '../workbench/core/registry';

interface ExplorerItem {
  readonly id: string;
  readonly label: string;
  readonly type: string;
}

const ITEMS: readonly ExplorerItem[] = [
  { id: 'workbench-brief', label: 'Workbench Brief', type: 'note' },
  { id: 'extension-contracts', label: 'Extension Contracts', type: 'note' },
  { id: 'restoration-notes', label: 'Restoration Notes', type: 'note' },
];

@Component({
  selector: 'demo-project-explorer',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section class="explorer">
      <div class="workspace-root">
        <div class="workspace-root-label"><lucide-icon [img]="icons.files" [size]="14"></lucide-icon><span>REFERENCE-WORKSPACE</span></div>
        <button class="tree-tool" type="button" aria-label="More workspace actions"><lucide-icon [img]="icons.chevronDown" [size]="13"></lucide-icon></button>
      </div>
      <div class="tree-heading"><span><lucide-icon [img]="icons.chevronDown" [size]="13"></lucide-icon> PROJECT NOTES</span><span class="tree-count">{{ items.length }}</span></div>
      <div class="tree" role="tree" aria-label="Project notes">
        @for (item of items; track item.id) {
          <button class="tree-item" type="button" role="treeitem" [class.selected]="selectedId() === item.id" [attr.aria-selected]="selectedId() === item.id" (click)="select(item)">
            <lucide-icon class="tree-chevron" [img]="icons.chevronRight" [size]="13"></lucide-icon><lucide-icon class="tree-file" [img]="icons.fileText" [size]="14"></lucide-icon><span>{{ item.label }}</span>
          </button>
        }
      </div>
      @if (actions().length) {
        <div class="context-actions" aria-label="Actions for selected item">
          <span class="context-heading">SELECTED ITEM</span>
          @for (action of actions(); track action.id) {
            <button type="button" (click)="run(action)"><lucide-icon [img]="icons.fileText" [size]="13"></lucide-icon>{{ action.title }}</button>
          }
        </div>
      }
      @if (error(); as message) { <p class="explorer-error" role="alert">{{ message }}</p> }
    </section>
  `,
  styles: `
    :host { display: block; }
    .explorer { min-height: 100%; padding-bottom: 18px; }
    .workspace-root { display: flex; align-items: center; justify-content: space-between; min-height: 35px; padding: 0 9px 0 12px; color: var(--wb-text-soft); font-size: .65rem; font-weight: 600; }
    .workspace-root-label, .tree-heading > span:first-child { display: inline-flex; align-items: center; gap: 6px; min-width: 0; }
    .workspace-root-label span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .workspace-root-label lucide-icon { color: var(--wb-accent); }
    .tree-tool { display: grid; place-items: center; width: 22px; height: 22px; padding: 0; border: 0; color: var(--wb-muted); background: transparent; cursor: pointer; }
    .tree-tool:hover { color: var(--wb-text); background: var(--wb-surface-hover); }
    .tree-heading { display: flex; justify-content: space-between; padding: 9px 12px 6px; color: var(--wb-muted); font-size: .58rem; font-weight: 600; letter-spacing: .08em; }
    .tree-count { color: var(--wb-border-strong); }
    .tree { padding: 0 8px; }
    .tree-item { display: flex; align-items: center; gap: 6px; width: 100%; min-height: 26px; padding: 3px 5px; border: 0; border-radius: 2px; color: var(--wb-muted); background: transparent; cursor: pointer; font: inherit; font-size: .68rem; text-align: left; }
    .tree-item:hover, .tree-item.selected { color: var(--wb-text); background: var(--wb-accent-soft); }
    .tree-chevron, .tree-file, .context-actions lucide-icon { display: inline-flex; flex: 0 0 auto; }
    .tree-chevron { color: var(--wb-muted); }
    .tree-file { color: var(--wb-accent); }
    .context-actions { display: grid; gap: 4px; margin: 18px 10px 0; padding: 9px 8px 8px; border-top: 1px solid var(--wb-border); }
    .context-heading { padding: 0 4px 3px; color: var(--wb-muted); font-size: .57rem; font-weight: 600; letter-spacing: .08em; }
    .context-actions button { display: flex; align-items: center; gap: 7px; padding: 5px 4px; border: 0; color: var(--wb-text-soft); background: transparent; cursor: pointer; font: inherit; font-size: .65rem; text-align: left; }
    .context-actions button:hover { color: var(--wb-accent); }
    .context-actions button lucide-icon { color: var(--wb-accent); }
    .explorer-error { margin: 14px 16px 0; color: var(--wb-red); font-size: .63rem; }
  `,
})
export class ProjectExplorerComponent {
  private readonly context = inject(WorkbenchContextService);
  private readonly registry = inject(WorkbenchRegistry);
  readonly items = ITEMS;
  readonly icons = {
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
    fileText: FileText,
    files: Files,
  };
  readonly error = signal<string | null>(null);
  readonly selectedId = computed(() => {
    const selection = this.context.selection();
    return selection?.kind === 'document' ? selection.id : null;
  });
  readonly actions = computed(() =>
    this.registry.availableContextMenuActions('view', this.context.context()),
  );

  select(item: ExplorerItem): void {
    this.error.set(null);
    this.context.setSelection({ kind: 'document', id: item.id, label: item.label, type: item.type });
  }

  async run(action: ContextMenuActionDescriptor): Promise<void> {
    try {
      this.error.set(null);
      await this.registry.executeCommand(action.commandId, this.context.context());
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Action failed.');
    }
  }
}