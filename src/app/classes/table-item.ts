import { TableItemChild } from './table-item-child';

export class TableItem {
  public id: string;
  public int: number;
  public float: number;
  public color: string;
  public child: TableItemChild;

  constructor(
    id: string,
    int: number,
    float: number,
    color: string,
    child: TableItemChild
  ) {
    this.id = id;
    this.int = int;
    this.float = float;
    this.color = color;

    this.child = child;
  }

  formatFloat(): string {
    const floatStr = this.float.toString();
    const decimalIndex = floatStr.indexOf('.');

    if (decimalIndex !== -1 && floatStr.length - decimalIndex - 1 > 6) {
      return this.float.toFixed(6) + '...';
    }

    return floatStr;
  }
}
