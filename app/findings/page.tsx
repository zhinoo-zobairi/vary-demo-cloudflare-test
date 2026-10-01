// Static summary page for the lead. Deliberately plain: no 'use cache', no
// cacheLife, no Suspense, no client JS, no fetches — just hardcoded JSX.

export default function FindingsPage() {
  return (
    <>
      <p className="verdict">
        With Cloudflare&apos;s new Vary setting turned on, HTML and RSC
        responses for the same URL stayed separate. Without it, they did
        not.
      </p>

      <div className="result-block">
        <span className="pill pill-amber">Needs attention</span>
        <h3>Cache Rule only, no Vary setting</h3>
        <p>
          A request to /isr with the Rsc: 1 header got the cached HTML back
          (HIT, text/html). Variants mixed.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Vary set to &quot;normalize&quot;</h3>
        <p>
          The same request reached the origin (307, BYPASS). HTML still
          cached (HIT). All three RSC variants went MISS then HIT with
          text/x-component. An HTML -&gt; RSC -&gt; HTML sequence stayed
          correct.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Real browser</h3>
        <p>
          Navigation and prefetch requests for /isr came back as
          text/x-component through Cloudflare. No HTML was mixed in.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Pages marked no-store</h3>
        <p>
          /dynamic, /streaming and /ppr HTML were never cached (BYPASS
          every time).
        </p>
      </div>

      <div className="strip strip-amber">
        <h2>Needs attention</h2>
        <ul>
          <li>
            Revalidating on the origin does not reach the edge: the origin
            changed while the edge served the old copy (HIT, age 18).
            Purging /isr removed the HTML copy only; the ?_rsc= copies
            stayed.
          </li>
          <li>
            The prefetch responses of /dynamic, /streaming and /ppr are
            cached at the edge for 30 days to a year, because of the
            origin&apos;s long s-maxage. The /dynamic prefetch body was
            identical across two requests, so it looks like a static shell
            only.
          </li>
          <li>
            The browser kept a disk copy of the /isr responses
            (max-age=14400, which the origin did not send). Source not
            confirmed.
          </li>
        </ul>
      </div>

      <div className="strip strip-neutral">
        <h2>Not tested yet</h2>
        <p>
          purge by hostname, other Vary actions (passthrough, bypass on
          next-router-state-tree), shells that read cookies.
        </p>
      </div>

      <p className="footnote">
        One Cloudflare zone, reached through a tunnel to a local production
        build. Vary default action: normalize. Next.js 16. curl and one
        browser run. Results from 1 Oct 2026.
      </p>
    </>
  );
}
