'use client';
import { startTransition, useState } from 'react';
import { useProgress } from './components/progressComponent';

export default function Home() {
  const startProgress = useProgress();
  const [count, setCount] = useState(0);
  return (
    <main className='flex flex-col items-center justify-between p-24'>
      <p>home page</p>

      <button
        onClick={() => {
          startTransition(async () => {
            startProgress();
            // Introduces artificial slowdown
            await new Promise((resolve) => setTimeout(resolve, 2500));
            setCount((count) => count + 1);
          });
        }}
      >
        Trigger artificially slow transition
      </button>
    </main>
  );
}
