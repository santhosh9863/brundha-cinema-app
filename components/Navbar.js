"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/booking" },
  { name: "Experience", href: "/experience" },
];

/* ─── Magnetic Effect Hook ─── */
function useMagneticEffect(ref, strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      x.set(deltaX * strength);
      y.set(deltaY * strength);
    },
    [x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x: smoothX, y: smoothY, handleMouseMove, handleMouseLeave };
}

/* ─── Magnetic Nav Item ─── */
function MagneticNavItem({ item, isActive }) {
  const ref = useRef(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticEffect(ref, 0.25);

  return (
    <Link
      href={item.href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative px-5 py-2.5 block"
    >
      <motion.span
        style={{ x, y }}
        className={`relative z-10 text-sm font-medium tracking-wider uppercase transition-colors duration-200 ${
          isActive ? "text-yellow-400" : "text-gray-400 hover:text-white"
        }`}
      >
        {item.name}
      </motion.span>

      {isActive && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shadow-[0_0_15px_rgba(255,200,0,0.15)]"
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />
      )}
    </Link>
  );
}

/* ─── Magnetic CTA Button ─── */
function MagneticCTA({ href, children }) {
  const ref = useRef(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticEffect(ref, 0.2);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  return (
    <Link
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={handleClick}
      className="relative overflow-hidden block"
    >
      <motion.div
        style={{ x, y, scale: pressed ? 0.95 : 1 }}
        className="relative px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 shadow-[0_0_25px_rgba(255,200,0,0.35)] hover:shadow-[0_0_40px_rgba(255,200,0,0.55)] transition-shadow duration-300"
      >
        <span className="relative z-10">{children}</span>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full bg-white/40 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 40,
              height: 40,
              marginLeft: -20,
              marginTop: -20,
            }}
          />
        ))}

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
    </Link>
  );
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleNavMouseMove = useCallback((e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseMove={handleNavMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-1.5 bg-black/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "py-3 bg-black/30 backdrop-blur-xl border-b border-transparent"
        }`}
      >
        {/* Cursor Glow */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-none"
              style={{
                background: `radial-gradient(300px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,200,0,0.08), transparent 60%)`,
              }}
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 relative z-10">
          {/* LOGO */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <span className="text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                BRUNDHA
              </span>
              <span className="text-lg sm:text-xl font-light text-white/90 ml-1">
                4K
              </span>

              {/* Glow pulse */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 bg-yellow-400/10 rounded-lg blur-md -z-10"
              />

              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                initial={{ x: "-150%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
              />
            </motion.div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-0.5 relative">
            {navItems.map((item) => (
              <MagneticNavItem
                key={item.name}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* CTA - Desktop */}
            <div className="hidden sm:block">
              <MagneticCTA href="/booking">Book Tickets</MagneticCTA>
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors overflow-hidden"
            >
              <motion.div
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-5 h-0.5 bg-white rounded-full"
              />
              <motion.div
                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-white rounded-full mt-1"
              />
              <motion.div
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-5 h-0.5 bg-white rounded-full mt-1"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-16 left-4 right-4 z-50 md:hidden"
            >
              <div className="glass rounded-2xl border border-white/10 p-4 space-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-400/10 border border-yellow-400/20 text-yellow-400"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="text-sm font-medium tracking-wide uppercase">
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active-dot"
                            className="w-2 h-2 rounded-full bg-yellow-400"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: navItems.length * 0.08 }}
                >
                  <Link
                    href="/booking"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(255,200,0,0.3)]"
                  >
                    Book Tickets
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
