import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar, Animated, TouchableOpacity, Image, Platform } from "react-native";
import { pages } from "../Data/Data";
import { router } from "expo-router";
import Button from "../components/Button/Button";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_500Medium, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Pagination from "../components/Pagination/Pagination";
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import ThemeContext from "../theme/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { theme, darkMode } = useContext(ThemeContext);
  const swiperRef = useRef(null);
  const totalPages = pages.length;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Montserrat_400Regular,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isCheckingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isCheckingLogin]);

  const headingOpacity = useRef(new Animated.Value(1)).current;
  const descriptionOpacity = useRef(new Animated.Value(1)).current;
  const paginationOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const username = await AsyncStorage.getItem('username');
      const seenIntro = await AsyncStorage.getItem('seenIntro');

      if (userId && username) {
        router.replace('location');
      } else if (seenIntro) {
        router.replace('login');
      } else {
        setShowIntro(true);
      }
      setIsCheckingLogin(false);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isCheckingLogin && showIntro) {
      animateContent();
    }
  }, [activePageIndex, fontsLoaded, isCheckingLogin, showIntro]);

  const animateContent = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headingOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(descriptionOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(headingOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(descriptionOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ])
    ]).start();
  };

  const handleImageScroll = (event) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActivePageIndex(pageIndex);
  };

  const handleNextPress = async () => {
    const nextIndex = Math.min(activePageIndex + 1, totalPages - 1);
    swiperRef.current.scrollTo({ x: nextIndex * width, animated: true });
    setActivePageIndex(nextIndex);

    if (nextIndex === totalPages - 1) {
      await AsyncStorage.setItem('seenIntro', 'true');
    }
  };

  if (!fontsLoaded || isCheckingLogin || !showIntro) {
    return null;
  }

  return (
      <View style={[styles.safearea, { backgroundColor: theme.background }]} onLayout={onLayoutRootView}>
        <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={darkMode ? "light-content" : "dark-content"}
        />
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={swiperRef}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ width: width * totalPages }}
            style={{ flex: 1 }}
        >
          {pages.map((page, index) => (
              <View key={index} style={[styles.page, { width }]}>
                <Image source={page.image} alt="images" style={styles.image} />
              </View>
          ))}
        </ScrollView>
        <View style={styles.onboard_content}>
          <Animated.Text style={[[styles.heading, { color: theme.color }], { opacity: headingOpacity }]}>
            {pages[activePageIndex].heading}
          </Animated.Text>
          <Animated.Text style={[styles.description, { opacity: descriptionOpacity }]}>
            {pages[activePageIndex].Text}
          </Animated.Text>
          <Animated.View style={{ opacity: paginationOpacity }}>
            <Pagination activePageIndex={activePageIndex} totalPages={totalPages} />
          </Animated.View>
          <View style={styles.page_button_container}>
            {activePageIndex === totalPages - 1 ? (
                <View style={{ paddingTop: 15 }}>
                  <Button
                      buttonText="Get started"
                      backgroundColor="#007BFF"
                      textColor='#FFFFFF'
                      onPress={async () => {
                        await AsyncStorage.setItem('seenIntro', 'true');
                        router.push('login');
                      }}
                  />
                </View>
            ) : (
                <View style={styles.button_container}>
                  <TouchableOpacity onPress={handleNextPress} style={styles.skipButton}>
                    <Text style={styles.skipButtonText}>skip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextPress} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>next</Text>
                  </TouchableOpacity>
                </View>
            )}
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  image: {
    width: '90%',
    height: Platform.OS === 'web' ? 380 : 400,
    resizeMode: 'contain',
  },
  onboard_content: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: Platform.OS === 'web' ? 0 : 40,
    width: '100%',
    paddingBottom: Platform.OS === 'web' ? 10 : 30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  heading: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    lineHeight: 36,
    color: '#000000',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 10 : 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#757575',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 10,
    fontFamily: 'Roboto_400Regular',
  },
  page_button_container: {
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'web' ? 0 : 25,
    width: '100%',
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#007BFF',
    width: '49%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#FF95AE',
    borderRadius: 10,
    width: '49%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    textTransform: 'capitalize',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Montserrat_700Bold',
  },
  skipButtonText: {
    textTransform: 'capitalize',
    color: '#FF95AE',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Montserrat_700Bold',
  }
});