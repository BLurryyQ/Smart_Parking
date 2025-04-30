import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '../theme/ThemeContext';

SplashScreen.preventAutoHideAsync();

const Root_layout = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat_500Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat_700Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat_600SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Roboto_400Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto_700Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/addNewCard" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/bookSlot" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/extendParking" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/parkingDetails" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/parkingSlot" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/payment" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/receipt" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/review" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/timer" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/vehicle" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/wallet" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)/addVehicle" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
  );
};

export default Root_layout;

const styles = StyleSheet.create({});
