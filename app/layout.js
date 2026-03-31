"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BookingProvider } from "./context/BookingContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">

        <BookingProvider>

          {/* Background */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.08),transparent_70%)]"></div>

          <CursorGlow />
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-16 sm:pt-20"
            >
              {children}
              <Footer />
            </motion.div>
          </AnimatePresence>

        </BookingProvider>

      </body>
    </html>
  );
}