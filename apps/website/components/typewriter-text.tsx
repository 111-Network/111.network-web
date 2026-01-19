"use client";

import * as React from "react";
import { cn } from "@111-network/ui";

interface TypewriterTextProps {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyping?: number;
  pauseAfterDeleting?: number;
}

export function TypewriterText({
  phrases,
  className,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseAfterTyping = 2000,
  pauseAfterDeleting = 500,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (phrases.length === 0) return;

    const currentPhrase = phrases[currentPhraseIndex];
    let timeoutId: NodeJS.Timeout;

    if (isPaused) {
      // Wait before starting next action
      timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, isDeleting ? pauseAfterDeleting : pauseAfterTyping);
    } else if (isDeleting) {
      // Deleting characters
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsPaused(true);
      }
    } else {
      // Typing characters
      if (displayText.length < currentPhrase.length) {
        timeoutId = setTimeout(() => {
          setDisplayText((prev) => currentPhrase.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause then start deleting
        setIsPaused(true);
        setIsDeleting(true);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    displayText,
    currentPhraseIndex,
    isDeleting,
    isPaused,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseAfterTyping,
    pauseAfterDeleting,
  ]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
