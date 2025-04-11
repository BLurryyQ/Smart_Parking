import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Mail from '../../assets/images/mail.svg';
import Lock from '../../assets/images/lock.svg';
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import Input from '../../components/Input/Input';
import Password from '../../components/Password/Password';

const Login = () => {
  const { theme, darkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/mobile-auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('username', data.username);

        Alert.alert("Login Successful", `Welcome, ${data.username}`);
        router.push('location');
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.heading, { color: theme.color }]}>Login Account</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
          <View style={styles.column}>
            <Text style={styles.head_text}>
              Login to access your personalized parking experience anytime, anywhere.
            </Text>

            <View style={styles.inputContainer}>
              <Input
                  label="Email or Username"
                  placeholder="example@gmail.com"
                  Icon={Mail}
                  value={username}
                  onChangeText={setUsername}
              />
              <Password
                  label="Password"
                  placeholder="Enter your password"
                  Icon={Lock}
                  passwordVisible={passwordVisible}
                  setPasswordVisible={setPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
              />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <Button buttonText="Login" onPress={handleLogin} />
            )}

            <Text style={[styles.bottom_text, { color: theme.color }]}>
              Don’t have an account yet?
              <Link href="/createAccount" style={styles.link}> Register</Link>
            </Text>
          </View>
        </ScrollView>
      </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  scrolls: {
    flexGrow: 1,
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 26,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
  },
  head_text: {
    fontSize: 14,
    color: '#757575',
    marginVertical: 10,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 26,
  },
  bottom_text: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: '10%',
  },
  link: {
    color: '#FF95AE',
  },
});