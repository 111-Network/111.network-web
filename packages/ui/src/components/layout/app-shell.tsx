"use client";

import * as React from "react";
import { Navigation, type NavigationProps } from "./navigation";
import { Footer, type FooterProps } from "./footer";
import { ThemeProvider } from "./theme-provider";
import { cn } from "../../lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  navigation?: NavigationProps;
  footer?: FooterProps;
  className?: string;
  enableThemeProvider?: boolean;
  themeProviderProps?: React.ComponentProps<typeof ThemeProvider>;
}

export function AppShell({
  children,
  navigation,
  footer,
  className,
  enableThemeProvider = true,
  themeProviderProps,
}: AppShellProps) {
  const content = (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {navigation && <Navigation {...navigation} />}
      <main className="flex-1">{children}</main>
      {footer && <Footer {...footer} />}
    </div>
  );

  if (enableThemeProvider) {
    return (
      <ThemeProvider {...themeProviderProps}>
        {content}
      </ThemeProvider>
    );
  }

  return content;
}
