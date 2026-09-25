import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

export interface CancelDialogData {
  referenceNumber: string;
  serviceName: string;
}

@Component({
  selector: 'app-cancel-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './cancel-confirm-dialog.html',
  styleUrl: './cancel-confirm-dialog.css',
})
export class CancelConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<CancelConfirmDialog>);
  readonly data = inject<CancelDialogData>(MAT_DIALOG_DATA);
}
