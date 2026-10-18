# Modular Angular Workbench

A small, reusable Angular 21 workbench framework inspired by durable workspace interactions. The project contains a framework layer and a neutral project-notes demo that consumes it through public contracts.

## Quick Start

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The demo provides an explorer view, editor tabs, a functional command palette, a bottom panel, contextual selection actions, and browser-backed editor restoration.

Quality gates:

```bash
npm run test -- --watch=false
npm run build
```

The verified baseline for this repository is Angular CLI `21.2.26`, Node.js `20.19.5`, and npm `10.8.2`.

## Architecture

The framework is split into three practical layers:

- `src/app/workbench/core`: framework contracts, typed context, registration, command execution, editor lifecycle, and persistence interfaces. This layer has no dependency on the demo domain.
- `src/app/workbench/shell`: the configurable shell that renders activities, sidebars, editor tabs, panels, status, and the command palette from core descriptors.
- `src/app/demo`: an independent consumer feature. It registers an explorer, document editor, panel, commands, and a contextual action without changing the shell.

Allowed dependency direction:

```text
demo -> core
shell -> core
application composition -> demo + shell + core
core -X-> demo, shell, or domain services
```

The stable framework entry point is [public-api.ts](src/app/workbench/core/public-api.ts). Component styles and the shell implementation are internal details unless a consumer explicitly chooses to use [workbench-shell.ts](src/app/workbench/shell/workbench-shell.ts) as its shell component.

## Public API Example

Configure only the regions an application needs and register a feature through the registry:

```ts
const configuration: WorkbenchConfiguration = {
  applicationId: 'my-tool',
  workspaceId: 'main',
  activityBar: true,
  primarySidebar: true,
  secondarySidebar: false,
  bottomPanel: true,
  statusBar: true,
  commandPalette: true,
};

registry.registerFeature({
  id: 'notes.feature',
  register: (api) => {
    const command = api.registerCommand({
      id: 'notes.open',
      title: 'Open Notes',
      category: 'Notes',
      execute: () => {
        workspace.openEditor({ descriptorId: 'notes.editor', resourceId: 'index' });
      },
    });

    return { dispose: () => command.dispose() };
  },
});
```

Features use `registerView`, `registerEditor`, `registerPanel`, `registerCommand`, `registerContextMenuAction`, and `registerActivity`. Every contribution requires a stable lowercase ID. Duplicate IDs throw `ContributionError`; every registration returns a disposable that removes the contribution.

Context-sensitive behavior uses `WorkspaceContext` and `when` predicates. Extensions should publish selection through `WorkbenchContextService` and collaborate through commands or typed services rather than importing another feature's component.

`WorkbenchWorkspaceService` owns editor instances and persists only editor descriptor/resource identities plus the active editor. Applications supply a different `WorkspaceStorage` implementation when browser local storage is not appropriate. Domain data is intentionally outside this persistence layer.

## Runtime Layout

`WorkbenchLayoutService` is the single source of truth for runtime layout state. Configuration decides whether a region exists; layout state decides whether an enabled region is currently visible. The shell binds both, so toggles, commands, pointer splitters, keyboard splitters, maximize/restore, focus requests, and reset update the same state.

The default resize constraints are primary sidebar `200-480px`, secondary sidebar `220-460px`, and bottom panel `96-520px`. Splitters support pointer dragging plus Arrow/Home/End keyboard resizing. The bottom panel keeps its previous height when maximized and restores it when toggled back.

Layout snapshots are persisted separately from editor state under `modular-workbench.layout` when `layoutPersistence` is enabled. They are scoped by `applicationId` and `workspaceId`; malformed or mismatched snapshots are discarded. Domain state is not persisted by this service.

The default layout shortcuts are `Ctrl+B` primary sidebar, `Ctrl+Alt+B` secondary sidebar, `Ctrl+J` bottom panel, `Ctrl+Shift+M` maximize/restore panel, `Ctrl+Shift+0` reset layout, `Ctrl+0` focus the workbench, `Ctrl+Shift+E` focus the primary sidebar, and `Ctrl+Shift+Y` focus the bottom panel. Shortcuts are ignored while typing in editable controls.

The shell also supports a persisted Light Theme. Use the sun/moon button in the title bar to switch between the VS Code-inspired dark and light palettes; the choice is stored separately under `modular-workbench.theme`.

## Demonstration

`App` composes `DemoFeature` with `WorkbenchShellComponent`. The demo proves:

- a primary-sidebar activity and view are contributed by a feature;
- selecting a document updates typed context;
- the contextual action appears only for a document selection;
- the action opens a registered editor instance;
- the command palette discovers and executes registered commands;
- the bottom panel is enabled by configuration;
- region visibility and dimensions can change at runtime without changing configuration;
- layout state survives reload independently from editor restoration;
- editor identities can be restored from browser storage;
- the shell does not import demo code.

The article editor also exports the active article as an HTML ZIP from the `Export HTML` action. The archive contains `index.html` plus an `assets/` directory for uploaded images, preserves image `src`, `width`, `height`, and inline positioning attributes, and adds `dir="rtl"` to Arabic content when it is the dominant direction.

## Deferred Capabilities

The contracts remain compatible with future editor groups and optional AI providers, but the initial reference implementation intentionally defers split editors, pinned/preview tabs, global context-menu rendering, shortcut conflict resolution, remote plugin loading, and provider-specific AI integration. These require product-level interaction and security decisions beyond the reusable registration boundary.

See [docs/architecture.md](docs/architecture.md) and [docs/assumptions.md](docs/assumptions.md) for the detailed contract map and decisions.