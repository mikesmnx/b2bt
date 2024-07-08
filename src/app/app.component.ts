import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { SocketSettings } from './models/socket-settings';

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

  constructor(private pseudoSocketService: PseudoSocketService) {}

  ngOnInit(): void {
    this.pseudoSocketService.startWorker(this.socketSettings);

    this.pseudoSocketService.onMessage(msg => {
      console.log('msg: ', msg);
    });
  }

  changeSocketSettings(settings: SocketSettings): void {
    this.socketSettings = settings;
  }
}
