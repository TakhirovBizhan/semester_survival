import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PlayerData {
  currentDay: number;
  name: string;
  happiness: number;
  academic: number;
  choices: {
    beers: number;      // сколько раз выбрал "пиво"
    studies: number;    // сколько раз выбрал "учёбу"
    charisma: number;   // выбор "харизма"
    intellect: number;  // выбор "интеллект"
    giveUp: number;  // выбор "сдаться"
  };
  lastChoice: "beer" | "giveUp" | "study" | "intellect" | "charisma" | "";
  isLastChoiceSuccess?: boolean;
}

/** ключ для хранения в AsyncStorage */
const STORAGE_KEY = "playerData";

/** сохранить данные игрока */
export async function savePlayerData(data: PlayerData): Promise<void> {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error("Ошибка сохранения данных игрока:", e);
  }
}

/** загрузить данные игрока */
export async function loadPlayerData(): Promise<PlayerData | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as PlayerData) : null;
  } catch (e) {
    console.error("Ошибка загрузки данных игрока:", e);
    return null;
  }
}

/** очистить данные (например, при рестарте игры) */
export async function clearPlayerData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Ошибка удаления данных игрока:", e);
  }
}

/** создать игрока по умолчанию */
export function defaultPlayerData(): PlayerData {
  return {
    currentDay: 1,
    name: "",
    happiness: 50,
    academic: 50,
    choices: {
      beers: 0,
      studies: 0,
      charisma: 0,
      intellect: 0,
      giveUp: 0,
    },
    lastChoice: "",
  };
}

