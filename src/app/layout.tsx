import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const courier = Geist({
  variable: "--font-courier",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinehoria | Free Open Source Web-Based Screenplay Editor ",
  description: "A modern, free, open-source scriptwriting and screenplay software built for an ultrafocus enviornment. Developed by Lance Dabre. ",
  keywords: ["cinehoria", "screenwriting software", "screenplay editor", "Lance Dabre", "Next.js Screenwriting software"],
  authors: [{name: "Lance dabre", url: "https://github.com/lancedabre"}],
  openGraph: {
    title: 'Cinehoria - Screenwriting Software',
    description: 'A no BS screenwriting software to get you started.',
    url: 'cinehoria.vercel.app',
    siteName: 'Cinehoria',
    locale: 'en_US',
    type: 'website',
  },
  verification: {
    google: 'GkdjI05fVKYF0RH1k45PxBS3cskzgBFQhZ0yFMZDtf4',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Flaticon Uicons - Bold Rounded (for the fi-br prefix) */}
        <link 
          rel='stylesheet' 
          href='https://cdn-uicons.flaticon.com/2.1.0/uicons-bold-rounded/css/uicons-bold-rounded.css' 
        />
      </head>
      <body
      suppressHydrationWarning={true}  
        className={`${geistSans.variable} ${geistMono.variable} ${courier.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
