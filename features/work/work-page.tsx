import { CallToAction } from "@/components/ui/call-to-action";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { projects } from "@/lib/constants/projects";
import { ProjectGrid } from "@/features/work/project-grid";

export function WorkPage() {
  return (
    <div className="bg-surface text-inverse">
      <SectionTransition className="px-page pt-4 pb-section">
        <div className="mx-auto">
          <div className="max-w-3xl">
            <Text variant="h1" className="mt-4 !text-inverse">
              A Running Record Of What We’ve Built, Who It’s For, and What It Solved.
            </Text>
          </div>
          <ProjectGrid projects={projects} inverse />
        </div>
      </SectionTransition>
      <CallToAction
        title="Start with a conversation, not a commitment."
        description="Let us know what you need built."
        secondaryHref="/services"
        secondaryLabel="Explore services"
        variant="inverse"
      />
    </div>
  );
}
