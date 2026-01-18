"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "mesh" | "radial";
  intensity?: "light" | "medium" | "strong";
}

export function GradientBackground({
  children,
  className,
  variant = "mesh",
  intensity = "medium",
}: GradientBackgroundProps) {
  const intensityClasses = {
    light: "opacity-30",
    medium: "opacity-50",
    strong: "opacity-70",
  };

  if (variant === "primary") {
    return (
      <div
        className={cn(
          "gradient-primary absolute inset-0 -z-10",
          intensityClasses[intensity],
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (variant === "mesh") {
    return (
      <div
        className={cn(
          "gradient-mesh absolute inset-0 -z-10",
          intensityClasses[intensity],
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (variant === "radial") {
    return (
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "bg-gradient-radial from-primary/20 via-accent/10 to-transparent",
          intensityClasses[intensity],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return null;
}
