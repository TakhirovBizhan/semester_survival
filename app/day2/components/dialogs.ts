import { DialogItem } from "@/app/types/DialogItem.types";
import { useMemo } from "react";
import { usePlayer } from "../../context/playerContext";

export const dayChoiceBackgrounds = {
  morning: require("../../../assets/bg/morning.png"), // утро
  beer: require("../../../assets/bg/bar.png"),   // пиво
  university: require("../../../assets/bg/Uni.png"),   // учёба
  charismaSuccess: require("../../../assets/bg/charisma_success.png"),
  charismaFailed: require("../../../assets/bg/charisma_failed.png"),
  intellectSuccess: require("../../../assets/bg/intellect_success.png"),
  intellectFailed: require("../../../assets/bg/intellect_failed.png"),
  giveUp: require("../../../assets/bg/give_up_class.png"),
  sleep: require("../../../assets/bg/sleep.png"),
  inClass: require("../../../assets/bg/in_class.png")
};
export const useDialogs = (): DialogItem[] => {
  const { player, setModalType } = usePlayer();

  return useMemo(() => {
    const intro: DialogItem[] = [
      { text: "День 2", background: dayChoiceBackgrounds.morning },
      { text: "О нет... Опять...", background: dayChoiceBackgrounds.morning },
      {
        text: "Вставать? Ну уж нет. Лучшая часть дня — это когда ты проснулся, но мир тебя еще не достал",
        background: dayChoiceBackgrounds.morning,
      },
      {
        text: "Ну ладно, мне пора вставать, но куда же мне пойти?",
        background: dayChoiceBackgrounds.morning,
      },
      { action: () => setModalType("firstChoice"), background: dayChoiceBackgrounds.morning },
    ];

    const beerBranch: DialogItem[] =
      player.lastChoice === "beer"
        ? [
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer },
          { text: "Пиво оказалось на удивление вкусным и холодным.", background: dayChoiceBackgrounds.beer },
          { text: "Ты почувствовал себя лучше, но и немного уставшим.", background: dayChoiceBackgrounds.beer },
        ]
        : [];

    const studyBranch: DialogItem[] =
      player.lastChoice === "study"
        ? [
          {
            text: "Ты решил пойти на учебу, но впереди тебя ждёт лабораторная...",
            background: dayChoiceBackgrounds.university,
          },
          {
            text: "Преподаватель смотрит на тебя строго. Как ты поступишь?",
            background: dayChoiceBackgrounds.inClass,
          },
          { action: () => setModalType("labChoice"), background: dayChoiceBackgrounds.inClass },
        ]
        : [];

    const intellectBranch: DialogItem[] =
      player.lastChoice === "intellect"
        ? [
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: player.isLastChoiceSuccess
              ? "Ты использовал интеллект и смог правильно ответить!"
              : "Эх, значит на завод...",
            background: player.isLastChoiceSuccess
              ? dayChoiceBackgrounds.intellectSuccess
              : dayChoiceBackgrounds.intellectFailed,
          },
        ]
        : [];

    const charismaBranch: DialogItem[] =
      player.lastChoice === "charisma"
        ? [
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: player.isLastChoiceSuccess
              ? "Ты использовал харизму и смог убедить преподавателя!"
              : "Фу, ну ты и крип!",
            background: player.isLastChoiceSuccess
              ? dayChoiceBackgrounds.charismaSuccess
              : dayChoiceBackgrounds.charismaFailed,
          },
        ]
        : [];

    const giveUpBranch: DialogItem[] =
      player.lastChoice === "giveUp"
        ? [
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          { text: "Ты решил пойти в бар и немного расслабиться.", background: dayChoiceBackgrounds.beer }, // затычка
          {
            text: "Миссис Блэк меня наругала за то что я молча просидел на паре...",
            background: dayChoiceBackgrounds.giveUp,
          },
        ]
        : [];

    const ending: DialogItem[] = [
      { text: "Тяжелый был денек...", background: dayChoiceBackgrounds.sleep },
      { text: "Всегда можно начать сначала...", background: dayChoiceBackgrounds.sleep },
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