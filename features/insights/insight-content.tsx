import { Text } from "@/components/ui/text";

function inlineText(value: string) {
  return value.split(/(\[[^\]]+\]\([^\s)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (!match) return part;

    return (
      <a key={index} href={match[2]} className="underline underline-offset-4">
        {match[1]}
      </a>
    );
  });
}

export function InsightContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3);
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) code.push(lines[index++]);
      index += 1;
      blocks.push(
        <pre key={index} className="overflow-x-auto bg-surface p-4 text-small text-inverse">
          <code data-language={language}>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const variant: "h2" | "h3" | "h4" = heading[1].length === 2 ? "h2" : heading[1].length === 3 ? "h3" : "h4";
      blocks.push(<Text key={index} as={variant} variant={variant} animate={false}>{inlineText(heading[2])}</Text>);
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) items.push(lines[index++].trim().slice(2));
      blocks.push(<ul key={index} className="list-disc space-y-2 pl-5 text-body text-ink-medium">{items.map((item) => <li key={item}>{inlineText(item)}</li>)}</ul>);
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(<blockquote key={index} className="border-l-2 border-surface pl-4 text-body text-ink-medium">{inlineText(line.slice(2))}</blockquote>);
      index += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith("#") && !lines[index].trim().startsWith("- ") && !lines[index].trim().startsWith("> ") && !lines[index].trim().startsWith("```")) paragraph.push(lines[index++].trim());
    blocks.push(<Text key={index} animate={false}>{inlineText(paragraph.join(" "))}</Text>);
  }

  return <div className="flex flex-col gap-6">{blocks}</div>;
}
