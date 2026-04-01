"use client";

import { useRef, useEffect, useMemo } from "react";

const PARTICLE_COUNT = 28;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const isGold = Math.random() > 0.6;
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.4 + 0.1,
      color: isGold ? "255,215,0" : "255,255,255",
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 40 - 20,
    };
  });
}

export default function Particles() {
  const particles = useMemo(() => generateParticles(), []);
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement("style");
      style.setAttribute("data-particles", "true");

      let css = "";
      particles.forEach((p) => {
        const c = p.color;
        const o = p.opacity;
        const glowSize = p.size * 3;
        const halfGlow = o * 0.5;

        css += "@keyframes particle-float-" + p.id + " {";
        css += "0%,100%{transform:translate(0,0) scale(1);opacity:" + (o * 0.5) + "}";
        css += "25%{transform:translate(" + (p.driftX * 0.3) + "px," + (p.driftY * 0.5) + "px) scale(1.1);opacity:" + o + "}";
        css += "50%{transform:translate(" + (p.driftX * 0.6) + "px," + p.driftY + "px) scale(0.9);opacity:" + (o * 0.7) + "}";
        css += "75%{transform:translate(" + (p.driftX * 0.3) + "px," + (p.driftY * 0.3) + "px) scale(1.05);opacity:" + (o * 0.9) + "}";
        css += "}";

        css += "@keyframes particle-flicker-" + p.id + " {";
        css += "0%,100%{opacity:" + (o * 0.4) + "}";
        css += "30%{opacity:" + o + "}";
        css += "60%{opacity:" + (o * 0.6) + "}";
        css += "80%{opacity:" + (o * 0.8) + "}";
        css += "}";

        css += ".particle-" + p.id + "{";
        css += "left:" + p.x + "%;top:" + p.y + "%;";
        css += "width:" + p.size + "px;height:" + p.size + "px;";
        css += "background:rgba(" + c + "," + o + ");";
        css += "box-shadow:0 0 " + glowSize + "px rgba(" + c + "," + halfGlow + ");";
        css += "animation:particle-float-" + p.id + " " + p.duration + "s ease-in-out " + p.delay + "s infinite,";
        css += "particle-flicker-" + p.id + " " + (p.duration * 0.4) + "s ease-in-out " + p.delay + "s infinite;";
        css += "}";
      });

      style.textContent = css;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={"absolute rounded-full particle-" + p.id}
        />
      ))}
    </div>
  );
}
