import { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface UseFocusTrapOptions {
  onClose?: () => void;
}

export function useFocusTrap(isActive: boolean, options: UseFocusTrapOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleFocus = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Handle Tab key
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // If shift + tab and first element is focused, move to last element
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // If tab and last element is focused, move to first element
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      // Handle Escape key
      if (e.key === 'Escape' && typeof options.onClose === 'function') {
        options.onClose();
      }
    };

    // Focus the first focusable element
    const focusableElements = containerRef.current?.querySelectorAll(FOCUSABLE_ELEMENTS);
    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus();
    }

    document.addEventListener('keydown', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleFocus);
      // Restore focus when trap is deactivated
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, options.onClose]);

  return containerRef;
}
