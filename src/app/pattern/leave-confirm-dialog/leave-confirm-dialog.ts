import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  selector: 'app-leave-confirm-dialog',
  styleUrl: './leave-confirm-dialog.css',
  templateUrl: './leave-confirm-dialog.html',
})
export class LeaveConfirmDialog {}
