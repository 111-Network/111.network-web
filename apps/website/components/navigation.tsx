"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GlitchText } from "./glitch-text";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  className?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Network", href: "/network" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
];

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-base",
        scrolled
          ? "border-border/40 bg-background/80 backdrop-blur-sm"
          : "border-transparent bg-background/40 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <GlitchText
                className="font-mono text-xl font-semibold"
                intensity="medium"
                randomTiming={true}
              >
                111 Network
              </GlitchText>
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="hidden items-center justify-center gap-8 md:flex flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive && "text-primary"
                    )}
                  >
                    <GlitchText intensity="low">{item.label}</GlitchText>
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-primary"
                  )}
                >
                  <GlitchText intensity="low">{item.label}</GlitchText>
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/broadcast"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            >
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error pulse-glow flex-shrink-0"></span>
              <span className="flex items-center justify-center">Broadcast</span>
            </Link>
            <a
              href="https://github.com/111-Network"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              )}
            >
              <GlitchText intensity="low">Get Involved</GlitchText>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
