// Простой компонент-анимация "приветствие рукой" 👋

import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        // Анимация поворота (как будто машет рукой)
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4, // повторить 4 раза
        animationDuration: '300ms', // длительность
      }}>
      👋
    </Animated.Text>
  );
}