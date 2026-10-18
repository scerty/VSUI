import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Check, LucideAngularModule, RotateCcw, X } from 'lucide-angular';

export interface ThemeColorControl {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

export interface ThemePreset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly colors: Readonly<Record<string, string>>;
  readonly swatches: readonly string[];
}

@Component({
  selector: 'workbench-theme-settings',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './theme-settings.html',
  styleUrl: './theme-settings.css',
})
export class WorkbenchThemeSettingsComponent {
  @Input() tokens: readonly ThemeColorControl[] = [];
  @Input() colors: Readonly<Record<string, string>> = {};
  @Input() presets: readonly ThemePreset[] = [];
  @Input() activePresetId: string | null = null;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly colorChanged = new EventEmitter<{ key: string; value: string }>();
  @Output() readonly presetSelected = new EventEmitter<string>();
  @Output() readonly reset = new EventEmitter<void>();

  readonly icons = {
    check: Check,
    close: X,
    reset: RotateCcw,
  };

  onColorInput(key: string, event: Event): void {
    this.colorChanged.emit({ key, value: (event.target as HTMLInputElement).value });
  }
}
