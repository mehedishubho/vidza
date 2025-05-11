import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from "@/components/ui/toaster";
import { getSeoSettings, getSiteSettings } from '@/lib/settings';

const inter = Inter({ subsets: ['latin'] });

async function getMetadata(): Promise<Metadata> {
  const [seo, site] = await Promise.all([
    getSeoSettings(),
    getSiteSettings()
  ]);

  return {
    title: seo?.meta_title || site?.site_name || 'Vidza',
    description: seo?.meta_description || 'Download videos from social media platforms',
    openGraph: {
      title: seo?.og_title || seo?.meta_title,
      description: seo?.og_description || seo?.meta_description,
      images: seo?.og_image_url ? [seo.og_image_url] : [],
    },
    icons: site?.favicon_url ? [
      { rel: 'icon', url: site.favicon_url }
    ] : undefined,
  };
}

export const metadata = await getMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seo, site] = await Promise.all([
    getSeoSettings(),
    getSiteSettings()
  ]);

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        {seo?.custom_head && (
          <div dangerouslySetInnerHTML={{ __html: seo.custom_head }} />
        )}
      </head>
      <body className={inter.className}>
        {seo?.custom_body && (
          <div dangerouslySetInnerHTML={{ __html: seo.custom_body }} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        {seo?.custom_footer && (
          <div dangerouslySetInnerHTML={{ __html: seo.custom_footer }} />
        )}
      </body>
    </html>
  );
}