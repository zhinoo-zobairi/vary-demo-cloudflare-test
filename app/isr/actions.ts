"use server";

import { updateTag } from "next/cache";

// Called from the "Revalidate now" button on /isr. updateTag is the
// read-your-own-writes revalidation API: it expires the tag so the next
// request waits for fresh data, and Server Actions trigger an automatic
// refresh of the current route afterwards, so the new value shows up
// immediately without a manual reload.
// https://nextjs.org/docs/app/api-reference/functions/updateTag
export async function revalidateIsrDemo() {
  updateTag("isr-demo");
}
