import Link from "next/link";
import type { Insight } from "./insight-data";
import { formatInsightDate } from "./insight-data";
import { Text } from "@/components/ui/text";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="border-t border-surface/25 py-8 first:border-t-0 first:pt-0">
      <Link href={`/insights/${insight.slug}`} className="group block">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Text as="time" variant="tiny" animate={false} dateTime={insight.date}>
            {formatInsightDate(insight.date)}
          </Text>
          <Text as="span" variant="tiny" animate={false}>
            {insight.readingTime} min read
          </Text>
        </div>
        <Text as="h2" variant="h3" animate={false} className="mt-3 group-hover:underline">
          {insight.title}
        </Text>
        <Text animate={false} className="mt-3 max-w-2xl">
          {insight.description}
        </Text>
        {insight.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
            {insight.tags.map((tag) => (
              <li key={tag} className="border border-surface px-2 py-1 text-tiny text-ink-weak">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </Link>
    </article>
  );
}
