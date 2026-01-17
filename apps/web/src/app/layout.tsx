import type { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

import { ThemeProvider, ThemeToggle } from "~/components/ui/custom/theme";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Todo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("relative flex h-screen")}>
        <ThemeProvider>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute right-4 bottom-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
