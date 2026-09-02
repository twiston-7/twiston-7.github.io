export interface ColorAnimationState {
  current: [number, number, number];
  target: [number, number, number];
  isInitialized: boolean;
}

export function createColorAnimationState(): ColorAnimationState {
  return {
    current: [0, 0, 0],
    target: [0, 0, 0],
    isInitialized: false,
  };
}

export function randomSafeColor(): [number, number, number] {
  let r, g, b;
  do {
    const min = 0.15;
    const max = 0.65;
    r = min + Math.random() * (max - min);
    g = min + Math.random() * (max - min);
    b = min + Math.random() * (max - min);
  } while ((r + g > 1.0 && b < 0.3) || (Math.abs(r - g) < 0.15 && b < 0.3));
  return [r, g, b];
}

export function updateColorAnimation(
  state: ColorAnimationState,
  deltaTime: number,
  transitionTime: number = 120
) {
  if (!state.isInitialized) {
    state.current = randomSafeColor();
    state.target = randomSafeColor();
    state.isInitialized = true;
  }

  const t = deltaTime / transitionTime;
  for (let i = 0; i < 3; i++) {
    state.current[i] += (state.target[i] - state.current[i]) * t;
  }

  const dist = Math.sqrt(
    (state.current[0] - state.target[0]) ** 2 +
    (state.current[1] - state.target[1]) ** 2 +
    (state.current[2] - state.target[2]) ** 2
  );

  if (dist < 0.02) {
    state.target = randomSafeColor();
  }
}
