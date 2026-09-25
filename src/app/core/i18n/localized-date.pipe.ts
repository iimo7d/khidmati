import { formatDate } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: string | Date | null | undefined, format = 'mediumDate'): string {
    if (!value) return '';

    const locale = this.i18n.currentLang() === 'ar' ? 'ar-JO' : 'en';
    return formatDate(value, format, locale);
  }
}
