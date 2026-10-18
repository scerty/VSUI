import { Component, inject } from '@angular/core';
import { AgentsFeature } from './agents/agents-feature';
import { DemoFeature } from './demo/demo-feature';
import { WorkbenchConfiguration } from './workbench/core/contracts';
import { WorkbenchLayoutFeature } from './workbench/core/layout-commands';
import { WorkbenchRegistry } from './workbench/core/registry';
import { WorkbenchWorkspaceService } from './workbench/core/workspace';
import { WorkbenchShellComponent } from './workbench/shell/workbench-shell';

const DEMO_CONFIGURATION: WorkbenchConfiguration = {
  applicationId: 'workbench-demo',
  workspaceId: 'reference-workspace',
  activityBar: true,
  primarySidebar: true,
  secondarySidebar: true,
  bottomPanel: true,
  statusBar: true,
  commandPalette: true,
  layoutPersistence: true,
};

@Component({
  selector: 'app-root',
  imports: [WorkbenchShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly configuration = DEMO_CONFIGURATION;
  private readonly registry = inject(WorkbenchRegistry);
  private readonly agentsFeature = inject(AgentsFeature);
  private readonly demoFeature = inject(DemoFeature);
  private readonly layoutFeature = inject(WorkbenchLayoutFeature);
  private readonly workspace = inject(WorkbenchWorkspaceService);

  constructor() {
    this.registry.registerFeature(this.agentsFeature);
    this.registry.registerFeature(this.demoFeature);
    this.registry.registerFeature(this.layoutFeature);
    this.workspace.restore();
  }
}
