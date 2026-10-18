import { TestBed } from '@angular/core/testing';
import { AgentsViewComponent } from './agents-feature';

describe('AgentsViewComponent', () => {
  it('switches agents and sends a contextual message', () => {
    TestBed.configureTestingModule({ imports: [AgentsViewComponent] });
    const fixture = TestBed.createComponent(AgentsViewComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const agentButtons = element.querySelectorAll<HTMLButtonElement>('.agent-option');
    agentButtons[1].click();
    fixture.detectChanges();
    expect(agentButtons[1].getAttribute('aria-selected')).toBe('true');

    const composer = element.querySelector('textarea[aria-label="Message agent"]') as HTMLTextAreaElement;
    composer.value = 'Plan the sidebar change';
    composer.dispatchEvent(new Event('input', { bubbles: true }));
    element.querySelector('form.composer')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.textContent).toContain('Plan the sidebar change');
    expect(element.textContent).toContain('Builder is ready to work with the current workspace context');
  });
});
