import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  PlayerData,
  defaultPlayerData,
  loadPlayerData,
  savePlayerData,
  getLastUpdateTime,
  clearPlayerData,
} from "../storage/userStorage";

type ModalType =
  | "none"
  | "name"
  | "firstChoice"
  | "labChoice"
  | "intellect"
  | "charisma"
  | "endDay"
  | "settings"
  | "saveSlots";

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
  isLoadingProgress: boolean; // Индикатор загрузки прогресса
  startNewGame: () => Promise<void>; // Начать новую игру
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<PlayerData>(defaultPlayerData());
  const [index, setIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("none");
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

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

  // Функция для начала новой игры (сброс прогресса)
  const startNewGame = async () => {
    try {
      // Очищаем локальные данные
      await clearPlayerData();
      
      // Устанавливаем дефолтные значения
      const newPlayerData = defaultPlayerData();
      setPlayer(newPlayerData);
      setIndex(0);
      setIsTypingDone(false);
      setModalType("none");
      
      // Сохраняем дефолтные данные локально
      await savePlayerData(newPlayerData);
      
      // Синхронизируем сброс на сервер (чтобы и на сервере был сброс)
      const { firebaseSync } = await import("../services/firebaseSync");
      await firebaseSync.syncProgress(newPlayerData, true);
      
      console.log("Новая игра начата");
    } catch (error) {
      console.error("Ошибка при начале новой игры:", error);
    }
  };

  useEffect(() => {
    const loadAndSyncProgress = async () => {
      setIsLoadingProgress(true);
      
      try {
        // 1. Загружаем локальные данные
        const localData = await loadPlayerData();
        const localTimestamp = await getLastUpdateTime();

        // 2. Инициализируем Firebase и загружаем серверные данные
        const { firebaseSync } = await import("../services/firebaseSync");
        await firebaseSync.initialize();

        // 3. Загружаем данные с сервера
        const serverProgress = await firebaseSync.loadProgressWithTimestamp();

        // 4. Определяем какие данные использовать (более новые)
        let finalData: PlayerData | null = null;
        let dataSource = "local";

        if (serverProgress && localData) {
          // Сравниваем timestamps
          if (serverProgress.timestamp > (localTimestamp || 0)) {
            // Серверные данные новее
            finalData = serverProgress.data;
            dataSource = "server";
            console.log("Используются серверные данные (новее)");
          } else {
            // Локальные данные новее
            finalData = localData;
            dataSource = "local";
            console.log("Используются локальные данные (новее)");
            // Синхронизируем локальные данные на сервер
            await firebaseSync.syncProgress(localData, true);
          }
        } else if (serverProgress) {
          // Есть только серверные данные
          finalData = serverProgress.data;
          dataSource = "server";
          console.log("Загружены данные с сервера (локальных нет)");
        } else if (localData) {
          // Есть только локальные данные
          finalData = localData;
          dataSource = "local";
          console.log("Используются локальные данные (серверных нет)");
        }

        // 5. Применяем данные
        if (finalData) {
          const mergedData = {
            ...defaultPlayerData(),
            ...finalData,
            choices: {
              ...defaultPlayerData().choices,
              ...finalData.choices,
            },
          };
          setPlayer(mergedData);
          // Сбрасываем индекс диалога при загрузке прогресса
          setIndex(0);
          
          // Если использовали серверные данные, сохраняем их локально
          if (dataSource === "server") {
            await savePlayerData(mergedData);
          }
        } else {
          // Нет данных ни локально, ни на сервере - используем дефолтные
          setPlayer(defaultPlayerData());
          setIndex(0);
        }
      } catch (error) {
        console.error("Ошибка загрузки прогресса:", error);
        // В случае ошибки используем локальные данные или дефолтные
        const localData = await loadPlayerData();
        if (localData) {
          setPlayer({
            ...defaultPlayerData(),
            ...localData,
            choices: {
              ...defaultPlayerData().choices,
              ...localData.choices,
            },
          });
          setIndex(0);
        } else {
          setIndex(0);
        }
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadAndSyncProgress();
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
        isLoadingProgress,
        startNewGame,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
