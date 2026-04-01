"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import Footer from "../components/Footer";
import ParallaxBackground from "../components/ParallaxBackground";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { BookingProvider } from "./context/BookingContext";
import { SoundProvider } from "../components/SoundProvider";
import Spotlight from "../components/Spotlight";
import Particles from "../components/Particles";
import { useState, useEffect } from "react";

function PageTransition({ children, pathname }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <BookingProvider>
          <SoundProvider>
            <ParallaxBackground />
            <Particles />
            <Spotlight />
            <CursorGlow />
            <Navbar />
            <div className="pt-16 sm:pt-20 relative z-10 min-h-screen">
              <PageTransition pathname={pathname}>
                {children}
                <Footer />
              </PageTransition>
            </div>
          </SoundProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
