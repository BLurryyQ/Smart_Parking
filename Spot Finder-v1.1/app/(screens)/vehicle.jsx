import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Add from "../../assets/images/add.svg";
import CheckCircle from "../../components/CheckCircle/CheckCircle";
import Button from '../../components/Button/Button';
import { useLocalSearchParams, router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import VehicleSkeleton from '../../components/Skeleton/VehicleSkeleton';

import Car1 from "../../assets/images/car1.svg";
import Car2 from "../../assets/images/car2.svg";
import Car3 from "../../assets/images/car3.svg";
import Car4 from "../../assets/images/car4.svg";
import Car5 from "../../assets/images/car5.svg";
import Car6 from "../../assets/images/car6.svg";

const carIcons = [<Car1 />, <Car2 />, <Car3 />, <Car4 />, <Car5 />, <Car6 />];

const Vehicle = () => {
  const { theme, darkMode } = useContext(ThemeContext);
  const { parkingLotId, startTime, endTime } = useLocalSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [checkedStates, setCheckedStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [iconMap, setIconMap] = useState({});

  const handlePress1 = (index) => {
    const newCheckedStates = Array(vehicles.length).fill(false);
    newCheckedStates[index] = true;
    setCheckedStates(newCheckedStates);
  };

  const slot = () => {
    const selectedIndex = checkedStates.findIndex(v => v === true);
    if (selectedIndex === -1) {
      alert("Please select a vehicle.");
      return;
    }

    const selectedVehicleId = vehicles[selectedIndex]._id;

    router.push({
      pathname: '(screens)/parkingSlot',
      params: {
        userId,
        vehicleId: selectedVehicleId,
        parkingLotId,
        startTime,
        endTime
      }
    });
  };

  const back = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push('(screens)/bookSlot');
    }
  };

  const fetchVehicles = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        alert("User not logged in.");
        return;
      }

      setUserId(storedUserId);
      const response = await fetch(`http://127.0.0.1:8000/api/vehicles/user/${storedUserId}/`);
      const json = await response.json();

      if (response.ok) {
        setVehicles(json);
        setCheckedStates(Array(json.length).fill(false));

        // Shuffle and assign icons without immediate repetition
        const shuffled = [...carIcons].sort(() => Math.random() - 0.5);
        const icons = {};
        json.forEach((v, i) => {
          icons[v._id] = shuffled[i % carIcons.length];
        });
        setIconMap(icons);
      } else {
        console.log(json.message || "Failed to fetch vehicles");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
      React.useCallback(() => {
        fetchVehicles();
      }, [])
  );

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <View style={styles.header_left}>
            <TouchableOpacity onPress={back}>
              {darkMode ? <Dark_back /> : <Back />}
            </TouchableOpacity>
            <Text style={[styles.heading, { color: theme.color }]}>Select Vehicle</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('(screens)/addVehicle')}>
            <Add />
          </TouchableOpacity>
        </View>

        {loading ? (
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
              {[...Array(4)].map((_, i) => (
                  <VehicleSkeleton key={i} />
              ))}
            </ScrollView>
        ) : (
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.column}>
                <View style={styles.stack_container}>
                  {vehicles.map((d, index) => (
                      <TouchableOpacity
                          style={[styles.stack, { backgroundColor: theme.cardbg }]}
                          key={d._id}
                          onPress={() => handlePress1(index)}
                      >
                        <View style={styles.imageContainer}>
                          {iconMap[d._id]}
                        </View>
                        <View style={styles.stack_content}>
                          <View style={styles.stack_content_left}>
                            <Text style={[styles.company, { color: theme.color }]}>
                              {d.brand} {d.model}
                            </Text>
                            <Text style={styles.modal}>
                              {d.type} <Text style={[styles.modal_no, { color: theme.color }]}> . {d.plateNumber}</Text>
                            </Text>
                          </View>
                          <CheckCircle
                              size={24}
                              color="#007BFF"
                              checked={checkedStates[index]}
                              onPress={() => handlePress1(index)}
                          />
                        </View>
                      </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.button_box}>
                  <Button buttonText="Continue" onPress={slot} />
                </View>
              </View>
            </ScrollView>
        )}
      </View>
  );
};

export default Vehicle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:Platform.OS === 'web'? 20 : 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header_left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
    flexGrow: 1,
  },
  column: {
    flex:1,
    justifyContent: 'space-between',
  },
  stack_container: {
    marginTop: 20,
    width: '100%',
  },
  stack: {
    marginBottom: 20,
    padding: 10,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 1,
    borderLeftColor: '#BABABA',
    width: '84%',
  },
  stack_content_left: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  company: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
  },
  modal: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
    color: '#757575',
  },
  modal_no: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
  },
  button_box: {
    marginBottom: '10%',
  }
});