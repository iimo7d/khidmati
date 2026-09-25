import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateDataPipe } from '../../core/i18n/translate.pipe';
import { JodCurrencyPipe } from '../../core/i18n/jod-currency.pipe';
import { Category, GovService } from '../../core/models/services.model';

@Component({
  imports: [RouterLink, MatCardModule, MatIconModule, TranslatePipe, TranslateDataPipe, JodCurrencyPipe],
  selector: 'app-service-card',
  styleUrl: './service-card.css',
  templateUrl: './service-card.html',
})
export class ServiceCard {
  readonly service = input.required<GovService>();
  readonly category = input.required<Category | undefined>();
  readonly currentLang = input.required<string>();

  readonly categoryIcon = computed(() => this.category()?.icon || 'miscellaneous_services');

  readonly isFree = computed(() => this.service().fee === 0);

  readonly isSameDay = computed(() => this.service().processingDays === 0);
}
