import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Lets you trigger on-demand revalidation of /isr's cached data from
// outside the app, the way a real CMS webhook would. Route Handlers can't
// call updateTag (that's Server Action-only), so this uses revalidateTag
// with an explicit cache profile instead.
//
//   curl -i -X POST http://localhost:3000/api/revalidate \
//     -H "Authorization: Bearer $REVALIDATE_SECRET"
//
// REVALIDATE_SECRET must be set in the environment (see .env.local, which
// is gitignored). Comparing SHA-256 digests with timingSafeEqual, rather
// than the raw strings, avoids both a timing side-channel and
// timingSafeEqual's length-mismatch throw for differently-sized inputs.

function secretsMatch(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    // Fail closed: an unset secret means "not configured", never "open".
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on the server" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const provided = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!provided || !secretsMatch(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("isr-demo", "minutes");

  return NextResponse.json({
    revalidated: true,
    tag: "isr-demo",
    at: new Date().toISOString(),
  });
}
