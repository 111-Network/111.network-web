"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@111-network/ui";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

interface MeteorData {
  key: string;
  delay: number;
  duration: number;
  angle: number;
  left: number;
}

export function Meteors({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) {
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generatedMeteors = Array.from({ length: number }).map((_, idx) => {
      const delay =
        Math.random() * (maxDelay - minDelay) + minDelay;
      const duration =
        Math.random() * (maxDuration - minDuration) + minDuration;
      const left = Math.random() * 100;
      const key = `meteor-${idx}-${delay}-${duration}-${left}`;
      return { key, delay, duration, angle, left };
    });
    setMeteors(generatedMeteors);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  // Don't render meteors during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)} />
    );
  }

  return (
    <div 
      data-meteors-container
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
    >
      {meteors.map(({ key, delay, duration, angle, left }) => (
        <span
          key={key}
          data-meteor
          className="absolute rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: "-10%",
            left: `${left}%`,
            width: "2px",
            height: "80px",
            transform: `rotate(${angle}deg) translateX(-50%)`,
            animation: `meteor-fall ${duration}s ease-in infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
