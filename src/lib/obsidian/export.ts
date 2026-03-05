export interface ArticleForExport {
  title: string;
  sourceUrl?: string;
  author?: string;
  date: string;
  tags: string[];
  translatedSummary: string;
  rawText?: string;
}

export function formatAsObsidianMarkdown(article: ArticleForExport): string {
  const frontmatter = [
    "---",
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    article.sourceUrl ? `source: "${article.sourceUrl}"` : null,
    article.author ? `author: "${article.author}"` : null,
    `date: "${article.date}"`,
    `tags: [${article.tags.map((t) => t.toLowerCase().replace(/\s+/g, "-")).join(", ")}]`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const sections = [
    frontmatter,
    "",
    `# ${article.title}`,
    "",
    "## AI Summary",
    "",
    article.translatedSummary,
  ];

  if (article.rawText) {
    sections.push("", "## Original", "", article.rawText);
  }

  sections.push("");

  return sections.join("\n");
}

export function downloadAsMarkdownFile(content: string, filename: string): void {
  const sanitized = filename.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitized}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openInObsidian(
  content: string,
  filename: string,
  vault?: string,
): void {
  const params = new URLSearchParams({
    name: filename,
    content,
  });
  if (vault) {
    params.set("vault", vault);
  }
  window.open(`obsidian://new?${params.toString()}`, "_blank");
}
