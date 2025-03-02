import type { GridLayout } from '../types/ui/layout';

export const getGridLayout = (): GridLayout => {
  if (typeof window === 'undefined') {
    return {
      columns: 4,
      getRowCount: () => 1
    };
  }

  const columns = window.innerWidth < 640 ? 1 : 
                 window.innerWidth < 1024 ? 2 : 
                 window.innerWidth < 1280 ? 3 : 4;
  
  return {
    columns,
    getRowCount: (totalItems: number) => Math.ceil(totalItems / columns)
  };
};
