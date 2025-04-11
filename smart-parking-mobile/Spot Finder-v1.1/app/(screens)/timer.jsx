import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ScrollView} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Car from "../../assets/images/car7.png";
import Donut from '../../components/Donut/Donut';
import { timer_datas } from '../../Data/Data';
import Button from '../../components/Button/Button';
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';

const Timer = () => {
  const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };
  const extend = () => {
    router.push('(screens)/extendParking');
  };
  const back = () => {
    router.push('booking');
  };
  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <View style={styles.header}>
      <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
        <Text style={[styles.heading, {color:theme.color}]}>Parking Timer</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
        <View>
      <View style={styles.top_container}>
        <View style={styles.donutContainer}>
          <Donut progress={80} radius={60} strokeWidth={10} color="#007BFF" />
          <Image source={Car} alt='image' style={styles.car} />
        </View>
        <View style={styles.timer_container}>
          <Text style={[styles.number, {color:theme.color}]}>{formatTime(time)}</Text>
        </View>
        <Text style={styles.text}>Remaining Parking Time</Text>
        <View style={styles.hr}></View>
      </View>
      <View style={styles.time_data_container}>
        {
          timer_datas.map((d) => (
            <View style={styles.row} key={d.id}>
              <View style={styles.column}>
                <Text style={styles.text}>{d.text}</Text>
                <Text style={[styles.value, {color:theme.color}]}>{d.value}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.text2}>{d.text1}</Text>
                <Text style={[styles.value2, {color:theme.color}]}>{d.value2}</Text>
              </View>
            </View>
          ))
        }
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
    paddingTop:Platform.OS === 'web'? 20 :  50,
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
   
  },
  time_data_container: {
    
  },
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
  text: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
    color: '#757575',
    textTransform: 'capitalize',
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
    marginBottom:Platform.OS === 'web'? 10 : '10%',
    marginTop: Platform.OS === 'web'? 10 : null,
  }
});
