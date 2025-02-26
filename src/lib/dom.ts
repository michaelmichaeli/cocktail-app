import { getGridLayout } from "./grid";

/**
 * Safely focuses an element if it exists and is focusable
 */
export const focusElement = (element: HTMLElement | null) => {
  if (!element) return;
  
  try {
    if ('focus' in element && typeof element.focus === 'function') {
      element.focus();
    }
  } catch (error) {
    console.warn('Failed to focus element:', error);
  }
};

/**
 * Gets a focusable card at a specific index from a grid
 */
export const getFocusableCard = (grid: HTMLElement | null, index: number): HTMLElement | null => {
  if (!grid) return null;
  
  try {
    const layout = getGridLayout();
    const cards = layout.getFocusableCards(grid);
    return cards[index] || null;
  } catch (error) {
    console.warn('Failed to get focusable card:', error);
    return null;
  }
};

/**
 * Finds the parent grid cell element of a given element
 */
export const findParentGridCell = (element: HTMLElement): HTMLElement | null => {
  try {
    return element.closest('[role="gridcell"]') as HTMLElement;
  } catch (error) {
    console.warn('Failed to find parent grid cell:', error);
    return null;
  }
};

/**
 * Finds the parent grid element of a given element
 */
export const findParentGrid = (element: HTMLElement): HTMLElement | null => {
  try {
    return element.closest('[role="grid"]') as HTMLElement;
  } catch (error) {
    console.warn('Failed to find parent grid:', error);
    return null;
  }
};

/**
 * Safely queries for a single element matching a selector
 */
export const safeQuerySelector = <T extends Element>(
  container: ParentNode | null,
  selector: string
): T | null => {
  if (!container) return null;
  
  try {
    return container.querySelector(selector) as T;
  } catch (error) {
    console.warn('Failed to query for element:', error);
    return null;
  }
};

/**
 * Gets all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  try {
    const focusableSelector = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelector))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
  } catch (error) {
    console.warn('Failed to get focusable elements:', error);
    return [];
  }
};

/**
 * Announces a message to screen readers
 */
export const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', politeness);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);

  // Use requestAnimationFrame to ensure the element is in the DOM
  requestAnimationFrame(() => {
    announcer.textContent = message;
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 3000);
  });
};

/**
 * Creates a live region element and returns functions to update its content
 */
export const createLiveRegion = (id: string, politeness: 'polite' | 'assertive' = 'polite') => {
  let region = document.getElementById(id);
  
  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }

  return {
    update: (message: string) => {
      if (region) {
        region.textContent = message;
      }
    },
    clear: () => {
      if (region) {
        region.textContent = '';
      }
    },
    cleanup: () => {
      if (region?.parentNode) {
        region.parentNode.removeChild(region);
      }
    }
  };
};
