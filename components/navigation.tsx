"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  items?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  // Add more items as needed
];

export function Navigation({
  items = defaultNavItems,
  className,
}: NavigationProps) {
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
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-mono text-lg font-semibold transition-colors hover:text-primary"
            >
              111 Network
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              {items.map((item) => {
                const isActive = pathname === item.href;
                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        isActive && "text-primary"
                      )}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive && "text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
