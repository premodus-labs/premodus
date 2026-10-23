# Publishing Insights

Insights are plain Markdown files in `features/insights/content/`. Each published `.md` file becomes an article at `/insights/<filename>`.

## Add an article

1. Copy `content/_template.md` and rename the copy with a lowercase, hyphenated slug. For example, `content/building-for-people.md` becomes `/insights/building-for-people`.
2. Complete the frontmatter at the top of the file:

   ```md
   ---
   title: Building for people
   description: A short, useful summary for the index and search results.
   date: 2026-10-22
   tags: [Practice, Malawi]
   ---
   ```

3. Write the article below the second `---`. Use `##` through `####` for headings, `-` for bullet lists, `>` for quotations, fenced code blocks, and standard Markdown links.
4. Run `npm run dev` and visit `/insights` to review the article. New articles are included automatically in the index, topic filters, metadata, and sitemap.

## Conventions

- Use an ISO date (`YYYY-MM-DD`) so articles sort correctly.
- Keep the description to one clear sentence.
- Reuse existing tags when they fit; tags are generated automatically from frontmatter.
- Files starting with `_` are ignored. This keeps `_template.md` available without publishing it.
