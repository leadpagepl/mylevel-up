import { site } from "@/lib/site";
import { byId } from "@/lib/reviews";
import { GoogleG, Stars } from "./Stars";

/**
 * Krótki, dosłowny cytat z prawdziwej opinii Google — używany kontekstowo
 * przy sekcjach, których dotyczy.
 */
export function PullQuote({
  id,
  tone = "paper",
  className = "",
}: {
  id: string;
  tone?: "paper" | "ink";
  className?: string;
}) {
  const review = byId(id);
  const quote = review.pull ?? review.text;
  const onInk = tone === "ink";

  return (
    <figure
      className={`rounded-[2px] border-l-[3px] ${
        onInk ? "border-gold bg-white/[0.05]" : "border-signal bg-white"
      } px-5 py-5 ${className}`}
    >
      <Stars size={12} />
      <blockquote
        className={`t-quote mt-3 text-[16px] md:text-[17px] ${
          onInk ? "text-white/85" : "text-ink/80"
        }`}
      >
        „{quote}”
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`t-label ${onInk ? "text-white" : "text-ink"}`}
        >
          {review.name}
        </span>
        <a
          href={site.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-[12px] underline-offset-2 hover:underline ${
            onInk ? "text-white/45" : "text-ink/45"
          }`}
        >
          <GoogleG size={12} />
          Opinia w Google
        </a>
      </figcaption>
    </figure>
  );
}
