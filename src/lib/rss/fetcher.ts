import Parser from "rss-parser";
import type { Category } from "@/lib/supabase/types";

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "TheDownload/1.0",
  },
});

export interface RawArticle {
  title: string;
  link: string;
  content: string;
  pubDate: string;
  sourceName: string;
  category: Category;
}

interface FeedSource {
  name: string;
  feed_url: string;
  category: Category;
}

export async function fetchArticlesFromFeed(
  source: FeedSource,
): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(source.feed_url);

    return (feed.items ?? []).slice(0, 10).map((item) => ({
      title: item.title ?? "Untitled",
      link: item.link ?? "",
      content:
        item.contentSnippet ??
        item.content ??
        item.summary ??
        "",
      pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
      sourceName: source.name,
      category: source.category,
    }));
  } catch (error) {
    console.error(`Failed to fetch feed: ${source.name}`, error);
    return [];
  }
}

export async function fetchAllArticles(
  sources: FeedSource[],
): Promise<Map<Category, RawArticle[]>> {
  const results = await Promise.allSettled(
    sources.map((s) => fetchArticlesFromFeed(s)),
  );

  const articlesByCategory = new Map<Category, RawArticle[]>();

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      for (const article of result.value) {
        const existing = articlesByCategory.get(article.category) ?? [];
        existing.push(article);
        articlesByCategory.set(article.category, existing);
      }
    }
  });

  return articlesByCategory;
}

export function pickTopArticles(
  articlesByCategory: Map<Category, RawArticle[]>,
  topN: number = 2,
): RawArticle[] {
  const picked: RawArticle[] = [];

  for (const [, articles] of articlesByCategory) {
    const sorted = articles
      .filter((a) => a.title && a.content && a.content.length > 50)
      .sort(
        (a, b) =>
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      );

    picked.push(...sorted.slice(0, topN));
  }

  return picked;
}
