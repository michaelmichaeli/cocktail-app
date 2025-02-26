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
