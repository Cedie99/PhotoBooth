import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "photobooth.ph - Your Photo Memories, Unlimited",
  description:
    "Customizable photobooth platform for events, malls, and brands with memory websites and partner analytics."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-[var(--font-body)]`}>
        {adClient ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <main className="main-shell">{children}</main>
      </body>
    </html>
  );
}
