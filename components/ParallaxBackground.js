"use client";

import { useEffect, useState } from "react";

export default function ParallaxBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* 🔥 Layer 1 */}
      <div
        className="absolute w-[700px] h-[700px] bg-yellow-400/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          top: "10%",
          left: "25%",
        }}
      />

      {/* 🔮 Layer 2 */}
      <div
        className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${-position.x}px, ${-position.y}px)`,
          bottom: "10%",
          right: "20%",
        }}
      />

      {/* 🌊 Layer 3 (slow float) */}
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,200,0,0.06),transparent_70%)]" />

    </div>
  );
}