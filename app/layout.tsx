import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "G0 Experience",
  description: "The Universal Canvas for AI Entities",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <KeyboardShortcutsProvider>{children}</KeyboardShortcutsProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
