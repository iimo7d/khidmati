import { Injectable, signal } from '@angular/core';
import { CreateRequestPayload, ServiceRequest } from '../models/requests.model';
import { delay, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private readonly storageKey = 'khadmati_requests';
  private readonly networkDelays = 800;

  private readonly _requests = signal<ServiceRequest[]>(this.loadFromStorage());

  readonly requests = this._requests.asReadonly();

  getRequests(): Observable<ServiceRequest[]> {
    const current = this.loadFromStorage();
    this._requests.set(current);
    return of(current).pipe(delay(this.networkDelays));
  }

  getRequestByReference(referenceNumber: string): Observable<ServiceRequest | undefined> {
    const found = this._requests().find((r) => r.referenceNumber === referenceNumber);

    if (!found) {
      return throwError(() => new Error(`Request with reference ${referenceNumber} not found.`));
    }

    return of(found).pipe(delay(this.networkDelays));
  }

  submitRequest(payload: CreateRequestPayload): Observable<ServiceRequest> {
    const newRequest: ServiceRequest = {
      ...payload,
      referenceNumber: this.generateReferenceNumber(),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    return of(newRequest).pipe(
      delay(this.networkDelays),
      tap((savedRequest) => {
        const updatedList = [savedRequest, ...this._requests()];
        this.saveToStorage(updatedList);
        this._requests.set(updatedList);
      }),
    );
  }

  cancelRequest(referenceNumber: string): Observable<ServiceRequest> {
    const currentList = this._requests();
    const target = currentList.find((r) => r.referenceNumber === referenceNumber);

    if (!target) {
      return throwError(() => new Error(`Request with reference ${referenceNumber} not found.`));
    }

    const updatedRequest: ServiceRequest = {
      ...target,
      status: 'cancelled',
    };

    return of(updatedRequest).pipe(
      delay(this.networkDelays),
      tap((cancelled) => {
        const updatedList = currentList.map((r) =>
          r.referenceNumber === referenceNumber ? cancelled : r,
        );

        this.saveToStorage(updatedList);
        this._requests.set(updatedList);
      }),
    );
  }

  private generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    return `KH-${year}-${randomSixDigits}`;
  }

  private loadFromStorage(): ServiceRequest[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];

      const parsed: ServiceRequest[] = JSON.parse(raw);

      return parsed.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );
    } catch {
      return [];
    }
  }

  private saveToStorage(requests: ServiceRequest[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save request to localStorage', e);
    }
  }
}
