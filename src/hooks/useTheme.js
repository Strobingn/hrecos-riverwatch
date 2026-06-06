/**
 * useTheme Hook
 *
 * Simple convenience hook that wraps the ThemeContext for easy access
 * to theme colors, dark mode state, and theme toggle functionality
 * throughout the HRECOS RiverWatch app.
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook for accessing the app's theme context.
 *
 * @returns {Object} Theme object containing colors, spacing, fonts, shadows,
 *   radius, isDark, plus toggleTheme/setDarkMode helpers. Also exposes a
 *   `theme` alias so both `const theme = useTheme()` and `const { theme } = useTheme()`
 *   work correctly.
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined || context === null) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
        'Wrap your component tree with <ThemeProvider> from ../context/ThemeContext.'
    );
  }

  // Flatten the theme object for convenient direct access (theme.colors)
  // while preserving the nested `theme` alias for destructuring compatibility.
  return {
    theme: context.theme,
    ...context.theme,
    toggleTheme: context.toggleTheme,
    setDarkMode: context.setDarkMode,
  };
}

export default useTheme;
