import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimationProvider } from "@/components/providers/AnimationProvider";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { SITE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AnimationProvider>
          <CursorProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              {children}
            </SmoothScrollProvider>
          </CursorProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
