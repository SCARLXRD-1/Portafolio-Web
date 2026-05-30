import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

type Locale = (typeof routing.locales)[number];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akashidev.com"),
  title: "AKASHI DEV | Software Engineer & UI/UX Designer",
  description: "Personal Portfolio of AKASHI DEV. Exploring web development, interactive user interfaces, and modern design.",
  openGraph: {
    title: "AKASHI DEV | Software Engineer",
    description: "Personal Portfolio of AKASHI DEV. Exploring web development and interactive user interfaces.",
    url: "https://akashidev.com",
    siteName: "AKASHI DEV",
    images: [
      {
        url: "/logo-con-texto.png",
        width: 1200,
        height: 630,
        alt: "AKASHI DEV Portfolio",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKASHI DEV | Software Engineer",
    description: "Personal Portfolio of AKASHI DEV.",
    images: ["/logo-con-texto.png"],
  },
  icons: {
    icon: [
      { url: "/logopes.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import ThemeProvider from '@/components/ThemeProvider';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-500`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
