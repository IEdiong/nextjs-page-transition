'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;

    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      setLoadingTimeout(timeoutId);
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
      clearTimeout(loadingTimeout);
    };

    window.addEventListener('visibilitychange', handleRouteChangeStart);
    window.addEventListener('hashchange', handleRouteChangeStart);
    window.addEventListener('popstate', handleRouteChangeComplete);
    window.addEventListener('beforeunload', handleRouteChangeError);

    return () => {
      window.removeEventListener('visibilitychange', handleRouteChangeStart);
      window.removeEventListener('hashchange', handleRouteChangeStart);
      window.removeEventListener('popstate', handleRouteChangeComplete);
      window.removeEventListener('beforeunload', handleRouteChangeError);
      clearTimeout(loadingTimeout);
    };
  }, [pathname, searchParams, loadingTimeout]);

  if (isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='w-16 h-16 border-4 border-white rounded-full animate-spin'></div>
      </div>
    );
  }

  return null;
}
