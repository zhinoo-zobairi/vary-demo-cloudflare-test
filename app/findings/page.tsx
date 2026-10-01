// Static summary page for the lead. Deliberately plain: no 'use cache', no
// cacheLife, no Suspense, no client JS, no fetches — just hardcoded JSX.

export default function FindingsPage() {
  return (
    <>
      <p className="verdict">
        Turn on Cloudflare&apos;s new Vary setting, and HTML and RSC
        responses to the same URL stay separate. Leave it off, and they
        don&apos;t.
      </p>

      <div className="result-block">
        <span className="pill pill-amber">Needs attention</span>
        <h3>Cache Rule only, no Vary setting</h3>
        <p>
          We sent a React-app request (header Rsc: 1) to /isr. Cloudflare
          served the cached HTML page anyway (HIT, text/html) &mdash; the
          two variants got mixed up.
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
          In a real browser, both page navigations and prefetches to /isr
          came back as text/x-component through Cloudflare. No HTML ever
          leaked into an RSC response.
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
            Revalidating on our origin doesn&apos;t tell Cloudflare&apos;s
            edge anything. The origin had fresh data while the edge kept
            serving the old cached copy (HIT, age 18s). Purging /isr only
            cleared the HTML copy &mdash; the ?_rsc= copies were untouched
            and stayed cached.
          </li>
          <li>
            Prefetch responses for /dynamic, /streaming, and /ppr get
            cached at the edge for anywhere from 30 days to a year &mdash;
            that&apos;s because our origin sends a long s-maxage. For
            /dynamic, the same prefetch body came back twice in a row,
            which suggests only the static shell is being cached, not live
            data.
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
