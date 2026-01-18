"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TermsBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms (client-side only)
    if (typeof window !== "undefined") {
      const hasAccepted = localStorage.getItem("terms-accepted");
      if (!hasAccepted) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("terms-accepted", "true");
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 transform",
        "border-t border-border bg-background/95 backdrop-blur-sm",
        "shadow-lg",
        "px-4 py-3 sm:px-6 sm:py-4"
      )}
      style={{ marginBottom: "0" }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="flex-1 text-sm text-foreground sm:text-base">
          By using this site, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-primary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/terms"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAccept}
            className={cn(
              "rounded-md bg-primary px-4 py-2 text-sm font-medium",
              "text-primary-foreground transition-colors",
              "hover:bg-primary-hover focus:outline-none focus:ring-2",
              "focus:ring-ring focus:ring-offset-2"
            )}
          >
            Accept
          </button>
          <button
            onClick={handleAccept}
            className={cn(
              "rounded-md p-1 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
