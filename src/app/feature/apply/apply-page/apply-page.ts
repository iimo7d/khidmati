import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';

import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ServicesDataService } from '../../../core/services-data/services-data.service';
import { RequestsService } from '../../../core/requests/requests.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe, TranslateDataPipe } from '../../../core/i18n/translate.pipe';
import { GovService, DeliveryMethod } from '../../../core/models/services.model';
import { CreateRequestPayload, ServiceRequest } from '../../../core/models/requests.model';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { LeaveConfirmDialog } from '../../../pattern/leave-confirm-dialog/leave-confirm-dialog';
import { LocalizedDatePipe } from '../../../core/i18n/localized-date.pipe';
import {
  nationalIdValidator,
  jordanianMobileValidator,
  minAgeValidator,
  appointmentDateValidator,
} from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-apply-page',
  standalone: true,
  imports: [
    LocalizedDatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    TranslateDataPipe,
  ],
  templateUrl: './apply-page.html',
  styleUrl: './apply-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly servicesData = inject(ServicesDataService);
  private readonly requestsService = inject(RequestsService);
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  readonly serviceId = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly submittedRequest = signal<ServiceRequest | null>(null);

  readonly service = computed<GovService | undefined>(() => {
    const id = this.serviceId();
    return id ? this.servicesData.getServiceById(id) : undefined;
  });

  readonly minAppointmentDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  })();

  readonly dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 5 && day !== 6;
  };

  readonly applicantForm = this.fb.group({
    fullName: this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(80),
    ]),
    nationalId: this.fb.control('', [Validators.required, nationalIdValidator()]),
    mobile: this.fb.control('', [Validators.required, jordanianMobileValidator()]),
    email: this.fb.control('', [Validators.email]),
    dateOfBirth: this.fb.control<string | Date>('', [
      Validators.required,
      minAgeValidator(18),
    ]),
  });


  readonly deliveryForm = this.fb.group({
    method: this.fb.control<DeliveryMethod>('pickup', { nonNullable: true }),
    appointmentDate: this.fb.control<string | Date>(''),
    governorateId: this.fb.control(''),
    street: this.fb.control(''),
    notes: this.fb.control('', [Validators.maxLength(250)]),
  });

  readonly reviewForm = this.fb.group({
    confirmed: this.fb.control(false, [Validators.requiredTrue]),
  });

  readonly notesLength = signal<number>(0);

  ngOnInit(): void {
    this.servicesData
      .loadData()
      .pipe(catchError(() => EMPTY))
      .subscribe(() => this.checkServiceAvailability());

    this.route.paramMap
      .pipe(takeUntilDestroyed<ParamMap>(this.destroyRef))
      .subscribe((params: ParamMap) => {
        this.serviceId.set(params.get('id'));
        this.checkServiceAvailability();
      });

    this.deliveryForm.controls.method.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((method) => this.updateDeliveryValidation(method));
    this.updateDeliveryValidation(this.deliveryForm.controls.method.value);

    this.deliveryForm.controls.notes.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.notesLength.set(val ? val.length : 0);
      });
  }


  private updateDeliveryValidation(method: DeliveryMethod): void {
    const appointmentDateControl = this.deliveryForm.controls.appointmentDate;
    const governorateIdControl = this.deliveryForm.controls.governorateId;
    const streetControl = this.deliveryForm.controls.street;

    if (method === 'pickup') {
      appointmentDateControl.setValidators([Validators.required, appointmentDateValidator()]);
      governorateIdControl.clearValidators();
      streetControl.clearValidators();
    } else {
      appointmentDateControl.clearValidators();
      governorateIdControl.setValidators([Validators.required]);
      streetControl.setValidators([Validators.required, Validators.minLength(5)]);
    }

    appointmentDateControl.updateValueAndValidity({ emitEvent: false });
    governorateIdControl.updateValueAndValidity({ emitEvent: false });
    streetControl.updateValueAndValidity({ emitEvent: false });
  }


  private checkServiceAvailability(): void {
    const s = this.service();
    if (s && !s.isActive) {
      this.router.navigate(['/', this.i18n.currentLang(), 'services', s.id]);
    } else if (s) {
      if (s.deliveryOptions.length === 1) {
        this.deliveryForm.controls.method.setValue(s.deliveryOptions[0], { emitEvent: false });
        this.updateDeliveryValidation(s.deliveryOptions[0]);
      }
    }
  }

  onSubmit(): void {
    if (this.applicantForm.invalid || this.deliveryForm.invalid || this.reviewForm.invalid) {
      this.applicantForm.markAllAsTouched();
      this.deliveryForm.markAllAsTouched();
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) return; 
    this.isSubmitting.set(true);

    const applicant = this.applicantForm.getRawValue();
    const delivery = this.deliveryForm.getRawValue();
    const serviceId = this.serviceId()!;

    const payload: CreateRequestPayload = {
      serviceId,
      applicant: {
        fullName: applicant.fullName!,
        nationalId: applicant.nationalId!,
        mobile: applicant.mobile!,
        email: applicant.email || undefined,
        dateOfBirth: new Date(applicant.dateOfBirth!).toISOString().split('T')[0],
      },
      delivery:
        delivery.method === 'pickup'
          ? {
              method: 'pickup',
              appointmentDate: new Date(delivery.appointmentDate!).toISOString().split('T')[0],
            }
          : {
              method: 'courier',
              governorateId: delivery.governorateId!,
              street: delivery.street!,
            },
      notes: delivery.notes || undefined,
    };

    this.requestsService.submitRequest(payload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.submittedRequest.set(created);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Submission failed', err);
      },
    });
  }

  goNext(form: FormGroup, stepper: MatStepper): void {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    stepper.next();
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.submittedRequest()) {
      return true;
    }
    const isDirty = this.applicantForm.dirty || this.deliveryForm.dirty;
    if (!isDirty) {
      return true;
    }
    const dialogRef = this.dialog.open(LeaveConfirmDialog, {
      width: '420px',
      autoFocus: 'dialog',
    });
    return dialogRef.afterClosed().pipe(map((confirmed) => Boolean(confirmed)));
  }
}
