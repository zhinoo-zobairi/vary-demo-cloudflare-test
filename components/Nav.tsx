import Link from "next/link";

// The persistent layout: this renders once in the root layout and stays
// mounted across client-side navigations between the demo pages below.
//
// Each route gets two links to the SAME href: a plain <Link> (prefetches
// its App Shell by default once it's in the viewport) and one with
// prefetch={false} (fetches nothing ahead of time). Click both and compare
// how the shell/stopwatch (see lib/clock.tsx) behaves on each page.

const ROUTES = [
  { href: "/dynamic", label: "Dynamic (control)" },
  { href: "/streaming", label: "Streaming" },
  { href: "/isr", label: "ISR" },
  { href: "/ppr", label: "PPR" },
];

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-home">
        VaryDemo
      </Link>
      <ul>
        {ROUTES.map((route) => (
          <li key={route.href}>
            <span className="nav-label">{route.label}</span>
            <Link href={route.href}>prefetch on</Link>
            <Link href={route.href} prefetch={false}>
              prefetch off
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
