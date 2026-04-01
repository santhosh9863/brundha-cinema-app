"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

const spheresConfig = [
  { position: [-3, 0.5, -6], color: "#8f5cf7", glow: "#c89fff", scale: 1.4, floatSpeed: 0.8, rotateSpeed: 0.15, opacity: 0.35 },
  { position: [2.5, 2, -5], color: "#ffc451", glow: "#ffe27a", scale: 1.1, floatSpeed: 1.0, rotateSpeed: 0.1, opacity: 0.28 },
  { position: [3.5, -1.5, -5.5], color: "#ffd700", glow: "#ffe27a", scale: 1.5, floatSpeed: 1.2, rotateSpeed: 0.12, opacity: 0.32 },
  { position: [-2, -2, -5], color: "#8848e6", glow: "#a383e9", scale: 1.0, floatSpeed: 0.9, rotateSpeed: 0.18, opacity: 0.25 },
  { position: [0, 3, -7], color: "#ff6b35", glow: "#ff9a5c", scale: 0.8, floatSpeed: 1.1, rotateSpeed: 0.08, opacity: 0.2 },
];

function FloatingSphere({ position, color, glow, scale, floatSpeed, rotateSpeed, opacity }) {
  const ref = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * 0.3 * scale;
      groupRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7) * 0.15;
      groupRef.current.rotation.y = t * rotateSpeed;
    }

    if (ref.current) {
      const pulse = 1 + Math.sin(t * floatSpeed * 0.6) * 0.02;
      ref.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Sphere args={[1, 48, 48]} ref={ref}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.4}
          metalness={0.95}
          emissive={glow}
          emissiveIntensity={0.6}
        />
      </Sphere>

      <Sphere args={[1.3, 32, 32]}>
        <meshStandardMaterial
          color={glow}
          transparent
          opacity={opacity * 0.2}
          emissive={glow}
          emissiveIntensity={1}
        />
      </Sphere>
    </group>
  );
}

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, -4]} color="#ffd700" intensity={1.5} distance={15} />
      <pointLight position={[-4, -3, -6]} color="#8f5cf7" intensity={1.2} distance={12} />
      <pointLight position={[3, 1, -5]} color="#ff6b35" intensity={0.8} distance={10} />
      <spotLight position={[0, 5, -3]} color="#ffffff" intensity={0.5} angle={0.3} penumbra={1} />
    </>
  );
}

function AnimatedCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    camera.position.x = Math.sin(t * 0.06) * 0.2;
    camera.position.y = 0.15 + Math.cos(t * 0.09) * 0.1;
    camera.position.z = 4.2;

    camera.lookAt(0, 0, -5);
  });

  return null;
}

function ParticleField() {
  const count = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <CinematicLights />
      <AnimatedCamera />
      <ParticleField />
      {spheresConfig.map((props, i) => (
        <FloatingSphere key={i} {...props} />
      ))}
    </>
  );
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.15,
    },
  }),
};

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white w-full bg-black">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ fov: 50, position: [0, 0.15, 4.2] }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Gradient Overlay Layer */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />

      {/* Radial Glow Center */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08)_0%,rgba(143,92,247,0.05)_40%,transparent_70%)]" />

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] animate-pulse" />

      {/* Top Fade */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent z-20" />

      {/* Side Vignette */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content Layer */}
      <motion.div
        className="relative z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl"
        variants={staggerChildren}
        initial="hidden"
        animate={loaded ? "visible" : "hidden"}
      >
        {/* Pre-title Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/5 text-yellow-400/90 text-xs sm:text-sm font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Now Showing
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight"
        >
          <span className="block text-white">
            BRUNDHA
          </span>
          <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,200,0,0.3)]">
            4K ATMOS
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          custom={2}
          className="mt-6 sm:mt-8 w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/60 max-w-xl leading-relaxed font-light"
        >
          Where every frame breathes, every sound surrounds.
          <br className="hidden sm:block" />
          <span className="text-white/40">Experience cinema the way it was meant to be.</span>
        </motion.p>

        {/* Features Pills */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8"
        >
          {["Dolby Atmos", "4K Laser", "Recliner Seats", "IMAX Sound"].map((feature, i) => (
            <span
              key={feature}
              className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs sm:text-sm backdrop-blur-sm"
            >
              {feature}
            </span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          custom={5}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto"
        >
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255,200,0,0.4)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold shadow-[0_0_20px_rgba(255,200,0,0.3)] overflow-hidden"
          >
            <span className="relative z-10">Book Tickets</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          <motion.a
            href="#features"
            whileHover={{ scale: 1.03, borderColor: "rgba(255,215,0,0.5)", backgroundColor: "rgba(255,215,0,0.05)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base rounded-full border border-white/20 text-white/80 hover:text-white backdrop-blur-sm overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10">Explore More</span>
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={fadeUp}
          custom={6}
          className="mt-12 sm:mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-yellow-400"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
