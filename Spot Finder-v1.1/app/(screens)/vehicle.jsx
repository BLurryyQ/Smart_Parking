import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Add from "../../assets/images/add.svg";
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { vehicle_data } from '../../Data/Data';
import CheckCircle from "../../components/CheckCircle/CheckCircle";
import Button from '../../components/Button/Button';
import { router, Link } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';

const Vehicle = () => {
  const { theme, darkMode } = useContext(ThemeContext);
  const [checkedStates, setCheckedStates] = useState(Array(vehicle_data.length).fill(false));

  const handlePress1 = (index) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = !newCheckedStates[index];
    setCheckedStates(newCheckedStates);
  };
  const slot = () => {
    router.push('(screens)/parkingSlot');
  };

  const back = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push('(screens)/bookSlot');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <View style={styles.header}>
        <View style={styles.header_left}>
        <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
          <Text style={[styles.heading, {color:theme.color}]}>Select Vehicle</Text>
        </View>
        <Add />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.column}>
        <View style={styles.stack_container}>
          {vehicle_data.map((d, index) => (
            <TouchableOpacity style={[styles.stack, {backgroundColor:theme.cardbg}]} key={d.id} onPress={() => handlePress1(index)}>
              <View style={styles.imageContainer}>
              {d.image}
              </View>
              <View style={styles.stack_content}>
                <View style={styles.stack_content_left}>
                  <Text style={[styles.company, {color:theme.color}]}>{d.company}</Text>
                  <Text style={styles.modal}>{d.modal}<Text style={[styles.modal_no, {color:theme.color}]}> . {d.modalno}</Text></Text>
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
        <Button buttonText="continue" onPress={slot} />
        </View>
        </View>
      </ScrollView>
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
