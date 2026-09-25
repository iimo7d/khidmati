import { LocalizedText } from './../models/services.model';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: Record<string, string | number>): string {
    if (!key) return '';

    return this.i18n.t(key, params);
  }
}

@Pipe({
  name: 'translateData',
  standalone: true,
  pure: false,
})
export class TranslateDataPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(localized?: LocalizedText | null): string {
    if (!localized) return '';
    return this.i18n.translateData(localized);
  }
}
