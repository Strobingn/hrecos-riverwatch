// ============================================================================
// HRECOS RiverWatch - Theme Context
// Provides dark/light mode management with AsyncStorage persistence
// ============================================================================

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS, SPACING, FONTS, RADIUS, DARK_THEME } from '../theme';

const THEME_STORAGE_KEY = '@hrecos_theme_preference';

const ThemeContext = createContext(null);

/**
 * ThemeProvider - Wraps the app and provides theme state to all children.
 */
export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    let cancelled = false;

    async function loadThemePreference() {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!cancelled) {
          if (saved !== null) {
            setIsDark(saved === 'dark');
          } else {
            setIsDark(systemColorScheme === 'dark');
          }
          setIsLoaded(true);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
        if (!cancelled) {
          setIsDark(systemColorScheme === 'dark');
          setIsLoaded(true);
        }
      }
    }

    loadThemePreference();

    return () => {
      cancelled = true;
    };
  }, [systemColorScheme]);

  // Persist theme preference whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light').catch((error) => {
        console.warn('Failed to save theme preference:', error);
      });
    }
  }, [isDark, isLoaded]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setDarkMode = useCallback((value) => {
    setIsDark(!!value);
  }, []);

  const theme = useMemo(() => ({
    colors: isDark ? DARK_THEME : COLORS,
    shadows: SHADOWS,
    spacing: SPACING,
    fonts: FONTS,
    radius: RADIUS,
    isDark,
  }), [isDark]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setDarkMode,
    }),
    [theme, isDark, toggleTheme, setDarkMode]
  );

  if (!isLoaded) {
    // Render a neutral placeholder instead of null so the native splash screen
    // can be dismissed and React doesn't leave the app in a blank state.
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
});

export { useTheme } from '../hooks/useTheme';

export default ThemeContext;
