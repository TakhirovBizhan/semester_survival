import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { PlayerData, defaultPlayerData, loadPlayerData, savePlayerData } from "../storage/userStorage";

type ModalType = "none" | "name" | "firstChoice" | "labChoice" | "intelligence" | "charisma";

type PlayerContextType = {
  player: PlayerData;
  setPlayer: (player: PlayerData) => void;
  index: number;
  setIndex: (index: number) => void;
  isTypingDone: boolean;
  setIsTypingDone: (value: boolean) => void;
  modalType: ModalType;
  setModalType: (type: ModalType) => void;
  updatePlayer: (changes: Partial<PlayerData>) => Promise<void>;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<PlayerData>(defaultPlayerData());
  const [index, setIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("none");

  // Обновление игрока и сохранение в storage
   const updatePlayer = async (changes: Partial<PlayerData>) => {
    setPlayer((prev) => {
      const updated: PlayerData = { ...prev, ...changes };
      savePlayerData(updated);
      return updated;
    });
  };

  // Загрузка сохраненных данных
  useEffect(() => {
    loadPlayerData().then((stored) => {
      if (stored) {
        setPlayer({
          ...defaultPlayerData(),
          ...stored,
          choices: {
            ...defaultPlayerData().choices,
            ...stored.choices,
          },
        });
      }
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
        index,
        setIndex,
        isTypingDone,
        setIsTypingDone,
        modalType,
        setModalType,
        updatePlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// Хук для удобного использования контекста
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};