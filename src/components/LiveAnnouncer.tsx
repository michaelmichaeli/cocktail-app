import { useEffect } from 'react';
import { createLiveRegion } from '../lib/dom';

export function LiveAnnouncer() {
  useEffect(() => {
    const assertive = createLiveRegion('assertive-announcer', 'assertive');
    const polite = createLiveRegion('polite-announcer', 'polite');

    return () => {
      assertive.cleanup();
      polite.cleanup();
    };
  }, []);

  return null;
}
