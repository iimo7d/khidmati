import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CatalogPage } from './catalog-page';

describe('CatalogPage (Smart Feature Mediator)', () => {
  let component: CatalogPage;
  let fixture: ComponentFixture<CatalogPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPage],
      providers: [provideRouter([]), provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and initialize search and category signals', () => {
    expect(component).toBeTruthy();
    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategoryId()).toBeNull();
  });

  it('should clear filters when clearFilters() is invoked', () => {
    component.searchTerm.set('passport');
    component.selectedCategoryId.set('civil');
    component.clearFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategoryId()).toBeNull();
  });
});
