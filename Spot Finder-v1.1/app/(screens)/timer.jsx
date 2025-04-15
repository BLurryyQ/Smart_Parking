import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Car from "../../assets/images/car7.png";
import Donut from '../../components/Donut/Donut';
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';

const Timer = () => {
  const { reservationId } = useLocalSearchParams();
  const { theme, darkMode } = useContext(ThemeContext);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginAndFetch = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        router.replace('login');
        return;
      }
      setIsAuthenticated(true);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/reservations/${reservationId}/`);
        const data = await response.json();
        setReservation(data);
      } catch (err) {
        console.error("Failed to fetch reservation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) checkLoginAndFetch();
  }, [reservationId]);

  useEffect(() => {
    if (!reservation) return;

    const endTime = new Date(reservation.dateFin).getTime();
    const startTime = new Date(reservation.dateDebut).getTime();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const secondsLeft = Math.max(Math.floor((endTime - now) / 1000), 0);
      const currentProgress = (secondsLeft / totalSeconds) * 100;

      setRemainingSeconds(secondsLeft);
      setProgress(currentProgress);

      if (secondsLeft <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const secsLeft = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secsLeft.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();
  const formatHour = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const back = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push('booking');
    }
  };

  const extend = () => router.push('(screens)/extendParking');

  if (!isAuthenticated || loading) {
    return (
        <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
    );
  }

  if (!reservation) {
    return (
        <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: theme.color }}>Reservation not found</Text>
        </View>
    );
  }

  const { parkingLot, space, vehicle, dateDebut, dateFin } = reservation;

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back}>
            {darkMode ? <Dark_back /> : <Back />}
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.color }]}>Parking Timer</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
          <View>
            <View style={styles.top_container}>
              <View style={styles.donutContainer}>
                <Donut progress={progress} radius={60} strokeWidth={10} color="#007BFF" />
                <Image source={Car} alt='image' style={styles.car} />
              </View>
              <View style={styles.timer_container}>
                <Text style={[styles.number, { color: theme.color }]}>{formatTime(remainingSeconds)}</Text>
              </View>
              <Text style={styles.text}>Remaining Parking Time</Text>
              <View style={styles.hr}></View>
            </View>

            <View style={styles.time_data_container}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.text}>Parking</Text>
                  <Text style={[styles.value, { color: theme.color }]}>{parkingLot.nom}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text2}>Vehicle Number Plate</Text>
                  <Text style={[styles.value2, { color: theme.color }]}>{vehicle?.plateNumber}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.text}>Location</Text>
                  <Text style={[styles.value, { color: theme.color }]}>{parkingLot.localisation?.ville}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text2}>Parking Slot</Text>
                  <Text style={[styles.value2, { color: theme.color }]}>{space?.numero}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.text}>Arrive Time</Text>
                  <Text style={[styles.value, { color: theme.color }]}>{formatHour(dateDebut)}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text2}>Exit Time</Text>
                  <Text style={[styles.value2, { color: theme.color }]}>{formatHour(dateFin)}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.text}>Date</Text>
                  <Text style={[styles.value, { color: theme.color }]}>{formatDate(dateDebut)}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.text2}>Total Payment</Text>
                  <Text style={[styles.value2, { color: theme.color }]}>$64.00</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.button_box}>
          <Button buttonText="Extend Parking Time" onPress={extend} />
        </View>
      </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
    textTransform: 'capitalize',
  },
  scrolls: {
    flexGrow: 1,
  },
  top_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    position: 'relative',
    borderBottomColor: '#BABABA',
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    marginVertical: 16,
    paddingBottom: 20,
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  car: {
    width: 46,
    height: 100,
    position: 'absolute',
  },
  timer_container: {
    marginTop: 20,
    alignItems: 'center',
  },
  number: {
    fontSize: 30,
    lineHeight: 40,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Roboto_400Regular',
    color: '#757575',
    textTransform: 'capitalize',
  },
  time_data_container: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    gap: 15,
    width: '42%',
  },
  value: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_700Bold',
    color: '#121212',
    textTransform: 'capitalize',
  },
  text2: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
    color: '#757575',
    textTransform: 'capitalize',
  },
  value2: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_700Bold',
    color: '#121212',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  button_box: {
    marginBottom: Platform.OS === 'web' ? 10 : '10%',
    marginTop: Platform.OS === 'web' ? 10 : null,
  },
});