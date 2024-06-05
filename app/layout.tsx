import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClearkProvider from "./providers/ConvexClearkProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcast",
  description: "Podcast with me ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ConvexClearkProvider>{children}</ConvexClearkProvider></body>
    </html>
  );
}
