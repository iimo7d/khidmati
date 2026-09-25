import { describe, it, expect } from 'vitest';
import { normalizeSearchText, matchesQuery } from './search-utils';

describe('Search Utils (Arabic Normalization Strategy)', () => {
  it('should normalize Arabic hamza variants (أ, إ, آ) to bare alif (ا)', () => {
    expect(normalizeSearchText('أحمد')).toBe('احمد');
    expect(normalizeSearchText('إصدار')).toBe('اصدار');
    expect(normalizeSearchText('آلات')).toBe('الات');
  });

  it('should normalize taa marbouta (ة) to haa (ه) and alif maqsura (ى) to yaa (ي)', () => {
    expect(normalizeSearchText('رخصة')).toBe('رخصه');
    expect(normalizeSearchText('مستشفى')).toBe('مستشفي');
  });

  it('should strip Arabic diacritics (tashkeel)', () => {
    expect(normalizeSearchText('خِدْمَاتِي')).toBe('خدماتي');
    expect(normalizeSearchText('مُوَاطِنٌ')).toBe('مواطن');
  });

  it('should perform case-insensitive and trimmed query matching', () => {
    expect(matchesQuery('Passport Renewal', '  passport ')).toBe(true);
    expect(matchesQuery('تجديد جواز السفر', 'جواز')).toBe(true);
    expect(matchesQuery('تجديد رخصة القيادة', 'رخصه')).toBe(true);
  });
});
