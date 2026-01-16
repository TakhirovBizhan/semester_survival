import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { PlayerData, defaultPlayerData, loadPlayerData, savePlayerData } from "../storage/userStorage";

type ModalType = "none" | "name" | "firstChoice" | "labChoice" | "intelligence" | "charisma" | "endDay" | "settings";

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


  // какая то непонятная затычка для игрока.
  // const updatePlayer = async (changes: Partial<PlayerData>) => {
  //   setPlayer((prev) => ({ ...prev, ...changes }));
  // };

  // функция для сохранения данных игрока 
  const updatePlayer = async (changes: Partial<PlayerData>) => {
    setPlayer((prev) => {
      const updated = { ...prev, ...changes };
      savePlayerData(updated);
      // Синхронизация с Firebase (асинхронно, не блокирует UI)
      import("../services/firebaseSync").then(({ firebaseSync }) => {
        firebaseSync.syncProgress(updated).catch((error) => {
          console.error("Ошибка синхронизации:", error);
        });
      });
      return updated;
    });
  };



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

    // Инициализация Firebase синхронизации
    import("../services/firebaseSync").then(({ firebaseSync }) => {
      firebaseSync.initialize().catch((error) => {
        console.error("Ошибка инициализации Firebase:", error);
      });
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

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
