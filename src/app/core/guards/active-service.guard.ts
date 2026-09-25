import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServicesDataService } from '../services-data/services-data.service';
import { I18nService } from '../i18n/i18n.service';
import { catchError, map, of } from 'rxjs';

export const activeServiceGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const servicesData = inject(ServicesDataService);
  const i18n = inject(I18nService);

  const serviceId = route.paramMap.get('id');
  const lang = route.parent?.paramMap.get('lang') ?? i18n.currentLang();

  if (!serviceId) {
    return router.createUrlTree(['/', lang, 'services']);
  }

  return servicesData.getSnapShot().pipe(
    map(() => {
      const service = servicesData.getServiceById(serviceId);

      if (!service || !service.isActive) {
        return router.createUrlTree(['/', lang, 'services', serviceId]);
      }
      return true;
    }),
    catchError(() => of(true)),
  );
};
