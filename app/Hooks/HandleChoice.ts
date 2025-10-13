import { usePlayer } from "../context/playerContext";

type LabType = "intellect" | "charisma" | "giveUp";

export const useHandleLabChoice = () => {
  const { player, updatePlayer, setModalType, setIndex, setIsTypingDone, index } = usePlayer();

  const handleLabChoice = async (type: LabType) => {
    const newChoices = { ...player.choices };
    newChoices[type === "giveUp" ? "giveUp" : type] += 1;

    if (type === "giveUp") {
      await updatePlayer({
        happiness: Math.max(player.happiness - 10, 0),
        academic: Math.max(player.academic - 10, 0),
        choices: newChoices,
        lastChoice: "giveUp",
      });
    } else {
      await updatePlayer({
        academic: Math.min(player.academic + 10, 100),
        happiness:
          type === "charisma"
            ? Math.min(player.happiness + 5, 100)
            : player.happiness,
        choices: newChoices,
        lastChoice: type,
      });
    }

    setModalType("none");
    setIndex(index + 1);
    setIsTypingDone(false);
  };

  return handleLabChoice;
};
