import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingsComponent } from './app-settings.component';
import { FormsModule } from '@angular/forms';
import { AppSettings } from 'src/app/models/app-settings';
import { By } from '@angular/platform-browser';

describe('AppSettingsComponent', () => {
  let component: AppSettingsComponent;
  let fixture: ComponentFixture<AppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppSettingsComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate positive number for timer', () => {
    component.timer = 10;
    expect(component.isPositiveNumber(component.timer)).toBeTrue();

    component.timer = -5;
    expect(component.isPositiveNumber(component.timer)).toBeFalse();

    component.timer = 0;
    expect(component.isPositiveNumber(component.timer)).toBeFalse();
  });

  it('should validate positive number for arraySize', () => {
    component.arraySize = 5;
    expect(component.isPositiveNumber(component.arraySize)).toBeTrue();

    component.arraySize = -1;
    expect(component.isPositiveNumber(component.arraySize)).toBeFalse();
  });

  it('should validate additional array IDs', () => {
    component.additionalArrayIds = '1, 2, 3';
    expect(
      component.isValidAdditionalArrayIds(component.additionalArrayIds)
    ).toBeTrue();

    component.additionalArrayIds = '1 2 3';
    expect(
      component.isValidAdditionalArrayIds(component.additionalArrayIds)
    ).toBeTrue();

    component.additionalArrayIds = '1, 2, abc';
    expect(
      component.isValidAdditionalArrayIds(component.additionalArrayIds)
    ).toBeFalse();
  });

  it('should process additional array IDs correctly', () => {
    component.additionalArrayIds = '1, 2, 3';
    expect(
      component.processAdditionalArrayIds(component.additionalArrayIds)
    ).toBe('1,2,3');

    component.additionalArrayIds = '1 2 3';
    expect(
      component.processAdditionalArrayIds(component.additionalArrayIds)
    ).toBe('1,2,3');
  });

  it('should emit settings when valid', () => {
    spyOn(component.onSettingsChanged, 'emit');

    component.timer = 10;
    component.arraySize = 5;
    component.additionalArrayIds = '1,2,3';

    component.onSettingsChange();

    expect(component.onSettingsChanged.emit).toHaveBeenCalledWith({
      timer: 10,
      arraySize: 5,
      additionalArrayIds: '1,2,3',
    } as AppSettings);
  });

  it('should mark fields as invalid when input is incorrect', () => {
    component.timer = -10;
    component.arraySize = 0;
    component.additionalArrayIds = '1,2,abc';

    component.onSettingsChange();

    expect(component.timerValid).toBeFalse();
    expect(component.arraySizeValid).toBeFalse();
    expect(component.additionalArrayIdsValid).toBeFalse();
  });

  it('should update input values and validate on change', () => {
    const timerInput = fixture.debugElement.query(By.css('input[type="number"]')).nativeElement;
    const arraySizeInput = fixture.debugElement.queryAll(By.css('input[type="number"]'))[1].nativeElement;
    const additionalArrayIdsInput = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;

    timerInput.value = '20';
    timerInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.timer).toBe(20);

    arraySizeInput.value = '10';
    arraySizeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.arraySize).toBe(10);

    additionalArrayIdsInput.value = '4,5,6';
    additionalArrayIdsInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.additionalArrayIds).toBe('4,5,6');
  });
});
