import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Button from '../../components/Button/Button';
import { router, Link } from "expo-router";
import { review_data, review_data2 } from '../../Data/Data';
import Star from "../../assets/images/Star.svg";
import Parking1 from "../../assets/images/parking1.png";
import Location from "../../assets/images/black_location.svg";
import ThemeContext from '../../theme/ThemeContext';
import Dark_Locate from "../../assets/images/dark_locate2.svg";

const Review = () => {
  const { theme, darkMode } = useContext(ThemeContext);
    const pay = () => {
      router.push('(screens)/payment');
    };   
    const back = () => {
      router.push('(screens)/parkingSlot');
    };
  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
        <View style={styles.header}>
        <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
            <Text style={[styles.heading, {color:theme.color}]}>Review Summary</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.stack, {backgroundColor:theme.cardbg}]} >
              <Image source={Parking1} style={styles.stack_img} alt='image' />
              <View style={styles.stack_body}>
                <View style={styles.stack_body_row}>
                <Text style={styles.parking}>car parking</Text>
                <View style={styles.rating_row}>
                  <Star />
                  <Text style={styles.rating}>4.9</Text>
                </View>
                </View>
                <View style={styles.name_price2}>
                  <Text style={[styles.name, {color:theme.color}]}>ParkSecure</Text>
                  <Text style={styles.price}>$5.00<Text style={styles.time}>/1hr</Text></Text>
                </View>
                <View style={styles.row2}>
                {darkMode? <Dark_Locate /> :  <Location />}
                  <Text style={styles.location}>New York, USA</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={[styles.receipt, {backgroundColor:theme.cardbg}]}>
            <Text style={[styles.title, {color:theme.color}]}>your booking</Text>
            <View style={styles.review_container}>
              {
                review_data.map((d) => (
                  <View style={styles.review_row} key={d.id}>
                    <View style={styles.left_row}>
                      {d.icon}
                      <Text style={styles.text}>{d.text}</Text>
                    </View>
                    <Text style={[styles.value, {color:theme.color}]}>{d.value}</Text>
                  </View>
                ))
              }
            </View>
              <View style={styles.hr}></View>
            <Text style={[styles.title, {color:theme.color}]}>Price Details</Text>
            <View style={styles.review_container}>
              {
                review_data2.map((d) => (
                  <View style={styles.review_row} key={d.id}>
                    <View style={styles.left_row}>
                      <Text style={styles.text}>{d.text}</Text>
                    </View>
                    <Text style={[styles.value, {color:theme.color}]}>{d.value}</Text>
                  </View>
                ))
              }
            </View>
            <View style={styles.hr}></View>
             <View style={styles.review_row}>
              <Text style={[styles.value, {color:theme.color}]}>Total Price</Text>
              <Text style={[styles.value, {color:theme.color}]}>$64.50</Text>
             </View>
             </View>
             <View style={styles.button_box}>
             <Button buttonText="continue" onPress={pay} />
             </View>
             </ScrollView>
    </View>
  )
}

export default Review;


const styles = StyleSheet.create({
    container: {
        paddingTop:Platform.OS === 'web'? 20 : 50,
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
    stack: {
        backgroundColor: '#F6F6F6',
        borderRadius: 10, 
        padding: 12,
        flexDirection: 'row',
        marginVertical: 30,
      },
      stack_img: {
        width: 100,
        height: 100,
        borderRadius: 10,
      },
      stack_body: {
        paddingLeft: 10,
        gap: 5,
      },
      stack_body_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        width: '80%',
      },
      parking: {
        fontSize: 10,
        lineHeight: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#007BFF',
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxWidth: 85,
        marginVertical: 8,
    },
    name_price: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#BABABA',
    },
    name_price2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 6,
      width: '80%',
    },
    name: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: 'Montserrat_600SemiBold',
      color: '#121212',
    },
    price: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: 'Montserrat_600SemiBold',
      color: '#FF95AE',
    },
    time: {
      color: '#757575',
    },
    rating_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    rating: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    row2: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    location: {
      fontSize: 14,
      lineHeight: 24,
      fontFamily: 'Roboto_500Medium',
      color: '#757575',
    },
    title: {
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'Montserrat_700Bold',
      color: '#000000',
      textTransform: 'capitalize',
    },
    review_container: {
      marginTop: 16,
      gap: 16,
    },
    review_row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    left_row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    text: {
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'Roboto_500Medium',
      color: '#757575',
      textTransform: 'capitalize',
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
    button_box: {
      marginVertical: 25,
      paddingBottom: 40,
    },
    receipt: {
      borderRadius: 10,
      padding: 12,
      backgroundColor: '#F6F6F6',
    },
})