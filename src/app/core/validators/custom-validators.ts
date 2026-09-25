import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nationalIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const isValid = /^\d{10}$/.test(control.value);
    return isValid ? null : { nationalId: true };
  };
}

export function jordanianMobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const isValid = /^07[789]\d{7}$/.test(control.value);
    return isValid ? null : { jordanianMobile: true };
  };
}

export function minAgeValidator(minAge = 18): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

export function appointmentDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const date = new Date(control.value);
    if (isNaN(date.getTime())) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    if (selected.getTime() <= today.getTime()) {
      return { appointmentFuture: true };
    }
    const dayOfWeek = selected.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return { appointmentWeekend: true };
    }
    return null;
  };
}

