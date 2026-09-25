import { registerLocaleData } from '@angular/common';
import localeArJo from '@angular/common/locales/ar-JO';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeArJo);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
