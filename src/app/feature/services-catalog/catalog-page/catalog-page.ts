import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EMPTY, catchError } from 'rxjs';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServicesDataService } from '../../../core/services-data/services-data.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe, TranslateDataPipe } from '../../../core/i18n/translate.pipe';
import { ServiceCard } from '../../../ui/service-card/service-card';
import { EmptyState } from '../../../ui/empty-state/empty-state';
import { matchesQuery } from '../../../core/utils/search-utils';
import { GovService } from '../../../core/models/services.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    TranslateDataPipe,
    ServiceCard,
    EmptyState,
  ],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage implements OnInit {
  readonly servicesData = inject(ServicesDataService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  
  readonly searchTerm = signal<string>('');
  readonly selectedCategoryId = signal<string | null>(null);

  
  readonly filteredServices = computed<GovService[]>(() => {
    const allServices = this.servicesData.services();
    const query = this.searchTerm().trim();
    const categoryId = this.selectedCategoryId();

    return allServices.filter((service) => {
      
      if (categoryId && service.categoryId !== categoryId) {
        return false;
      }
      
      if (!query) {
        return true;
      }
      const nameMatch = matchesQuery(this.i18n.translateData(service.name), query);
      const summaryMatch = matchesQuery(this.i18n.translateData(service.summary), query);
      const keywords = service.keywords ?? [];
      const keywordMatch = keywords.some((kw) => matchesQuery(kw, query));

      return nameMatch || summaryMatch || keywordMatch;
    });
  });

  
  readonly resultsCountText = computed(() => {
    const count = this.filteredServices().length;
    return this.i18n.t('catalog.servicesCount', { count });
  });

  ngOnInit(): void {
    
    this.servicesData
      .loadData()
      .pipe(catchError(() => EMPTY))
      .subscribe();

    
    this.route.queryParamMap
      .pipe(takeUntilDestroyed<ParamMap>(this.destroyRef))
      .subscribe((params: ParamMap) => {
        const q = params.get('q') ?? '';
        const cat = params.get('category');
        this.searchTerm.set(q);
        this.selectedCategoryId.set(cat);
      });
  }

  
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.syncQueryParams();
  }

  onSelectCategory(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
    this.syncQueryParams();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategoryId.set(null);
    this.syncQueryParams();
  }

  onRetry(): void {
    this.servicesData
      .retry()
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  private syncQueryParams(): void {
    const query = this.searchTerm().trim();
    const category = this.selectedCategoryId();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: query ? query : null,
        category: category ? category : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
