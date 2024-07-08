import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PseudoSocketService } from './services/pseudo-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'B2B Test';

  constructor(private pseudoSocketService: PseudoSocketService) {}

  ngOnInit(): void {
    this.pseudoSocketService.startWorker(5000);

    this.pseudoSocketService.onMessage(msg => {
      console.log('msg: ', msg);
    });
  }
}
