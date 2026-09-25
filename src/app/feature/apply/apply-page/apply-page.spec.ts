import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplyPage } from './apply-page';

describe('ApplyPage (Builder & Strategy Pattern)', () => {
  let component: ApplyPage;
  let fixture: ComponentFixture<ApplyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyPage],
      providers: [provideRouter([]), provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and initialize 3-step reactive form groups', () => {
    expect(component).toBeTruthy();
    expect(component.applicantForm).toBeDefined();
    expect(component.deliveryForm).toBeDefined();
    expect(component.reviewForm).toBeDefined();
  });

  it('should invalidate applicantForm when fields are missing or invalid', () => {
    component.applicantForm.patchValue({
      fullName: 'A', 
      nationalId: '123', 
      mobile: '065001234', 
      dateOfBirth: '2020-01-01', 
    });

    expect(component.applicantForm.valid).toBe(false);
  });
});
