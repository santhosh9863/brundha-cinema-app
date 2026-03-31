"use client";

import { createContext, useContext, useRef } from "react";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const click = useRef(null);
  const success = useRef(null);
  const error = useRef(null);

  const play = (type) => {
    let audio;

    if (type === "click") {
      audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    }
    if (type === "success") {
      audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    }
    if (type === "error") {
      audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3");
    }

    if (audio) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  return (
    <SoundContext.Provider value={{ play }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);