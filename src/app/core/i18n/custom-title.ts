import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService } from './i18n.service';
import { ServicesDataService } from '../services-data/services-data.service';

@Injectable({
  providedIn: 'root',
})
export class CustomTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private readonly servicesData = inject(ServicesDataService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const brandName = this.i18n.t('nav.brand') || 'Khidmati';

    let currentRoute: ActivatedRouteSnapshot = snapshot.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const serviceId = currentRoute.paramMap.get('id');
    const path = currentRoute.routeConfig?.path;

    if (serviceId) {
      this.servicesData.getSnapShot().subscribe(() => {
        const service = this.servicesData.getServiceById(serviceId);

        if (service) {
          const localizedServiceName = this.i18n.translateData(service.name);
          if (path === 'apply' || currentRoute.url.some((segment) => segment.path === 'apply')) {
            const prefix = this.i18n.t('apply.titlePrefix') || 'Apply:';
            this.title.setTitle(`${brandName} | ${prefix} ${localizedServiceName}`);
          } else {
            this.title.setTitle(`${brandName} | ${localizedServiceName}`);
          }
        } else {
          const notFound = this.i18n.t('details.notFoundTitle') || 'Service Not Found';
          this.title.setTitle(`${brandName} | ${notFound}`);
        }
      });
      return;
    }

    const titleKey = this.buildTitle(snapshot);
    if (titleKey) {
      const translatedTitle = this.i18n.t(titleKey);
      this.title.setTitle(`${brandName} | ${translatedTitle}`);
    } else {
      this.title.setTitle(brandName);
    }
  }
}
