// The real PPR demo: a cached part (ships as part of the static shell,
// built once, same HTML served instantly to every visitor) sits next to a
// deliberately slow, uncached part behind <Suspense> (resolved per
// request, streamed in after the shell). Compare to /streaming, which has
// the same shell/stream shape but nothing cached, and to /isr, which is
// cached but has no streaming split.

import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { getMockStat } from "@/lib/mock-data";
import { PageClock, ArrivalMarker } from "@/lib/clock";

async function CachedShellContent() {
  "use cache";
  cacheLife("max"); // rarely changes: long-lived, part of the static shell
  cacheTag("ppr-shell");
  const stat = await getMockStat("ppr shell", 300);
  return (
    <section>
      <h2>Cached shell content</h2>
      <p>
        <code>&apos;use cache&apos;</code> with{" "}
        <code>cacheLife(&apos;max&apos;)</code>. Built once, served
        instantly to every visitor as part of the static shell &mdash; the
        value below won&apos;t change on reload.
      </p>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
        <dt>Rendered at</dt>
        <dd>{new Date(stat.renderedAt).toISOString()}</dd>
      </dl>
    </section>
  );
}

async function LiveDynamicPart() {
  const stat = await getMockStat("ppr dynamic", 1500);
  return (
    <section>
      <h2>Dynamic part (uncached)</h2>
      <p>No caching, deliberately slow. Streams in after the shell.</p>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
        <dt>Rendered at</dt>
        <dd>{new Date(stat.renderedAt).toISOString()}</dd>
      </dl>
      <ArrivalMarker label="Dynamic part" />
    </section>
  );
}

export default function PprPage() {
  return (
    <PageClock>
      <h1>Partial Prerendering (Cache Components)</h1>
      <p>
        One route, two render strategies: the cached section below renders
        instantly as part of the static shell; the dynamic section streams
        in after, once its artificial 1.5s delay resolves.
      </p>
      <CachedShellContent />
      <Suspense fallback={<p>Loading live part…</p>}>
        <LiveDynamicPart />
      </Suspense>
    </PageClock>
  );
}
