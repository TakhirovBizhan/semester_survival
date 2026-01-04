import { usePlayer } from "../../context/playerContext";

export const dayChoiceBackgrounds = {
  morning: require("../../../assets/bg/morning.png"), // утро
  beer: require("../../../assets/bg/bar.png"),   // пиво
  university: require("../../../assets/bg/Uni.png"),   // учёба
  charismaSuccess: require("../../../assets/bg/charisma_success.png"),
  charismaFailed: require("../../../assets/bg/charisma_failed.png"),
  intellectSuccess: require("../../../assets/bg/intellect_success.png"),
  IntelectFailed: require("../../../assets/bg/intellect_failed.png"),
  giveUp: require("../../../assets/bg/give_up_class.png"),
  sleep: require("../../../assets/bg/sleep.png"),
  inClass: require("../../../assets/bg/in_class.png")
};

export const useDialogs = () => {
  const { player, setModalType } = usePlayer();

  let dialogs = [
    { text: "День 1", background: dayChoiceBackgrounds.morning },
    { text: "МММ? Что за странный звук? И вообще где я?", background: dayChoiceBackgrounds.morning },
    { text: "Наверное более важный вопрос, кто я?", background: dayChoiceBackgrounds.morning },

    {
      text: "Да... Этот вопрос гораздо важнее, а ведь меня назвали в честь деда, эх как же его звали?", background: dayChoiceBackgrounds.morning,
    },

    { action: () => setModalType("name"), background: dayChoiceBackgrounds.morning },

    { text: `Да точно же! Его звали ${player.name}`, background: dayChoiceBackgrounds.morning },

    { text: "Ну ладно, мне пора вставать, но куда же мне пойти?", background: dayChoiceBackgrounds.morning },

    { action: () => setModalType("firstChoice"), background: dayChoiceBackgrounds.morning },
  ];

  // -------------------------
  // ВЕТВЛЕНИЕ ПО ВЫБОРУ
  // -------------------------

  if (player.lastChoice === "beer") {
    dialogs.push(
      {
        text: "Ты решил пойти в бар и немного расслабиться.",
        background: dayChoiceBackgrounds.beer,
      },

      { text: "Пиво оказалось на удивление вкусным и холодным.", background: dayChoiceBackgrounds.beer, },
      { text: "Ты почувствовал себя лучше, но и немного уставшим.", background: dayChoiceBackgrounds.beer, },
      { text: "Тяжёлый был денек...", background: dayChoiceBackgrounds.sleep, },
      { text: "Всегда можно начать сначала...", background: dayChoiceBackgrounds.sleep, },
    );
  }

  if (player.lastChoice === "study") {
    dialogs.push(
      {
        text: "Ты решил пойти на учебу, но впереди тебя ждёт лабораторная...",
        background: dayChoiceBackgrounds.university,
      },

      { text: "Преподаватель смотрит на тебя строго. Как ты поступишь?", background: dayChoiceBackgrounds.inClass },
      { action: () => setModalType("labChoice"), background: dayChoiceBackgrounds.inClass },
      { text: "Тяжелый был денек...", background: dayChoiceBackgrounds.sleep },
      { text: "Всегда можно начать сначала...", background: dayChoiceBackgrounds.sleep },
    );
  }

  return dialogs;
};