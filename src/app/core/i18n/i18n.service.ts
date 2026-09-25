import { HttpClient } from '@angular/common/http';
import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { Lang, LocalizedText } from '../models/services.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

export type Direction = 'ltr' | 'rtl';
export type TranslationValue = string | { [key: string]: TranslationValue };
export type Translations = Record<string, TranslationValue>;
@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);

  private readonly translationCache = new Map<Lang, Translations>();

  private readonly _currentLang = signal<Lang>('en');
  private readonly _translations = signal<Translations>({});
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly currentLang = this._currentLang.asReadonly();
  readonly translations = this._translations.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly currentDir = computed<Direction>(() => (this._currentLang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed<boolean>(() => this.currentDir() === 'rtl');
  getOppositeLang(): Lang {
    return this._currentLang() === 'en' ? 'ar' : 'en';
  }

  constructor() {
    effect(() => {
      const lang = this._currentLang();
      const dir = this.currentDir();
      const htmlElement = this.document.documentElement;

      htmlElement.setAttribute('lang', lang);
      htmlElement.setAttribute('dir', dir);
    });
  }

  setLanguage(lang: Lang): Observable<Translations> {
    if (this._currentLang() === lang && Object.keys(this._translations()).length > 0) {
      return of(this._translations());
    }

    this._currentLang.set(lang);
    this._error.set(null);

    const cached = this.translationCache.get(lang);
    if (cached) {
      this._translations.set(cached);
      return of(cached);
    }

    this._isLoading.set(true);

    return this.http.get<Translations>(`i18n/${lang}.json`).pipe(
      tap((data) => {
        this.translationCache.set(lang, data);
        this._translations.set(data);
        this._isLoading.set(false);
      }),
      catchError((err) => {
        console.error(`Failed to load translations for: ${lang}`, err);
        this._isLoading.set(false);
        this._error.set(`Failed to load translations for "${lang}".`);
        return throwError(() => err);
      }),
    );
  }

  t(key: string, params?: Record<string, string | number>): string {
    const dict = this._translations();
    let current: unknown = dict;
    for (const segment of key.split('.')) {
      if (current && typeof current === 'object' && segment in current) {
        current = (current as Record<string, unknown>)[segment];
      } else {
        return key;
      }
    }
    if (typeof current !== 'string') {
      return key;
    }
    let result = current;
    if (params) {
      for (const [paramKey, paramVal] of Object.entries(params)) {
        result = result.split(`{${paramKey}}`).join(String(paramVal));
      }
    }
    return result;
  }

  translateData(localized?: LocalizedText): string {
    if (!localized) return '';
    const lang = this._currentLang();
    return localized[lang] || localized['en'] || '';
  }
}
