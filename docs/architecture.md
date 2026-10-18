# Architecture Reference

## Core Contracts

The public contracts are in `src/app/workbench/core/contracts.ts` and re-exported from `public-api.ts`.

| Contract | Responsibility |
| --- | --- |
| `WorkbenchConfiguration` | Declares optional shell regions and application/workspace identity. |
| `ViewDescriptor` | Describes a persistent view and its region/component. |
| `EditorDescriptor` | Describes an editor type, resource title, and component inputs. |
| `PanelDescriptor` | Describes an auxiliary bottom or future panel contribution. |
| `CommandDescriptor` | Gives a command a stable ID, label, optional context predicate, and execution function. |
| `ContextMenuActionDescriptor` | Connects a visible action to a command without importing the command owner. |
| `ActivityDescriptor` | Connects an activity to one or more view IDs. |
| `WorkspaceContext` | Typed application, workspace, selection, view, editor, permission, and extension context. |
| `WorkspaceStorage` | Small persistence port for applications to replace browser storage. |
| `WorkbenchLayoutState` | Runtime visibility, active contribution IDs, dimensions, and bottom-panel maximize state. |
| `WorkbenchLayoutSnapshot` | Versioned, application/workspace-scoped persistence record for layout state. |

`WorkbenchRegistry` is the coordination boundary. It validates IDs, rejects duplicates, sorts ordered contributions, evaluates context predicates, executes commands, and returns disposables. A failed feature registration rolls back its feature ID and rethrows the original error.

`WorkbenchContextService` owns shared context. It exposes a readonly signal and narrow update methods. It is not a generic event bus and does not contain arbitrary application state.

`WorkbenchWorkspaceService` owns editor instances. An editor instance is distinct from a view: views remain contributed surfaces, while editors are opened working items with lifecycle and active-editor state. Persistence stores only serializable open-editor requests and the active instance ID.

`WorkbenchLayoutService` owns runtime shell layout. It is separate from editor state and feature/domain state. `WorkbenchConfiguration` is the capability boundary: disabled regions remain disabled even when a persisted snapshot or command requests them. For enabled regions, the service owns visibility, active activity/view/panel IDs, sidebar widths, panel height, maximize/restore state, clamping, reset, focus requests, and layout persistence.

## Composition

The current consumer composition is intentionally explicit:

```ts
export class App {
  readonly configuration = configuration;
  private readonly registry = inject(WorkbenchRegistry);
  private readonly demo = inject(DemoFeature);
  private readonly workspace = inject(WorkbenchWorkspaceService);

  constructor() {
    this.registry.registerFeature(this.demo);
    this.workspace.restore();
  }
}
```

The shell receives the configuration as an input and renders the descriptors from the registry. It never imports `DemoFeature`, `ProjectExplorerComponent`, or a domain model.

## Shell Regions

`WorkbenchShellComponent` can render the activity bar, primary sidebar, secondary sidebar, editor area, bottom panel, command palette, and status bar independently. The activity bar and primary sidebar share one margin-bearing sidebar wrapper, while CSS grid variants remove disabled columns and rows. Runtime classes and custom properties update enabled-region visibility and dimensions. Accessible splitters sit at the primary-sidebar, secondary-sidebar, and bottom-panel boundaries. The bottom panel can maximize within the workbench while leaving the title and status regions available. The responsive layout turns the primary sidebar into an overlay on narrow screens and hides the secondary sidebar.

The shell currently provides a built-in command palette backed by `WorkbenchRegistry.availableCommands`. It is an executable command surface, not a decorative search field. Global search and Quick Open are intentionally separate future capabilities.

The default layout command feature contributes visibility toggles, focus commands, reset, and panel maximize/restore. The shell dispatches registered keybindings only when the event is not already handled and the target is not an editable control. Focus requests fall back to the main workbench if a requested region is not rendered.

Theme state is shell-owned rather than domain state. The title-bar toggle applies the light palette through inherited CSS variables and persists only the selected `dark` or `light` value. This keeps theme selection independent from layout and editor snapshots.

## Inter-Feature Communication

The demo explorer publishes a document selection with `WorkbenchContextService.setSelection`. The command and contextual action query that typed selection. The explorer does not know how the editor renders its content; it only invokes the command through the registry. This is the intended collaboration pattern for independent features.

## Optional AI Boundary

The core has no provider, key, network, or model dependency. A future AI capability should be added as an application-owned feature that consumes `WorkspaceContext` and explicit selection data, then invokes authorized application commands. Any data-changing action must pass through those commands and the consuming application's confirmation policy.

## Directory Map

```text
src/app/
  workbench/core/       stable contracts and coordination services
  workbench/shell/      configurable rendering surface
  demo/                 independent reference consumer
  app.ts                composition root
```

Tests sit beside the core services so contracts and lifecycle behavior can be tested without booting the full shell.