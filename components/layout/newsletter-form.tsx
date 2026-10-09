export function NewsletterForm() {
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
          placeholder="you@example.com"
          className="min-w-0 flex-1 border-l-2 border-inverse/40 bg-inverse/10 px-3 py-2.5 text-sm font-semibold text-inverse outline-none transition-all duration-200 placeholder:text-inverse/60 focus:border-inverse focus-visible:ring-2 focus-visible:ring-inverse"
        />
        <button
          type="submit"
          className="border border-inverse bg-inverse px-5 py-2.5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-inverse/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
