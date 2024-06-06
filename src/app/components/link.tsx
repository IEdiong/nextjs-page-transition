'use client';

import { startTransition, useTransition } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from './progressComponent';

/**
 * A custom Link component that wraps Next.js's next/link component.
 */
export function Link({
  href,
  children,
  replace,
  ...rest
}: Parameters<typeof NextLink>[0]) {
  const router = useRouter();
  const startProgress = useProgress();

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          startProgress();
          // Introduces artificial slowdown
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const url = href.toString();
          if (replace) {
            router.replace(url);
          } else {
            router.push(url);
          }
        });
      }}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
