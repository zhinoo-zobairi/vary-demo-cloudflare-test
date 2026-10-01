// Stands in for a slow backend (a DB query, a third-party API, etc).
// Deterministic and self-contained on purpose: no network flakiness to
// confuse the timing evidence we're trying to collect.

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type MockStat = {
  label: string;
  /** Increments every time this function actually executes (not on a cache hit). */
  value: number;
  /** Date.now() captured at the moment this function executed. */
  renderedAt: number;
};

// Module-level counter: shared across requests on one server process, so a
// rising number is a visible signal that the function re-ran rather than
// serving a cached result.
let counter = 0;

export async function getMockStat(
  label: string,
  delayMs: number,
): Promise<MockStat> {
  await delay(delayMs);
  counter += 1;
  return {
    label,
    value: counter,
    renderedAt: Date.now(),
  };
}
