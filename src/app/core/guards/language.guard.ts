import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Lang } from '../models/services.model';
import { inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { catchError, map, of } from 'rxjs';

const SUPPORTED_LANGUAGES: Lang[] = ['en', 'ar'];
const FALLBACK_LANG: Lang = 'en';

export const languageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const i18n = inject(I18nService);

  const langParam = route.paramMap.get('lang');

  if (!langParam || !SUPPORTED_LANGUAGES.includes(langParam as Lang)) {

    const segments = state.url.split('/').filter(Boolean);

    if (segments.length > 0) {
      segments[0] = FALLBACK_LANG;
    } else {
      segments.push(FALLBACK_LANG, 'services');
    }

    return router.createUrlTree(['/' + segments.join('/')]);
  }

  return i18n.setLanguage(langParam as Lang).pipe(
    map(() => true),

    catchError(() => of(true)),
  );
};
