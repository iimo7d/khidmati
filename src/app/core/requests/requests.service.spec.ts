import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RequestsService } from './requests.service';
import { CreateRequestPayload } from '../models/requests.model';

describe('RequestsService (Facade Pattern)', () => {
  let service: RequestsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [RequestsService],
    });
    service = TestBed.inject(RequestsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should submit request, generate formatted reference number, and persist to localStorage', async () => {
    const payload: CreateRequestPayload = {
      serviceId: 'svc-001',
      applicant: {
        fullName: 'Omar Zaid',
        nationalId: '1234567890',
        mobile: '0791234567',
        dateOfBirth: '1990-01-01',
      },
      delivery: {
        method: 'pickup',
        appointmentDate: '2026-11-20',
      },
      notes: 'Urgent appointment',
    };

    const saved = await firstValueFrom(service.submitRequest(payload));
    expect(saved.referenceNumber).toMatch(/^KH-\d{4}-\d{6}$/);
    expect(saved.status).toBe('submitted');
    expect(service.requests().length).toBe(1);
    expect(service.requests()[0].referenceNumber).toBe(saved.referenceNumber);
  });

  it('should cancel an existing request and update status to cancelled', async () => {
    const payload: CreateRequestPayload = {
      serviceId: 'svc-002',
      applicant: {
        fullName: 'Hala Amer',
        nationalId: '0987654321',
        mobile: '0781234567',
        dateOfBirth: '1995-05-15',
      },
      delivery: {
        method: 'courier',
        governorateId: 'amman',
        street: 'Wasfi Al-Tal Street, Building 42',
      },
    };

    const submitted = await firstValueFrom(service.submitRequest(payload));
    const cancelled = await firstValueFrom(service.cancelRequest(submitted.referenceNumber));

    expect(cancelled.status).toBe('cancelled');
    expect(service.requests()[0].status).toBe('cancelled');
  });
});
