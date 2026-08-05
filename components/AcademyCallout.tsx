import React from "react";
import { GlassCard, Button } from "./ui";

/**
 * Cross-links to CommandCenterAIAcademy.com — the DIY/learn-it-yourself
 * sibling site. Command Center AI (this site) builds AI systems for you;
 * the Academy teaches you to build them yourself. Kept as a small,
 * clearly-labeled callout rather than blended into the main sales copy, so
 * the two offers stay distinct.
 */
export default function AcademyCallout() {
  return (
    <GlassCard className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p className="text-sm font-semibold text-white">Prefer to build it yourself?</p>
        <p className="mt-1 text-sm text-silver-400">
          Command Center AI builds your AI systems for you. Command Center AI Academy teaches you to build them
          yourself.
        </p>
      </div>
      <Button
        href="https://CommandCenterAIAcademy.com"
        variant="secondary"
        className="w-full shrink-0 sm:w-auto"
      >
        Visit the Academy
      </Button>
    </GlassCard>
  );
}
