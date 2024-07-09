import { TestBed } from '@angular/core/testing';

import { PseudoSocketService } from './pseudo-socket.service';
import { SocketActionType } from '../models/socket-action-types';
import { SocketSettings } from '../models/socket-settings';

class MockWorker implements Worker {
  onmessage: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
  onmessageerror: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
  onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null = null;

  postMessage = (message: any) => {
    if (message.command === SocketActionType.Start) {
      if (this.onmessage) {
        this.onmessage({ data: 'mockData' } as MessageEvent);
      }
    }
  }

  terminate = (): void => {}

  addEventListener = <K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void => {}

  removeEventListener = <K extends keyof WorkerEventMap>(
    type: K,
    listener: (this: Worker, ev: WorkerEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void => {}

  dispatchEvent = (event: Event): boolean => {
    return true;
  }
}

describe('PseudoSocketService', () => {
  let service: PseudoSocketService;
  let mockWorker: MockWorker;

  beforeEach(() => {
    mockWorker = new MockWorker();
    spyOn(window, 'Worker').and.returnValue(mockWorker as unknown as Worker);

    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start the worker with correct settings', () => {
    const socketSettings: SocketSettings = {
      arraySize: 10,
      timer: 1000
    };

    spyOn(mockWorker, 'postMessage').and.callThrough();
    service.startWorker(socketSettings);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      command: SocketActionType.Start,
      socketSettings
    });
  });

  it('should stop the worker', () => {
    spyOn(mockWorker, 'postMessage').and.callThrough();
    service.stopWorker();

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      command: SocketActionType.Stop
    });
  });

  it('should handle messages from the worker', (done) => {
    const callback = jasmine.createSpy('callback');

    service.onMessage(callback);
    service.startWorker({ arraySize: 10, timer: 1000 });

    if (mockWorker.onmessage) {
      mockWorker.onmessage({ data: 'mockData' } as MessageEvent);
    }

    expect(callback).toHaveBeenCalledWith('mockData');
    done();
  });
});
