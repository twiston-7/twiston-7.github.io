import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";

import ClientShell from "@components/client-shell";

import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Twiston",
    template: "%s | Twiston",
  },
  description: "Student software developer portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.className} suppressHydrationWarning>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
