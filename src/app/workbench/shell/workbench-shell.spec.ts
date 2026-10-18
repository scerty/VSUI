import { TestBed } from '@angular/core/testing';
import { WorkbenchShellComponent } from './workbench-shell';

describe('WorkbenchShellComponent', () => {
  it('does not reserve space for disabled regions', () => {
    TestBed.configureTestingModule({ imports: [WorkbenchShellComponent] });
    const fixture = TestBed.createComponent(WorkbenchShellComponent);
    fixture.componentRef.setInput('configuration', {
      applicationId: 'minimal-app',
      workspaceId: 'minimal-workspace',
      activityBar: false,
      primarySidebar: false,
      secondarySidebar: false,
      bottomPanel: false,
      statusBar: false,
      commandPalette: false,
    });
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const shell = element.querySelector('.workbench-shell') as HTMLElement;

    expect(element.querySelector('.activity-bar')).toBeNull();
    expect(element.querySelector('.primary-sidebar')).toBeNull();
    expect(element.querySelector('.secondary-sidebar')).toBeNull();
    expect(element.querySelector('.bottom-panel')).toBeNull();
    expect(element.querySelector('.status-bar')).toBeNull();
    expect(shell.classList.contains('primary-hidden')).toBe(true);
    expect(shell.classList.contains('bottom-hidden')).toBe(true);
  });

  it('updates rendered regions and splitter values from runtime layout state', () => {
    TestBed.configureTestingModule({ imports: [WorkbenchShellComponent] });
    const fixture = TestBed.createComponent(WorkbenchShellComponent);
    fixture.componentRef.setInput('configuration', {
      applicationId: 'runtime-layout-app',
      workspaceId: 'runtime-layout-workspace',
      activityBar: true,
      primarySidebar: true,
      secondarySidebar: true,
      bottomPanel: true,
      statusBar: true,
      commandPalette: true,
      layoutPersistence: false,
    });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.bottom-panel')).not.toBeNull();
    component.layout.toggleBottomPanel();
    fixture.detectChanges();
    expect(element.querySelector('.bottom-panel')).toBeNull();

    const primarySplitter = element.querySelector('.primary-splitter') as HTMLButtonElement;
    component.resizeWithKeyboard('primarySidebar', new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(component.layout.state().primarySidebarWidth).toBe(480);
    expect(primarySplitter.getAttribute('aria-valuenow')).toBe('480');
  });

  it('updates sidebar width during a pointer drag', () => {
    TestBed.configureTestingModule({ imports: [WorkbenchShellComponent] });
    const fixture = TestBed.createComponent(WorkbenchShellComponent);
    fixture.componentRef.setInput('configuration', {
      applicationId: 'pointer-layout-app',
      workspaceId: 'pointer-layout-workspace',
      activityBar: true,
      primarySidebar: true,
      secondarySidebar: false,
      bottomPanel: false,
      statusBar: true,
      commandPalette: false,
      layoutPersistence: false,
    });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const splitter = fixture.nativeElement.querySelector('.primary-splitter') as HTMLButtonElement;
    Object.defineProperty(splitter, 'setPointerCapture', { value: () => undefined });

    const pointerDown = new Event('pointerdown', { bubbles: true, cancelable: true });
    Object.defineProperties(pointerDown, {
      pointerId: { value: 7 },
      clientX: { value: 264 },
      clientY: { value: 100 },
    });
    splitter.dispatchEvent(pointerDown);
    component.onPointerMove(Object.assign(new Event('pointermove'), {
      pointerId: 7,
      clientX: 304,
      clientY: 100,
    }) as PointerEvent);
    component.onPointerUp(Object.assign(new Event('pointerup'), { pointerId: 7 }) as PointerEvent);

    expect(component.layout.state().primarySidebarWidth).toBe(304);
    expect(component.layout.state().primarySidebarWidth).toBeGreaterThan(200);
  });

  it('toggles and persists the light theme', () => {
    window.localStorage.removeItem('modular-workbench.theme');
    TestBed.configureTestingModule({ imports: [WorkbenchShellComponent] });
    const fixture = TestBed.createComponent(WorkbenchShellComponent);
    fixture.componentRef.setInput('configuration', {
      applicationId: 'theme-app',
      workspaceId: 'theme-workspace',
      activityBar: true,
      primarySidebar: true,
      secondarySidebar: false,
      bottomPanel: false,
      statusBar: true,
      commandPalette: false,
      layoutPersistence: false,
    });
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const themeButton = host.querySelector('[aria-label="Use light theme"]') as HTMLButtonElement;

    themeButton.click();
    fixture.detectChanges();
    expect(host.classList.contains('light-theme')).toBe(true);
    expect(window.localStorage.getItem('modular-workbench.theme')).toBe('light');
    expect(host.querySelector('[aria-label="Use dark theme"]')).not.toBeNull();

    host.querySelector('[aria-label="Use dark theme"]')?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(host.classList.contains('light-theme')).toBe(false);
    expect(window.localStorage.getItem('modular-workbench.theme')).toBe('dark');
    window.localStorage.removeItem('modular-workbench.theme');
  });

  it('opens custom theme settings and persists color changes', () => {
    window.localStorage.removeItem('modular-workbench.theme');
    window.localStorage.removeItem('modular-workbench.custom-theme');
    TestBed.configureTestingModule({ imports: [WorkbenchShellComponent] });
    const fixture = TestBed.createComponent(WorkbenchShellComponent);
    fixture.componentRef.setInput('configuration', {
      applicationId: 'custom-theme-app',
      workspaceId: 'custom-theme-workspace',
      activityBar: true,
      primarySidebar: true,
      secondarySidebar: false,
      bottomPanel: false,
      statusBar: true,
      commandPalette: false,
      layoutPersistence: false,
    });
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[aria-label="Open theme settings"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Theme settings"]')).not.toBeNull();

    const stonePreset = host.querySelector('[aria-label="Use Stone preset"]') as HTMLButtonElement;
    expect(stonePreset).not.toBeNull();
    stonePreset.click();
    fixture.detectChanges();
    expect(stonePreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-canvas: #0c0a09');
    expect(host.getAttribute('style')).toContain('--wb-accent: #d6d3d1');

    const zincPreset = host.querySelector('[aria-label="Use Zinc preset"]') as HTMLButtonElement;
    expect(zincPreset).not.toBeNull();
    zincPreset.click();
    fixture.detectChanges();
    expect(zincPreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-canvas: #09090b');
    expect(host.getAttribute('style')).toContain('--wb-accent: #d4d4d8');

    const limePreset = host.querySelector('[aria-label="Use Lime preset"]') as HTMLButtonElement;
    expect(limePreset).not.toBeNull();
    limePreset.click();
    fixture.detectChanges();
    expect(limePreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-canvas: #1a2e05');
    expect(host.getAttribute('style')).toContain('--wb-accent: #a3e635');

    const bluePreset = host.querySelector('[aria-label="Use Blue preset"]') as HTMLButtonElement;
    expect(bluePreset).not.toBeNull();
    bluePreset.click();
    fixture.detectChanges();
    expect(bluePreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-canvas: #172554');
    expect(host.getAttribute('style')).toContain('--wb-accent: #60a5fa');

    const stoneAmberPreset = host.querySelector('[aria-label="Use Stone Amber preset"]') as HTMLButtonElement;
    expect(stoneAmberPreset).not.toBeNull();
    stoneAmberPreset.click();
    fixture.detectChanges();
    expect(stoneAmberPreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-canvas: #0c0a09');
    expect(host.getAttribute('style')).toContain('--wb-accent: #f59e0b');

    const forestPreset = host.querySelector('[aria-label="Use Forest preset"]') as HTMLButtonElement;
    forestPreset.click();
    fixture.detectChanges();
    expect(forestPreset.getAttribute('aria-pressed')).toBe('true');
    expect(host.getAttribute('style')).toContain('--wb-accent: #34d399');
    expect(JSON.parse(window.localStorage.getItem('modular-workbench.custom-theme') ?? '{}').accent).toBe('#34d399');

    const accentInput = host.querySelector('[aria-label="Choose Accent color"]') as HTMLInputElement;
    accentInput.value = '#ff4d6d';
    accentInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(host.getAttribute('style')).toContain('--wb-accent: #ff4d6d');
    expect(forestPreset.getAttribute('aria-pressed')).toBe('false');
    expect(JSON.parse(window.localStorage.getItem('modular-workbench.custom-theme') ?? '{}').accent).toBe('#ff4d6d');

    (host.querySelector('.theme-reset-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(window.localStorage.getItem('modular-workbench.custom-theme')).toBeNull();
    window.localStorage.removeItem('modular-workbench.theme');
  });
});