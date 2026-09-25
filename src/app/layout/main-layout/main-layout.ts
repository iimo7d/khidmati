import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    MatToolbar,
  ],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
  readonly isNavVisible = signal(true);

  private readonly router = inject(Router);
  private previousScrollY = 0;
  private accumulatedScroll = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentScrollY = Math.max(window.scrollY, 0);
    const delta = currentScrollY - this.previousScrollY;
    this.previousScrollY = currentScrollY;

    if (currentScrollY <= 16) {
      this.isNavVisible.set(true);
      this.accumulatedScroll = 0;
      return;
    }

    if (delta === 0) return;

    if (Math.sign(delta) !== Math.sign(this.accumulatedScroll)) {
      this.accumulatedScroll = 0;
    }

    this.accumulatedScroll += delta;

    if (Math.abs(this.accumulatedScroll) < 8) return;

    this.isNavVisible.set(this.accumulatedScroll < 0);
    this.accumulatedScroll = 0;
  }

  switchLanguage(): void {
    const targetLang = this.i18n.getOppositeLang();
    const currentUrl = this.router.url;
    const updatedUrl = currentUrl.replace(/^\/(en|ar)/, `/${targetLang}`);

    this.router.navigateByUrl(updatedUrl);
  }
}
