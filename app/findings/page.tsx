// Static summary page for the lead. Deliberately plain: no 'use cache', no
// cacheLife, no Suspense, no client JS, no fetches — just hardcoded JSX.

export default function FindingsPage() {
  return (
    <>
      <p className="verdict">
        With Cloudflare&apos;s Vary setting on, HTML and RSC responses for
        the same URL stayed separate in every test. With it off, one case
        broke: an RSC request without Next&apos;s _rsc parameter got the
        cached HTML.
      </p>

      <div className="result-block">
        <span className="pill pill-amber">Needs attention</span>
        <h3>Cache Rule only, no Vary setting</h3>
        <p>
          A request to /isr with the Rsc: 1 header but no _rsc parameter
          got the cached HTML (HIT, text/html). Requests that carried _rsc
          were already kept apart by their URL.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Vary set to &quot;normalize&quot;</h3>
        <p>
          The same request now reached our origin instead (307, BYPASS).
          The HTML page stayed cached (HIT). All three RSC variants went
          MISS, then HIT, each correctly served as text/x-component.
          Switching HTML &rarr; RSC &rarr; HTML in sequence never mixed up
          a variant.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Real browser</h3>
        <p>
          Prefetch requests for /isr, sent by the browser through
          Cloudflare, came back as text/x-component. A click navigation to
          /dynamic did too. No HTML showed up in an RSC response.
        </p>
      </div>

      <div className="result-block">
        <span className="pill pill-green">Good</span>
        <h3>Pages marked no-store</h3>
        <p>
          /dynamic, /streaming, and /ppr never cached their HTML at all
          &mdash; every request showed BYPASS.
        </p>
      </div>

      <div className="strip strip-amber">
        <h2>Needs attention</h2>
        <ul>
          <li>
            When the origin&apos;s /isr content changed, the edge kept
            serving its old copy until s-maxage ran out (HIT, age 18s).
            Purging /isr cleared the HTML copy only. The ?_rsc= prefetch
            copy we watched stayed cached.
          </li>
          <li>
            Prefetch responses for /dynamic, /streaming and /ppr carry a
            long s-maxage (30 days to a year) and Cloudflare cached them.
            For /dynamic the body was identical across two requests, so it
            looks like a static shell only.
          </li>
          <li>
            The browser itself kept a cached disk copy of /isr
            (max-age=14400) &mdash; but our origin never sent that header.
            We haven&apos;t confirmed where it came from.
          </li>
        </ul>
      </div>

      <div className="strip strip-neutral">
        <h2>Not tested yet</h2>
        <p>
          Purging by hostname, other Vary actions (passthrough, and bypass
          on next-router-state-tree), and shells that read cookies.
        </p>
      </div>

      <p className="footnote">
        Tested against one Cloudflare zone, reached through a tunnel to a
        local production build. Vary default action: normalize. Built on
        Next.js 16. Checked with curl and one browser session. Results from
        1 Oct 2026.
      </p>
    </>
  );
}
