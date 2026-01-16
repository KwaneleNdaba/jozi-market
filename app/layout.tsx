'use client';

import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from './contexts/CartContext';
import { FeaturePlanProvider } from './contexts/FeaturePlanContext';
import { ToastProvider } from './contexts/ToastContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Jozi Market</title>
        <meta name="description" content="A premium e-commerce marketplace for local Johannesburg vendors, featuring high-end South African products, vendor dashboards, and gamified loyalty rewards." />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <FeaturePlanProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </FeaturePlanProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
