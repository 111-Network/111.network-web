"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { GlitchText } from "../ui/glitch-text";
import { cn } from "../../lib/utils";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationProps {
  className?: string;
  logo?: React.ReactNode;
  items?: NavItem[];
  ctaItems?: React.ReactNode;
  children?: React.ReactNode;
}

export function Navigation({ 
  className, 
  logo,
  items = [],
  ctaItems,
  children 
}: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [isMd, setIsMd] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // #region agent log
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const navEl = document.querySelector("nav");
      if (navEl) {
        const computedStyle = window.getComputedStyle(navEl);
        const position = computedStyle.position;
        const top = computedStyle.top;
        const zIndex = computedStyle.zIndex;
        const navTop = navEl.getBoundingClientRect().top;
        const bodyPaddingTop = window.getComputedStyle(document.body).paddingTop;
        const htmlPaddingTop = window.getComputedStyle(document.documentElement).paddingTop;
        const menuContainer = navEl.querySelector('[style*="gap"]') as HTMLElement;
        let menuGap = 'missing';
        let menuDisplay = 'missing';
        let menuItems: Array<{ index: number; spacing: number }> = [];
        if (menuContainer) {
          const menuStyle = window.getComputedStyle(menuContainer);
          menuGap = menuStyle.gap;
          menuDisplay = menuStyle.display;
          const links = menuContainer.querySelectorAll('a, [href]');
          links.forEach((link, idx) => {
            if (idx < links.length - 1) {
              const rect1 = link.getBoundingClientRect();
              const rect2 = links[idx + 1].getBoundingClientRect();
              const spacing = rect2.left - rect1.right;
              menuItems.push({index: idx, spacing: spacing});
            }
          });
        }
        const broadcastBtn = document.querySelector('a[href="/broadcast"], [href*="broadcast"]');
        let broadcastBtnInfo = {};
        if (broadcastBtn) {
          const btnStyle = window.getComputedStyle(broadcastBtn);
          const btnRect = broadcastBtn.getBoundingClientRect();
          const textEl = broadcastBtn.querySelector('span:last-child');
          if (textEl) {
            const textRect = textEl.getBoundingClientRect();
            broadcastBtnInfo = {
              btnHeight: btnRect.height,
              textHeight: textRect.height,
              btnPaddingTop: btnStyle.paddingTop,
              btnPaddingBottom: btnStyle.paddingBottom,
              alignItems: btnStyle.alignItems,
              display: btnStyle.display
            };
          }
        }
        fetch('http://127.0.0.1:7252/ingest/eeb893fd-bd95-466c-90c9-11814a44ceb9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'navigation.tsx:43',message:'Navigation comprehensive check',data:{itemsCount:items.length,scrolled,position,top,zIndex,navTop,backdropFilter:computedStyle.backdropFilter,backdropBlur:computedStyle.backdropFilter,borderBottomColor:computedStyle.borderBottomColor,borderBottomWidth:computedStyle.borderBottomWidth,bodyPaddingTop,htmlPaddingTop,menuGap,menuDisplay,menuItems,broadcastBtnInfo},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
    }
  }, [items.length, logo, ctaItems, scrolled]);
  // #endregion

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-base",
        "bg-background/40 backdrop-blur-sm",
        "border-b border-solid",
        scrolled ? "bg-background/80" : "",
        className
      )}
      style={{
        position: "sticky",
        top: 0,
        paddingTop: "1.5rem",
        borderBottomWidth: "1px",
        borderBottomColor: scrolled 
          ? "hsl(var(--border) / 0.4)" 
          : "hsl(var(--border) / 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <Container>
        <div className="relative flex items-center justify-between" style={{ paddingBottom: '1.5rem' }}>
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0 z-10">
              {typeof logo === "string" ? (
                <Link href="/" className="block font-mono">
                  <span className="text-xl font-semibold">{logo}</span>
                </Link>
              ) : (
                logo
              )}
            </div>
          )}

          {/* Centered Navigation - Absolutely positioned for true centering */}
          {items.length > 0 && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10"
              style={{ gap: '2rem', display: isMd ? 'flex' : 'none' }}
            >
              {items.map((item) => {
                const isActive = pathname === item.href;
                const linkContent = (
                  <GlitchText
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive && "text-primary"
                    )}
                    intensity="low"
                  >
                    {item.label}
                  </GlitchText>
                );
                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {linkContent}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                  >
                    {linkContent}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Custom children or CTA Buttons */}
          {children || (ctaItems && (
            <div className="flex items-center gap-3 flex-shrink-0 z-10">
              {ctaItems}
            </div>
          ))}
        </div>
      </Container>
    </nav>
  );
}
