import { Component } from '@angular/core';

@Component({
  selector: 'demo-output-panel',
  standalone: true,
  template: `
    <div class="output-panel">
      <span class="output-marker">INFO</span>
      <span>Demo feature registered 7 contributions through the public workbench contracts.</span>
      <span class="output-time">just now</span>
    </div>
  `,
  styles: `
    :host { display: block; }
    .output-panel { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 16px; color: var(--wb-text-soft); font-size: .68rem; }
    .output-marker { color: var(--wb-green); font-size: .57rem; font-weight: 700; letter-spacing: .1em; }
    .output-time { margin-left: auto; color: var(--wb-muted); font-size: .6rem; }
  `,
})
export class DemoOutputPanelComponent {}