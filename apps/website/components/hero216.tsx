"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Globe } from "@/components/magicui/globe";
import { Meteors } from "@/components/magicui/meteors";
import { Button } from "@/components/ui/button";

interface Hero216Props {
  className?: string;
}

const Hero216 = ({ className }: Hero216Props) => {
  return (
    <section className={cn("py-32 relative", className)}>
      <div className="container flex flex-col items-center justify-center gap-4 overflow-hidden relative min-h-[500px]">
        <Meteors number={30} />
        
        <p className="text-muted-foreground relative z-10">
          Bridging Developers, Building the Future
        </p>
        <h1 className="max-w-3xl text-center text-6xl md:text-7xl font-bold relative z-10">
          Connecting Developers Worldwide
        </h1>

        <Button
          variant="secondary"
          className="text-md group mt-10 flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight relative z-10"
        >
          Get Started
          <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
        </Button>
        <div className="relative h-[460px] w-full overflow-y-clip">
          <Globe className="translate-y-40 scale-175" />
        </div>
      </div>
    </section>
  );
};

export { Hero216 };
