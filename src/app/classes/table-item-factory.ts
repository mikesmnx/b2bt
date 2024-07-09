import { TableItem } from './table-item';
import { TableItemChild } from './table-item-child';

export class TableItemFactory {
  static colorNames: string[] = [
    'red',
    'green',
    'blue',
    'orange',
    'yellow'
  ];

  static createTableItems(count: number): TableItem[] {
    const items: TableItem[] = [];
    const ids = this.getRandomIds(count);

    for (let i = 0; i < count; i++) {
      const id = `${ids[i]}`;
      const int = Math.floor(Math.random() * 100);
      const float = parseFloat((Math.random() * 100).toFixed(18));
      const color = this.getRandomColor();
      const childId = `child-${i}`;
      const childColor = this.getRandomColor();
      const child = new TableItemChild(childId, childColor);

      const item = new TableItem(id, int, float, color, child);
      items.push(item);
    }

    return items;
  }

  private static getRandomIds(count: number): number[] {
    const ids = Array.from({ length: count }, (_, i) => i);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  }

  private static getRandomColor(): string {
    const colorFormat = Math.floor(Math.random() * 3);
    switch (colorFormat) {
      case 0:
        return this.getRandomHexColor();
      case 1:
        return this.getRandomRgbColor();
      case 2:
      default:
        return this.getRandomColorName();
    }
  }

  private static getRandomHexColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private static getRandomRgbColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private static getRandomColorName(): string {
    const index = Math.floor(Math.random() * this.colorNames.length);
    return this.colorNames[index];
  }
}
