import { createClient } from "@/lib/supabase/client";
import type { DailyDigest, DigestItem } from "@/lib/supabase/types";

export interface DigestWithItems {
  digest: DailyDigest;
  items: DigestItem[];
}

export async function fetchDigestForDate(
  date: string,
  userId?: string,
): Promise<DigestWithItems | null> {
  const supabase = createClient();

  let query = supabase
    .from("daily_digests")
    .select("*")
    .eq("edition_date", date)
    .eq("status", "ready");

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: digest, error: digestError } = await query.single();

  if (digestError || !digest) return null;

  const { data: items, error: itemsError } = await supabase
    .from("digest_items")
    .select("*")
    .eq("digest_id", digest.id)
    .order("position", { ascending: true });

  if (itemsError || !items) return null;

  return {
    digest: digest as DailyDigest,
    items: items as DigestItem[],
  };
}
