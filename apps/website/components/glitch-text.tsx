"use client";

import * as React from "react";
import { cn } from "@111-network/ui";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  randomTiming?: boolean;
}

export function GlitchText({
  children,
  className,
  intensity = "medium",
  randomTiming = false,
}: GlitchTextProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [glitchText, setGlitchText] = React.useState("");
  const textRef = React.useRef<HTMLSpanElement>(null);

  const generateGlitchText = (originalText: string) => {
    const chars = "01";
    return originalText
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
  };

  const handleMouseEnter = () => {
    if (textRef.current) {
      const originalText = textRef.current.textContent || "";
      setGlitchText(generateGlitchText(originalText));
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Clear glitch text immediately to prevent it from staying visible
    setTimeout(() => setGlitchText(""), 600);
  };

  return (
    <span
      ref={textRef}
      className={cn(
        "relative inline-block cursor-pointer",
        isHovered && "glitch-reveal",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Binary overlay */}
      {isHovered && glitchText && (
        <span
          className="absolute inset-0 glitch-binary-overlay"
          aria-hidden="true"
        >
          {glitchText}
        </span>
      )}
      {/* Real text that reveals from left to right */}
      <span className={cn("relative z-10", isHovered && "glitch-text-reveal")}>
        {children}
      </span>
    </span>
  );
}
