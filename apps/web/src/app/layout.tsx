import type { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

import { ThemeProvider } from "next-themes";

import { getSession } from "~/auth/server";
import FAB from "~/components/fab";
import SignInView from "~/components/SignInView";
import { searchMovie } from "~/utils/tmdb-util";

export const metadata: Metadata = {
  title: "Todo",
  description: "Simple monorepo with shared backend for web & mobile apps",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const r = await searchMovie({ title: "Dragon Ball" });
  console.log({ no1: r?.results?.[0] });

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {session?.user ? <SignedIn>{children}</SignedIn> : <SignInView />}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

const SignedIn = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="relative flex h-screen overflow-hidden">
      {children}
      <FAB />
    </main>
  );
};
