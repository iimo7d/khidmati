import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RequestsService } from '../../../core/requests/requests.service';
import { ServicesDataService } from '../../../core/services-data/services-data.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LocalizedDatePipe } from '../../../core/i18n/localized-date.pipe';
import { EmptyState } from '../../../ui/empty-state/empty-state';
import { ServiceRequest } from '../../../core/models/requests.model';
import {
  CancelConfirmDialog,
  CancelDialogData,
} from '../../../pattern/cancel-confirm-dialog/cancel-confirm-dialog';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-my-requests-page',
  standalone: true,
  imports: [
    LocalizedDatePipe,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    EmptyState,
  ],
  templateUrl: './my-requests-page.html',
  styleUrl: './my-requests-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRequestsPage implements OnInit {
  readonly requestsService = inject(RequestsService);
  private readonly servicesData = inject(ServicesDataService);
  readonly i18n = inject(I18nService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly isLoading = signal<boolean>(true);

  readonly requests = this.requestsService.requests;

  ngOnInit(): void {
    this.servicesData
      .loadData()
      .pipe(catchError(() => EMPTY))
      .subscribe();

    this.requestsService
      .getRequests()
      .pipe(
        catchError(() => {
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe(() => this.isLoading.set(false));
  }

  getServiceName(serviceId: string): string {
    const service = this.servicesData.getServiceById(serviceId);
    return service ? this.i18n.translateData(service.name) : serviceId;
  }

  onCancelRequest(request: ServiceRequest): void {
    if (request.status === 'cancelled') return;

    const dialogData: CancelDialogData = {
      referenceNumber: request.referenceNumber,
      serviceName: this.getServiceName(request.serviceId),
    };

    const dialogRef = this.dialog.open(CancelConfirmDialog, {
      data: dialogData,
      width: '440px',
      autoFocus: 'dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.requestsService.cancelRequest(request.referenceNumber).subscribe({
          error: (err) => console.error('Failed to cancel request', err),
        });
      }
    });
  }

  browseServices(): void {
    this.router.navigate(['/', this.i18n.currentLang(), 'services']);
  }
}
