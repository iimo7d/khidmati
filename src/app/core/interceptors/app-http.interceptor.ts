import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const i18n = inject(I18nService);
  const snackBar = inject(MatSnackBar);

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': i18n.currentLang(),
    },
  });

  return next(modifiedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const errorMessage = i18n.t('common.httpError');
      const dismissLabel = i18n.t('common.dismiss');

      snackBar.open(errorMessage, dismissLabel, {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });

      return throwError(() => err);
    }),
  );
};
