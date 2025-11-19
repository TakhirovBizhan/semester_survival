import React, { createContext, useState, useEffect, useContext } from "react";
import { Audio } from "expo-av";

type MusicContextType = {
  sound: Audio.Sound | null;
  volume: number;
  setVolume: (v: number) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let isMounted = true;
    let music: Audio.Sound | null = null;

    const loadMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/music/day1.mp3"),
          { shouldPlay: true, isLooping: true, volume }
        );
        music = sound;
        if (isMounted) {
          setSound(sound);
          await sound.playAsync();
        }
      } catch (e) {
        console.warn("Ошибка при загрузке музыки:", e);
      }
    };

    loadMusic();

    return () => {
      isMounted = false;
      if (music) {
        music.stopAsync();
        music.unloadAsync();
      }
    };
  }, []);

  // Обновление громкости
  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume).catch((e) => console.warn("Ошибка установки громкости:", e));
    }
  }, [volume, sound]);

  return (
    <MusicContext.Provider value={{ sound, volume, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
