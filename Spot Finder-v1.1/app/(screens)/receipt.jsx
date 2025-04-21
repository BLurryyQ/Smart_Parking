import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Back from '../../assets/images/Back.svg';
import Dark_back from "../../assets/images/White_back.svg";
import Scan from "../../assets/images/scan_code.png";
import Dark_scan from "../../assets/images/dark_scan.png";
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Receipt = () => {
  const { theme, darkMode } = useContext(ThemeContext);
  const { reservationId } = useLocalSearchParams();
  const [reservation, setReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const back = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push('booking');
    }
  };

  useEffect(() => {
    const checkLoginAndFetchReservation = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        router.replace('login');
        return;
      }
      setIsAuthenticated(true);

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/eticket/${reservationId}/`);
        const data = await res.json();
        setReservation(data);
      } catch (err) {
        console.error("Error loading reservation:", err);
      }
    };

    if (reservationId) checkLoginAndFetchReservation();
  }, [reservationId]);

  const formatTime = (iso) => {
    const date = new Date(new Date(iso).getTime() + 3600000); // +1 hour
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated || !reservation) {
    return <Text style={{ marginTop: 50, textAlign: 'center', color: theme.color }}>Loading...</Text>;
  }

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back}>
            {darkMode ? <Dark_back /> : <Back />}
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.color }]}>E-Receipt</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.column}>
            <View style={[styles.receipt, { backgroundColor: theme.cardbg }]}>
              <Text style={[styles.title, { color: theme.color }]}>Your Booking</Text>

              <View style={styles.review_container}>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Car</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {reservation.vehicle?.brand} {reservation.vehicle?.model} ({reservation.vehicle?.type})
                  </Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Car Number</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {reservation.vehicle?.plateNumber}
                  </Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Parking</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {reservation.parkingLot?.nom}
                  </Text>
                </View>
              </View>

              <View style={styles.hr}></View>

              <View style={styles.review_container}>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Arriving Time</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {formatTime(reservation.dateDebut)}
                  </Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Exit Time</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {formatTime(reservation.dateFin)}
                  </Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Slot</Text>
                  <Text style={[styles.value, { color: theme.color }]}>
                    {reservation.space?.numero} ({reservation.space?.type})
                  </Text>
                </View>
              </View>

              <View style={styles.hr}></View>

              <Text style={[styles.title, { color: theme.color }]}>Price Details</Text>
              <View style={styles.review_container}>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Price</Text>
                  <Text style={[styles.value, { color: theme.color }]}>$5.00</Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.text, { color: theme.color }]}>Fees</Text>
                  <Text style={[styles.value, { color: theme.color }]}>$1.00</Text>
                </View>
                <View style={styles.review_row}>
                  <Text style={[styles.value, { color: theme.color }]}>Total Price</Text>
                  <Text style={[styles.value, { color: theme.color }]}>$6.00</Text>
                </View>
              </View>

              <View style={styles.image_box}>
                <Image source={darkMode ? Dark_scan : Scan} style={styles.scan} />
              </View>
            </View>

            <View style={styles.button_box}>
              <Button buttonText="E-Ticket" onPress={back} />
            </View>
          </View>
        </ScrollView>
      </View>
  );
};

export default Receipt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
    marginLeft: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  receipt: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Montserrat_700Bold',
  },
  review_container: {
    marginVertical: 16,
    gap: 16,
  },
  review_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_500Medium',
    color: '#757575',
  },
  value: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_700Bold',
    color: '#121212',
  },
  hr: {
    borderBottomColor: '#BABABA',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  scan: {
    width: 280,
    height: 85,
  },
  image_box: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  button_box: {
    alignItems: 'center',
    marginBottom: '10%',
    marginTop: 30,
  },
});