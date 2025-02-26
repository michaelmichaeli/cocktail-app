import { CustomCocktail } from "../types/cocktail";

interface GridLayout {
  columns: number;
  getRowIndex: (index: number) => number;
  getColIndex: (index: number) => number;
  getRowCount: (totalItems: number) => number;
  getParentGrid: (items: CustomCocktail[], element: HTMLElement) => HTMLElement | null;
  getFocusableCards: (grid: HTMLElement) => HTMLElement[];
}

export const getGridLayout = (): GridLayout => {
  if (typeof window === 'undefined') {
    return {
      columns: 4,
      getRowIndex: () => 1,
      getColIndex: () => 1,
      getRowCount: () => 1,
      getParentGrid: () => null,
      getFocusableCards: () => []
    };
  }

  const columns = window.innerWidth < 640 ? 1 : 
                 window.innerWidth < 1024 ? 2 : 
                 window.innerWidth < 1280 ? 3 : 4;
  
  return {
    columns,
    getRowIndex: (index: number) => Math.floor(index / columns) + 1,
    getColIndex: (index: number) => (index % columns) + 1,
    getRowCount: (totalItems: number) => Math.ceil(totalItems / columns),
    getParentGrid: (_items: CustomCocktail[], element: HTMLElement) => {
      return element.closest('[role="grid"]') as HTMLElement;
    },
    getFocusableCards: (grid: HTMLElement) => {
      return Array.from(grid.querySelectorAll('[role="gridcell"] [tabindex="0"]')) as HTMLElement[];
    }
  };
};
