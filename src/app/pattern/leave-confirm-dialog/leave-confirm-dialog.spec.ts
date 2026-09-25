import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { LeaveConfirmDialog } from './leave-confirm-dialog';

describe('LeaveConfirmDialog (Pattern)', () => {
  let component: LeaveConfirmDialog;
  let fixture: ComponentFixture<LeaveConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveConfirmDialog],
      providers: [provideHttpClient(), { provide: MatDialogRef, useValue: { close: () => {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create leave confirmation dialog', () => {
    expect(component).toBeTruthy();
  });
});
