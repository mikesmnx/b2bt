import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTableComponent } from './app-table.component';
import { TableItem } from 'src/app/classes/table-item';
import { TableItemChild } from 'src/app/classes/table-item-child';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('AppTableComponent', () => {
  let component: AppTableComponent;
  let fixture: ComponentFixture<AppTableComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTableComponent);
    component = fixture.componentInstance;
    cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of rows', () => {
    const tableItems: TableItem[] = [
      new TableItem('1', 10, 1.1, 'red', new TableItemChild('2', 'blue')),
      new TableItem('3', 30, 3.3, 'green', new TableItemChild('4', 'yellow'))
    ];
    
    component.rows = tableItems;
    cdr.markForCheck();
    fixture.detectChanges();
    
    const rows = fixture.debugElement.queryAll(By.css('.row-container'));
    expect(rows.length).toBe(2);
  });

  it('should correctly display row data', () => {
    const tableItem = new TableItem('1', 10, 1.1, 'red', new TableItemChild('2', 'blue'));
    component.rows =  [tableItem ];
    cdr.markForCheck();
    fixture.detectChanges();

    const rowElements = fixture.debugElement.queryAll(By.css('.row-container div'));

    expect(rowElements[0].nativeElement.textContent).toContain(tableItem.id);
    expect(rowElements[1].nativeElement.textContent).toContain(tableItem.int);
    expect(rowElements[2].nativeElement.textContent).toContain(tableItem.formatFloat());
    expect(rowElements[3].nativeElement.textContent).toContain(tableItem.color);
  });

  it('should correctly display nested row data', () => {
    const tableItem = new TableItem('1', 10, 1.1, 'red', new TableItemChild('2', 'blue'));
    component.rows = [ tableItem ];
    
    cdr.markForCheck();
    fixture.detectChanges();

    const nestedRowElements = fixture.debugElement.queryAll(By.css('.nested-body div'));

    expect(nestedRowElements[0].nativeElement.textContent).toContain(tableItem.child.id);
    expect(nestedRowElements[1].nativeElement.textContent).toContain(tableItem.child.color);
  });

  it('should display the correct background color for row color', () => {
    const tableItem = new TableItem('1', 10, 1.1, 'red', new TableItemChild('2', 'blue'));
    component.rows = [tableItem];

    cdr.markForCheck();
    fixture.detectChanges();

    const colorElement = fixture.debugElement.query(By.css('.row-container span')).nativeElement;
    expect(colorElement.style.backgroundColor).toBe('red');
  });

  it('should display the correct background color for nested row color', () => {
    const tableItem = new TableItem('1', 10, 1.1, 'red', new TableItemChild('2', 'blue'));
    component.rows = [ tableItem ];

    cdr.markForCheck();
    fixture.detectChanges();

    const nestedColorElement = fixture.debugElement.query(By.css('.nested-body span')).nativeElement;
    expect(nestedColorElement.style.backgroundColor).toBe('blue');
  });
});
