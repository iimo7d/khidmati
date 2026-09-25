import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { appHttpInterceptor } from './core/interceptors/app-http.interceptor';
import { CustomTitleStrategy } from './core/i18n/custom-title';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([appHttpInterceptor])),
    provideRouter(routes),
    {provide: TitleStrategy, useClass:CustomTitleStrategy}
  ],
};
