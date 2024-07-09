export interface SocketItem {
  id: string;
  int: number;
  float: number;
  color: string;
  child: {
    id: string;
    color: string;
  };
}
