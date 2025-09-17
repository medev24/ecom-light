import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommerce Light",
  description: "A light ecommerce MVP with Next.js + Firebase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <CartProvider>
            <ClientWrapper>
              <Header />
              <Toaster
                position="top-right"
                containerClassName="mt-16"
                toastOptions={{
                  duration: 2000,
                  className:
                    "bg-white/10 text-white shadow-md rounded-lg px-3 py-2 font-bold backdrop-blur-sm",
                }}
              />
              <main className="min-h-screen">{children}</main>
            </ClientWrapper>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
