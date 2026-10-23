import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

export type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: number;
  content: string;
};

const contentDirectory = path.join(process.cwd(), "features", "insights", "content");

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) return { fields: new Map<string, string>(), content: source.trim() };

  const fields = new Map(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([\w-]+):\s*(.*)$/))
      .filter((entry): entry is RegExpMatchArray => entry !== null)
      .map(([, key, value]) => [key, value.replace(/^['\"]|['\"]$/g, "")]),
  );

  return { fields, content: match[2].trim() };
}

function toTags(value: string | undefined) {
  return value
    ?.replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];
}

function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export const getInsights = cache(async (): Promise<Insight[]> => {
  const files = await fs.readdir(contentDirectory, { withFileTypes: true });
  const posts = await Promise.all(
    files
      .filter(
        (file) =>
          file.isFile() &&
          file.name.endsWith(".md") &&
          !file.name.startsWith("_"),
      )
      .map(async (file) => {
        const source = await fs.readFile(path.join(contentDirectory, file.name), "utf8");
        const { fields, content } = parseFrontmatter(source);
        const slug = file.name.replace(/\.md$/, "");

        return {
          slug,
          title: fields.get("title") ?? slug,
          description: fields.get("description") ?? "",
          date: fields.get("date") ?? "1970-01-01",
          tags: toTags(fields.get("tags")),
          readingTime: readingTime(content),
          content,
        };
      }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
});

export const getInsight = cache(async (slug: string) => {
  const insights = await getInsights();
  return insights.find((insight) => insight.slug === slug);
});

export function getInsightTags(insights: Insight[]) {
  const counts = new Map<string, number>();

  for (const insight of insights) {
    for (const tag of insight.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  return [...counts.entries()].sort(([first], [second]) => first.localeCompare(second));
}

export function formatInsightDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
