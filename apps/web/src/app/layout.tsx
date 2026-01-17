import type { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

import { getSession } from "~/auth/server";
import { ThemeProvider } from "~/components/my-ui/theme";
import SignInView from "~/components/SignInView";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            {session?.user ? <SignedIn>{children}</SignedIn> : <SignInView />}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

const SignedIn = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* <SideNav /> */}

      <main className="flex-1">{children}</main>
      {/* <TaskModal /> */}
    </div>
    // </AppContextProvider>
  );
};
