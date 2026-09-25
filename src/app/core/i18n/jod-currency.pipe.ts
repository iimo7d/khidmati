import { formatCurrency } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'jodCurrency',
  standalone: true,
  pure: false,
})
export class JodCurrencyPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const locale = this.i18n.currentLang() === 'ar' ? 'ar-JO' : 'en';
    const symbol = this.i18n.currentLang() === 'ar' ? 'د.أ' : 'JOD';

    return formatCurrency(value, locale, symbol, 'JOD', '1.3-3');
  }
}
