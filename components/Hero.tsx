import React from "react";
import { Button, Badge } from "./ui";
import HeroDashboard from "./dashboards/HeroDashboard";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="animate-fadeUp text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <Badge>We Build AI Command Centers for Businesses</Badge>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Your AI Workforce.{" "}
            <span className="text-gradient">Built for Business.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-silver-400 lg:mx-0">
            We build AI systems that automate customer support, lead generation,
            appointment booking, follow-ups, and business operations — so you can
            focus on growing your company.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="#contact" variant="primary" className="w-full sm:w-auto">
              Free AI Consultation
            </Button>
            <Button href="#solutions" variant="secondary" className="w-full sm:w-auto">
              View Solutions
            </Button>
          </div>

          <p className="mt-4 text-center text-xs text-silver-500 lg:text-left">
            15–30 minute consultation &bull; No obligation
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-silver-500 lg:justify-start">
            <span>Houston, Texas</span>
            <span className="h-1 w-1 rounded-full bg-silver-500" />
            <span>Custom-built AI systems</span>
            <span className="h-1 w-1 rounded-full bg-silver-500" />
            <span>Fast, professional deployment</span>
          </div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
