import { cacheLife, cacheTag } from "next/cache";
import { getMockStat } from "@/lib/mock-data";
import { PageClock } from "@/lib/clock";
import { revalidateIsrDemo } from "./actions";

async function getIsrStat() {
  "use cache";
  cacheLife("minutes"); // stale 5min, revalidate 1min, expire 1hr
  cacheTag("isr-demo");
  return getMockStat("isr demo", 500);
}

export default async function IsrPage() {
  const stat = await getIsrStat();

  return (
    <PageClock>
      <h1>ISR with on-demand revalidation</h1>
      <p>
        Cached with <code>&apos;use cache&apos;</code> +{" "}
        <code>cacheLife(&apos;minutes&apos;)</code>: stale for 5 minutes,
        background-revalidates every 1 minute, expires after 1 hour. Reload
        repeatedly and the value below should stay put between background
        revalidations. Click the button to invalidate it immediately
        instead of waiting, or trigger the same thing from the command line
        with <code>POST /api/revalidate</code>.
      </p>
      <dl>
        <dt>Value</dt>
        <dd>{stat.value}</dd>
        <dt>Rendered at</dt>
        <dd>{new Date(stat.renderedAt).toISOString()}</dd>
      </dl>
      <form action={revalidateIsrDemo}>
        <button type="submit">Revalidate now</button>
      </form>
    </PageClock>
  );
}
