"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

const spheresConfig = [
  { position: [-2, 0, -5], color: "#8f5cf7", glow: "#c89fff", scale: 1.1, floatSpeed: 1.4, rotateSpeed: 0.2, opacity: 0.42 },
  { position: [1.2, 1.5, -4.5], color: "#ffc451", glow: "#ffe27a", scale: 0.9, floatSpeed: 1.1, rotateSpeed: 0.11, opacity: 0.36 },
  { position: [2.2, -1.1, -4.7], color: "#ffd700", glow: "#ffe27a", scale: 1.18, floatSpeed: 1.65, rotateSpeed: 0.14, opacity: 0.39 },
  { position: [-0.9, -1.3, -4.4], color: "#8848e6", glow: "#a383e9", scale: 0.85, floatSpeed: 1.32, rotateSpeed: 0.17, opacity: 0.31 },
];

function FloatingSphere({ position, color, glow, scale, floatSpeed, rotateSpeed, opacity }) {
  const ref = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * floatSpeed) * 0.25 * scale;
      groupRef.current.rotation.y = t * rotateSpeed;
    }

    if (ref.current) {
      const pulse = 0.995 + Math.sin(t * floatSpeed * 0.8) * 0.01;
      ref.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Sphere args={[1, 32, 32]} ref={ref}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.5}
          metalness={0.9}
          emissive={glow}
          emissiveIntensity={0.5}
        />
      </Sphere>

      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color={glow}
          transparent
          opacity={opacity * 0.25}
          emissive={glow}
          emissiveIntensity={0.8}
        />
      </Sphere>
    </group>
  );
}

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 2, -3]} color="#ffd700" intensity={1.2} />
      <pointLight position={[-3, -4, -5]} color="#8f5cf7" intensity={1} />
    </>
  );
}

function AnimatedCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    camera.position.x = Math.sin(t * 0.08) * 0.15;
    camera.position.y = 0.1 + Math.cos(t * 0.12) * 0.08;
    camera.position.z = 3.6;

    camera.lookAt(0, 0, -5);
  });

  return null;
}

export default function Hero() {
  return (
    <div className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden text-white bg-black w-full">

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ fov: 53, position: [0, 0.1, 3.6] }}
          dpr={[1, 1.5]}
        >
          <CinematicLights />
          <AnimatedCamera />
          {spheresConfig.map((props, i) => (
            <FloatingSphere key={i} {...props} />
          ))}
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/90 backdrop-blur-md" />

      {/* Top fade */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-20" />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-2xl">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          <span className="gradient-text">
            Brundha 4K Atmos Cinema
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-sm sm:text-lg text-white/70"
        >
          Premium cinematic experience with Dolby Atmos & 4K visuals
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow-[0_0_15px_rgba(255,200,0,0.6)]"
          >
            Book Tickets
          </motion.a>

          <motion.a
            href="/gallery"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
          >
            Explore More
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
}