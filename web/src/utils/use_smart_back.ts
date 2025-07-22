import { useRouter } from 'next/router';
import React from 'react';

export function useSmartBack(fallbackPath: string = '/') {
  const router = useRouter();

  const navigateBack = React.useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, [router, fallbackPath]);

  return navigateBack;
}
