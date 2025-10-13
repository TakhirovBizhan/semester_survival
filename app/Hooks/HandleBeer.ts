import { usePlayer } from "../context/playerContext";

export const useHandleBeer = () => {
  const { player, updatePlayer, setModalType, setIndex, setIsTypingDone, index } = usePlayer();

  const handleBeer = async () => {
    await updatePlayer({
      happiness: Math.min(player.happiness + 20, 100),
      academic: Math.max(player.academic - 20, 0),
      choices: {
        ...player.choices,
        beers: player.choices.beers + 1,
      },
      lastChoice: "beer",
    });

    setModalType("none");
    setIndex(index + 2);
    setIsTypingDone(false);
  };

  return handleBeer;
};