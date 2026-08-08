import type { Metadata } from "next";
import { Anton, Public_Sans, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const body = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Buddy — Never start at zero",
  description:
    "Buddy connects kids moving to a new school or country with someone already waiting there — before they arrive. Never start at zero.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-full bg-background font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--ink)",
              color: "var(--foreground)",
              borderRadius: "2px",
            },
          }}
        />
      </body>
    </html>
  );
}
