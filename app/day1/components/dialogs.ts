import { usePlayer } from "../../context/playerContext";

export const day1ChoiceBackgrounds = {
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
    { text: "День 1", background: day1ChoiceBackgrounds.morning },
    { text: "МММ? Что за странный звук? И вообще где я?", background: day1ChoiceBackgrounds.morning },
    { text: "Наверное более важный вопрос, кто я?", background: day1ChoiceBackgrounds.morning },

    {
      text: "Да... Этот вопрос гораздо важнее, а ведь меня назвали в честь деда, эх как же его звали?", background: day1ChoiceBackgrounds.morning,
    },

    { action: () => setModalType("name"), background: day1ChoiceBackgrounds.morning },

    { text: `Да точно же! Его звали ${player.name}`, background: day1ChoiceBackgrounds.morning },

    { text: "Ну ладно, мне пора вставать, но куда же мне пойти?", background: day1ChoiceBackgrounds.morning },

    { action: () => setModalType("firstChoice"), background: day1ChoiceBackgrounds.morning },
  ];

  // -------------------------
  // ВЕТВЛЕНИЕ ПО ВЫБОРУ
  // -------------------------

  if (player.lastChoice === "beer") {
    dialogs.push(
      {
        text: "Ты решил пойти в бар и немного расслабиться.",
        background: day1ChoiceBackgrounds.beer,
      },
  
      { text: "Пиво оказалось на удивление вкусным и холодным.", background: day1ChoiceBackgrounds.beer, },
      { text: "Ты почувствовал себя лучше, но и немного уставшим.", background: day1ChoiceBackgrounds.beer, },
      { text: "Тяжёлый был денек...", background: day1ChoiceBackgrounds.sleep,},
      { text: "Всегда можно начать сначала...", background: day1ChoiceBackgrounds.sleep, },
    );
  }
  
  if (player.lastChoice === "study") {
    dialogs.push(
      {
        text: "Ты решил пойти на учебу, но впереди тебя ждёт лабораторная...",
        background: day1ChoiceBackgrounds.university,
      },
  
      { text: "Преподаватель смотрит на тебя строго. Как ты поступишь?", background: day1ChoiceBackgrounds.inClass },
      { action: () => setModalType("labChoice"), background: day1ChoiceBackgrounds.university },
      { text: "Тяжелый был денек...", background: day1ChoiceBackgrounds.sleep},
      { text: "Всегда можно начать сначала...", background: day1ChoiceBackgrounds.sleep },
    );
  }

  return dialogs;
};