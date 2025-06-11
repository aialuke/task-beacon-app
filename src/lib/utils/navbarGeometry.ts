/**
 * Navbar geometry calculation utilities
 * Handles button positioning and bounds calculations
 */

import { logger } from '@/lib/logger';

interface ButtonBounds {
  x: number;
  width: number;
  centerX: number;
}

/**
 * Calculates the position and dimensions of the active button
 * Returns positions relative to the container's full area (including padding)
 */
export function calculateActiveButtonBounds(
  activeIndex: number,
  buttonRefs: (HTMLButtonElement | null)[],
  container: HTMLDivElement | null,
  containerPadding = 8
): ButtonBounds {
  const activeButton = buttonRefs[activeIndex];

  if (!activeButton || !container) {
    logger.debug('Missing activeButton or container');
    return { x: 0, width: 0, centerX: 0 };
  }

  const buttonRect = activeButton.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Calculate position relative to container's full area
  // getBoundingClientRect() already accounts for all CSS layout (gaps, padding, borders)
  const x = buttonRect.left - containerRect.left;
  const width = buttonRect.width;
  const centerX = x + width / 2;

  logger.debug('Button bounds calculated', {
    x,
    width,
    centerX,
    containerPadding,
  });

  return {
    x,
    width,
    centerX,
  };
}

/**
 * Calculates centered position for indicator line
 * Uses transform-based positioning from the button's center
 */
export function calculateIndicatorPosition(
  centerX: number,
  indicatorWidth = 24
): { x: number; width: number } {
  const x = centerX - indicatorWidth / 2;
  logger.debug('Indicator position calculated', { centerX, indicatorWidth, x });

  return {
    x,
    width: indicatorWidth,
  };
}

/**
 * Calculates centered position for glow effect
 * Centers the glow around the button with additional padding
 */
export function calculateGlowPosition(
  bounds: ButtonBounds,
  glowPadding = 8
): { x: number; width: number } {
  const glowWidth = bounds.width + glowPadding * 2;
  const x = bounds.centerX - glowWidth / 2;

  logger.debug('Glow position calculated', {
    bounds,
    glowPadding,
    glowWidth,
    x,
  });

  return {
    x,
    width: glowWidth,
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
