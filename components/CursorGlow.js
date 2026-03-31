"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef(null);
  const innerRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let raf;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.12);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleHover = (e) => {
      const target = e.target.closest("[data-cursor]");

      if (!target) {
        glowRef.current.style.opacity = "0.6";
        glowRef.current.style.scale = "1";
        return;
      }

      const type = target.getAttribute("data-cursor");

      if (type === "button") {
        glowRef.current.style.scale = "1.6";
        glowRef.current.style.opacity = "0.9";
      }

      if (type === "link") {
        glowRef.current.style.scale = "1.3";
        glowRef.current.style.opacity = "0.8";
      }

      if (type === "card") {
        glowRef.current.style.scale = "2";
        glowRef.current.style.opacity = "0.7";
      }
    };

    window.addEventListener("mouseover", handleHover);

    return () => window.removeEventListener("mouseover", handleHover);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* OUTER GLOW */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] 
        w-[220px] h-[220px] rounded-full opacity-60 
        -translate-x-1/2 -translate-y-1/2 
        transition-[opacity,transform,scale] duration-300 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.25), rgba(167,139,250,0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* INNER CORE */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] 
        w-[40px] h-[40px] rounded-full opacity-80 
        -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.6), rgba(167,139,250,0.4), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </>
  );
}