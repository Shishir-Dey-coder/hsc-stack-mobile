import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "Light" | "Dark" | "System";

const STORAGE_KEY = "@hscstack_theme";

const lightColors = {
  background: "#F8F9FC",
  surface: "#FFFFFF",
  text: "#202033",
  textMuted: "#777B8A",
  textmuted: "#777B8A",
  border: "#EEEEF4",
  primary: "#6C4DFF",
  softPrimary: "#F0ECFF",
  danger: "#DC4444",
  dangerBackground: "#FFF0F0",
  tabBar: "#FFFFFF",
  tabInactive: "#9295A3",
  inputBackground: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.04)",
};

const darkColors = {
  background: "#111118",
  surface: "#1C1C27",
  text: "#F4F3FC",
  textMuted: "#AAA9BC",
  textmuted: "#AAA9BC",
  border: "#30303E",
  primary: "#A394FF",
  softPrimary: "#30284D",
  danger: "#FF7777",
  dangerBackground: "#42252C",
  tabBar: "#1C1C27",
  tabInactive: "#9292A8",
  inputBackground: "#252532",
  overlay: "rgba(255, 255, 255, 0.05)",
};

export type ThemeColors = typeof lightColors;

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
  colors: ThemeColors;
  isThemeLoaded: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] =
    useState<ThemeMode>("System");

  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

        if (!mounted) return;

        if (
          savedTheme === "Light" ||
          savedTheme === "Dark" ||
          savedTheme === "System"
        ) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      } finally {
        if (mounted) {
          setIsThemeLoaded(true);
        }
      }
    };

    void loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = useCallback(
    async (mode: ThemeMode): Promise<void> => {
      // Update the UI immediately.
      setThemeModeState(mode);

      try {
        await AsyncStorage.setItem(STORAGE_KEY, mode);
      } catch (error) {
        console.warn("Failed to save theme preference:", error);
      }
    },
    []
  );

  const isDark =
    themeMode === "System"
      ? systemScheme === "dark"
      : themeMode === "Dark";

  const colors = useMemo<ThemeColors>(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const value = useMemo<ThemeContextType>(
    () => ({
      themeMode,
      setThemeMode,
      isDark,
      colors,
      isThemeLoaded,
    }),
    [
      themeMode,
      setThemeMode,
      isDark,
      colors,
      isThemeLoaded,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useAppTheme must be used inside ThemeProvider."
    );
  }

  return context;
}