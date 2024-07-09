import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { AppSettings } from './models/app-settings';
import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';
import { Subject } from 'rxjs';
import { SocketItem } from './models/socket-item';

const DEFAULT_TIMER = 1000;
const DEFAULT_ARRAY_SIZE = 100;
const DEFAULT_ADDITIONAL_IDS = '';
const DEFAULT_ITEMS_PER_PAGE = 10;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public appSettings: AppSettings = {
    timer: DEFAULT_TIMER,
    arraySize: DEFAULT_ARRAY_SIZE,
    additionalArrayIds: DEFAULT_ADDITIONAL_IDS,
  };

  public rows$ = new Subject<TableItem[]>();

  public additionalIdsSet: Set<string> = new Set();

  private isProcessing = false;

  constructor(private pseudoSocketService: PseudoSocketService) {}

  ngOnInit(): void {
    this.pseudoSocketService.startWorker(this.appSettings);

    this.pseudoSocketService.onMessage((items: SocketItem[]) => {
      if (!this.isProcessing) {
        this.isProcessing = true;
        requestAnimationFrame(() => {
          const processedItems = this.processMessage(items);
          this.rows$.next(processedItems);
          this.isProcessing = false;
        });
      }
    });
  }

  changeAppSettings(settings: AppSettings): void {
    this.appSettings = settings;

    this.additionalIdsSet = new Set(
      this.appSettings.additionalArrayIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '')
    );

    this.pseudoSocketService.startWorker({
      timer: this.appSettings.timer,
      arraySize: this.appSettings.arraySize,
    });
  }

  private processMessage(items: SocketItem[]): TableItem[] {
    const additionalItems = Array.from(this.additionalIdsSet)
      .map(id => items.find(item => item.id === id))
      .filter((item): item is SocketItem => item !== undefined);

    let combinedItems: SocketItem[];

    if (additionalItems.length >= DEFAULT_ITEMS_PER_PAGE) {
      combinedItems = additionalItems.slice(0, DEFAULT_ITEMS_PER_PAGE);
    } else {
      const remainingItems = items.filter(item => !this.additionalIdsSet.has(item.id));
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

  ngOnDestroy(): void {
      this.pseudoSocketService.stopWorker();
  }
}
