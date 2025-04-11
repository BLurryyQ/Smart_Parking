import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {Stack} from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
    <Stack.Screen name='createAccount' options={{headerShown: false}} />
    <Stack.Screen name='verification' options={{headerShown: false}} />
    <Stack.Screen name='login' options={{headerShown: false}} />
    <Stack.Screen name='location' options={{headerShown: false}} />
    <Stack.Screen name='manualLocation' options={{headerShown: false}} />
    </Stack>
  )
}

export default AuthLayout;

const styles = StyleSheet.create({})