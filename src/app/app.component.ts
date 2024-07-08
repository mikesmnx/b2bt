import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { SocketSettings } from './models/socket-settings';
import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';
import { Subject } from 'rxjs';

const DEFAULT_TIMER = 900;
const DEFAULT_ARRAY_SIZE = 100;
const DEFAULT_ADDITIONAL_IDS = '';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public socketSettings: SocketSettings = {
    timer: DEFAULT_TIMER,
    arraySize: DEFAULT_ARRAY_SIZE,
    additionalArrayIds: DEFAULT_ADDITIONAL_IDS,
  };

  public rows$ = new Subject<TableItem[]>();

  constructor(private pseudoSocketService: PseudoSocketService) {}

  ngOnInit(): void {
    this.pseudoSocketService.startWorker(this.socketSettings);

    this.pseudoSocketService.onMessage(items => {
      this.rows$.next(items.map((i: TableItem) => new TableItem(
        i.id,
        i.int,
        i.float,
        i.color,
        new TableItemChild(i.child.id, i.child.color),
      )));
    });
  }

  changeSocketSettings(settings: SocketSettings): void {
    this.socketSettings = settings;
  }
}
