import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState Component', () => {
  let component: EmptyState;
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    component = fixture.componentInstance;

    
    fixture.componentRef.setInput('title', 'No Results');
    fixture.componentRef.setInput('description', 'Try clearing filters');
    fixture.componentRef.setInput('actionLabel', 'Clear filters');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render message', () => {
    expect(component).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No Results');
    expect(el.textContent).toContain('Try clearing filters');
  });

  it('should emit actionClick when action button is clicked', () => {
    let emitted = false;
    component.actionClick.subscribe(() => {
      emitted = true;
    });

    
    const button = fixture.nativeElement.querySelector('button.action-btn') as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();

    expect(emitted).toBe(true);
  });
});
