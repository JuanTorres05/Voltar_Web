import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/ui/Navbar";
import Footer from "@/frontend/components/ui/Footer";
import CartDrawer from "@/frontend/components/ui/CartDrawer";
import { CartProvider } from "@/frontend/context/CartContext";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VOLTAR — Sin Límites",
    template: "%s | VOLTAR",
  },
  description:
    "Moda urbana que rompe esquemas. Colecciones exclusivas para quienes no siguen las reglas.",
  keywords: ["voltar", "streetwear", "moda urbana", "ropa juvenil"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "VOLTAR",
    title: "VOLTAR — Sin Límites",
    description: "Moda urbana que rompe esquemas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`dark ${bebas.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
