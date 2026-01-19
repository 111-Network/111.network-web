"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "../../lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  className?: string;
  copyright?: string;
  links?: FooterLink[];
  showThemeToggle?: boolean;
  children?: React.ReactNode;
}

export function Footer({ 
  className,
  copyright,
  links = [],
  showThemeToggle = true,
  children
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} 111 Network. Open Source.`;

  // #region agent log
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const footerEl = document.querySelector("footer");
      if (footerEl) {
        const computedStyle = window.getComputedStyle(footerEl);
        const container = footerEl.querySelector('[class*="flex-row"]');
        let containerInfo = {};
        if (container) {
          const containerStyle = window.getComputedStyle(container);
          const links = container.querySelectorAll('a, [href], p');
          const items = Array.from(links).map((link, idx) => {
            const rect = link.getBoundingClientRect();
            return { index: idx, text: link.textContent?.trim(), width: rect.width };
          });
          containerInfo = {
            display: containerStyle.display,
            flexDirection: containerStyle.flexDirection,
            gap: containerStyle.gap,
            alignItems: containerStyle.alignItems,
            justifyContent: containerStyle.justifyContent,
            itemsCount: links.length,
            items: items
          };
        }
        fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'footer.tsx:33',message:'Footer layout check',data:{borderTopColor:computedStyle.borderTopColor,borderTopWidth:computedStyle.borderTopWidth,hasCopyright:!!copyright,linksCount:links.length,containerInfo},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      }
    }
  }, [copyright, links.length]);
  // #endregion

  return (
    <footer
      className={cn(
        "border-t border-solid bg-background",
        className
      )}
      style={{
        borderTopWidth: "1px",
        borderTopColor: "hsl(var(--border) / 0.3)",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      }}
    >
      <Container size="lg">
        <div className="flex flex-row items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-row items-center gap-6 flex-wrap">
            {copyright && (
              <p className="text-sm text-muted-foreground whitespace-nowrap">{copyright}</p>
            )}
            {links.map((link, index) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )
            ))}
            {children && (
              <div className="whitespace-nowrap">
                {children}
              </div>
            )}
          </div>
          {showThemeToggle && (
            <div className="flex items-center flex-shrink-0">
              <ThemeToggle />
            </div>
          )}
        </div>
      </Container>
    </footer>
  );
}
