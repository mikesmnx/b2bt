import { TableItemChild } from "./table-item-child";

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
    child: TableItemChild,
  ) {
    this.id = id;
    this.int = int;
    this.float = float;
    this.color = color;

    this.child = child;
  }
}
