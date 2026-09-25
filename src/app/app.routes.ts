import { Routes } from '@angular/router';
import { languageGuard } from './core/guards/language.guard';
import { pendingChangesGuard } from './core/guards/pending-changes.guard';
import { activeServiceGuard } from './core/guards/active-service.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en',
  },
  {
    path: ':lang',
    canActivate: [languageGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'services',
      },
      {
        path: 'services',
        title: 'catalog.title',
        loadComponent: () =>
          import('./feature/services-catalog/catalog-page/catalog-page').then((m) => m.CatalogPage),
      },
      {
        path: 'services/:id',
        loadComponent: () =>
          import('./feature/service-details/service-details-page/service-details-page').then(
            (m) => m.ServiceDetailsPage,
          ),
      },
      {
        path: 'services/:id/apply',
        canDeactivate: [pendingChangesGuard],
        canActivate: [activeServiceGuard],
        loadComponent: () =>
          import('./feature/apply/apply-page/apply-page').then((m) => m.ApplyPage),
      },
      {
        path: 'requests',
        title: 'requests.title',
        loadComponent: () =>
          import('./feature/my-requests/my-requests-page/my-requests-page').then(
            (m) => m.MyRequestsPage,
          ),
      },
      {
        path: '**',
        title: 'notFound.title',
        loadComponent: () =>
          import('./feature/not-found/not-found-page/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'en',
  },
];
