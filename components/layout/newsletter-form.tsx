export function NewsletterForm({
  variant = "default",
}: {
  variant?: "default" | "inverse";
}) {
  const inverse = variant === "inverse";

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className={`min-w-0 flex-1 rounded-sm border-rule/25 px-3 py-2.5 text-small outline-none transition-all duration-200 focus:border-rule/25 focus-visible:ring-2 focus-visible:ring-rule/25 ${
            inverse
              ? "bg-surface/10 text-ink-strong placeholder:text-ink-weak"
              : "bg-inverse/10 text-inverse placeholder:text-inverse/60"
          }`}
        />
        <button
          type="submit"
          className={`border rounded-sm border-rule/25 px-5 py-2.5 text-body-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rule/25 ${
            inverse
              ? "bg-surface text-inverse hover:bg-surface/85"
              : "bg-inverse text-surface hover:bg-inverse/85"
          }`}
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
