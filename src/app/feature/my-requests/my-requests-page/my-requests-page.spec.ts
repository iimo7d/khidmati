import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MyRequestsPage } from './my-requests-page';

describe('MyRequestsPage', () => {
  let component: MyRequestsPage;
  let fixture: ComponentFixture<MyRequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRequestsPage],
      providers: [provideRouter([]), provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create requests list view', () => {
    expect(component).toBeTruthy();
  });
});
