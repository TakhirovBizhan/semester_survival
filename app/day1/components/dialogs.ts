import { usePlayer } from "../../context/playerContext";

export const useDialogs = () => {
  const { player, setModalType } = usePlayer();

  const dialogs = [
    { text: "..." },
    { text: "МММ? Что за странный звук? И вообще где я?" },
    { text: "Наверное более важный вопрос, кто я?" },
    {
      text: "Да... Этот вопрос гораздо важнее, а ведь меня назвали в честь деда, эх как же его звали?",
    },
    {
      action: () => setModalType("name"),
    },
    {
      text: player.name ? `Да точно же! Его звали ${player.name}` : "",
    },
    { text: "Ну ладно, мне пора вставать, но куда же мне пойти?" },
    { action: () => setModalType("firstChoice") },
    { text: "Ты решил пойти на учебу, но впереди тебя ждёт лабораторная..." },
    { text: "Преподаватель смотрит на тебя строго. Как ты поступишь?" },
    { action: () => setModalType("labChoice") },
    { text: "Тяжелый был денек..." },
    { text: "Всегда можно начать сначала..." },
  ];

  return dialogs;
};