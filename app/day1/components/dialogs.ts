import { usePlayer } from "../../context/playerContext";

export const day1ChoiceBackgrounds = {
  morning: require("../../../assets/bg/day1/1.png"), // утро
  beer: require("../../../assets/bg/day1/bar.png"),   // пиво
  university: require("../../../assets/bg/day1/Uni.png"),   // учёба
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
      { text: "Тяжёлый был денек...", background: day1ChoiceBackgrounds.beer,},
      { text: "Всегда можно начать сначала...", background: day1ChoiceBackgrounds.beer, },
    );
  }
  
  if (player.lastChoice === "study") {
    dialogs.push(
      {
        text: "Ты решил пойти на учебу, но впереди тебя ждёт лабораторная...",
        background: day1ChoiceBackgrounds.university,
      },
  
      { text: "Преподаватель смотрит на тебя строго. Как ты поступишь?", background: day1ChoiceBackgrounds.university },
      { action: () => setModalType("labChoice"), background: day1ChoiceBackgrounds.university },
      { text: "Тяжелый был денек...", background: day1ChoiceBackgrounds.university},
      { text: "Всегда можно начать сначала...", background: day1ChoiceBackgrounds.university },
    );
  }

  return dialogs;
};