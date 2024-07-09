import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppSettings } from 'src/app/models/app-settings';

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

  @Output() onSettingsChanged = new EventEmitter<AppSettings>();

  public timerValid = true;
  public arraySizeValid = true;
  public additionalArrayIdsValid = true;

  onSettingsChange() {
    this.timerValid = this.isPositiveNumber(this.timer);
    this.arraySizeValid = this.isPositiveNumber(this.arraySize);
    this.additionalArrayIdsValid = this.isValidAdditionalArrayIds(this.additionalArrayIds);

    if (this.timerValid && this.arraySizeValid && this.additionalArrayIdsValid) {
      const processedAdditionalArrayIds = this.processAdditionalArrayIds(this.additionalArrayIds);
      this.onSettingsChanged.emit({
        timer: this.timer,
        arraySize: this.arraySize,
        additionalArrayIds: processedAdditionalArrayIds
      });
    }
  }

  isPositiveNumber(value: any): boolean {
    return !isNaN(value) && value > 0;
  }

  isValidAdditionalArrayIds(value: string): boolean {
    if (value?.trim() === '') return true;
    return /^(\d+(\s*,\s*|\s+))*\d+$/.test(value?.trim());
  }

  processAdditionalArrayIds(value: string): string {
    if (value.trim() === '') return '';
    return value.split(/[\s,]+/).map(id => id.trim()).filter(id => id !== '').join(',');
  }
}
