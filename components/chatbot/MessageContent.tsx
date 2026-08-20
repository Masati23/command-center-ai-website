import React from "react";

// The chatbot is instructed to include real section URLs (e.g.
// https://www.commandcenterai.net/#ai-website-chatbot) when recommending a
// service — this turns those URLs into actual clickable links instead of
// inert text, satisfying "provide a clickable link... to the exact service
// section." Splits on a simple URL pattern; everything else renders as-is.
//
// The model sometimes wraps links in markdown syntax — "[label](url)" —
// even though the prompt just asks for plain text. A naive "match until
// whitespace" regex sweeps the closing ")" into the URL itself, which
// silently breaks the anchor: "#ai-appointment-booking)" matches no real
// element id, so the link renders but the scroll-to-section never
// happens. Trimming trailing punctuation off the matched URL (and
// rendering it back as plain text right after the link) fixes this
// regardless of how the model formats the link.
//
// Shared by both the floating launcher chat and the large assistant panel
// so the two never drift apart — one implementation, two places it's used.
const URL_SPLIT_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST_PATTERN = /^https?:\/\//;
const TRAILING_PUNCTUATION_PATTERN = /[)\]}>,.;:!?"']+$/;

function splitTrailingPunctuation(url: string): [string, string] {
  const match = url.match(TRAILING_PUNCTUATION_PATTERN);
  if (!match) return [url, ""];
  return [url.slice(0, -match[0].length), match[0]];
}

export default function MessageContent({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts = text.split(URL_SPLIT_PATTERN);
  return (
    <>
      {parts.map((part, i) => {
        if (!URL_TEST_PATTERN.test(part)) return <React.Fragment key={i}>{part}</React.Fragment>;
        const [cleanUrl, trailing] = splitTrailingPunctuation(part);
        return (
          <React.Fragment key={i}>
            <a
              href={cleanUrl}
              className={linkClassName ?? "font-medium text-electric-300 underline underline-offset-2 hover:text-electric-200"}
            >
              {cleanUrl}
            </a>
            {trailing}
          </React.Fragment>
        );
      })}
    </>
  );
}
