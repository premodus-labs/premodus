import { Text } from "@/components/ui/text";
import { SectionTransition } from "@/components/ui/section-transition";

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <SectionTransition className="px-page py-section">
      <Text as="h1" variant="h1">
        {title}
      </Text>
    </SectionTransition>
  );
}
