import { getMockStat } from "@/lib/mock-data";
import { PageClock } from "@/lib/clock";

// By default, Cache Components requires every route to produce a non-empty
// static shell at build time and fails `next build` otherwise. `instant =
// false` opts this route out of that requirement, which is exactly what we
// want here: a genuinely fully-dynamic page, with no shell, as the baseline
// everything else gets compared against.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant#disabling-static-shell-validation
export const instant = false;

export default async function DynamicPage() {
  const stat = await getMockStat("dynamic control", 400);

  return (
    <PageClock>
      <h1>Dynamic (control)</h1>
      <p>
        No <code>&apos;use cache&apos;</code>, no{" "}
        <code>&lt;Suspense&gt;</code>. The whole response waits for the mock
        fetch below before anything is sent to the browser &mdash; nothing
        streams, nothing is cached. Reload this page and the value and
        timestamp change every time.
      </p>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
        <dt>Rendered at</dt>
        <dd>{new Date(stat.renderedAt).toISOString()}</dd>
      </dl>
    </PageClock>
  );
}
