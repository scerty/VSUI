import {
  CommandDescriptor,
  Disposable,
  WorkbenchFeature,
  WorkbenchRegistry,
  WorkspaceContext,
  validateWorkbenchConfiguration,
} from './public-api';

const context: WorkspaceContext = {
  applicationId: 'test-app',
  workspaceId: 'test-workspace',
  activeExtensionId: null,
  activeActivityId: null,
  activeViewId: null,
  activeEditorId: null,
  selection: null,
  permissions: [],
};

describe('WorkbenchRegistry', () => {
  it('registers and disposes contributions', () => {
    const registry = new WorkbenchRegistry();
    const disposable = registry.registerActivity({
      id: 'test.activity',
      label: 'Test',
      icon: 'test',
      viewIds: [],
    });

    expect(registry.activities()).toHaveLength(1);
    disposable.dispose();
    expect(registry.activities()).toHaveLength(0);
    disposable.dispose();
    expect(registry.activities()).toHaveLength(0);
  });

  it('rejects invalid and duplicate IDs', () => {
    const registry = new WorkbenchRegistry();
    const command: CommandDescriptor = { id: 'test.command', title: 'Test', execute: () => undefined };

    expect(() => registry.registerCommand({ ...command, id: 'Invalid ID' })).toThrow('Invalid command id');
    registry.registerCommand(command);
    expect(() => registry.registerCommand(command)).toThrow('Duplicate command id');
  });

  it('discovers and executes context-sensitive commands', async () => {
    const registry = new WorkbenchRegistry();
    let executed = false;
    registry.registerCommand({
      id: 'test.context-command',
      title: 'Context command',
      when: (current) => current.selection?.kind === 'document',
      execute: () => {
        executed = true;
      },
    });

    expect(registry.availableCommands(context)).toHaveLength(0);
    const selected = { ...context, selection: { kind: 'document', id: 'one', label: 'One' } };
    expect(registry.availableCommands(selected)).toHaveLength(1);
    await registry.executeCommand('test.context-command', selected);
    expect(executed).toBe(true);
    await expect(registry.executeCommand('test.context-command', context)).rejects.toThrow('not available');
  });

  it('rejects duplicate features and validates layout configuration', () => {
    const registry = new WorkbenchRegistry();
    const feature: WorkbenchFeature = {
      id: 'test.feature',
      register: () => ({ dispose: () => undefined }) satisfies Disposable,
    };

    const registration = registry.registerFeature(feature);
    expect(() => registry.registerFeature(feature)).toThrow('Duplicate feature id');
    registration.dispose();
    expect(() => registry.registerFeature(feature)).not.toThrow();

    expect(validateWorkbenchConfiguration({
      applicationId: '',
      workspaceId: '',
      activityBar: true,
      primarySidebar: true,
      secondarySidebar: true,
      bottomPanel: true,
      statusBar: true,
      commandPalette: true,
    })).toEqual(['applicationId must not be empty.', 'workspaceId must not be empty.']);
  });
});