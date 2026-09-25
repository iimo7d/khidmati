import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import {
  nationalIdValidator,
  jordanianMobileValidator,
  minAgeValidator,
  appointmentDateValidator,
} from './custom-validators';

describe('Custom Validators', () => {
  describe('nationalIdValidator', () => {
    const validator = nationalIdValidator();

    it('should accept exactly 10 digits', () => {
      expect(validator(new FormControl('1234567890'))).toBeNull();
    });

    it('should reject numbers with less or more than 10 digits', () => {
      expect(validator(new FormControl('123456789'))).toEqual({ nationalId: true });
      expect(validator(new FormControl('12345678901'))).toEqual({ nationalId: true });
    });

    it('should reject non-numeric characters', () => {
      expect(validator(new FormControl('12345ABCDE'))).toEqual({ nationalId: true });
    });

    it('should return null for empty values', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });
  });

  describe('jordanianMobileValidator', () => {
    const validator = jordanianMobileValidator();

    it('should accept valid Jordanian mobile prefixes (077, 078, 079)', () => {
      expect(validator(new FormControl('0791234567'))).toBeNull();
      expect(validator(new FormControl('0785551234'))).toBeNull();
      expect(validator(new FormControl('0770001111'))).toBeNull();
    });

    it('should reject non-mobile prefixes or invalid operators', () => {
      expect(validator(new FormControl('065001234'))).toEqual({ jordanianMobile: true });
      expect(validator(new FormControl('0761234567'))).toEqual({ jordanianMobile: true });
    });

    it('should reject incorrect lengths', () => {
      expect(validator(new FormControl('079123456'))).toEqual({ jordanianMobile: true });
      expect(validator(new FormControl('07912345678'))).toEqual({ jordanianMobile: true });
    });
  });

  describe('minAgeValidator', () => {
    const validator = minAgeValidator(18);

    it('should accept applicants 18 years or older', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 20);
      expect(validator(new FormControl(birthDate.toISOString().split('T')[0]))).toBeNull();
    });

    it('should reject applicants under 18 years old', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 17);
      const res = validator(new FormControl(birthDate.toISOString().split('T')[0]));
      expect(res).toEqual({ minAge: { requiredAge: 18, actualAge: 17 } });
    });
  });

  describe('appointmentDateValidator', () => {
    const validator = appointmentDateValidator();

    it('should reject past or same-day dates', () => {
      const today = new Date();
      expect(validator(new FormControl(today.toISOString().split('T')[0]))).toEqual({
        appointmentFuture: true,
      });
    });

    it('should reject appointments on Friday or Saturday', () => {
      const now = new Date();
      
      const friday = new Date(now);
      friday.setDate(now.getDate() + ((5 + 7 - now.getDay()) % 7 || 7));
      expect(validator(new FormControl(friday.toISOString().split('T')[0]))).toEqual({
        appointmentWeekend: true,
      });

      
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 + 7 - now.getDay()) % 7 || 7));
      expect(validator(new FormControl(saturday.toISOString().split('T')[0]))).toEqual({
        appointmentWeekend: true,
      });
    });

    it('should accept future working weekdays (Sunday - Thursday)', () => {
      const now = new Date();
      
      const sunday = new Date(now);
      sunday.setDate(now.getDate() + ((0 + 7 - now.getDay()) % 7 || 7));
      expect(validator(new FormControl(sunday.toISOString().split('T')[0]))).toBeNull();
    });
  });
});
