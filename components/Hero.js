"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const spheresConfig = [
  {
    position: [-2, 0, -5],
    color: "#8f5cf7",
    glow: "#c89fff",
    scale: 1.1,
    floatSpeed: 1.4,
    rotateSpeed: 0.2,
    opacity: 0.42,
  },
  {
    position: [1.2, 1.5, -4.5],
    color: "#ffc451",
    glow: "#ffe27a",
    scale: 0.9,
    floatSpeed: 1.1,
    rotateSpeed: 0.11,
    opacity: 0.36,
  },
  {
    position: [2.2, -1.1, -4.7],
    color: "#ffd700",
    glow: "#ffe27a",
    scale: 1.18,
    floatSpeed: 1.65,
    rotateSpeed: 0.14,
    opacity: 0.39,
  },
  {
    position: [-0.9, -1.3, -4.4],
    color: "#8848e6",
    glow: "#a383e9",
    scale: 0.85,
    floatSpeed: 1.32,
    rotateSpeed: 0.17,
    opacity: 0.31,
  },
];

function FloatingSphere({
  position,
  color,
  glow,
  scale,
  floatSpeed,
  rotateSpeed,
  opacity,
}) {
  const ref = useRef();
  const groupRef = useRef();
  // Floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * floatSpeed) * 0.25 * scale;
      groupRef.current.rotation.y = t * rotateSpeed;
    }
    // Optional: scale pulse for depth (very subtle)
    if (ref.current) {
      const pulse = 0.995 + Math.sin(t * floatSpeed * 0.8) * 0.01;
      ref.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core sphere */}
      <Sphere args={[1, 32, 32]} ref={ref}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.55}
          metalness={0.8}
          emissive={glow}
          emissiveIntensity={0.35}
        />
      </Sphere>
      {/* Subtle glow (bigger, blurred sphere) */}
      <Sphere args={[1.15, 32, 32]}>
        <meshStandardMaterial
          color={glow}
          transparent
          opacity={opacity * 0.28}
          emissive={glow}
          emissiveIntensity={0.7}
        />
      </Sphere>
    </group>
  );
}

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.54} />
      <pointLight
        position={[0, 2, -3]}
        color="#ffd700"
        intensity={1.1}
        distance={10}
        decay={2}
        castShadow={false}
      />
      <pointLight
        position={[-3, -4, -5]}
        color="#8f5cf7"
        intensity={1}
        distance={8}
        decay={2}
        castShadow={false}
      />
    </>
  );
}

// Camera animation for slight movement
function AnimatedCamera() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.09) * 0.15;
    camera.position.y = 0.1 + Math.cos(t * 0.15) * 0.09;
    camera.position.z = 3.7 + Math.sin(t * 0.08) * 0.04;
    camera.lookAt(0, 0, -5);
  });
  return null;
}

export default function Hero() {
  // Animations for content
  const motionConfig = {
    initial: { opacity: 0, y: 40, scale: 0.965 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, ease: [0.61, 1, 0.88, 1] },
  };

  const subtitleConfig = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.42, duration: 0.9, ease: "easeOut" },
  };

  const buttonsConfig = [
    {
      whileHover: {
        scale: 1.06,
        boxShadow: "0 0 18px 4pxrgba(164, 66, 66, 0.6)",
        filter: "brightness(1.14)",
      },
      transition: { type: "spring", stiffness: 320, damping: 18 },
    },
    {
      whileHover: {
        scale: 1.04,
        boxShadow: "0 0 12px 3px #b1946db7",
        background:
          "linear-gradient(90deg,rgba(255,213,79,0.1),rgba(255,255,255,0.01))",
      },
      transition: { type: "spring", stiffness: 280, damping: 21 },
    },
  ];

  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden text-white bg-black/95 w-full">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ fov: 53, position: [0, 0.1, 3.75], near: 0.5, far: 100 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 1.8]}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <CinematicLights />
          <AnimatedCamera />
          {spheresConfig.map((props, i) => (
            <FloatingSphere key={i} {...props} />
          ))}
          {/* No controls, for performance and cinematic feel */}
        </Canvas>
      </div>
      {/* Overlay Layer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(34,21,47,0.85) 50%, rgba(12,9,20,0.91) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      />
      {/* Gradient top/bottom fade for extra depth */}
      <div className="absolute top-0 left-0 w-full h-28 z-20 pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-36 z-20 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Content Layer */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center select-none px-6">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg"
          {...motionConfig}
        >
          <span className="bg-gradient-to-r from-[#ffd700] via-[#aa8aff] to-[#ffd700] bg-clip-text text-transparent shadow-gold">
            Brundha{" "}
            <span className="text-[#ffd700] drop-shadow-[0_2px_10px_#ffd700da]">
              4K Atmos Cinema
            </span>
          </span>
        </motion.h1>
        {/* Subtitle (Kannada) */}
        <motion.h2
          className="mt-5 mb-3 text-lg md:text-xl font-medium text-white/80 drop-shadow"
          {...subtitleConfig}
        >
          ಬ್ರುಂದಾ ಸಿನೆಮಾ – ಅತ್ಯುತ್ತಮ ಚಿತ್ರಾನುಭವ, 4K & Atmos ಆಸ್ವಾದಿಸಿ!
        </motion.h2>
        {/* Rating */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-7 md:mb-9"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-2xl">⭐</span>
          <span className="font-semibold text-white text-lg">4.4</span>
          <span className="text-white/70 text-base">
            (7,477 reviews)
          </span>
        </motion.div>
        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.14, delayChildren: 1.02 },
            },
          }}
        >
          {/* Book Tickets Button */}
          <motion.a
            href="#"
            className="px-7 py-3 rounded-full text-base font-medium bg-gradient-to-r from-[#ffd700] via-[#efb034] to-[#ffef9a] text-black shadow-[0_4px_36px_2px_#ffd70066] drop-shadow-lg hover:from-[#ffecb3] hover:to-[#ffe976] focus:ring-2 focus:ring-[#ffd700d7] active:scale-[0.97] transition-all"
            whileHover={buttonsConfig[0].whileHover}
            transition={buttonsConfig[0].transition}
            style={{
              filter: "drop-shadow(0 0 7px #ffd70099)",
            }}
          >
            Book Tickets
          </motion.a>
          {/* Explore More Button */}
          <motion.a
            href="#"
            className="px-7 py-3 rounded-full border border-[#ffd70099] text-base font-medium text-[#ffd700] bg-transparent hover:bg-[#ffd70019] shadow-[0_4px_18px_1px_#aa8aff28] hover:text-black focus:ring-2 focus:ring-[#ffd700a4] active:scale-[0.98] transition-all"
            whileHover={buttonsConfig[1].whileHover}
            transition={buttonsConfig[1].transition}
            style={{}}
          >
            Explore More
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}