import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ServiceCard } from './service-card';
import { GovService, Category } from '../../core/models/services.model';

describe('ServiceCard (Presentational UI Component)', () => {
  let component: ServiceCard;
  let fixture: ComponentFixture<ServiceCard>;

  const mockService: GovService = {
    id: 'svc-001',
    categoryId: 'civil',
    name: { en: 'Passport Renewal', ar: 'تجديد جواز السفر' },
    summary: { en: 'Renew passport online', ar: 'تجديد جواز السفر إلكترونياً' },
    description: { en: 'Description', ar: 'الوصف' },
    entity: { en: 'Civil Status Department', ar: 'دائرة الأحوال المدنية' },
    fee: 50,
    processingDays: 5,
    isActive: true,
    deliveryOptions: ['pickup', 'courier'],
  };

  const mockCategory: Category = {
    id: 'civil',
    name: { en: 'Civil Status', ar: 'الأحوال المدنية' },
    icon: 'badge',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCard],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('service', mockService);
    fixture.componentRef.setInput('category', mockCategory);
    fixture.componentRef.setInput('currentLang', 'en');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render service details', () => {
    expect(component).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Passport Renewal');
    expect(el.textContent).toContain('Civil Status Department');
  });

  it('should handle zero-value edge cases (Free & Same day)', async () => {
    const zeroService: GovService = {
      ...mockService,
      fee: 0,
      processingDays: 0,
    };
    fixture.componentRef.setInput('service', zeroService);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isFree()).toBe(true);
    expect(component.isSameDay()).toBe(true);
  });
});
