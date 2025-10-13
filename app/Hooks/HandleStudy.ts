import { usePlayer } from "../context/playerContext";

export const useHandleStudy = () => {
  const { player, updatePlayer, setModalType, setIndex, setIsTypingDone, index } = usePlayer();

  const handleStudy = async () => {
    await updatePlayer({
      happiness: Math.max(player.happiness - 5, 0),
      choices: {
        ...player.choices,
        studies: player.choices.studies + 1,
      },
      lastChoice: "study",
    });

    setModalType("none");
    setIndex(index + 1);
    setIsTypingDone(false);
  };

  return handleStudy;
};