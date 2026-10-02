import { Text } from "@/components/ui/text";
import { SectionTransition } from "@/components/ui/section-transition";

export function InsightsPage() {
  return (
    <SectionTransition className="px-page py-section">
      <Text as="h1" variant="h1">
        Insights
      </Text>
      <Text className="mt-major">Writing will live in this feature module.</Text>
    </SectionTransition>
  );
}
