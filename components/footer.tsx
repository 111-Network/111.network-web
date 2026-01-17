"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-background/50 py-8 backdrop-blur-sm",
        className
      )}
    >
      <Container size="lg">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 111 Network. Open Source.
            </p>
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-mono text-warning">In Development</span>
            </p>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}
