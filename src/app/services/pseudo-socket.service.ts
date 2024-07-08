import { Injectable } from '@angular/core';

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

  startWorker(timeout: number) {
    this.worker.postMessage({ command: 'start', timeout: timeout });
  }

  stopWorker() {
    this.worker.postMessage({ command: 'stop' });
  }

  onMessage(callback: (message: any) => void) {
    this.worker.onmessage = ({ data }) => {
      callback(data);
    };
  }
}
