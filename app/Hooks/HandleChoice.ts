import { usePlayer } from "../context/playerContext";

type LabType = "intellect" | "charisma" | "giveUp";

export const useHandleLabChoice = () => {
  const { player, updatePlayer, setModalType, setIndex, setIsTypingDone, index } = usePlayer();

  const handleLabChoice = async (type: LabType, answer?: boolean) => {
    const newChoices = { ...player.choices };
    newChoices[type === "giveUp" ? "giveUp" : type] += 1;

    if (type === "giveUp") {
      await updatePlayer({
        happiness: Math.max(player.happiness - 10, 0),
        academic: Math.max(player.academic - 10, 0),
        choices: newChoices,
        lastChoice: "giveUp",
      });
    } else if (type === "charisma") {
      await updatePlayer({
        ...(answer
          ? {
            academic: Math.min(player.academic + 10, 100),
            happiness: Math.min(player.happiness + 5, 100),
          }
          : {
            academic: Math.max(player.academic - 20, 0),
            happiness: Math.max(player.happiness - 20, 0),
          }),
        choices: newChoices,
        lastChoice: "charisma",
        isLastChoiceSuccess: answer
      });
    } else if (type === "intellect") {
      await updatePlayer({
        ...(answer
          ? {
            academic: Math.min(player.academic + 10, 100),
            happiness: Math.min(player.happiness - 5, 100),
          }
          : {
            academic: Math.max(player.academic - 20, 0),
            happiness: Math.max(player.happiness - 20, 0),
          }),
        choices: newChoices,
        lastChoice: "intellect",
        isLastChoiceSuccess: answer
      });
    } else {
      console.error("Unknown lab choice type:", type);
    }

    setModalType("none");
    setIndex(index + 1);
    setIsTypingDone(false);
  };

  return handleLabChoice;
};
