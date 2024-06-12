import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClearkProvider from "./providers/ConvexClearkProvider";
import AudioProvider from "./providers/AudioProvider";
const manrope = Manrope({subsets: ['latin']})
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
    <ConvexClearkProvider>
      <html lang="en">
        <AudioProvider>
        <body className={manrope.className}>
          {children}</body>
          </AudioProvider>
      </html>
    </ConvexClearkProvider>
  );
}
