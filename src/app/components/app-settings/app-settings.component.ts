import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SocketSettings } from 'src/app/models/socket-settings';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSettingsComponent {
  @Input() timer!: number;
  @Input() arraySize!: number;
  @Input() additionalArrayIds!: string;

  @Output() onSettingsChanged = new EventEmitter<SocketSettings>();

  onSettingsChange() {
    this.onSettingsChanged.emit({
      timer: this.timer,
      arraySize: this.arraySize,
      additionalArrayIds: this.additionalArrayIds
    });
  }
}
