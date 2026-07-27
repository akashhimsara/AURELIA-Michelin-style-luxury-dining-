import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURELIA | Luxury Fine Dining Mayfair, London",
  description: "Experience bespoke Modern European culinary art at AURELIA London. Michelin-style seasonal menus, chef's table, and private seating in Mayfair.",
  metadataBase: new URL("https://aurelia-dining.com"),
  openGraph: {
    title: "AURELIA | Luxury Fine Dining Mayfair, London",
    description: "Experience bespoke Modern European culinary art at AURELIA London. Michelin-style seasonal menus, chef's table, and private seating.",
    url: "https://aurelia-dining.com",
    siteName: "AURELIA London",
    images: [
      {
        url: "/menu-halibut.png",
        width: 1200,
        height: 630,
        alt: "AURELIA London - Culinary Arts",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURELIA | Luxury Fine Dining Mayfair, London",
    description: "Experience bespoke Modern European culinary art at AURELIA London. Michelin-style seasonal menus, chef's table, and private seating.",
    images: ["/menu-halibut.png"],
  },
  alternates: {
    canonical: "https://aurelia-dining.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-zinc-100 flex flex-col font-sans">
        {/* JSON-LD Structured Data Schema for Local Restaurant Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "@id": "https://aurelia-dining.com",
              "name": "AURELIA London",
              "image": "https://aurelia-dining.com/menu-halibut.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "15 Bruton Place, Mayfair",
                "addressLocality": "London",
                "postalCode": "W1J 6NP",
                "addressCountry": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 51.509865,
                "longitude": -0.118092
              },
              "url": "https://aurelia-dining.com",
              "telephone": "+442071234567",
              "priceRange": "$$$$",
              "menu": "https://aurelia-dining.com/#menu",
              "servesCuisine": "Modern European, Michelin Fine Dining",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "17:30",
                  "closes": "23:00"
                }
              ],
              "acceptsReservations": "True"
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
