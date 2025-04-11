
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const lightTheme = {
  background: '#FFFFFF',
  color: '#000000',
  color2: 'rgba(0,0,0,.2)',
  log: '#FE1717',
  text: '#000000',
  coloring: '#ffffff',
  cardbg: '#f6f6f6',
  card: '#f6f6f6',
  card2: '#F6F6F6',
  overlay:  'rgba(0, 0, 0, 0.4)',
  bordercolor: '#1C31A5',
};

const darkTheme = {
  background: '#000000',
  color: '#FFFFFF',
  color2: '#ffffff',
  log: '#FE1717',
  text: '#BABABA',
  coloring: '#333333',
  cardbg: '#333333',
  card: '#757575',
  card2: 'rgba(238, 238, 238, 0.1)',
  overlay: 'rgba(255, 255, 255, 0.4)',
  bordercolor: '#FF6F6C',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadDarkModeState = async () => {
      try {
        const darkModeState = await AsyncStorage.getItem("darkMode");
        if (darkModeState !== null) {
          const parsedState = JSON.parse(darkModeState);
          setDarkMode(parsedState.darkMode);
          setTheme(parsedState.darkMode ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error("Error loading dark mode state:", error);
      }
    };

    loadDarkModeState();
  }, []);

  const toggleTheme = async () => {
    try {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      setTheme(newDarkMode ? darkTheme : lightTheme);
      await AsyncStorage.setItem("darkMode", JSON.stringify({ darkMode: newDarkMode }));
    } catch (error) {
      console.error("Error saving dark mode state:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
