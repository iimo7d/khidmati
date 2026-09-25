import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { CancelConfirmDialog, CancelDialogData } from './cancel-confirm-dialog';

describe('CancelConfirmDialog (Pattern)', () => {
  let component: CancelConfirmDialog;
  let fixture: ComponentFixture<CancelConfirmDialog>;

  const mockData: CancelDialogData = {
    referenceNumber: 'KH-2026-102030',
    serviceName: 'Passport Renewal',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelConfirmDialog],
      providers: [
        provideHttpClient(),
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and display dialog data', () => {
    expect(component).toBeTruthy();
    expect(component.data.referenceNumber).toBe('KH-2026-102030');
  });
});
