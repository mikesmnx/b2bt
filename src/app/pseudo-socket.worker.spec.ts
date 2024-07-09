import { TableItem } from './classes/table-item';
import { TableItemChild } from './classes/table-item-child';
import { TableItemFactory } from './classes/table-item-factory';
import { SocketActionType } from './models/socket-action-types';

describe('Web Worker', () => {
  let originalPostMessage: any;
  let originalClearInterval: any;
  let originalSetInterval: any;
  let mockPostMessage: jasmine.Spy;
  let mockClearInterval: jasmine.Spy;
  let mockSetInterval: jasmine.Spy;
  let mockIntervalId: any;

  beforeAll(() => {
    originalPostMessage = (globalThis as any).postMessage;
    originalClearInterval = (globalThis as any).clearInterval;
    originalSetInterval = (globalThis as any).setInterval;

    mockPostMessage = jasmine.createSpy('postMessage');
    mockClearInterval = jasmine.createSpy('clearInterval');
    mockSetInterval = jasmine.createSpy('setInterval').and.callFake((fn: Function, interval: number) => {
      mockIntervalId = originalSetInterval(fn, interval);
      return mockIntervalId;
    });

    (globalThis as any).postMessage = mockPostMessage;
    (globalThis as any).clearInterval = mockClearInterval;
    (globalThis as any).setInterval = mockSetInterval;

    require('../app/pseudo-socket.worker');
  });

  afterAll(() => {
    (globalThis as any).postMessage = originalPostMessage;
    (globalThis as any).clearInterval = originalClearInterval;
    (globalThis as any).setInterval = originalSetInterval;

    originalClearInterval(mockIntervalId);
  });

  beforeEach(() => {
    mockPostMessage.calls.reset();
    mockClearInterval.calls.reset();
    mockSetInterval.calls.reset();
  });

  it('should start and post messages at intervals', (done) => {
    const arraySize = 5;
    const timer = 1000;

    spyOn(TableItemFactory, 'createTableItems').and.returnValue([
      new TableItem('1', 1, 1.1, 'red', new TableItemChild('1.1', 'blue'))
    ]);

    const startAction = {
      command: SocketActionType.Start,
      socketSettings: { arraySize, timer }
    };

    (globalThis as any).dispatchEvent(new MessageEvent('message', { data: startAction }));

    setTimeout(() => {
      expect(TableItemFactory.createTableItems).toHaveBeenCalledWith(arraySize);
      expect(mockPostMessage).toHaveBeenCalledWith([
        jasmine.objectContaining({
          id: '1',
          int: 1,
          float: 1.1,
          color: 'red',
          child: jasmine.objectContaining({ id: '1.1', color: 'blue' })
        })
      ]);
      done();
    }, 1100);
  });

  it('should stop the interval when Stop command is received', () => {
    const stopAction = { command: SocketActionType.Stop };

    const arraySize = 5;
    const timer = 1000;
    const startAction = {
      command: SocketActionType.Start,
      socketSettings: { arraySize, timer }
    };
    (globalThis as any).dispatchEvent(new MessageEvent('message', { data: startAction }));

    (globalThis as any).dispatchEvent(new MessageEvent('message', { data: stopAction }));

    expect(mockClearInterval).toHaveBeenCalled();
  });
});
