import type { Metadata } from "next";
import { Fira_Code, Share_Tech_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-robika-sans",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-robika-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robika",
  description:
    "Belajar coding interaktif dengan AI, game 2D, dan CodeLab — gratis untuk semua.",
  applicationName: "Robika",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Robika",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    "theme-color": "#0B0B10",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`dark ${firaCode.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator && !location.hostname.startsWith('localhost')) { window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); }); }`,
          }}
        />
      </body>
    </html>
  );
}