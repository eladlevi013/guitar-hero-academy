import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CloudProvider } from "@/components/CloudProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Guitar Hero Academy",
    template: "%s | Guitar Hero Academy",
  },
  description: "Learn guitar with real-time pitch detection. Play actual notes and the app tells you if you're in tune — in real time.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GHA",
  },
  openGraph: {
    title: "Guitar Hero Academy",
    description: "Learn guitar with real-time pitch detection",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Guitar Hero Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guitar Hero Academy",
    description: "Learn guitar with real-time pitch detection",
    images: ["/api/og"],
  },
};

export const viewport: Viewport = {
  themeColor: "#c8553d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <CloudProvider>
          {children}
          <Analytics />
        </CloudProvider>
      </body>
    </html>
  );
}
