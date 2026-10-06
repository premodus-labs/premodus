import { CallToAction } from "@/components/ui/call-to-action";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { projects } from "@/lib/constants/projects";
import { ProjectGrid } from "@/features/work/project-grid";

export function WorkPage() {
  return (
    <>
      <SectionTransition className="px-page pt-16 pb-section">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <Text as="h1" variant="h1">
              The work
            </Text>
            <Text variant="h3" className="mt-4">
              A running record of what we’ve built, who it’s for, and what it solved.
            </Text>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </SectionTransition>
      <CallToAction
        title="Start with a conversation, not a commitment."
        description="Let us know what you need built."
        secondaryHref="/services"
        secondaryLabel="Explore services"
      />
    </>
  );
}
