"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function NewsletterForm() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        className="min-h-[96px] sm:min-h-[42px]"
      />
    );
  }

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
          className="min-w-0 flex-1 border-l-2 border-transparent bg-[#fcf5f8] px-3 py-2.5 text-sm font-semibold text-black outline-none transition-all duration-200 placeholder:text-[#b9a3ae] focus:border-[#f0c6d7] focus-visible:ring-2 focus-visible:ring-[#f0c6d7]"
        />
        <button
          type="submit"
          className="border border-transparent bg-[#f9e3ec] px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#f4d1e0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c6d7]"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}