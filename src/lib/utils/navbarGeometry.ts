
/**
 * Navbar geometry calculation utilities
 * Handles button positioning and bounds calculations
 */

interface ButtonBounds {
  x: number;
  width: number;
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
    return { x: 0, width: 0 };
  }

  const buttonRect = activeButton.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  return {
    x: buttonRect.left - containerRect.left - containerPadding,
    width: buttonRect.width
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
