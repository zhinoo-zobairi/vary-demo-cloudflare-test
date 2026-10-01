// Streaming, isolated from caching: no 'use cache' anywhere. Two mock
// fetches with different delays, each in its own <Suspense> boundary, so
// they resolve independently instead of the page waiting for the slower
// one. Compare this to /dynamic (same "no cache" baseline, but blocking)
// and to /ppr (same streaming shape, but the shell itself is cached).

import { Suspense } from "react";
import { getMockStat } from "@/lib/mock-data";
import { PageClock, ArrivalMarker } from "@/lib/clock";

// Static shell content has no data dependency, so it needs no Suspense and
// no instant=false — it's part of the page that's already "instant".

async function FastStat() {
  const stat = await getMockStat("fast stream", 400);
  return (
    <section>
      <h2>Fast stream (400ms)</h2>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
      </dl>
      <ArrivalMarker label="Fast stream" />
    </section>
  );
}

async function SlowStat() {
  const stat = await getMockStat("slow stream", 1800);
  return (
    <section>
      <h2>Slow stream (1800ms)</h2>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
      </dl>
      <ArrivalMarker label="Slow stream" />
    </section>
  );
}

export default function StreamingPage() {
  return (
    <PageClock>
      <h1>Streaming</h1>
      <p>
        No caching here either &mdash; the point of this page is to isolate
        streaming from caching. Two uncached mock fetches, each behind its
        own <code>&lt;Suspense&gt;</code>, resolve independently: the 400ms
        one should appear well before the 1800ms one, instead of both
        waiting for the slower fetch.
      </p>
      <Suspense fallback={<p>Loading fast stream…</p>}>
        <FastStat />
      </Suspense>
      <Suspense fallback={<p>Loading slow stream…</p>}>
        <SlowStat />
      </Suspense>
    </PageClock>
  );
}
