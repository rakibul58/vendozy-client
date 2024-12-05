import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vendozy - Your Ultimate Online Shopping Destination",
  description:
    "Discover a seamless online shopping experience with Vendozy! Shop from a variety of vendors offering unique products, explore personalized recommendations, and enjoy exclusive deals. Whether you're a customer seeking quality items, a vendor managing your shop, or an admin overseeing the platform, Vendozy is built for everyone. Secure payments, responsive design, and advanced filtering make it your go-to e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
