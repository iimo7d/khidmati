import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ServicesDataService } from './services-data.service';
import { ServicesData } from '../models/services.model';

describe('ServicesDataService', () => {
  let service: ServicesDataService;
  let httpTesting: HttpTestingController;

  const mockData: ServicesData = {
    version: 1,
    categories: [{ id: 'cat-1', name: { en: 'Transport', ar: 'النقل' }, icon: 'directions_car' }],
    governorates: [{ id: 'amman', name: { en: 'Amman', ar: 'عمان' } }],
    services: [
      {
        id: 'svc-001',
        categoryId: 'cat-1',
        name: { en: 'Driving License', ar: 'رخصة القيادة' },
        summary: { en: 'Summary', ar: 'ملخص' },
        description: { en: 'Description', ar: 'وصف' },
        entity: { en: 'DVLD', ar: 'الترخيص' },
        fee: 0,
        processingDays: 0,
        isActive: true,
        deliveryOptions: ['pickup'],
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicesDataService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ServicesDataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load data at runtime and populate signals', async () => {
    const dataPromise = firstValueFrom(service.loadData());

    const req = httpTesting.expectOne('data/services.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    const data = await dataPromise;
    expect(data.services.length).toBe(1);
    expect(service.services().length).toBe(1);
    expect(service.getServiceById('svc-001')?.name.en).toBe('Driving License');
    expect(service.getCategoryById('cat-1')?.icon).toBe('directions_car');
  });
});
