import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

type Locale = (typeof routing.locales)[number];

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import { insforge } from '@/lib/insforge';

export async function generateMetadata(): Promise<Metadata> {
  let title = "AKASHI DEV | Software Engineer & UI/UX Designer";
  let description = "Personal Portfolio of AKASHI DEV. Exploring web development, interactive user interfaces, and modern design.";
  let keywords = "React, Nextjs, Frontend, Developer, OS";

  try {
    const { data, error } = await insforge.database
      .from('site_settings')
      .select('seo_title, seo_description, seo_keywords')
      .eq('id', 1)
      .single();

    if (!error && data) {
      if (data.seo_title) title = data.seo_title;
      if (data.seo_description) description = data.seo_description;
      if (data.seo_keywords) keywords = data.seo_keywords;
    }
  } catch (e) {
    console.error("Failed to fetch dynamic SEO metadata", e);
  }

  return {
    metadataBase: new URL("https://akashidev.com"),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "https://akashidev.com",
      siteName: title,
      images: [
        {
          url: "/logo-con-texto.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
}

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
        className={`${playfair.variable} ${outfit.variable} font-sans antialiased bg-white dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-500 h-full w-full m-0 p-0`}
        suppressHydrationWarning
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
