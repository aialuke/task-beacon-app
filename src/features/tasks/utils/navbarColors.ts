/**
 * Navbar color computation utilities
 * Handles theme-aware color calculations for navbar components
 * 
 * Phase 1 Fix: Moved from lib/utils to establish clear feature boundaries
 */

interface NavbarColors {
  primary: string;
  primaryWithOpacity: string;
  primaryLight: string;
  primaryVeryLight: string;
  primaryGlow: string;
  indicatorColor: string;
  highlightColor: string;
  isDarkMode: boolean;
}

/**
 * Computes color variations based on CSS custom properties and theme
 */
export function computeNavbarColors(): NavbarColors {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const isDarkMode = root.classList.contains('dark');

  // Get the primary color HSL values
  const primaryHSL = computedStyle.getPropertyValue('--primary').trim();

  if (primaryHSL) {
    // Convert HSL to RGB for better control
    const tempDiv = document.createElement('div');
    tempDiv.style.color = `hsl(${primaryHSL})`;
    document.body.appendChild(tempDiv);
    const rgbColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // Extract RGB values to create variations
    const rgbMatch = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;

      return {
        primary: `rgb(${r}, ${g}, ${b})`,
        primaryWithOpacity: `rgba(${r}, ${g}, ${b}, 0.8)`,
        primaryLight: `rgba(${r}, ${g}, ${b}, 0.2)`,
        primaryVeryLight: `rgba(${r}, ${g}, ${b}, 0.1)`,
        primaryGlow: `rgba(${r}, ${g}, ${b}, 0.3)`,
        indicatorColor: isDarkMode ? 'hsl(0 0% 100% / 1)' : 'hsl(0 0% 98% / 1)',
        highlightColor: isDarkMode ? 'hsl(0 0% 10%)' : 'hsl(240 5.9% 10%)',
        isDarkMode,
      };
    }
  }

  // Fallback colors
  return {
    primary: '#3662E3',
    primaryWithOpacity: 'rgba(54, 98, 227, 0.8)',
    primaryLight: 'rgba(54, 98, 227, 0.2)',
    primaryVeryLight: 'rgba(54, 98, 227, 0.1)',
    primaryGlow: 'rgba(54, 98, 227, 0.3)',
    indicatorColor: isDarkMode ? 'hsl(0 0% 100% / 1)' : 'hsl(0 0% 98% / 1)',
    highlightColor: isDarkMode ? 'hsl(0 0% 10%)' : 'hsl(240 5.9% 10%)',
    isDarkMode: false,
  };
}

/**
 * Sets up a theme change observer for color updates
 */
export function setupThemeObserver(callback: () => void): () => void {
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        // Small delay to ensure CSS is applied
        await new Promise(resolve => setTimeout(resolve, 50));
        callback();
        break; // Only call callback once per batch of mutations
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true });

  return () => { observer.disconnect(); };
} 