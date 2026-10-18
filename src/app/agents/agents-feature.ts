import { Component, Injectable, computed, inject, signal } from '@angular/core';
import { Bot, ChevronDown, LucideAngularModule, Plus, Send, Settings, Sparkles, WandSparkles } from 'lucide-angular';
import { WorkbenchContextService } from '../workbench/core/context';
import { Disposable, WorkbenchFeature, WorkbenchRegistryLike } from '../workbench/core/contracts';

interface AgentOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accent: string;
}

interface AgentMessage {
  readonly id: number;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

const AGENTS: readonly AgentOption[] = [
  { id: 'workspace', name: 'Workspace', description: 'Understand your project and files', accent: 'blue' },
  { id: 'builder', name: 'Builder', description: 'Plan and implement changes', accent: 'violet' },
  { id: 'reviewer', name: 'Reviewer', description: 'Inspect code and find improvements', accent: 'green' },
];

const STARTER_MESSAGE: AgentMessage = {
  id: 1,
  role: 'assistant',
  content: "I'm ready to help with your workspace. Ask a question or choose an agent to get started.",
};

@Component({
  selector: 'workbench-agents-view',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section class="agents-view" aria-label="Agents">
      <header class="agents-header">
        <div class="agents-title-row">
          <div>
            <span class="eyebrow"><lucide-icon [img]="icons.sparkles" [size]="12"></lucide-icon> WORKBENCH AI</span>
            <h2>Agents</h2>
          </div>
          <div class="header-actions">
            <button class="header-action" type="button" aria-label="New agent chat" title="New chat" (click)="newChat()"><lucide-icon [img]="icons.plus" [size]="14"></lucide-icon></button>
            <button class="header-action" type="button" aria-label="Agent settings" title="Agent settings" (click)="toggleSettings()"><lucide-icon [img]="icons.settings" [size]="14"></lucide-icon></button>
          </div>
        </div>
        @if (settingsOpen()) {
          <div class="settings-popover" role="status">Agent responses are simulated locally for this demo.</div>
        }
      </header>

      <div class="agent-picker" role="tablist" aria-label="Choose an agent">
        @for (agent of agents; track agent.id) {
          <button
            class="agent-option"
            [class.active]="selectedAgentId() === agent.id"
            type="button"
            role="tab"
            [attr.aria-selected]="selectedAgentId() === agent.id"
            (click)="selectAgent(agent.id)"
          >
            <span class="agent-avatar" [class]="'accent-' + agent.accent"><lucide-icon [img]="icons.bot" [size]="15"></lucide-icon></span>
            <span class="agent-copy"><strong>{{ agent.name }}</strong><small>{{ agent.description }}</small></span>
            @if (selectedAgentId() === agent.id) { <lucide-icon class="agent-check" [img]="icons.chevronDown" [size]="13"></lucide-icon> }
          </button>
        }
      </div>

      <div class="conversation" role="log" aria-live="polite" aria-label="Agent conversation">
        @for (message of messages(); track message.id) {
          <article class="message" [class.user-message]="message.role === 'user'">
            <span class="message-avatar" aria-hidden="true">
              <lucide-icon [img]="message.role === 'user' ? icons.sparkles : icons.bot" [size]="14"></lucide-icon>
            </span>
            <p>{{ message.content }}</p>
          </article>
        }
      </div>

      <div class="suggestions" aria-label="Suggested prompts">
        @for (prompt of prompts; track prompt) {
          <button type="button" (click)="usePrompt(prompt)"><lucide-icon [img]="icons.wand" [size]="12"></lucide-icon>{{ prompt }}</button>
        }
      </div>

      <form class="composer" (submit)="sendMessage($event)">
        <textarea
          aria-label="Message agent"
          rows="3"
          [value]="draft()"
          placeholder="Ask an agent..."
          (input)="updateDraft($event)"
          (keydown)="handleComposerKeydown($event)"
        ></textarea>
        <div class="composer-footer">
          <span class="context-chip"><span class="status-dot"></span>{{ selectionLabel() }}</span>
          <button class="send-button" type="submit" aria-label="Send message" [disabled]="!draft().trim()"><lucide-icon [img]="icons.send" [size]="14"></lucide-icon></button>
        </div>
      </form>
    </section>
  `,
  styles: `
    :host { display: block; min-height: 100%; }
    .agents-view { display: flex; min-height: 100%; flex-direction: column; color: var(--wb-text); background: var(--wb-surface); }
    .agents-header { position: relative; padding: 16px 14px 12px; border-bottom: 1px solid var(--wb-border); background: var(--wb-surface-raised); }
    .agents-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 5px; color: var(--wb-accent); font-size: .53rem; font-weight: 700; letter-spacing: .1em; }
    h2 { margin: 5px 0 0; font-size: .95rem; font-weight: 600; letter-spacing: -.01em; }
    .header-actions { display: flex; gap: 3px; }
    .header-action, .send-button { display: grid; place-items: center; border: 1px solid var(--wb-border); border-radius: 4px; color: var(--wb-muted); background: var(--wb-surface); cursor: pointer; }
    .header-action { width: 27px; height: 27px; }
    .header-action:hover, .send-button:hover:not(:disabled) { color: var(--wb-text); border-color: var(--wb-border-strong); background: var(--wb-surface-hover); }
    .settings-popover { margin-top: 10px; padding: 8px 9px; color: var(--wb-muted); border: 1px solid var(--wb-border); border-radius: 3px; background: var(--wb-surface); font-size: .6rem; line-height: 1.4; }
    .agent-picker { display: grid; gap: 5px; padding: 10px; border-bottom: 1px solid var(--wb-border); }
    .agent-option { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 7px; border: 1px solid transparent; border-radius: 4px; color: var(--wb-muted); background: transparent; cursor: pointer; font: inherit; text-align: left; }
    .agent-option:hover { background: var(--wb-surface-hover); }
    .agent-option.active { color: var(--wb-text); border-color: var(--wb-border); background: var(--wb-canvas); }
    .agent-avatar, .message-avatar { display: grid; place-items: center; flex: 0 0 auto; border-radius: 5px; }
    .agent-avatar { width: 28px; height: 28px; color: #fff; }
    .accent-blue { background: #3178c6; }
    .accent-violet { background: #7950f2; }
    .accent-green { background: #2f9e44; }
    .agent-copy { display: grid; min-width: 0; gap: 2px; flex: 1; }
    .agent-copy strong { font-size: .66rem; font-weight: 600; }
    .agent-copy small { overflow: hidden; color: var(--wb-muted); font-size: .56rem; text-overflow: ellipsis; white-space: nowrap; }
    .agent-check { color: var(--wb-accent); transform: rotate(180deg); }
    .conversation { display: grid; flex: 1; align-content: start; gap: 13px; min-height: 150px; padding: 16px 13px; overflow: auto; }
    .message { display: flex; align-items: flex-start; gap: 8px; }
    .message-avatar { width: 22px; height: 22px; color: var(--wb-accent); background: var(--wb-accent-soft); }
    .message p { max-width: 245px; margin: 2px 0 0; color: var(--wb-text-soft); font-size: .67rem; line-height: 1.5; }
    .user-message { flex-direction: row-reverse; }
    .user-message .message-avatar { color: var(--wb-muted); background: var(--wb-surface-hover); }
    .user-message p { padding: 7px 9px; color: var(--wb-text); border: 1px solid var(--wb-border); border-radius: 6px 2px 6px 6px; background: var(--wb-surface-raised); }
    .suggestions { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 10px 10px; }
    .suggestions button { display: inline-flex; align-items: center; gap: 5px; padding: 5px 7px; border: 1px solid var(--wb-border); border-radius: 12px; color: var(--wb-muted); background: transparent; cursor: pointer; font: inherit; font-size: .57rem; }
    .suggestions button:hover { color: var(--wb-accent); border-color: var(--wb-accent); background: var(--wb-accent-soft); }
    .composer { margin: 0 10px 10px; padding: 8px; border: 1px solid var(--wb-border-strong); border-radius: 5px; background: var(--wb-surface-raised); box-shadow: 0 3px 12px rgb(15 23 42 / 8%); }
    .composer textarea { display: block; width: 100%; min-height: 44px; resize: vertical; padding: 2px 1px; border: 0; outline: 0; color: var(--wb-text); background: transparent; font: inherit; font-size: .67rem; line-height: 1.45; box-sizing: border-box; }
    .composer textarea::placeholder { color: var(--wb-muted); }
    .composer-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 7px; border-top: 1px solid var(--wb-border); }
    .context-chip { display: inline-flex; align-items: center; gap: 5px; min-width: 0; overflow: hidden; color: var(--wb-muted); font-size: .55rem; text-overflow: ellipsis; white-space: nowrap; }
    .status-dot { width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%; background: var(--wb-green); }
    .send-button { width: 26px; height: 26px; color: #fff; border-color: var(--wb-accent); background: var(--wb-accent); }
    .send-button:disabled { cursor: not-allowed; opacity: .4; }
  `,
})
export class AgentsViewComponent {
  private readonly context = inject(WorkbenchContextService);

  readonly agents = AGENTS;
  readonly prompts = ['Explain this workspace', 'Review the selection', 'Plan a change'];
  readonly icons = {
    bot: Bot,
    chevronDown: ChevronDown,
    plus: Plus,
    send: Send,
    settings: Settings,
    sparkles: Sparkles,
    wand: WandSparkles,
  };
  readonly selectedAgentId = signal(AGENTS[0].id);
  readonly messages = signal<readonly AgentMessage[]>([STARTER_MESSAGE]);
  readonly draft = signal('');
  readonly settingsOpen = signal(false);
  readonly selectionLabel = computed(() => this.context.selection()?.label ?? 'Workspace context');

  selectAgent(agentId: string): void {
    this.selectedAgentId.set(agentId);
  }

  newChat(): void {
    this.messages.set([STARTER_MESSAGE]);
    this.draft.set('');
  }

  toggleSettings(): void {
    this.settingsOpen.update((open) => !open);
  }

  usePrompt(prompt: string): void {
    this.draft.set(prompt);
  }

  updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(event);
    }
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    const content = this.draft().trim();
    if (!content) {
      return;
    }
    const agent = this.agents.find((option) => option.id === this.selectedAgentId()) ?? this.agents[0];
    const nextId = this.messages().length + 1;
    this.messages.update((messages) => [
      ...messages,
      { id: nextId, role: 'user', content },
      { id: nextId + 1, role: 'assistant', content: `${agent.name} is ready to work with the current workspace context. I would start by examining "${content}".` },
    ]);
    this.draft.set('');
  }
}

@Injectable({ providedIn: 'root' })
export class AgentsFeature implements WorkbenchFeature {
  readonly id = 'workbench.agents';

  register(registry: WorkbenchRegistryLike): Disposable {
    const contributions: Disposable[] = [
      registry.registerActivity({ id: 'agents', label: 'Agents', icon: 'agents', viewIds: ['agents.chat'], order: 2 }),
      registry.registerView({ id: 'agents.chat', title: 'Agents', icon: 'agents', region: 'secondarySidebar', component: AgentsViewComponent, order: 1 }),
    ];
    return {
      dispose: () => contributions.reverse().forEach((contribution) => contribution.dispose()),
    };
  }
}
