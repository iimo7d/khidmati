import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Category, Governorate, GovService, ServicesData } from '../models/services.model';
import { catchError, Observable, of, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesDataService {
  private readonly http = inject(HttpClient);
  private readonly url = 'data/services.json';

  private readonly _services = signal<GovService[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _governorates = signal<Governorate[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _isLoaded = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly services = this._services.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly governorates = this._governorates.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoaded = this._isLoaded.asReadonly();
  readonly error = this._error.asReadonly();

  readonly activeServicesCount = computed(() => this._services().filter((s) => s.isActive).length);

  private readonly _servicesById = computed(() => new Map(this._services().map((s) => [s.id, s])));

  private readonly _categoryById = computed(
    () => new Map(this._categories().map((c) => [c.id, c])),
  );

  private readonly _governorateById = computed(
    () => new Map(this._governorates().map((g) => [g.id, g])),
  );

  private requests$?: Observable<ServicesData>;

  loadData(forceReload = false): Observable<ServicesData> {
    if (this.requests$ && !forceReload) {
      return this.requests$;
    }

    this._loading.set(true);
    this._error.set(null);

    this.requests$ = this.http.get<ServicesData>(this.url).pipe(
      tap((data) => {
        this._categories.set(data?.categories ?? []);
        this._governorates.set(data?.governorates ?? []);
        this._services.set(data?.services ?? []);
        this._isLoaded.set(true);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Failed to load services data.');
        this.requests$ = undefined;
        return throwError(() => err);
      }),
      shareReplay(1),
    );

    return this.requests$;
  }

  retry(): Observable<ServicesData> {
    return this.loadData(true);
  }

  getSnapShot(): Observable<ServicesData> {
    if (this._isLoaded()) {
      return of({
        version: 1,
        categories: this._categories(),
        governorates: this._governorates(),
        services: this._services(),
      });
    }

    return this.loadData();
  }

  getServiceById(id: string): GovService | undefined {
    return this._servicesById().get(id);
  }
  getCategoryById(id: string): Category | undefined {
    return this._categoryById().get(id);
  }

  getGovernorateById(id: string): Governorate | undefined {
    return this._governorateById().get(id);
  }
}
