import Link from "next/link";
import { Text } from "@/components/ui/text";
import { SectionTransition } from "@/components/ui/section-transition";
import { InsightCard } from "./insight-card";
import { getInsights, getInsightTags } from "./insight-data";

export async function InsightsPage({ selectedTag }: { selectedTag?: string }) {
  const insights = await getInsights();
  const tags = getInsightTags(insights);
  const visibleInsights = selectedTag ? insights.filter((insight) => insight.tags.includes(selectedTag)) : insights;

  return (
    <SectionTransition className="px-page py-section">
      <Text as="h1" variant="h1">
        Insights
      </Text>
      <Text className="mt-4 max-w-2xl">Notes on building useful technology, working with local context, and making systems last.</Text>
      {tags.length > 0 ? (
        <nav className="mt-major flex flex-wrap gap-2" aria-label="Filter insights by topic">
          <Link href="/insights" className={`border border-surface px-3 py-2 text-small ${!selectedTag ? "bg-surface text-inverse" : "text-ink-strong"}`}>All <span className="text-ink-weak">{insights.length}</span></Link>
          {tags.map(([tag, count]) => <Link key={tag} href={`/insights?tag=${encodeURIComponent(tag)}`} className={`border border-surface px-3 py-2 text-small ${selectedTag === tag ? "bg-surface text-inverse" : "text-ink-strong"}`}>{tag} <span className={selectedTag === tag ? "text-inverse/60" : "text-ink-weak"}>{count}</span></Link>)}
        </nav>
      ) : null}
      <div className="mt-major max-w-3xl">
        {visibleInsights.length ? visibleInsights.map((insight) => <InsightCard key={insight.slug} insight={insight} />) : <Text animate={false}>There are no insights in this topic yet.</Text>}
      </div>
    </SectionTransition>
  );
}
