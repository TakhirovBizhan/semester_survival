// import { useEffect, useRef } from "react";
// import { Platform } from "react-native";

// type Props = {
//   volume?: number;
// };

// export const BackgroundMusic = ({ volume = 1 }: Props) => {
//   const soundRef = useRef<any>(null);

//   useEffect(() => {
//     // Для веба используем HTMLAudioElement
//     if (Platform.OS === "web") {
//       const audio = new Audio("/music/day1.mp3"); // путь в public/music
//       audio.loop = true;
//       audio.volume = volume;
//       audio.play().catch(() => console.log("Can't autoplay in browser"));
//       soundRef.current = audio;

//       return () => audio.pause(); // останавливаем при размонтировании
//     }

//     // Для мобильных платформ динамически импортируем expo-av
//     let isMounted = true;
//     (async () => {
//       if (!isMounted) return;
//     //   const { Audio } = await import("expo-av");
//       const { sound } = await Audio.Sound.createAsync(
//         require("../../music/day1.mp3"),
//         { shouldPlay: true, isLooping: true, volume }
//       );
//       soundRef.current = sound;
//     })();

//     return () => {
//       isMounted = false;
//       soundRef.current?.unloadAsync?.();
//     };
//   }, [volume]);

//   return null;
// };
