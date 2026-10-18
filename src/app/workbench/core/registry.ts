import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import {
  ActivityDescriptor,
  CommandDescriptor,
  ContextMenuActionDescriptor,
  ContextMenuLocation,
  Disposable,
  EditorDescriptor,
  PanelDescriptor,
  ViewDescriptor,
  WorkbenchFeature,
  WorkbenchRegistryLike,
  WorkspaceContext,
} from './contracts';

export class ContributionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContributionError';
  }
}

@Injectable({ providedIn: 'root' })
export class WorkbenchRegistry implements WorkbenchRegistryLike {
  private readonly featureIds = new Set<string>();
  private readonly viewState = signal<readonly ViewDescriptor[]>([]);
  private readonly panelState = signal<readonly PanelDescriptor[]>([]);
  private readonly editorState = signal<readonly EditorDescriptor[]>([]);
  private readonly commandState = signal<readonly CommandDescriptor[]>([]);
  private readonly actionState = signal<readonly ContextMenuActionDescriptor[]>([]);
  private readonly activityState = signal<readonly ActivityDescriptor[]>([]);

  readonly views = computed(() => this.sorted(this.viewState()));
  readonly panels = computed(() => this.sorted(this.panelState()));
  readonly editors = computed(() => this.editorState());
  readonly commands = computed(() => this.sorted(this.commandState()));
  readonly contextMenuActions = computed(() => this.sorted(this.actionState()));
  readonly activities = computed(() => this.sorted(this.activityState()));

  registerFeature(feature: WorkbenchFeature): Disposable {
    this.validateId(feature.id, 'feature');
    if (this.featureIds.has(feature.id)) {
      throw new ContributionError(`Duplicate feature id "${feature.id}".`);
    }
    this.featureIds.add(feature.id);
    try {
      const contribution = feature.register(this);
      let active = true;
      return {
        dispose: () => {
          if (!active) {
            return;
          }
          active = false;
          contribution.dispose();
          this.featureIds.delete(feature.id);
        },
      };
    } catch (error) {
      this.featureIds.delete(feature.id);
      throw error;
    }
  }

  registerView(view: ViewDescriptor): Disposable {
    return this.add(this.viewState, view, 'view');
  }

  registerPanel(panel: PanelDescriptor): Disposable {
    return this.add(this.panelState, panel, 'panel');
  }

  registerEditor(editor: EditorDescriptor): Disposable {
    return this.add(this.editorState, editor, 'editor');
  }

  registerCommand(command: CommandDescriptor): Disposable {
    return this.add(this.commandState, command, 'command');
  }

  registerContextMenuAction(action: ContextMenuActionDescriptor): Disposable {
    return this.add(this.actionState, action, 'context menu action');
  }

  registerActivity(activity: ActivityDescriptor): Disposable {
    return this.add(this.activityState, activity, 'activity');
  }

  getEditor(id: string): EditorDescriptor | undefined {
    return this.editorState().find((editor) => editor.id === id);
  }

  getCommand(id: string): CommandDescriptor | undefined {
    return this.commandState().find((command) => command.id === id);
  }

  getView(id: string): ViewDescriptor | undefined {
    return this.viewState().find((view) => view.id === id);
  }

  availableCommands(context: WorkspaceContext): readonly CommandDescriptor[] {
    return this.commands().filter((command) => !command.when || command.when(context));
  }

  availableContextMenuActions(
    location: ContextMenuLocation,
    context: WorkspaceContext,
  ): readonly ContextMenuActionDescriptor[] {
    return this.contextMenuActions().filter(
      (action) => action.location === location && (!action.when || action.when(context)),
    );
  }

  async executeCommand(id: string, context: WorkspaceContext): Promise<void> {
    const command = this.getCommand(id);
    if (!command) {
      throw new ContributionError(`Command "${id}" is not registered.`);
    }
    if (command.when && !command.when(context)) {
      throw new ContributionError(`Command "${id}" is not available in the current context.`);
    }
    await command.execute(context);
  }

  private add<T extends { readonly id: string }>(
    state: WritableSignal<readonly T[]>,
    contribution: T,
    kind: string,
  ): Disposable {
    this.validateId(contribution.id, kind);
    if (state().some((entry) => entry.id === contribution.id)) {
      throw new ContributionError(`Duplicate ${kind} id "${contribution.id}".`);
    }
    state.update((entries) => [...entries, contribution]);
    let active = true;
    return {
      dispose: () => {
        if (!active) {
          return;
        }
        active = false;
        state.update((entries) => entries.filter((entry) => entry.id !== contribution.id));
      },
    };
  }

  private validateId(id: string, kind: string): void {
    if (!/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(id)) {
      throw new ContributionError(`Invalid ${kind} id "${id}". Use lowercase dot or dash segments.`);
    }
  }

  private sorted<T extends { readonly order?: number }>(entries: readonly T[]): readonly T[] {
    return [...entries].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  }
}