import { DialogItem } from "@/app/types/DialogItem.types";
import { useMemo } from "react";
import { usePlayer } from "../../context/playerContext";

export const dayChoiceBackgrounds = {
  morning: require("../../../assets/bg/morning.png"),
  beer: require("../../../assets/bg/bar.png"),
  university: require("../../../assets/bg/Uni.png"),
  charismaSuccess: require("../../../assets/bg/charisma_success.png"),
  charismaFailed: require("../../../assets/bg/charisma_failed.png"),
  intellectSuccess: require("../../../assets/bg/intellect_success.png"),
  intellectFailed: require("../../../assets/bg/intellect_failed.png"),
  giveUp: require("../../../assets/bg/give_up_class.png"),
  sleep: require("../../../assets/bg/sleep.png"),
  inClass: require("../../../assets/bg/in_class.png"),
};

export const useDialogs = (): DialogItem[] => {
  const { player, setModalType } = usePlayer();

  return useMemo(() => {
    const intro: DialogItem[] = [
      { text: "День 3", background: dayChoiceBackgrounds.morning },
      { text: "Будильник снова победил.", background: dayChoiceBackgrounds.morning },
      {
        text: "Где-то глубоко внутри ты надеялся, что сегодня он не зазвонит.",
        background: dayChoiceBackgrounds.morning,
      },
      {
        text: "Но нет. Мир стабилен в своем желании тебя достать.",
        background: dayChoiceBackgrounds.morning,
      },
      {
        text: "Так… и какие у меня сегодня планы на саморазрушение?",
        background: dayChoiceBackgrounds.morning,
      },
      { action: () => setModalType("firstChoice"), background: dayChoiceBackgrounds.morning },
    ];

    const beerBranch: DialogItem[] =
      player.lastChoice === "beer"
        ? [
          {
            text: "Бар встретил тебя как старого знакомого.",
            background: dayChoiceBackgrounds.beer,
          },
          {
            text: "Бармен даже ничего не спросил. Это слегка настораживает.",
            background: dayChoiceBackgrounds.beer,
          },
          {
            text: "Пиво всё ещё холодное. Хотя бы что-то в этом мире работает.",
            background: dayChoiceBackgrounds.beer,
          },
        ]
        : [];

    const studyBranch: DialogItem[] =
      player.lastChoice === "study"
        ? [
          {
            text: "Ты идёшь на учебу, мысленно готовясь к худшему.",
            background: dayChoiceBackgrounds.university,
          },
          {
            text: "Аудитория. Тот самый взгляд преподавателя. Да, он тебя помнит.",
            background: dayChoiceBackgrounds.inClass,
          },
          {
            text: "Кажется, сейчас будет проверка на прочность.",
            background: dayChoiceBackgrounds.inClass,
          },
          { action: () => setModalType("labChoice"), background: dayChoiceBackgrounds.inClass },
        ]
        : [];

    const intellectBranch: DialogItem[] =
      player.lastChoice === "intellect"
        ? [
          { text: "Ты делаешь умный вид.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Очень умный. Прямо подозрительно.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Очень умный. Прямо подозрительно.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: player.isLastChoiceSuccess
              ? "Логика, факты, формулы… Ого. Это реально сработало."
              : "Мысли были умные, но не в ту сторону.",
            background: player.isLastChoiceSuccess
              ? dayChoiceBackgrounds.intellectSuccess
              : dayChoiceBackgrounds.intellectFailed,
          },
        ]
        : [];

    const charismaBranch: DialogItem[] =
      player.lastChoice === "charisma"
        ? [
          { text: "Ты собираешь всю харизму, что у тебя есть.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Её не так много, но выбора нет.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Очень умный. Прямо подозрительно.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: player.isLastChoiceSuccess
              ? "Пару фраз — и преподаватель уже улыбается. Магия?"
              : "Молчание. Неловкость. Ты перегнул.",
            background: player.isLastChoiceSuccess
              ? dayChoiceBackgrounds.charismaSuccess
              : dayChoiceBackgrounds.charismaFailed,
          },
        ]
        : [];

    const giveUpBranch: DialogItem[] =
      player.lastChoice === "giveUp"
        ? [
          { text: "Ты просто сидишь и смотришь в стол.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Иногда игнорирование — тоже стратегия. Плохая, но стратегия.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: "Преподаватель разочарован. И, честно говоря, ты тоже.",
            background: dayChoiceBackgrounds.giveUp,
          },
        ]
        : [];

    const ending: DialogItem[] = [
      {
        text: "Третий день подряд. Уже начинаешь привыкать.",
        background: dayChoiceBackgrounds.sleep,
      },
      {
        text: "Интересно, а станет ли когда-нибудь легче?",
        background: dayChoiceBackgrounds.sleep,
      },
    ];

    return [
      ...intro,
      ...beerBranch,
      ...studyBranch,
      ...intellectBranch,
      ...charismaBranch,
      ...giveUpBranch,
      ...ending,
    ];
  }, [player.lastChoice, player.isLastChoiceSuccess, setModalType]);
};