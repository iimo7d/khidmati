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
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ServicesDataService } from '../../../core/services-data/services-data.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe, TranslateDataPipe } from '../../../core/i18n/translate.pipe';
import { JodCurrencyPipe } from '../../../core/i18n/jod-currency.pipe';

import { GovService, Category } from '../../../core/models/services.model';

@Component({
  selector: 'app-service-details-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    TranslateDataPipe,
    JodCurrencyPipe,
  ],
  templateUrl: './service-details-page.html',
  styleUrl: './service-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailsPage implements OnInit {
  readonly servicesData = inject(ServicesDataService);
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  
  readonly serviceId = signal<string | null>(null);

  
  readonly service = computed<GovService | undefined>(() => {
    const id = this.serviceId();
    return id ? this.servicesData.getServiceById(id) : undefined;
  });

  
  readonly category = computed<Category | undefined>(() => {
    const s = this.service();
    return s ? this.servicesData.getCategoryById(s.categoryId) : undefined;
  });

  
  readonly isFree = computed(() => this.service()?.fee === 0);

  
  readonly isSameDay = computed(() => this.service()?.processingDays === 0);

  
  readonly deliveryOptionsText = computed<string>(() => {
    const options = this.service()?.deliveryOptions ?? [];
    return options
      .map((opt) =>
        opt === 'pickup'
          ? this.i18n.t('details.deliveryPickup')
          : this.i18n.t('details.deliveryCourier'),
      )
      .join(' · ');
  });

  ngOnInit(): void {
    
    this.servicesData
      .loadData()
      .pipe(catchError(() => EMPTY))
      .subscribe();

    
    this.route.paramMap
      .pipe(takeUntilDestroyed<ParamMap>(this.destroyRef))
      .subscribe((params: ParamMap) => {
        this.serviceId.set(params.get('id'));
      });
  }
}
