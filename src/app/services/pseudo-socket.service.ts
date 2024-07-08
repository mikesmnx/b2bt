import { Injectable } from '@angular/core';
import { SocketSettings } from '../models/socket-settings';
import { SocketActionType } from '../models/socket-action-types';

@Injectable({
  providedIn: 'root',
})
export class PseudoSocketService {
  private worker!: Worker;

  constructor() {
    this.worker = new Worker(
      new URL('../pseudo-socket.worker.ts', import.meta.url)
    );
  }

  startWorker(socketSettings: SocketSettings) {
    this.worker.postMessage({ command: SocketActionType.Start, socketSettings });
  }

  stopWorker() {
    this.worker.postMessage({ command: SocketActionType.Stop });
  }

  onMessage(callback: (message: any) => void) {
    this.worker.onmessage = ({ data }) => {
      callback(data);
    };
  }
}
