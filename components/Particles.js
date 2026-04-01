"use client";

import { useEffect, useState } from "react";

export default function Particles() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setDots(generated);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
        />
      ))}
    </div>
  );
}