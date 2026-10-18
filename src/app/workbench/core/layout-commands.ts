import { Injectable, inject } from '@angular/core';
import { Disposable, WorkbenchFeature, WorkbenchRegistryLike } from './contracts';
import { WorkbenchLayoutService } from './layout';

@Injectable({ providedIn: 'root' })
export class WorkbenchLayoutFeature implements WorkbenchFeature {
  readonly id = 'workbench.layout';
  private readonly layout = inject(WorkbenchLayoutService);

  register(registry: WorkbenchRegistryLike): Disposable {
    const registrations: Disposable[] = [
      registry.registerCommand({
        id: 'workbench.toggle-primary-sidebar',
        title: 'Toggle Primary Sidebar Visibility',
        category: 'Layout',
        keybinding: 'Ctrl+B',
        execute: () => this.layout.togglePrimarySidebar(),
      }),
      registry.registerCommand({
        id: 'workbench.toggle-secondary-sidebar',
        title: 'Toggle Secondary Sidebar Visibility',
        category: 'Layout',
        keybinding: 'Ctrl+Alt+B',
        execute: () => this.layout.toggleSecondarySidebar(),
      }),
      registry.registerCommand({
        id: 'workbench.toggle-bottom-panel',
        title: 'Toggle Bottom Panel Visibility',
        category: 'Layout',
        keybinding: 'Ctrl+J',
        execute: () => this.layout.toggleBottomPanel(),
      }),
      registry.registerCommand({
        id: 'workbench.focus-main-workbench',
        title: 'Focus Main Workbench',
        category: 'Layout',
        keybinding: 'Ctrl+0',
        execute: () => this.layout.requestFocus('mainWorkbench'),
      }),
      registry.registerCommand({
        id: 'workbench.focus-primary-sidebar',
        title: 'Focus Primary Sidebar',
        category: 'Layout',
        keybinding: 'Ctrl+Shift+E',
        execute: () => {
          this.layout.setPrimarySidebarVisible(true);
          this.layout.requestFocus('primarySidebar');
        },
      }),
      registry.registerCommand({
        id: 'workbench.focus-bottom-panel',
        title: 'Focus Bottom Panel',
        category: 'Layout',
        keybinding: 'Ctrl+Shift+Y',
        execute: () => {
          this.layout.setBottomPanelVisible(true);
          this.layout.requestFocus('bottomPanel');
        },
      }),
      registry.registerCommand({
        id: 'workbench.reset-layout',
        title: 'Reset Workbench Layout',
        category: 'Layout',
        keybinding: 'Ctrl+Shift+0',
        execute: () => this.layout.resetLayout(),
      }),
      registry.registerCommand({
        id: 'workbench.toggle-maximize-panel',
        title: 'Maximize or Restore Bottom Panel',
        category: 'Layout',
        keybinding: 'Ctrl+Shift+M',
        execute: () => this.layout.toggleBottomPanelMaximized(),
      }),
      registry.registerCommand({
        id: 'workbench.open-command-palette',
        title: 'Open Command Palette',
        category: 'Layout',
        keybinding: 'Ctrl+Shift+P',
        execute: () => this.layout.requestFocus('commandPalette'),
      }),
    ];
    return {
      dispose: () => registrations.reverse().forEach((registration) => registration.dispose()),
    };
  }
}