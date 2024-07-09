import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { AppTableComponent } from './components/app-table/app-table.component';
import { SocketItem } from './models/socket-item';
import { Subject } from 'rxjs';
import { AppSettings } from './models/app-settings';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SocketSettings } from './models/socket-settings';
import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';

class MockPseudoSocketService {
  private subject = new Subject<SocketItem[]>();

  startWorker(settings: SocketSettings) {}

  stopWorker() {}

  onMessage(callback: (items: SocketItem[]) => void) {
    this.subject.subscribe(callback);
  }

  emit(items: SocketItem[]) {
    this.subject.next(items);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let pseudoSocketService: MockPseudoSocketService;

  beforeEach(async () => {
    pseudoSocketService = new MockPseudoSocketService();

    await TestBed.configureTestingModule({
      declarations: [AppComponent, AppSettingsComponent, AppTableComponent],
      providers: [
        { provide: PseudoSocketService, useValue: pseudoSocketService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default settings and start the worker', () => {
    spyOn(pseudoSocketService, 'startWorker');

    component.ngOnInit();

    expect(component.appSettings).toEqual({
      timer: 1000,
      arraySize: 100,
      additionalArrayIds: '',
    });

    expect(pseudoSocketService.startWorker).toHaveBeenCalledWith(
      component.appSettings
    );
  });

  it('should update settings and restart the worker', () => {
    spyOn(pseudoSocketService, 'startWorker');
    
    const newSettings: AppSettings = {
      timer: 500,
      arraySize: 50,
      additionalArrayIds: '1,2,3',
    };

    component.changeAppSettings(newSettings);

    expect(component.appSettings).toEqual(newSettings);
    expect(pseudoSocketService.startWorker).toHaveBeenCalledWith({
      timer: newSettings.timer,
      arraySize: newSettings.arraySize,
    });

    expect(component.additionalIdsSet).toEqual(new Set(['1', '2', '3']));
  });

  it('should process incoming messages and update rows', () => {
    const socketItems: SocketItem[] = [
      { id: '1', int: 10, float: 1.1, color: 'red', child: { id: '1.1', color: 'blue' } },
      { id: '2', int: 20, float: 2.2, color: 'green', child: { id: '2.1', color: 'yellow' } },
    ];

    const expectedTableItems: TableItem[] = [
      new TableItem('1', 10, 1.1, 'red', new TableItemChild('1.1', 'blue')),
      new TableItem('2', 20, 2.2, 'green', new TableItemChild('2.1','yellow')),
    ];

    pseudoSocketService.emit(socketItems);

    component.rows$.subscribe(rows => {
      expect(rows).toEqual(expectedTableItems);
    });
  });

  it('should stop the worker on destroy', () => {
    spyOn(pseudoSocketService, 'stopWorker');

    component.ngOnDestroy();

    expect(pseudoSocketService.stopWorker).toHaveBeenCalled();
  });
});
