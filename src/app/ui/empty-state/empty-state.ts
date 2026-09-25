import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-empty-state',
  styleUrl: './empty-state.css',
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly icon = input<string>('search_off');
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly actionLabel = input<string>('');

  readonly actionClick = output<void>();
}
