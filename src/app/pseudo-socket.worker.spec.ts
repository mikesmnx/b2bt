import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';
import { TableItemFactory } from './classes/table-item-factory';
import { SocketActionType } from './models/socket-action-types';
import './worker';  // Import the worker code

describe('Web Worker', () => {
  let originalPostMessage: any;
  let originalClearInterval: any;
  let mockPostMessage: jasmine.Spy;
  let mockClearInterval: jasmine.Spy;

  beforeEach(() => {
    originalPostMessage = (globalThis as any).postMessage;
    originalClearInterval = (globalThis as any).clearInterval;
    mockPostMessage = jasmine.createSpy('postMessage');
    mockClearInterval = jasmine.createSpy('clearInterval');
    (globalThis as any).postMessage = mockPostMessage;
    (globalThis as any).clearInterval = mockClearInterval;
  });

  afterEach(() => {
    (globalThis as any).postMessage = originalPostMessage;
    (globalThis as any).clearInterval = originalClearInterval;
  });

  it('should start and post messages at intervals', (done) => {
    const arraySize = 5;
    const timer = 1000;

    spyOn(TableItemFactory, 'createTableItems').and.returnValue([
        new TableItem('1', 1, 1.1, 'red', new TableItemChild('1.1', 'blue'))
      ]);

    const startAction = {
      command: SocketActionType.Start,
      socketSettings: {
        arraySize,
        timer
      }
    };

    dispatchEvent(new MessageEvent('message', { data: startAction }));

    setTimeout(() => {
      expect(TableItemFactory.createTableItems).toHaveBeenCalledWith(arraySize);
      expect(mockPostMessage).toHaveBeenCalledWith([{ id: '1', int: 1, float: 1.1, color: 'red', child: { id: '1.1', color: 'blue' } }]);
      done();
    }, 1100);
  });

  it('should stop the interval when Stop command is received', () => {
    const stopAction = {
      command: SocketActionType.Stop
    };

    dispatchEvent(new MessageEvent('message', { data: stopAction }));

    expect(mockClearInterval).toHaveBeenCalled();
  });
});
