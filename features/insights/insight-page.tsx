import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { InsightContent } from "./insight-content";
import { formatInsightDate, getInsight, getInsights } from "./insight-data";

export async function InsightPage({ slug }: { slug: string }) {
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const insights = await getInsights();
  const currentIndex = insights.findIndex((item) => item.slug === slug);
  const newer = insights[currentIndex - 1];
  const older = insights[currentIndex + 1];

  return (
    <SectionTransition className="px-page py-section">
      <article className="mx-auto max-w-3xl">
        <Link href="/insights" className="text-small text-ink-medium underline underline-offset-4">
          Back to insights
        </Link>
        <header className="mt-major border-b border-surface/25 pb-8">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Text as="time" variant="tiny" animate={false} dateTime={insight.date}>{formatInsightDate(insight.date)}</Text>
            <Text as="span" variant="tiny" animate={false}>{insight.readingTime} min read</Text>
          </div>
          <Text as="h1" variant="h1" className="mt-4">{insight.title}</Text>
          <Text animate={false} className="mt-4 max-w-2xl">{insight.description}</Text>
        </header>
        <div className="mt-major">
          <InsightContent content={insight.content} />
        </div>
        {newer || older ? (
          <nav className="mt-major grid gap-6 border-t border-surface/25 pt-8 sm:grid-cols-2" aria-label="More insights">
            {older ? <Link href={`/insights/${older.slug}`} className="text-small text-ink-medium underline underline-offset-4">Older: {older.title}</Link> : <span />}
            {newer ? <Link href={`/insights/${newer.slug}`} className="text-small text-ink-medium underline underline-offset-4 sm:text-right">Newer: {newer.title}</Link> : null}
          </nav>
        ) : null}
      </article>
    </SectionTransition>
  );
}
