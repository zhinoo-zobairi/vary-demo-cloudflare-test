"use client";

// Shared timing UI used across the demo pages.
//
// What this measures, honestly: PageClock starts its stopwatch the moment it
// mounts on the client (effectively: when the static shell became
// interactive). It is NOT "time since you clicked" in the strict Navigation
// Timing API sense — Next.js doesn't expose a public navigation-start hook
// for client-side transitions. ArrivalMarker then reports, for a piece of
// content that streamed in later, how many ms passed between that same
// mount point and the moment this specific piece of content arrived.
// Together they show relative streaming order and rough magnitude, which is
// what the demo pages need to make PPR/streaming visible.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ClockContext = createContext<number | null>(null);

export function PageClock({ children }: { children: ReactNode }) {
  const [startedAt] = useState(() => performance.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startedAt));
    }, 50);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <ClockContext.Provider value={startedAt}>
      <p className="clock" data-testid="page-clock">
        Shell interactive for: <strong>{elapsedMs}ms</strong>
      </p>
      {children}
    </ClockContext.Provider>
  );
}

export function ArrivalMarker({ label }: { label: string }) {
  const startedAt = useContext(ClockContext);
  const [arrivedAt, setArrivedAt] = useState<number | null>(null);

  useEffect(() => {
    if (startedAt !== null && arrivedAt === null) {
      setArrivedAt(Math.round(performance.now() - startedAt));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt]);

  if (arrivedAt === null) return null;

  return (
    <span className="arrival">
      {label} streamed in after <strong>{arrivedAt}ms</strong>
    </span>
  );
}
