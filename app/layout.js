"use client";

import Loader from "../components/Loader";
import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import ParallaxBackground from "../components/ParallaxBackground";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BookingProvider } from "./context/BookingContext";
import { SoundProvider } from "../components/SoundProvider"; // ✅ NEW
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">

        <BookingProvider>
          <SoundProvider> {/* 🔥 WRAPPED */}

            {loading && <Loader />}

            <ParallaxBackground />
            <CursorGlow />
            <Navbar />

            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="pt-16 sm:pt-20"
              >
                {children}
                <Footer />
              </motion.div>
            </AnimatePresence>

          </SoundProvider>
        </BookingProvider>

      </body>
    </html>
  );
}