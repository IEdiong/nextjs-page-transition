'use client';
import React from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  useMotionTemplate,
} from 'framer-motion';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  // @ts-ignore This export exists on react@canary
  useOptimistic,
  useRef,
} from 'react';

/**
 * Internal context for the progress bar.
 */
const ProgressBarContext = createContext<ReturnType<
  typeof useProgressInternal
> | null>(null);

/**
 * Reads the progress bar context.
 */
function useProgressBarContext() {
  const progress = useContext(ProgressBarContext);

  if (progress === null) {
    throw new Error(
      'Make sure to use `ProgressBarProvider` before using the progress bar.'
    );
  }

  return progress;
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function calculates a difference (`diff`) based on the input number (`current`).
 *
 * - If `current` is exactly 0, `diff` is set to 15.
 * - If `current` is less than 50 (but not 0), `diff` is set to a random number between 1 and 10.
 * - If `current` is 50 or more, `diff` is set to a random number between 1 and 5.
 */
function getDiff(
  /** The current number used to calculate the difference. */
  current: number
): number {
  let diff;
  if (current === 0) {
    diff = 15;
  } else if (current < 50) {
    diff = random(1, 10);
  } else {
    diff = random(1, 5);
  }

  return diff;
}

/**
 * Custom hook for managing progress state and animation.
 * @returns An object containing the current state, spring animation, and functions to start and complete the progress.
 */
export function useProgressInternal() {
  const [loading, setLoading] = useOptimistic(false);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, 100, { duration: 2 });

    if (!loading) {
      count.set(0);
    }

    return () => controls.stop();
  }, [count, loading]);

  /**
   * Start the progress.
   */
  function start() {
    setLoading(true);
  }

  return { loading, rounded, start };
}

/**
 * Custom hook that sets up an interval to call the provided callback function.
 *
 * @param callback - The function to be called at each interval.
 * @param delay - The delay (in milliseconds) between each interval. Pass `null` to stop the interval.
 */
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      tick();

      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/**
 * Provides the progress value to the child components.
 *
 * @param children - The child components to render.
 * @returns The rendered ProgressBarContext.Provider component.
 */
export function ProgressBarProvider({ children }: { children: ReactNode }) {
  const progress = useProgressInternal();
  return (
    <ProgressBarContext.Provider value={progress}>
      {children}
    </ProgressBarContext.Provider>
  );
}

/**
 * Renders a progress bar component.
 *
 * @param className - The CSS class name for the progress bar.
 * @returns The rendered progress bar component.
 */
export function ProgressBar({ className }: { className: string }) {
  const { rounded, loading } = useProgressBarContext();

  // if (!loading) {
  //   return null;
  // }

  const value = useMotionTemplate`${rounded}%`;

  return (
    loading && (
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='absolute h-screen w-full left-0 top-0 flex items-center justify-center text-[250px] font-semibold text-red-600 bg-white origin-top'
      >
        {value}
      </motion.div>
    )
  );
}

{
  /* <>
  <motion.div
    className='slide-in'
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 0 }}
    exit={{ scaleY: 1 }}
    transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
  ></motion.div>
  <motion.div
    className='slide-out'
    initial={{ scaleY: 1 }}
    animate={{ scaleY: 0 }}
    exit={{ scaleY: 0 }}
    transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
  ></motion.div>
</>; */
}

type StartProgress = () => void;
/**
 * A custom hook that returns a function to start the progress. Call the start function in a transition to track it.
 *
 * @returns The function to start the progress. Call this function in a transition to track it.
 */
export function useProgress(): StartProgress {
  const progress = useProgressBarContext();

  const startProgress: StartProgress = () => {
    progress.start();
  };
  return startProgress;
}
