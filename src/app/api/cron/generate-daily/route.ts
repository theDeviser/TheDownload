import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { fetchAllArticles, pickTopArticles } from "@/lib/rss/fetcher";
import { generateSpouseSummary, generateIntroText } from "@/lib/ai/generate-summary";
import type { Category, RssSource } from "@/lib/supabase/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const today = new Date().toISOString().split("T")[0];

  try {
    // 1. Get all active RSS sources
    const { data: sources, error: sourcesError } = await supabase
      .from("rss_sources")
      .select("*")
      .eq("is_active", true);

    if (sourcesError) throw sourcesError;

    // 2. Fetch and pick top articles
    const articlesByCategory = await fetchAllArticles(sources as RssSource[]);
    const topArticles = pickTopArticles(articlesByCategory, 2);

    if (topArticles.length === 0) {
      return NextResponse.json(
        { message: "No articles found from any feeds" },
        { status: 200 },
      );
    }

    // 3. Get all users with preferences who need a digest today
    const { data: users, error: usersError } = await supabase
      .from("user_preferences")
      .select("user_id, topics, tone");

    if (usersError) throw usersError;

    let digestsCreated = 0;

    for (const user of users ?? []) {
      // Skip if digest already exists for today
      const { data: existing } = await supabase
        .from("daily_digests")
        .select("id")
        .eq("user_id", user.user_id)
        .eq("edition_date", today)
        .single();

      if (existing) continue;

      const userTopics = (user.topics as Category[]) ?? [];
      if (userTopics.length === 0) continue;

      // Filter articles to user's selected topics
      const userArticles = topArticles.filter((a) =>
        userTopics.includes(a.category),
      );

      if (userArticles.length === 0) continue;

      // Create digest record
      const { data: digest, error: digestError } = await supabase
        .from("daily_digests")
        .insert({
          user_id: user.user_id,
          edition_date: today,
          status: "generating",
        })
        .select("id")
        .single();

      if (digestError) {
        console.error(`Failed to create digest for user ${user.user_id}`, digestError);
        continue;
      }

      try {
        // Generate summaries via LLM
        const summaries = await Promise.all(
          userArticles.map((article) =>
            generateSpouseSummary(article, user.tone as number),
          ),
        );

        // Generate intro text
        const uniqueCategories = [
          ...new Set(summaries.map((s) => s.category)),
        ] as Category[];

        const introText = await generateIntroText(
          uniqueCategories,
          summaries.length,
        );

        // Insert digest items
        const items = summaries.map((s, idx) => ({
          digest_id: digest.id,
          position: idx + 1,
          headline: s.headline,
          category: s.category,
          intensity_tag: s.intensityTag,
          summary: s.summary,
          source_url: s.sourceUrl,
          source_name: s.sourceName,
          raw_content: s.rawContent,
        }));

        const { error: itemsError } = await supabase
          .from("digest_items")
          .insert(items);

        if (itemsError) throw itemsError;

        // Mark digest as ready
        await supabase
          .from("daily_digests")
          .update({ status: "ready", intro_text: introText })
          .eq("id", digest.id);

        digestsCreated++;
      } catch (genError) {
        console.error(`Failed to generate content for user ${user.user_id}`, genError);
        await supabase
          .from("daily_digests")
          .update({ status: "failed" })
          .eq("id", digest.id);
      }
    }

    return NextResponse.json({
      message: `Generated ${digestsCreated} digests for ${today}`,
      date: today,
      articlesProcessed: topArticles.length,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
