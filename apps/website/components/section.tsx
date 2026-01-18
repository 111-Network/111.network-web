import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  fullHeight?: boolean;
  withGradient?: boolean;
  withMesh?: boolean;
}

export function Section({
  children,
  className,
  fullHeight = false,
  withGradient = false,
  withMesh = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative w-full",
        fullHeight && "min-h-screen",
        "py-section-mobile md:py-section",
        withGradient && "gradient-primary",
        withMesh && "gradient-mesh",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
