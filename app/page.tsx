import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>VaryDemo</h1>
      <p>
        A small Next.js 16 App Router demo built to show, and then test, how
        CDNs cache App Router responses. The nav bar above is itself the{" "}
        <strong>persistent layout</strong> feature: it stays mounted as you
        move between the pages below instead of being torn down and rebuilt.
      </p>
      <p>
        Each nav entry has two links to the same page &mdash; one with
        default <strong>prefetching</strong> and one with it turned off.
        Click both and compare: the prefetched one should feel instant
        because its data was already warmed before you clicked.
      </p>
      <dl>
        <dt>/dynamic</dt>
        <dd>
          Control page: no caching, no streaming. Every visit re-renders
          everything from scratch.
        </dd>
        <dt>/streaming</dt>
        <dd>
          No caching either, but the slow parts stream in independently via
          Suspense instead of blocking the whole page.
        </dd>
        <dt>/isr</dt>
        <dd>
          Incremental Static Regeneration via `&apos;use cache&apos;` +
          `cacheLife`, with a button and an API route to trigger on-demand
          revalidation.
        </dd>
        <dt>/ppr</dt>
        <dd>
          Partial Prerendering via Cache Components: a cached static shell
          renders instantly, a deliberately slow part streams in after.
        </dd>
      </dl>
      <p>
        <Link href="/findings">Findings</Link>
      </p>
    </>
  );
}
