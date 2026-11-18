import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/ui/Navbar";
import Footer from "@/frontend/components/ui/Footer";
import CartDrawer from "@/frontend/components/ui/CartDrawer";
import CartToast from "@/frontend/components/ui/CartToast";
import { CartProvider } from "@/frontend/context/CartContext";
import SmoothScrollProvider from "@/frontend/components/ui/SmoothScrollProvider";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VØLTAR — [ GALERÍA URBANA // STREETWEAR ]",
    template: "%s | VØLTAR",
  },
  description:
    "Sistema de moda urbana y galería de artistas emergentes. Estampa arte callejero en prendas de alto gramaje.",
  keywords: ["voltar", "streetwear", "brutalismo", "galeria urbana", "ropa personalizada"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "VØLTAR",
    title: "VØLTAR — [ GALERÍA URBANA // STREETWEAR ]",
    description: "Archivo de arte urbano y taller de estampado.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`dark ${archivoBlack.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-volt selection:text-white">
        {/* Global CRT Scanlines & Mechanical Noise Overlay */}
        <div className="crt-scanlines pointer-events-none fixed inset-0 z-50 opacity-35" />
        <div className="noise-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.04]" />

        <SmoothScrollProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <CartToast />
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
