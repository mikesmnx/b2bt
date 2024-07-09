import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { SocketSettings } from './models/socket-settings';
import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';
import { Subject } from 'rxjs';
import { SocketItem } from './models/socket-item';

const DEFAULT_TIMER = 1000;
const DEFAULT_ARRAY_SIZE = 1000;
const DEFAULT_ADDITIONAL_IDS = '';
const DEFAULT_ITEMS_PER_PAGE = 10;
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

  public additionalArrayIds = ['1', '2', '3', '4'];

  constructor(private pseudoSocketService: PseudoSocketService) {}

  ngOnInit(): void {
    this.pseudoSocketService.startWorker(this.socketSettings);

    this.pseudoSocketService.onMessage((items: SocketItem[]) => {
      const processedItems = this.processMessage(items);

      this.rows$.next(processedItems);
    });
  }

  changeSocketSettings(settings: SocketSettings): void {
    this.socketSettings = settings;
  }

  private processMessage(items: SocketItem[]): TableItem[] {
    const additionalArrayIdsSet = new Set(this.additionalArrayIds.map(String));

    const additionalItems = this.additionalArrayIds
      .map(id => items.find(item => item.id === id))
      .filter((item): item is SocketItem => item !== undefined);

    let combinedItems: SocketItem[];

    if (additionalItems.length >= DEFAULT_ITEMS_PER_PAGE) {
      combinedItems = additionalItems.slice(0, DEFAULT_ITEMS_PER_PAGE);
    } else {
      const remainingItems = items.filter(item => !additionalArrayIdsSet.has(item.id));
      const neededItemsCount = DEFAULT_ITEMS_PER_PAGE - additionalItems.length;
      const neededItems = remainingItems.slice(-neededItemsCount);
      combinedItems = additionalItems.concat(neededItems);
    }

    return combinedItems.map((i: SocketItem) => new TableItem(
      i.id,
      i.int,
      i.float,
      i.color,
      new TableItemChild(i.child.id, i.child.color),
    ));
  }
}
