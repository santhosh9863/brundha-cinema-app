"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout(props) {
  const pathname = usePathname();
  const { children } = props;

  return (
    <html lang="en">
      <body className="bg-black text-white">

        <CursorGlow />

        <Navbar />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="pt-20"
          >
            {children}
          </motion.div>
        </AnimatePresence>

      </body>
    </html>
  );
}