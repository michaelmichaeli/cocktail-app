export interface GridLayout {
  columns: number;
  getRowCount: (totalItems: number) => number;
}
