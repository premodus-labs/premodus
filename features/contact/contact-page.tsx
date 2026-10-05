import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";

const fields = [
  { id: "name", label: "Name", placeholder: "John Smith", type: "text" },
  {
    id: "organization",
    label: "Organization",
    placeholder: "ABC Company LTD",
    type: "text",
  },
  { id: "email", label: "Email", placeholder: "johnsmith@abc.org", type: "email" },
  {
    id: "phone",
    label: "Phone number",
    placeholder: "+265 000 000 000",
    type: "tel",
  },
] as const;

export function ContactPage() {
  return (
    <SectionTransition className="px-page pt-16 pb-section">
      <div className="mx-auto w-full max-w-7xl">
        <Text as="h1" variant="h1">
          Contact
        </Text>

        <div className="mt-major grid grid-cols-1 gap-major border-y border-surface py-major lg:grid-cols-12 lg:gap-gutter">
          <ScrollReveal className="flex items-center lg:col-span-5">
            <div className="max-w-md">
              <Text as="h2" variant="h2">
                Start with a conversation, not a commitment.
              </Text>
              <Text variant="small" className="mt-4">
                Whether you need cybersecurity support, software development,
                IT consulting, or digital transformation, the enquiry form is
                the direct path to start a conversation.
              </Text>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <form className="flex flex-col gap-6" aria-label="Project enquiry">
              {fields.map((field) => (
                <label key={field.id} htmlFor={field.id} className="flex flex-col gap-2">
                  <span className="text-small-bold text-ink-strong">{field.label}</span>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border-b border-surface bg-transparent pb-3 text-small text-ink-strong placeholder:text-ink-weak focus:outline-none"
                  />
                </label>
              ))}

              <label htmlFor="project" className="flex flex-col gap-2">
                <span className="text-small-bold text-ink-strong">Project description</span>
                <textarea
                  id="project"
                  name="project"
                  rows={3}
                  placeholder="Describe your challenge here."
                  className="w-full resize-y border-b border-surface bg-transparent pb-3 text-small text-ink-strong placeholder:text-ink-weak focus:outline-none"
                />
              </label>

              <Button type="button" className="self-start">
                Get in touch
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </SectionTransition>
  );
}
