
/**
 * Navbar geometry calculation utilities
 * Handles button positioning and bounds calculations
 */

interface ButtonBounds {
  x: number;
  width: number;
  centerX: number;
}

/**
 * Calculates the position and dimensions of the active button
 */
export function calculateActiveButtonBounds(
  activeIndex: number,
  buttonRefs: (HTMLButtonElement | null)[],
  container: HTMLDivElement | null,
  containerPadding: number = 8
): ButtonBounds {
  const activeButton = buttonRefs[activeIndex];

  if (!activeButton || !container) {
    return { x: 0, width: 0, centerX: 0 };
  }

  const buttonRect = activeButton.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const x = buttonRect.left - containerRect.left - containerPadding;
  const centerX = x + buttonRect.width / 2;

  return {
    x,
    width: buttonRect.width,
    centerX,
  };
}

/**
 * Calculates centered position for indicator line
 */
export function calculateIndicatorPosition(
  centerX: number,
  indicatorWidth: number = 24
): { x: number; width: number } {
  return {
    x: centerX - indicatorWidth / 2,
    width: indicatorWidth,
  };
}

/**
 * Calculates centered position for glow effect
 */
export function calculateGlowPosition(
  bounds: ButtonBounds,
  glowPadding: number = 8
): { x: number; width: number } {
  return {
    x: bounds.centerX - (bounds.width + glowPadding * 2) / 2,
    width: bounds.width + glowPadding * 2,
  };
}

/**
 * Updates button references array safely
 */
export function setButtonRef(
  refs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  index: number,
  element: HTMLButtonElement | null
): void {
  refs.current[index] = element;
}
