import { Manrope, Philosopher } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { readJsonFromData } from "@/lib/data";
import GlobalErrorHandler from "@/components/shared/GlobalErrorHandler";
import AppInitializer from "@/components/shared/AppInitializer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata() {
  const data = await readJsonFromData("data/site.json");
  const site = data.site || data;
  return {
    title: site.title,
    description: site.description,
    keywords: site.keywords,
    openGraph: site.openGraph,
    twitter: site.twitter,
    metadataBase: site.url ? new URL(site.url) : undefined,
    icons: {
      icon: '/main_logo.png',
      shortcut: '/main_logo.png',
      apple: '/main_logo.png',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${philosopher.variable} antialiased`}>
        <Script
          src="https://pay.google.com/gp/p/js/pay.js"
          strategy="lazyOnload"
        />
        <GlobalErrorHandler />
          <AuthProvider>
            <CurrencyProvider>
              <AppInitializer>
                {children}
              </AppInitializer>
              <Toaster position="top-center" richColors />
            </CurrencyProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
