import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainLayout } from './main-layout';

describe('MainLayout (Layout Layer)', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([]), provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create layout with header, main, and footer landmarks', () => {
    expect(component).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('main')).toBeTruthy();
    expect(el.querySelector('footer')).toBeTruthy();
  });

  it('should hide while scrolling down and show while scrolling up', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get');
    const header = fixture.nativeElement.querySelector('header') as HTMLElement;

    scrollY.mockReturnValue(30);
    component.onWindowScroll();
    fixture.detectChanges();
    expect(header.classList.contains('site-header--hidden')).toBe(true);

    scrollY.mockReturnValue(20);
    component.onWindowScroll();
    fixture.detectChanges();
    expect(header.classList.contains('site-header--hidden')).toBe(false);
  });
});
