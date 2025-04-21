import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../theme/ThemeContext';

const Root_layout = () => {
  return (
    <ThemeProvider>
    <Stack>
    <Stack.Screen name='index' options={{ headerShown: false }} />
    <Stack.Screen name='(auth)' options={{ headerShown: false }} />
    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    <Stack.Screen name='(screens)/addNewCard' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/bookSlot' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/extendParking' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/parkingDetails' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/parkingSlot' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/payment' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/receipt' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/review' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/timer' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/vehicle' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/wallet' options={{headerShown: false}} />
    <Stack.Screen name='(screens)/addVehicle' options={{headerShown: false}} />

    </Stack>
  </ThemeProvider>
  )
}

export default Root_layout;

const styles = StyleSheet.create({})