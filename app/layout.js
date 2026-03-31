"use client";
import Loader from "../components/Loader";
import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BookingProvider } from "./context/BookingContext";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <BookingProvider>

          {loading && <Loader />}

          {/* Background */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.08),transparent_70%)]"></div>

          <CursorGlow />
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
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