import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import { router } from "expo-router";
import Search from "../../assets/images/search.svg";
import Locate from "../../assets/images/Locate.svg";
import ThemeContext from '../../theme/ThemeContext';

const Manual = () => {
  const { theme, darkMode, toggleTheme } = useContext(ThemeContext);

  const back = () => {
    router.push('location');
  };

  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      <View style={styles.header}>
      <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
        <Text style={[styles.heading, {color:theme.color}]}>Enter Your Location</Text>
      </View>
      <View style={styles.input_container}>
        <View style={styles.search}>
          <Search  />
          </View>
        <TextInput style={[styles.input, {backgroundColor:theme.cardbg, color:theme.color}]} placeholderTextColor={darkMode ? "#f6f6f6" : "#505050"}  placeholder='Search' />
      </View>
      <View style={styles.current_row}>
        <Locate />
        <Text style={[styles.current_location, {color:theme.color}]}>Use my current Location</Text>
      </View>
      <Text style={styles.result}>Search Result</Text>
      <View style={styles.row}>
        <Locate />
        <Text style={[styles.location_head, {color:theme.color}]}>Golden Avenue</Text>
        
      </View>
      <Text style= {styles.location}>5484 preston Rd. Ingl..</Text>
    </View>
  )
}

export default Manual;

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    heading: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    input_container: {
        marginVertical: 25,
      },
      input: {
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
        paddingVertical: 16,
        paddingHorizontal: 40,
        position: 'relative',
      },
      search: {
        position: 'absolute',
        zIndex: 100,
        bottom: 18,
        left: 10,
      },
      current_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#BABABA',
      },
      current_location: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
      },
      result: {
        fontSize: 18,
        lineHeight: 28, 
        fontFamily: 'Montserrat_700Bold',
        color: '#757575',
        textTransform: 'capitalize',
        paddingVertical: 16,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      },
      location_head: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_500Medium',
        color: '#121212',
      },
      location: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        paddingVertical: 7,
      }
})