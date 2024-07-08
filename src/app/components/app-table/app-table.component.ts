import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableItem } from 'src/app/classes/table-item';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTableComponent {
  @Input() rows: TableItem[] | null = [];
}
