import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Star from "../../assets/images/Star.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import Location from "../../assets/images/locate3.svg";
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import { router } from 'expo-router';

const parkingImages = [
  require('../../assets/images/parking1.png'),
  require('../../assets/images/parking2.png'),
  require('../../assets/images/parking3.png'),
  require('../../assets/images/parking4.png'),
  require('../../assets/images/parking5.png'),
];

const Booking = () => {
  const { theme, darkMode } = useContext(ThemeContext);
  const [activeHeading, setActiveHeading] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/booking/user-reservations/${userId}/`);
        const data = await res.json();
        if (data.success) {
          const imgMap = {};
          data.reservations.forEach(r => {
            imgMap[r._id] = parkingImages[Math.floor(Math.random() * parkingImages.length)];
          });
          setImageMap(imgMap);
          setReservations(data.reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const cancelReservation = async (reservationId) => {
    setLoadingId(reservationId);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/cancel/${reservationId}/`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(`http://127.0.0.1:8000/api/booking/user-reservations/${userId}/`);
        const newData = await res.json();
        if (newData.success) {
          const imgMap = {};
          newData.reservations.forEach(r => {
            imgMap[r._id] = parkingImages[Math.floor(Math.random() * parkingImages.length)];
          });
          setImageMap(imgMap);
          setReservations(newData.reservations);
        }
      } else {
        alert("Failed to cancel reservation: " + data.error);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("An error occurred while cancelling.");
    }
    setLoadingId(null);
  };

  const back = () => router.push('home');
  const receipt = (id) => {
    router.push({ pathname: '(screens)/receipt', params: { reservationId: id } });
  };
  const timer = (id) => {
    router.push({ pathname: '(screens)/timer', params: { reservationId: id } });
  };

  const formatDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.floor((e - s) / 60000);
    if (diff < 60) return `${diff} min`;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hrs} hour${hrs > 1 ? 's' : ''}${mins ? ` ${mins} min` : ''}`;
  };

  const filteredData = () => {
    if (activeHeading === 1) return reservations.filter(r => r.status === 'pending' || r.status === 'active');
    if (activeHeading === 2) return reservations.filter(r => r.status === 'completed');
    return reservations.filter(r => r.status === 'cancelled');
  };

  const renderSkeletons = () => {
    return [...Array(3)].map((_, i) => (
        <View key={i} style={[styles.main_stack, { backgroundColor: '#e0e0e0', height: 130, borderRadius: 10 }]} />
    ));
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back}>
            {darkMode ? <Dark_back /> : <Back />}
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.color }]}>My Booking</Text>
        </View>

        <View style={styles.heading_container}>
          {['Ongoing', 'Completed', 'Cancelled'].map((text, i) => (
              <TouchableOpacity
                  key={i + 1}
                  style={[styles.heading_box, activeHeading === i + 1 && styles.active_heading_box]}
                  onPress={() => setActiveHeading(i + 1)}
              >
                <Text style={[styles.head_text, activeHeading === i + 1 && styles.active_head_text]}>
                  {text}
                </Text>
              </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stack_container}>
            {isLoading ? renderSkeletons() : filteredData().map(res => (
                <TouchableOpacity key={res._id} style={[styles.main_stack, { backgroundColor: theme.cardbg }]}>
                  <View style={styles.stack}>
                    <Image source={imageMap[res._id]} style={styles.stack_img} />
                    <View style={styles.stack_body}>
                      <View style={styles.stack_body_row}>
                        <Text style={styles.parking}>Car Parking</Text>
                        <View style={styles.rating_row}>
                          <Star />
                          <Text style={styles.rating}>4.9</Text>
                        </View>
                      </View>
                      <Text style={[styles.name, { color: theme.color }]}>{res.parkingLot.nom}</Text>
                      <Text style={styles.price}>$5.00 <Text style={styles.time}>/hr</Text></Text>
                      <View style={styles.location_row}>
                        <Location />
                        <Text style={styles.time}>
                          {res.parkingLot.localisation.ville}, {res.parkingLot.localisation.pays}
                        </Text>
                      </View>
                      <View style={styles.timing_car2}>
                        <View style={styles.timing_row}>
                          <Clock />
                          <Text style={styles.time}>{formatDuration(res.dateDebut, res.dateFin)}</Text>
                        </View>
                        <View style={styles.car_row}>
                          <Car />
                          <Text style={styles.time}>{res.parkingLot.placeDisponibles} Spots</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.button_container}>
                    {res.status === 'active' && (
                        <>
                          <Button buttonText="Timer" onPress={() => timer(res._id)} borderColor="#FF95AE" textColor="#FF95AE" backgroundColor="transparent" minWidth="47%" />
                          <Button buttonText="E-Ticket" onPress={() => receipt(res._id)} minWidth="47%" />
                        </>
                    )}
                    {res.status === 'pending' && (
                        <>
                          <Button buttonText={loadingId === res._id ? "Cancelling..." : "Cancel"} onPress={() => cancelReservation(res._id)} disabled={loadingId === res._id} borderColor="#FF95AE" textColor="#FF95AE" backgroundColor="transparent" minWidth="47%" />
                          <Button buttonText="E-Ticket" onPress={() => receipt(res._id)} minWidth="47%" />
                        </>
                    )}
                    {res.status === 'completed' && (
                        <>
                          <Button buttonText="Re-Book" borderColor="#FF95AE" textColor="#FF95AE" backgroundColor="transparent" minWidth="47%" />
                          <Button buttonText="E-Ticket" onPress={() => receipt(res._id)} minWidth="47%" />
                        </>
                    )}
                    {res.status === 'cancelled' && (
                        <Button buttonText="Re-Book" minWidth="100%" />
                    )}
                  </View>
                </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
  },
  heading_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  heading_box: {
    borderBottomWidth: 2,
    borderBottomColor: '#474747',
  },
  active_heading_box: {
    borderBottomWidth: 4,
    borderBottomColor: '#007BFF',
    borderRadius: 4,
  },
  head_text: {
    fontSize: 14,
    lineHeight: 24,
    color: '#474747',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  active_head_text: {
    color: '#007BFF',
  },
  stack_container: {
    gap: 15,
    paddingBottom: 150,
  },
  main_stack: {
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
  },
  stack: {
    padding: 12,
    flexDirection: 'row',
  },
  stack_img: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  stack_body: {
    paddingLeft: 10,
    gap: 5,
    flex: 1,
  },
  stack_body_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating_row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    fontFamily: 'Roboto_400Regular',
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  rating: {
    marginLeft: 5,
    fontSize: 12,
  },
  parking: {
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    color: '#007BFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
  },
  price: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FF95AE',
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  location_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timing_car2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timing_row: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Roboto_400Regular',
    gap: 10,
  },
  car_row: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Roboto_400Regular',
    gap: 10,
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 5,
  },
});